# TorchFDTD 완료 조건과 남은 계획

현재 실행 범위는 2026-09-21 지시에 따라 **CR 응용 최적화와 CR 정밀 재계산을 제외**한다.
기존 CR 결과와 진단은 보존하며 추가 CR 실행을 예약하지 않는다. 시뮬레이터의
일반 inverse design API, 물리·gradient 정확도, 메모리 계층과 비교 검증은 계속 필수다.
현재 기능 범위의 상세 근거는 [FDTDX 대응표](FDTDX_PARITY_KO.md)를 우선한다.
아래 과거 실행·시간 기록은 새 CR 실행 계획을 뜻하지 않는다.


기준일: 2026-09-21. 목표는 Lumerical FDTD와 FDTDX를 대체할 수 있는
Torch 기반 GPU FDTD다. 기능 개수나 현재 통과한 테스트 개수를 완성도로
환산하지 않는다. 기능 구현, 물리 검증, 실행 비용과 사용자 흐름을 함께
확인한다. 단순히 새 이름으로 배포하는 것은 이 목표의 완료가 아니다.

## 우선순위와 완료 조건

| 순서 | 남은 작업 | 완료를 판단할 증거 |
| --- | --- | --- |
| 0 | TorchFDTD 이름 통일 | 저장소·폴더·패키지·CLI·UI·문서 변경, 기존 입력 보존, 배포물 설치/실행 확인. 기존 실행과 실험 기록 보존 |
| 1 · P0 | 물리 출력과 gradient 메시 수렴 | 같은 물리 크기·시간·소스·PML 두께에서 메시를 세분화하고 출력과 동일 형상 파라미터의 gradient를 비교. 독립 해석 기준 및 시간/PML 오차 분리 |
| 제외 | 원래 CR 응용 최적화·정밀 재계산 | 이번 완성 범위에서 제외. 기존 계산·진단 기록 보존. 일반 Torch inverse design 기능과 solver gradient 검증은 계속 필수 |
| 3 · P0 | 실제 FP32 48GB 초과 및 계층 메모리 | 54GiB E/H FP32 10-step forward·backward 용량 gate 완료([기록](BEYOND_VRAM_FP32.md), 디스크 정리·메모리/시간 기록 포함). block 단위 durable restart journal 구현([문서](STREAMED_RESTART.md)). 대규모 중단·복구와 OS cache를 포함한 전체 메모리·디스크 처리량은 [실측했다](BEYOND_VRAM_RESTART.md). 남은 증거: 의미 있는 물리 시간의 실행. dense epsilon/VJP가 DRAM 한계가 되는 경로도 공간 생산·축약으로 개선 |
| 4 · P1 | PEC/PMC·대칭/반대칭 경계 | CPU·CUDA·adjoint·DRAM/파일·배치에서 일치. 독립 반사/공진 해와 전체 영역 대비 축소 영역 결과·gradient·비용 확인 |
| 5 · P1 | Eigenmode source·mode port | 모드 전력 정규화, 전진/후진 분리, S-parameter, 전력 보존·상반성, 설계 영역의 Torch 미분과 UI/Python 연결 완료. N-port·좁은 aperture·streamed 주입·|S_ij|² adjoint·GDS 마커 builder 완료([기록](OPEN_MODE_PORTS.md)). 남은 것: source parameter·고유모드 미분, 비축 normal |
| 6 · P1 | Near-to-far field | 폐곡면 원거리장·유한거리 exact Green 함수·각도/구면/Cartesian/k-space 관측·복소(주파수별) 외부 매질·open surface·목적함수 adjoint 완료([기록](RADIATION.md)). 남은 것: 층상 외부 매질, 사다리꼴 quadrature |
| 7 · P1 | GDS와 일반 형상 설계 | GDS 레이어·단위·계층·변환·구멍·etch·측벽 staircase·입출력·port 연결 완료([기록](GDS.md)). Polygon/spline 정점·제어점 미분과 수렴 기록 완료([기록](SHAPE_GRADIENTS.md)). 남은 것: 구멍 미분, 제조 제약 |
| 8 · P1/P2 | 일반 이방성·비선형·여러 소스 미분 | 회전된 물성 텐서, 지정한 비선형 모델과 안정성, forward/backward 일치, 진폭·위상 등 source 파라미터의 Torch 연결. 범위를 명시한 독립 물리 문제로 검증 |
| 9 · P1 | 배치·자동 스케줄러 성능 | 동시 adjoint microbatch, 재계산·전송·I/O를 포함한 선택. resident가 빠른 조건과 streaming이 필요한 조건을 모두 보고, 선택 비용이 이득을 없애지 않는지 확인 |
| 10 · 출고 조건 | 경쟁 비교·UI·API·논문·배포 | 같은 정확도와 관측량에서 FDTDX 및 다른 solver의 전체 forward/backward/optimizer 시간·메모리·최대 크기 비교. 필수 기능의 UI/API/저장/재시작, 독립 설치와 문서, 논문 및 공개 자료 검토 |

