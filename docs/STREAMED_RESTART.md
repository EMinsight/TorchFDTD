# Durable restart journal for streamed adjoints

`StreamedAdjointOptions(restart_directory=...)` records, at block boundaries,
what a later process needs to continue an interrupted run. The journal is
written next to, not inside, the scratch state store, and it survives process
death. It is block-granular crash consistency for our own files. It is not a
mid-block checkpoint, a filesystem quota, protection against a corrupted
volume as a whole or a guarantee for physics paths outside the listed scope.

```python
options = StreamedAdjointOptions(device='cuda', state_storage='disk',
    state_directory='D:/scratch', disk_budget_bytes=200*1024**3,
    restart_directory='D:/journal', restart_every_blocks=1)
result = StreamedSimulation(project, options)(epsilon)   # resumes if a record exists
loss = result.signals.square().sum()
loss.backward()                                          # resumes a recorded backward
print(result.report['forward_resumed_from_block'], result.report['backward_resumed_from_block'])
print(result.report['restart_previous_state'], result.report['restart_rollbacks'])
```

## What is recorded

| Phase | Record | When |
|---|---|---|
| forward | complete state banks and the partial signal history | after every `restart_every_blocks` completed blocks, except the last |
| forward | the complete signal history | when the forward pass finishes |
| backward | the adjoint state, the partial material gradient and the completed block | after each transpose whose remaining block count is a multiple of `restart_every_blocks` |
| either | the state reached at a cancelled block boundary | when the run's cancel event is set and the boundary is not recorded yet |

The state banks are the host state tuple of the streamed system: E, H, one
CPML psi array per segment, every stored PMC/symmetric face bank of E and H,
and on the dispersive path the P and Q polarization banks and their face
banks. Each record is written to a temporary directory `<name>.tmp`, every
array file is synced and described in `meta.json` by its file name, shape,
dtype, byte count and SHA-256, the directory is renamed into place and only
then does `latest-forward.json` or `latest-backward.json` point at it. The
pointer also names the previous record of the same kind, which is kept as the
rollback target: the record two generations back is removed before a new one
is written, so the journal holds at most two records of a kind, the published
one and either its predecessor or the `.tmp` directory being written. The
last partial forward record stays beside `forward-complete` until the first
backward record is written. Every forward record carries the whole signal
history, `steps x monitors` in the field dtype, and the completed forward
record keeps it while backward records rotate. For state bytes B,
signal-history bytes S and parameter-gradient bytes G the reservation is
`max(2(B+S), S+2(B+G))`, the array bytes exactly as `_write_array` produces
them, plus a bound on the JSON metadata (256 bytes per record array, 16 bytes
per block start listed in the contract and 64 KiB for the hashes, options,
pointers, owner and status files), reported as `restart_reservation_bytes`
with `restart_signal_history_bytes` for S and
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

## Integrity checks and rollback

Every array is verified before it is used. Opening a record checks the
marker, the kind against the pointer, that every description carries a file
name, a known dtype, a shape whose byte count matches the declared count and
a 64-character checksum, and that every file exists with exactly that many
bytes. Loading a record checks the array count against the current state
tuple, each array's shape and dtype against the state it fills, and the
SHA-256 of every file while it is read. A failure of any check is a
`RestartRecordDamaged` whose reason names the file and the check
(`state-0.bin is truncated: 2048 of 4096 bytes`, `checksum mismatch in
signals.bin`, `array count 18 (19 expected ...)`, `meta.json is unreadable`).

A damaged newest record is not refused outright: the journal rolls that kind
back to the fallback record named by the pointer, verifies it the same way,
removes the damaged directory and continues from the fallback. Without a
fallback, or when the fallback is damaged too, the kind is rolled back to the
empty journal: a forward pass restarts from block zero, a backward pass from
the completed forward record. Each rollback is reported in
`report['restart_rollbacks']` as `dict(kind, record, reason, resumed_from)`,
and `torchfdtd.streamed_restart.inspect_journal(directory)` shows the cheap
verdict of each pointed record without owning, reading or changing the
journal. The pointer files themselves and `contract.json` are replaced
atomically and are not rolled back; an unreadable pointer is refused with its
name. Verification costs one hash pass per array on every write and every
read, with `hashlib.sha256` in 256 MiB row chunks.

## Ownership and terminal states

