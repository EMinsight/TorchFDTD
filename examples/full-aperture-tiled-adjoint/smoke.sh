#!/usr/bin/env bash
# Wiring check on one small GPU:   bash smoke.sh <e1|e2|e3> [out_dir]
# The production code path of the case (driver, kernels, objective, schedule) on the 6 um test lens d6 (2 um tile cores, so 9 tiles),
# 2 optimizer steps, objective windows scaled to the 6 um aperture. It checks that everything runs; the numbers mean nothing.
# About 2-5 GB of GPU memory; minutes per step on a 12 GB consumer GPU. NGPU (default 1) ranks; on Windows tools/spawn.py replaces torchrun.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CASE=${1:?usage: bash smoke.sh <e1|e2|e3> [out_dir]}
[ -f "$HERE/configs/$CASE.env" ] || { echo "unknown case $CASE" >&2; exit 2; }
OUT=$(mkdir -p "${2:-$HERE/runs/smoke_$CASE}" && cd "${2:-$HERE/runs/smoke_$CASE}" && pwd)
PY=${PYTHON:-python}; NGPU=${NGPU:-1}; STEPS=${STEPS:-2}
set -a; source "$HERE/configs/common.env"; source "$HERE/configs/$CASE.env"; set +a
unset FA_NEUTRAL_CACHE
export FF_LENS=d6 FF_APERTURE_UM=6 FF_FOCAL_UM=10 FF_TILE=2 FF_GPU_GIB=${FF_GPU_GIB_SMOKE:-6} FF_HOST_GIB=8 \
       FA_KEEP_MAX_UNITS=2 FA_KEEP_HOST_RESERVE_GIB=4 FA_RHO_EVERY=1 FA_TKEEP_EVERY=1 FA_NVSMI=0 \
       FA_TARGETS_DIR="$HERE/targets" EZC_BETA_TABLE="$HERE/schedules/$CASE.json" FA_RUN_ID=smoke_$CASE FA_TARGET_STEPS=$STEPS EZC_OUTER=$((STEPS - 1))
case $CASE in
  e1) export FA_OBJ_CFG='{"axial_half_um": 4.0, "psf_half_um": 2.0}' ;;
  *)  export FA_OBJ_CFG='{"aperture": "square", "radius_um": 3.0, "z_um": 12.0, "window_um": 4.0}' ;;
esac
"$PY" -c "import sys, numpy as np; sys.path.insert(0, sys.argv[1]); import lens_cfg; n = lens_cfg.get()['PUPIL_GRID']; np.save(sys.argv[2], np.full((n, n), 240, dtype=np.float32))" \
  "$HERE/src" "$OUT/uniform_widths.npy"
cd "$HERE/src"
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) USE_LIBUV=0 "$PY" "$HERE/tools/spawn.py" "$NGPU" "$FA_DRIVER" "$OUT/uniform_widths.npy" "$OUT" "$STEPS" 2>&1 | tee "$OUT/run.log" ;;
  *) "$PY" -m torch.distributed.run --standalone --nproc_per_node="$NGPU" "$FA_DRIVER" "$OUT/uniform_widths.npy" "$OUT" "$STEPS" 2>&1 | tee "$OUT/run.log" ;;
esac
"$PY" -c "import json, sys; h = json.load(open(sys.argv[1])); [print(f\"[smoke] step {r['step']}: beta {r['beta']:g}, lr {r['lr']:.4g}, objective {r['I_tar']:.6g}, binary {r['I_binary']:.6g}, {r['t_step_s']:.0f} s\") for r in h]" "$OUT/history.json"