단일 grid multi-GPU는 단일 GPU/DRAM 경로 다음 확장으로 유지하며,
실제 복수 GPU 실측 없이 완료로 표시하지 않는다. LSF는 필요한 명령의
독립 Python 변환을 우선하고 미지원 구문은 명시적으로 거절한다. 전용
언어와 제품 내부 알고리즘 전체 복제, 계산에 영향 없는 외관 속성의
일대일 복제는 기존 제외 기준을 유지한다.

## Gradient 수렴이 필요한 이유와 실행 범위

병렬 구현 후속: PEC와 반대칭 경계는 CPU/CUDA, 복소장, discrete adjoint,
공간 스트리밍과 CUDA batch에서 검증했고, UI·Python 별도 면 설정과
저장·내보내기·실행도 확인했다. PMC/대칭 경계는 상단 Yee face/edge 상태를
일반 실행 경로와 연결하는 작업은 미완료이며
[상태 구조 계획과 별도 API](PMC_IMPLEMENTATION_PLAN.md)를 따른다.

[형상 기반 재료 스트리밍](streamed_geometry.md)에 이어
[CR 밀도 스트리밍](streamed_density.md)도 연결했다. Streamed
`PeriodicLayerResponse`는 2D density에서 타일 유전율을 생성하고 gradient를
2D로 직접 축약한다. 전체 3D epsilon과 그 VJP를 만들지 않으며 CPU·파일·
비동기 CUDA 검사를 통과했다. 실제 48GB 초과 성능과 분산재료 경로는 남았다.

PMC는 실제 endpoint의 face/edge 상태와 real FP32 CPU/CUDA를 갖는
`EndpointSimulation`에서 point source/monitor, 재료·파형 gradient와
binomial checkpoint를 연결했다. `EndpointProject` 어댑터는 native 형상·pulse와
명시적 closed-wall override를 연결한다. 전역 dispatch/UI·streaming·ADE 연결은
아직 남아 있다. 일반 tensor는 별도 `TensorDielectricSimulation`의
periodic/Bloch bulk 경로에서 CPU/CUDA·6성분 VJP·고유파를 검증했다.
CPML 진입(기하 안정 조건)·tensor ADE·streaming은 구현했고 anisotropic mode 주입과 fused kernel은 남았다. [Mode source 연결](MODE_INJECTION.md)은 실제 CUDA 전파,
방향별 복소 t/r 및 국소 산란체 material VJP까지 검증했다.
[ModeNetwork](MODE_NETWORK.md)는 같은 exterior 단면의 opposing port를
다중 모드 복소 S 행렬로 묶고 backward에서 각 case를 하나씩 재생하며,
[ModeBranchNetwork](OPEN_MODE_PORTS.md)는 임의 개수 port·좁은 aperture·
streamed 주입·|S_ij|² adjoint를 더한다. eigenmode 미분과 비축 normal은 남아 있다.
[회절·원거리장](RADIATION.md), [density 제약](DESIGN_PARAMETERIZATION.md),
[GDS](GDS.md)도 추가했다. 항목별 FDTDX 동등성의 정확한 완료 기준은
[별도 추적표](FDTDX_PARITY_KO.md)를 따른다.

