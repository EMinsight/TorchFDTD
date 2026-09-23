"""Publication figures from completed validation records. No solver is run.

This module also holds the shared figure style (palette, fonts, panel labels)
used by scripts/build_paper_assets.py, so every figure in the manuscript is
typeset with one visual system.
"""
from pathlib import Path
import hashlib
import json
import statistics
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Polygon
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs/validation'
OUT = ROOT / 'docs/paper/figures'
if not DATA.is_dir():
    DATA = ROOT / 'anc'
    OUT = ROOT / 'figures'
INPUTS = {}

# Categorical palette validated for lightness, chroma, CVD and normal-vision
# separation against a white surface. Grey is the neutral for references.
BLUE, TEAL, ORANGE, RED, PURPLE = '#2f6db3', '#0f9a8b', '#e07f2c', '#c4423a', '#7a62be'
GREY, INK, MUTED, LINE = '#6b7480', '#24313b', '#4a5560', '#c9ced3'
BLUES = ['#b7cde6', '#7ea6d1', '#4a80bb', '#1f4f86']   # sequential, light to dark
WIDTH = 6.3   # \linewidth of the A4 manuscript with 25 mm margins, in inches
METADATA = {'Author': 'Hyoseok Park', 'CreationDate': None, 'ModDate': None}


def apply_style():
    plt.rcParams.update({
        'font.family': 'Arial', 'font.size': 7.5,
        'mathtext.fontset': 'custom', 'mathtext.rm': 'Arial',
        'mathtext.it': 'Arial:italic', 'mathtext.bf': 'Arial:bold',
        'svg.fonttype': 'none', 'pdf.fonttype': 42, 'ps.fonttype': 42,
        'axes.titlesize': 8, 'axes.labelsize': 7.5, 'axes.labelcolor': INK,
        'xtick.labelsize': 7, 'ytick.labelsize': 7, 'legend.fontsize': 6.8,
        'axes.edgecolor': INK, 'axes.linewidth': 0.6,
        'axes.spines.top': True, 'axes.spines.right': True,
        'xtick.color': INK, 'ytick.color': INK,
        'xtick.major.width': 0.6, 'ytick.major.width': 0.6,
        'xtick.minor.width': 0.4, 'ytick.minor.width': 0.4,
        'xtick.major.size': 2.5, 'ytick.major.size': 2.5,
        'xtick.minor.size': 1.5, 'ytick.minor.size': 1.5,
        'xtick.direction': 'out', 'ytick.direction': 'out',
        'lines.linewidth': 1.3, 'lines.markersize': 4,
        'legend.frameon': False, 'legend.handlelength': 1.6,
        'legend.borderaxespad': 0.2, 'legend.labelspacing': 0.35,
        'savefig.facecolor': 'white', 'text.color': INK,
    })


def panel(ax, letter, title=''):
    """Bold panel letter and a short title, left aligned above the axes."""
    ax.set_title(r'$\mathbf{' + letter + '}$' + ('   ' + title if title else ''),
                 loc='left', fontsize=8, pad=7, color=INK)


def ygrid(ax):
    ax.grid(axis='y', color=LINE, lw=0.5, alpha=0.7)
    ax.set_axisbelow(True)


def read(name):
    p = DATA / name
    INPUTS[name] = hashlib.sha256(p.read_bytes()).hexdigest()
    return json.loads(p.read_text(encoding='utf-8'))


def save(fig, name, png=True):
    OUT.mkdir(exist_ok=True)
    fig.savefig(OUT / (name + '.pdf'), bbox_inches='tight', pad_inches=0.04, metadata=METADATA)
    fig.savefig(OUT / (name + '.svg'), bbox_inches='tight', pad_inches=0.04)
    if png:
        fig.savefig(OUT / (name + '.png'), dpi=220, bbox_inches='tight', pad_inches=0.04)
    plt.close(fig)


# ----------------------------------------------------------------------------
# Figure 1: execution and differentiation schematic
# ----------------------------------------------------------------------------

