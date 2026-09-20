# Held-out fixed-plane policy selection

The RTX 5880 real-FP32 run at revision `45d9e5c` completed nine policies on
a 128-cubed grid, two Drude/Lorentz poles and 256 steps. Two fixed spectral
planes use 75,600 internal Yee observations. The objective combines squared
duration-normalized complex fields with area-normalized signed flux. This is
a solver/material-gradient proxy, not a normalized device transmission target.

Calibration sees at most 32 steps. Each full-duration policy has one warmup
and three repetitions. All policies share 16 GiB GPU and 64 GiB host budgets.
Reported times include forward, the proxy objective and backward under this
driver's recorded timing scope.

| Policy | Median seconds |
| --- | ---: |
| Resident, two device checkpoints | 2.5578 |
| Resident, zero checkpoints | 14.4299 |
| Resident, two asynchronous host checkpoints | 5.3289 |
| Streamed width 16, depth 4, synchronous | 165.2111 |
| Streamed width 32, depth 8, synchronous | 52.2151 |
| Same slab, asynchronous double buffering | 37.9850 |
| Same synchronous slab, one local checkpoint | 52.0917 |
| Same synchronous slab, zero global checkpoints | 146.9563 |
| Same synchronous slab, four global checkpoints | 47.5002 |

Unless stated otherwise, streamed policies use two global and zero local
checkpoints. The selector chose the two-device-checkpoint resident policy,
also the fastest over the held-out full duration. Calibration took 272.805 s.
The first admitted baseline was already fastest, so there is no tuning payback
relative to that baseline. Asynchronous transfers reduced the width-32/depth-8
streamed time by 1.375 times, while remaining much slower than resident execution
for this VRAM-fitting problem.

Complete outputs and every scaled material VJP were checked. The largest
relative L2 discrepancy was `4.005e-7`. All 76 driver/runtime source hashes in
the [raw record](plane-policy-128-fp32-45d9e5c-5880.json) match revision
`45d9e5c`. That record predates the later periodic observation-setup optimization.
It cannot establish that later revision's timing.

This study extends the earlier point-spectrum policy validation to dense planes.
It does not establish beyond-VRAM speed, optical convergence, CR optimization
time or an advantage over another solver. The complex-FP64 follow-up is reported below.


## Completed complex-FP64 follow-up

The same nine-policy, 128-cubed, 256-step study with fixed Bloch phase also
completed. Each policy has three full repetitions and one warmup. All 76
recorded source hashes match revision `45d9e5c`.

| Policy | Median seconds |
|---|---:|
| Resident, two device checkpoints | 11.8467 |
| Resident, zero checkpoints | 126.5094 |
| Resident, two asynchronous host checkpoints | 19.2456 |
| Streamed width 16, depth 4, synchronous | 217.8961 |
| Streamed width 32, depth 8, synchronous | 91.4281 |
| Same slab, asynchronous double buffering | 56.0846 |
| Same synchronous slab, one local checkpoint | 90.2803 |
| Same synchronous slab, zero global checkpoints | 283.7843 |
| Same synchronous slab, four global checkpoints | 80.5754 |

The selected and measured fastest policy is again resident with two device
checkpoints. Calibration takes 399.602 s, versus the
selected full-run median of 11.8467 s. There is no
payback relative to the already-fastest resident baseline. Asynchronous
width-32/depth-eight execution is 1.630x
faster than its synchronous counterpart, but still slower than resident.
The largest output/material-VJP relative L2 discrepancy is 5.790e-16.
See the [raw record](plane-policy-128-complex-fp64-45d9e5c-5880.json).

This completed FP64 study is retained as historical validation. It does not
make FP64 the default or establish speed for FP32 beyond-VRAM problems. The
new capacity-first periodic API avoids mandatory calibration solves. Its
selection is not itself a measured performance optimum.
