# 구현 우선순위와 제외 기준

현재 실행에서는 CR 응용 최적화와 CR 정밀 재계산을 제외한다.
메모리 계층, 일반 Torch 미분, 경계·모드·재료, batch와 비교 검증을 우선한다.
과거 CR 설명은 구현·실험 기록으로 보존하며 추가 CR 실행을 뜻하지 않는다.


현재 남은 작업 순서와 항목별 완료 증거는 [전체 완료 계획](COMPLETION_PLAN_KO.md)에 정리한다. 핵심 gradient와 메모리 계층을 우선하고, 전체 목표가 검증되기 전에는 완료로 표시하지 않는다.

핵심 목표는 **Torch에서 형상·재료부터 loss.backward와 optimizer까지 연결하는 inverse design**, 그리고 **VRAM·DRAM·저장장치 계층으로 메모리 병목과 큰 격자의 한계를 줄이는 실행 엔진**이다. 속성 수를 채우는 것으로 완료를 판단하지 않는다. 모든 행의 중요도·필요 여부는 [분류 CSV](FEATURE_PRIORITY_INDEX.csv)와 UI의 Feature checklist에서 확인한다.

형상 미분 후속: [상자·타원체·원기둥 파라미터 API](DIFFERENTIABLE_GEOMETRY.md)를 추가했다. 반경·높이·위치·회전·유전율을 Torch에 연결하고, 형상 backward는 작은 공간 묶음씩 재계산한다. 전체 격자의 형상 그래프를 보관하지 않지만 epsilon과 입력 material VJP는 아직 dense 텐서다. CPU·CUDA·DRAM FDTD 연결을 FP32로 검사했다. 날카로운 경계의 물리 shape-gradient 수렴, polygon/spline과 dense 재료 맵 없는 스트리밍은 남아 있다.

CR 후속으로 [재시작 가능한 밀도 최적화 실행기](CR_INVERSE_DESIGN.md)를 추가했다. 전체 파장·입사 조건과 정보량 목적함수를 projected Adam에 연결하며, density·Adam 상태를 함께 저장하고 최종 구조를 별도 forward로 평가한다. 원래 CR 입력의 물리·gradient 수렴 및 실제 최적화 검증은 남아 있다.

정밀도 정책: 일반 실행과 CR 역설계의 기본값은 FP32다. 밀도·광학장·정보량·gradient·Adam에 하나의 정밀도를 사용하고 FP64는 명시적인 검증 옵션으로 유지한다. 이후 48GB 초과 용량 실험도 FP32 실제 상태 크기를 기준으로 설계하며, FP64 사용으로 늘어난 메모리를 FP32 용량 한계로 설명하지 않는다. 전체 144조건의 FP32 response·gradient 검증은 통과했다. 응답 상대 오차 5.04e-7, 밀도 gradient 상대 오차 1.75e-5이며, 물리 메시·gradient 수렴과 실제 최적화 완료는 별도 조건이다.

자동 실행 선택 후속: `PeriodicLayerResponse.auto(...)`는 별도 시험 연산 없이 resident → DRAM → 명시적 파일 저장소의 예산을 확인한다. 공간 폭과 시간 깊이를 함께 줄이며, 정밀도·메시·계산 시간·checkpoint 개수는 바꾸지 않는다. 선택 결과를 고정해 forward/backward에 사용한다. 실제 속도를 비교하는 tuner는 별도 선택으로 유지한다. 주기 밀도 설계 UI에 자동 선택·명시적 resident/DRAM/파일·메모리 사전 확인·Adam 실행·Python/JSON 내보내기를 연결했다. 범용 CAD·다파장 UI와 optimizer 재시작은 남아 있다.

중복 연산 감소: 선택형 `PeriodicResponseCache`는 구조·물리 설정·실행 조건이 동일할 때 응답을 재사용하고, 목적함수의 입력 gradient까지 동일할 때 밀도 VJP도 재사용한다. 저장량을 제한하며 광학장 이력은 보관하지 않는다. 다른 latent 값에서 동일 hard mask가 반복되어도 현재 sigmoid의 미분은 그대로 연결된다. 실제 CR 최적화의 가속률은 미측정이다. 기존 projected Adam 예제는 연속 밀도 경로이며, 원래 CR의 hard-mask 제작 제약·straight-through·블록별 gradient 처리와 동일한 최적화로 간주하지 않는다.

