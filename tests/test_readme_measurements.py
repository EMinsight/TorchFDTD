"""The README's beyond-VRAM and cross-solver rows must restate the recorded runs, not mix them."""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _cross_solver():
    return json.loads((ROOT / 'docs/validation/cross_solver_3060.json').read_text(encoding='utf-8'))


def _full_solve_ratio(record, solver, case):
    solvers = record['throughput']['cases'][case]['solvers']
    return solvers[solver]['median_wall_seconds'] / solvers['torchfdtd']['median_wall_seconds']


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


def test_readme_meep_row_matches_the_cross_solver_record():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    record = _cross_solver()
    row = _row(readme, 'Meep 1.34, 12 MPI ranks on i7-12700 vs TorchFDTD on RTX 3060')
    assert record['environments']['meep']['meep_version'] == '1.34.0'
    assert record['environments']['meep']['mpi_processes'] == 12
    ratios = [_full_solve_ratio(record, 'meep', case) for case in ('sphere-64', 'sphere-96')]
    assert f'**{ratios[0]:.0f}×** and **{ratios[1]:.0f}×** full solve' in row
    assert 'double precision' in row and 'other processes on the host' in row


def test_readme_fdtdx_row_matches_the_cross_solver_record():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    record = _cross_solver()
    row = _row(readme, 'FDTDX 0.6.2 on the same RTX 3060 vs TorchFDTD')
    assert record['environments']['fdtdx']['packages']['fdtdx'] == '0.6.2'
    ratios = [_full_solve_ratio(record, 'fdtdx', case) for case in ('sphere-64', 'sphere-96')]
    assert f'**{ratios[0]:.1f}×** and **{ratios[1]:.1f}×** full solve' in row


def test_readme_fdtdx_adjoint_row_matches_the_cross_solver_record():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    record = _cross_solver()
    row = _row(readme, 'FDTDX adjoint (checkpointed, reversible) vs TorchFDTD checkpointed adjoint')
    solvers = record['adjoint']['solvers']
    assert solvers['torchfdtd_checkpointed']['options']['checkpoints'] == 2
    assert solvers['fdtdx_checkpointed']['options']['num_checkpoints'] == 2
    reference = solvers['torchfdtd_checkpointed']['median_wall_seconds']
    checkpointed = solvers['fdtdx_checkpointed']['median_wall_seconds'] / reference
    reversible = solvers['fdtdx_reversible']['median_wall_seconds'] / reference
    assert f'**{checkpointed:.0f}×** and **{reversible:.1f}×** time to gradient' in row
    difference = max(record['adjoint']['pairwise'][f'torchfdtd_checkpointed_vs_{key}']['gradient_relative_l2']
                     for key in ('fdtdx_checkpointed', 'fdtdx_reversible'))
    bound = math.ceil(difference * 1e8) / 1e8
    assert bound >= difference
    assert f'gradients within {bound:.1e}'.replace('e-07', 'e-7') in row


def test_quick_start_selects_the_measured_path_explicitly():
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    quick = readme[readme.index('## Quick start'):readme.index('## Documentation')]
    assert 'dimension="3d"' in quick and 'cuda_kernel="fused"' in quick
    assert '.[dev,cuda-kernels]' in quick
    assert 'defaults to `"2d"`' in quick and '`"torch"`' in quick
