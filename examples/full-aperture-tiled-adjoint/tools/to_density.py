"""Binary design of an optimization step, or a layout of designs/ -> density file of ns_run.py --eval-only.

    python to_density.py <e1|e2|e3> <run_dir> <step|best> <out.npz>
    python to_density.py <e1|e2|e3> <designs/layout.npz> file <out.npz>

E1 (zonec_multi.py) step files hold the D4 quadrant in d10_quad, which ns_run.load_density unfolds by the mirror symmetry; they are
copied unchanged. E2/E3 (ns_run.py) step files hold the whole aperture grid under the same key, written here as d10_bits.
"""
import sys
from pathlib import Path
import numpy as np

case, run, which, out = sys.argv[1], Path(sys.argv[2]), sys.argv[3], sys.argv[4]
src = run if which == "file" else run / "best_binary.npz" if which == "best" else run / f"step_{int(which):04d}.npz"
z = dict(np.load(src))
if "d10_full" in z: z = dict(d10_quad=z["d10_full"], d10_shape=z["d10_full_shape"])     # meta-atom layouts of E2 and E3
elif "d10_bits" in z: z = dict(d10_quad=z["d10_bits"], d10_shape=z["d10_shape"])           # E3 freeform layout
if case == "e1": np.savez(out, d10_quad=z["d10_quad"], d10_shape=z["d10_shape"], source=str(src))
else: np.savez(out, d10_bits=z["d10_quad"], d10_shape=z["d10_shape"], source=str(src))
print(f"[to_density] {src} -> {out} ({'D4 quadrant' if case == 'e1' else 'full grid'}, d10_shape {z['d10_shape'].tolist()})")
