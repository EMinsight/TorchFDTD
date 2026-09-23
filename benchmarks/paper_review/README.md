# Drivers of the manuscript's review additions

These scripts produced the records under `docs/validation/paper_review/` and
`docs/validation/meep_comparison/microring_fields_torchfdtd.*`. They were run
from working copies under `.local/paper_review/`, which is why the records name
that path. The files here are byte-identical to those copies, and the SHA-256
hashes stored in the records identify them.

| Driver | Record | Hardware |
|---|---|---|
| `scaling/forward_sweep.py` | `scaling-forward-3060.json` | RTX 3060, resident fused forward, 64^3 to 192^3 |
| `scaling/streamed_forward_sweep.py` | `scaling-forward-streamed-3060.json` | RTX 3060, host-streamed forward above eight million cells |
| `scaling/adjoint_sweep.py` | `scaling-adjoint-3060-{n}.json`, `scaling-adjoint-3060-384-resident-plan.json` | RTX 3060, wraps `benchmarks/cpu_gpu_adjoint.py` |
| `microring_fields/run_fields.py` | `meep_comparison/microring_fields_torchfdtd.{json,npz}` | RTX 3060 |
| `metagrating/make_metagrating_showcase.py` | `metagrating_showcase.json`, `metagrating_fields.npz` | CPU, four threads |

Commands, from the repository root:

```bash
python benchmarks/paper_review/scaling/forward_sweep.py --output docs/validation/paper_review/scaling-forward-3060.json
python benchmarks/paper_review/scaling/streamed_forward_sweep.py --output docs/validation/paper_review/scaling-forward-streamed-3060.json
for n in 128 192 256; do
  python benchmarks/paper_review/scaling/adjoint_sweep.py --modes cuda_resident,cuda_dram --size $n \
      --output docs/validation/paper_review/scaling-adjoint-3060-$n.json
done
python benchmarks/paper_review/scaling/adjoint_sweep.py --modes cuda_resident,cuda_dram --size 320 --headroom-gib 6 \
    --output docs/validation/paper_review/scaling-adjoint-3060-320.json
python benchmarks/paper_review/scaling/adjoint_sweep.py --modes cuda_resident --size 384 --plan-only \
    --output docs/validation/paper_review/scaling-adjoint-3060-384-resident-plan.json
python benchmarks/paper_review/scaling/adjoint_sweep.py --modes cuda_dram --size 384 --slab-width 16 --headroom-gib 6 \
    --output docs/validation/paper_review/scaling-adjoint-3060-384.json
python benchmarks/paper_review/microring_fields/run_fields.py
python benchmarks/paper_review/metagrating/make_metagrating_showcase.py
```

Run the GPU sweeps alone on the device. The adjoint wrapper drops the CPU modes
of the benchmark, holds the plane-monitor stride at 32 above 256^3 and can lower
the host RAM headroom that the benchmark keeps free. It writes every override
into the record under `sweep_overrides`. At 320^3 the default 16 GiB headroom
refused the streamed measurement on the 85 GB workstation, so that size and 384^3
use 6 GiB.

The metagrating driver runs no optimization. It reads the recorded runs of
`examples/design_metagrating.py` in `docs/validation/g6/`, rebuilds the initial
density of each seed, takes the final binary layout from the record and
evaluates both with the design-run length and with runs four times longer.
