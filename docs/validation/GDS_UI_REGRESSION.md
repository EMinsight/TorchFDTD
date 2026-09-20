# GDS dialog integration followup

At implementation revision `d2a4092`, GitHub run
[35529787402](https://github.com/hyoseokp/TorchFDTD/actions/runs/35529787402)
passed 1129 Python tests and skipped 425 hardware/optional cases. The UI job
then failed five tests because the always-created GDS dialog reused the
`source-dialog` and `material-dialog` classes. Existing selectors therefore
matched both the intended panel and the hidden GDS panel. This failed run is
retained, not relabelled as successful.

The followup assigns the GDS dialog its own class and scoped stylesheet.
Existing source/material classes and test selectors are unchanged. Both web
assets are rebuilt. There is no Python solver or numerical-method change.

Targeted browser regression after the fix:

```text
playwright test tests/ui/broadband.spec.js tests/ui/material-fit.spec.js
  tests/ui/materials.spec.js tests/ui/priorities.spec.js
  tests/ui/sources.spec.js tests/ui/gds.spec.js

8 passed, 2 skipped, 36.5 seconds
```

The skipped cases require optional external-format fixtures. The passing
cases include every previously failing flow, the independent GDS import,
project/Python export, and native calculation launched through the UI.
This is a focused regression result, not a claim that the earlier failed CI
run passed. Unchanged physical experiments and Python tests are not rerun
for this style-only followup.
