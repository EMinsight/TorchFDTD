# Public launch and outreach plan

Status: preparation only. No public launch or social post has occurred.

Latest author instruction: report completion first and obtain fresh explicit
approval before publishing any X or Reddit promotion. Earlier conditional
promotion authorization is superseded. Readiness alone does not authorize a
post. No social announcement may be sent until that later approval arrives.

## User authorization and objective

On 2026-09-20 the author requested public promotion on their own X account once
TorchFDTD has demonstrated clear advantages against the previously considered
open-source solvers and Lumerical FDTD, with release-ready UI, Python API and
library usability. Relevant Reddit announcements are also authorized if useful.
The outreach goal is 100 organic GitHub stars, not a promised outcome.

Credit Hyoseok Park as the project author and acknowledge development assistance
from Astra. This does not imply endorsement by OpenAI. Verify the intended
signed-in social account before posting. Do not infer a handle from an email.

The author supplied `qkrgytjr12@gmail.com` as the project contact. This is not
authorization to send promotional email or create a social account.

## Current evidence and remaining launch work

At revision `0c72990`, the verified CUDA improvements are internal comparisons:
one CR case's complete forward evaluation is 3.75 times faster than our Torch
forward path, and its objective/gradient evaluation is 1.55 times faster than
our Torch backward path on an RTX 3060. These are not Lumerical or competing
open-source solver speedups. See COMPLEX_CUDA.md and COMPLEX_CUDA_ADJOINT.md.

The full 9-wavelength, 16-ray CR evaluation and gradient validation are still
running. Complex spatial out-of-core support and full inverse-design convergence
remain incomplete. UI parity and a general replacement claim have not passed
the release gates. Keep the repository private and the announcement unpublished
until the evidence and distribution review satisfy the requested conditions.

Prepare the launch in this order: reproducible numerical evidence, clean
installation and Python tutorial, a tested UI demonstration, README comparison
and limitations, then X and appropriately targeted Reddit announcements.
Use 100 organic stars as the campaign target, with milestones at 25, 50 and 100.
Do not buy engagement, automate star requests, or promise the target will be met.

## Release gates

- Complete the runtime sequence in CR_VALIDATION_PLAN.md and its subsequent CR
  validation. Spatial out-of-core execution is distinct from checkpoint offload.
- Establish useful, reproducible advantages against relevant open-source
  baselines, including FDTDX, fdtdz, flaport/fdtd and fdtd3d where comparable
  features and hardware are available. Report unavailable comparisons explicitly.
- Make the Lumerical comparison the main timing table only when the comparison
  is cleared for publication. Preserve the restrictions in RELEASE_REVIEW.md.
  Do not run new commercial experiments merely to prepare marketing copy.
- Compare equivalent physical problems at matched accuracy. Include versions,
  hardware, precision, boundary conditions, mesh, stopping criteria, warm-up,
  repetitions and both solver time and complete task time. Identify CPU and GPU
  baselines separately. Publish limitations and regressions as well as wins.
- Validate geometry-to-objective gradients, long-run memory scaling, supported
  physics and inverse-design convergence. Scope differentiability claims to the
  verified feature matrix. No blanket fully-differentiable claim while unsupported
  materials, boundaries, sources or observables remain.
- Verify clean installation and a UI workflow covering geometry, materials,
  mesh, boundaries, source wavelength, monitors, execution and result inspection.
  Reproduce it through Python alone and test save/load, batch execution,
  cancellation and actionable error reporting. Familiarity claims need user
  workflow evidence. UI superiority is not established by screenshots alone.
- Complete the provenance, dependency, packaged-file and documentation gates in
  RELEASE_REVIEW.md. A marketing request does not mark those gates passed.
- Link a public tagged release, working installation instructions and runnable
  examples. Check the final post against the exact released revision.

## Claim ledger

| Proposed claim | Required evidence |
| --- | --- |
| Faster than Lumerical | Cleared matched-accuracy benchmarks, named workload and measured speedup |
| Faster than other GPU FDTD libraries | Reproducible comparable versioned baselines, not a CPU-only comparison |
| Differentiable through PyTorch | Geometry/material/objective derivative checks with an explicit supported scope |
| Larger than GPU memory | Measured streamed simulation and gradients with complete tier memory accounting |
| Practical replacement | Validated user workflows and an explicit feature/limitation matrix |
| Batch inverse design | Measured end-to-end optimization throughput and actual concurrent execution |

An improvement over our own Torch backward is an internal ablation. It cannot be
presented as a speedup over any external solver.

## Campaign assets

1. Record a short real UI demo showing scene setup, fields and a converging
   inverse-design run. Label any time-lapse or precomputed playback.
2. Create one legible benchmark graphic linked to reproduction instructions and
   the complete table, followed by a concise tested Python example.
3. Put the same evidence, installation and scope in the README hero and release
   notes so readers can reproduce the demonstration.
4. Publish one X announcement and a small supporting thread. Lead with the
   practical research problem, acknowledge Astra, show measured benefits and
   link the repository. Invite feedback and an optional star if useful.
5. Select relevant Reddit communities only after reading their current rules.
   Identify the author relationship, tailor each post to the community and
   avoid repetitive cross-posts or unsolicited messages.
6. Record post URLs and release revision after successful submission. Reconcile
   uncertain submissions before retrying to prevent duplicates. Track stars,
   reproducible installations and useful bug reports, not stars alone.

## Reference examples

[Compositor](https://github.com/robbietilton/Compositor) introduces an identifiable
workflow problem and explains concrete familiar editing features. Adopt that
clarity and demonstration focus, not its wording, assets or implied feature
parity. Its public page showed approximately 2.2k stars on the latest inspection
on 2026-09-20. This does not establish which outreach caused the stars.

[Patchy](https://github.com/SethRobinson/Patchy) is another relevant reference for
presenting compatibility through concrete workflows and tests.

A candidate X reference is https://x.com/gxjo_dev/status/2099171115667259776,
discovered through a third-party discussion. Direct access returned HTTP 403.
Its exact contents and identity as the user's intended example remain unverified.

## Draft structure, not publishable text

With Astra's help, I built TorchFDTD, an open-source CUDA FDTD solver for
photonic inverse design with a Python API and a visual workspace.

[Insert only verified differentiability scope and measured advantage, naming
the benchmark, hardware, reference solver and accuracy criterion.]

[Attach the real demo, public release URL, reproducible benchmark link and
supported-feature matrix. Invite testing and feedback.]

Do not publish bracketed placeholders or imply unrestricted replacement while
the release gates remain open.
