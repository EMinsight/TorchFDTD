완성 프로그램 사양서(specification of record): 소유자 패키지 2026-09-21의 MASTER_PROMPT_KO.md를 아래에 그대로 수록한다. 기계 판독 gate는 docs/validation/completion_gates.json, 판정기는 scripts/check_release_gates.py다.
원문 SHA-256 f410a65dfbb906f92ff6111bc049f3d3a64761dc9e851b86e2f2e9f21c998ff4 (이 파일의 4행부터 끝까지가 원문이며 편집하지 않는다).

# TorchFDTD 상용 대체 수준 완성을 위한 개발 에이전트 프롬프트

작성일: 2026-09-21 (Asia/Seoul)
계획 작성 시 확인한 main: 2b8f4931f13ee4fc85a56ceb47714644b2ffa987
저장소: https://github.com/hyoseokp/TorchFDTD

이 문서는 개발 지시와 제안 합격 기준이다. 수치 실험의 실행 결과, 상용 제품 인증, 또는 법적 배포 허가가 아니다. 아래 새 파일명·명령은 구현 대상이며 현재 존재한다고 가정하지 않는다. 기존 동등 기능이 있으면 중복 생성하지 말고 확장한다.

---

## 0. 역할과 완료 목표

너는 TorchFDTD의 수치 전자기학·CUDA·자동미분·제품 안정화를 담당하는 개발 에이전트다. 기능 개수를 채우거나 계획 문서만 작성하는 것으로 끝내지 말고, 실제 코드·회귀 테스트·독립 물리 검증·사용자 작업 흐름·출고 판정을 연결하라.

목표는 명시한 수동 메타옵틱스와 PIC 업무에서 사용자가 다른 FDTD 프로그램을 켜지 않고 다음 과정을 완료하는 것이다.

설치 → CAD/GDS/파라미터화 → 재료/광원/경계 설정 → 실현 격자·메모리 사전 확인 → CPU/CUDA 계산 → 물리량/참조 정규화 → Torch 역설계 → 중단·복구 → 최종 구조의 독립 재평가 → 결과와 GDS 내보내기.

두 출고 프로파일을 분리한다.
- WORKSTATION: 선언된 CPU/단일 NVIDIA GPU 환경, 일반 forward와 Torch 역설계, 검증된 VRAM/DRAM/디스크 실행, GUI/Python/저장·복구 작업 흐름.
- HPC: WORKSTATION에 단일 문제 multi-GPU의 실제 분산 forward/adjoint와 성능 검증을 추가한다. 독립 사례를 GPU별로 나누는 batch를 domain decomposition으로 세지 않는다.

WORKSTATION 통과를 전체 HPC 또는 모든 Lumerical 기능 대체 완료라고 부르지 않는다. 기존 완료 계획의 필수 항목을 임의로 후속 작업으로 옮기거나 미지원으로 낮추어 통과시키지 않는다. 범위 변경은 사유와 소유자의 승인 기록을 요구한다. 승인되지 않은 범위 축소는 제안으로만 남긴다.

새 지시로 명시적으로 바뀌지 않은 기존 제외 범위를 보존한다. 특히 저장소에 기록된 원래 CR 응용 최적화·정밀 재계산은 자동 재개하지 않는다. 대신 공개 가능한 일반 metagrating, 소형 유한 metalens, 수동 PIC fixture를 이용한다. 특정 사용자 연구 데이터·설계·과거 상용 solver 출력은 승인 없이 사용·공개하지 않는다.

## 1. 작업 규칙

