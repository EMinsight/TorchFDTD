# TorchFDTD internal validation report

Internal validation report of the completion program ([COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md)), rendered by `scripts/build_validation_report.py` from the machine outputs named in each section: the gate file and its evidence runs, the platform, clean-install, physics, cross-solver and Meep comparison records, the suite policy in `scripts/run_suite.py`, the version strings, and the known-limitations list (a hand-maintained JSON whose entries cite their records). No number here is typed into this file; `tests/test_validation_report.py` renders it again and compares. It records what was run and what those runs produced. It is not an attestation by a third party, and a passing gate is evidence for that gate only, never a general statement that the solver is correct for every problem.

Package version `0.14.0.dev0` (pyproject.toml). Gate file adopted at commit `f3efd3409aaa` with 83 tasks in 11 stages; newest evidence run `20260921T213007Z-g9-07-31e7a456` recorded 2026-09-21T21:30:07+00:00 at commit `15122d2aae0e`.

Release rule of the gate file: `all_required_tasks_verified=True`, `required_skips_allowed=False`, `missing_or_stale_evidence_allowed=False`, `unresolved_required_external_blockers_allowed=False`, `unresolved_P0_P1_defects_allowed=False`, `source_and_release_artifact_identity_required=True`, `public_release_separately_authorized=True`, `machine_gate_does_not_replace_independent_review=True`.
Technical readiness of a release candidate (every required task VERIFIED with evidence that matches the candidate) and authorization of a public release are separate decisions; this report can only inform the first, and the second is not given by any file in this repository.

## Release judgement by profile

| Profile | Required stages | Scope status | Pass | Fail | Optional | FAILED outside the profile | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WORKSTATION | G0, G1, G2, G3, G4, G5, G6, G7, G8, G9 | DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS | 28 | 49 | 0 | none | NOT RELEASABLE |
| HPC | G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, H1 | DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS | 28 | 55 | 0 | none | NOT RELEASABLE |

A task passes when it is VERIFIED by an evidence run whose source commit is an ancestor of the current commit and whose test sources, fixture and criteria files are unchanged, with no failed, errored, skipped or absent required test and no external blocker; stale evidence is a failure here, as in `scripts/check_release_gates.py` without `--allow-stale`.

## Gate tasks by stage

One row per task of [validation/completion_gates.json](validation/completion_gates.json): the recorded implementation and verification states, the newest evidence run and its source commit, and the judgement of that evidence against the current tree.

### G0 기준선·범위·증거 체계 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G0-01 | 실제 HEAD/dirty tree/기존 계획/자원·권한 확인 | IMPLEMENTED | VERIFIED | `20260921T212112Z-g0-01-78c4f2c1` | `32af0e2bffa2` | PASS | evidence matches the current checkout |
| G0-02 | RELEASE_SCOPE와 기능·검증 상태 분리 | IMPLEMENTED | VERIFIED | `20260921T212114Z-g0-02-a4700f5a` | `32af0e2bffa2` | PASS | evidence matches the current checkout |
| G0-03 | 기존 완료 계획·gate·fixture·raw evidence 단일 추적 | IMPLEMENTED | VERIFIED | `20260921T212115Z-g0-03-9d45ae2d` | `32af0e2bffa2` | PASS | evidence matches the current checkout |
| G0-04 | 필수 누락/실패/skip/source 불일치에서 출고 실패 판정기 | IMPLEMENTED | VERIFIED | `20260921T212305Z-g0-04-4a232a3c` | `32af0e2bffa2` | FAIL | STALE: watched file changed since the run: scripts/check_release_gates.py |
| G0-05 | 판정기 자체 failure injection과 세션 인계 구조 | IMPLEMENTED | VERIFIED | `20260921T212525Z-g0-05-d0b1a9fe` | `32af0e2bffa2` | FAIL | STALE: watched file changed since the run: scripts/check_release_gates.py |

### G1 과거 리뷰 회귀 및 수정 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1-01 | 자동 graded mesh와 미분 평면 모델의 격자 불일치. | IMPLEMENTED | VERIFIED | `20260921T140954Z-g1-01-202f68c3` | `1be01cca38dd` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G1-02 | reference signature의 실제 격자 누락. | IMPLEMENTED | VERIFIED | `20260921T140958Z-g1-02-2afa31eb` | `1be01cca38dd` | PASS | run predates its commit: the tests started at 2026-09-21T23:07:46.449202+09:00 before commit 1be01cca38dd was made |
| G1-03 | quadrant_intensity_allocation의 FP32 불안정. | IMPLEMENTED | VERIFIED | `20260921T140949Z-g1-03-72ef3ff6` | `1be01cca38dd` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G1-04 | restart 코드 호환성 검사 누락. | IMPLEMENTED | VERIFIED | `20260921T184733Z-g1-04-e39845b1` | `dfdd44d27978` | FAIL | STALE: test source changed since the run: tests/test_streamed_restart.py |
| G1-05 | journal 저장공간 산정. | IMPLEMENTED | VERIFIED | `20260921T184737Z-g1-05-c820d464` | `dfdd44d27978` | FAIL | STALE: test source changed since the run: tests/test_streamed_restart.py |
| G1-06 | 문서/실행 경로 일치. | IMPLEMENTED | VERIFIED | `20260921T212526Z-g1-06-c5adc0f5` | `32af0e2bffa2` | FAIL | STALE: watched file changed since the run: README.md |

### G2 물리·격자·실행 계약 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G2-01 | 기존 구조를 활용하여 immutable resolved/compiled simulation plan을 만든다 | IMPLEMENTED | VERIFIED | `20260921T164040Z-g2-01-2739bbf9` | `7847737ba636` | FAIL | STALE: test source changed since the run: tests/test_plan.py |
| G2-02 | forward/adjoint/streamed/tensor batch/GUI가 서로 다른 규칙으로 물리 입력을 다시 해석하지 않도록 한다 | IMPLEMENTED | VERIFIED | `20260921T164046Z-g2-02-fc7ab609` | `7847737ba636` | FAIL | STALE: test source changed since the run: tests/test_plan.py |
| G2-03 | capability registry를 만들고 dimensions × mesh × materials × boundaries × sources × monitors × forward/backward × resident/streamed × precision/backend의 유효 조합을 명시한다 | IMPLEMENTED | VERIFIED | `20260921T171604Z-g2-03-53e2e466` | `bca0a7b29e6a` | FAIL | STALE: test source changed since the run: tests/test_capability_pairs.py |
| G2-04 | 전수 조합 대신 위험 기반 pairwise 검사와 고위험 3~4개 기능 조합을 설계한다 | IMPLEMENTED | VERIFIED | `20260921T171624Z-g2-04-481b2694` | `bca0a7b29e6a` | FAIL | STALE: test source changed since the run: tests/test_capability_pairs.py |
| G2-05 | "+/- DFT", Bloch spatial phase, E/H half-step, normal/outward direction, reduced units vs SI calibration, lossy exterior, 2D 단위길이 전력을 공개 specification과 테스트로 고정한다. | IMPLEMENTED | VERIFIED | `20260921T212539Z-g2-05-d33352b2` | `32af0e2bffa2` | PASS | evidence matches the current checkout |
| G2-06 | cache/reference/restart마다 필요한 동일성 조건을 분리한다 | IMPLEMENTED | VERIFIED | `20260921T164116Z-g2-06-c78e74ff` | `7847737ba636` | FAIL | STALE: test source changed since the run: tests/test_identity.py |

