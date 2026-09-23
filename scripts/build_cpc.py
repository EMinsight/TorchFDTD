"""Build the Computer Physics Communications submission: manuscript, Supplementary Material, highlights and sources.

The CPC version lives in docs/paper-cpc and is maintained separately from the arXiv version in docs/paper.
Figures and generated tables are shared with the arXiv build (docs/paper/figures, docs/paper/tables), so run
scripts/build_paper.py first when records change. This script runs no solver.

Checks against the CPC guide for authors: abstract at most 250 words, Program Summary fields of about 50 to 250
words, 1 to 7 keywords, 3 to 5 highlights of at most 85 characters, Supplementary Sections S1 to S5 in the order the
main text cites them, no overfull boxes and no unresolved references.
"""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
CPC = ROOT / 'docs/paper-cpc'
SHARED = ROOT / 'docs/paper'
BUILD = ROOT / 'tmp/cpc'
OUT = ROOT / 'output/cpc'
MAIN, SUPP = 'manuscript-cpc', 'supplementary-cpc'
SI_ORDER = ['Anisotropic media and magnetic walls', 'Radiation projections', 'Guided-mode ports',
            'Independent lateral tiles', 'Batch execution']


def words(text: str) -> int:
    text = re.sub(r'\\[a-zA-Z]+\*?(\[[^]]*\])?', ' ', text)
    text = re.sub(r'[{}$~]', ' ', text)
    return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9.,%'\-^/]*", text))


def check_front_matter(tex: str) -> dict:
    abstract = re.search(r'\\begin\{abstract\}(.+?)\\noindent \\textbf\{PROGRAM SUMMARY\}', tex, re.S).group(1)
    report = {'abstract_words': words(abstract)}
    if report['abstract_words'] > 250:
        raise ValueError(f"Abstract has {report['abstract_words']} words, CPC allows 250.")
    summary = re.search(r'\\textbf\{PROGRAM SUMMARY\}(.+?)\\end\{abstract\}', tex, re.S).group(1)
    for field in ('Nature of problem', 'Solution method', 'Additional comments including restrictions and unusual features'):
        m = re.search(re.escape('{\\em ' + field + ':}') + r'(.+?)(?=\{\\em |\\end\{small\})', summary, re.S)
        count = words(m.group(1))
        report[field] = count
        if not 50 <= count <= 250:
            raise ValueError(f'Program Summary field "{field}" has {count} words, CPC asks for about 50 to 250.')
    for required in ('Program Title', 'CPC Library link to program files', "Developer's repository link",
                     'Licensing provisions', 'Programming language'):
        if '{\\em ' + required not in summary:
            raise ValueError(f'Program Summary lacks "{required}".')
    keywords = re.search(r'\\begin\{keyword\}(.+?)\\end\{keyword\}', tex, re.S).group(1).split('\\sep')
    report['keywords'] = len(keywords)
    if not 1 <= len(keywords) <= 7:
        raise ValueError(f'{len(keywords)} keywords, CPC asks for 1 to 7.')
    for section in ('CRediT authorship contribution statement', 'Declaration of competing interest',
                    'Declaration of generative AI', 'Data availability'):
        if '\\section*{' + section not in tex:
            raise ValueError(f'Missing section "{section}".')
    return report


def check_highlights(path: Path) -> list[str]:
    lines = [line.strip() for line in path.read_text(encoding='utf-8').splitlines() if line.strip()]
    if not 3 <= len(lines) <= 5:
        raise ValueError(f'{len(lines)} highlights, CPC asks for 3 to 5.')
    for line in lines:
        if len(line) > 85:
            raise ValueError(f'Highlight longer than 85 characters ({len(line)}): {line}')
    return lines


def check_supplement(tex: str, si: str) -> None:
    titles = re.findall(r'\\section\{([^}]+)\}', si)
    if titles != SI_ORDER:
        raise ValueError(f'Supplementary sections are {titles}, the main text cites {SI_ORDER}.')
    cited = sorted({int(n) for n in re.findall(r'\\suppsec\{(\d)\}', tex)}
                   | {int(n) for n in re.findall(r'Sections?~S(\d)', tex)})
    if not cited or max(cited) > len(titles):
        raise ValueError(f'Main text cites Supplementary Sections {cited}.')


def run(command: list[str], name: str) -> None:
    result = subprocess.run(command, cwd=BUILD, capture_output=True, text=True, encoding='utf-8', errors='replace')
    (BUILD / f'{name}.log').write_text(result.stdout + result.stderr, encoding='utf-8')
    if result.returncode:
        raise RuntimeError(f'{name} failed, see {BUILD / (name + ".log")}\n{(result.stdout + result.stderr)[-5000:]}')


