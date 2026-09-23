# Manuscript timings on an A100

These scripts produced the `*-a100.json` records in `docs/validation` that the
manuscript reports: the 256^3 resident and host-streamed adjoints, the
flaport/fdtd comparison (Table 5), the tensor batch (Table 6), the sixteen-case
ensembles, the four-case process batch (Fig. 5) and the TFSF sphere (Table 1).
They ran on an NVIDIA A100 80GB PCIe in a shared-cluster container with four
CPU cores, CUDA 13.2, PyTorch 2.11 and CuPy 14 (cupy-cuda13x), with TF32
overrides disabled.

- `run_paper_bench.sh` runs the timing benchmarks after checking that the GPU is
  idle (below 2 GB and 5 % utilization). `run_table1.sh RESULT_DIR` adds the
  TFSF sphere cases with the meshes and durations of the original records.
- `gpu_only_adjoint.py` runs `benchmarks/cpu_gpu_adjoint.py` without its CPU
  modes, because four cores cannot reproduce the six- and twelve-thread CPU
  reference of the earlier RTX 5880 records. The benchmark source is unchanged.
- `run_module.py` runs a `benchmarks.*` module with the installed CuPy wheel
  answering the version lookup of the pinned `cupy-cuda12x` name, and reports
  the TorchFDTD version of the source tree.

The earlier RTX 5880 records with the same benchmark names remain in
`docs/validation` and are cited by the manuscript for the eight-core
workstation comparison of host streaming.
