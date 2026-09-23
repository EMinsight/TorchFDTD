#!/usr/bin/env bash
# Table 1 (closed-box TFSF sphere against Mie) on the A100, same meshes and durations as the RTX 5880 records.
set -uo pipefail
KIT=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "$KIT/../.." && pwd)
OUT=${1:?usage: run_table1.sh RESULT_DIR}
export PYTHONPATH=$SRC PYTHONUNBUFFERED=1
export TORCH_ALLOW_TF32_CUBLAS_OVERRIDE=0 NVIDIA_TF32_OVERRIDE=0 TORCH_ALLOW_TF32_CUDNN_OVERRIDE=0
cd "$SRC"
run() {
    local name=$1; shift
    local start=$(date +%s)
    echo "=== $name  $(date +%T)"
    if "$@" > "$OUT/$name.log" 2>&1; then echo "    ok in $(( $(date +%s) - start )) s"
    else echo "    FAILED, see $OUT/$name.log"; tail -5 "$OUT/$name.log"; fi
}
run tfsf-sphere        python examples/tfsf_sphere.py --backend cuda --meshes 0.1 0.05 0.025 --output "$OUT/tfsf-sphere-a100.json"
run tfsf-sphere-finer  python examples/tfsf_sphere.py --backend cuda --meshes 0.02 --output "$OUT/tfsf-sphere-finer-a100.json"
run tfsf-sphere-long   python examples/tfsf_sphere.py --backend cuda --meshes 0.025 --duration-fs 240 --output "$OUT/tfsf-sphere-long-a100.json"
echo "table1 done"
