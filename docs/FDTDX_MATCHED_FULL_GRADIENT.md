# Matched full material-gradient correctness

One 64 x 64 x 64 periodic, scalar-dielectric problem passed the TorchFDTD/FDTDX comparison over 512 steps. Both used the same Linux environment, dynamic FP32 arrays, four device checkpoints, shared material and source arrays, and two raw Ex point histories. This is a correctness result, not a throughput or general feature-parity claim.

The [machine-readable record](validation/fdtdx_periodic_full_gradient.json) contains the exact frozen revisions, wheel and source hashes, environment versions, driver and shared-input hashes, admission criteria, and numerical results. The earlier [16-cubed checks](FDTDX_MATCHED_CORRECTNESS.md) remain separate.

## Matched problem and derivative

The grid spacing is 100 nm and dt is 1.7332498813918235e-16 s, with Courant factor 0.9. A slab with relative permittivity 2.25 occupies z indices 32:40, with vacuum elsewhere. The Ex source is at [32,32,12] and Ex probes are at [32,32,24] and [32,32,48]. Each step updates E, applies the shared additive electric kick, updates H, then samples the probes. FDTDX's reciprocal-permittivity source normalization is matched at the fixed vacuum source cell.

Both frameworks return the complete 64 x 64 x 64 scalar-per-cell epsilon gradient in C-order. Exactly one source cell is excluded from the parameter map and has zero cotangent in both. The other 262143 cells are admitted design variables. The loss is mean(probe0 squared) plus 0.3 times mean(probe1 squared). A separate scalar slab parameter checks the sum of full-gradient entries on the slab. An independent seeded Rademacher direction on the slab checks a directional derivative by centered finite differences.

FDTDX grid construction uses FP64 geometry metadata to preserve the exact spacing and dt. Dynamic fields, material, sources and observations remain FP32. The previous pre-step spacing mismatch and correction are documented in the earlier record.

## Results

| Check | Result |
| --- | --- |
| Raw history maximum absolute error | 0 |
| Raw history relative L2 error | 0 |
| Full epsilon-gradient relative L2 error | 1.0607904931840327e-6 |
| Full epsilon-gradient maximum absolute error | 8.384404281969182e-13 |
| Fixed source-cell cotangent | Exactly 0 in both |
| Native scalar slab VJP | 1.7016259334923234e-6 |
| FDTDX scalar slab VJP | 1.7016234323818935e-6 |
| Native best directional finite-difference relative error | 1.8205494117962687e-4 |
| FDTDX best directional finite-difference relative error | 1.8007912709055773e-4 |

The full-gradient mask contractions also match each framework's independently evaluated scalar slab derivative within the 1e-3 criterion. Centered finite differences use perturbations 0.01, 0.003 and 0.001, with a best-error threshold of 0.005. All individual values and acceptance thresholds are recorded in JSON.

Ambient desktop GPU activity prevented the primary quiet timing criterion. Correctness admission retained free-memory and unrelated-compute checks, but did not require an idle desktop. No performance numbers are included here.

This evidence covers sampled scalar material derivatives for this problem. It does not establish shape gradients, other physics configurations, or equality of unobserved terminal field arrays.
