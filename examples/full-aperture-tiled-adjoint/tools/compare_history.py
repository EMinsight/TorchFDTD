"""Compare a run's history.json with the reference run of the same example.

    python compare_history.py <e1|e2|e3> <run_dir> [--every N]

Checks that beta and lr of every completed step equal the reference schedule exactly, then lists the grey and binary objectives
of both runs every N steps (default 10) and at the last step, with their relative differences.
"""
import argparse, csv, json, math
from pathlib import Path

ap = argparse.ArgumentParser(); ap.add_argument("case"); ap.add_argument("run"); ap.add_argument("--every", type=int, default=10)
a = ap.parse_args()
ref = {int(r["step"]): r for r in csv.DictReader(open(Path(__file__).resolve().parent.parent / "reference" / f"{a.case}_history.csv"))}
hist = json.loads((Path(a.run) / "history.json").read_text())
f = lambda s: float(s) if s not in ("", None) else math.nan
bad = [h["step"] for h in hist if h["step"] in ref and (h["beta"] != f(ref[h["step"]]["beta"]) or h["lr"] != f(ref[h["step"]]["lr"]))]
print(f"{len(hist)} steps in the run, {len(ref)} in the reference; beta/lr differ from the reference at {len(bad)} steps {bad[:10]}")
print(f"{'step':>5} {'beta':>9} {'grey run':>12} {'grey ref':>12} {'rel':>9} {'binary run':>12} {'binary ref':>12} {'rel':>9}")
last = hist[-1]["step"] if hist else -1
for h in hist:
    k = h["step"]
    if k not in ref or (k % a.every and k != last): continue
    r = ref[k]; g, gr, b, br = h["I_tar"], f(r["objective_grey"]), h["I_binary"], f(r["objective_binary"])
    rel = lambda x, y: (x - y) / abs(y) if y == y and x == x and y != 0 else math.nan
    print(f"{k:5d} {h['beta']:9.4g} {g:12.6f} {gr:12.6f} {rel(g, gr):+9.2e} {b:12.6f} {br:12.6f} {rel(b, br):+9.2e}")
