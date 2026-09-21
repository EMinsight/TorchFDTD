---
name: Bug report
about: A wrong result, a crash or a rejected configuration that the documentation says is supported
title: ''
labels: bug
assignees: ''
---

<!-- Security problems go to private vulnerability reporting, not here (docs/SECURITY.md). -->

## Platform report

Paste the output of both commands, unedited:

```
torchfdtd hardware
python -c "import torchfdtd, torch, numpy; print(torchfdtd.__file__, torch.__version__, numpy.__version__)"
```

If the workbench is involved, also paste the JSON of `http://127.0.0.1:8765/api/health`.
State the package version (`pip show torchfdtd`), the operating system and, for CUDA,
the driver version and whether `cupy-cuda12x` is installed.

## Minimal reproduction

The smallest input that shows the problem, as one of:

- a project JSON saved by `Project.save` or by the workbench (attach the file), plus the
  exact command or route that was run, or
- a Python script of at most a few dozen lines that uses only the public API listed in
  `docs/COMPATIBILITY.md` and runs on the CPU backend if at all possible.

Say how long the reproduction takes and what backend, precision and mesh it uses.
Reduce the grid, the steps and the number of objects until the problem is still visible.

## Expected and observed

- Expected value or behaviour, with the reference it comes from (analytic solution,
  another solver, an earlier TorchFDTD version, the documentation).
- Observed value or behaviour, copied from the output, with the traceback if any.
- The difference in absolute and relative terms, and the tolerance you consider acceptable.

## Proposed severity

Pick one grade from the numerical bug severity table in `docs/COMPATIBILITY.md` and say
in one line why: S0 (wrong result or gradient inside the declared support), S1 (wrong
outside the declared support, or off by a constant factor), S2 (diagnostic, estimate or
warning wrong; late failure), S3 (cosmetic).

## Anything else

Earlier versions where it worked, related issues, workarounds you found.