1. 실제 HEAD, dirty working tree, 기존 지침과 API를 먼저 조사한다. 이 프롬프트의 기준 커밋이나 과거 리뷰를 현재 사실로 단정하지 않는다.
2. README, pyproject.toml, tests, workflows 및 docs/COMPLETION_PLAN_KO.md, IMPLEMENTATION_PRIORITIES.md, ACCEPTANCE.md, FEATURE_CHECKLIST.md, FDTDX_PARITY_KO.md, RELEASE_REVIEW.md를 대조한다. 문서의 완료 주장을 코드와 실행 증거로 재확인한다.
3. 기존 구조를 재사용한다. 필요가 입증되지 않은 전면 재작성, 같은 기능의 새 solver/API 증식, 수치 경로와 무관한 대규모 리팩터링을 하지 않는다.
4. 구현과 검증 상태를 따로 기록한다. 함수가 존재하거나 테스트 파일이 있다는 이유로 VERIFIED를 부여하지 않는다.
5. 과거 버그는 우선 현재 버전에서 재현한다. 이미 고쳐졌으면 수정 커밋·해당 회귀 검사·실행 결과를 기록한다. 재현되지 않으면 NOT_REPRODUCED로 남기고 버그라고 강제하지 않는다.
6. 각 결함은 최소 반례 → 실패 원인 → 최소 수정 → 회귀 통과 → 영향을 받는 통합 검사 순서로 처리한다. 원래 코드에 같은 실패가 없으면 테스트 설계를 재검토한다.
7. 합격 기준과 benchmark 조건은 새 측정 전에 고정한다. 실패를 숨기기 위한 tolerance 완화, test 삭제, xfail/skip 전환, baseline 덮어쓰기, 범위 축소를 금지한다. 기준의 과학적 오류가 확인되면 기존 실패를 보존하고 변경 사유·근거·승인·새 기준을 따로 남긴다.
8. analytic oracle, 독립 구현, 같은 이산식의 별도 backend, 동일 코드의 재실행을 구분한다. 공통 curl/보간 코드를 공유하는 두 경로의 일치를 독립 물리 검증이라고 부르지 않는다.
9. CPU mock을 GPU 실측으로, 짧은 용량 검사를 장시간 광학 응용 검증으로, STE를 정확한 shape derivative로, intensity 배분을 흡수 전력/전자 수로 표현하지 않는다.
10. 하드웨어·자격증명·사용권이 없으면 BLOCKED_EXTERNAL로 기록한다. 실행 가능한 스크립트와 필요한 환경을 남기되 가상의 통과 결과를 만들지 않는다. 독립적으로 진행 가능한 다른 작업은 계속한다.
11. 사용자의 파일·기존 결과·실행 중 작업을 건드리지 않는다. 실험별 scratch 소유권 표식을 사용한다. 디스크를 실제로 가득 채우는 테스트 대신 제한된 테스트 공간과 failure injection을 쓴다.
12. GPU 시간, host/VRAM/디스크 용량, 쓰기량, 동시 작업 수를 사전 예산으로 둔다. 명시적 자원 예산을 넘는 장시간/대규모 실행이나 유료 자원 사용을 임의로 시작하지 않는다.
13. 별도 허가 없이 main 강제 push, 공개 release/tag/PyPI 게시, 저장소 권한 변경, 서비스 외부 공개, 자격증명 등록을 하지 않는다. 안전한 로컬 변경과 검증부터 진행한다.
14. 변경 중에는 영향 범위 검사를 우선하고, 실제 배포 후보에서는 전체 필수 suite를 실행한다. 과거 통과 증거 재사용은 관련 source/config/runtime hash가 동일한 경우에만 허용한다.
15. 한 세션에서 못 끝낸 작업은 실제 상태·명령·차단 이유를 인계 파일에 남긴다. 계획을 실행 결과처럼 쓰거나 예약하지 않은 후속 작업이 자동 실행된다고 말하지 않는다.

## 2. 완료 추적과 증거 형식 — G0

기존 완료 계획 문서를 단일 작업 목록으로 정리하고, 다음 산출물 또는 동등한 기존 구조를 연결하라.

- docs/COMPLETION_PLAN_KO.md: 현재 목표·작업 순서·의존성·차단 조건.
- docs/RELEASE_SCOPE.md: 프로파일별 물리/플랫폼/입출력/미분/용량 지원 범위.
- docs/validation/completion_gates.json: 기계 판독 가능한 gate와 실행 증거.
- docs/validation/cases/: 사전 고정 fixture와 합격 기준.
- docs/validation/runs/<run_id>/: raw 결과·로그·환경·측정치·해시.
- docs/DEVELOPMENT_HANDOFF.md: 최신 실제 상태와 다음 실행 명령.
- scripts/check_release_gates.py: 필수 증거 부족을 성공으로 처리하지 않는 판정기.

작업별로 ID, 우선순위, release profile, 선행 ID, 코드 위치, 예정/실제 테스트 명령, 구현 상태, 검증 상태, 원시 증거 경로, 차단 사유를 저장한다.

초기 상태는 NOT_ASSESSED다. 이것은 기능이 없다는 뜻이 아니라 이번 출고 판정을 아직 하지 않았다는 뜻이다. 검증 상태는 NOT_RUN / VERIFIED / FAILED / BLOCKED_EXTERNAL을 사용한다. 지원 범위 밖은 별도 applicability로 기록하고, 기존 필수 요구사항을 자동 제외하지 않는다.

VERIFIED 증거에는 최소 다음이 필요하다.
- 실행 당시 commit과 dirty source hash, 패키지/wheel hash.
- test와 fixture 및 acceptance criteria hash.
- Python/Torch/CuPy/CUDA runtime/driver/OS 및 GPU 종류·수량.
- 정확한 실행 명령, seed, dtype, mesh nodes, dt, step 수, source/monitor 조건.
- 측정량 정의·단위·원시 값·독립 기준·수치 허용오차.
- exit code, passed/failed/skipped 목록, 원시 로그/결과 파일 checksum.
- 적용 가능한 backend·기능 조합·오차/용량 범위.

gate 검사기는 필수 실행이 skip되거나 증거가 없거나 source/config가 달라졌거나 필수 외부 검증이 막혀 있으면 비영 exit code로 종료해야 한다. 사람이 적은 status=VERIFIED만 믿지 말고 증거 파일·해시·기준·환경을 검증하라. 증거가 있더라도 solver가 모든 문제에서 옳다는 일반 인증으로 표현하지 않는다.

G0 합격: 기존 문서 간 상충 상태를 정리하고, 테스트 하나의 통과/실패/skip/누락/해시 변경을 주입하여 gate 판정기 자체를 시험한다.

## 3. 과거 리뷰의 수정사항을 현재 코드에서 닫기 — G1

G1-01. 자동 graded mesh와 미분 평면 모델의 격자 불일치.
- 원래 field monitor를 내부 dummy point monitor로 바꿀 때 auto-refinement가 재생성되는지 조사한다.
- epsilon, source, observer interpolation, 내부 solver가 같은 실현 mesh nodes와 dt를 공유하도록 수정한다. 필요한 경우 기존 freeze_refinements를 이용한다.
- cell shape만 비교하지 말고 모든 축의 실제 노드와 Yee sampling 위치를 비교한다.
- 2D/3D, uniform/graded/explicit, 여러 field monitor, source·material-gradient까지 검사한다.

