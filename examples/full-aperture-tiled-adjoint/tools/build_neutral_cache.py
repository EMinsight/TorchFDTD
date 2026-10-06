"""Polar lookup of the D200 lens octant for E1 (geometry only: no design values, no FDTD).

    python build_neutral_cache.py <out.npz>           build (about 30 s and 3 GB of RAM)
    python build_neutral_cache.py --check <out.npz>   compare the arrays with the SHA-256 of the file used by the reference run

IDX maps every 10 nm pixel of the quadrant (10000 x 10000) to its polar cell k * AMAX + a: ring k = floor(r / 10 nm), PN[k] =
max(1, round(pi/4 (k + 1/2))) cells of the 45 degree arc. VALID marks the cells that hold at least one pixel of the 200 um aperture
(radius tested on the 20 nm FDTD cell centres), oct_mask the octant pixels of the aperture. src/loop_zone.py reads it as FA_NEUTRAL_CACHE.
"""
import hashlib, sys
from pathlib import Path
import numpy as np

SHA256 = {"IDX": "20501b4cdf6208224e97802b9afc728ea9851b2e627c62448b10e9c8155ce4b6",
          "VALID": "2eccccd818069900f76ce3cfb00fe570c46724aa8297c0482dbf68b4628952d5",
          "oct_mask": "991ba10c1d4de6d109783d10bfa36c6e24534030247405727b572bb65b5e72a0",
          "PN": "96a3f3bf54ed9df08d6b83e72c3fd4827fa45da37ec59377da896e9d4fc1531d"}


def build(out):
    h = 10000; r_nm = 100000.0; nr = 10001
    pn = np.maximum(1, np.round(0.25 * np.pi * (np.arange(nr) + 0.5))).astype(np.int32); amax = int(pn.max())
    x = (np.arange(h, dtype=np.float64) + 0.5) * 10
    idx = np.empty((h, h), np.int32)
    for i in range(0, h, 500):
        X = x[i:i + 500, None]; Y = x[None, :]
        k = np.minimum(np.floor(np.hypot(X, Y) / 10).astype(np.int32), nr - 1); n = pn[k]
        a = np.minimum(np.floor(np.arctan2(np.minimum(X, Y), np.maximum(X, Y)) / (0.25 * np.pi) * n).astype(np.int32), n - 1)
        idx[i:i + 500] = k * amax + a
    xs = (np.arange(h // 2, dtype=np.float64) + 0.5) * 20
    ap20 = np.hypot(xs[:, None], xs[None, :]) <= r_nm
    ap10 = np.repeat(np.repeat(ap20, 2, 0), 2, 1)
    cnt = np.bincount(idx[ap10], minlength=nr * amax)
    valid = (np.arange(amax)[None, :] < pn[:, None]) & (cnt.reshape(nr, amax) > 0)
    octmask = np.zeros((h, h), bool); ii = np.arange(h // 2); octmask[h // 2:, h // 2:] = ap20 & (ii[:, None] >= ii[None, :])
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(out, IDX=idx, VALID=valid[None], oct_mask=octmask, PN=pn, H10=h, NRMAX=nr, AMAX=amax, R_AP_um=100.0,
                        mask_precision="float64 physical radius on FDTD cell centres")
    print(f"[neutral] wrote {out}: {int(valid.sum())} polar cells", flush=True)


def check(path):
    z = np.load(path); bad = [k for k, v in SHA256.items() if hashlib.sha256(np.ascontiguousarray(z[k]).tobytes()).hexdigest() != v]
    if bad: raise SystemExit(f"[neutral] {path}: arrays {bad} differ from the reference lookup")
    print(f"[neutral] {path}: arrays match the reference lookup", flush=True)


if __name__ == "__main__":
    if sys.argv[1] == "--check": check(sys.argv[2])
    else: build(sys.argv[1]); check(sys.argv[1])
