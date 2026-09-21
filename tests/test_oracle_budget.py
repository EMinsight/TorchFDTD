"""Every G3 acceptance case names its oracle classes and layers; docs/ORACLE_BUDGET.md covers every case."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASES = sorted((ROOT/'docs/validation/cases').glob('G3-*.json'))
LAYER_A = {'shared_discrete_operator', 'finite_difference_same_discretisation', 'independent_implementation_same_scheme'}
LAYER_B = {'analytic_continuum', 'analytic_discrete', 'independent_solver', 'physical_invariant', 'convergence_study'}
EITHER = {'stored_record'}
ALLOWED = LAYER_A | LAYER_B | EITHER
LAYER_B_REQUIRED = {'G3-06', 'G3-09', 'G3-10', 'G3-11', 'G3-12', 'G3-16'}
RECORDED_HERE = LAYER_B_REQUIRED | {'G3-14', 'G3-15', 'G3-17'}


def _load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def test_the_recorded_g3_cases_are_present():
    tasks = {_load(path)['task'] for path in CASES}
    assert RECORDED_HERE <= tasks


def test_every_g3_case_names_allowed_oracle_classes_and_layers():
    assert CASES
    for path in CASES:
        case = _load(path)
        assert case['kind'] == 'acceptance_case' and case['task'].startswith('G3-'), path.name
        assert case['declared_before_run'] is True, path.name
        classes = case['oracle_class']
        assert isinstance(classes, list) and classes and set(classes) <= ALLOWED, (path.name, classes)
        tests = case['tests']
        assert tests['existing'], path.name
        layers = tests['layers']
        assert set(layers) == set(tests['existing']), (path.name, set(layers) ^ set(tests['existing']))
        used = set()
        for test_id, entry in layers.items():
            assert entry['layer'] in ('A', 'B'), (path.name, test_id)
            oracle = entry['oracle_class']
            assert oracle in ALLOWED, (path.name, test_id, oracle)
            if oracle in LAYER_A:
                assert entry['layer'] == 'A', (path.name, test_id, oracle)
            elif oracle in LAYER_B:
                assert entry['layer'] == 'B', (path.name, test_id, oracle)
            assert entry['oracle'], (path.name, test_id)
            used.add(oracle)
        assert used == set(classes), (path.name, used ^ set(classes))
        if case['task'] in LAYER_B_REQUIRED:
            assert any(entry['layer'] == 'B' for entry in layers.values()), path.name
        if case['task'] in ('G3-14', 'G3-15'):
            assert all(entry['layer'] == 'A' for entry in layers.values()), path.name


def test_every_listed_test_exists_in_its_source_file():
    for path in CASES:
        for test_id in _load(path)['tests']['existing']:
            source, _, name = test_id.partition('::')
            file = ROOT/source
            assert file.is_file(), (path.name, test_id)
            assert re.search(rf'^def {re.escape(name)}\(', file.read_text(encoding='utf-8'), re.M), (path.name, test_id)


def test_oracle_budget_document_covers_every_g3_case_and_class():
    text = (ROOT/'docs/ORACLE_BUDGET.md').read_text(encoding='utf-8')
    for path in CASES:
        case = _load(path)
        assert case['case_id'] in text, case['case_id']
    for name in ALLOWED:
        assert f'`{name}`' in text, name
    for heading in ('Precision floor', 'Time window', 'PML'):
        assert heading in text