G1-02. reference signature의 실제 격자 누락.
- 실제 mesh nodes, timestep/time origin, source의 유효 파형·위상·편광, background, boundary, monitor 보간/DFT 설정 등 호환성에 필요한 입력을 포함한다.
- 구조·재료의 변화를 담는 전체 run fingerprint와 reference-compatibility fingerprint를 분리한다.
- 내부 scatterer가 다르다는 이유로 유효한 reference를 막지 말고, 실제 mesh/source/외부 매질이 다른 reference는 거절한다.
- generated ID·이름·표시 옵션만 달라져도 물리적으로 동일한 reference가 불필요하게 깨지는지 검사한다.

G1-03. quadrant_intensity_allocation의 FP32 불안정.
- 실수/complex64 DFT 크기와 SI 면적을 사용해 원본 forward 및 backward를 재현한다.
- 장을 제곱하고 면적을 곱하기 전에 비율을 보존하는 공통 스케일링을 적용한다.
- A*[a,1,1,1], 같은 면적, 총 투과율 1에서 첫 quadrant=a^2/(a^2+3), 도함수=6a/(a^2+3)^2를 oracle로 쓴다.
- A=1, 1e-8, 1e-14, 1e-16; 면적 1e-14 m²; FP32/FP64; 비균일 면적·여러 주파수·복소 위상을 검사한다.
- 출력 유한성만 아니라 전체 관련 gradient의 유한성/정확성/전체 광원 스케일 불변성을 검사한다. zero reference와 zero electric intensity의 정책도 명확히 한다.
- 분모에 임의 epsilon을 더해 물리 비율을 바꾸지 않는다.

G1-04. restart 코드 호환성 검사 누락.
- runtime fingerprint가 실제 수치 경로의 의존 파일·생성 커널·모델 스키마 변경을 포괄하도록 한다.
- boundaries, differentiable, waveforms, cuda_kernels 등 핵심 변경과 dirty editable install을 감지한다.
- 소스 코드, epsilon, source 파형, 시간 설정, objective VJP seed가 바뀌면 기존 journal을 거절하는 회귀 검사를 둔다.

G1-05. journal 저장공간 산정.
- E/H, CPML/ADE/face states, partial/full signals, partial gradients, old/new record 동시 보유, metadata, 임시 파일을 포함한다.
- host/disk state bank와 journal이 같은 volume인지 실제 volume identity로 판단한다. 경로 문자열이나 root anchor만으로 단정하지 않는다.
- peak 예상 bytes와 실제 쓰기 counter를 대조하고, 신호 이력이 큰 작은 격자도 시험한다.
- crash로 남은 임시 파일을 안전하게 식별하며 다른 run/user 파일은 삭제하지 않는다.

G1-06. 문서/실행 경로 일치.
- 서로 다른 beyond-VRAM 용량 실험과 restart 실험을 분리한다. cells, GB/GiB, dtype, peak CUDA/RSS와 시간 범위를 원시 기록에서 재계산한다.
- quick start의 dimension=2d/3d와 torch/fused backend를 명시하고 실제 선택 backend를 출력한다.
- CUDA 의존성 누락과 CPU fallback을 숨기지 않는다.

G1 합격: 재현 가능한 결함마다 원래 실패와 수정 후 통과 기록, 영향 통합 검사, 고정된 fixture가 남아야 한다. 이미 수정된 항목도 현재 candidate에서 재검증한다.

## 4. 물리·격자·실행 계약의 단일화 — G2

G2-01. 기존 구조를 활용하여 immutable resolved/compiled simulation plan을 만든다. 필수 포함 항목: 실현 mesh nodes, E/H 좌표, dt와 half-step convention, boundary/ADE coefficients, sampled material, source의 실제 지원 영역·파형, monitor interpolation·DFT 설정, resource plan.

G2-02. forward/adjoint/streamed/tensor batch/GUI가 서로 다른 규칙으로 물리 입력을 다시 해석하지 않도록 한다. 계획 재생성은 명시적 invalidation을 거치며, 미분 중 geometry-dependent mesh 변경은 금지하거나 별도 지원 계약으로 다룬다.

G2-03. capability registry를 만들고 dimensions × mesh × materials × boundaries × sources × monitors × forward/backward × resident/streamed × precision/backend의 유효 조합을 명시한다. 문서와 UI 지원 표를 이 registry로 생성한다.

G2-04. 전수 조합 대신 위험 기반 pairwise 검사와 고위험 3~4개 기능 조합을 설계한다. 각 지원 조합은 정상 예제와 부적합 입력 거절 검사를 갖는다. 미지원 입력은 장 할당/장시간 계산 전에 구체적 이유로 거절한다.

G2-05. "+/- DFT", Bloch spatial phase, E/H half-step, normal/outward direction, reduced units vs SI calibration, lossy exterior, 2D 단위길이 전력을 공개 specification과 테스트로 고정한다.

G2-06. cache/reference/restart마다 필요한 동일성 조건을 분리한다. eps·실제 파형·mesh·정밀도·kernel scheme 변경에 따른 invalidation과 deterministic replay를 검사한다.

G2 합격: 같은 입력의 모든 public 진입점이 같은 plan hash/물리 해석을 반환하고, unsupported 조합이 조용히 다른 문제로 계산되지 않는다.

## 5. 독립 물리와 gradient 검증 — G3

