"""Entry point for the proposed G7-01r4 constrained-segment workflow.

The case file is a draft until the owner approves it. Do not run held-out
seeds 7-9 or report a G7-01 pass before that approval and declaration commit.
"""
from . import workflow

workflow.CASE_PATH = workflow.ROOT/'docs/validation/cases/G7-01r4.json'


def main(argv=None):
    case, _ = workflow.load_json(workflow.CASE_PATH)
    revision = case.get('revision', {})
    if (case.get('declared_before_run') is not True
            or not revision.get('approved_by')
            or 'draft_status' in case):
        raise RuntimeError(
            'G7-01r4 is a draft. Owner approval and a committed declaration '
            'are required before any declared workflow stage runs.')
    return workflow.main(argv)


if __name__ == '__main__':
    main()
