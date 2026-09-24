# TorchFDTD internal validation report

Internal validation report of the completion program ([COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md)), rendered by `scripts/build_validation_report.py` from the machine outputs named in each section: the gate file and its evidence runs, the platform, clean-install, physics, cross-solver and Meep comparison records, the suite policy in `scripts/run_suite.py`, the version strings, and the known-limitations list (a hand-maintained JSON whose entries cite their records). No number here is typed into this file; `tests/test_validation_report.py` renders it again and compares. It records what was run and what those runs produced. It is not an attestation by a third party, and a passing gate is evidence for that gate only, never a general statement that the solver is correct for every problem.

Package version `0.15.0` (pyproject.toml). Gate file adopted at commit `f3efd3409aaa` with 83 tasks in 11 stages; newest evidence run `20260924T080129Z-g8-07-a0b05bd1` recorded 2026-09-24T08:01:29+00:00 at commit `55ae6b3c9475`.

Release rule of the gate file: `all_required_tasks_verified=True`, `required_skips_allowed=False`, `missing_or_stale_evidence_allowed=False`, `unresolved_required_external_blockers_allowed=False`, `unresolved_P0_P1_defects_allowed=False`, `source_and_release_artifact_identity_required=True`, `public_release_separately_authorized=True`, `machine_gate_does_not_replace_independent_review=True`.
Technical readiness of a release candidate (every required task VERIFIED with evidence that matches the candidate) and authorization of a public release are separate decisions; this report can only inform the first, and the second is not given by any file in this repository.

## Release judgement by profile

| Profile | Required stages | Scope status | Pass | Fail | Optional | FAILED outside the profile | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WORKSTATION | G0, G1, G2, G3, G4, G5, G6, G7, G8, G9 | DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS | 68 | 8 | 0 | none | NOT RELEASABLE |
| HPC | G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, H1 | DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS | 68 | 14 | 0 | none | NOT RELEASABLE |

A task passes when it is VERIFIED by an evidence run whose source commit is an ancestor of the current commit and whose test sources, fixture and criteria files are unchanged, with no failed, errored, skipped or absent required test and no external blocker; stale evidence is a failure here, as in `scripts/check_release_gates.py` without `--allow-stale`.

## Gate tasks by stage

One row per task of [validation/completion_gates.json](validation/completion_gates.json): the recorded implementation and verification states, the newest evidence run and its source commit, and the judgement of that evidence against the current tree.

### G0 기준선·범위·증거 체계 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G0-01 | 실제 HEAD/dirty tree/기존 계획/자원·권한 확인 | IMPLEMENTED | VERIFIED | `20260923T175644Z-g0-01-9c309625` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G0-02 | RELEASE_SCOPE와 기능·검증 상태 분리 | IMPLEMENTED | VERIFIED | `20260923T175700Z-g0-02-bca10398` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G0-03 | 기존 완료 계획·gate·fixture·raw evidence 단일 추적 | IMPLEMENTED | VERIFIED | `20260923T175710Z-g0-03-bef86964` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G0-04 | 필수 누락/실패/skip/source 불일치에서 출고 실패 판정기 | IMPLEMENTED | VERIFIED | `20260923T180319Z-g0-04-6e4de0a5` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G0-05 | 판정기 자체 failure injection과 세션 인계 구조 | IMPLEMENTED | VERIFIED | `20260923T180703Z-g0-05-93dca35e` | `4635db7eab69` | PASS | evidence matches the current checkout |

### G1 과거 리뷰 회귀 및 수정 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1-01 | 자동 graded mesh와 미분 평면 모델의 격자 불일치. | IMPLEMENTED | VERIFIED | `20260923T180754Z-g1-01-72bedd87` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G1-02 | reference signature의 실제 격자 누락. | IMPLEMENTED | VERIFIED | `20260923T180837Z-g1-02-de5b921a` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G1-03 | quadrant_intensity_allocation의 FP32 불안정. | IMPLEMENTED | VERIFIED | `20260923T180913Z-g1-03-45424e33` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G1-04 | restart 코드 호환성 검사 누락. | IMPLEMENTED | VERIFIED | `20260923T181355Z-g1-04-584298f5` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G1-05 | journal 저장공간 산정. | IMPLEMENTED | VERIFIED | `20260923T181843Z-g1-05-14e56c39` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G1-06 | 문서/실행 경로 일치. | IMPLEMENTED | VERIFIED | `20260924T080108Z-g1-06-f6c3ea64` | `55ae6b3c9475` | PASS | evidence matches the current checkout |