세 검증 계층을 구분한다.
A. 이산 연산 검증: 동일 이산 문제의 CPU/Torch/CUDA/streamed forward와 VJP 일치.
B. 물리 검증: analytic/독립 solver/공간·시간·PML 수렴에 따른 연속 문제의 정확성.
C. 응용 검증: 최적화 후 실제 내보낸 geometry의 재계산 성능과 제작 제약.

다음 fixture 계열을 모두 추적하되 특정 미지원 물리는 기존 release scope 절차에 따라 처리한다.
1. 진공/균일 유전체 전파: 2D/3D의 편광, 속도, 수치 분산, 위상.
2. 유전체 slab: normal 및 oblique TE/TM의 복소 r/t와 TMM/Fresnel.
3. Drude/Lorentz slab: fitting 오차와 ADE 이산화 오차를 분리한 복소 응답·흡수.
4. dielectric cylinder/sphere: 2D/3D 각각 올바른 Mie 기준과 산란 단면적.
5. 금속/분산 곡면: 고정 analytic material의 작은 sphere 등에서 산란·흡수와 격자 수렴.
6. PEC/PMC cavity: eigenfrequency, symmetry 축소/전체 영역 대응과 gradient mapping.
7. PML: normal/oblique, TE/TM, 균일/분산 입사 매질 중 지원 범위의 반사·장시간 안정성.
8. periodic/Bloch grating: 위상·회절 차수·방향별 전력, 독립 RCWA 또는 다른 방법과 대조.
9. mode solver: analytic slab/fiber 또는 독립 mode solver의 neff·field·confinement·power.
10. PIC: straight guide, discontinuity, bend/coupler의 S, 모드 tracking, reciprocity, 방사 손실.
11. dipole radiation: far-field/near-zone의 방향·위상·패턴·수렴과 표면 위치 의존성.
12. tensor slab: 지원되는 회전/축 조건에서 eigenpolarization, 반사/투과와 tensor-gradient.
13. curved interface/shape: grid origin·subcell shift, mesh h/h2/h4, regularization 폭의 독립 변화.

fixture별로 물리 영역 크기, 관측 위치, 소스, simulation time, PML의 물리 두께를 고정하여 격자 오차를 분리한다. dt 감소로 step 수가 달라져도 물리 시간을 맞춘다. PML 길이·프로파일, 시간 길이는 별도 sweep으로 통제한다. 정밀도의 반올림 한계와 공간 수렴을 혼동하지 않는다. 계단형/코너/분산계에서 모든 결과의 엄격한 단조 감소나 보편적 2차 수렴을 강제하지 않는다.

Subpixel/conformal은 lossless curved dielectric에서 정확도 대비 비용 개선을 우선 증명한다. 분산/금속은 검증된 다른 discretization으로 오차 목표를 달성해도 된다. 보편적인 dispersive conformal 개발을 이유로 다른 검증을 무기한 보류하지 않는다. 다만 지원하지 않는 조합을 된다고 광고하지 않는다.

기본 제안 합격 기준(상용 표준이 아닌 이 프로젝트의 초기 engineering target; 실행 전 fixture에서 확정):
- 작은 무차원화 fixture의 이산 forward/VJP: FP64 rtol 1e-7, atol 1e-9; FP32 rtol 1e-4, atol 1e-6.
- lossless slab의 R/T: 기준 대비 절대 오차 각 0.01 이하(1 percentage point). |R+T-1| 0.01 이하.
- 복소 전송 위상: 사전 고정된 충분한 신호 구간에서 0.02 rad 이하. 영점/극약 신호 위상은 합격 판정에서 분리하고 amplitude error를 보고한다.
- 적분 산란량: 고정한 sphere/cylinder fixture에서 2% 이내, 공진점의 위치/폭은 별도 오차 기준을 둔다.
- mode neff: analytic fixture 0.5% 이내; cavity resonance 1% 이내. Q를 공개 지원한다면 Q 측정법·시간창·독립 기준을 추가하고 초기 5% 목표를 검토한다.
- PML reflected/incident power: 대표 normal incidence 1e-6 이하(-60 dB), 선언된 oblique fixture 1e-4 이하(-40 dB). 측정면/시간창/도달시간/노이즈 floor를 사전 고정한다.
- 실제 shape/material 파라미터의 물리 gradient: 충분히 큰 도함수의 analytic/reference 대비 3% 이내. 거의 영인 도함수는 사전 정한 특성 스케일의 절대 오차로 판단한다.

수치는 테스트 후 맞추지 않는다. 민감하거나 비정규적인 문제는 사전 작성한 fixture별 별도 오차 budget을 사용하고, 공통 기준과 차이를 보고한다.

Gradient 검사는 다음을 포함한다.
- small full-autograd oracle, explicit adjoint, central-difference step sweep, Taylor remainder test.
- 목적함수와 설계 파라미터의 characteristic scale로 무차원화한 비교.
- random directional VJP와 복수 seed; epsilon, ADE coefficients, density, shape, source waveform 중 실제 지원 대상.
- 충분한 신호가 있는 구간에서 O(step^2) Taylor remainder를 확인하고 round-off 구간을 분리.
- 같은 regularized discretization의 미분 일치와 sharp-interface physical-gradient 수렴을 별도로 보고.
- 복소 conjugation, duplicate monitors의 gradient accumulation, retained backward, 다중 objective, 입력 변경의 replay/version 검사.

