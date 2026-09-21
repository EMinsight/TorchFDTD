# TorchFDTD manuscript

`manuscript.tex` is the canonical editable manuscript. The author is **Hyoseok Park**.
`references.bib` holds the bibliography. The source uses neither em dashes nor semicolons.

The manuscript is a software paper in the form of a Computer Physics Communications
article: introduction, discrete formulation, execution, discrete adjoint,
tiered-memory execution, workbench, validation, performance, discussion and
conclusion. Every number in it comes from a JSON record under `docs/validation`.
The earlier technical draft that listed every development step is kept in
`archive/` for reference and is not built.

## Compile this folder

Use a current TeX Live or MiKTeX installation with pdfLaTeX and BibTeX. From this folder:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape manuscript.tex
bibtex manuscript
pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape manuscript.tex
pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape manuscript.tex
```

Alternatively, run `latexmk -pdf -interaction=nonstopmode -halt-on-error manuscript.tex`.
The checked-in figure PDFs and table files are sufficient. Python, CUDA and the simulator are not needed for this standalone compilation.

## Overleaf

Upload the contents of this folder, or import `torchfdtd-latex-source.zip` as a new project. Select `manuscript.tex` as the main document and pdfLaTeX as the compiler. The ZIP includes only the manuscript, bibliography, figure PDFs, table sources, this guide and an asset provenance record.

## Repository build

From the repository root, with NumPy and Matplotlib available:

```sh
python scripts/build_paper.py
```

The build regenerates three vector figures and thirteen measurement tables from the recorded JSON measurements in `docs/validation`, compiles the TeX and resolves BibTeX citations. It writes the PDF to `docs/paper/torchfdtd-manuscript.pdf` and `output/pdf/torchfdtd-manuscript.pdf`, and a portable source bundle to `output/torchfdtd-latex-source.zip`. Intermediate files stay in `tmp/latex`. No simulation runs during this build. The geometry update adds analytic solid/rotation definitions, bounded host preparation and eight full-wall CUDA ensemble ablations with bitwise output gates. The rectilinear update adds the axis-dependent CFL, explicit node representation, a discrete energy identity, and an eight-workload matched-dt mesh ablation, separate from the cross-library timings.

Use `--keep-assets` to compile the checked-in assets unchanged. Do not edit generated files in `tables` by hand. Update the recorded validation data only after completing the corresponding experiment, then regenerate the assets. `asset-provenance.json` records SHA-256 hashes of the input JSON files.

The interoperability follow-up describes recognized primitive import and existing-geometry and supported scene-settings writeback, including polygon pivots, ordered rotations, untouched-byte preservation and independent native roundtrip checks. These checks use author-generated records and native calculations. They do not establish commercial electromagnetic agreement or general file-format compatibility.

The build checks unresolved references, overfull boxes and the punctuation rule. A rendered page review is still required after layout changes. The manuscript's prose is never regenerated from Markdown.

The mixed-topology follow-up derives exact grouping, memory-limited cohort partitioning and input-order result recovery. Four 16-case RTX 5880 workloads compare complete grouped execution with native and graph-adapted upstream sequences. Grouping overhead, increased allocation and modest gains remain visible.
