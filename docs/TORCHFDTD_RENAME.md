# TorchFDTD naming and migration

The project and private repository are now **TorchFDTD**:
https://github.com/hyoseokp/TorchFDTD

The canonical Python import, distribution and command use lowercase:

```powershell
python -m pip install -e ".[dev,cuda-kernels]"
python -m torchfdtd.cli serve
```

```python
from torchfdtd import Project, Simulation, DifferentiableSimulation
```

Update earlier `from photonweave ...` statements to `from torchfdtd ...`.
This development rename does not ship a second copy of the solver under the
old Python namespace. The JSON project schema and tensor/checkpoint contents
have not been renamed. Existing browser projects and periodic-design setups
are copied into the new storage namespace on first load, without overwriting
a saved TorchFDTD setup or deleting the old browser entries.

Environment variables now use `TORCHFDTD_`. The server result directory and
SSH helper and optional bridge also accept the old `PHOTONWEAVE_RESULTS`,
`PHOTONWEAVE_SSH_PASSWORD` and `PHOTONWEAVE_LUMAPI` names during migration.
The version-1 FSP inspection format identifier remains unchanged for readers.

Verification includes a clean wheel installation, CLI and web-asset loading,
API/geometry checks, and browser restoration of a saved project and inverse
design setup. When rebuilding in an existing checkout, move or remove the old
`build/` output first so setuptools cannot include stale package modules.

Committed historical numerical records in `docs/validation` retain the exact
original bytes, names and source hashes. They are evidence for their recorded
revision, not measurements rerun with the new name. Live frozen GPU jobs retain
their current directories and interpreter paths until they finish. Renaming
does not authorize discarding results, restarting scientific jobs, making the
repository public or posting promotional messages.

For an active Windows workspace, a `TorchFDTD` directory junction can expose
the canonical name while running processes hold the previous physical folder
open. The physical folder move must wait until those locks are released.
This compatibility path does not require restarting scientific jobs.
