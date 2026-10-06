# 1.1.7 patch validation scope

The owner approved changed-code validation and publication for reversible
isotropic Lorentz density mixtures. This patch does not claim a new full RC,
WORKSTATION, RTX 5880 or multi-GPU pass. The historical completion-program
judgements in `VALIDATION_REPORT.md` remain historical gate judgements.

## Completed local checks

- CPU feature checks: 44 passed, including the local ADE transpose, finite
  differences, one/two poles, density limits, per-z backgrounds, fitting,
  memory admission and a 1 um / 256-step retained-VJP fixture.
- Exact 1.1.7 installed wheel on RTX 3060: 16 CUDA feature checks passed,
  without skips. CPML/periodic, planes, packed poles, synchronous/asynchronous
  host traces, terminal offload, retained VJPs and launch mappings are covered.
- Related CPU checks: 198 passed. Related CUDA checks: 11 passed. Capability
  checks: 12 CPU passed with 17 unavailable-CUDA skips, followed by 26 passed
  with CUDA required. Skipped checks are not counted as passes.
- Pinned prototype comparison: on a 20x20x40 grid, 1 um tile, 256 steps,
  two poles, two density layers and nine frequencies, `torch.equal` held at
  every step for forward/reverse E/H/P/Q, halo frames, pole cotangents,
  density gradients and online spectra. This is implementation agreement,
  not a spatial-convergence result or a speedup claim.
- Nondispersive real/Bloch fields with device/asynchronous host histories:
  spectra and material VJPs were bit-identical to source `54082fc`.
- Version-specific standard clean installation: all 15 steps passed from
  committed source `75a1328`, with 159 wheel package files byte-matched.
  Wheel SHA-256:
  `e171aeec5a90eeaa2da2c9f04460f81ca3b9df2a9ec49470ee76b04be0602b5b`.
- Installation/report/compatibility checks: 23 passed. The report renderer
  must also pass `--check` on the final committed tree.

Completed checks are reused only for byte-identical numerical modules and
unchanged inputs. Version strings, installed package paths and artifact
identity receive the new-version checks above. No old wheel is renamed.

## Large regression and publication requirements

Before publication, the formal installed wheel must reproduce the supplied
d50 `theta_0720` Jones references at nine and 151 wavelengths. The declared
Jones relative L2 bound is `5e-5`. The information evaluation must use the
original archived discrete 4x4-photosite engine that produced the reported
`I_tar = 2.40452`, with an absolute bound of `3e-5`. The newer sinc-photosite
engine defines a different evaluation model and cannot replace this reference.

The actual input/driver/engine/wheel hashes, conditions, measured times,
accuracy and memory are retained with the release evidence. One repetition
checks this fixed regression. It does not establish a general throughput
distribution. The model's 420–670 nm fit does not establish physical accuracy
outside its fitted band, even when implementation agreement is checked on
the supplied 400–700 nm broadband data.

Require a successful Verify run on main at the exact final commit before
tagging. The deployed wheel payload must match that commit. Publish the
verified wheel and final examples ZIP, then verify GitHub digests, fresh
download SHA-256 values and the peeled remote tag. The approval for this
release does not authorize moving the existing v1.1.6 tag.
