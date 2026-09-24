# Security model of the local workbench

TorchFDTD ships one HTTP server, `torchfdtd serve`, whose only purpose is to
drive the browser workbench on the machine that runs it. This document states
what that server protects against, what it does not, and how the Python API
treats files it reads. The checks are enforced by
[tests/test_server_security.py](../tests/test_server_security.py) and recorded
against gate task G9-01 in [validation/completion_gates.json](validation/completion_gates.json).
This is an engineering description, not a certification.

## Deployment model

- The server binds loopback only. `torchfdtd serve --host` accepts `127.0.0.1`
  and `localhost` and refuses every other value at argument parsing, including
  `0.0.0.0`, LAN addresses and `::1` (the host check below cannot match a
  bracketed IPv6 `Host` header, so IPv6 loopback is not offered).
- There is no authentication, no session and no user model. Anyone who can
  open a TCP connection to the loopback port can run simulations, read every
  result of the server session and write files under the results directory.
  On a shared machine that means every local account.
- Remote exposure is out of scope. Putting the port behind a reverse proxy, an
  SSH tunnel (`scripts/tunnel.py`, `scripts/start_remote.ps1`) or a container
  does not change the server's trust assumptions; a deployment that reaches
  other users needs its own authentication, authorization and transport
  security in front of it, and is not something this package provides or
  tests.

## What the server enforces

| Control | Where | Behaviour |
| --- | --- | --- |
| Host header | `TrustedHostMiddleware` in `torchfdtd/server.py` | Requests whose `Host` is not `localhost`, `127.0.0.1` or `[::1]` answer 400 before any route runs, so a DNS-rebinding page cannot reach the API through a name it controls. `TORCHFDTD_ALLOWED_HOSTS` (comma-separated) adds names; the test suite sets it to `testserver`, the `TestClient` default host, in `tests/conftest.py`, and no deployment sets it |
| Origin header | `local_origin` middleware | Any request carrying an `Origin` that differs from the server's own origin, including `null`, answers 403 on every route. A browser page on another site therefore cannot start jobs, upload files or read results through the victim's server |
| Body size | `local_origin` middleware | A declared `Content-Length` above `MAX_REQUEST_BYTES` (32 MB) answers 413; the FSP upload routes use `fsp.MAX_FSP_BYTES` (128 MiB). A body without a declared length (`Transfer-Encoding: chunked`) answers 411, because the limit could not be applied before a JSON route reads the whole body. A malformed `Content-Length` answers 400 |
| Upload streaming | `/api/gds/inspect`, `/api/fsp/import`, `/api/fsp/native-import` | Bodies are read in chunks and the request is refused at 413 as soon as the running total passes the route's limit |
| Stored paths | GDS and FSP services | Uploads are stored under `<results>/gds/<uuid>.gds` and `<results>/fsp/<uuid>/project.fsp`; `/api/gds/export` writes `<results>/gds/export-<uuid>.gds`, reads it back into the JSON response and removes it before answering. The `x-filename` header is a display name: the FSP route keeps only the last path component and requires `.fsp`, the GDS route echoes it back and never uses it for a path |
| Route parameters | every `{key}` route | Job, upload and design keys are looked up in server-session dictionaries; a key that is not a known uuid answers 404 and no path is built from it. `/api/examples/{name}` is an allowlist |
| Static files | `WorkbenchFiles` in `torchfdtd/server.py` | The bundled `torchfdtd/web` directory is served with Starlette's containment check plus a rejection of absolute paths, drive letters, UNC prefixes and `:` so that on Windows a request such as `/C:/...` or `//server/share/...` never reaches `os.path.join`, where it would replace the web directory and let `realpath` touch a drive root or a network share |
| Size limits | `ServerLimits` middleware and `ServerExecutor` in `torchfdtd/server.py`, `torchfdtd.models.server_limits` | Every request (body validation included), every task of the server's job pools and the modal worker process run inside `server_limits()`, which applies `SERVER_LIMITS` ([below](#size-limits-of-the-server)) whatever caps a submitted project carries. A request above a limit answers 422. A cap the project carries can lower a limit, never raise it, and the project is echoed unchanged |
| JSON bodies | pydantic models with `extra='forbid'` and `allow_inf_nan=False` | Unknown keys, wrong types, out-of-range values, `NaN`, `Infinity` and out-of-range literals answer 422; a body nested too deeply answers 400. The 422 body is rendered through a handler that never re-emits a nonfinite input, so the rejection itself cannot fail |
| Response headers | `local_origin` middleware | `X-Content-Type-Options: nosniff` on every response |
| Queues | job services | At most one running and two queued jobs per queue, and a bounded job table, so a loop of `POST /api/jobs` cannot exhaust memory |

### Size limits of the server

