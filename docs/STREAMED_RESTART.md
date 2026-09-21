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

Each record is written to a temporary directory `<name>.tmp`, every file is
synced, the directory is renamed to `<name>` and only then does
`latest-forward.json` or `latest-backward.json` point at it. The previous
record of the same kind is removed afterwards, so the journal briefly holds
two records: the published one and the `.tmp` directory being written, each
with its `meta.json`. Every forward record carries the whole signal history,
`steps x monitors` in the field dtype, and the completed forward record keeps
it while backward records rotate. For state bytes B, signal-history bytes S
and parameter-gradient bytes G the reservation is `max(2(B+S), S+2(B+G))`,
the array bytes exactly as `_write_array` produces them, plus a bound on the
JSON metadata (256 bytes per record array, 16 bytes per block start listed in
the contract and 64 KiB for the hashes, options and pointers), reported as
`restart_reservation_bytes` with `restart_signal_history_bytes` for S and
`restart_journal_metadata_bytes` for the bound. When the file-backed banks
and the journal are on one volume the journal check charges the sum of both
reservations there. One volume means the same drive of the resolved paths on
Windows and the same device number of the nearest existing ancestor
elsewhere, never a shared path prefix. The run is rejected when that space is
not free.

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
the SHA-256 of every Python file under the `torchfdtd` package keyed by its
relative path (`runtime_sha256`) and the Torch version. A journal opened with a
different contract is rejected and the differing keys are reported: a changed
epsilon as `epsilon_sha256`, a changed source waveform, time step or Courant
factor as `project_sha256`, a changed step count as `project_sha256, starts`.
A backward record also stores the SHA-256 of the signal adjoint; resuming
with another objective is rejected as `signal_bar_sha256`.

The runtime fingerprint is the content of the files the process imported, not
a version or a commit, so a modified but uncommitted file in an editable
install changes it. The CUDA kernels are generated at run time from strings in
those files (`cuda_kernels.py`, the other `cuda_*.py` modules,
`pmc_cuda.py`, `pmc_cpml_cuda.py` and `reversible_cpml_kernels.py`), and no
kernel source, include file or compiled cache outside the package is read, so
generated kernel sources are covered by the same hashes. The compiler and
driver versions are not part of the contract.

The interrupted process may leave scratch banks behind in `state_directory`;
the resumed process creates its own store and does not remove another
process's files.

## Leftover records after a crash

The journal directory holds `contract.json`, the pointers
`latest-forward.json` and `latest-backward.json`, the record directories
`forward-<block>`, `forward-complete` and `backward-<block>`, each with a
`meta.json` carrying the marker `torchfdtd-streamed-restart`, and
`complete.json` once the run has finished. A crash during a write leaves the
record it was writing as a `<name>.tmp` directory, and a crash during a JSON
replacement leaves a `<file>.tmp` file; neither is ever pointed at, and a
record that lacks `meta.json` or the marker is not loaded. When the journal is
opened again with a matching contract, the `*.tmp` entries directly under its
own directory are removed; they are excluded from
`restart_journal_existing_bytes` for the same reason. The journal removes
nothing else: a pointer naming a record outside the journal directory is
refused rather than followed, records of other journals and the scratch banks
under `state_directory` are never touched, and one process at a time owns a
journal directory.

## Operating a resume

- Resume with the identical source tree. The contract hashes every Python
  file under the package, including the inline CUDA kernel sources; updating
  any of them between the crash and the resume is rejected as
  `runtime_sha256` with the changed file named, `runtime_sha256.boundaries.py`
  for example.
- Remove the crashed process's scratch first. Its `torchfdtd-state-*`
  directories under `state_directory` are not removed by anyone else, and they
  consume the free space that the bank reservation checks again on resume.
- Records already in the journal count toward the journal reservation
  (`restart_journal_existing_bytes`), so a resume needs free space only for the
  banks and for one more record, not for a second full journal.

## Verified scope

CPU and CUDA tiles, host and file-backed banks, real scalar epsilon, point
observations and time-history outputs. Twenty-nine tests interrupt the forward
pass after one or three blocks, interrupt a retained backward pass after one or
three transposes, kill a real child process during backward and resume it from
a new process, reject a changed epsilon, waveform, step count, time step,
Courant factor, signal adjoint and a package file edited in place with the
differing key named while identical inputs still resume, count records for
`restart_every_blocks=2`, check the journal space reservation, decide the
shared volume by identity, remove only the journal's own `.tmp` leftovers,
and measure at every write and removal that the reservation covers the
coexisting records of a run whose signal history exceeds its state. Resumed
signals and gradients equal the uninterrupted run bitwise on CPU and within
1e-6 relative on CUDA.

Not covered: spectral observations (rejected at run time), ADE, tensor,
density or geometry parameter paths, asynchronous tiles and the dispersive
streamed solver. Journal writes cost one read and one write of the full state
per record; `restart_every_blocks` trades that cost against replay after a
crash. Large-run recovery timing is recorded in
[BEYOND_VRAM_RESTART.md](BEYOND_VRAM_RESTART.md).
