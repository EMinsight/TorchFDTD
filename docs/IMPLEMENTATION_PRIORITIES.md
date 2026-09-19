# 구현 우선순위와 제외 기준

기준은 선형 photonics, Python 자동화, 단일 NVIDIA GPU와 inverse design이다. 개별 제품의 속성을 전부 복제하는 것을 완료 기준으로 삼지 않는다. 모든 기존 행에 중요도, 필요 여부, 기능군, 이유를 부여한 [전체 분류 CSV](FEATURE_PRIORITY_INDEX.csv)와 UI의 **Feature checklist → Capability priority**에서 항목별 판단을 확인할 수 있다.

현재 1,658행 중 엔진 또는 UI에 남은 작업이 있는 행은 1,505개다. P0 8행, P1 986행, P2 446행, P3 65행이다. 반복되는 객체 속성을 포함한 행 수이며 기능 개수나 완성률이 아니다. 기능군과 개별 속성의 검증된 범위를 따로 표시한다.

| 순서 | 중요도 | 필요 여부 | 기능군 | 판단과 다음 통과 기준 |
|---:|---|---|---|---|
| 1 | P0 | 필수 | 실행 신뢰성·계산 낭비 방지 | 자동 종료와 전체 장 발산 검사. 지연 소스, 연속파, 취소와 정상 조기 종료를 구분해야 한다. 이번 구현에 포함. |
| 2 | P0 | 필수 | 정확도·수렴 검증 | 같은 물리적 시간·영역·PML 두께에서 관측량을 비교한다. 이번에 Python 수렴 검사와 matched reference 지원 추가. GUI study 실행은 남음. |
| 3 | P0 | 공개 배포 전 필수 | 독립 배포 패키지 | 배포 파일 목록, 출처·라이선스, 자격증명 제외와 재현 가능한 설치를 검증. 아직 미완료. |
| 4 | P1 | 필수 | 단방향/TFSF·모드 포트·S-parameter | Normal-incidence one-way plane과 closed TFSF box, 3D FSP subset 구현. 독립 이산 기준·박막 R/T·Mie 구 산란 검증. Oblique/finite-aperture·mode port·S-parameter와 FSP 일반 호환은 남음. |
| 5 | P1 | 필수 | 다중 공진·측정 재료 피팅 | 이번에 수동 다중 공진 ADE와 GUI/Python 편집 구현. 측정 n/k import와 passive fitting, 대각 이방성은 남음. |
| 6 | P1 | 필수 | subpixel·독립 축 메시·대칭 경계 | 독립 축 간격·명시적 노드와 CPU/CUDA/batch 구현. 일정 횡단면 구조의 matched-dt 실측 완료. Subpixel·대칭 경계·일반 곡면 정확도는 남음. |
| 7 | P1 | 필수 | 이산 adjoint / autodiff | 대규모 topology inverse design의 핵심. 재료·CPML·모니터를 포함한 Taylor 검사와 방향 미분 검사, gradient 시간·메모리 측정. 미구현. |
| 8 | P1 | 필수 | GPU tensor batch | 동일 실수 격자의 batch-axis CUDA와 cohort 분할 구현. 실측 기반 cohort 선택과 DE population 실행 연결. 서로 다른 메시·시간·정밀도 조건의 자동 분류와 입력 순서 복원을 추가. B=1/2/4/8/16 전체 E/H·점 신호 bitwise 일치와 5880 처리량 실측. 복소장·개별 자동 종료·GUI 실행은 남음. |
| 9 | P1 | 필수 | 주파수 공간장·흡수·회절·방사 | 성분 선택과 물리적 관측량을 구현하고 광학적 합법칙·보존·수렴 검증. |
| 10 | P1 | 필수 | 핵심 CAD·설계 영역 | Polygon extrusion·타원체/기둥/링 sector·3축 회전, Python/UI와 CUDA batch 구현. 형상 경계로 판정 범위를 줄이는 준비 최적화 실측 완료. 인식된 FSP primitive import·writeback 추가. 공간 재료 배열·GDS·그룹은 남음. |
| 11 | P1 | 필수 | 일반 FSP 호환 | 기존 primitive 위치·크기·회전·가변 vertex·상수 재료의 독립 writeback 구현. 원본 byte 보존과 재변환 검사. 소스 시간·위상, 모니터 주파수·window, duration·CFL·일부 PML/Periodic 설정 writeback 추가. Primitive 추가·삭제·순서 저장과 ID/byte 대응표 추가. Electric source·TIME/DFT monitor 목록과 shared component 분리 저장 추가. 새 레코드 외부 reader 검증, 전체 버전·결과·미지원 소스/모니터 class·일반 설정은 필수 후속 작업. |
| 12 | P2 | 후속 필수 | 결과 탐색·GUI sweep·그룹·checkpoint | Python 기능을 GUI에서도 조합할 수 있게 만들고 큰 계산의 재시작을 지원. |
| 13 | P2 | 조건부 | 비선형·gain·Raman·자기·열·전하·2D sheet | 해당 연구 문제를 다룰 때 추가. 일반 선형 유전체 소자 개발의 선행 조건은 아님. |
| 14 | P2 | 조건부 | 단일 문제 multi-GPU/MPI·클러스터 | 한 장치에 들어가지 않는 문제와 실제 다중 GPU 검증 환경이 필요할 때 추진. |
| 15 | P2 | 조건부 | STL·복잡 곡면·공정 builder·동적 subgrid | 실제 입력 형상이나 검증된 필요가 있을 때 추진. 구현 복잡도와 검증 비용이 큼. |
| 16 | P3 | 제외 권장 | 전체 전용 스크립트·제품별 내부 알고리즘의 동일 복제 | native Python/JSON/NPZ와 독립 알고리즘으로 필요한 작업을 지원한다. 독점 DB 복제도 불필요. 공개·사용자 재료 데이터 입력은 P1 재료 작업에 포함. |
| 17 | P3 | 제외 권장 | opacity·wireframe 등 세부 표시 옵션의 일대일 복제 | 계산과 결과 해석에 영향 없는 옵션을 동일하게 재현할 필요는 없음. 이미 있는 편의 기능을 삭제한다는 뜻은 아님. |

