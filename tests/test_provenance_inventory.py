"""G9-02: the provenance inventory is current, its scan of the tracked tree is clean
and the generated notices and SBOM carry no private path themselves."""
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import provenance_inventory as inventory  # noqa: E402

try:
    import tomllib
except ImportError:
    import tomli as tomllib
from packaging.requirements import Requirement  # noqa: E402
from packaging.utils import canonicalize_name  # noqa: E402

HANGUL_USER = chr(0xC5F0) + chr(0xAD6C) + chr(0xC2E4)
# The samples are assembled here so that no tracked file spells the historic path.
ADMIN = 'ad' + 'min'


def test_inventory_check_passes_on_the_tracked_tree():
    result = subprocess.run([sys.executable, str(ROOT / 'scripts' / 'provenance_inventory.py'), '--check'],
                            cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    summary = json.loads(result.stdout[result.stdout.index('{'):])
    assert result.returncode == 0, (summary, result.stderr[-800:])
    assert summary['findings'] == [] and summary['problems'] == []
    assert summary['components'] == summary['installed'] > 20
    assert summary['pip_check'] == 0


@pytest.mark.parametrize('kind, sample', [
    ('private_windows_user_path', 'scratch C:/Users/' + ADMIN + '/photonweave/.local'),
    ('private_windows_user_path', json.dumps({'dir': 'C:\\Users\\' + ADMIN + '\\photonweave'})),
    ('private_windows_user_path', 'c:\\Users\\' + HANGUL_USER + '\\Desktop'),
    ('hangul_user_path', 'C:/Users/' + HANGUL_USER + '/AppData'),
    ('address_100_x_x_x', 'ssh admin@100.123.54.121'),
    ('address_100_x_x_x', 'http://100.79.210.20:9802/'),
    ('password_literal', "password = 'hunter2'"),
    ('password_literal', 'PASSWD: "1234"'),
    ('ssh_password_environment', 'TORCHFDTD_SSH_PASSWORD="letmein"'),
    ('credential_token', 'token ghp_' + 'A' * 36 + ' end'),
    ('credential_token', 'AKIA' + 'Q' * 16),
    ('credential_token', 'tskey-auth-abcdefghijklmnop'),
    ('private_key_block', '-----BEGIN OPENSSH PRIVATE KEY-----'),
    ('ssh_public_key', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIABCDEFGHIJKLMNOPQRSTUVWXYZ user@host'),
])
def test_scan_patterns_catch_the_named_secrets(kind, sample):
    assert re.search(inventory.SCAN_PATTERNS[kind], sample), (kind, sample)


@pytest.mark.parametrize('sample', [
    'C:/Users/' + ADMIN + 'istrator/x', 'C:/Users/public/x', 'D:/TorchFDTD/.local/tmp', 'version 100.0.1',
    'numpy 1.100.2.3 is not an address', "os.environ.get('TORCHFDTD_SSH_PASSWORD')",
    '$env:TORCHFDTD_SSH_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)',
    'the password is requested interactively', 'ssh-ed25519 keys are accepted',
])
def test_scan_patterns_ignore_benign_text(sample):
    assert not [kind for kind, pattern in inventory.SCAN_PATTERNS.items() if re.search(pattern, sample)], sample


def test_sbom_covers_every_declared_dependency_with_licence_and_source():
    sbom = json.loads(inventory.SBOM.read_text(encoding='utf-8'))
    pyproject = tomllib.loads((ROOT / 'pyproject.toml').read_text(encoding='utf-8'))
    components = {c['name']: c for c in sbom['components']}
    declared = list(pyproject['project']['dependencies'])
    for group, specs in pyproject['project']['optional-dependencies'].items():
        declared += specs
    for spec in declared:
        name = canonicalize_name(Requirement(spec).name)
        assert name in components, name
        record = components[name]
        assert record['installed'] and record['version'] and record['source_url'], record
        assert record['license'] or any(item['name'] == f"pip: {name} {record['version']}" for item in sbom['open_items']), record
    unlicensed = [c['name'] for c in sbom['components'] if c['license'] is None]
    assert all(any(item['name'].startswith(f'pip: {name} ') for item in sbom['open_items']) for name in unlicensed), unlicensed
    assert sbom['project'] == dict(name='torchfdtd', version=pyproject['project']['version'], license='MIT',
                                   license_files=['LICENSE', 'THIRD_PARTY_NOTICES.txt'], requires_python='>=3.10')
    lock = json.loads((ROOT / 'package-lock.json').read_text(encoding='utf-8'))['packages']
    assets = {a['name']: a for a in sbom['assets']}
    assert assets['three.js']['version'].startswith(lock['node_modules/three']['version'])
    assert assets['lucide']['version'] == lock['node_modules/lucide']['version']
    assert {item['name'] for item in sbom['open_items']} >= {'Installed-API property catalogue', 'FSP layout support', 'Aggregate commercial timing table'}
    assert all(item['state'] == 'BLOCKED_EXTERNAL' for item in sbom['open_items'])
    assert sbom['scan']['findings'] == []
    assert sbom['history_note']['commits'] and all(len(c['commit']) == 12 for c in sbom['history_note']['commits'])


def test_notices_document_matches_the_sbom_and_names_the_open_items():
    sbom = json.loads(inventory.SBOM.read_text(encoding='utf-8'))
    text = inventory.NOTICES.read_text(encoding='utf-8')
    assert text == inventory.markdown(sbom)
    assert '## Open items (BLOCKED_EXTERNAL)' in text and '### Known history note' in text
    for item in sbom['open_items']:
        assert item['name'] in text
    for commit in sbom['history_note']['commits']:
        assert commit['commit'] in text
    assert 'No finding in the tracked tree.' in text
    assert (ROOT / 'THIRD_PARTY_NOTICES.txt').exists()


def test_generated_outputs_carry_no_private_path_or_credential():
    for path in (inventory.SBOM, inventory.NOTICES):
        text = path.read_text(encoding='utf-8')
        hits = [(kind, text[:m.start()].count('\n') + 1) for kind, pattern in inventory.SCAN_PATTERNS.items() for m in re.finditer(pattern, text)]
        assert hits == [], (path.name, hits)
        assert HANGUL_USER not in text and 'site-packages' not in text and '.venv' not in text, path.name
