"""The README's beyond-VRAM rows must restate the recorded runs, not mix them."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _row(text, label):
    for line in text.splitlines():
        if line.startswith('| ' + label):
            return line
    raise AssertionError(f'README row {label!r} not found')


def test_readme_capacity_row_matches_the_fp32_record():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    record = (ROOT / 'docs/BEYOND_VRAM_FP32.md').read_text(encoding='utf-8')
    cells = int(re.search(r'\| Cells \| ([0-9,]+)', record).group(1).replace(',', ''))
    eh_bytes = int(re.search(r'\| E/H state \| ([0-9,]+) bytes', record).group(1).replace(',', ''))
    peak = int(re.search(r'Peak Torch CUDA allocation \| ([0-9,]+) bytes', record).group(1).replace(',', ''))
    row = _row(readme, 'Larger than the GPU, capacity run')
    assert f'{cells/1e9:.2f} billion cells' in row
    assert f'{eh_bytes/1e9:.0f} GB ({eh_bytes/2**30:.0f} GiB)' in row
    assert f'{peak/1e9:.2f} GB peak CUDA memory' in row


def test_readme_restart_row_matches_the_restart_record():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    record = json.loads((ROOT / 'docs/validation/beyond_vram_restart_5880.json').read_text(encoding='utf-8'))
    row = _row(readme, 'Larger than the GPU, crash and resume')
    assert f'{record["cells"]/1e9:.2f} billion cells' in row
    assert f'{record["eh_bytes"]/1e9:.0f} GB ({record["eh_bytes"]/2**30:.1f} GiB)' in row
    peak = record['resumed_run']['peak_torch_cuda_bytes']
    assert f'{peak/1e9:.2f} GB peak CUDA memory' in row
    error = record['resumed_run']['comparison_errors']['gradient_crop_relative_l2']
    assert f'{error:.1e}'.replace('e-08', 'e-8') in row


def test_quick_start_selects_the_measured_path_explicitly():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    quick = readme[readme.index('## Quick start'):readme.index('## Documentation')]
    assert 'dimension="3d"' in quick and 'cuda_kernel="fused"' in quick
    assert '.[dev,cuda-kernels]' in quick
    assert 'defaults to `"2d"`' in quick and '`"torch"`' in quick
