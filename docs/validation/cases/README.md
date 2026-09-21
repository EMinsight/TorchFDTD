# Pre-declared acceptance cases

A case file fixes the inputs, the reference method and the acceptance limits of
one verification **before** the run that will be judged against it. Evidence
recorded by `scripts/record_gate_evidence.py --fixture <case>` stores the file's
SHA-256, and `scripts/check_release_gates.py` refuses evidence whose case file
has changed since the run. Editing a case after the run therefore invalidates
that evidence; a scientific correction to a limit is a new case file, with the
old file and its failing evidence preserved, as
[COMPLETION_PROGRAM_KO.md](../../COMPLETION_PROGRAM_KO.md) section 1 rule 7 requires.

## File format

One JSON object per case, `docs/validation/cases/<task>_<slug>.json`:

| Field | Meaning |
| --- | --- |
| `schema_version`, `kind` | `1` and `"acceptance_case"` |
| `case_id`, `task`, `title` | The case name, the gate task it serves and a one-line title |
| `declared`, `declared_at_commit`, `declared_before_run` | When and at which commit the limits were fixed; `declared_before_run` must be `true` |
| `fixture` | The physics configuration: geometry, mesh, dt and steps, sources, monitors, PML depth, amplitudes, areas, dtypes, devices. Copied into the evidence as `physics_configuration` |
| `seed`, `precision`, `backend` | Copied into the evidence fields of the same names |
| `reference_method` | The independent oracle: analytic solution, TMM, Mie, independent solver, full autograd, finite differences. Copied into the evidence |
| `observables` | Each measured quantity with its unit and definition. Copied into the evidence |
| `acceptance` | The limits and policies, with the gate-file threshold they come from. Copied into the evidence as `acceptance_limits` |
| `tests` | `existing` test ids that implement the case and `not_yet_covered` items the specification still requires |
| `notes` | Free text, including which fix commit the case follows |

The recorder copies the values above verbatim; it does not evaluate them. When a
separate criteria file is preferred, pass it with `--criteria`; otherwise the
`acceptance` block of the fixture is the criteria and both hashes refer to the
same file. Observed values go in a separate JSON passed with `--observed`, so
the declared limits and the measurements never share a file.

Example: [G1-03_quadrant_allocation_scaling.json](G1-03_quadrant_allocation_scaling.json).

## Rules

- Limits come from `proposed_thresholds` in `completion_gates.json` unless the
  case explains a fixture-specific budget declared before the run.
- A case may list `not_yet_covered` items. Evidence against such a case verifies
  the covered tests only; the task is not complete against the specification
  until those items have tests and evidence.
- Physical size, simulation time, source, monitor placement and PML thickness
  are fixed per case so that mesh refinement changes one thing at a time.
- Cases never contain vendor solver outputs or private research data.
