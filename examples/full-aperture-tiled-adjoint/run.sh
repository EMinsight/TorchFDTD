#!/usr/bin/env bash
# Optimize one example on all GPUs of this node:   bash run.sh <e1|e2|e3> [run_dir]
# Running the same command again resumes after the last completed step (run_dir/zonec/zonec_state.pt, written every step).
# Environment: PYTHON (default python), NGPU (default: every GPU nvidia-smi lists), STEPS (default: the length of the schedule),
#   FA_NEUTRAL_CACHE (E1 lookup file, default cache/d200_lookup.npz, built on first use), and any FF_* / EZ_* / EZC_* / FA_*
#   variable, which overrides configs/*.env. Stop cleanly: touch run_dir/STOP (the loop stops before its next step).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CASE=${1:?usage: bash run.sh <e1|e2|e3> [run_dir]}
[ -f "$HERE/configs/$CASE.env" ] || { echo "unknown case $CASE (e1, e2 or e3)" >&2; exit 2; }
OUT=$(mkdir -p "${2:-$HERE/runs/$CASE}" && cd "${2:-$HERE/runs/$CASE}" && pwd)
PY=${PYTHON:-python}
NGPU=${NGPU:-$(nvidia-smi -L | wc -l)}

export -p | grep -E '^declare -x (FF_|EZ_|EZC_|FA_)' > "$OUT/overrides.env" || true   # the caller's settings win over the env files
set -a; source "$HERE/configs/common.env"; source "$HERE/configs/$CASE.env"; set +a
source "$OUT/overrides.env"
export EZC_BETA_TABLE=${EZC_BETA_TABLE:-$HERE/schedules/$CASE.json}
STEPS=${STEPS:-$("$PY" -c "import json, sys; print(json.load(open(sys.argv[1]))['steps'])" "$EZC_BETA_TABLE")}
export FA_RUN_ID="$(basename "$OUT")" FA_TARGET_STEPS="$STEPS" EZC_OUTER=$((STEPS - 1))
export FA_TARGETS_DIR="$HERE/targets"

if [ "$CASE" = "e1" ]; then                                    # polar lookup of the D200 octant (geometry only, about 250 MB, 30 s)
  export FA_NEUTRAL_CACHE=${FA_NEUTRAL_CACHE:-$HERE/cache/d200_lookup.npz}
  [ -f "$FA_NEUTRAL_CACHE" ] || "$PY" "$HERE/tools/build_neutral_cache.py" "$FA_NEUTRAL_CACHE"
  "$PY" "$HERE/tools/build_neutral_cache.py" --check "$FA_NEUTRAL_CACHE"
fi
"$PY" -c "import sys, numpy as np; sys.path.insert(0, sys.argv[1]); import lens_cfg; n = lens_cfg.get()['PUPIL_GRID']; np.save(sys.argv[2], np.full((n, n), 240, dtype=np.float32))" \
  "$HERE/src" "$OUT/uniform_widths.npy"                       # bookkeeping map of the pupil grid (not used by the physics)
env | grep -E '^(FF_|EZ_|EZC_|FA_|OMP_|CUDA_VISIBLE)' | sort > "$OUT/launch_env.txt"
echo "[run.sh] $CASE: $FA_DRIVER, $STEPS steps, $NGPU GPU(s), schedule $EZC_BETA_TABLE, output $OUT"
cd "$HERE/src"
"$PY" -m torch.distributed.run --standalone --nproc_per_node="$NGPU" "$FA_DRIVER" "$OUT/uniform_widths.npy" "$OUT" "$STEPS" 2>&1 | tee -a "$OUT/run.log"