One process owns a journal directory at a time. `owner.json` is created with
`O_EXCL` and holds the marker, a run id, the pid, the host name and the start
time; it is removed when the run reaches a terminal state or the journal is
closed, and a run that publishes again after its terminal state (a second
backward on the same result) takes it back. A second writer finds the file
and is refused: while the owner's pid is alive on this host the message names
the run id and pid; a lock from another host is refused because liveness
cannot be checked there; an unreadable lock or a foreign marker is refused
without changing anything. A lock whose pid is dead on this host is stale and
is taken over. Pid liveness is `OpenProcess` plus `GetExitCodeProcess` on
Windows and `kill(pid, 0)` elsewhere, and its limitation is documented here:
a recycled pid of an unrelated process looks alive, and the lock then has to
be removed by hand after confirming that the run is dead.

`status.json` carries the run's state, one of

| State | Meaning |
|---|---|
| `running` | the owner is writing; no terminal state yet |
| `completed` | the backward pass finished; the state records are removed and `complete.json` exists |
| `cancelled` | the run's cancel event stopped it at a block boundary; the phase and block are stored, the records at that boundary stay readable |
| `failed` | an exception ended the run; the exception type and message are stored as `reason`, the last published records stay readable |
| `partial` | reported by the next opener and by `inspect_journal` when the status is still `running` but the owner is dead: the process was killed or lost power without a terminal state |

The run that opens the journal reports the state it found as
`restart_previous_state` (`None` for a fresh journal) and its own final state
as `restart_state`. Records of a cancelled, failed or partial journal are
loaded by the next run exactly like those of a live one, and a reader can
open `RestartJournal` on them while no owner is alive.

Cancellation: `StreamedSimulation(project, options, cancel=event)` takes any
object with `is_set()`, such as `threading.Event`. The forward pass checks it
before every block, the backward pass before every transpose and every replay
block. When it is set the pass records the boundary it reached if the journal
does not hold it yet, marks the journal `cancelled` and raises
`torchfdtd.streamed.StreamCancelled` (an `InterruptedError`). Without a journal
the cancelled work is lost. The dispersive, tensor, geometry and modal
streamed classes do not take the event yet.

## Durability levels

Two levels are distinguished, process-kill consistency and
power-loss durability, and only the first is exercised by tests.

**Process-kill consistency (exercised).** Every array file, `meta.json`, the
pointers, the owner, status and contract files are written to a temporary name,
flushed and `fsync`ed, then renamed into place. On POSIX the rename is
`os.replace` followed by an `fsync` of the journal directory, which commits
the directory entry. On Windows, where a directory cannot be `fsync`ed, the
rename is `MoveFileExW` with `MOVEFILE_WRITE_THROUGH` (and
`MOVEFILE_REPLACE_EXISTING` for files), which returns only after the move has
been written through to the volume. A process killed at any point therefore
leaves either the previous entry or the new one, never a torn pointer, and a
half-written record stays a `<name>.tmp` directory that nothing points at.
`tests/test_restart_faults.py` kills a child process during forward and during
backward and resumes; `tests/test_journal_ownership.py` checks the flags and
the directory fsync calls.

**Power-loss durability (not exercised).** The same sequence is what a
journaling filesystem needs to survive a power loss, but whether the bytes are
on stable storage when `fsync` returns depends on the volume: consumer drives
with a volatile write cache, virtual disks and network shares can acknowledge
before the data is durable. No test cuts power, and no claim is made beyond
"the operating system was asked to write through". The guarantee level of a
resumed run after a power loss is therefore the same as that of any other
`fsync`-based application on that volume, and a journal on such a volume can
lose its newest record; the fallback record and the integrity checks are what
recover it.

## Contract

`contract.json` stores the scene without generated item labels, the SHA-256 of
the epsilon bytes, the options except the journal settings, the block starts,
the SHA-256 of every Python file under the `torchfdtd` package keyed by its
relative path (`runtime_sha256`) and the Torch version. A journal opened with a
different contract is rejected and the differing keys are reported: a changed
epsilon as `epsilon_sha256`, a changed source waveform, time step or Courant
factor as `project_sha256`, a changed step count as `project_sha256, starts`.
A backward record also stores the SHA-256 of the signal adjoint; resuming
with another objective is rejected as `signal_bar_sha256`. The contract is
checked before ownership is taken, so a refused resume changes nothing.

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

## Design checkpoints around the journal

The journal carries one pass of one epsilon. An optimization needs, beside
it, everything the loop itself holds, and
`torchfdtd.design_checkpoint.DesignCheckpoint` writes those as one
checksummed file replaced atomically at every save:

