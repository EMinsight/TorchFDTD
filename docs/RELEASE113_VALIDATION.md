# TorchFDTD 1.1.3 validation

## Patch validation scope

This patch uses changed-scope validation for fixed host observation tables,
recorded plane spectra and their adjoints, common observation gathers,
PMC fallbacks, memory admission and version metadata. The installed-wheel
record will be linked here when these checks complete.

The complete WORKSTATION gate replay, `release-full` suite and unchanged
application benchmarks are outside this patch run. Historical gate records
remain attached to the sources they tested. Multi-GPU execution remains
unvalidated.

## Performance and accuracy

The [three-repeat comparison](validation/observation_table_cache.json) used
224 x 224 x 32 cells, 32 steps, two dense field planes, three frequencies and
1,204,224 observations on an RTX 3060. Median forward-plus-gradient time was
5.432 s with table reuse disabled and 0.813 s with reuse enabled, an 85.0%
reduction. Forward-only time was 2.015 s and 0.656 s, a 67.5% reduction.
All compared spectra and material gradients were bitwise identical.

These are warmed repeated solves on the same model. Model construction and
warm-up are excluded. This improvement comes from host index preparation
and does not measure a faster time-step kernel. The benefit depends on the
observation count, time-step count and host. Reused host tables retain the
exact observation order. Each solve creates its own CUDA maps and bindings.

## Artifact

The release will use the exact wheel exercised by clean-install and scoped
checks. The final record will list its SHA-256 and installed source check.