### G3 독립 물리·gradient 검증 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G3-01 | 균일 매질 2D/3D 전파·위상·분산 | IMPLEMENTED | VERIFIED | `20260921T172232Z-g3-01-05fb5cda` | `ce5f049d4375` | FAIL | STALE: test source changed since the run: tests/test_physics_g3_a.py |
| G3-02 | 유전체 slab normal/oblique TE/TM과 TMM | IMPLEMENTED | VERIFIED | `20260921T170604Z-g3-02-ef141f60` | `88c577519350` | FAIL | STALE: test source changed since the run: tests/test_physics_g3_a.py |
| G3-03 | Drude/Lorentz slab fit/ADE 오차 분리 | IMPLEMENTED | VERIFIED | `20260921T172237Z-g3-03-562cfaf5` | `ce5f049d4375` | FAIL | STALE: test source changed since the run: tests/test_physics_g3_a.py |
| G3-04 | dielectric cylinder/sphere Mie 산란 | IMPLEMENTED | VERIFIED | `20260921T181942Z-g3-04-b95d2106` | `487de42640e4` | FAIL | STALE: the task watches data files but the evidence predates the watch list: docs/validation/cases/G3-04_*.json, examples/tfsf_sphere.py |
| G3-05 | 금속/분산 곡면 산란·흡수 수렴 | IMPLEMENTED | FAILED | `20260921T181951Z-g3-05-8fafa59e` | `487de42640e4` | FAIL | verification_state is FAILED |
| G3-06 | PEC/PMC cavity·symmetry와 gradient mapping | IMPLEMENTED | VERIFIED | `20260921T185058Z-g3-06-8e377c95` | `5218de5b6b52` | PASS | scope change pending approval (6 declaration(s), scope_change_approval is null): docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/float32/atol = 3e-06 is looser than the loosest program atol 1e-06; and 5 more |
| G3-07 | PML normal/oblique 반사·장시간 안정성 | IMPLEMENTED | VERIFIED | `20260921T172247Z-g3-07-fcf2441e` | `ce5f049d4375` | FAIL | STALE: test source changed since the run: tests/test_physics_g3_a.py |
| G3-08 | Bloch grating·회절과 독립 RCWA | IMPLEMENTED | VERIFIED | `20260921T192159Z-g3-08-12eb742b` | `4a5f5cd6d19d` | FAIL | STALE: the task watches data files but the evidence predates the watch list: docs/validation/cases/G3-08*.json, docs/validation/g3/G3-08_torcwa_reference.json, benchmarks/g3_torcwa_grating.py |
| G3-09 | mode neff·field·confinement·power oracle | IMPLEMENTED | VERIFIED | `20260921T164916Z-g3-09-a7e7b272` | `5c0172da60d2` | PASS | scope change pending approval (4 declaration(s), scope_change_approval is null): docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/fiber_beta_relative_error_max/difference_from_common_criterion states a limit looser than the program threshold; and 3 more |
| G3-10 | PIC S·수동성·상반성과 누락 방사 채널 | IMPLEMENTED | VERIFIED | `20260921T164946Z-g3-10-ea83b20f` | `5c0172da60d2` | PASS | scope change pending approval (2 declaration(s), scope_change_approval is null): docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/rtol = 0.001 is looser than the loosest program rtol 0.0001; and 1 more |
| G3-11 | dipole far/near field와 표면/격자 수렴 | IMPLEMENTED | VERIFIED | `20260921T165000Z-g3-11-74c48d39` | `5c0172da60d2` | FAIL | STALE: the task watches data files but the evidence predates the watch list: benchmarks/radiation_dipole.py |
| G3-12 | tensor slab 및 tensor gradient | IMPLEMENTED | VERIFIED | `20260921T165015Z-g3-12-562acc59` | `5c0172da60d2` | FAIL | STALE: the task watches data files but the evidence predates the watch list: benchmarks/tensor_cpml_birefringent_slab.py, docs/TENSOR_CPML_SLAB_ACCEPTANCE.md |
| G3-13 | 곡면 grid offset/mesh/smoothing 폭 물리 수렴 | IMPLEMENTED | VERIFIED | `20260921T181945Z-g3-13-ecfade50` | `487de42640e4` | FAIL | STALE: the task watches data files but the evidence predates the watch list: docs/validation/cases/G3-13_*.json, examples/tfsf_sphere.py |
| G3-14 | 무차원 small discrete CPU/Torch/CUDA/VJP 수치 비교 | IMPLEMENTED | VERIFIED | `20260921T185333Z-g3-14-1bd80f8e` | `5218de5b6b52` | PASS | scope change pending approval (9 declaration(s), scope_change_approval is null): docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_solver.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; and 8 more |
| G3-15 | full-autograd·directional VJP·FD sweep·Taylor 검사 | IMPLEMENTED | VERIFIED | `20260921T190441Z-g3-15-ca5f7da9` | `d6fb1f86dbc1` | PASS | scope change pending approval (3 declaration(s), scope_change_approval is null): docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/rtol = 0.003 is looser than the loosest program rtol 0.0001; and 2 more |
| G3-16 | 실제 shape/material 파라미터의 물리 gradient 수렴 | IMPLEMENTED | VERIFIED | `20260921T190545Z-g3-16-7cf64e2d` | `d6fb1f86dbc1` | FAIL | STALE: the task watches data files but the evidence predates the watch list: benchmarks/gradient_mesh.py, benchmarks/shape_gradient_polygon.py, docs/validation/shape_gradient_polygon_3060.json |
| G3-17 | oracle 독립성·정밀도·시간·PML 오차 budget 확인 | IMPLEMENTED | VERIFIED | `20260921T210000Z-g3-17-dc84d85f` | `e13fe664c7a7` | FAIL | STALE: the task watches data files but the evidence predates the watch list: docs/validation/cases/G3-*.json, docs/validation/cases/*.oracles.json, docs/ORACLE_BUDGET.md |

### G4 CUDA·CI·환경 검증 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G4-01 | 보유한 실제 GPU와 OS·driver·runtime부터 확인한다 | IMPLEMENTED | VERIFIED | `20260921T163708Z-g4-01-53b82748` | `a73f47920e9c` | FAIL | STALE: the task watches data files but the evidence predates the watch list: docs/PLATFORM_MATRIX.md, docs/validation/platforms/*.json, scripts/platform_report.py |
| G4-02 | torch/fused, CUDA graph on/off, fused/reference monitor, FP32/FP64, real/complex, standard/nondefault stream의 valid 경로를 비교한다. | IMPLEMENTED | VERIFIED | `20260921T163724Z-g4-02-b5c11b4f` | `a73f47920e9c` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G4-03 | noncontiguous tensors, duplicate observers, multiple calls/backward, input lifetime, stream synchronization, cancellation, allocator cleanup을 검사한다 | IMPLEMENTED | VERIFIED | `20260921T163744Z-g4-03-5f80ac67` | `a73f47920e9c` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G4-04 | 최소 격자·홀수 크기·부분 slab·비정렬 tile·index boundary·강한 material contrast·ADE/CPML memory를 무작위/경계 fixture에 포함한다 | IMPLEMENTED | VERIFIED | `20260921T163757Z-g4-04-7e1cdb0f` | `a73f47920e9c` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G4-05 | CPU PR suite, 신뢰한 코드의 GPU 정기 suite, 실제 release의 전체 GPU suite를 분리한다 | IMPLEMENTED | VERIFIED | `20260921T212749Z-g4-05-d9c1df76` | `32af0e2bffa2` | FAIL | STALE: watched file changed since the run: scripts/check_release_gates.py |
| G4-06 | public fork PR의 untrusted code를 개인/연구실 GPU host에서 자동 실행하지 않는다 | IMPLEMENTED | VERIFIED | `20260921T212752Z-g4-06-c6698b17` | `32af0e2bffa2` | FAIL | STALE: watched file changed since the run: .github/workflows/test.yml |

### G5 메모리·재시작·장기 안정성 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G5-01 | resident/host/disk/async 경로를 같은 물리 문제·관측자·목적함수에서 비교한다 | IMPLEMENTED | VERIFIED | `20260921T200923Z-g5-01-d42add9e` | `ed67736f91ca` | PASS | run predates its commit: the tests started at 2026-09-22T05:00:06.173976+09:00 before commit ed67736f91ca was made |
| G5-02 | peak Torch allocated/reserved, CUDA 전체 process memory(가용한 계측 사용), RSS/PSS 또는 플랫폼 동등량, committed memory, OS cache, 디스크 사용량·총 읽기/쓰기·실효 대역폭을 구분한다 | IMPLEMENTED | VERIFIED | `20260921T200934Z-g5-02-e1aa0e9d` | `ed67736f91ca` | PASS | run predates its commit: the tests started at 2026-09-22T05:04:29.794969+09:00 before commit ed67736f91ca was made |
| G5-03 | planner의 byte admission과 실제 peak를 맞추고 원자적 동시 reservation 또는 동등 admission으로 여러 작업이 각각 free memory를 보고 동시에 초과하는 문제를 다룬다 | IMPLEMENTED | VERIFIED | `20260921T200952Z-g5-03-8f43e40b` | `ed67736f91ca` | PASS | run predates its commit: the tests started at 2026-09-22T05:04:57.853722+09:00 before commit ed67736f91ca was made |
| G5-04 | 전체 3D epsilon/VJP를 만들지 않는 geometry/density slab 생성·gradient 축약 경로를 공개 합성 구조로 시험한다 | IMPLEMENTED | VERIFIED | `20260921T201010Z-g5-04-c3e8d3fe` | `ed67736f91ca` | PASS | run predates its commit: the tests started at 2026-09-22T05:05:38.632650+09:00 before commit ed67736f91ca was made |
| G5-05 | meaningful beyond-VRAM 사례 하나를 추가한다 | IN_PROGRESS | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G5-06 | 위 대규모 사례는 승인된 실행/디스크 쓰기 예산 안에서 수행한다 | IN_PROGRESS | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G5-07 | forward 중단, backward 중단, process kill, simulated ENOSPC/OOM, read/write fault, truncate/checksum 오류, CUDA transfer failure, cancellation을 주입한다 | IMPLEMENTED | VERIFIED | `20260921T204924Z-g5-07-b25fc657` | `5dfa656c5fff` | PASS | evidence matches the current checkout |
| G5-08 | checkpoint에 solver와 필요한 auxiliary states, optimizer state, scheduler/projection state, RNG, effective source, configuration fingerprint를 보존한다 | IMPLEMENTED | VERIFIED | `20260921T203532Z-g5-08-bbf1867e` | `b61ad034a0ec` | FAIL | STALE: test source changed since the run: tests/test_checkpoint_completeness.py |
| G5-09 | journal은 run별 소유권과 동시 writer 잠금을 갖는다 | IMPLEMENTED | VERIFIED | `20260921T203815Z-g5-09-939acc1a` | `b61ad034a0ec` | PASS | evidence matches the current checkout |
| G5-10 | 경량 fixture에서 1e5 steps, 반복 실행, 최소 100 optimizer updates 및 승인된 장시간 soak를 수행한다 | IMPLEMENTED | VERIFIED | `20260921T203823Z-g5-10-0fade0c0` | `b61ad034a0ec` | PASS | evidence matches the current checkout |

### G6 사용자 물리·역설계 API (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G6-01 | 재료 CSV/nk/epsilon import, passive fitting, 원자료 출처·사용권·해시, fit band, 시간 이산화에 따른 n/k 오차, extrapolation 경고를 하나의 workflow로 묶는다 | IMPLEMENTED | VERIFIED | `20260921T195534Z-g6-01-bdd21c2c` | `da70a70484c2` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G6-02 | source의 실제 공간 분포·위상·편광·시간 파형·유효 bandwidth를 preview한다 | IMPLEMENTED | VERIFIED | `20260921T195548Z-g6-02-9b5a95d6` | `da70a70484c2` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G6-03 | reference를 포함한 R/T/A, 복소 S, phase/group delay, mode decomposition, diffraction, far-field/near-zone을 기존 결과와 통합한다 | IMPLEMENTED | VERIFIED | `20260921T195559Z-g6-03-b314c028` | `da70a70484c2` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G6-04 | 포트별 mode tracking, normalization, reference plane, forward/backward separation과 퇴화/약한 모드 진단을 제공한다 | IMPLEMENTED | VERIFIED | `20260921T195524Z-g6-04-cd77e84a` | `68d797bbb060` | PASS | scope change pending approval (2 declaration(s), scope_change_approval is null): docs/validation/cases/G6-04.json acceptance/tracked_neff_error_max/difference_from_common_criterion states a limit looser than the program threshold; and 1 more |
| G6-05 | 기존 design/periodic/mode-network API를 재사용해 objective→parameterization→optimizer→history→resume→final evaluation의 최소 고수준 인터페이스를 통합한다 | IMPLEMENTED | VERIFIED | `20260921T195542Z-g6-05-9f485769` | `68d797bbb060` | FAIL | STALE: test source changed since the run: tests/test_design_workflow.py |
| G6-06 | density filter, projection, beta continuation, symmetry, mask, min linewidth/gap, fabrication perturbation, binary export를 실제 검사와 연결한다 | IMPLEMENTED | VERIFIED | `20260921T195559Z-g6-06-e9e7f257` | `68d797bbb060` | FAIL | STALE: test source changed since the run: tests/test_design_workflow.py |
| G6-07 | export된 binary/GDS 구조를 다시 import하여 독립 finer forward로 평가한다 | IMPLEMENTED | VERIFIED | `20260921T202810Z-g6-07-e5631996` | `cbe9d4d9fc6a` | PASS | run predates its commit: the tests started at 2026-09-22T04:56:18.896576+09:00 before commit cbe9d4d9fc6a was made |
| G6-08 | low-intensity/near-zero reference/frequency cutoff/evanescent/backflow에서 NaN·음의 국소 flux·invalid phase를 임의 clipping으로 숨기지 않는다 | IMPLEMENTED | VERIFIED | `20260921T195609Z-g6-08-374a45a0` | `da70a70484c2` | PASS | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |

### G7 대표 응용·동일 정확도 비용 (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G7-01 | 공개 metagrating/meta-atom 전체 workflow | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G7-02 | 소형 유한 metalens의 실제 propagation·PSF·최종 재평가 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G7-03 | 수동 PIC 역설계·복수 초기화·제작 제약·GDS 재평가 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G7-04 | 동일 정확도 독립 solver 교차 검증 및 공정 비교 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G7-05 | cold/warm·전체 iteration·streaming·tuning 비용과 반복 변동 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |

### G8 저장·GUI·clean 설치 (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G8-01 | 기존 Project JSON/NPZ compatibility와 schema migration을 시험한다 | IMPLEMENTED | VERIFIED | `20260921T212803Z-g8-01-21814658` | `32af0e2bffa2` | FAIL | STALE: a file matching a watched pattern did not exist at recording: tests/fixtures/materials/sio2_sellmeier_malitson1965.csv |
| G8-02 | 큰 결과의 chunked/lazy read가 필요하면 HDF5 또는 Zarr 중 요구에 맞는 한 구현을 우선 채택한다 | IMPLEMENTED | VERIFIED | `20260921T192908Z-g8-02-76c35baa` | `579c27df75e5` | FAIL | STALE: test source changed since the run: tests/test_result_store.py |
| G8-03 | GUI의 CAD/GDS → material/source/boundary → 실제 mesh preview → resource preflight → job queue → cancel/resume → 결과 overlay → 데이터/GDS export 경로를 E2E로 시험한다. | IMPLEMENTED | VERIFIED | `20260921T192925Z-g8-03-25de93db` | `579c27df75e5` | FAIL | STALE: the task watches data files but the evidence predates the watch list: torchfdtd/web/**, docs/validation/workbench/*.json |
| G8-04 | geometry 편집의 undo/redo, copy/multiselect, autosave/recovery, versioned project, 구조/parameter 단위 검증과 결과 stale 표시를 구현/확인한다 | IMPLEMENTED | VERIFIED | `20260921T192929Z-g8-04-705af196` | `579c27df75e5` | FAIL | STALE: the task watches data files but the evidence predates the watch list: torchfdtd/web/**, docs/validation/workbench/*.json |
| G8-05 | 최종 wheel에 frontend 정적 자산을 포함하고 최종 사용자가 Node/npm이나 저장소 checkout 없이 UI를 실행하도록 한다 | IMPLEMENTED | VERIFIED | `20260921T170637Z-g8-05-29a464aa` | `656c5075eabd` | FAIL | STALE: test source changed since the run: tests/test_clean_install.py |
| G8-06 | 지원 Python/Torch/CuPy/runtime 최소·최대 버전을 실제 설치 시험으로 확정한다 | IMPLEMENTED | VERIFIED | `20260921T170706Z-g8-06-7b7e68da` | `656c5075eabd` | FAIL | STALE: test source changed since the run: tests/test_doctor.py |
| G8-07 | README의 모든 기본 예제를 installed wheel에서 실행한다 | IMPLEMENTED | VERIFIED | `20260921T170718Z-g8-07-b934b710` | `656c5075eabd` | FAIL | STALE: test source changed since the run: tests/test_clean_install.py |

### G9 보안·운영·출고 판정 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G9-01 | local server의 loopback 기본값, origin/host 검증, 허용된 파일 경로, 업로드 크기, path traversal, 악성/손상 JSON/NPZ/GDS, 압축 폭탄과 unsafe pickle을 검사한다 | IMPLEMENTED | VERIFIED | `20260921T163013Z-g9-01-57458fee` | `e132fdd4155b` | FAIL | STALE: test source changed since the run: tests/test_server_security.py |
| G9-02 | 코드와 번들 데이터의 출처·license·third-party notices·SBOM·dependency/security scan을 수행한다 | IMPLEMENTED | VERIFIED | `20260921T212820Z-g9-02-ae84c532` | `32af0e2bffa2` | FAIL | STALE: test source changed since the run: tests/test_provenance_inventory.py |
| G9-03 | RELEASE_REVIEW의 미해결 계약/배포 질문을 실제 문서에 따라 추적한다 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G9-04 | API stability/deprecation, project/result/checkpoint version compatibility, changelog, 알려진 한계, bug template, minimal repro, numerical bug severity, release rollback/결과 영향 공지를 준비한다. | IMPLEMENTED | VERIFIED | `20260921T212831Z-g9-04-f826cb57` | `32af0e2bffa2` | FAIL | STALE: watched file changed since the run: docs/CHANGELOG.md |
| G9-05 | 독립 사용자 또는 독립 설치 환경에서 세 대표 workflow를 실행하고, 실제 발견 이슈를 정리한다 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G9-06 | 최종 release candidate의 정확한 source tree와 wheel에서 전체 필수 gate를 실행한다 | IN_PROGRESS | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G9-07 | validation report를 기계 산출물에서 생성한다 | IMPLEMENTED | VERIFIED | `20260921T213007Z-g9-07-31e7a456` | `15122d2aae0e` | FAIL | STALE: test source changed since the run: tests/test_validation_report.py |

### H1 실제 단일 문제 multi-GPU (HPC, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H1-01 | rank-owned domain decomposition과 source/monitor/CPML/Bloch/ADE 지원 범위를 명시하고 global/local indexing과 halo ownership을 고정한다. | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| H1-02 | 실제 2-GPU 이상에서 forward와 재료 VJP를 single-GPU 기준과 대조한다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-03 | unequal slabs, partial tiles, rank 경계의 source/monitor/material, duplicate observations, halo transpose, complex fields와 checkpoint replay를 검사한다. | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-04 | strong/weak scaling의 문제 크기·GPU·interconnect·호스트 topology·통신/계산 overlap과 peak memory를 보고한다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-05 | timeout/rank failure/cancellation의 collective 정리와 재시작 정책을 시험한다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-06 | 예컨대 특정 큰 fixture의 2~4 GPU 효율 70%는 사전 합의한 성능 목표로 둘 수 있지만 하드웨어와 문제에 독립적인 보편 합격 기준으로 강요하지 않는다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |

## Platform records

Every record written by `scripts/platform_report.py` under `docs/validation/platforms/`; a platform without a record is not listed, as in [PLATFORM_MATRIX.md](PLATFORM_MATRIX.md). The evidence rows name, per platform, the newest G4 evidence run of each task that was recorded there (by the `platform_id` the recorder writes with `--platform`, or, for older evidence, by the GPU names of the run equalling those of exactly one record) and count the other tasks whose newest run was recorded there.

| Platform id | GPU | Driver | CUDA runtime | torch | CuPy | Python | OS | Recorded |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rtx3060-win11-lab | NVIDIA GeForce RTX 3060 (cc 8.6, 12287 MiB) | 591.86 | 12.6 | 2.10.0+cu126 | 13.6.0 | 3.10.2 | Windows-10-10.0.26200-SP0 | 2026-09-21T15:53:07+00:00 |
| rtx5880-ada-win11-remote | NVIDIA RTX 5880 Ada Generation (cc 8.9, 49139 MiB) | 581.80 | 12.8 | 2.10.0 | 13.6.0 | 3.11.14 | Windows-10-10.0.26100-SP0 | 2026-09-21T19:27:38+00:00 |

| Platform id | G4 evidence runs recorded on this platform | Other tasks whose newest run was recorded here |
| --- | --- | --- |
| rtx3060-win11-lab | G4-01 `20260921T163708Z-g4-01-53b82748` (GPU name); G4-02 `20260921T163724Z-g4-02-b5c11b4f` (GPU name); G4-03 `20260921T163744Z-g4-03-5f80ac67` (GPU name); G4-04 `20260921T163757Z-g4-04-7e1cdb0f` (GPU name); G4-05 `20260921T212749Z-g4-05-d9c1df76` (platform_id); G4-06 `20260921T212752Z-g4-06-c6698b17` (platform_id) | 61 |
| rtx5880-ada-win11-remote | none | 0 |

Newest runs that match no platform record: none.

## Clean-install record

Newest record `20260921T222259Z-4120a653.json` (kind `clean_install_record`), taken at commit `4120a6530685` on 2026-09-21T22:22:59+00:00 with 0 dirty packaging paths; all steps passed: yes.

Wheel `torchfdtd-0.14.0.dev0-py3-none-any.whl`, SHA-256 `8c7df04a88a73fda38b50475fc106c13cdc92bfe19e43b87feeebfe66e721332`, 960,864 bytes, 159 entries, 152 package files; browser assets match the committed ones: yes; frontend assets current: yes.

| Environment | Python | torch | cupy-cuda12x | numpy | torchfdtd | Packages |
| --- | --- | --- | --- | --- | --- | --- |
| g8-cpu | 3.10.2 | 2.14.0+cpu | absent | 2.2.6 | 0.14.0.dev0 | 40 |
| g8-cuda | 3.10.2 | 2.10.0+cu126 | 13.6.0 | 2.2.6 | 0.14.0.dev0 | 42 |

| Step | Status | Seconds |
| --- | --- | --- |
| build_wheel | passed | 12.52 |
| cpu_venv_create | passed | 7.48 |
| cpu_pip_install_torch | passed | 84.12 |
| cpu_pip_install_wheel | passed | 53.9 |
| cpu_package_list | passed | 1.04 |
| cpu_import_run_save_load | passed | 10.82 |
| cpu_server_index_assets_api | passed | 3.42 |
| cpu_doctor | passed | 3.38 |
| cuda_venv_create | passed | 7.05 |
| cuda_pip_install_torch | passed | 241.96 |
| cuda_pip_install_wheel_extras | passed | 60.25 |
| cuda_package_list | passed | 0.92 |
| cuda_fused_forward_run | passed | 17.25 |
| cuda_doctor | passed | 4.47 |
| readme_examples | passed | 15.76 |

## Suite policy

The three suites declared in `scripts/run_suite.py` and applied by `tests/conftest.py` (a skip whose reason names CUDA, CuPy or a GPU fails under `--gpu-required` unless the test carries the `optional` marker).

| Suite | Marker expression | `--gpu-required` | Needs CUDA | CUDA hidden | Environment |
| --- | --- | --- | --- | --- | --- |
| `cpu-pr` | `-m "not cuda and not long"` | no | no | yes | inherited |
| `gpu-nightly` | `-m "not long"` | yes | yes | no | inherited |
| `release-full` | none (every test) | yes | yes | no | `TORCHFDTD_RUN_CUDA_BOOTSTRAP_TEST=1`, `TORCHFDTD_RUN_CPML_KERNEL_CUDA_TEST=1` |

## Physics validation (stage G3)

One line per G3 task. Where `docs/validation/g3/<task>.json` exists, the criterion and the measured value are read from that record (limits from the record or from the pre-declared case under `docs/validation/cases/`) and the verdict is the comparison of the two; the full tables are in [PHYSICS_VALIDATION.md](PHYSICS_VALIDATION.md). Otherwise the newest evidence run supplies the test counts. A **FAIL** is a finding against a pre-declared limit and stays in the report.

| Task | Case | Record | Headline criterion | Measured | Verdict |
| --- | --- | --- | --- | --- | --- |
| G3-01 | Plane-wave propagation in vacuum and in a uniform n=1.5 dielectric, 2D and 3D, against the exact Yee dispersion relation and the continuum | `G3-01.json` | abs cos residual at most 1e-12 (part A, 32 eigenmode entries); abs(k - k_Yee) D at most 0.001 rad (part B, 24 runs) | 3.33e-16; 3.77e-07 rad | pass |
| G3-02 | Lossless dielectric slab, normal and oblique TE/TM, complex r and t against the in-test transfer matrix at 40 cells per material wavelength (revision 2 of G3-02_dielectric_slab_tmm) | `G3-02r2.json` | abs dR, abs dT at most 0.01, 0.01 and t phase at most 0.02 rad at 40 cells per material wavelength (24 instances); 20-cell over 40-cell error ratio between 3 and 5 (24 pairs) | 0.00928, 0.00927, 0.0133 rad; 24 of 24 within limits | pass |
| G3-03 | Drude and two-pole Lorentz slabs: complex R, T and absorption against TMM with the same analytic permittivity; fitting error and ADE time-discretization error separated | `G3-03.json` | abs dR, dT, dA at most 0.01 and t phase at most 0.02 rad for 8 analytic and 2 fitted slabs; ADE constitutive n, k error at most 0.001 | 0.00204, 0.0027, 0.000659, 0.00508 rad; ADE 0.000761 | pass |
| G3-04 | Closed-box TFSF scattering of a dielectric cylinder (2D, TM and TE) and a dielectric sphere (3D) against the Mie series | `G3-04.json` | integrated cross-section relative error at most 0.02 at the judged meshes (cylinder h = 0.0125 um TM and TE, sphere h = 0.05 um), CPU FP64 | cylinder TM 0.0174; cylinder TE 0.00373; sphere 0.00309; CUDA FP32 layer A max relative difference 2.08e-06 | pass |
| G3-05 | Drude metal sphere at three sizes below and near the plasmon resonance: scattering and absorption against Mie with a complex index, mesh sequence h, h/2, h/4 | `G3-05.json` | scattering and absorption relative error at h = 0.005 um, CPU FP64, within the case's per-radius budgets | r = 0.02 um: scattering 1.38 (budget 0.5), absorption 6.73 (budget 1); r = 0.035 um: scattering 0.458 (budget 0.3), absorption 4.99 (budget 0.6); r = 0.05 um: scattering 0.445 (budget 0.2), absorption 3.45 (budget 0.4) | **FAIL** |
| G3-06 | PEC/PMC cavity eigenfrequency, symmetry-reduced versus full domain, and gradient mapping | none (the test assertions are the record) | the pass/fail assertions of the required tests | 93 passed, 0 failed, 0 skipped in `20260921T185058Z-g3-06-8e377c95` | VERIFIED |
| G3-07 | Default CPML reflection at normal and oblique incidence in vacuum and in n=2, next to a dielectric interface, and 20,000-step stability | `G3-07.json` | reflected/incident power at most 1e-06 at normal incidence, 0.0001 at the declared oblique angles and 0.0001 next to an n=2 interface; energy after 20,000 steps at most 1e-06 of the peak | 2.14e-09, 8.64e-10, 1.2e-05; 3.56e-16 | pass |
| G3-08 | Bloch-periodic binary dielectric grating: forward and backward diffraction efficiencies and phases against TORCWA at normal and 20-degree incidence, TE and TM, three wavelengths | `G3-08.json` | diffraction efficiency error at most 0.01 and dominant-order phase error at most 0.02 rad against TORCWA at 640 harmonics (12 judged configurations); CUDA FP32 layer A relative difference at most 0.0001 | 0.00306; 0.0143 rad; layer A 0.000115 (12 rows) | **FAIL** |
| G3-09 | Mode solver effective index, field, confinement and power against analytic slab and fiber oracles | none (the test assertions are the record) | the pass/fail assertions of the required tests | 32 passed, 0 failed, 0 skipped in `20260921T164916Z-g3-09-a7e7b272` | VERIFIED |
| G3-10 | PIC mode-port networks: straight guide, discontinuity, Y branch and crossing S, reciprocity, passivity with the radiation defect measured | none (the test assertions are the record) | the pass/fail assertions of the required tests | 23 passed, 0 failed, 0 skipped in `20260921T164946Z-g3-10-ea83b20f` | VERIFIED |
| G3-11 | Dipole radiation: near-to-far and near-zone projection against analytic Hertzian fields, native far-field pattern convergence | none (the test assertions are the record) | the pass/fail assertions of the required tests | 56 passed, 0 failed, 0 skipped in `20260921T165000Z-g3-11-74c48d39` | VERIFIED |
| G3-12 | Tensor dielectrics: eigenpolarization dispersion, birefringent slab transmission and tensor gradients | none (the test assertions are the record) | the pass/fail assertions of the required tests | 45 passed, 0 failed, 0 skipped in `20260921T165015Z-g3-12-562acc59` | VERIFIED |
| G3-13 | Curved-interface convergence on the G3-04 dielectric cylinder: mesh sequence with staircase and subpixel interfaces, sub-cell centre shifts and the differentiable-solid smoothing width | `G3-13.json` | subpixel max relative error below the staircase error at h = 0.05 um for TM and TE (the mesh sequence, shifts and smoothing widths are reported only) | TM: staircase 0.0383, subpixel 0.00997; TE: staircase 0.112, subpixel 0.0197 | pass |
| G3-14 | Small discrete problems: CPU torch, CUDA torch, fused CUDA, streamed and reversible forward and VJP agreement | none (the test assertions are the record) | the pass/fail assertions of the required tests | 75 passed, 0 failed, 0 skipped in `20260921T185333Z-g3-14-1bd80f8e` | VERIFIED |
| G3-15 | Full-autograd oracle, explicit adjoint, central-difference step sweep, Taylor remainder and directional VJP checks | none (the test assertions are the record) | the pass/fail assertions of the required tests | 34 passed, 0 failed, 0 skipped in `20260921T190441Z-g3-15-ca5f7da9` | VERIFIED |
| G3-16 | Physical shape and material parameter gradients: slab thickness and permittivity against the Airy derivative, polygon vertices under mesh refinement | none (the test assertions are the record) | the pass/fail assertions of the required tests | 19 passed, 0 failed, 0 skipped in `20260921T190545Z-g3-16-7cf64e2d` | VERIFIED |
| G3-17 | Oracle independence, precision floor, time-window and PML error budgets of every G3 fixture | none (the test assertions are the record) | the pass/fail assertions of the required tests | 4 passed, 0 failed, 0 skipped in `20260921T210000Z-g3-17-dc84d85f` | VERIFIED |

## Cross-solver and Meep comparison headlines

Same-hardware comparison of 2026-09-22 on NVIDIA GeForce RTX 3060 12 GB (WSL2, driver from Windows) / 12th Gen Intel(R) Core(TM) i7-12700 ([CROSS_SOLVER_COMPARISON.md](CROSS_SOLVER_COMPARISON.md), record `cross_solver_3060.json`, drivers at worktree `fa57986a3c11`).

| Solver | Slab max abs T error | Slab max abs R error | Slab max abs R+T-1 | Mie sphere max relative error |
| --- | --- | --- | --- | --- |
| torchfdtd | 0.00153 | 0.00154 | 5.36e-06 | 0.0135 |
| fdtdx | 0.00154 | 0.00153 | 6.36e-06 | 0.0115 |
| meep | 0.00155 | 0.00153 | 1.49e-05 | 0.0115 |

| Throughput case | TorchFDTD median wall (s) | FDTDX (ratio) | Meep 12 ranks (ratio) |
| --- | --- | --- | --- |
| sphere-64 | 0.114 | 0.78 (6.8x) | 4.37 (38.3x) |
| sphere-96 | 0.31 | 2 (6.4x) | 13.6 (43.9x) |

| Adjoint solver | Median wall (s) | Ratio to TorchFDTD checkpointed | Gradient relative L2 vs TorchFDTD | Loss relative difference |
| --- | --- | --- | --- | --- |
| fdtdx_checkpointed | 5.27 | 51.5x | 7.06e-08 | 0 |
| fdtdx_reversible | 0.209 | 2.0x | 1.03e-07 | 0 |

Worked comparisons with Meep from the records under `docs/validation/meep_comparison/` ([MEEP_COMPARISON.md](MEEP_COMPARISON.md)):

| Device | Cells x steps | Agreement | Criteria passed | TorchFDTD stepping (s) | Meep stepping (s) | Ratio |
| --- | --- | --- | --- | --- | --- | --- |
| 2D microring resonator with a bus waveguide (Ez) | 469,500 x 89,219 | resonance wavelengths, max difference 5.6e-05 nm (limit 0.2 nm) | 5/5 | 31.4 | 217 (4 ranks, development) | 6.9 |
| 2D silicon ridge metalens (Ez) | 825,600 x 5,200 | focusing efficiency, difference 4.0e-06 (limit 0.01) | 4/4 | 1.57 | 13.3 (4 ranks, development) | 8.5 |
| 3D silicon pillar metalens (Ex) | 3,430,400 x 2,500 | focusing efficiency, difference 2.1e-06 (limit 0.01) | 5/5 | 6.06 | 129 (4 ranks, development) | 21.2 |
| 2D silicon metagrating on silica, with an RCWA oracle (Ez) | 18,200 x 12,000 | order efficiencies, max difference 2.0e-04 (limit 0.01) | 5/5 | 0.26 | 1.49 (4 ranks, development) | 5.7 |

## Known limitations

From [validation/known_limitations.json](validation/known_limitations.json); each entry names the record or document it comes from.

| Id | Limitation | Status | Gate tasks | Sources |
| --- | --- | --- | --- | --- |
| plasmonic-nanoparticle-staircase | Scattering and absorption of a staircased Drude metal sphere resolved by 4 to 10 cells per radius fail the case's own loose budgets at h = 0.005 um (scattering 1.376, 0.458 and 0.445 against budgets 0.5, 0.3 and 0.2; absorption 6.733, 4.985 and 3.446 against 1.0, 0.6 and 0.4 for radii 0.02, 0.035 and 0.05 um). Plasmonic nanoparticle cross sections are not a supported accuracy claim of the staircase material sampling. | FAILED gate, kept as a finding | G3-05 | `docs/validation/g3/G3-05.json`, `docs/validation/cases/G3-05_drude_sphere.json`, `docs/validation/runs/20260921T181951Z-g3-05-8fafa59e/evidence.json` |
| high-index-slab-resolution | At about 20 cells per material wavelength the n = 3.5 slabs exceed the 0.01 R/T and 0.02 rad phase limits (max abs dR 0.0128 to 0.0373, phase 0.0315 to 0.0539 rad) because of the second-order Yee phase error; the limits are met at about 40 cells per material wavelength (revision 2 of the case). Users of high-index structures need that resolution for 1 percent transmission accuracy. | resolution requirement of the staircase Yee scheme; first case FAILED and kept, revision-2 case VERIFIED | G3-02, G3-01 | `docs/validation/g3/G3-02.json`, `docs/validation/g3/G3-02r2.json`, `docs/PHYSICS_VALIDATION.md` |
| frozen-pml-dispersion | Drude/Lorentz pole cells inside the high-conductivity part of the CPML diverge after about 1500 steps on domains larger than a few micrometres; Region.pml_dispersion = 'frozen' avoids this by giving PML cells the real permittivity at the source centre frequency, at the price of a permittivity step at the interior/PML interface away from that frequency and no meaning for media whose real permittivity is negative there. The differentiable, dispersive-adjoint and streamed solvers reject 'frozen'; an adiabatic conductivity absorber is not implemented. | documented limit of the default 'ade' and the 'frozen' PML modes | none | `docs/BOUNDARIES.md` |
| grating-cuda-fp32-layer-a | One Bloch grating configuration (TM, 20 degrees, 0.92 um) exceeds the CUDA FP32 layer-A tolerance against CPU FP64 by 15 percent (relative difference 1.15e-4 against rtol 1e-4); the efficiency and phase agreement with TORCWA is within its limits. | FAILED gate, kept as a finding | G3-08 | `docs/validation/g3/G3-08.json`, `docs/validation/runs/20260921T181948Z-g3-08-6ccad85a/evidence.json` |
| multi-gpu | Single-problem multi-GPU forward, adjoint and scaling (the HPC profile, stage H1) cannot be verified: no host with two or more NVIDIA GPUs is available to the program. The domain decomposition is verified with two and three Linux CPU Gloo ranks only, which do not count as CUDA verification. | BLOCKED_EXTERNAL | H1-02, H1-03, H1-04, H1-05, H1-06 | `docs/validation/completion_gates.json`, `docs/RELEASE_SCOPE.md`, `docs/DOMAIN_DECOMPOSITION.md` |

## Evidence warnings

Every warning the judge attaches to a task; a warning never passes or fails a task by itself. The kinds: a run that started before its source commit was made (the tests ran on a tree that is not that commit), a case file first committed with or after its evidence (declaration order not verified), evidence recorded on a dirty tree, a file-level required test recorded before the recorder enumerated such files, and a scope change awaiting the owner (listed again below).

| Task | Warning |
| --- | --- |
| G1-01 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G1-01 | run predates its commit: the tests started at 2026-09-21T23:07:46.449202+09:00 before commit 1be01cca38dd was made |
| G1-02 | run predates its commit: the tests started at 2026-09-21T23:07:46.449202+09:00 before commit 1be01cca38dd was made |
| G1-03 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G1-03 | run predates its commit: the tests started at 2026-09-21T23:07:32.017315+09:00 before commit 1be01cca38dd was made |
| G2-06 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G3-01 | run predates its commit: the tests started at 2026-09-22T02:08:12.938239+09:00 before commit ce5f049d4375 was made |
| G3-02 | run predates its commit: the tests started at 2026-09-22T01:55:21.819372+09:00 before commit 88c577519350 was made |
| G3-02 | scope change pending approval (2 declaration(s), scope_change_approval is null): docs/validation/cases/G3-02_dielectric_slab_tmm.oracles.json declares superseded_by (a revised case); and 1 more |
| G3-03 | run predates its commit: the tests started at 2026-09-22T02:17:18.577354+09:00 before commit ce5f049d4375 was made |
| G3-04 | run predates its commit: the tests started at 2026-09-22T01:48:13.169199+09:00 before commit 487de42640e4 was made |
| G3-06 | scope change pending approval (6 declaration(s), scope_change_approval is null): docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/float32/atol = 3e-06 is looser than the loosest program atol 1e-06; and 5 more |
| G3-07 | run predates its commit: the tests started at 2026-09-22T02:19:25.414424+09:00 before commit ce5f049d4375 was made |
| G3-08 | run predates its commit: the tests started at 2026-09-22T03:36:06.301005+09:00 before commit 4a5f5cd6d19d was made |
| G3-08 | scope change pending approval (1 declaration(s), scope_change_approval is null): docs/validation/cases/G3-08r2_bloch_grating_rcwa_layer_a.json declares revision_of (a revised case) |
| G3-09 | scope change pending approval (4 declaration(s), scope_change_approval is null): docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/fiber_beta_relative_error_max/difference_from_common_criterion states a limit looser than the program threshold; and 3 more |
| G3-10 | scope change pending approval (2 declaration(s), scope_change_approval is null): docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/rtol = 0.001 is looser than the loosest program rtol 0.0001; and 1 more |
| G3-11 | scope change pending approval (1 declaration(s), scope_change_approval is null): docs/validation/cases/G3-11_dipole_radiation.json acceptance/near_flux_versus_far_power/rtol = 0.0005 is looser than the loosest program rtol 0.0001 |
| G3-12 | scope change pending approval (3 declaration(s), scope_change_approval is null): docs/validation/cases/G3-12_tensor_slab.json acceptance/slab/difference_from_common_criterion states a limit looser than the program threshold; and 2 more |
| G3-13 | run predates its commit: the tests started at 2026-09-22T01:48:13.267855+09:00 before commit 487de42640e4 was made |
| G3-14 | scope change pending approval (9 declaration(s), scope_change_approval is null): docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_solver.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; and 8 more |
| G3-15 | scope change pending approval (3 declaration(s), scope_change_approval is null): docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/rtol = 0.003 is looser than the loosest program rtol 0.0001; and 2 more |
| G3-16 | scope change pending approval (2 declaration(s), scope_change_approval is null): docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/fp32_chain/rtol = 0.0003 is looser than the loosest program rtol 0.0001; and 1 more |
| G4-01 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G4-02 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G4-03 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G4-04 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G5-01 | run predates its commit: the tests started at 2026-09-22T05:00:06.173976+09:00 before commit ed67736f91ca was made |
| G5-02 | run predates its commit: the tests started at 2026-09-22T05:04:29.794969+09:00 before commit ed67736f91ca was made |
| G5-03 | run predates its commit: the tests started at 2026-09-22T05:04:57.853722+09:00 before commit ed67736f91ca was made |
| G5-04 | run predates its commit: the tests started at 2026-09-22T05:05:38.632650+09:00 before commit ed67736f91ca was made |
| G6-01 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G6-02 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G6-03 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G6-04 | scope change pending approval (2 declaration(s), scope_change_approval is null): docs/validation/cases/G6-04.json acceptance/tracked_neff_error_max/difference_from_common_criterion states a limit looser than the program threshold; and 1 more |
| G6-07 | run predates its commit: the tests started at 2026-09-22T04:56:18.896576+09:00 before commit cbe9d4d9fc6a was made |
| G6-08 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G8-02 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G8-04 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G8-06 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |
| G9-01 | file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded |

## Pending owner approvals

Tasks whose case files declare a scope change (a revised case, or a limit looser than the program thresholds of the gate file) while `scope_change_approval` is still null. Section 0 of the program requires the owner's recorded approval for such changes; nothing here grants it, and the tasks keep their recorded states until it is given.

| Task | Declared change |
| --- | --- |
| G3-02 | docs/validation/cases/G3-02_dielectric_slab_tmm.oracles.json declares superseded_by (a revised case); docs/validation/cases/G3-02r2_slab_tmm_40_cells.json declares supersedes (a revised case) |
| G3-05 | docs/validation/cases/G3-05_drude_sphere.json acceptance/justification declares a program threshold not applicable |
| G3-06 | docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/float32/atol = 3e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/pmc/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/pmc_reference/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/symmetry_reduction/signals/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/symmetry_reduction/reduced_versus_doubled_fields/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/independent_endpoint_solver/atol = 2e-06 is looser than the loosest program atol 1e-06 |
| G3-08 | docs/validation/cases/G3-08r2_bloch_grating_rcwa_layer_a.json declares revision_of (a revised case) |
| G3-09 | docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/fiber_beta_relative_error_max/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/homogeneous_neff/atol = 2e-05 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/modal_power/gram/rtol = 0.0002 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/modal_power/gram/atol = 0.0002 is looser than the loosest program atol 1e-06 |
| G3-10 | docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/rtol = 0.001 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/atol = 1e-05 is looser than the loosest program atol 1e-06 |
| G3-11 | docs/validation/cases/G3-11_dipole_radiation.json acceptance/near_flux_versus_far_power/rtol = 0.0005 is looser than the loosest program rtol 0.0001 |
| G3-12 | docs/validation/cases/G3-12_tensor_slab.json acceptance/slab/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G3-12_tensor_slab.json acceptance/cuda_parity_float32/gradient/rtol = 0.0005 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-12_tensor_slab.json acceptance/cuda_parity_float32/difference_from_common_criterion states a limit looser than the program threshold |
| G3-14 | docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_solver.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_spacetime.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_pec_boundaries.py/signals/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_pec_boundaries.py/gradient/atol = 3e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_streamed_density.py response/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_tensor_native_cuda.py table VJP float32/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_endpoint_native_cpml_cuda.py VJPs float32/rtol = 0.0002 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_streamed_density.py gradient float32/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_streamed_density.py gradient float32/atol = 7e-06 is looser than the loosest program atol 1e-06 |
| G3-15 | docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/rtol = 0.003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/atol = 0.0003 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-15_gradient_checks.json acceptance/shape/cuda_float32_versus_autograd/rtol = 0.0003 is looser than the loosest program rtol 0.0001 |
| G3-16 | docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/fp32_chain/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/streamed/rtol = 0.0004 is looser than the loosest program rtol 0.0001 |
| G6-04 | docs/validation/cases/G6-04.json acceptance/tracked_neff_error_max/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G6-04.json acceptance/separated_amplitudes/atol = 1e-05 is looser than the loosest program atol 1e-06 |

## Consistency

Each check compares two sources of the same fact; a MISMATCH is reported here and makes the build exit nonzero.

| Check | Result | Detail |
| --- | --- | --- |
| package version | ok | pyproject.toml 0.14.0.dev0, COMPATIBILITY.md 0.14.0.dev0, CHANGELOG.md 0.14.0.dev0, clean-install wheel 0.14.0.dev0 |
| README row check `test_quick_start_selects_the_measured_path_explicitly` | ok | reproduced from its record |
| README row check `test_readme_capacity_row_matches_the_fp32_record` | ok | reproduced from its record |
| README row check `test_readme_fdtdx_adjoint_row_matches_the_cross_solver_record` | ok | reproduced from its record |
| README row check `test_readme_fdtdx_row_matches_the_cross_solver_record` | ok | reproduced from its record |
| README row check `test_readme_meep_row_matches_the_cross_solver_record` | ok | reproduced from its record |
| README row check `test_readme_restart_row_matches_the_restart_record` | ok | reproduced from its record |
| README "Compared with Meep" block | ok | equals the renderer output for the committed records |
| MEEP_COMPARISON.md | ok | equals the renderer output for the committed records |
| third-party notices and SBOM | ok | committed SBOM taken on win32, Python 3.10.2, Windows-10-10.0.26200-SP0: 52 components (52 installed there), 3 open items, 0 scan findings; check: passed against the tracked tree |
| RELEASE_SCOPE.md support claims | ok | 22 verification cells and the stage-status block rendered from the gate file |
| attestation wording | ok | no line uses the words that tests/test_validation_report.py forbids |

12 checks, 0 mismatch(es).
