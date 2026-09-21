"""Render the tiled-stitching validation tables into docs/TILED_STITCHING.md from the recorded JSON."""
import json
from pathlib import Path

DATA = Path('docs/validation')
DOC = Path('docs/TILED_STITCHING.md')
START, END = '<!-- tiled-validation:start -->', '<!-- tiled-validation:end -->'


def load(name):
    return json.loads((DATA / name).read_text(encoding='utf-8'))


def series_table(rows, *, focal=True):
    head = '| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | '
    head += 'Focal intensity error, hard | Focal intensity error, linear | Wall (s) |' if focal else 'Wall (s) |'
    lines = [head, '|---:|---:|---:|---:|---:|---:|---:|' + ('---:|---:|---:|' if focal else '---:|')]
    for r in rows:
        line = (f"| {r['overlap_um']:g} | {r['overlap_cells']} | {r['largest_tile_cells']:,} | {r['near_error_hard']:.4f} | {r['near_error_linear']:.4f} | "
                f"{r['mismatch_max']:.3f} | {r['mismatch_center_max']:.3f} | ")
        if focal:
            line += f"{r['focal_intensity_error_hard']:.4f} | {r['focal_intensity_error_linear']:.4f} | "
        line += f"{r['wall_seconds']:.1f} |"
        lines.append(line)
    return '\n'.join(lines)


def distance_table(rows):
    lines = ['| Distance to the nearest cut (um) | RMS relative field error |', '|---|---:|']
    for r in rows:
        lines.append(f"| {r['distance_um'][0]:g} to {r['distance_um'][1]:g} | {r['rms_relative_error']:.4f} |")
    return '\n'.join(lines)


def gradient_table(records, project):
    lines = ['| Overlap (um) | Objective difference | Design-cell gradient error | Whole-grid gradient error | Pillar-derivative vector error | Parameter | Cells | Tiled adjoint | Tiled central difference | Full adjoint | Full central difference | Tiled vs full |',
             '|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|']
    for g in records:
        for i, q in enumerate(g['parameters']):
            name = f"cell {tuple(q['target'])}" if q['kind'] == 'cell' else f"pillar {q['target']} at {tuple(round(v, 2) for v in project['structures'][q['target']]['center'][:2])}"
            prefix = (f"| {g['overlap_um']:g} | {g['objective_relative_difference']:.2e} | {g['design_gradient_relative_l2_tiled_vs_full']:.2e} | "
                      f"{g['gradient_relative_l2_tiled_vs_full']:.2e} | {g['pillar_vector_relative_l2']:.2e} |") if i == 0 else '| | | | | |'
            lines.append(f"{prefix} {name} | {q['cells']} | {q['tiled_adjoint']:.6e} | {q['tiled_central_difference']:.6e} | "
                         f"{q['full_adjoint']:.6e} | {q['full_central_difference']:.6e} | {q['tiled_vs_full']:.2e} |")
    return '\n'.join(lines)


def throughput_table(reference, throughput):
    lines = ['| Run | Cells simulated | Wall (s) | Peak Torch CUDA bytes |', '|---|---:|---:|---:|']
    lines.append(f"| Whole device | {reference['cells']:,} | {reference['wall_seconds']:.2f} | {reference['peak_torch_bytes']:,} |")
    for name, r in throughput['executors'].items():
        lines.append(f"| {r['tiles']} tiles, {name} executor, overlap {throughput['overlap_um']:g} um | {r['total_tile_cells']:,} | {r['wall_seconds']:.2f} | {r['peak_torch_bytes']:,} |")
    return '\n'.join(lines)