### G2 물리·격자·실행 계약 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G2-01 | 기존 구조를 활용하여 immutable resolved/compiled simulation plan을 만든다 | IMPLEMENTED | VERIFIED | `20260923T181928Z-g2-01-f7c8fd4d` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G2-02 | forward/adjoint/streamed/tensor batch/GUI가 서로 다른 규칙으로 물리 입력을 다시 해석하지 않도록 한다 | IMPLEMENTED | VERIFIED | `20260923T181944Z-g2-02-be64b4f1` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G2-03 | capability registry를 만들고 dimensions × mesh × materials × boundaries × sources × monitors × forward/backward × resident/streamed × precision/backend의 유효 조합을 명시한다 | IMPLEMENTED | VERIFIED | `20260923T182049Z-g2-03-e0055f47` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G2-04 | 전수 조합 대신 위험 기반 pairwise 검사와 고위험 3~4개 기능 조합을 설계한다 | IMPLEMENTED | VERIFIED | `20260923T182145Z-g2-04-b060dd10` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G2-05 | "+/- DFT", Bloch spatial phase, E/H half-step, normal/outward direction, reduced units vs SI calibration, lossy exterior, 2D 단위길이 전력을 공개 specification과 테스트로 고정한다. | IMPLEMENTED | VERIFIED | `20260923T182213Z-g2-05-4a9fdb62` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G2-06 | cache/reference/restart마다 필요한 동일성 조건을 분리한다 | IMPLEMENTED | VERIFIED | `20260923T182245Z-g2-06-44144ccb` | `4635db7eab69` | PASS | evidence matches the current checkout |

### G3 독립 물리·gradient 검증 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G3-01 | 균일 매질 2D/3D 전파·위상·분산 | IMPLEMENTED | VERIFIED | `20260923T182721Z-g3-01-8cf720e9` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G3-02 | 유전체 slab normal/oblique TE/TM과 TMM | IMPLEMENTED | VERIFIED | `20260923T183251Z-g3-02-e90cd4d2` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G3-03 | Drude/Lorentz slab fit/ADE 오차 분리 | IMPLEMENTED | VERIFIED | `20260923T183414Z-g3-03-563173dd` | `4635db7eab69` | PASS | evidence matches the current checkout |
| G3-04 | dielectric cylinder/sphere Mie 산란 | IMPLEMENTED | VERIFIED | `20260923T185232Z-g3-04-ee03b515` | `4635db7eab69` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 4635db7eab69 alone |
| G3-05 | 금속/분산 곡면 산란·흡수 수렴 | IMPLEMENTED | FAILED | `20260923T195353Z-g3-05-ac0e638c` | `4635db7eab69` | FAIL | verification_state is FAILED |
| G3-06 | PEC/PMC cavity·symmetry와 gradient mapping | IMPLEMENTED | VERIFIED | `20260923T195520Z-g3-06-28754df0` | `4635db7eab69` | PASS | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 4635db7eab69 alone |
| G3-07 | PML normal/oblique 반사·장시간 안정성 | IMPLEMENTED | VERIFIED | `20260923T195646Z-g3-07-ab3662ea` | `4635db7eab69` | PASS | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 4635db7eab69 alone |
| G3-08 | Bloch grating·회절과 독립 RCWA | IMPLEMENTED | VERIFIED | `20260923T202923Z-g3-08-f1c2dff5` | `4635db7eab69` | PASS | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 4635db7eab69 alone |
| G3-09 | mode neff·field·confinement·power oracle | IMPLEMENTED | VERIFIED | `20260923T212310Z-g3-09-e55a1b01` | `3e9300300d15` | PASS | evidence matches the current checkout |
| G3-10 | PIC S·수동성·상반성과 누락 방사 채널 | IMPLEMENTED | VERIFIED | `20260923T212720Z-g3-10-f3da775f` | `3e9300300d15` | PASS | evidence matches the current checkout |
| G3-11 | dipole far/near field와 표면/격자 수렴 | IMPLEMENTED | VERIFIED | `20260923T212746Z-g3-11-1121cd71` | `3e9300300d15` | PASS | evidence matches the current checkout |
| G3-12 | tensor slab 및 tensor gradient | IMPLEMENTED | VERIFIED | `20260923T213042Z-g3-12-9d50987d` | `3e9300300d15` | PASS | evidence matches the current checkout |
| G3-13 | 곡면 grid offset/mesh/smoothing 폭 물리 수렴 | IMPLEMENTED | VERIFIED | `20260923T213445Z-g3-13-72cea131` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-14 | 무차원 small discrete CPU/Torch/CUDA/VJP 수치 비교 | IMPLEMENTED | VERIFIED | `20260923T213556Z-g3-14-ecf4b06b` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-15 | full-autograd·directional VJP·FD sweep·Taylor 검사 | IMPLEMENTED | VERIFIED | `20260923T213649Z-g3-15-7368e5ea` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-16 | 실제 shape/material 파라미터의 물리 gradient 수렴 | IMPLEMENTED | VERIFIED | `20260923T213745Z-g3-16-4c6f38b9` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-17 | oracle 독립성·정밀도·시간·PML 오차 budget 확인 | IMPLEMENTED | VERIFIED | `20260923T213754Z-g3-17-de4fa8eb` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |

