# Colour-router cross-check

Drivers for the TorchFDTD versus TORCWA cross-check of Section 6.3 of the
manuscript. The device is the single-layer silicon nitride colour router of
arXiv:2608.13019. Its published masks and the rigorous coupled-wave model are in
https://github.com/hyoseokp/information-optimal-color-router (Zenodo
10.5281/zenodo.22099957).

- `torchfdtd_router.py --mode forward|grad|opt --mask MASK --out DIR` runs the
  TorchFDTD side: well fractions and field maps, the adjoint gradient with a
  central-difference check at the interior density 0.1 + 0.8 * mask, or Adam
  steps on the logit of that density.
- `torcwa_reference.py` runs the TORCWA reference with orders (8, 8). Set
  `CR_REPO_SRC` to the `src` directory of the colour-router repository.

The recorded run (docs/validation/color-router-rcwa-3060.json) used the champion
mask before the final despeckling of its archived version. That mask has
SHA-256 a191b0ab25e2da396895482b8ef363b1ce33e9bb1aca1dbccbeb8b880f980a93 and differs from
`data/masks/champion_r1a.npy` in 33 of 16384 pixels.
Arguments of the recorded runs are stored in the record.
