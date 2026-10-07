# Publishing TorchFDTD on PyPI

The `Publish to PyPI` workflow publishes the wheel already attached to a stable
GitHub release. It checks the GitHub asset digest, the peeled remote tag, a
successful `Verify` run for that exact source commit, and every packaged source
file. It does not rebuild the wheel or upload the examples, manuscripts or local
research files.

## Initial account setup

In the PyPI account that will own `torchfdtd`, verify the primary email address
and enable the account's required two-factor authentication. Open
[account publishing settings](https://pypi.org/manage/account/publishing/) and
add a pending GitHub publisher with these exact values:

| Field | Value |
| --- | --- |
| PyPI project name | `torchfdtd` |
| GitHub owner | `hyoseokp` |
| Repository | `TorchFDTD` |
| Workflow filename | `publish-pypi.yml` |
| Environment | `pypi` |

The workflow uses short-lived OpenID Connect credentials. No PyPI API token
needs to be stored in the repository. The pending publisher creates the PyPI
project on its first successful upload. See the
[PyPI setup guide](https://docs.pypi.org/trusted-publishers/creating-a-project-through-oidc/).

## Publish an existing GitHub release

From GitHub Actions, run `Publish to PyPI` on `main` and enter the stable release
tag, for example `v1.1.7`. The GitHub CLI equivalent is:

```sh
gh workflow run publish-pypi.yml --repo hyoseokp/TorchFDTD --ref main -f tag=v1.1.7
```

The first upload uses the exact v1.1.7 release wheel, SHA-256
`e171aeec5a90eeaa2da2c9f04460f81ca3b9df2a9ec49470ee76b04be0602b5b`.
Its metadata and embedded README remain the original release snapshot. Later
releases carry their own version's metadata. Do not replace a published version
with a different wheel or silently skip a conflicting PyPI upload.

After publishing, the workflow compares PyPI's SHA-256 and a fresh download
with the GitHub release wheel, installs from PyPI with a CPU PyTorch build, and
checks the installed CLI, packaged browser assets and a small CPU simulation.
These installation checks do not claim multi-GPU or a new full-RC validation.

Future stable GitHub releases trigger the same workflow automatically once the
workflow is included in their source tag. GPU users still select an appropriate
PyTorch CUDA build and install the `cuda-kernels` extra.