### G4 CUDA·CI·환경 검증 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G4-01 | 보유한 실제 GPU와 OS·driver·runtime부터 확인한다 | IMPLEMENTED | VERIFIED | `20260923T213812Z-g4-01-f3e0cfde` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-02 | torch/fused, CUDA graph on/off, fused/reference monitor, FP32/FP64, real/complex, standard/nondefault stream의 valid 경로를 비교한다. | IMPLEMENTED | VERIFIED | `20260923T213850Z-g4-02-e1a17660` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-03 | noncontiguous tensors, duplicate observers, multiple calls/backward, input lifetime, stream synchronization, cancellation, allocator cleanup을 검사한다 | IMPLEMENTED | VERIFIED | `20260923T213916Z-g4-03-76bb26f3` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-04 | 최소 격자·홀수 크기·부분 slab·비정렬 tile·index boundary·강한 material contrast·ADE/CPML memory를 무작위/경계 fixture에 포함한다 | IMPLEMENTED | VERIFIED | `20260923T213956Z-g4-04-c280e637` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-05 | CPU PR suite, 신뢰한 코드의 GPU 정기 suite, 실제 release의 전체 GPU suite를 분리한다 | IMPLEMENTED | VERIFIED | `20260923T214253Z-g4-05-e0a9e8d3` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-06 | public fork PR의 untrusted code를 개인/연구실 GPU host에서 자동 실행하지 않는다 | IMPLEMENTED | VERIFIED | `20260923T214307Z-g4-06-77b53ff7` | `3e9300300d15` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |

### G5 메모리·재시작·장기 안정성 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G5-01 | resident/host/disk/async 경로를 같은 물리 문제·관측자·목적함수에서 비교한다 | IMPLEMENTED | VERIFIED | `20260923T221312Z-g5-01-f5803427` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-02 | peak Torch allocated/reserved, CUDA 전체 process memory(가용한 계측 사용), RSS/PSS 또는 플랫폼 동등량, committed memory, OS cache, 디스크 사용량·총 읽기/쓰기·실효 대역폭을 구분한다 | IMPLEMENTED | VERIFIED | `20260923T221324Z-g5-02-b714b93d` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-03 | planner의 byte admission과 실제 peak를 맞추고 원자적 동시 reservation 또는 동등 admission으로 여러 작업이 각각 free memory를 보고 동시에 초과하는 문제를 다룬다 | IMPLEMENTED | VERIFIED | `20260923T221340Z-g5-03-a578dc72` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-04 | 전체 3D epsilon/VJP를 만들지 않는 geometry/density slab 생성·gradient 축약 경로를 공개 합성 구조로 시험한다 | IMPLEMENTED | VERIFIED | `20260923T221415Z-g5-04-2bba1874` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-05 | meaningful beyond-VRAM 사례 하나를 추가한다 | IMPLEMENTED | VERIFIED | `20260923T221422Z-g5-05-bd1a2304` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-06 | 위 대규모 사례는 승인된 실행/디스크 쓰기 예산 안에서 수행한다 | IMPLEMENTED | VERIFIED | `20260923T221428Z-g5-06-66a78577` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-07 | forward 중단, backward 중단, process kill, simulated ENOSPC/OOM, read/write fault, truncate/checksum 오류, CUDA transfer failure, cancellation을 주입한다 | IMPLEMENTED | VERIFIED | `20260923T221929Z-g5-07-0059441c` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-08 | checkpoint에 solver와 필요한 auxiliary states, optimizer state, scheduler/projection state, RNG, effective source, configuration fingerprint를 보존한다 | IMPLEMENTED | VERIFIED | `20260923T222133Z-g5-08-f224db63` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-09 | journal은 run별 소유권과 동시 writer 잠금을 갖는다 | IMPLEMENTED | VERIFIED | `20260923T222349Z-g5-09-8865c95f` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G5-10 | 경량 fixture에서 1e5 steps, 반복 실행, 최소 100 optimizer updates 및 승인된 장시간 soak를 수행한다 | IMPLEMENTED | VERIFIED | `20260923T222355Z-g5-10-99edb19d` | `9d2eb55a1955` | PASS | evidence matches the current checkout |