def render():
    three = load('tiled-stitching-3d-3060.json')
    flat = load('tiled-stitching-2d-cpu.json')
    ref = three['reference']
    gradient3 = three['gradient'][0]
    strongest = max(gradient3['parameters'], key=lambda q: abs(q['full_adjoint']))
    parts = [START, '',
             f"Recorded by `python -m benchmarks.tiled_stitching --dimension 3d --device cuda` on {three['gpu']} (PyTorch {three['torch']}) and "
             f"`--dimension 2d --device cpu`, into [tiled-stitching-3d-3060.json](validation/tiled-stitching-3d-3060.json) and "
             f"[tiled-stitching-2d-cpu.json](validation/tiled-stitching-2d-cpu.json). Timings were taken on a GPU shared with other jobs.", '',
             '### 3D pillar array', '',
             f"The whole device is {ref['shape'][0]} x {ref['shape'][1]} x {ref['shape'][2]} cells ({ref['cells']:,}) for {ref['steps']} steps in FP32 with the fused "
             f"CUDA kernels; 2 x 2 tiles of 3 um cores. Near-field errors are relative L2 over all six components of the output plane; the focal "
             f"intensity is |E|^2 after angular-spectrum propagation over {three['focal_um']:g} um with pad {three['pad']}. The indicator columns "
             "are the largest neighbour mismatch over the full shared band and over its central half.", '',
             '**Sheet through the absorber (`extend_through_pml=True`)**', '', series_table(three['through_pml']), '',
             'The same tiles on the empty region (no pillars):', '', series_table(three['through_pml_empty'], focal=False), '',
             '**Sheet inside the non-PML region** (the default `Source`), pillar array and empty region:', '',
             series_table(three['truncated_sheet']), '', series_table(three['truncated_sheet_empty'], focal=False), '',
             'RMS relative field error against the distance to the nearest cut, through-absorber sheet, 1.5 um overlap, hard crop:', '',
             distance_table(next(r for r in three['through_pml'] if r['overlap_um'] == 1.5)['error_by_distance']), '',
             '### 3D gradient consistency', '',
             f"Objective: focal intensity summed over the central {2 * gradient3['window_cells']} x {2 * gradient3['window_cells']} cells after "
             f"{three['focal_um']:g} um of propagation; FP32, {gradient3['checkpoints']} device checkpoints, overlap {gradient3['overlap_um']:g} um, "
             f"central differences with delta {gradient3['delta']:g} on the pillar's {strongest['cells']} cells. `Design-cell gradient error` is the "
             f"relative L2 difference between the tiled and full permittivity gradients over the {gradient3['design_cells']:,} pillar cells, "
             "`Whole-grid` over every cell including the absorbers, and the pillar-derivative vector holds the derivative with respect to the "
             "permittivity of each of the 144 pillars.", '',
             gradient_table(three['gradient'], three['project']), '',
             f"Adjoint wall time: tiled {gradient3['tiled_adjoint_seconds']:.1f} s for four tiles, full device {gradient3['full_adjoint_seconds']:.1f} s.", '',
             '### 3D throughput and memory', '', throughput_table(ref, three['throughput']), '',
             f"The reference loop alone took {ref['loop_seconds']:.2f} s ({ref['mcells_per_second']:.0f} Mcells/s) plus {ref['setup_seconds']:.2f} s of setup. "
             "Peak bytes are `torch.cuda.max_memory_allocated` over each run.", '',
             '### 2D variant (CPU)', '',
             f"Rectangles of the same widths along x, {flat['reference']['shape'][0]} x {flat['reference']['shape'][1]} cells for "
             f"{flat['reference']['steps']} steps, two tiles of 3 um cores, sheet through the absorber:", '',
             series_table(flat['through_pml']), '',
             'Sheet inside the non-PML region:', '', series_table(flat['truncated_sheet']), '',
             'A sparse row of four pillars (period 1.25 um): the error is set by the pillars a tile does not contain, and vanishes once both tiles hold the whole row.', '',
             series_table(flat['sparse']), '',
             '### 2D gradient consistency', '',
             f"FP64 on a 0.1 um mesh ({flat['gradient_project']['region']['size'][0]:g} x {flat['gradient_project']['region']['size'][1]:g} um), "
             f"{flat['gradient'][0]['checkpoints']} checkpoints, delta {flat['gradient'][0]['delta']:g}; the objective sums the focal intensity over "
             f"the central {2 * flat['gradient'][0]['window_cells']} cells after {flat['focal_um']:g} um.", '',
             gradient_table(flat['gradient'], flat['gradient_project']), '', END]
    text = DOC.read_text(encoding='utf-8')
    start, end = text.index(START), text.index(END) + len(END)
    DOC.write_text(text[:start] + '\n'.join(parts) + text[end:], encoding='utf-8', newline='\n')
    print('Rendered validation tables into', DOC)


if __name__ == '__main__':
    render()