전력 보존은 모든 유출/흡수 채널을 포함한 문제에서만 equality를 요구한다. 열린 PIC의 일부 guided ports만으로 S†S=I를 강요하지 말고 수동성·누락 radiation/absorption을 구분한다. reciprocity는 동일 normalization/reference plane/reciprocal basis를 맞춘 후 검사한다. 퇴화 모드는 임의 벡터 하나가 아니라 subspace와 tracking을 검사한다.

G3 합격: 공개 지원 범위의 fixture마다 A/B를 통과하고, 실패·노이즈 floor·부적합 범위가 숨김없이 남는다. 독립 solver를 쓸 수 없는 항목은 대체 oracle을 명시하거나 해당 gate를 차단한다.

## 6. 실제 CUDA와 지속 검증 — G4

G4-01. 보유한 실제 GPU와 OS·driver·runtime부터 확인한다. 다른 GPU가 없으면 있다고 가정하지 않는다. WORKSTATION의 지원 플랫폼 matrix에 실제 검증한 범위를 기록한다.
G4-02. torch/fused, CUDA graph on/off, fused/reference monitor, FP32/FP64, real/complex, standard/nondefault stream의 valid 경로를 비교한다.
G4-03. noncontiguous tensors, duplicate observers, multiple calls/backward, input lifetime, stream synchronization, cancellation, allocator cleanup을 검사한다. 불지원 입력은 명확히 거절한다.
G4-04. 최소 격자·홀수 크기·부분 slab·비정렬 tile·index boundary·강한 material contrast·ADE/CPML memory를 무작위/경계 fixture에 포함한다. sanitizer 또는 동등 검사로 OOB와 race를 점검한다.
G4-05. CPU PR suite, 신뢰한 코드의 GPU 정기 suite, 실제 release의 전체 GPU suite를 분리한다. GPU 필수 검사의 skip는 출고 실패다. 혼합 플랫폼의 선택 검사 skip만 별도 허용한다.
G4-06. public fork PR의 untrusted code를 개인/연구실 GPU host에서 자동 실행하지 않는다. 검토한 commit, 격리된 runner, 최소 권한·네트워크·비밀정보, 작업 후 정리 정책을 사용한다. 단순 실행 승인만으로 host 격리를 대체하지 않는다.

G4 합격: 선언한 matrix에서 실제 GPU raw evidence가 있고, 최소 하나의 제3 환경/독립 설치에서 주요 경로가 재현된다. 환경이 없는 matrix cell은 미검증으로 남긴다.

## 7. 메모리 계층·복구·장기 안정성 — G5

G5-01. resident/host/disk/async 경로를 같은 물리 문제·관측자·목적함수에서 비교한다. full-history와 online DFT, scalar/diagonal/ADE/face states 중 지원 조합을 포함한다.
G5-02. peak Torch allocated/reserved, CUDA 전체 process memory(가용한 계측 사용), RSS/PSS 또는 플랫폼 동등량, committed memory, OS cache, 디스크 사용량·총 읽기/쓰기·실효 대역폭을 구분한다. 중복 집계한 숫자를 전체 메모리로 합치지 않는다.
G5-03. planner의 byte admission과 실제 peak를 맞추고 원자적 동시 reservation 또는 동등 admission으로 여러 작업이 각각 free memory를 보고 동시에 초과하는 문제를 다룬다. 예측은 quota 보장과 구분한다.
G5-04. 전체 3D epsilon/VJP를 만들지 않는 geometry/density slab 생성·gradient 축약 경로를 공개 합성 구조로 시험한다. CPU design tensor·optimizer state까지 memory budget에 반영한다.
G5-05. meaningful beyond-VRAM 사례 하나를 추가한다. dtype를 바꾸어 용량만 부풀리지 않고 실제 state가 물리 VRAM을 넘도록 한다. 수십 step의 local causal-cone capacity 테스트와 달리 파가 목적 구조·출력에 도달하고 필요한 시간/주파수 해상도를 갖게 한다.
G5-06. 위 대규모 사례는 승인된 실행/디스크 쓰기 예산 안에서 수행한다. 충분히 전파한 장·spectrum과 실제 VJP가 있어야 한다. 1e-7의 작은 영역 오차만으로 응용 수렴 완료를 선언하지 않는다.
G5-07. forward 중단, backward 중단, process kill, simulated ENOSPC/OOM, read/write fault, truncate/checksum 오류, CUDA transfer failure, cancellation을 주입한다. 마지막 valid checkpoint는 보존하며, 손상된 최신 기록은 거절하거나 명시적으로 이전 valid 기록으로 복구한다.
G5-08. checkpoint에 solver와 필요한 auxiliary states, optimizer state, scheduler/projection state, RNG, effective source, configuration fingerprint를 보존한다. solver restart와 optimizer restart를 따로 시험한다.
G5-09. journal은 run별 소유권과 동시 writer 잠금을 갖는다. 파일 checksum·dtype·shape·array count·bytes를 검사한다. 완료·취소·실패 상태와 부분 결과를 구분한다. directory fsync 등으로 process-kill consistency와 실제 power-loss durability의 보장 수준을 분리한다.
G5-10. 경량 fixture에서 1e5 steps, 반복 실행, 최소 100 optimizer updates 및 승인된 장시간 soak를 수행한다. warm-up/cache 상한 이후 반복당 메모리 증가가 지속되는지 검사한다. 모든 step에서 에너지 감소를 강요하지 않고 해당 이산계의 안정성/에너지 기준을 사용한다.

