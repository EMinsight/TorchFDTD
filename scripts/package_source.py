"""Create a source release from an explicit allowlist, without local secrets."""
from pathlib import Path
import zipfile
import re

folders=['.github','torchfdtd','frontend','examples','tests','scripts','benchmarks','docs']
files=[p for folder in folders for p in Path(folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts]
files += [Path(p) for p in ['README.md','LICENSE','THIRD_PARTY_NOTICES.txt','pyproject.toml','package.json','package-lock.json','vite.config.js','playwright.config.js','.gitignore','.gitattributes']]
version=re.search(r'^version = "([^"]+)"',Path('pyproject.toml').read_text(),re.M)[1]
out=Path(f'dist/torchfdtd-{version}-source.zip');out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for path in files:
        z.write(path,'torchfdtd/'+path.as_posix())
print(f'{out}: {out.stat().st_size:,} bytes, {len(files)} files')
