"""Compile the canonical LaTeX manuscript and create a portable source bundle."""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import shutil
import subprocess
from zipfile import ZIP_DEFLATED, ZipFile

from build_paper_assets import build_assets

ROOT = Path(__file__).resolve().parents[1]
PAPER = ROOT / 'docs/paper'


def run(command: list[str], cwd: Path, name: str) -> None:
    result = subprocess.run(command, cwd=cwd, capture_output=True,
                            text=True, encoding='utf-8', errors='replace')
    output = result.stdout + result.stderr
    log = cwd / f'{name}.log'
    log.write_text(output, encoding='utf-8')
    if result.returncode:
        raise RuntimeError(f'{name} failed. See {log}\n{output[-7000:]}')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--keep-assets', action='store_true',
                        help='Use the checked-in figure and table assets without regenerating them.')
    args = parser.parse_args()
    engines = {name: shutil.which(name) for name in ('pdflatex', 'bibtex')}
    if not all(engines.values()):
        raise SystemExit('Install TeX Live or MiKTeX with pdflatex and bibtex on PATH.')
    if not args.keep_assets:
        build_assets()
    files = [PAPER / 'manuscript.tex', PAPER / 'references.bib', PAPER / 'README.md',
             PAPER / 'asset-provenance.json', *sorted((PAPER / 'figures').glob('*.pdf')),
             *sorted((PAPER / 'tables').glob('*.tex'))]
    for path in files:
        if path.suffix in {'.tex', '.bib'}:
            content = path.read_text(encoding='utf-8')
            if '\u2014' in content or '---' in content or '\\textemdash' in content or ';' in content:
                raise ValueError(f'Manuscript writing rule violated in {path.name}')

    # The staging directory also checks that the source bundle is self-contained.
    build = ROOT / 'tmp/latex'
    build.mkdir(parents=True, exist_ok=True)
    for path in files:
        destination = build / path.relative_to(PAPER)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, destination)
    job = 'photonweave-manuscript'
    latex = [engines['pdflatex'], '-interaction=nonstopmode', '-halt-on-error',
             '-file-line-error', '-no-shell-escape', f'-jobname={job}', 'manuscript.tex']
    run(latex, build, 'latex-pass-1')
    run([engines['bibtex'], job], build, 'bibtex-pass')
    run(latex, build, 'latex-pass-2')
    run(latex, build, 'latex-pass-3')
    log = (build / f'{job}.log').read_text(encoding='utf-8', errors='replace')
    issues = [line for line in log.splitlines()
              if re.search(r'Overfull \\[hv]box|undefined|multiply defined|Rerun to get', line)]
    if issues:
        raise RuntimeError('Resolve manuscript layout/reference issues before delivery:\n'+'\n'.join(issues))

    output = ROOT / 'output/pdf'
    output.mkdir(parents=True, exist_ok=True)
    for destination in (PAPER / f'{job}.pdf', output / f'{job}.pdf'):
        shutil.copyfile(build / f'{job}.pdf', destination)
    bundle = ROOT / 'output/photonweave-latex-source.zip'
    with ZipFile(bundle, 'w', ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, path.relative_to(PAPER).as_posix())
    print(f'Compiled PDF: {output / (job+".pdf")}')
    print(f'Portable LaTeX source: {bundle}')
    print('Reference and overfull-box checks passed. Render the PDF for visual review.')


if __name__=='__main__':
    main()
