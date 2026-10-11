"""The platform report runs, records every field and never carries the home directory."""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
RECORD_FIELDS = ['record_version', 'recorded_at', 'os', 'python', 'torch', 'cupy', 'cuda_runtime', 'torch_cuda_available', 'driver', 'gpus']


def test_platform_report_runs_and_records_every_field(tmp_path):
    output = tmp_path / 'probe.json'
    completed = subprocess.run([sys.executable, str(ROOT / 'scripts' / 'platform_report.py'), '--id', 'probe', '--output', str(output)],
                               capture_output=True, text=True, encoding='utf-8', cwd=ROOT, timeout=300,
                               env=dict(os.environ, PYTHONIOENCODING='utf-8'))
    assert completed.returncode == 0, completed.stderr
    assert str(output) in completed.stdout
    record = json.loads(output.read_text(encoding='utf-8'))
    assert record['platform_id'] == 'probe'
    for field in RECORD_FIELDS:
        assert field in record, field
    assert record['python'] == sys.version.split()[0]
    if record['torch_cuda_available']:
        assert record['gpus'] and all(re.fullmatch(r'\d+\.\d+', g['compute_capability']) for g in record['gpus'])
        assert all(g['total_memory_bytes'] > 0 and 0 <= g['free_memory_bytes_at_record'] <= g['total_memory_bytes'] for g in record['gpus'])
    else:
        assert record['gpus'] == []


def test_platform_report_replaces_the_home_directory(tmp_path):
    # The interpreter lies under the home directory the child sees, as a venv under ~ does on a Linux host.
    home = Path(sys.executable).parent.parent
    output = tmp_path / 'probe.json'
    completed = subprocess.run([sys.executable, str(ROOT / 'scripts' / 'platform_report.py'), '--id', 'probe', '--output', str(output)],
                               capture_output=True, text=True, encoding='utf-8', cwd=ROOT, timeout=300,
                               env=dict(os.environ, HOME=str(home), USERPROFILE=str(home), PYTHONIOENCODING='utf-8'))
    assert completed.returncode == 0, completed.stderr
    assert str(output) in completed.stdout
    record = json.loads(output.read_text(encoding='utf-8'))
    assert record['python_executable'].startswith('<user home>'), record['python_executable']
    assert not [key for key, value in record.items() if str(home).lower() in str(value).lower()]


@pytest.mark.cuda
def test_local_record_matches_this_gpu_when_present():
    import torch
    if not torch.cuda.is_available():
        pytest.skip('CUDA unavailable')
    names = {json.loads(p.read_text(encoding='utf-8'))['gpus'][0]['name']
             for p in (ROOT / 'docs' / 'validation' / 'platforms').glob('*.json')}
    assert torch.cuda.get_device_name(0) in names, 'this GPU has no platform record; run scripts/platform_report.py'