검증 운영: 코드와 조건이 같은 통과 검사는 재실행하지 않는다. 변경 범위의 검사와 새 결과의 필수 정확도 검증만 실행하고, 진행 중인 작업은 상태 확인만 한다. 전체 144조건 FP32 검증이 완료되기 전에 같은 검증을 다시 예약하지 않는다.

## 현재 실행 순서 · 2026-09-20

1. **미분 가능한 물리 경로.** 제한된 실수 비분산 Yee·CPML의 이산 adjoint와 fused CUDA backward, 점 관측, 전체 시간기록 없이 블록으로 누적하는 Torch DFT와 그 transpose, regularized sphere 형상과 Adam을 구현했다. [API 범위](DIFFERENTIABLE_FDTD.md)에 표시한 부분 구현이며 고정 검출면의 E/H 보간·전력 적분·기준 정규화와 박막 검증을 추가했다. 고정 Bloch 위상의 resident Torch CPU/CUDA 미분과 경사 TE 박막 검증도 추가했다. 분산 재료의 resident Torch·fused CUDA transpose와 spectral plane을 추가했다. 공간 ADE의 DRAM/파일 P/Q 저장·fused CUDA 타일·재료 gradient를 실험적으로 연결했다. 분산 장시간 수렴/속도 검증, mode port 목적함수, TFSF와 coupled subpixel은 남아 있다. Taylor 검사는 이산식 검증이며 물리 shape-gradient 수렴은 별도다.
2. **계층형 메모리와 공간·시간 분할.** GPU/host/disk checkpoint, 혼합 tier, binomial 재계산과 비동기 checkpoint staging을 구현했다. 별도의 [DRAM 공간·시간 slab API](STREAMED_FDTD.md)는 halo adjoint, 버퍼 재사용, 비동기 타일 파이프라인과 짧은 실제 실행을 이용한 정책 선택을 구현한 실험 단계다. 두 길이 측정과 checkpoint 재계산 비용으로 정책 선택을 보완했고, 명시적 streamed 모드에서 838만 셀의 128-step forward·gradient 실행을 검증했다. 타일 내부의 제한된 체크포인트로 재계산을 줄이는 경로도 추가했으며, K=32의 내부 비교에서 1.49배 빨라졌지만 작은 문제에서는 역효과가 있어 선택 옵션으로 유지한다. 54GiB E/H를 갖는 6.04억 셀의 10-step forward·gradient 실행이 RTX 5880에서 완료됐고 최대 Torch CUDA 할당은 7.09GB였다. 전체 52분이 걸린 짧은 용량 검증이며 장시간 응용의 속도와 수렴 및 정책 예측의 일반화는 남아 있다. 실수 FP32 54GiB E/H(24.16억 셀, 고정 revision 61326d2)의 10-step forward·전체 epsilon VJP도 완료했다. 최대 Torch CUDA 할당 2.23GB, 전체 58.41분, gradient 상대 L2 9.12e-8이며 [기록](BEYOND_VRAM_FP32.md)을 따른다. 장시간 실행·중단 후 복구·전체 메모리·성능 계측은 남아 있다. 실험적 파일 공간 backing을 추가했고 DRAM 경로와 gradient 일치를 검증했다. 현재 파일 경로는 더 느리며 OS cache를 포함한 실제 RAM 사용량과 지속 NVMe 성능은 미검증이다. 용량 기반 DRAM/파일 자동 선택과 시간·주파수 관측 예산 검사를 추가했다. 분산 재료·주파수 관측의 비용 측정, 기본 후보의 예산 자동 조정과 제한된 gradient 기준 캐시를 추가했다. Resident/DRAM/파일 후보를 함께 측정하는 선택 API를 연결했으며, CPU 설계 텐서의 GPU 입출력 비용을 포함한다. 고정 검출면의 복소 E/H·전력 목적함수에도 통합 선택을 연결했고, 정규화된 검출면 전력으로 반경·재료 감쇠율을 갱신하는 예제를 추가했다. 128³·128-step 점 스펙트럼의 통합 비교에서는 두 정밀도 모두 가장 빠른 resident 정책을 선택했다. 공유 출력·gradient·활성 solver 예산으로 여러 case를 순차 재계산하는 배치 API를 추가했다. 장시간 응용, 동시 adjoint microbatch와 단일 grid multi-GPU는 남아 있다. 작은 격자의 전송·재계산 오버헤드는 아직 크다. [구체적 통과 조건](HIERARCHICAL_EXECUTION.md).
3. **정확도와 유효한 설계 목적함수.** 측정 재료 피팅과 실험적 subpixel의 독립 해석 기준 검증을 유지한다. 모드 소스·포트의 전력 정규화, 양방향 분해와 상반성·보존 검사를 진행한다. 작은 adjoint 구현을 이 모든 기능이 끝날 때까지 미루지 않는다.
4. **동일 오차의 전체 역설계 비용.** forward, backward, 재계산, I/O, geometry VJP와 optimizer를 함께 측정한다. 가능한 최대 크기와 처리 속도를 분리하고, 기존 잘 조정된 정책과 경쟁 solver를 지원 조건에 맞춰 비교한다. 성능 예상치를 측정 결과로 표시하지 않는다.
5. **사용성과 배포.** Python 기능을 UI·저장·결과 검토로 연결한다. 공개 배포의 자료·라이선스 검토는 별도 출고 조건이다. FSP 주변 속성의 일대일 복제나 외관 항목이 위 두 핵심 개발을 앞서지 않는다.