def architecture():
    """Orthographic algorithm schematic, not a simulated device or field."""
    fig, ax = plt.subplots(figsize=(WIDTH, 4.0))
    fig.subplots_adjust(0, 0, 1, 1)
    ax.set(xlim=(0, 160), ylim=(0, 101.5), aspect='equal')
    ax.axis('off')
    pale = {'blue': '#e4edf7', 'teal': '#dff2ef', 'orange': '#fbeee2', 'grey': '#eef0f2'}

    def text(x, y, s, size=6.8, color=INK, ha='center', va='center', **kw):
        ax.text(x, y, s, fontsize=size, color=color, ha=ha, va=va, **kw)

    def rbox(x, y, w, h, s, edge=INK, fill='white', size=6.8, color=INK, lw=0.7):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=1.4',
                                    facecolor=fill, edgecolor=edge, linewidth=lw))
        text(x + w / 2, y + h / 2, s, size=size, color=color, linespacing=1.25)

    def rect(x, y, w, h, fc='none', ec=INK, lw=0.6, **kw):
        ax.add_patch(Rectangle((x, y), w, h, facecolor=fc, edgecolor=ec, lw=lw, **kw))

    def arrow(a, b, color=INK, lw=0.8, style='-|>', ls='-', ms=6):
        ax.annotate('', b, a, arrowprops=dict(arrowstyle=style, color=color, lw=lw,
                    linestyle=ls, shrinkA=1.5, shrinkB=1.5, mutation_scale=ms))

    def dim(a, b, label, offset=1.6, size=6.2, color=MUTED):
        """Horizontal dimension line between points a and b with a centred label."""
        (x0, y0), (x1, _) = a, b
        ax.annotate('', (x1, y0), (x0, y0), arrowprops=dict(arrowstyle='<|-|>', color=color,
                    lw=0.55, mutation_scale=4, shrinkA=0, shrinkB=0))
        text((x0 + x1) / 2, y0 - offset, label, size=size, color=color)

    def label(x, y, s):
        text(x, y, s, size=9, weight='bold')

    def title(x, y, s):
        text(x, y, s, size=8, ha='left')

    # ---------------- (a) forward map and its transpose ----------------
    label(2, 98.3, 'a'); title(6.5, 98.3, 'Optical model and its discrete transpose')
    fy, fh = 79, 10          # forward row
    ry, rh = 57, 9           # reverse row
    fwd = [(2, 15, 'Design\nparameters $p$'), (22, 17, 'Material\n$\\epsilon(p)$'),
           (87, 20, 'Plane spectra\n$E_\\omega,\\,H_\\omega$'), (112, 22, 'Angular spectrum\n$P_z=F^{-1}H_zF$'),
           (139, 19, 'Objective\n$J$')]
    for x, w, s in fwd:
        rbox(x, fy, w, fh, s, edge=INK, fill='white')
    rev = [(2, 15, 'Gradient\n$\\nabla_{\\!p}J$'), (22, 17, 'Material\ncotangent $\\bar\\epsilon$'),
           (45, 36, 'Transposed sweep\nwith checkpoint replay'), (87, 20, 'Plane\ncotangent'),
           (112, 22, 'Propagation\ntranspose $P_z^{\\mathsf{T}}$'), (139, 19, 'Seed\n$\\bar J=1$')]
    for x, w, s in rev:
        rbox(x, ry, w, rh, s, edge=TEAL, fill=pale['teal'], color=INK)
    # FDTD domain cross-section, schematic geometry only.
    x0, y0, w0, h0 = 45, 73, 36, 22
    rect(x0, y0, w0, h0, fc=pale['grey'], ec=LINE, lw=0.6)
    rect(x0 + 3, y0 + 2.5, w0 - 6, h0 - 5, fc='white', ec='none')
    text(x0 + w0 - 1.2, y0 + 1.3, 'PML', size=5.4, color=MUTED, ha='right')
    ax.plot([x0 + 4, x0 + w0 - 4], [78.4, 78.4], color=ORANGE, lw=1.1, solid_capstyle='butt')
    text(x0 + 4, 76.7, 'source', size=5.4, color=ORANGE, ha='left')
    for px, pw in [(52, 2.6), (57, 3.6), (62.5, 2.6), (68, 3.6), (73.5, 2.6)]:
        rect(px, 81.6, pw, 3.8, fc=BLUE, ec='none')
    text(63, 87.3, 'design region', size=5.4, color=BLUE)
    ax.plot([x0 + 4, x0 + w0 - 4], [90, 90], color=TEAL, lw=1.1, solid_capstyle='butt')
    text(x0 + 4, 91.7, 'plane monitor', size=5.4, color=TEAL, ha='left')
    text(x0 + 1.2, y0 + h0 - 1.3, 'FDTD domain', size=5.6, color=MUTED, ha='left')
    # forward arrows
    for xa, xb in [(17, 22), (39, 45), (81, 87), (107, 112), (134, 139)]:
        arrow((xa, fy + fh / 2), (xb, fy + fh / 2), color=INK)
    # reverse arrows
    for xa, xb in [(139, 134), (112, 107), (87, 81), (45, 39), (22, 17)]:
        arrow((xa, ry + rh / 2), (xb, ry + rh / 2), color=TEAL)
    # transposition links
    for xc in (30.5, 63, 97, 123):
        ax.plot([xc, xc], [ry + rh, fy if xc != 63 else y0], color=TEAL, lw=0.6, ls=(0, (1.2, 1.6)))
    arrow((148.5, fy), (148.5, ry + rh), color=TEAL, lw=0.8)
    text(150.2, (fy + ry + rh) / 2, 'reverse\nsweep', size=5.6, color=TEAL, ha='left')
    text(80, 52.2, 'Every forward kernel has a hand-written transpose. The reverse row is the '
         'discrete adjoint of the row above it.', size=6.2, color=MUTED)
    ax.plot([2, 158], [48.6, 48.6], color=LINE, lw=0.6)

    # ---------------- (b) host-streamed sweep over causal slabs ----------------
    label(2, 45.5, 'b'); title(6.5, 45.5, 'Host-streamed sweep over causal slabs')
    ox, oy = 9, 9.5                  # origin of the space-time diagram
    sw, bh, halo = 8.0, 9.0, 2.1     # slab width, block height, halo width
    nslab, nblock = 6, 3
    current = (2, 2)                 # (block, slab) of the trapezoid on the GPU
    for b in range(nblock):
        y0, y1 = oy + b * bh, oy + (b + 1) * bh
        for k in range(nslab):
            x0, x1 = ox + k * sw, ox + (k + 1) * sw
            state = 'done' if (b, k) < current else ('now' if (b, k) == current else 'todo')
            poly = [(x0 - halo, y0), (x1 + halo, y0), (x1, y1), (x0, y1)]
            fc = {'done': '#c9ced3', 'now': TEAL, 'todo': 'white'}[state]
            ec = {'done': '#9aa3ad', 'now': TEAL, 'todo': LINE}[state]
            ax.add_patch(Polygon(poly, closed=True, facecolor=fc, edgecolor=ec, alpha=0.45 if state != 'todo' else 1,
                                 lw=0.5, ls='-' if state != 'todo' else (0, (1.6, 1.3)), zorder=2))
            if state != 'todo':
                rect(x0, y0, sw, bh, fc=fc, ec=ec, lw=0.5, zorder=3)
            if state == 'now':
                ax.add_patch(Polygon(poly, closed=True, facecolor=TEAL, edgecolor=TEAL, alpha=0.4, lw=0.8, zorder=5))
                rect(x0, y0, sw, bh, fc=TEAL, ec=TEAL, lw=0.5, zorder=5)
                text((x0 + x1) / 2, (y0 + y1) / 2, 'on\nGPU', size=5.8, color='white', zorder=6)
            if (b, k) == (current[0], current[1] + 1):
                text((x0 + x1) / 2, (y0 + y1) / 2, 'next', size=5.6, color=MUTED, zorder=6)
    # axes of the diagram
    xa0, xa1 = ox - halo - 1.5, ox + nslab * sw + halo + 1.5
    ya0, ya1 = oy, oy + nblock * bh + 2.5
    arrow((xa0, oy), (xa1, oy), color=MUTED, lw=0.6, ms=5)
    arrow((xa0, ya0), (xa0, ya1), color=MUTED, lw=0.6, ms=5)
    text((xa0 + xa1) / 2, oy - 2.1, 'position $x$, slabs of $W$ cells', size=6, color=MUTED)
    text(xa0 - 1.2, (ya0 + ya1) / 2, 'time, blocks of $K$ steps', size=6, color=MUTED, rotation=90)
    text(xa1 + 0.8, oy, '$u^{n}$', size=5.8, color=MUTED, ha='left')
    text(xa1 + 0.8, oy + nblock * bh, '$u^{n+3K}$', size=5.8, color=MUTED, ha='left')
    # annotate the current trapezoid
    cx0 = ox + current[1] * sw
    cy1 = oy + (current[0] + 1) * bh
    dim((cx0, cy1 + 1.1), (cx0 + sw, cy1 + 1.1), '$W$', offset=-2.3)
    ax.annotate('halo $K$', (cx0 - halo / 2, oy + current[0] * bh + 0.3), (cx0 - 9, cy1 + 4.2),
                fontsize=5.8, color=TEAL, ha='center',
                arrowprops=dict(arrowstyle='-', color=TEAL, lw=0.5, shrinkA=0, shrinkB=0))
    # memory tiers
    lx = 67
    ax.add_patch(Polygon([(lx - 2.5, 30), (lx + 4.5, 30), (lx + 3.2, 34.5), (lx - 1.2, 34.5)],
                         closed=True, facecolor=TEAL, edgecolor=TEAL, lw=0.5))
    text(lx + 6.2, 32.3, 'GPU VRAM: one slab\nblock of $(W+2K)$ cells\nfor $K$ steps', size=5.5, ha='left', linespacing=1.15)
    for k in range(4):
        rect(lx - 2.5 + k * 1.8, 18.5, 1.8, 4.5, fc='#e3e7eb', ec='#b5bcc4', lw=0.5)
    rect(lx - 2.5 + 1.8, 18.5, 1.8, 4.5, fc=pale['blue'], ec=BLUE, lw=0.6)
    text(lx + 6.2, 20.8, 'Host DRAM: state\nbanks of all slabs and\nblock checkpoints', size=5.5, ha='left', linespacing=1.15)
    arrow((lx + 1, 29.4), (lx + 1, 23.6), color=BLUE, lw=0.6, style='<|-|>', ms=5)
    text(lx + 2.2, 26.5, 'read / write', size=5.4, color=BLUE, ha='left')
    text(47, 2.2, 'Slabs advance one block at a time, left to right. The device holds one slab\n'
         'and the full-domain discrete problem is unchanged.', size=6.0, color=MUTED)
    ax.plot([96, 96], [0.5, 46.5], color=LINE, lw=0.6)

    # ---------------- (c) independent tiles ----------------
    label(100, 45.5, 'c'); title(104.5, 45.5, 'Independent lateral tiles')
    gx, core, ov, pml = 108, 16, 4, 3
    rh, gap, ytop = 6, 3.6, 34.5
    tiles = [('tile 1', 0, BLUE, pale['blue']), ('tile 2', core, TEAL, pale['teal'])]
    for i, (name, cx, col, fill) in enumerate(tiles):
        y = ytop - i * (rh + gap)
        rect(gx + cx - ov - pml, y, pml, rh, fc='#e3e7eb', ec='#b5bcc4', lw=0.5)
        rect(gx + cx + core + ov, y, pml, rh, fc='#e3e7eb', ec='#b5bcc4', lw=0.5)
        for hx in (gx + cx - ov, gx + cx + core):
            rect(hx, y, ov, rh, fc='white', ec=col, lw=0.5, hatch='////')
        rect(gx + cx, y, core, rh, fc=fill, ec=col, lw=0.8)
        text(gx + cx + core / 2, y + rh / 2, name, size=6, color=col)
    ya = ytop - 2 * (rh + gap)
    rect(gx, ya, core, rh * 0.6, fc=BLUE, ec='none')
    rect(gx + core, ya, core, rh * 0.6, fc=TEAL, ec='none')
    ax.plot([gx + core, gx + core], [ya, ya + rh * 0.6], color='white', lw=0.8)
    text(gx + core, ya - 2.4, 'assembled output plane, cores only', size=6, color=INK)
    for i, (name, cx, col, fill) in enumerate(tiles):
        y = ytop - i * (rh + gap)
        arrow((gx + cx + core / 2, y), (gx + cx + core / 2, ya + rh * 0.6), color=col, lw=0.6, ms=5)
    ax.plot([gx + core, gx + core], [ya + rh * 0.6 + 0.5, ytop + rh + 1.2], color=ORANGE, lw=0.7, ls=(0, (2, 1.5)))
    text(gx + core, ytop + rh + 2.6, 'artificial cut', size=5.8, color=ORANGE)
    text(148.5, ytop + rh / 2, 'grey: own PML', size=5.6, color=MUTED, ha='left')
    text(148.5, ytop - rh - gap + rh / 2, 'hatched: overlap', size=5.6, color=MUTED, ha='left')
    text(130, 2.2, 'Each tile is solved on its own, so coupling across the cut\nis lost. The error against the full domain is measured in Fig. 4.',
         size=6.0, color=MUTED)
    save(fig, 'execution-overview')


