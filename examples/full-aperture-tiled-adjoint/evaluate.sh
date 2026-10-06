#!/usr/bin/env bash
# Score a binary design of a finished run with wider tile margins:   bash evaluate.sh <e1|e2|e3> <run_dir> [step|best]
# or a published layout:   bash evaluate.sh <e1|e2|e3> designs/<layout>.npz [out_dir]   (homogeneous reference solved first)
# Default step: the step of the reference result (E1 248, E2 158, E3 189). One forward solve per tile and polarization, no adjoint:
# ns_run.py --eval-only on the whole aperture (E1 unfolded from its D4 quadrant), tile core 15 um, margin FF_OVER 3.6 um, edge grid.
# With a run directory its own reference.npz (homogeneous-substrate normalization) is reused. Output: <run_dir>/eval_o3.6_<step>/eval_*/metrics.json
# (layout files: <out_dir>/eval_*/metrics.json, default runs/eval_<layout>).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CASE=${1:?usage: bash evaluate.sh <e1|e2|e3> <run_dir|layout.npz> [step|best|out_dir]}
case $CASE in e1) STEP=248 ;; e2) STEP=158 ;; e3) STEP=189 ;; *) echo "unknown case $CASE" >&2; exit 2 ;; esac
PY=${PYTHON:-python}; NGPU=${NGPU:-$(nvidia-smi -L | wc -l)}
if [ -f "${2:?run_dir or layout file}" ]; then                    # published layout: no run directory, reference solved here
  RUN="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; STEP=file
  OUT="${3:-$HERE/runs/eval_$(basename "$2" .npz)}"; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd)
  "$PY" "$HERE/tools/to_density.py" "$CASE" "$RUN" file "$OUT/density.npz"
else
  RUN=$(cd "$2" && pwd); STEP=${3:-$STEP}
  OUT="$RUN/eval_o3.6_$STEP"; mkdir -p "$OUT"
  "$PY" "$HERE/tools/to_density.py" "$CASE" "$RUN" "$STEP" "$OUT/density.npz"
  cp "$RUN/reference.npz" "$OUT/reference.npz"
fi

export -p | grep -E '^declare -x (FF_|EZ_|EZC_|FA_)' > "$OUT/overrides.env" || true
set -a; source "$HERE/configs/common.env"; source "$HERE/configs/$CASE.env"; set +a
unset FA_NEUTRAL_CACHE EZC_BETA_TABLE
export FF_OVER=${EVAL_OVER:-3.6} FF_TILE=${EVAL_TILE:-15} FA_TILE_GRID=edge FA_KEEP_TRACE=0 FA_EVAL_RAW=0 FA_SAVE_SYNC=1 FA_NVSMI=0 \
       FF_GPU_GIB=100000 OMP_NUM_THREADS=8 PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True FA_TARGETS_DIR="$HERE/targets"
[ "$CASE" = "e1" ] && export FA_POLS=xy
source "$OUT/overrides.env"
"$PY" -c "import sys, numpy as np; sys.path.insert(0, sys.argv[1]); import lens_cfg; n = lens_cfg.get()['PUPIL_GRID']; np.save(sys.argv[2], np.full((n, n), 240, dtype=np.float32))" \
  "$HERE/src" "$OUT/uniform_widths.npy"
env | grep -E '^(FF_|EZ_|EZC_|FA_)' | sort > "$OUT/eval_env.txt"
echo "[evaluate.sh] $CASE step $STEP: core $FF_TILE um, margin $FF_OVER um, $NGPU GPU(s), output $OUT"
cd "$HERE/src"
"$PY" -m torch.distributed.run --standalone --nproc_per_node="$NGPU" ns_run.py "$OUT/uniform_widths.npy" "$OUT" 1 --eval-only "$OUT/density.npz" 2>&1 | tee "$OUT/eval.log"
"$PY" -c "import glob, json, sys; m = json.load(open(glob.glob(sys.argv[1] + '/eval_*/metrics.json')[0])); print('[evaluate.sh] objective', m['objective_value'])" "$OUT"
