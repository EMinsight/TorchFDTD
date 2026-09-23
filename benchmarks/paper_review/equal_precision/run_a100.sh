#!/usr/bin/env bash
# Single- and double-precision fused forward solves of the cross-solver scenes on one GPU, the measurement behind
# docs/validation/paper_review/torchfdtd-precision-a100.json. Run from the repository root on an otherwise idle GPU.
# Usage: bash benchmarks/paper_review/equal_precision/run_a100.sh [OUTPUT_DIR]
set -uo pipefail
OUT=${1:-results/equal_precision_$(date +%Y%m%d-%H%M%S)}
mkdir -p "$OUT"
export PYTHONPATH=$PWD PYTHONUNBUFFERED=1
export TORCH_ALLOW_TF32_CUBLAS_OVERRIDE=0 NVIDIA_TF32_OVERRIDE=0 TORCH_ALLOW_TF32_CUDNN_OVERRIDE=0
nvidia-smi --query-gpu=name,memory.used,utilization.gpu --format=csv > "$OUT/env.txt"
python benchmarks/paper_review/equal_precision/torchfdtd_precision.py \
    --output "$OUT/torchfdtd-precision-a100.json" --traces "$OUT/traces"
