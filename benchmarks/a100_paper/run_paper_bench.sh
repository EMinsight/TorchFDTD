#!/usr/bin/env bash
# Re-measure the RTX 5880 timings of the manuscript on the A100 session.
# Usage:  bash benchmarks/a100_paper/run_paper_bench.sh   (from any directory)
#         FORCE=1 bash ...   to skip the idle-GPU check (timings are then not valid)
set -uo pipefail
KIT=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "$KIT/../.." && pwd)
STAMP=$(date +%Y%m%d-%H%M%S)
OUT=${TORCHFDTD_BENCH_OUT:-$SRC/results/a100}/$STAMP
mkdir -p "$OUT"

export PYTHONPATH=$SRC
export PYTHONUNBUFFERED=1
export TORCH_ALLOW_TF32_CUBLAS_OVERRIDE=0 NVIDIA_TF32_OVERRIDE=0 TORCH_ALLOW_TF32_CUDNN_OVERRIDE=0
cd "$SRC"

used=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits | head -1)
util=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits | head -1)
used=${used//[^0-9]/}; used=${used:-0}
util=${util//[^0-9]/}; util=${util:-0}   # an idle A100 reports [N/A]
if [ "${FORCE:-0}" != 1 ] && { [ "$used" -gt 2000 ] || [ "$util" -gt 5 ]; }; then
    echo "GPU busy (${used} MiB, ${util}%). Timings would be invalid. Stop the other job or run with FORCE=1."
    exit 2
fi

{
    echo "date: $(date -Is)"
    echo "commit: $(git -C "$SRC" rev-parse HEAD 2>/dev/null || cat "$SRC/COMMIT" 2>/dev/null)"
    echo "gpu memory used at start: ${used} MiB, utilization ${util}%"
    nvidia-smi
    echo "cpus: $(nproc)"
    free -g
    python - <<'PY'
import numpy, torch, cupy, importlib.metadata as md, torchfdtd
print('python', __import__('sys').version.split()[0])
print('torch', torch.__version__, 'cuda', torch.version.cuda)
print('cupy', cupy.__version__, 'numpy', numpy.__version__, 'fdtd', md.version('fdtd'))
print('torchfdtd from', torchfdtd.__file__)
print('tf32 matmul', torch.backends.cuda.matmul.allow_tf32)
PY
} > "$OUT/environment.txt" 2>&1
cat "$OUT/environment.txt" | grep -E "commit|torch|cupy|torchfdtd from|tf32"

run() {
    local name=$1; shift
    local start=$(date +%s)
    echo "=== $name  $(date +%T)"
    if "$@" > "$OUT/$name.log" 2>&1; then
        echo "    ok in $(( $(date +%s) - start )) s"
    else
        echo "    FAILED after $(( $(date +%s) - start )) s, see $OUT/$name.log"
        tail -5 "$OUT/$name.log"
    fi
    nvidia-smi --query-gpu=memory.used,utilization.gpu --format=csv,noheader >> "$OUT/gpu_between_runs.txt"
}

ADJ="--execute --size 256 --steps 128 --repeats 3 --cpu-threads 1 --gpu-host-threads 4 --checkpoints 2 --slab-width 32 --temporal-depth 8 --gpu-budget-gib 32 --host-budget-gib 64"
run adjoint-dielectric python "$KIT/gpu_only_adjoint.py" --output "$OUT/cpu-gpu-adjoint-256-dielectric-a100.json" $ADJ
run adjoint-ade        python "$KIT/gpu_only_adjoint.py" --output "$OUT/cpu-gpu-adjoint-256-ade-a100.json" $ADJ --dispersive
run open-source        python "$KIT/run_module.py" benchmarks.open_source --output "$OUT/open-source-flaport.json"
run tensor-batch       python "$KIT/run_module.py" benchmarks.tensor_batch_validation --output "$OUT/tensor-batch.json"
run ensembles          python "$KIT/run_module.py" benchmarks.ensemble_comparison --output "$OUT/ensembles.json"
run batch              python "$KIT/run_module.py" benchmarks.batch_validation --output "$OUT/batch.json"

echo "results: $OUT"
ls -la "$OUT"
