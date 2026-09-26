"""Rejudge the held-out r4 records without repeating optimization or RCWA."""
import json
from pathlib import Path

import pytest

from examples.g7.metagrating import workflow as w

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT/'docs/validation/g7/G7-01'
CRITERIA = ('all_seeds', 'performance', 'rcwa_agreement', 'mesh', 'energy_balance', 'fabrication')


@pytest.fixture
def declaration(monkeypatch):
    monkeypatch.setattr(w, 'CASE_PATH', ROOT/'docs/validation/cases/G7-01r4.json')
    return w.declared()


def test_r4_declaration_keeps_held_out_seeds_and_numeric_limits(declaration):
    case, _, _ = declaration
    settings = w.Settings.declared(case, None)
    assert case['declared_before_run'] and case['revision']['approved_by'] == 'owner'
    assert settings.seeds == (7, 8, 9)
    assert (settings.design_mesh_um, settings.fine_mesh_um, settings.optimization_mesh_um) == (.01, .005, .02)
    assert (settings.physical_time_fs, settings.evaluation_time_fs, settings.band_points) == (560., 2240., 41)
    assert settings.iterations == 6
    assert case['fixture']['three_ridge_segments']['development_seeds'] == [11, 12, 13]


def judged(declaration):
    case, geometry, provenance = declaration
    summary = json.loads((RECORDS/'summary.json').read_text(encoding='utf-8'))
    records = [json.loads((RECORDS/f'seed{seed}.json').read_text(encoding='utf-8')) for seed in (7, 8, 9)]
    baseline = json.loads((RECORDS/'baseline.json').read_text(encoding='utf-8'))
    settings = w.Settings.declared(case, None)
    criteria = json.loads(json.dumps(w.judge(records, case, settings, geometry, baseline)))
    assert summary['provenance'] == provenance
    assert criteria == summary['criteria']
    assert summary['all_passed'] == all(row['passed'] for row in criteria.values())
    return summary, records, criteria


def test_records_are_complete_installed_wheel_runs(declaration):
    _, records, _ = judged(declaration)
    for record in records:
        assert record['iterations'] == 6 and len(record['history']) == 6
        assert len(record['evaluations']) == 8 and len(record['rcwa']) == 4
        assert all(len(row['wavelength_um']) == 41 for row in record['evaluations'])
        assert 'site-packages' in record['environment']['torchfdtd']['file']
        assert not record['environment']['tracked_changes']
        assert record['open_close']['changed_pixels'] == 0
        scores = record['short_design_scores']
        assert scores['selected'] == max(scores['initial'], scores['final'])


@pytest.mark.parametrize('criterion', CRITERIA)
def test_recorded_criterion(declaration, criterion):
    _, _, criteria = judged(declaration)
    assert criteria[criterion]['passed'], criteria[criterion]