### G6 사용자 물리·역설계 API (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G6-01 | 재료 CSV/nk/epsilon import, passive fitting, 원자료 출처·사용권·해시, fit band, 시간 이산화에 따른 n/k 오차, extrapolation 경고를 하나의 workflow로 묶는다 | IMPLEMENTED | VERIFIED | `20260923T222407Z-g6-01-114c1af7` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G6-02 | source의 실제 공간 분포·위상·편광·시간 파형·유효 bandwidth를 preview한다 | IMPLEMENTED | VERIFIED | `20260923T222417Z-g6-02-3f663e29` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G6-03 | reference를 포함한 R/T/A, 복소 S, phase/group delay, mode decomposition, diffraction, far-field/near-zone을 기존 결과와 통합한다 | IMPLEMENTED | VERIFIED | `20260923T222451Z-g6-03-3a35e50c` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G6-04 | 포트별 mode tracking, normalization, reference plane, forward/backward separation과 퇴화/약한 모드 진단을 제공한다 | IMPLEMENTED | VERIFIED | `20260923T222457Z-g6-04-3241b7e8` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G6-05 | 기존 design/periodic/mode-network API를 재사용해 objective→parameterization→optimizer→history→resume→final evaluation의 최소 고수준 인터페이스를 통합한다 | IMPLEMENTED | VERIFIED | `20260923T222623Z-g6-05-c203fd5c` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G6-06 | density filter, projection, beta continuation, symmetry, mask, min linewidth/gap, fabrication perturbation, binary export를 실제 검사와 연결한다 | IMPLEMENTED | VERIFIED | `20260923T222749Z-g6-06-e2218845` | `9d2eb55a1955` | PASS | evidence matches the current checkout |
| G6-07 | export된 binary/GDS 구조를 다시 import하여 독립 finer forward로 평가한다 | IMPLEMENTED | VERIFIED | `20260923T224837Z-g6-07-af85816a` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G6-08 | low-intensity/near-zero reference/frequency cutoff/evanescent/backflow에서 NaN·음의 국소 flux·invalid phase를 임의 clipping으로 숨기지 않는다 | IMPLEMENTED | VERIFIED | `20260923T224847Z-g6-08-27705f46` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |

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
| G8-01 | 기존 Project JSON/NPZ compatibility와 schema migration을 시험한다 | IMPLEMENTED | VERIFIED | `20260923T224857Z-g8-01-2e733767` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-02 | 큰 결과의 chunked/lazy read가 필요하면 HDF5 또는 Zarr 중 요구에 맞는 한 구현을 우선 채택한다 | IMPLEMENTED | VERIFIED | `20260923T224908Z-g8-02-882d22ba` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-03 | GUI의 CAD/GDS → material/source/boundary → 실제 mesh preview → resource preflight → job queue → cancel/resume → 결과 overlay → 데이터/GDS export 경로를 E2E로 시험한다. | IMPLEMENTED | VERIFIED | `20260923T224914Z-g8-03-39b0bae7` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-04 | geometry 편집의 undo/redo, copy/multiselect, autosave/recovery, versioned project, 구조/parameter 단위 검증과 결과 stale 표시를 구현/확인한다 | IMPLEMENTED | VERIFIED | `20260923T224924Z-g8-04-e8e32bbf` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-05 | 최종 wheel에 frontend 정적 자산을 포함하고 최종 사용자가 Node/npm이나 저장소 checkout 없이 UI를 실행하도록 한다 | IMPLEMENTED | VERIFIED | `20260924T080115Z-g8-05-f3144c36` | `55ae6b3c9475` | PASS | evidence matches the current checkout |
| G8-06 | 지원 Python/Torch/CuPy/runtime 최소·최대 버전을 실제 설치 시험으로 확정한다 | IMPLEMENTED | VERIFIED | `20260924T080123Z-g8-06-b678cc04` | `55ae6b3c9475` | PASS | evidence matches the current checkout |
| G8-07 | README의 모든 기본 예제를 installed wheel에서 실행한다 | IMPLEMENTED | VERIFIED | `20260924T080129Z-g8-07-a0b05bd1` | `55ae6b3c9475` | PASS | evidence matches the current checkout |

