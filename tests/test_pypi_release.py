"""Publication guards against wrong artifacts, private files and stale CI."""
import hashlib
import io
import runpy
import zipfile
from pathlib import Path

import pytest


HELPERS = runpy.run_path(str(Path(__file__).resolve().parents[1] / "scripts" / "prepare_pypi_release.py"))
release_asset = HELPERS["release_asset"]
successful_ci = HELPERS["successful_ci"]
verify_wheel = HELPERS["verify_wheel"]


def release(**changes):
    value = {"tag_name": "v1.1.7", "draft": False, "prerelease": False,
             "assets": [{"name": "torchfdtd-1.1.7-py3-none-any.whl", "digest": "sha256:" + "a" * 64}]}
    value.update(changes)
    return value


@pytest.mark.parametrize("changes", [
    {"draft": True}, {"prerelease": True}, {"tag_name": "v1.1.6"},
    {"assets": []},
    {"assets": [{"name": "torchfdtd-1.1.7-py3-none-any.whl", "digest": None}]},
    {"assets": release()["assets"] * 2},
])
def test_reject_unpublished_wrong_or_ambiguous_release(changes):
    with pytest.raises(ValueError):
        release_asset(release(**changes), "v1.1.7")


def test_accept_only_the_named_wheel_not_other_release_assets():
    data = release()
    data["assets"].append({"name": "research-results.zip", "digest": "sha256:" + "b" * 64})
    assert release_asset(data, "v1.1.7") == ("1.1.7", "torchfdtd-1.1.7-py3-none-any.whl", "a" * 64)


@pytest.mark.parametrize("sha,status,conclusion", [
    ("older", "completed", "success"),
    ("exact", "completed", "cancelled"),
    ("exact", "completed", "failure"),
    ("exact", "in_progress", None),
])
def test_no_ci_success_is_inferred_from_other_commits_or_skips(sha, status, conclusion):
    with pytest.raises(ValueError):
        successful_ci({"workflow_runs": [{"head_sha": sha, "status": status, "conclusion": conclusion}]}, "exact")


def test_ci_receipt_uses_only_the_exact_successful_commit():
    record = {"id": 123, "head_sha": "exact", "status": "completed", "conclusion": "success", "html_url": "https://github.com/example/actions/runs/123"}
    assert successful_ci({"workflow_runs": [record]}, "exact")["head_sha"] == "exact"


def wheel_file(tmp_path, extra=None, changed_source=False):
    sources = {"torchfdtd/__init__.py": b"x = 1\n", "torchfdtd/web/index.html": b"<html></html>"}
    prefix = "torchfdtd-1.1.7.dist-info/"
    members = {**sources, prefix + "METADATA": b"Metadata-Version: 2.4\nName: torchfdtd\nVersion: 1.1.7\n\n",
               prefix + "WHEEL": b"Wheel-Version: 1.0\nTag: py3-none-any\n", prefix + "RECORD": b"",
               prefix + "entry_points.txt": b"[console_scripts]\ntorchfdtd = torchfdtd.cli:main\n",
               prefix + "licenses/LICENSE": b"MIT\n", prefix + "licenses/THIRD_PARTY_NOTICES.txt": b"Notices\n"}
    if changed_source:
        members["torchfdtd/__init__.py"] = b"x = 2\n"
    if extra:
        members.update(extra)
    data = io.BytesIO()
    with zipfile.ZipFile(data, "w") as archive:
        for name, value in members.items():
            archive.writestr(name, value)
    path = tmp_path / "torchfdtd-1.1.7-py3-none-any.whl"
    path.write_bytes(data.getvalue())
    return path, hashlib.sha256(data.getvalue()).hexdigest(), sources


def test_source_identical_wheel_is_accepted(tmp_path):
    path, digest, sources = wheel_file(tmp_path)
    assert verify_wheel(path, "1.1.7", digest, sources) == 2


def test_changed_download_is_rejected_before_any_upload(tmp_path):
    path, _, sources = wheel_file(tmp_path)
    with pytest.raises(ValueError, match="SHA-256"):
        verify_wheel(path, "1.1.7", "0" * 64, sources)


def test_source_drift_is_rejected_even_when_asset_digest_matches(tmp_path):
    path, digest, sources = wheel_file(tmp_path, changed_source=True)
    with pytest.raises(ValueError, match="package bytes"):
        verify_wheel(path, "1.1.7", digest, sources)


@pytest.mark.parametrize("name", ["docs/private-results.json", "../private.txt", "torchfdtd/untracked-secret.txt"])
def test_nonpackage_or_untracked_private_files_are_rejected(tmp_path, name):
    path, digest, sources = wheel_file(tmp_path, {name: b"private"})
    with pytest.raises(ValueError):
        verify_wheel(path, "1.1.7", digest, sources)