# ----------------------------------------------------------------------------
# Figure: matched memory and time, separate capacity test
# ----------------------------------------------------------------------------

def memory_cost():
    datasets = [read('cpu-gpu-adjoint-256-' + n + '-5880.json') for n in ('dielectric', 'ade')]
    assert all(d['stage'] == 'complete' for d in datasets)
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH * 0.72, 2.25))
    labels = ['Dielectric', 'Two-pole']
    x = np.arange(2)
    modes = [(-0.19, 'cuda_resident', BLUE, 'Resident'), (0.19, 'cuda_dram', TEAL, 'Host-streamed')]

    def value(d, mode, key):
        if key == 'time':
            return d['median_seconds'][mode]
        return statistics.median(r['peak_torch_cuda_allocated_bytes'] for r in d['records'][mode]) / 1e9

    for ax, key, letter, ttl, ylabel in [(axes[0], 'time', 'a', 'Median full-solve time', 'Wall time (s)'),
                                          (axes[1], 'memory', 'b', 'Median peak device allocation', 'Peak Torch allocation (GB)')]:
        series = {}
        for offset, mode, color, name in modes:
            vals = [value(d, mode, key) for d in datasets]
            series[mode] = vals
            bars = ax.bar(x + offset, vals, 0.36, color=color, label=name, linewidth=0)
            ax.bar_label(bars, labels=[f'{v:.2f}' for v in vals], padding=2.5, fontsize=6.5, color=INK)
        top = max(max(v) for v in series.values())
        for i in x:
            r, s = series['cuda_resident'][i], series['cuda_dram'][i]
            note = f'{s / r:.1f}$\\times$ slower' if key == 'time' else f'{100 * (1 - s / r):.0f}% lower'
            ax.text(i, top * 1.26, note, ha='center', va='bottom', fontsize=6.3, color=MUTED)
        ax.set_xticks(x, labels)
        ax.set_ylabel(ylabel)
        ax.set_ylim(0, top * 1.72)
        ax.tick_params(axis='x', length=0)
        panel(ax, letter, ttl)
        ygrid(ax)
    axes[0].legend(loc='upper left', ncol=2, columnspacing=1.0, handlelength=1.0, handleheight=0.9)
    fig.tight_layout(w_pad=1.8)
    save(fig, 'memory-cost')