G5 합격: 동일 입력의 uninterrupted/resumed forward·objective·gradient·optimizer state가 선언 tolerance에서 일치하고, 작업 종료·실패 후 소유 scratch와 메모리가 해제된다. 대규모 용량/물리시간/비교속도의 증거는 각각 구분한다.

## 8. 실제 사용자용 물리·역설계 API — G6

G6-01. 재료 CSV/nk/epsilon import, passive fitting, 원자료 출처·사용권·해시, fit band, 시간 이산화에 따른 n/k 오차, extrapolation 경고를 하나의 workflow로 묶는다. 재료 fitting이 이미 있으면 재구현하지 말고 검증·UI·저장 경로를 완성한다.
G6-02. source의 실제 공간 분포·위상·편광·시간 파형·유효 bandwidth를 preview한다. oblique broadband에서는 fixed k_parallel/Bloch phase와 fixed incidence angle을 구분한다. 미지원 조합을 정상적인 fixed-angle source처럼 표시하지 않는다.
G6-03. reference를 포함한 R/T/A, 복소 S, phase/group delay, mode decomposition, diffraction, far-field/near-zone을 기존 결과와 통합한다. 절대 SI calibration이 없는 값에는 reduced units를 명시한다. 1-R-T만으로 독립 absorption 검증을 대체하지 않는다.
G6-04. 포트별 mode tracking, normalization, reference plane, forward/backward separation과 퇴화/약한 모드 진단을 제공한다. fixed-mode gradient와 eigenmode 자체의 gradient를 구분한다. port 단면을 설계 변수로 바꾸면 재계산/미분 지원 여부를 명시한다.
G6-05. 기존 design/periodic/mode-network API를 재사용해 objective→parameterization→optimizer→history→resume→final evaluation의 최소 고수준 인터페이스를 통합한다. 존재하지 않는 class 이름을 문서에 먼저 확정하지 않는다.
G6-06. density filter, projection, beta continuation, symmetry, mask, min linewidth/gap, fabrication perturbation, binary export를 실제 검사와 연결한다. filter radius만으로 min feature 보장을 주장하지 않는다.
G6-07. export된 binary/GDS 구조를 다시 import하여 독립 finer forward로 평가한다. geometry smoothing·thresholding·GDS 근사의 성능 손실을 보고한다. optimizer의 매 step 단조 개선은 요구하지 않되, 사전 정의한 최종 목표와 holdout 성능을 판정한다.
G6-08. low-intensity/near-zero reference/frequency cutoff/evanescent/backflow에서 NaN·음의 국소 flux·invalid phase를 임의 clipping으로 숨기지 않는다. 수학적으로 부적절한 정규화는 이유를 알려 거절한다.

G6 합격: 사용자가 private 내부 함수를 조립하지 않고 public API로 reference와 forward/backward·최적화·최종 재평가를 수행한다. 예제는 실제 실행되며 mock 결과로 대체하지 않는다.

## 9. 대표 응용과 같은 정확도에서의 비용 — G7

다음 세 공개 fixture를 설치된 패키지로 끝까지 실행하라. 원래 사용자 CR 응용은 재실행하지 않는다.
A. periodic SiN/Si metagrating 또는 meta-atom: normal/oblique, TE/TM, wavelength sweep, complex response/diffraction 및 일반 설계 목적함수.
B. 소형 유한 metalens: 유한 aperture의 실제 field propagation, PSF/초점 위치/efficiency와 mesh·시간·NF/FF 또는 propagation 모델의 검증. unit-cell 계산만으로 전체 렌즈를 full-wave 검증했다고 하지 않는다.
C. passive PIC coupler/bend 또는 mode converter: 다포트 S, phase, 수동성·상반성, 설계 영역 gradient, fabrication-aware optimization과 GDS 재평가.

형상·파장·물리 시간·오차 목표·초기 구조·seed·최종 성능 기준을 사전에 고정한다. 최소 세 초기 seed 또는 사전 정한 deterministic starts의 결과를 모두 보고하며 성공 seed만 선택하지 않는다. 원래 연구 결과/비공개 prior를 synthetic fixture로 가장하지 않는다.

측정은 다음을 분리한다.
T_iteration = T_geometry + T_setup + T_forward + T_monitor + T_backward + T_transfer/I/O + T_optimizer.

컴파일/JIT cold start, warmed repeated run, 최초 material/port solve, 저장 비용을 따로 보고한다. 겹치는 async 단계 시간은 합산하지 말고 wall time 및 겹침 정의를 기록한다. memory/data-transfer 동기화 조건을 명확히 한다.

resident와 streamed는 둘 다 보고하고, streaming이 느린 VRAM-fitting 사례를 숨기지 않는다. 같은 GPU batch와 순차 반복·microbatch도 준비·정규화·backward 전체 비용으로 비교한다. 정책 autotuning 비용의 break-even 또는 이득 부재를 공개한다.

최소 하나의 독립 공개 solver와 공통 지원 문제에서 비교한다. 경쟁 solver가 없는 기능은 unsupported/N/A로 표기한다. FDTDX/Meep 등 버전·장치·정밀도·물리 설정을 고정하고, 동일 셀 수 비교와 동일 관측 오차 비교를 구분한다. 상용 solver 비교는 실제 사용권·허용 조건이 확인된 경우에만 별도 수행한다.

