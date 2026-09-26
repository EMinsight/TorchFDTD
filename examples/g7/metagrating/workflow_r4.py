"""Entry point for the proposed G7-01r4 constrained-segment workflow.

The case file is a draft until the owner approves it. Do not run held-out
seeds 7-9 or report a G7-01 pass before that approval and declaration commit.
"""
from . import workflow

workflow.CASE_PATH = workflow.ROOT/'docs/validation/cases/G7-01r4.json'


def main(argv=None):
    return workflow.main(argv)


if __name__ == '__main__':
    main()
