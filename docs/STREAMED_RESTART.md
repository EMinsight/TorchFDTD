# Durable restart journal for streamed adjoints

`StreamedAdjointOptions(restart_directory=...)` records, at block boundaries,
what a later process needs to continue an interrupted run. The journal is
written next to, not inside, the scratch state store, and it survives process
death. It is block-granular crash consistency for our own files. It is not a
mid-block checkpoint, a filesystem quota, protection against corrupted storage
or a guarantee for physics paths outside the listed scope.

```python
options = StreamedAdjointOptions(device='cuda', state_storage='disk',
    state_directory='D:/scratch', disk_budget_bytes=200*1024**3,
    restart_directory='D:/journal', restart_every_blocks=1)
result = StreamedSimulation(project, options)(epsilon)   # resumes if a record exists
loss = result.signals.square().sum()
loss.backward()                                          # resumes a recorded backward
print(result.report['forward_resumed_from_block'], result.report['backward_resumed_from_block'])
```

## What is recorded

| Phase | Record | When |
|---|---|---|
| forward | complete state banks and the partial signal history | after every `restart_every_blocks` completed blocks, except the last |
| forward | the complete signal history | when the forward pass finishes |
| backward | the adjoint state, the partial material gradient and the completed block | after each transpose whose remaining block count is a multiple of `restart_every_blocks` |

Each record is written to a temporary directory, every file is synced, the
directory is renamed and only then does `latest-forward.json` or
`latest-backward.json` point at it. The previous record of the same kind is
removed afterwards, so the journal briefly holds two records. The reservation
therefore charges two full states plus two parameter gradients on the journal
volume, added to the bank reservation when both share one volume, and the run
is rejected when that space is not free.

## How a resume works

A forward record restores the state banks and signals and continues from the
next block. A completed forward record returns the recorded signals without
recomputation, so the objective can be rebuilt and `backward()` called again.
A backward record restores the adjoint and partial gradient and runs the
existing binomial replay only over the blocks below the recorded one, from the
all-zero initial state. No saved restart bank has to be preserved across
processes, and the recorded block index is the only schedule state. On
completion the state records are removed and `complete.json` remains beside
the contract.

## Contract

`contract.json` stores the scene without generated item labels, the SHA-256 of
the epsilon bytes, the options except the journal settings, the block starts,
the runtime source hashes and the Torch version. A journal opened with a
different contract is rejected and the differing keys are reported. A backward
record also stores the SHA-256 of the signal adjoint; resuming with another
objective is rejected. The interrupted process may leave scratch banks behind
in `state_directory`; the resumed process creates its own store and does not
remove another process's files.

## Operating a resume

- Resume with the identical source tree. The contract hashes `streamed.py`,
  `spacetime.py`, `state_store.py` and `streamed_restart.py`; updating the code
  between the crash and the resume is rejected as `runtime_sha256`.
- Remove the crashed process's scratch first. Its `torchfdtd-state-*`
  directories under `state_directory` are not removed by anyone else, and they
  consume the free space that the bank reservation checks again on resume.
- Records already in the journal count toward the journal reservation
  (`restart_journal_existing_bytes`), so a resume needs free space only for the
  banks and for one more record, not for a second full journal.

## Verified scope

CPU and CUDA tiles, host and file-backed banks, real scalar epsilon, point
observations and time-history outputs. Sixteen tests interrupt the forward pass
after one or three blocks, interrupt a retained backward pass after one or three
transposes, kill a real child process during backward and resume it from a new
process, reject changed inputs and a different signal adjoint, count records for
`restart_every_blocks=2`, and check the journal space reservation. Resumed
signals and gradients equal the uninterrupted run bitwise on CPU and within
1e-6 relative on CUDA.

Not covered: spectral observations (rejected at run time), ADE, tensor,
density or geometry parameter paths, asynchronous tiles and the dispersive
streamed solver. Journal writes cost one read and one write of the full state
per record; `restart_every_blocks` trades that cost against replay after a
crash. Large-run recovery timing is recorded in
[BEYOND_VRAM_RESTART.md](BEYOND_VRAM_RESTART.md).