성능은 3~5회 이상 반복한 median과 변동을 보고한다(대규모 고비용 실험은 사전 승인한 횟수와 제한 명시). 사전 지정한 baseline 대비 유의한 regression을 gate로 검출한다. 모든 solver보다 빠름, 보편적 speedup, 한 숫자의 전체 완성도는 주장하지 않는다.

G7 합격: 세 응용의 실제 입력→최종 결과→재평가 기록, 최소 하나의 독립 교차 검증, 정확도 대비 비용 곡선이 남는다. CPU/GPU 하드웨어가 다른 비교를 동일 하드웨어 알고리즘 우위로 표현하지 않는다.

## 10. 저장·GUI·설치 — G8

G8-01. 기존 Project JSON/NPZ compatibility와 schema migration을 시험한다. source/monitor/mesh/좌표·시간·단위·정밀도·실행 backend·warning·partial 상태를 복원한다.
G8-02. 큰 결과의 chunked/lazy read가 필요하면 HDF5 또는 Zarr 중 요구에 맞는 한 구현을 우선 채택한다. 두 포맷을 동시에 만들지 않는다. 복소장과 좌표 metadata를 round trip하며 부분 read가 전체 volume을 RAM에 올리지 않음을 측정한다.
G8-03. GUI의 CAD/GDS → material/source/boundary → 실제 mesh preview → resource preflight → job queue → cancel/resume → 결과 overlay → 데이터/GDS export 경로를 E2E로 시험한다.
G8-04. geometry 편집의 undo/redo, copy/multiselect, autosave/recovery, versioned project, 구조/parameter 단위 검증과 결과 stale 표시를 구현/확인한다. 화면이 바뀌었다고 이전 결과를 현재 geometry 결과처럼 표시하지 않는다.
G8-05. 최종 wheel에 frontend 정적 자산을 포함하고 최종 사용자가 Node/npm이나 저장소 checkout 없이 UI를 실행하도록 한다. CPU-only import/run과 명시적 CUDA extras를 각각 clean environment에서 시험한다.
G8-06. 지원 Python/Torch/CuPy/runtime 최소·최대 버전을 실제 설치 시험으로 확정한다. CLI doctor 또는 동등 진단은 device/driver/runtime/의존성·간단 kernel 실행·실제 backend를 보고하고 unsupported 환경을 구체적으로 안내한다.
G8-07. README의 모든 기본 예제를 installed wheel에서 실행한다. Linux/Windows 등 광고하는 플랫폼마다 설치→첫 계산→저장→load를 검사한다. 개발 checkout import가 installed-package 결함을 숨기지 않도록 작업 디렉터리를 바꾼다.

G8 합격: clean install 사용자에게 파일 경로 수동 수정·소스 편집·개발 frontend 빌드 없이 핵심 workflow가 동작하고, 저장/복원 데이터와 표시가 실제 계산 조건과 일치한다.

## 11. 보안·배포·운영 완료 — G9

G9-01. local server의 loopback 기본값, origin/host 검증, 허용된 파일 경로, 업로드 크기, path traversal, 악성/손상 JSON/NPZ/GDS, 압축 폭탄과 unsafe pickle을 검사한다. 외부 노출/remote execution은 별도 인증·권한 계약 없이 허용하지 않는다.
G9-02. 코드와 번들 데이터의 출처·license·third-party notices·SBOM·dependency/security scan을 수행한다. proprietary runtime, vendor material database, 무단 benchmark 원시값, credentials/private paths를 배포물에서 점검한다.
G9-03. RELEASE_REVIEW의 미해결 계약/배포 질문을 실제 문서에 따라 추적한다. AI가 무소송/무침해를 보증하거나 상용 사용권을 추정하지 않는다. 필요한 소유자/전문가 판단은 BLOCKED_EXTERNAL로 남기고 기술 작업과 분리한다.
G9-04. API stability/deprecation, project/result/checkpoint version compatibility, changelog, 알려진 한계, bug template, minimal repro, numerical bug severity, release rollback/결과 영향 공지를 준비한다.
G9-05. 독립 사용자 또는 독립 설치 환경에서 세 대표 workflow를 실행하고, 실제 발견 이슈를 정리한다. 타인의 사용성 테스트를 에이전트의 자기 점검으로 대체하지 않는다.
G9-06. 최종 release candidate의 정확한 source tree와 wheel에서 전체 필수 gate를 실행한다. 이전 커밋의 통과와 이후 부분검사를 합쳐 현재 전체 통과라고 쓰지 않는다. 긴 검사 증거의 재사용은 동일 관련 hash와 명시한 정책이 있을 때만 허용한다.
G9-07. validation report를 기계 산출물에서 생성한다. 내부 검증 보고서를 제3자 인증서라고 부르지 않는다. 숫자·지원 표·README·API docs·wheel 버전을 일치시킨다.

G9 합격: 프로파일별 필수 VERIFIED, 미해결 P0/P1 defect 없음, 필수 skip/누락/외부 차단 없음, 검증 대상과 배포 artifact의 동일성, 실제 배포 권한이 별도로 확인되어야 한다. 기술 RC_READY와 PUBLIC_RELEASE_AUTHORIZED를 분리한다. 소유자 승인 전에는 배포하지 않는다.

## 12. HPC 확장 — H1

WORKSTATION과 병렬로 무분별하게 작업하지 말고 canonical plan과 single-device 검증을 기반으로 진행한다.