# ----------------------------------------------------------------------------
# Figure: independent tiles and exterior propagation
# ----------------------------------------------------------------------------

def hybrid():
    tiled = read('tiled-stitching-3d-3060.json')
    asm = read('angular-spectrum-3060.json')['metalens_3d']
    fig, axes = plt.subplots(2, 2, figsize=(WIDTH, 4.3))
    rows = tiled['through_pml']
    x = np.array([r['overlap_um'] for r in rows])

    ax = axes[0, 0]
    for key, name, color, marker in [('near_error_hard', 'six-component near field', BLUE, 'o'),
                                     ('focal_intensity_error_hard', 'focal-plane intensity', TEAL, 's')]:
        y = np.array([100 * r[key] for r in rows])
        ax.plot(x, y, marker=marker, color=color, ms=4, mfc='white', mew=1.2, label=name)
    ax.legend(loc='upper right')
    ax.set(xlabel='Tile overlap (µm)', ylabel='Relative $L_2$ error (%)', ylim=(0, 14), xlim=(0, 2.75))
    ax.set_xticks([0.5, 1.0, 1.5, 2.0, 2.5])
    panel(ax, 'a', 'Independent-tile error')

    ax = axes[0, 1]
    ratio = np.array([r['total_tile_cells'] / tiled['reference']['cells'] for r in rows])
    ax.plot(x, ratio, marker='o', color=ORANGE, ms=4, mfc='white', mew=1.2)
    ax.axhline(1, color=GREY, ls=(0, (3, 2)), lw=0.8)
    ax.text(0.08, 1.06, 'full grid', fontsize=6.4, color=GREY, va='bottom')
    for xi, ri, r in zip(x, ratio, rows):
        ax.annotate(f"{r['tile_shapes'][0][0]}$^2$", (xi, ri), (0, 6), textcoords='offset points',
                    ha='center', fontsize=5.8, color=MUTED)
    ax.set(xlabel='Tile overlap (µm)', ylabel='Sum of tile cells / full-grid cells', ylim=(0.8, 4.0), xlim=(0, 2.75))
    ax.set_xticks([0.5, 1.0, 1.5, 2.0, 2.5])
    ax.text(0.97, 0.06, f"four tiles of {tiled['tile_um']:g} µm cores, {tiled['reference']['shape'][0]}$^2\\times${tiled['reference']['shape'][2]} reference",
            transform=ax.transAxes, ha='right', va='bottom', fontsize=6.2, color=MUTED)
    panel(ax, 'b', 'Spatial overhead of tiling')

    ax = axes[1, 0]
    z = np.asarray(asm['section']['z_um'])
    err = 100 * np.asarray(asm['section']['intensity_error_per_z'])
    ax.plot(z, err, color=BLUE, lw=1.3)
    zf = asm['section']['focus_fdtd']['z_um']
    ax.axvline(zf, color=TEAL, ls=(0, (3, 2)), lw=0.9)
    ax.text(zf + 0.12, 6.4, f'sampled FDTD focus\n{zf:.3f} µm', fontsize=6.3, color=TEAL, va='top')
    mean = 100 * asm['section']['intensity_error']
    ax.axhline(mean, color=GREY, ls=(0, (1, 1.5)), lw=0.8)
    ax.text(0.05, mean + 0.15, f'section {mean:.2f}%', fontsize=6.3, color=GREY, va='bottom')
    ax.set(xlabel='Distance above output plane (µm)', ylabel='Intensity relative $L_2$ error (%)', ylim=(0, 7.5), xlim=(0, 7.6))
    panel(ax, 'c', 'Exterior propagation accuracy')

    ax = axes[1, 1]
    runs = asm['runs']
    names = [f"FDTD through focus\n{'×'.join(map(str, runs['through_focus']['shape']))}, {runs['through_focus']['steps']} steps",
             f"FDTD to output plane\n{'×'.join(map(str, runs['to_plane']['shape']))}, {runs['to_plane']['steps']} steps",
             f"FFT section\n{runs['asm_section']['planes']} planes"]
    vals = [runs[k]['wall_seconds'] for k in ('through_focus', 'to_plane', 'asm_section')]
    ypos = [2, 1, 0]
    bars = ax.barh(ypos, vals, color=[GREY, BLUE, TEAL], height=0.56, linewidth=0)
    ax.set_xscale('log')
    ax.set_xlim(0.01, 400)
    ax.bar_label(bars, labels=[f'{v:.3g} s' for v in vals], padding=3, fontsize=6.5, color=INK)
    ax.set_yticks(ypos, names, fontsize=6.4)
    ax.tick_params(axis='y', length=0)
    ax.set_xlabel('Recorded wall time (s)')
    ax.grid(axis='x', color=LINE, lw=0.5, alpha=0.7)
    ax.set_axisbelow(True)
    panel(ax, 'd', 'Exterior propagation cost')
    fig.tight_layout(w_pad=2.2, h_pad=2.4)
    save(fig, 'decomposition-propagation')


