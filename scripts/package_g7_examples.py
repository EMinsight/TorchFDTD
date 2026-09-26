"""Export only the G7 examples and their input fixtures for installed-wheel runs.

The destination archive contains no torchfdtd source package. Run its scripts
by absolute path from a separate working directory with the wheel interpreter.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FILES = (
    'LICENSE', 'THIRD_PARTY_NOTICES.txt',
    'examples/design_mode_coupler.py',
    'examples/meep_comparison/metagrating/geometry.json',
    'examples/meep_comparison/metalens/geometry.json',
    'examples/meep_comparison/metalens/design_2d.json',
    'examples/meep_comparison/metalens/metalens_common.py',
    'examples/meep_comparison/metalens/torchfdtd_metalens.py',
    'docs/G7_RUN.md', 'docs/G7_WORKFLOWS.md',
)
PATTERNS = ('examples/g7/metagrating/*.py', 'examples/g7/metalens/*.py',
            'examples/g7/coupler/*.py', 'examples/g7/cost/*.py',
            'docs/validation/cases/G7-*.json',
            'docs/validation/g7/G7-03/development/*.json',
            'docs/validation/g7/G7-01/threshold-selection.json')


def build(destination):
    paths = {ROOT/path for path in FILES}
    for pattern in PATTERNS:
        paths.update(ROOT.glob(pattern))
    entries = {path.relative_to(ROOT).as_posix(): path.read_bytes() for path in sorted(paths)}
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    manifest = dict(source_commit=commit, files={name: hashlib.sha256(data).hexdigest()
                                               for name, data in entries.items()})
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, 'x', compression=zipfile.ZIP_DEFLATED) as archive:
        for name, data in entries.items():
            archive.writestr(name, data)
        archive.writestr('manifest.json', json.dumps(manifest, indent=2)+'\n')
    print(json.dumps(dict(archive=str(destination), files=len(entries), source_commit=commit,
                          sha256=hashlib.sha256(destination.read_bytes()).hexdigest())))
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    build(parser.parse_args().out)
