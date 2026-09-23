"""Write the geometry of the analytic slab of examples/flux_slab.py as a record, without running a solver.

docs/validation/flux.json holds the spectra of that example but not its project, so the geometry panel of the slab
figure reads this record instead. The project is built exactly as the example builds it, including the index of 1.5
that the example sets after make_project(), and its grid is checked against the summary stored in flux.json.
"""
import hashlib
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
sys.path.insert(0, str(REPO / 'examples'))

import flux_slab  # noqa: E402

project = flux_slab.make_project('cpu')
project.materials[1].index = 1.5          # as in flux_slab.main()
dump = project.model_dump(mode='json')
summary = json.loads((REPO / 'docs/validation/flux.json').read_text(encoding='utf-8'))['sample_summary']
assert list(summary['actual_size_um'][:2]) == [float(v) for v in dump['region']['size'][:2]]
assert abs(summary['axis_min_step_um'][0] - dump['region']['mesh']) < 1e-9
record = dict(
    description='Project of examples/flux_slab.py with the slab index set to 1.5 as in its main(). Geometry only, no run.',
    source='examples/flux_slab.py',
    source_sha256=hashlib.sha256((REPO / 'examples/flux_slab.py').read_bytes()).hexdigest(),
    spectra_record='docs/validation/flux.json',
    project=dump,
)
out = REPO / 'docs/validation/paper_review/flux-slab-project.json'
out.write_bytes((json.dumps(record, indent=2) + '\n').encode('utf-8'))
print('wrote', out.relative_to(REPO))