# ----------------------------------------------------------------------------
# Figure: propagated optical objective on the workstation
# ----------------------------------------------------------------------------

def application():
    p = read('beyond_vram_propagated_3060.json')['record']
    assert p['stage'] == 'complete'
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH, 2.3), gridspec_kw={'width_ratios': [1.35, 1]})
    streamed = p['executions']['streamed']
    fd = streamed['fd']
    runs = p['runs']
    phases = [('Forward solve', runs['streamed_forward']['seconds'], BLUE),
              ('Adjoint sweep', streamed['backward']['seconds'], TEAL),
              ('FD forward +δ', runs['streamed_fd_plus']['seconds'], GREY),
              ('FD forward −δ', runs['streamed_fd_minus']['seconds'], '#98a0a9')]
    total = p['elapsed_seconds']
    other = total - sum(s for _, s, _ in phases)
    phases.append(('Setup and checks', other, '#dfe3e7'))

    ax = axes[0]
    left, narrow = 0.0, 0
    for name, seconds, color in phases:
        minutes = seconds / 60
        ax.barh(0, minutes, left=left, color=color, height=0.5, linewidth=0.6, edgecolor='white')
        centre = left + minutes / 2
        if minutes > 6:      # wide segment: label inside
            ax.text(centre, 0, f'{name}\n{minutes:.2f} min', ha='center', va='center', fontsize=6.4, color='white')
        else:                # narrow segment: staggered label above with a thin leader
            ax.annotate(f'{name} {minutes:.2f} min', (centre, 0.25), (centre, 0.42 + 0.22 * narrow),
                        ha='left' if centre < total / 60 * 0.15 else 'center', va='bottom', fontsize=6.0, color=INK,
                        arrowprops=dict(arrowstyle='-', color=LINE, lw=0.5, shrinkA=0, shrinkB=1))
            narrow += 1
        left += minutes
    ax.set_xlim(0, total / 60 * 1.02)
    ax.set_ylim(-0.5, 1.7)
    ax.set_yticks([])
    for side in ('left', 'top', 'right'):
        ax.spines[side].set_visible(False)
    ax.set_xlabel('Driver wall time (min)')
    ax.text(0.3, 1.45, f"driver total {total / 60:.2f} min, single run on an RTX 3060, "
            f"peak device allocation {streamed['backward']['peak_torch_allocated_bytes'] / 1e9:.2f} GB",
            fontsize=6.3, color=MUTED, va='center')
    panel(ax, 'a', 'Streamed optical-objective evaluation')

    ax = axes[1]
    delta = fd['step']
    xs = np.array([-delta, 0.0, delta])
    js = np.array([fd['objective_minus'], fd['objective'], fd['objective_plus']])
    xx = np.linspace(-delta * 1.15, delta * 1.15, 2)
    ax.plot(xx, js[1] + fd['directional_derivative'] * xx, color=TEAL, lw=1.4,
            label=f"adjoint slope {fd['directional_derivative']:.5f}")
    ax.plot(xx, js[1] + fd['finite_difference'] * xx, color=GREY, lw=1.0, ls=(0, (3, 2)),
            label=f"central difference {fd['finite_difference']:.5f}")
    ax.plot(xs, js, 'o', color=INK, ms=4.5, mfc='white', mew=1.2, label='objective of one forward solve', zorder=5)
    for xi, ji in zip(xs, js):
        ax.annotate(f'{ji:.4f}', (xi, ji), (0, -9), textcoords='offset points', ha='center', fontsize=6.0, color=MUTED)
    ax.set_xticks(xs, [f'−{delta:g}', '0', f'+{delta:g}'])
    ax.set_xlim(-delta * 1.3, delta * 1.3)
    ax.set_ylim(js.min() - 0.0035, js.max() + 0.0035)
    ax.set_xlabel('Permittivity perturbation $\\delta$')
    ax.set_ylabel('Objective (source-dependent units)')
    ax.legend(loc='upper left', fontsize=6.2, handlelength=1.8)
    ax.text(0.97, 0.05, f"relative difference {100 * fd['relative_error']:.2f}%", transform=ax.transAxes,
            ha='right', va='bottom', fontsize=6.4, color=INK)
    panel(ax, 'b', 'End-to-end derivative check')
    fig.tight_layout(w_pad=2.0)
    save(fig, 'propagated-adjoint')


def build_story_figures():
    apply_style()
    architecture(); memory_cost(); hybrid(); application()
    record = {'description': 'Vector schematics and plots from completed records. No new simulation or interpolated field image.',
              'inputs': INPUTS, 'generator_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    (OUT.parent / 'story-figure-provenance.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(record, indent=2))


if __name__ == '__main__':
    build_story_figures()