### G9 보안·운영·출고 판정 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G9-01 | local server의 loopback 기본값, origin/host 검증, 허용된 파일 경로, 업로드 크기, path traversal, 악성/손상 JSON/NPZ/GDS, 압축 폭탄과 unsafe pickle을 검사한다 | IMPLEMENTED | VERIFIED | `20260923T225017Z-g9-01-37fad064` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G9-02 | 코드와 번들 데이터의 출처·license·third-party notices·SBOM·dependency/security scan을 수행한다 | IMPLEMENTED | VERIFIED | `20260923T225107Z-g9-02-626de86f` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G9-03 | RELEASE_REVIEW의 미해결 계약/배포 질문을 실제 문서에 따라 추적한다 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G9-04 | API stability/deprecation, project/result/checkpoint version compatibility, changelog, 알려진 한계, bug template, minimal repro, numerical bug severity, release rollback/결과 영향 공지를 준비한다. | IMPLEMENTED | VERIFIED | `20260923T225117Z-g9-04-ec7eb9cb` | `9d2eb55a1955` | PASS | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G9-05 | 독립 사용자 또는 독립 설치 환경에서 세 대표 workflow를 실행하고, 실제 발견 이슈를 정리한다 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G9-06 | 최종 release candidate의 정확한 source tree와 wheel에서 전체 필수 gate를 실행한다 | IN_PROGRESS | VERIFIED | `20260923T235752Z-g9-06-b92d9083` | `3338a4b9a3a9` | PASS | evidence matches the current checkout |
| G9-07 | validation report를 기계 산출물에서 생성한다 | IMPLEMENTED | SELF | none | none | self | this report's own gate, recorded after the render; judge it with scripts/check_release_gates.py |

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
| rtx3060-win11-lab | G4-01 `20260923T213812Z-g4-01-f3e0cfde` (platform_id); G4-02 `20260923T213850Z-g4-02-e1a17660` (platform_id); G4-03 `20260923T213916Z-g4-03-76bb26f3` (platform_id); G4-04 `20260923T213956Z-g4-04-c280e637` (platform_id); G4-05 `20260923T214253Z-g4-05-e0a9e8d3` (platform_id); G4-06 `20260923T214307Z-g4-06-77b53ff7` (platform_id) | 63 |
| rtx5880-ada-win11-remote | none | 0 |

Newest runs that match no platform record: none.

## Clean-install record

Newest record `20260923T173837Z-afda8955.json` (kind `clean_install_record`), taken at commit `afda8955fa1c` on 2026-09-23T17:38:37+00:00 with 0 dirty packaging paths; all steps passed: yes.

Wheel `torchfdtd-0.15.0-py3-none-any.whl`, SHA-256 `675c55e0188f51d41cd58df189eea7a82f1dd798e4e60ac888f12da372e9011e`, 968,615 bytes, 159 entries, 152 package files; browser assets match the committed ones: yes; frontend assets current: yes.

| Environment | Python | torch | cupy-cuda12x | numpy | torchfdtd | Packages |
| --- | --- | --- | --- | --- | --- | --- |
| g8-cpu | 3.10.2 | 2.14.0+cpu | absent | 2.2.6 | 0.15.0 | 40 |
| g8-cuda | 3.10.2 | 2.10.0+cu126 | 13.6.0 | 2.2.6 | 0.15.0 | 42 |