분산 재료 후속: 27GiB E/H와 27GiB P/Q를 갖는 54GiB 실행의 10-step forward·gradient 검증도 완료했다. 최대 Torch CUDA 할당은 5.17GB, 전체 시간은 3289.839초다. 인과 halo와 버퍼 수명 개선 후 같은 문제의 재실행도 통과했다. 최대 Torch CUDA 할당 3.65GB, 2976.734초이며 두 실행의 소스·결과를 별도로 보존했다. 이는 용량 증거이며 장시간 수렴이나 속도 우위가 아니다. [측정·소스·한계](validation/DISPERSIVE_CAPACITY_REPORT.md). Resident 실행 전 메모리 검사는 필드와 재료 carrier 생성 전에 GPU·CPU 작업 공간·checkpoint 예산을 확인하며, 실험적 통합 후보 선택을 연결했으며 장시간 선택 품질 검증은 후속이다.

Resident 후속: 명시적 byte 예산과 CUDA 인덱스 검사로 기본 800만 셀 제한을 넘는 adjoint 경로를 추가했다. 256³ 비분산과 208³ ADE의 12-step forward·gradient가 비영 CPML을 포함한 Torch 기준과 일치한다. 통합 선택의 기본 resident 후보에도 같은 예산을 적용한다. CUDA 배열 구성에 따른 예약량 계산과 실제 restart 크기의 checkpoint 예산을 추가했다. 최초 스펙트럼 계산의 cuBLAS 작업 공간도 별도 예약한다. 두 큰 격자를 checkpoint 2개와 4GiB 예산으로 재검증했다. 512³ RTX 5880 비분산·ADE의 12-step forward/VJP도 완료했다. 최대 Torch CUDA 할당은 각각 15.9GB와 17.9GB다. 장시간 물리 수렴과 속도 검증은 후속이다. [API·측정 범위](BUDGETED_RESIDENT.md).

현재 1,661행 중 엔진 또는 UI에 남은 작업이 있는 행은 1,507개다. 행 수는 완성도나 연구 기여의 지표가 아니다.

