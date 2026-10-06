"""CPU check of the three production objectives (no FDTD): target hashes, value and gradient on random pupil Jones maps.

    python check_objectives.py

Builds e1_achromat (800 x 800 pupil, 9 wavelengths, x and y), e2_rgb_holo (600 x 600, 3 wavelengths, x) and e3_pol_holo
(400 x 400, 540 nm, x and y) through src/fa_objective_loader.py with the configs of configs/e*.env, evaluates J and dJ/dT.
"""
import json, os, sys, time
from pathlib import Path
import torch

HERE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(HERE / "src")); os.environ.setdefault("FA_TARGETS_DIR", str(HERE / "targets"))
import fa_objective_loader as L

CASES = [("e1_achromat", [420, 450, 470, 510, 540, 570, 600, 635, 670], "xy", 200.0, 333.3333333333, None, 800),
         ("e2_rgb_holo", [450, 540, 635], "x", 150.0, None, {"aperture": "square", "radius_um": 75.0, "z_um": 300.0, "window_um": 120.0}, 600),
         ("e3_pol_holo", [540], "xy", 100.0, None, {"aperture": "square", "radius_um": 50.0, "z_um": 200.0, "window_um": 80.0}, 400)]
g = torch.Generator().manual_seed(0)
for name, lam, pols, ap, f, cfg, m in CASES:
    os.environ.pop("FA_OBJ_CFG", None)
    if cfg: os.environ["FA_OBJ_CFG"] = json.dumps(cfg)
    t = time.time(); obj = L.load(name, lam_nm=lam, pitch_um=0.25, aperture_um=ap, focal_um=f)
    keys = ["xx", "yx"] + (["xy", "yy"] if pols == "xy" else [])
    T = {k: (0.3 * torch.randn(len(lam), m, m, generator=g) + 0.3j * torch.randn(len(lam), m, m, generator=g)).to(torch.complex64).requires_grad_(True) for k in keys}
    J = obj(T); J.backward()
    ok = all(T[k].grad is not None and bool(torch.isfinite(T[k].grad).all()) for k in keys)
    info = L.info(obj)
    print(f"{name}: J = {float(J.detach()):.6g}, finite gradient {ok}, target sha256 {str(info.get('target_sha256'))[:16]}, {time.time() - t:.1f} s", flush=True)
