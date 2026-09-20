# Bounded CUDA observation transpose

Real fused adjoints previously generated one branch and one addition per
observation in the CUDA source. Large detector planes can expand to many
indexed Yee samples even when the final plane output is small. Two planes on
the 128-cubed integration fixture generate 75,600 internal observations. A
monolithic program of this size incurs substantial compiler work before the
backward can execute.

The real observation transpose now uses one fixed-size CUDA kernel per
precision. A packed int64 array supplies unique field locations, E/H family,
group offsets and observation positions. One thread owns each location and
adds duplicate seeds in original observation order, starting from the existing
field adjoint. No atomic addition or reassociation of duplicate sums is used.
The time/monitor address calculation uses int64. Existing conservative
admission bounds remain in force.

The packed device map needs at most `32 * observation_count + 8` bytes.
Resident admission counts it alongside the existing gather indices. Streamed
admission counts device index maps for every active tile slot, plus map staging
and a host construction allowance. The host allowance for Python groups is an
engineering estimate, not a process-RSS bound. Asynchronous slots use their
existing transfer events and keep the packet alive until its consumer finishes.
The complex transpose retains its existing indexed Torch path.

## Verification

FP32 and FP64 tests use 7 and 75,600 observations, repeated E/H locations and
different seed values. They match ordered scalar accumulation exactly and
verify that CUDA source size remains below 1,500 characters independent of
observation count. Both ordinary and asynchronous tile workspace paths are
covered. The related regression group passed 168 tests across real/complex,
resident/streamed, ADE, detector planes, batches and memory admission.

```console
python -m benchmarks.dense_adjoint_observers --size 128 --steps 32 --output results/dense-plane.json
```

The [RTX 3060 integration record](validation/dense-adjoint-observers-128-3060.json)
compares two-pole, real FP32 fields and all four material-gradient groups with
the explicit Torch transpose. Both use the same fused forward, 32 steps and
two checkpoints. Outputs agree exactly. The largest relative gradient L2
difference is 2.24e-7. This verifies dense observation integration, not long-time
optical convergence. Another local CR process and targeted tests were active,
so the recorded timings do not establish a performance ratio. RTX 5880 policy
measurements from earlier revisions must not be attributed to this revision.

The [RTX 5880 integration run](validation/dense-adjoint-observers-128-5880.json)
also completed with 75,600 internal observations and maximum relative
material-gradient L2 difference 2.24e-7. Its source hashes match `f47cae9`.
The accompanying remote regression group passed 93 tests. This does not
establish a speed ratio against the prior generated observer program.