P1의 순서는 선행 기능과 검증 가능성을 고려한 구현 순서다. Adjoint와 tensor batch는 어렵다는 이유로 선택 기능으로 내리지 않았다. 정확한 목적함수·재료·경계 검증 위에 구현해야 하는 핵심 기능으로 남긴다. broadband oblique injection 자체도 필요한 소스 기능이며, 특정 제품의 구현 방식을 복제할 필요는 없다.

## 이번에 구현한 범위

CAD 후속 구현은 [형상 정의·Python/UI 사용법](ANALYTIC_GEOMETRY.md)과
[RTX 5880의 8개 배치 실측](validation/GEOMETRY_ENSEMBLE_REPORT.md)에 정리했다.
다각형·타원 형상·3축 회전을 지원하고, 불필요한 전 영역 형상 판정을 줄인다.
일반 FSP 호환은 요청된 완전 대체 목표의 필수 작업으로 유지한다.

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

분류 규칙은 `photonweave/priorities.py`, 기능 상태와 근거는 `benchmarks/build_feature_inventory.py`에 있다. 이 스크립트가 전체 JSON, 체크리스트, CSV를 함께 갱신한다. `required`는 필요, `conditional`은 특정 사용 사례가 있을 때, `omit`은 현재 목표에서 제외를 뜻한다. 엔진이 구현되어도 UI가 빠져 있으면 잔여 작업에 포함된다. 전용 형식 호환 여부는 native 구현과 별도로 유지한다.

## 스펙트럼 배치 처리량 후속 구현

다음 실험에서는 공통 주파수 위상 평가를 하나의 CUDA kernel로 합쳤다. `Simulation.run`, `run_tensor_batch`, `tune_tensor_batch`, tensor `optimize`에 선택형 `cuda_graph_steps`도 연결했다. 관측·자동 종료 시점과 모든 시간 샘플을 보존한다. 8개 작업의 168개 timed ensemble 결과를 [추가 표](validation/GRAPH_ENSEMBLE_REPORT.md)에 기록한다. 위상 kernel의 루프 개선은 full wall 개선을 보장하지 않았고, 시간 단계 묶기도 일부 조건에서 느려져 기본값은 1이다. 세 경쟁 엔진의 실행 환경·공통 adapter와 이산 adjoint가 우선 후속 과제로 남는다.

`Region.cuda_monitor_kernel="fused"`를 추가했다. 공간 E/H 보간과 주파수 DFT 누적을 여러 plane·case가 공유하는 CUDA kernel로 실행하며 GUI에서도 선택한다. 4종 예제 × 32³/64³, 각 8개 구조물의 동일 출력 조건을 비교한다. 상대 flaport 기준선에도 같은 fused DFT observer를 제공한 결과와 native 순차/배치·Torch/fused 모니터의 분리 측정을 [표와 원시 기록](validation/SPECTRAL_ENSEMBLE_REPORT.md)에 유지한다. Adjoint와 나머지 세 라이브러리의 동일 GPU 측정은 계속 P1이다.