The Python API admits scenes by their memory estimate and has no fixed size
caps ([EXECUTION_MODES.md](EXECUTION_MODES.md#size-limits)). Each constraint
it lifted after 0.15.0 remains a request limit of the server. The limits are
checked on every route that takes a project or a part of one (validate, jobs,
mesh preview, freeze and coordinates, Python export, source preview, GDS and
FSP conversion and export, the mode-network requests with a nested project and
the scenes the design routes build) and again in the server's job threads and
modal worker:

| Python-API constraint lifted | Server limit | Where the server checks it |
| --- | --- | --- |
| 8,000,000 resident cells (`Region.require_resident`) | 8,000,000 cells | `Region.resident_refusal` at every resident entry point and in the Auto policy |
| `Project.structures` `max_length=1000` | 1000 structures | project validation, before the items are validated |
| `Project.sources` `max_length=512` | 512 sources | project validation, before the items |
| `Project.monitors` `max_length=512` | 512 monitors | project validation, before the items |
| `Project.materials` `max_length=100` | 100 materials | project validation, before the items |
| `Region.mesh_refinements` `max_length=64` | 64 refinement boxes | region validation, before the items |
| 12,000,000 complex samples per frequency plane (`monitor_memory`) | 12,000,000 samples | `estimate()`, called by `/api/validate`, `/api/jobs` and the mesh preview |
| `Region.steps` `le=100000` | 100,000 steps | region validation |
| `SpectrumSettings.frequency_points` `le=2001` and `custom_frequencies_hz` `max_length=2001` | 2001 frequencies | spectrum validation |
| `TimeSignal.time_s`, `amplitude`, `phase_rad` `max_length=100000` | 100,000 samples | signal validation, before the items |
| `GDSLimits.max_total_vertices` default 1,000,000 (now `None`) | 1,000,000 vertices | `gds_service.SERVER_GDS_LIMITS`, passed by `/api/gds/{key}/convert` |

The FSP analysis-group expansion keeps its import limit of 512 sources and
monitors on both sides. `tests/test_server_security.py::test_every_server_limit_refuses_an_oversized_request`
posts, for each limit, a project the Python API accepts to the project routes
and nested in a GDS export and a mode-network request, and expects 422;
`test_gds_uploads_keep_the_vertex_limit_the_python_api_lifts` converts an
upload of 1.04 million vertices. `tests/test_resident_guards.py` checks that the
job pools and the modal worker run under the limits.

## What the server does not do

- It does not authenticate. See the deployment model above.
- It does not sandbox the simulation. A project can legitimately ask for a
  large grid or a long run; the resource preflight (`/api/validate`) reports
  the cost and the grid validator caps an axis at one million cells, but a
  local user can still fill the GPU or the disk with a large valid job. Cancel
  is available; a kill is not automatic.
- It does not rate-limit loopback clients.
- It does not serve HTTPS. Loopback traffic does not leave the machine.
- `/api/health` reports the host name, GPU model and memory to loopback callers.

## Files the Python API reads

- **Project JSON** (`Project.load`, `/api/validate` and every route that takes
  a project) is data. Every field is a typed pydantic value, no field is
  evaluated, imported or used as a path, and `Project.python_script()` and
  `/api/python` emit text for the user to read; nothing executes it. A name
  containing Python or shell syntax is written back as a string literal.
- **NPZ results** (`Result.load`, `load_native_radiation_plane`,
  `load_native_radiation_box`, the streamed restart and staging readers) are
  opened with `allow_pickle=False` everywhere; an archive that would need
  pickle raises `ValueError` and never unpickles. `pickle.load` is not used on
  any file. The design checkpoint (`DesignCheckpoint`) and the `DesignProblem`
  state file are loaded without unpickling: `torch.load(...,
  weights_only=True)` restores tensors and plain containers only, and a file
  that holds any other pickled object raises `ValueError` before anything in
  it runs. The radiation-box loader checks
  every NPY header against a bounded size and against the ZIP entry size
  before allocating, so a small archive that declares a huge array is refused
  as a header error. `Result.load` relies on numpy: an absurd declared shape
  fails at allocation (`MemoryError`) without reading the payload, and a
  plausible but large declared shape allocates what it declares. Load result
  archives from your own runs; the server never loads an uploaded NPZ.
- **GDS uploads** are audited record by record (unknown or truncated records,
  unsupported transform flags and data after `ENDLIB` are refused) before the
  optional gdstk parser sees the bytes, and conversion applies the admission
  limits of `GDSLimits` (file bytes, expanded instances, vertices, hierarchy
  depth, coordinate span) before any hierarchy is flattened, so an array
  reference that would expand to millions of polygons is refused at 422.
- **FSP uploads** are checked for the vendor header and size, then decoded by
  the independent native reader (`fsp_binary.py`), which parses fixed layouts
  and never executes anything. The optional bridge routes (`/api/fsp/import`,
  `/api/fsp/{key}/export`) call an installed vendor API only when the user has
  installed it on the same machine; they are not reachable otherwise.

## Reporting

Report a security problem privately to the repository owner (GitHub private
vulnerability reporting on hyoseokp/TorchFDTD where the owner has enabled it,
otherwise a direct message) rather than in a public issue, with the request or
file that triggers it and the server version from `/api/health`. Bugs that are not security problems follow
[.github/ISSUE_TEMPLATE/bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md).
