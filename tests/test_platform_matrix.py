"""G4-01: the platform report runs, and the platform matrix lists only recorded platforms."""
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / 'docs' / 'PLATFORM_MATRIX.md'
COLUMNS = ['Platform id', 'GPU', 'Compute capability', 'Driver', 'CUDA runtime', 'torch', 'CuPy', 'Python', 'OS', 'Record', 'Verified by']
RECORD_FIELDS = ['record_version', 'recorded_at', 'os', 'python', 'torch', 'cupy', 'cuda_runtime', 'torch_cuda_available', 'driver', 'gpus']


def matrix_rows():
    lines = [line for line in MATRIX.read_text(encoding='utf-8').splitlines() if line.startswith('|')]
    header = [cell.strip() for cell in lines[0].strip('|').split('|')]
    assert header == COLUMNS, header
    rows = []
    for line in lines[2:]:
        cells = [cell.strip() for cell in line.strip('|').split('|')]
        assert len(cells) == len(COLUMNS), line
        rows.append(dict(zip(COLUMNS, cells)))
    return rows


def test_platform_report_runs_and_records_every_field(tmp_path):
    output = tmp_path / 'probe.json'
    completed = subprocess.run([sys.executable, str(ROOT / 'scripts' / 'platform_report.py'), '--id', 'probe', '--output', str(output)],
                               capture_output=True, text=True, cwd=ROOT, timeout=300)
    assert completed.returncode == 0, completed.stderr
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


def test_matrix_rows_come_from_record_files_only():
    rows = matrix_rows()
    assert rows, 'the matrix lists no platform'
    ids = [row['Platform id'] for row in rows]
    assert len(ids) == len(set(ids))
    hardware = ['GPU', 'Compute capability', 'Driver', 'CUDA runtime', 'torch', 'CuPy', 'Python', 'OS']
    recorded = 0
    for row in rows:
        link = re.fullmatch(r'\[(?P<id>[^\]]+)\]\((?P<path>validation/platforms/[^)]+\.json)\)', row['Record'])
        if link is None:
            assert row['Record'] == 'not recorded', row['Record']
            assert all(row[column] == 'not recorded' for column in hardware), f"{row['Platform id']} lists values without a record"
            continue
        assert link['id'] == row['Platform id']
        path = ROOT / 'docs' / link['path']
        assert path.is_file(), f"{row['Platform id']} names a record that does not exist: {link['path']}"
        record = json.loads(path.read_text(encoding='utf-8'))
        assert record['platform_id'] == row['Platform id']
        assert len(record['gpus']) == 1, 'one GPU per row; several GPUs need several rows'
        gpu = record['gpus'][0]
        expected = {'GPU': gpu['name'], 'Compute capability': gpu['compute_capability'], 'Driver': record['driver'],
                    'CUDA runtime': record['cuda_runtime'], 'torch': record['torch'], 'CuPy': record['cupy'],
                    'Python': record['python'], 'OS': record['os']}
        for column, value in expected.items():
            assert row[column] == str(value), f"{row['Platform id']} {column}: matrix says {row[column]!r}, record says {value!r}"
        recorded += 1
    assert recorded >= 1, 'no platform row is backed by a record file'


def test_every_record_file_has_a_matrix_row():
    listed = {row['Platform id'] for row in matrix_rows()}
    for path in (ROOT / 'docs' / 'validation' / 'platforms').glob('*.json'):
        record = json.loads(path.read_text(encoding='utf-8'))
        assert record['platform_id'] == path.stem
        assert path.stem in listed, f'{path.name} has no matrix row'


@pytest.mark.cuda
def test_local_record_matches_this_gpu_when_present():
    import torch
    if not torch.cuda.is_available():
        pytest.skip('CUDA unavailable')
    names = {json.loads(p.read_text(encoding='utf-8'))['gpus'][0]['name']
             for p in (ROOT / 'docs' / 'validation' / 'platforms').glob('*.json')}
    assert torch.cuda.get_device_name(0) in names, 'this GPU has no platform record; run scripts/platform_report.py'