| State | Content |
|---|---|
| `iteration`, `history` | the update count and the loop's own history list |
| `parameters` | `DensityParameterization.state_dict()`: the design, fixed masks and values, beta, eta, the continuation update count and the protected filter configuration |
| `optimizer` | `torch.optim` state, for Adam the moments and the step count |
| `projection` | beta, eta, continuation updates, filter radius, boundary, symmetry as plain values |
| `rng` | the torch CPU and CUDA generator states, the NumPy global state and Python's `random` state |
| `waveform` | the effective sampled source terms of the resolved plan (component, location, sample times, samples) |
| `fingerprint` | `torchfdtd.identity.restart_key(plan, options=options)` of the plan and the streamed options |

`load` verifies the file's byte count and SHA-256, refuses a checkpoint that
lacks any state of `REQUIRED_STATES` by name, one written for another
fingerprint or waveform, and one whose parameters were built with another
filter configuration, then restores every state. The reference pattern is a
journal directory per iteration (the journal contract pins one epsilon) and a
checkpoint after every update, as in
`tests/test_checkpoint_completeness.py::optimize` and
`benchmarks/restart_soak.py`; the solver journal's contract stays the one
above, `restart_key` is the fingerprint of the checkpoint.

## Leftover records after a crash

The journal directory holds `contract.json`, `owner.json` while a run owns
it, `status.json`, the pointers `latest-forward.json` and
`latest-backward.json`, the record directories `forward-<block>`,
`forward-complete` and `backward-<block>` (at most two per kind), each with a
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
- Read `inspect_journal(directory)` before resuming a journal of unknown
  history: it shows the state, the owner and its liveness, and each pointed
  record's block, bytes and cheap integrity verdict.
- A journal whose `owner.json` names a live pid on this host is refused; if
  that process is known to be dead (a recycled pid), remove `owner.json` by
  hand.

## Verified scope

CPU and CUDA tiles, host and file-backed banks, real scalar epsilon, point
observations and time-history outputs, and the dispersive streamed solver's
P and Q banks for the forward and backward resume of
`tests/test_checkpoint_completeness.py`. `tests/test_streamed_restart.py`
(29 tests) interrupts the forward pass after one or three blocks, interrupts
a retained backward pass after one or three transposes, kills a real child
process during backward and resumes it from a new process, rejects a changed
epsilon, waveform, step count, time step, Courant factor, signal adjoint and
a package file edited in place with the differing key named while identical
inputs still resume, counts records for `restart_every_blocks=2`, checks the
journal space reservation, decides the shared volume by identity, removes
only the journal's own `.tmp` leftovers, and measures at every write and
removal that the reservation covers the coexisting records of a run whose
signal history exceeds its state. `tests/test_restart_faults.py` (26 tests)
injects one fault per test: forward and backward interruptions, a killed
child process during forward and during backward, ENOSPC while writing an
array, `meta.json`, a pointer or a gradient, a device out-of-memory error
inside a slab update, a failed host-to-device and device-to-host tile
transfer, a read and a write fault on a file bank, a truncated array, a
corrupted checksum, a removed checksum and an unreadable `meta.json` in the
newest record, and a cancel event during forward and during backward; each
leaves the last valid record, rolls a damaged newest record back by name,
resumes within rtol 1e-4, atol 1e-6 (bitwise on CPU), and returns scratch
files and `torch.cuda.memory_allocated` to their baseline.
`tests/test_checkpoint_completeness.py` (14 tests) checks the array set of a
record against the host state tuple for CPML, stored PMC faces and ADE
scenes, restores it bitwise, and resumes an interrupted four-iteration
optimization to the uninterrupted history bitwise; a checkpoint missing any
named state is refused. `tests/test_journal_ownership.py` (20 tests) covers
the ownership decisions, the ten integrity checks, the four terminal states
and the platform rename primitives. Resumed signals and gradients equal the
uninterrupted run bitwise on CPU and within 1e-6 relative on CUDA. The
long-run soak with the journal enabled is recorded in
[RESTART_SOAK.md](RESTART_SOAK.md).

Not covered: spectral observations (rejected at run time), tensor, density or
geometry parameter paths, asynchronous tiles, cancellation of the dispersive,
tensor, geometry and modal streamed classes, faults inside those paths,
cross-host locking, pid reuse and power loss. Journal writes cost one read,
one hash and one write of the full state per record, and about one `fsync`
per array file; `restart_every_blocks` trades that cost against replay after
a crash. Large-run recovery timing is recorded in
[BEYOND_VRAM_RESTART.md](BEYOND_VRAM_RESTART.md).
