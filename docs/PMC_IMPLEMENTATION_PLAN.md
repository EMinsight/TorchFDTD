# Exact-endpoint PMC implementation plan

Status: pending. PEC and anti-symmetric endpoint boundaries are implemented and verified separately. PMC/symmetric labels must remain rejected until this state and transpose contract is complete. This plan contains no vendor execution or equivalence claims.

The existing mesh has N cell intervals with endpoints x_0 and x_N. E_a occupies half nodes along a and integer nodes along transverse axes. H_a occupies integer nodes along a and half nodes along transverse axes. Existing arrays omit every upper integer node. PMC has even tangential E and normal H, and odd normal E and tangential H. Replacing the missing E_t(N) with E_t(N-1) freezes the last H sample and shifts the wall to x_(N-1/2). That shortcut is prohibited.

## Concrete PMC state topology for subsequent implementation

For N_a cells on axis a, complete Yee support has E_a half indices along a and node indices along its two transverse axes, and H_a node indices along a and half indices on its transverse axes. Add an upper node only on a PMC/symmetric face. Upper PEC values remain known zeros and need no storage.

A minimal sparse representation can retain the current volume arrays and add disjoint arrays keyed by (family, component, upper_axes_bitmask):
- E_a needs one upper-face array for each transverse upper PMC axis, plus the edge array where both transverse upper PMC faces intersect. Each selected node axis has length 1, each unselected axis retains N entries.
- H_a needs one upper-face array only if its own normal axis has upper PMC. It has no upper-edge array, since its other two axes are half-staggered.
- No triple-upper-corner field exists on this Yee lattice. E edge values at intersection with a PEC face are constrained zero and must be omitted/projected. Face arrays must exclude separately owned edge locations to avoid duplicate state.
- Every E face/edge requires epsilon and every ADE pole P/J state at exactly that Yee sample. A scalar design-to-Yee material map must define parameter sharing rather than inventing a duplicate independent endpoint parameter. Subpixel cross-component reconstruction needs its own face-aware stencil before admission.

Upper PMC E_t(N) evolves from the normal derivative -2 H_t(N-1/2)/dx_last plus its tangential derivatives of stored H_n(N). Upper H_n(N) evolves from tangential derivatives of stored E_t(N). Interior H_t(N-1/2) uses (E_t(N)-E_t(N-1))/dx_last. For explicit nonuniform nodes, mirrored outer half spacing equals the last cell width. For lower PMC the corresponding factor is +2/dx_first.

The transpose scatters the interior last-half derivative seed to both volume E_t(N-1) and face E_t(N), and scatters face E normal-derivative seed with coefficient -2/dx_last onto volume H_t(N-1/2). Tangential face curls transpose within face arrays and into edge arrays using the same signed incidence. Identity paths and ADE states transpose on each disjoint array. All coefficients use the actual local time-step and material scaling. Euclidean adjoint tests require no arbitrary energy half weights. Energy diagnostics separately need dual-cell quadrature at endpoint nodes.

For X-slab streaming only the global last tile owns X-upper face arrays. Y/Z face arrays extend over slab X and participate in usual halos, while E edges shared with X upper face appear only on the last tile. Stores/checkpoints must include these state tensors explicitly. Byte accounting is sum of each tensor's unique element count, not a padded N+1 volume approximation. CUDA batch compatibility includes the face topology and every face material-state bank. This contract remains unimplemented.


## Acceptance tests and admission

- Keep wall coordinates equal to the requested mesh endpoints, including explicit nonuniform meshes.
- Verify PEC/PEC, PMC/PMC and mixed quarter-wave cavity spectra against discrete analytic dispersion, every active axis and both polarizations.
- Compare a full reflection-compatible domain with its reduced domain using the correct component-dependent Yee reflection indices. Include asymmetric source mistakes as validation failures.
- Test face and edge transpose inner products with independent nonzero volume, face and edge seeds. Compare material gradients with full autograd and finite differences near all walls.
- Match CPU/Torch, real/complex fused CUDA, batch and streamed traces and gradients. Tile cuts must exercise physical faces, internal halos and intersecting upper edges.
- Cover ADE face/edge states, checkpoint replay, storage lifetime, exact memory accounting and serialized source/monitor locations before admitting those combinations.
- Expose PMC/symmetric in model, facade, JSON and UI only after the corresponding numerical path is complete. Update the feature inventory separately from PEC material status. Explicitly reject unsupported subpixel, material, source or storage combinations.

The native PMC and symmetry feature rows remain missing until these requirements are met. No partial storage implementation should be presented as complete boundary support.
