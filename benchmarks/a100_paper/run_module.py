"""Run a benchmarks.* module with CuPy's CUDA-13 wheel standing in for the pinned cupy-cuda12x name.

open_source.py and ensemble_comparison.py record package versions with
importlib.metadata.version('cupy-cuda12x'). The A100 image ships CUDA 13 and
cupy-cuda13x, so the lookup is redirected to that distribution. The version
reported in the record is the installed cupy-cuda13x version, and the torchfdtd
version is read from the uploaded source tree.
Usage:  python run_module.py benchmarks.open_source [args...]
"""
import importlib.metadata as metadata
import runpy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
_version = metadata.version


def version(name):
    if name == 'torchfdtd':
        # the code runs from the uploaded source tree, not from any installed copy
        for line in (Path(__file__).resolve().parents[2] / 'pyproject.toml').read_text().splitlines():
            if line.startswith('version'):
                return line.split('=', 1)[1].strip().strip('"') + ' (source tree)'
    if name == 'cupy-cuda12x':
        for candidate in ('cupy-cuda13x', 'cupy-cuda12x', 'cupy'):
            try:
                return _version(candidate) + ('' if candidate == 'cupy-cuda12x' else f' ({candidate})')
            except metadata.PackageNotFoundError:
                continue
    return _version(name)


metadata.version = version
module = sys.argv[1]
sys.argv = [module] + sys.argv[2:]
runpy.run_module(module, run_name='__main__', alter_sys=True)