def compile_document(job: str, bibliography: bool) -> None:
    latex = [shutil.which('pdflatex'), '-interaction=nonstopmode', '-halt-on-error', '-file-line-error',
             '-no-shell-escape', f'{job}.tex']
    run(latex, f'{job}-pass-1')
    if bibliography:
        run([shutil.which('bibtex'), job], f'{job}-bibtex')
    run(latex, f'{job}-pass-2')
    run(latex, f'{job}-pass-3')
    log = (BUILD / f'{job}.log').read_text(encoding='utf-8', errors='replace')
    if 'Rerun to get' in log:   # line numbers and hyperref anchors can need one more pass
        run(latex, f'{job}-pass-4')
        log = (BUILD / f'{job}.log').read_text(encoding='utf-8', errors='replace')
    issues = [line for line in log.splitlines()
              if re.search(r'Overfull \\[hv]box|undefined|multiply defined|Rerun to get', line)]
    if issues:
        raise RuntimeError(f'{job}: resolve layout and reference issues:\n' + '\n'.join(issues))


def main() -> None:
    if not (shutil.which('pdflatex') and shutil.which('bibtex')):
        raise SystemExit('Install TeX Live or MiKTeX with pdflatex and bibtex on PATH.')
    tex = (CPC / f'{MAIN}.tex').read_text(encoding='utf-8')
    si = (CPC / f'{SUPP}.tex').read_text(encoding='utf-8')
    for name, content in ((MAIN, tex), (SUPP, si)):
        if '\u2014' in content or '---' in content or ';' in content:
            raise ValueError(f'Writing rule violated in {name}.tex (em dash or semicolon).')
    report = check_front_matter(tex)
    highlights = check_highlights(CPC / 'highlights.txt')
    check_supplement(tex, si)

    # Stage the sources with the shared figures and tables that they reference.
    if BUILD.exists():
        shutil.rmtree(BUILD)
    BUILD.mkdir(parents=True)
    staged = []
    for name in (f'{MAIN}.tex', f'{SUPP}.tex', 'references.bib'):
        shutil.copyfile(CPC / name, BUILD / name)
        staged.append(name)
    needed = set()
    for content in (tex, si):
        needed.update(n if Path(n).suffix else n + '.tex' for n in re.findall(r'\\input\{([^}]+)\}', content))
        needed.update(re.findall(r'\\includegraphics(?:\[[^]]*\])?\{([^}]+)\}', content))
    for name in sorted(needed):
        (BUILD / name).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(SHARED / name, BUILD / name)
        staged.append(name)

    compile_document(MAIN, bibliography=True)
    compile_document(SUPP, bibliography=False)

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    shutil.copyfile(BUILD / f'{MAIN}.pdf', OUT / 'TorchFDTD-CPC-manuscript.pdf')
    shutil.copyfile(BUILD / f'{SUPP}.pdf', OUT / 'TorchFDTD-CPC-supplementary-material.pdf')
    shutil.copyfile(CPC / 'highlights.txt', OUT / 'TorchFDTD-CPC-highlights.txt')
    try:
        import docx
        document = docx.Document()
        document.add_heading('Highlights', level=1)
        for line in highlights:
            document.add_paragraph(line, style='List Bullet')
        document.save(OUT / 'TorchFDTD-CPC-highlights.docx')
    except ImportError:
        print('python-docx is not installed, so only the plain-text highlights were written.')
    with ZipFile(OUT / 'TorchFDTD-CPC-latex-source.zip', 'w', ZIP_DEFLATED) as archive:
        for name in staged:
            archive.write(BUILD / name, name)
        archive.write(BUILD / f'{MAIN}.bbl', f'{MAIN}.bbl')
    # CPiP submissions also upload the program files: source, README, tests and the validation records that serve as
    # sample input and output. The archive is the committed HEAD, so uncommitted edits are never shipped.
    head = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    subprocess.run(['git', 'archive', '--format=zip', f'--prefix=TorchFDTD-{head}/',
                    '-o', str(OUT / 'TorchFDTD-CPC-program-files.zip'), 'HEAD'], cwd=ROOT, check=True)
    print(f'Program files: TorchFDTD-CPC-program-files.zip from commit {head}')
    print('CPC checks:', report, f'highlights={len(highlights)}')
    print(f'Submission files: {OUT}')
    pending = re.findall(r'\\authorcheck\{([^}]*)\}', tex.split('\\newcommand{\\authorcheck}')[1].split('\n', 1)[1])
    for item in pending:
        print('AUTHOR ITEM TO COMPLETE BEFORE SUBMISSION:', item[:120])


if __name__ == '__main__':
    main()