| Step | Status | Seconds |
| --- | --- | --- |
| build_wheel | passed | 26.4 |
| cpu_venv_create | passed | 19.18 |
| cpu_pip_install_torch | passed | 110.74 |
| cpu_pip_install_wheel | passed | 57.87 |
| cpu_package_list | passed | 3.44 |
| cpu_import_run_save_load | passed | 10.78 |
| cpu_server_index_assets_api | passed | 7.8 |
| cpu_doctor | passed | 9.88 |
| cuda_venv_create | passed | 15.36 |
| cuda_pip_install_torch | passed | 152.3 |
| cuda_pip_install_wheel_extras | passed | 65.99 |
| cuda_package_list | passed | 4.58 |
| cuda_fused_forward_run | passed | 17.0 |
| cuda_doctor | passed | 4.78 |
| readme_examples | passed | 17.94 |

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
| G3-06 | PEC/PMC cavity eigenfrequency, symmetry-reduced versus full domain, and gradient mapping | none (the test assertions are the record) | the pass/fail assertions of the required tests | 93 passed, 0 failed, 0 skipped in `20260923T195520Z-g3-06-28754df0` | VERIFIED |
| G3-07 | Default CPML reflection at normal and oblique incidence in vacuum and in n=2, next to a dielectric interface, and 20,000-step stability | `G3-07.json` | reflected/incident power at most 1e-06 at normal incidence, 0.0001 at the declared oblique angles and 0.0001 next to an n=2 interface; energy after 20,000 steps at most 1e-06 of the peak | 2.14e-09, 8.64e-10, 1.2e-05; 3.56e-16 | pass |
| G3-08 | Bloch-periodic binary dielectric grating: forward and backward diffraction efficiencies and phases against TORCWA at normal and 20-degree incidence, TE and TM, three wavelengths | `G3-08.json` | diffraction efficiency error at most 0.01 and dominant-order phase error at most 0.02 rad against TORCWA at 640 harmonics (12 judged configurations); CUDA FP32 layer A relative difference at most 0.0001 | 0.00306; 0.0143 rad; layer A 0.000115 (12 rows) | **FAIL** |
| G3-09 | Mode solver effective index, field, confinement and power against analytic slab and fiber oracles | none (the test assertions are the record) | the pass/fail assertions of the required tests | 32 passed, 0 failed, 0 skipped in `20260923T212310Z-g3-09-e55a1b01` | VERIFIED |
| G3-10 | PIC mode-port networks: straight guide, discontinuity, Y branch and crossing S, reciprocity, passivity with the radiation defect measured | none (the test assertions are the record) | the pass/fail assertions of the required tests | 23 passed, 0 failed, 0 skipped in `20260923T212720Z-g3-10-f3da775f` | VERIFIED |
| G3-11 | Dipole radiation: near-to-far and near-zone projection against analytic Hertzian fields, native far-field pattern convergence | none (the test assertions are the record) | the pass/fail assertions of the required tests | 56 passed, 0 failed, 0 skipped in `20260923T212746Z-g3-11-1121cd71` | VERIFIED |
| G3-12 | Tensor dielectrics: eigenpolarization dispersion, birefringent slab transmission and tensor gradients | none (the test assertions are the record) | the pass/fail assertions of the required tests | 45 passed, 0 failed, 0 skipped in `20260923T213042Z-g3-12-9d50987d` | VERIFIED |
| G3-13 | Curved-interface convergence on the G3-04 dielectric cylinder: mesh sequence with staircase and subpixel interfaces, sub-cell centre shifts and the differentiable-solid smoothing width | `G3-13.json` | subpixel max relative error below the staircase error at h = 0.05 um for TM and TE (the mesh sequence, shifts and smoothing widths are reported only) | TM: staircase 0.0383, subpixel 0.00997; TE: staircase 0.112, subpixel 0.0197 | pass |
| G3-14 | Small discrete problems: CPU torch, CUDA torch, fused CUDA, streamed and reversible forward and VJP agreement | none (the test assertions are the record) | the pass/fail assertions of the required tests | 75 passed, 0 failed, 0 skipped in `20260923T213556Z-g3-14-ecf4b06b` | VERIFIED |
| G3-15 | Full-autograd oracle, explicit adjoint, central-difference step sweep, Taylor remainder and directional VJP checks | none (the test assertions are the record) | the pass/fail assertions of the required tests | 34 passed, 0 failed, 0 skipped in `20260923T213649Z-g3-15-7368e5ea` | VERIFIED |
| G3-16 | Physical shape and material parameter gradients: slab thickness and permittivity against the Airy derivative, polygon vertices under mesh refinement | none (the test assertions are the record) | the pass/fail assertions of the required tests | 19 passed, 0 failed, 0 skipped in `20260923T213745Z-g3-16-4c6f38b9` | VERIFIED |
| G3-17 | Oracle independence, precision floor, time-window and PML error budgets of every G3 fixture | none (the test assertions are the record) | the pass/fail assertions of the required tests | 4 passed, 0 failed, 0 skipped in `20260923T213754Z-g3-17-de4fa8eb` | VERIFIED |

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
| G3-04 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 4635db7eab69 alone |
| G3-06 | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 4635db7eab69 alone |
| G3-07 | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 4635db7eab69 alone |
| G3-08 | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 4635db7eab69 alone |
| G3-13 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-14 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-15 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-16 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G3-17 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-01 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-02 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-03 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-04 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-05 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G4-06 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 3e9300300d15 alone |
| G6-07 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G6-08 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-01 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-02 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-03 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G8-04 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G9-01 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G9-02 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |
| G9-04 | evidence was recorded on a dirty tree (6 paths); it is not tied to commit 9d2eb55a1955 alone |