2026-09-21 후속 증거: [FP32 박막 수렴 실험](gradient_mesh.md)에서 동일한
물리 영역·시간·소스·PML 두께를 유지하고 메시와 형상 전이 폭을 줄였다.
해석해 대비 두께 gradient 오차는 12.09%에서 1.63%, 유전율 gradient
오차는 11.96%에서 1.78%로 감소했다. 초기 설정의 3% 기준 실패도
보존했다. 실제 작은 설계 이동의 개선과 별도 시간/PML 제어가 확인됐다.
이는 평면 박막의 증거이며, 곡면 및 원래 CR 최종 구조의 수렴 완료는 아니다.

현재 이산 adjoint 검사는 구현한 격자 방정식의 gradient가 맞는지를
검증한다. 이것만으로 해당 gradient가 더 세밀한 메시의 물리적 설계
방향과 같다는 결론을 내릴 수 없다. 먼저 해석 기준을 갖는 박막/형상
파라미터 문제에서 확인하고, 그 다음 CR의 최종 후보로 확장한다.
모든 개발 수정이나 optimizer iteration마다 전체 수렴 검사를 반복하지 않는다.

격자 간 비교는 같은 물리 파라미터 및 스케일에서 수행하고,
목적함수·gradient 크기·방향과 작은 실제 설계 이동의 효과를 함께 확인한다.
오차 한계는 각 실험 전에 고정한다. 매우 작은 gradient의 상대 오차만으로
합격/불합격을 판단하지 않는다. 형상 전이 폭과 메시 간격의 영향을
분리하고, 실제 sharp-interface 모델에 대한 수렴과 regularized 모델의
이산 미분 일치를 구분한다.

## 현재 시간 측정과 추정의 한계

2026-09-21 02:56 KST에 RTX 5880의 ADE 비교가 끝나고 원래 CR
정보량 목적함수의 24-cycle 최적화가 시작됐다. ADE의 3회 측정 median은
CPU 12-thread 742.0371초, GPU resident 4.9957초, GPU+DRAM 23.9025초다.
자체 Torch CPU 대비 각각 148.53배와 31.04배다. 같은 실험을 다시 돌리지
않고 77개 소스 hash와 전체 출력·gradient 오차를 확인해 기록을 보존했다.
이는 VRAM 안에 들어가는 문제이며 경쟁 solver 대비 측정은 아니다.

CR 전체 144조건의 FP32 응답과 gradient 검증은 RTX 3060에서
2218.756 s, 약 37분 걸렸다. 이를 단순히 24회 곱하면 14.8시간이다.
그러나 원래 CR optimizer는 별도 후보 평가와 동일 hard-mask 캐시를
사용하고 실행 GPU도 5880이므로 이 곱셈은 실제 완료 ETA가 아니다.
첫 실제 cycle과 cache hit 기록으로 이후 ETA를 갱신해야 한다.

과거 complex FP64 54GiB 용량 실험은 약 52분이었다. 같은 E/H bytes에
셀 수가 4배인 real FP32 실험은 실측 58.41분(forward 730 s, backward
2771 s)이 걸렸다([기록](BEYOND_VRAM_FP32.md)). 이는 10-step 용량 gate의
시간이며 장시간 실행이나 복구의 ETA가 아니다.

전체 개발 완료 시각은 현재 로그로 실측할 수 없다. 계획 수립용으로는
핵심 CR/대규모 실행의 연구용 1차 버전에 1–2주, 요청한 추가 물리와
동등 정확도 경쟁 비교를 포함한 목표에 4–8주 이상을 우선 배정한다.
이는 검증된 ETA나 기한 약속이 아니다. 물리 오류 수정이나 주요 kernel
재설계가 필요하면 8–12주 이상으로 늘어날 수 있다. 1차 버전은 전체
목표 완료나 FDTDX 성능 우위의 증거로 표시하지 않는다.

최종 완료에는 위 필수 항목의 증거와 실제 성능/용량 장점이 모두
필요하다. 특정 경우의 speedup을 모든 문제의 우위로 일반화하지 않는다.
공개 저장소 전환과 홍보는 기존 사용자의 승인 조건을 유지한다.
