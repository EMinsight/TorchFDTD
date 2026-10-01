# TorchFDTD 1.1.4 validation scope

## Candidate and artifact

Source commit: `543421bbe6447be06dbff6e9073f1c9572904db9`.

Wheel: `torchfdtd-1.1.4-py3-none-any.whl`.

SHA-256: `e86a373ab75a2fbe95f8021c06b84d337098822988134718c8510bab73eb79d2`.

The [clean-install record](validation/clean_install/20261001T192100Z-543421bb.json)
passed CPU/CUDA execution, save/load, bundled server/API, doctor and README
examples. Installed source bytes were compared with the wheel payload.
The same wheel was used for the checks below and is retained for publication.

## Checks performed

The [installed-wheel run](validation/multicell_launches/installed-result.json)
passed **332 tests**, with zero failures, errors or skips.
Tests imported the installed package from an outside working directory.

- Counts 1/2/4 at blocks 128/256/512/1024, partial tails and early exits.
- Per-step fields and CPML states, scalar/diagonal materials and Bloch seams.
- Device, synchronous CPU and asynchronous CPU histories and retained VJPs.
- Joint tuning, bounded scratch admission, cache identity and reported choices.
- Public constructors, signed component-offset guards, FP32/FP64, PMC/Bloch
  CUDA graph replay and compilation fallback after fixed/automatic/cached tuning.
- Existing recorded forward/reconstruction, plane spectra, automatic trace
  placement, real/complex CUDA forward and field-adjoint regressions.

The [four tile measurements](REVERSIBLE_CPML.md#multiple-entries-per-cuda-thread)
used 200 x 200 x 125 cells, 256 steps and five alternating warmed repetitions
per mode on an RTX 3060. All spectra/VJPs were bit-identical and measured memory
stayed within admission. Source hashes identify the measured implementation.
The supplied H200 results describe a separate prototype and retain their own
input and implementation hashes. No new H200 run was performed.

## Checks not repeated

This candidate uses the owner's changed-code fast-track scope. **A full RC was
not run.** The remaining full WORKSTATION gate replay, release-full suite and
unchanged application/physics benchmark workflows were not repeated.
RTX 5880 and multi-GPU acceptance were not performed. Earlier application
evidence remains tied to its recorded source and hardware.

The final candidate commit requires a passing GitHub Verify run before tag or
Release publication. The requested document reserves publication for owner
approval after the candidate is prepared.