| 순서 | 중요도 | 필요 여부 | 기능군 | 현재 상태와 다음 조건 |
| --- | --- | --- | --- | --- |
| 1 | P0 | 필수 | 실행 신뢰성 | 발산·취소·결과 상태, 모든 수치 경로의 일치 검증 |
| 2 | P0 | 필수 | 정확도·수렴 | 동일 영역·물리 시간·PML 조건과 독립 기준 |
| 3 | P0 | 공개 전 필수 | 독립 배포 | 코드·데이터·라이선스·자격증명 확인, 물리 구현과 별도 출고 조건 |
| 4 | P0 | 핵심 | Torch adjoint·자동미분 | 제한된 실수 유전체/CPML 경로 구현, 일반 물리·포트·형상 미분 확대 |
| 5 | P0 | 핵심 | 계층형 메모리·대규모 실행 | 체크포인트 3계층, DRAM slab·비동기 전송·정책 선택 부분 구현. 54GiB 짧은 forward/VJP 검증 완료(complex FP64와 real FP32). 파일 bank 예약은 실측 수명 상한 C+3 상태로 축소(2S 절감), host dense parameter 예약은 실측 ledger 범위(contiguous real CPU scalar ε, real field, 동기 재사용 CUDA tile, 파일 bank, 점 관측)에서 8×→4×, 그 밖은 8× 유지. block 단위 durable restart journal 구현(16 test, CPU/CUDA·host/file bank·실제 프로세스 kill). 22.6억 셀 FP32의 중단·재개를 5880에서 실측(재개 gradient 상대 L2 9.1e-8, 두 프로세스 34.9분, 전체 머신 RAM 최대 38.9 GB, 디스크 쓰기 1.52 TB, [기록](BEYOND_VRAM_RESTART.md)). 장시간 응용·통합 정책 검증은 남음 |
| 6 | P1 | 필수 | 측정·분산 재료 | passive fitting·ADE forward 및 resident Torch·fused CUDA ADE backward 구현, 실험적 공간 ADE 연결, 54GiB 10-step 용량/VJP 검증 완료, 장시간 수렴·속도 후속 |
| 7 | P1 | 필수 | 계면·메시 | 실험적 subpixel의 개선·퇴행 기록, 고굴절률·분산·비균일 계면 및 gradient 수렴 |
| 8 | P1 | 필수 | 모드·포트·정규화 | 독립 고유모드·전력 보존·S-parameter 검증 |
| 9 | P1 | 필수 | CUDA tensor batch | forward cohort와 공유 메모리 예산의 순차 adjoint case replay 구현, 동시 gradient microbatch 후속 |
| 10 | P1 | 필수 | 주파수장·흡수·회절·방사 | 물리 관측량과 differentiable observer 연결 |
| 11 | P1 | 필수 | 핵심 CAD·설계 영역 | 분석 형상·회전 구현, polygon/spline 정점·제어점 VJP와 mesh 세분화 수렴 기록, GDS 구멍·etch·측벽 완료. 남은 것: 구멍 미분·제조 조건 |
| 12 | P2 | 후속 필수 | UI·workflow | GUI 설계·sweep, 영구 checkpoint/restart |
| 13 | P2 | 조건부 | 비선형·특수 물성 | 구체적 연구에 필요할 때 |
| 14 | P2 | 조건부 | 단일 grid multi-GPU | 단일 GPU·DRAM 경로 뒤, backward까지 분할 검증 |
| 15 | P2 | 조건부 | 특수 CAD·동적 subgrid | 실제 입력·정확도 요구가 있을 때 |
| 16 | P2 | 조건부 | 추가 FSP 호환 | 실제 작업 이전에 필요한 부분만 |
| 17 | P3 | 제외 권장 | 내부 알고리즘·전용언어 전체 복제 | 독립 Python/API와 필요한 계산으로 대체 |
| 18 | P3 | 제외 권장 | 표시 옵션의 일대일 복제 | 수치·해석에 영향 없는 외관 맞추기 |

전체 물리의 Torch 미분과 큰 격자의 자동 스트리밍이 완성됐다는 뜻은 아니다. 구현된 부분과 다음 검증은 [개발 측정](validation/ADJOINT_REPORT.md)과 [메모리 계약](ADJOINT_MEMORY_PLAN.md)에 분리해 기록한다.

## 이번에 구현한 범위

CAD 후속 구현은 [형상 정의·Python/UI 사용법](ANALYTIC_GEOMETRY.md)과
[RTX 5880의 8개 배치 실측](validation/GEOMETRY_ENSEMBLE_REPORT.md)에 정리했다.
다각형·타원 형상·3축 회전을 지원하고, 불필요한 전 영역 형상 판정을 줄인다.
추가 FSP 호환은 실제 연구 파일을 옮기는 요구가 생길 때 해당 범위를 검증한다. 이미 제공한 호환 기능은 유지한다.

