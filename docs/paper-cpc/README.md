# Computer Physics Communications submission

This folder holds the Computer Physics Communications (CPC, Elsevier) version of
the TorchFDTD manuscript. It is maintained separately from the arXiv version in
`docs/paper`. Edit `manuscript-cpc.tex` and `supplementary-cpc.tex` directly.
Changes to one version are not copied to the other.

| File | Content |
|---|---|
| `manuscript-cpc.tex` | Main text in the Elsevier `elsarticle` class, from the CPC Computer Programs in Physics (CPiP) template |
| `supplementary-cpc.tex` | Supplementary Material, Sections S1 to S11 with their figures and tables |
| `highlights.txt` | The 3 to 5 highlights, each at most 85 characters |
| `references.bib` | Bibliography of the CPC version, style `elsarticle-num-names` |
| `si-numbers.tex` | Section numbers of the Supplementary Material, written by the build |
| `figures/`, `tables/` | Figures and tables used only by this version, written by `scripts/build_cpc_assets.py` |
| `cpc-asset-provenance.json` | SHA-256 of every record read by `scripts/build_cpc_assets.py` |

The other figures and tables are shared with the arXiv build and are read from
`docs/paper/figures` and `docs/paper/tables`. Run `python scripts/build_paper.py`
first when validation records change.

Each Supplementary Section carries a label `si:<key>`, and the main text cites
it as `\suppsec{<key>}`. The build numbers the sections S1, S2, ... in their
order in the Supplementary Material and stops if the main text cites a key that
does not exist.

## Build

```sh
python scripts/build_cpc.py
```

The build compiles both documents with pdfLaTeX and BibTeX and checks them
against the CPC guide for authors:

- abstract of at most 250 words
- Program Summary fields of about 50 to 250 words, with the required entries
- 1 to 7 keywords, 3 to 5 highlights of at most 85 characters
- Supplementary Sections S1 to S5 in the order the main text cites them
- CRediT, competing-interest, generative-AI and data-availability sections
- no overfull boxes and no unresolved references

It writes the submission files to `output/cpc`:

| File | Upload in Editorial Manager as |
|---|---|
| `TorchFDTD-CPC-manuscript.pdf` | review copy of the manuscript |
| `TorchFDTD-CPC-latex-source.zip` | LaTeX source files (tex, bib, bbl, figures, tables) |
| `TorchFDTD-CPC-supplementary-material.pdf` | Supplementary Material |
| `TorchFDTD-CPC-highlights.docx` | Highlights (editable file with "highlights" in its name) |
| `TorchFDTD-CPC-program-files.zip` | program files (source, README, tests, validation records) from the committed HEAD |

Every `\authorcheck{...}` left in the source is printed at the end of the build.
These are items only the author can supply, such as the funding statement.
The declaration of competing interest is also produced as a Word document with
Elsevier's declaration tool during submission.