H1-01. rank-owned domain decomposition과 source/monitor/CPML/Bloch/ADE 지원 범위를 명시하고 global/local indexing과 halo ownership을 고정한다.
H1-02. 실제 2-GPU 이상에서 forward와 재료 VJP를 single-GPU 기준과 대조한다. 각 advertised 4-GPU/8-GPU 구성은 해당 실물 검증이 있어야 한다. CPU multi-process를 CUDA 검증으로 세지 않는다.
H1-03. unequal slabs, partial tiles, rank 경계의 source/monitor/material, duplicate observations, halo transpose, complex fields와 checkpoint replay를 검사한다.
H1-04. strong/weak scaling의 문제 크기·GPU·interconnect·호스트 topology·통신/계산 overlap과 peak memory를 보고한다. eta_N=T1/(N*T_N)는 같은 문제에만 쓴다. single GPU에 안 들어가는 문제는 그 사실을 적고 가능한 baseline으로 비교한다.
H1-05. timeout/rank failure/cancellation의 collective 정리와 재시작 정책을 시험한다. 다중 GPU와 out-of-core 결합은 지원한다고 선언할 때 별도 gate를 통과해야 한다.
H1-06. 예컨대 특정 큰 fixture의 2~4 GPU 효율 70%는 사전 합의한 성능 목표로 둘 수 있지만 하드웨어와 문제에 독립적인 보편 합격 기준으로 강요하지 않는다. 지원 구성과 성능 주장을 실제 측정 범위로 제한한다.

H1 합격: 지정한 multi-GPU 구성의 실제 물리·VJP·운영 검증과 scaling 증거가 모두 있다. 2대 미보유면 HPC는 BLOCKED_EXTERNAL이며 WORKSTATION의 기술 통과와 혼동하지 않는다.

## 13. 실행 순서·중단·인계

기본 의존성:
G0 → G1 → G2 → (G3와 G4) → (G5와 G6) → G7 → G8 최종 E2E → G9.
G8의 문서/패키징 조사와 보안 점검은 일찍 시작할 수 있지만, 물리 경로가 바뀌면 E2E를 다시 검증한다. H1은 G2/G3/G4 기반 후 별도 확장이다.

작업 단위는 한 결함·한 기능·한 검증 계약으로 제한한다. 병렬 에이전트가 가능해도 같은 핵심 수치 파일을 동시에 수정시키지 않는다. 한 integrator가 병합된 tree에서 회귀 검사한다. independent reviewer는 테스트 약화, 단위/물리 변경, 누락된 증거를 점검한다.

처음 실행할 일:
1. 실제 HEAD/dirty 상태/기존 계획/자원 가용성을 기록한다.
2. 출고 범위와 evidence schema를 연결하고 현재 gate를 NOT_ASSESSED로 시작한다.
3. G1-01과 G1-02의 현재 상태를 확인하는 회귀 테스트를 우선 실제 실행한다.
4. 재현된 결함을 수정하고 field/VJP 통합 검사를 실행한다.
5. G1-03~06 및 G2로 이어가며 실제 결과만 기록한다.

장시간 검사 전에는 이름·입력·hardware·메모리/디스크/쓰기량/시간 예산·중단 방식과 목표 gate를 기록한다. 자원 승인이 없으면 검사 코드를 준비하고 차단 이유를 남긴다. 사용자 질의를 반복하거나 모든 작업을 중단하지 말고 안전하고 독립적인 다음 작업을 진행한다.

각 작업 보고서 형식:
- 현재 commit과 작업 ID, 문제/목표.
- 변경 파일과 변경 이유.
- 실행한 정확한 명령, 장치, 실제 통과·실패·skip·미실행.
- 핵심 측정값과 사전 기준.
- 증거 파일/해시.
- 남은 결함·위험·외부 차단.
- 다음 세션의 첫 명령과 작업 ID.

최종적으로 필수 증거가 없는 단계는 완료로 표시하지 말라. "코드가 있다", "테스트가 많다", "한 번 실행됐다", "README를 썼다"는 완료 근거가 아니다. 최종 목표는 지원 범위에서 입력부터 검증된 결과·최적화·복구·배포물까지 이어지는 재현 가능한 제품이다.

---

## 계획 근거와 참고 자료

저장소 자료는 해당 커밋의 자체 기록이며 이 프롬프트 작성 중 수치 실험을 다시 실행한 것이 아니다.
- https://github.com/hyoseokp/TorchFDTD/blob/2b8f4931f13ee4fc85a56ceb47714644b2ffa987/docs/COMPLETION_PLAN_KO.md
- https://github.com/hyoseokp/TorchFDTD/blob/2b8f4931f13ee4fc85a56ceb47714644b2ffa987/docs/IMPLEMENTATION_PRIORITIES.md
- https://github.com/hyoseokp/TorchFDTD/blob/2b8f4931f13ee4fc85a56ceb47714644b2ffa987/docs/ACCEPTANCE.md
- https://github.com/hyoseokp/TorchFDTD/blob/2b8f4931f13ee4fc85a56ceb47714644b2ffa987/docs/FEATURE_CHECKLIST.md
- https://meep.readthedocs.io/en/latest/Subpixel_Smoothing/ (분산 경계와 subpixel 수렴의 범위 구분)
- https://docs.github.com/en/actions/reference/security/secure-use (untrusted code와 self-hosted runner의 보안)

위 정확도·stress 횟수·성능 목표는 이 계획이 제안한 초기 기준이며, 위 문서에서 정한 산업 표준이 아니다.