후속 [FSP 형상 왕복 저장](FSP_NATIVE.md)은 다섯 primitive의 회전·polygon pivot·타원 링 sector를 독립 변환하고, 기존 형상 편집을 Python/CLI/UI에서 저장한다. 형상만 수정하면 메시 노드는 고정이다. Scene writer의 [uniform 메시 편집](FSP_MESH_WRITE.md)은 간격·영역 크기·CAD/PML 범위·저장 노드·CFL을 함께 갱신한다. 추가된 [primitive 목록 편집](FSP_OBJECTS_WRITE.md)은 다섯 형상의 추가·삭제·복제·순서와 ID 대응을 저장한다. [소스·모니터 목록 편집](FSP_INSTRUMENTS_WRITE.md)은 electric dipole, 3D plane/TFSF, TIME/DFT와 shared component 분리를 저장한다. 새 레코드 기본 metadata의 외부 reader 검증, 비균일 생성기 저장과 외부 remeshing 검증은 남아 있다. 미지원 물리 변경을 조용히 누락하지 않고 오류로 반환한다. 합성 파일의 미수정 byte, native CPU/CUDA·tensor 계산 및 UI 재입력 흐름으로 검증한다. 전체 파일 호환 완료로 표시하지 않는다.

| 기능 | Python | UI | 검증 |
|---|---|---|---|
| 자동 decay 종료 | `Region.run_control` | Simulation → Termination and diagnostics | 전체 E/H·수동 oscillator norm, 소스 종료 gate, 연속 검사, 시간 trace prefix 일치, 정상 완료·취소 구분 |
| 발산 감지 | `RunControl` | 같은 패널 | 표시 단면 밖의 non-finite 상태, CPML, 선택형 절대 장 한도와 유한 소스 종료 후 성장 한도 |
| 다중 공진 재료 | `Material(model="multipole", poles=[...])` | Materials → Multiple Drude / Lorentz poles | 합성 감수율, 독립 D/E 측정, 단일 pole 회귀, CPU/CUDA와 graph/eager |
| 메시 수렴 검사 | `mesh_refinement_projects`, `mesh_convergence` | 전용 실행 UI는 아직 없음 | 물리적 시간·영역·PML 두께, matching reference, 해석 박막 스펙트럼, 잘못된 관측량·취소·미수렴 처리 |
| 우선순위 열람 | JSON·전체 분류 CSV | 중요도·잔여 작업 필터 | 모든 행에 분류가 있어야 inventory 생성이 성공함 |
| CUDA tensor batch | `run_tensor_batch`, `tune_tensor_batch`, `optimize(execution='tensor')` | 전용 실행 UI는 아직 없음 | 독립 실행과 장·신호·DFT bitwise 일치, 후보별 준비 비용 공개, 4종 16-case와 전체 DE 루프 실측. 선택 후 느려지는 조건도 공개 |
| 혼합 CUDA 작업 자동 분류 | `plan_grouped_batch`, `run_grouped_batch` | Python API 우선 | 서로 다른 mesh·step·경계·정밀도를 정확히 분류하고 입력 순서 복원. 메모리 기준 cohort 분할. 4종 혼합 16-case와 실제 전체 비용 비교. grouped optimizer·GUI는 후속 |
| Normal-incidence one-way plane | `Source(injection="oneway")`, `FDTD.addplane` | Sheet source → injection·axis·direction | 20개 독립 이산 기준, 보조 PML 수렴, 양 방향 박막 R/T·보존·scattered-side flux, GPU tensor 일치 |
| Closed normal-incidence TFSF box | `Source(kind="tfsf")`, `FDTD.addtfsf` | TFSF box → spans·axis·direction·preview | 20개 독립 이산 기준, live incident-line PML 수렴, Mie 구 산란 4개 메시와 시간 연장 대조, CPU/CUDA/tensor 일치. 메시 오차 비단조도 공개 |
| 전기·자기 벡터 소스 | `Source.component/theta/phi`, `FDTD.adddipole` | Source → polarization 또는 theta/phi | 독립 Fourier 이산 계산, H 반 시간 주입, CPU/CUDA·tensor 일치, electric FSP 방향 변환. 절대 dipole power 보정과 FSP magnetic 형식은 남음 |
| 선택형 plane DFT | `FieldMonitor.record_fields/record_poynting/record_flux` | Monitor settings → Record 선택 | 필요한 성분만 CUDA 누적. CPU/CUDA 독립 DFT 수식, mixed precision/cohort·NPZ·출력 누락 오류 검사. Flux-only와 full-output의 같은 flux 비교 |
| DFT 샘플·정밀도 | `downsample_xyz`, `time_downsample`, `dft_precision`, `SpectrumSettings` | 축별 stride·정밀도·Lobatto·전역/로컬 설정 | saved FSP plane subset과 native 해석. 감산/샘플 phase·quadrature 차이를 변환 진단으로 보고. Volume·uncollocated·spectral average는 남음 |
| Rectilinear 메시 | `mesh_steps`, `mesh_coordinates`, `time_step_override`, `FDTD.setmesh` | 축별 간격·노드 배열 원자적 편집·시간 간격·preview | 독립 3D Fourier 해, 비균일 periodic/Bloch 에너지, 물리 PML 깊이, paired source, CPU/CUDA/tensor와 synthetic FSP. 5880 8개 ensemble·72회 측정의 관측량 검사 통과 |