## Pending owner approvals

Tasks whose case files declare a scope change (a revised case, or a limit looser than the program thresholds of the gate file) while `scope_change_approval` is still null. Section 0 of the program requires the owner's recorded approval for such changes; nothing here grants it, and the tasks keep their recorded states until it is given.

None: every declared scope change carries an approval.

### Approved scope changes

Declared scope changes with the owner's recorded approval (`scope_change_approval` in the gate file). An approval accepts the declared limits of that task; it does not change the program thresholds.

| Task | Declared change | Approval |
| --- | --- | --- |
| G3-02 | docs/validation/cases/G3-02_dielectric_slab_tmm.oracles.json declares superseded_by (a revised case); docs/validation/cases/G3-02r2_slab_tmm_40_cells.json declares supersedes (a revised case) | approved by owner on 2026-09-24 |
| G3-05 | docs/validation/cases/G3-05_drude_sphere.json acceptance/justification declares a program threshold not applicable | approved by owner on 2026-09-24 |
| G3-06 | docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/float32/atol = 3e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/pmc/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/pmc_reference/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/symmetry_reduction/signals/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/symmetry_reduction/reduced_versus_doubled_fields/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/independent_endpoint_solver/atol = 2e-06 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-08 | docs/validation/cases/G3-08r2_bloch_grating_rcwa_layer_a.json declares revision_of (a revised case) | approved by owner on 2026-09-24 |
| G3-09 | docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/fiber_beta_relative_error_max/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/homogeneous_neff/atol = 2e-05 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/modal_power/gram/rtol = 0.0002 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/modal_power/gram/atol = 0.0002 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-10 | docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/rtol = 0.001 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/atol = 1e-05 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-11 | docs/validation/cases/G3-11_dipole_radiation.json acceptance/near_flux_versus_far_power/rtol = 0.0005 is looser than the loosest program rtol 0.0001 | approved by owner on 2026-09-24 |
| G3-12 | docs/validation/cases/G3-12_tensor_slab.json acceptance/slab/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G3-12_tensor_slab.json acceptance/cuda_parity_float32/gradient/rtol = 0.0005 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-12_tensor_slab.json acceptance/cuda_parity_float32/difference_from_common_criterion states a limit looser than the program threshold | approved by owner on 2026-09-24 |
| G3-14 | docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_solver.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_spacetime.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_pec_boundaries.py/signals/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_pec_boundaries.py/gradient/atol = 3e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_streamed_density.py response/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_tensor_native_cuda.py table VJP float32/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_endpoint_native_cpml_cuda.py VJPs float32/rtol = 0.0002 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_streamed_density.py gradient float32/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_streamed_density.py gradient float32/atol = 7e-06 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-15 | docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/rtol = 0.003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/atol = 0.0003 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-15_gradient_checks.json acceptance/shape/cuda_float32_versus_autograd/rtol = 0.0003 is looser than the loosest program rtol 0.0001 | approved by owner on 2026-09-24 |
| G3-16 | docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/fp32_chain/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/streamed/rtol = 0.0004 is looser than the loosest program rtol 0.0001 | approved by owner on 2026-09-24 |
| G6-04 | docs/validation/cases/G6-04.json acceptance/tracked_neff_error_max/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G6-04.json acceptance/separated_amplitudes/atol = 1e-05 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |

## Consistency

Each check compares two sources of the same fact; a MISMATCH is reported here and makes the build exit nonzero.

| Check | Result | Detail |
| --- | --- | --- |
| package version | ok | pyproject.toml 0.15.0, COMPATIBILITY.md 0.15.0, CHANGELOG.md 0.15.0, clean-install wheel 0.15.0 |
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
