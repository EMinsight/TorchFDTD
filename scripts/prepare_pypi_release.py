"""Verify and copy the already tested GitHub release wheel for PyPI publishing.

No package is rebuilt here. Only the wheel whose digest and package files
match a stable release with successful Verify CI is admitted.
"""
from __future__ import annotations

import argparse
import email
import hashlib
import io
import json
import re
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = "hyoseokp/TorchFDTD"


def run(*command, binary=False):
    result = subprocess.run(command, cwd=ROOT, capture_output=True, check=True)
    return result.stdout if binary else result.stdout.decode("utf-8").strip()


def release_asset(release, tag):
    match = re.fullmatch(r"v(\d+\.\d+\.\d+)", tag)
    if not match:
        raise ValueError("A stable release tag such as v1.1.7 is required.")
    if release.get("draft") or release.get("prerelease") or release.get("tag_name") != tag:
        raise ValueError("The release must be published, stable and match the requested tag.")
    version = match.group(1)
    name = f"torchfdtd-{version}-py3-none-any.whl"
    assets = [a for a in release.get("assets", []) if a.get("name") == name]
    if len(assets) != 1:
        raise ValueError("The release must contain exactly one expected universal wheel.")
    digest = assets[0].get("digest") or ""
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", digest):
        raise ValueError("The wheel needs a GitHub SHA-256 asset digest.")
    return version, name, digest.split(":", 1)[1]


def successful_ci(data, commit):
    passing = [r for r in data.get("workflow_runs", [])
               if r.get("head_sha") == commit and r.get("status") == "completed"
               and r.get("conclusion") == "success"]
    if not passing:
        raise ValueError("The exact release commit needs successful Verify CI.")
    return {k: passing[0][k] for k in ("id", "head_sha", "html_url", "conclusion")}


def source_files(commit):
    rows = run("git", "ls-tree", "-r", commit, "--", "torchfdtd").splitlines()
    entries = []
    for row in rows:
        meta, path = row.split("\t", 1)
        _, kind, object_id = meta.split()
        if kind != "blob":
            raise ValueError("The package may contain only Git blob files.")
        entries.append((object_id, path))
    if not entries:
        raise ValueError("The release tag has no package files.")
    result = subprocess.run(["git", "cat-file", "--batch"], cwd=ROOT,
                            input="".join(oid + "\n" for oid, _ in entries).encode(),
                            capture_output=True, check=True)
    stream = io.BytesIO(result.stdout)
    sources = {}
    for object_id, path in entries:
        actual_id, kind, size = stream.readline().decode().strip().split()
        if actual_id != object_id or kind != "blob":
            raise ValueError("Git package source lookup failed.")
        sources[path] = stream.read(int(size))
        if stream.read(1) != b"\n":
            raise ValueError("Invalid Git blob framing.")
    return sources


def verify_wheel(path, version, digest, sources):
    payload = Path(path).read_bytes()
    if hashlib.sha256(payload).hexdigest() != digest:
        raise ValueError("Wheel SHA-256 differs from the GitHub release asset.")
    dist_info = f"torchfdtd-{version}.dist-info/"
    with zipfile.ZipFile(io.BytesIO(payload)) as wheel:
        names = wheel.namelist()
        if len(names) != len(set(names)) or wheel.testzip() is not None:
            raise ValueError("The wheel has duplicate or damaged archive members.")
        for name in names:
            posix = PurePosixPath(name)
            if posix.is_absolute() or ".." in posix.parts or "\\" in name:
                raise ValueError("Unsafe wheel member path.")
            if not name.startswith(("torchfdtd/", dist_info)):
                raise ValueError("Only package and distribution metadata files may be published.")
        package_names = {n for n in names if n.startswith("torchfdtd/") and not n.endswith("/")}
        if package_names != set(sources):
            raise ValueError("Wheel package file list differs from the release tag.")
        if any(wheel.read(name) != data for name, data in sources.items()):
            raise ValueError("Wheel package bytes differ from the release tag.")
        metadata = email.message_from_bytes(wheel.read(dist_info + "METADATA"))
        if metadata["Name"] != "torchfdtd" or metadata["Version"] != version:
            raise ValueError("Wheel metadata name/version differs from the release.")
        required = ("torchfdtd/web/index.html", dist_info + "WHEEL",
                    dist_info + "RECORD", dist_info + "entry_points.txt",
                    dist_info + "licenses/LICENSE", dist_info + "licenses/THIRD_PARTY_NOTICES.txt")
        if any(name not in names for name in required):
            raise ValueError("Workbench, CLI or license files are missing.")
    return len(package_names)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", required=True)
    parser.add_argument("--dist-dir", type=Path, default=Path("dist-pypi"))
    parser.add_argument("--receipt", type=Path, default=Path("pypi-release.json"))
    parser.add_argument("--wheel", type=Path, help="Reuse an existing local release wheel.")
    parser.add_argument("--gh", default="gh", help="GitHub CLI executable.")
    args = parser.parse_args()
    if not re.fullmatch(r"v\d+\.\d+\.\d+", args.tag):
        parser.error("--tag must be a stable vX.Y.Z release.")

    def api(endpoint):
        return json.loads(run(args.gh, "api", f"repos/{REPOSITORY}/{endpoint}"))

    release = api(f"releases/tags/{args.tag}")
    version, name, digest = release_asset(release, args.tag)
    commit = run("git", "rev-parse", f"refs/tags/{args.tag}^{{commit}}")
    remote_object = api(f"git/ref/tags/{args.tag}")["object"]
    for _ in range(4):
        if remote_object["type"] == "commit":
            break
        if remote_object["type"] != "tag":
            raise ValueError("The remote release tag does not resolve to a commit.")
        remote_object = api(f"git/tags/{remote_object['sha']}")["object"]
    if remote_object["type"] != "commit" or remote_object["sha"] != commit:
        raise ValueError("Local and remote release tags differ.")
    ci = successful_ci(api(f"actions/workflows/test.yml/runs?head_sha={commit}&status=completed&per_page=100"), commit)
    sources = source_files(commit)
    args.dist_dir.mkdir(parents=True, exist_ok=True)
    if any(p.name != name for p in args.dist_dir.iterdir()):
        raise ValueError("The publication directory must contain only the selected release wheel.")
    with tempfile.TemporaryDirectory(prefix="torchfdtd-pypi-") as tmp:
        if args.wheel is None:
            run(args.gh, "release", "download", args.tag, "--repo", REPOSITORY,
                "--pattern", name, "--dir", tmp)
            source = Path(tmp) / name
        else:
            source = args.wheel.resolve()
        count = verify_wheel(source, version, digest, sources)
        destination = args.dist_dir / name
        if source.resolve() != destination.resolve():
            shutil.copyfile(source, destination)
    receipt = {"repository": REPOSITORY, "tag": args.tag, "version": version,
               "source_commit": commit, "wheel": name, "sha256": digest,
               "package_files_matched": count, "release_url": release["html_url"],
               "ci": ci, "rebuilt": False}
    args.receipt.parent.mkdir(parents=True, exist_ok=True)
    args.receipt.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2))


if __name__ == "__main__":
    main()
