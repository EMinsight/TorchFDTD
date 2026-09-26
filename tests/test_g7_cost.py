"""G7-05 record mechanics before the timed GPU acceptance run."""

import json
from pathlib import Path

import pytest

from examples.g7.cost.timing import (STAGES, StageTimes, autotuner_break_even,
                                     stage_regressions, summarize_fresh_processes)


ROOT = Path(__file__).resolve().parents[1]


def records():
    return [dict(iterations=[{stage: float(1+10*process+iteration)
                              for stage in STAGES} for iteration in range(6)])
            for process in range(5)]


def test_declared_stages_and_cold_warm_medians():
    case = json.loads((ROOT/'docs/validation/cases/G7-05.json').read_text(encoding='utf-8'))
    assert tuple(case['fixture']['stages']) == STAGES
    summary = summarize_fresh_processes(records())
    assert summary['process_count'] == 5 and summary['iterations_per_process'] == 6
    cold, warm = summary['cold']['T_forward'], summary['warm']['T_forward']
    assert (cold['min'], cold['median'], cold['max']) == (1., 21., 41.)
    assert (warm['min'], warm['median'], warm['max']) == (4., 24., 44.)
    assert warm['samples'] == [4., 14., 24., 34., 44.]
    assert summary['full_iteration']['cold']['median'] == 7*21.
    assert summary['full_iteration']['warm']['median'] == 7*24.


def test_regression_threshold_and_invalid_records():
    baseline = summarize_fresh_processes(records())
    later = summarize_fresh_processes(records())
    later['warm']['T_forward']['median'] = 1.26*baseline['warm']['T_forward']['median']
    regressions = stage_regressions(baseline, later)
    assert [(r['temperature'], r['stage']) for r in regressions] == [('warm', 'T_forward')]
    later['warm']['T_forward']['median'] = 1.25*baseline['warm']['T_forward']['median']
    assert stage_regressions(baseline, later) == []
    with pytest.raises(ValueError, match='five fresh'):
        summarize_fresh_processes(records()[:4])
    broken = records()
    broken[0]['iterations'][0]['T_forward'] = float('nan')
    with pytest.raises(ValueError, match='finite'):
        summarize_fresh_processes(broken)


def test_cpu_stage_timer_reports_only_declared_stages():
    timer = StageTimes()
    assert timer.call('T_geometry', lambda: 42) == 42
    assert set(timer.report()) == set(STAGES)
    assert timer.report()['T_geometry'] >= 0
    with timer.stage('T_forward'):
        with pytest.raises(RuntimeError, match='double-count'):
            timer.call('T_monitor', lambda: None)
    with pytest.raises(KeyError):
        timer.call('T_unknown', lambda: None)


def test_autotuner_break_even_counts_full_iterations():
    assert autotuner_break_even(5., 1.25, 1.) == 20
    assert autotuner_break_even(5.1, 1.25, 1.) == 21
    assert autotuner_break_even(0., 1.25, 1.) == 1
    assert autotuner_break_even(4., 1., 1.) is None
    assert autotuner_break_even(4., 1., 1.1) is None
    with pytest.raises(ValueError, match='nonnegative'):
        autotuner_break_even(float('nan'), 1., .9)