사용법과 수치적 범위는 [실행 제어·다중 공진·수렴 검사](RUN_CONTROL_AND_CONVERGENCE.md)에 정리했다. 실행 비용과 오차는 측정한 입력 범위에서 보고하며 일반적인 정확도 보장이나 다른 라이브러리 대비 성능 순위를 뜻하지 않는다.

0.13의 ensemble 후속 개발에서 RTX 3060과 RTX 5880 각각 Python 195개 검사 통과, 선택형 1개 skip이다. 지연된 one-way drive 종료 판정과 facade 복합 인자 보정 후 관련 검사 28개도 양쪽에서 통과했다. 0.13 RTX 5880 UI 검사는 13개 통과, 외부 형식 연동 4개 skip이다. 64³ sphere의 적분값 0 펄스에서는 4,000 → 1,000 step, 전체 시간 2.09배 단축과 DFT 상대 L2 오차 1.83e-8을 확인했다. 원래 Gaussian의 정전기 잔류 사례는 종료되지 않은 사실도 기록했다. [검증 기록](ACCEPTANCE.md), [자동 종료 측정](validation/RUN_CONTROL_REPORT.md), [벡터 소스 정의](DIPOLE_SOURCES.md).

## 추적 규칙

0.14의 TFSF 추가 후 전체 Python 검사는 RTX 3060과 RTX 5880에서 각각 207개 통과, 선택형 1개 skip이다. 5880 UI는 14개 통과, 선택형 연동 4개 skip이다. 초기 로딩 중 편집 race도 수정했다. [소스 정의](TFSF_SOURCES.md)와 [구 산란 검증](validation/TFSF_REPORT.md)은 구현 범위와 한계를 명시한다. 구 산란의 50 nm 메시 오차 0.31%만으로 일반 정확도 우위를 주장하지 않는다.

분류 규칙은 `torchfdtd/priorities.py`, 기능 상태와 근거는 `benchmarks/build_feature_inventory.py`에 있다. 이 스크립트가 전체 JSON, 체크리스트, CSV를 함께 갱신한다. `required`는 필요, `conditional`은 특정 사용 사례가 있을 때만 착수하며, `omit`은 새로 구현하지 않는다. 이미 구현된 기능은 유지한다. 엔진이 구현되어도 UI가 빠져 있으면 잔여 작업에 포함된다. 전용 형식 호환 여부는 native 구현과 별도로 유지한다.

## 스펙트럼 배치 처리량 후속 구현

다음 실험에서는 공통 주파수 위상 평가를 하나의 CUDA kernel로 합쳤다. `Simulation.run`, `run_tensor_batch`, `tune_tensor_batch`, tensor `optimize`에 선택형 `cuda_graph_steps`도 연결했다. 관측·자동 종료 시점과 모든 시간 샘플을 보존한다. 8개 작업의 168개 timed ensemble 결과를 [추가 표](validation/GRAPH_ENSEMBLE_REPORT.md)에 기록한다. 위상 kernel의 루프 개선은 full wall 개선을 보장하지 않았고, 시간 단계 묶기도 일부 조건에서 느려져 기본값은 1이다. 세 경쟁 엔진의 실행 환경·공통 adapter와 이산 adjoint가 우선 후속 과제로 남는다.

`Region.cuda_monitor_kernel="fused"`를 추가했다. 공간 E/H 보간과 주파수 DFT 누적을 여러 plane·case가 공유하는 CUDA kernel로 실행하며 GUI에서도 선택한다. 4종 예제 × 32³/64³, 각 8개 구조물의 동일 출력 조건을 비교한다. 상대 flaport 기준선에도 같은 fused DFT observer를 제공한 결과와 native 순차/배치·Torch/fused 모니터의 분리 측정을 [표와 원시 기록](validation/SPECTRAL_ENSEMBLE_REPORT.md)에 유지한다. Adjoint와 나머지 세 라이브러리의 동일 GPU 측정은 계속 P1이다.
