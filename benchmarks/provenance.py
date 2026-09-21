"""Provenance fields shared by the recorded benchmarks."""
import subprocess


def git_revision(root):
    """The checked-out commit, or None when the tree is not a Git checkout.

    Deployed copies of the source tree, such as the workstation used for the
    CUDA validation runs, carry no Git metadata. A record made there keeps its
    source hashes, which identify the code exactly, and reports no revision.
    """
    try:
        return subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True,
                                       stderr=subprocess.DEVNULL).strip()
    except (subprocess.CalledProcessError, FileNotFoundError, OSError):
        return None
