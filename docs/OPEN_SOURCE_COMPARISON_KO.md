# GPU FDTD 경쟁력과 검증 기준

외부 코드 검토일: 2026-09-21. TorchFDTD 구현 갱신: 2026-09-21. 아래 기능 비교는 공식 코드와 문서에 근거한다.
프로젝트가 발표한 성능과 우리가 직접 측정한 성능을 구분한다.
현재 TorchFDTD를 가장 빠르거나 가장 완성된 FDTD라고 부를 근거는 없다.

현재 FDTDX commit과 항목별 완료 조건은 [동등성 추적표](FDTDX_PARITY_KO.md)에
모았다. GDS, 제약을 갖는 density parameterization, 실제 mode injection,
회절·closed-surface far-field를 추가했다. 기본 API 구현과 전체 기능 동등성을
구분한다. 별도 API의 bulk tensor adjoint, PMC endpoint와 native Project
어댑터, opposing multimode S 행렬, rank-local 분산 초기값 계산을 추가했다.
Native closed-PMC의 browser·CLI 실행과 고정 등방성 CPML 외부 안의 tensor
adjoint까지 연결했다. 일반 anisotropic CPML·반사/안정성 검증, PMC의
추가 물리·streaming과 실제 multi-GPU 검증은 계속 미완료다.

이번에는 실제 계산 비교로 진행했다. 5880에서 vacuum/sphere/slab/waveguide 각각 64³와 96³, 총 8개를 flaport/fdtd 0.2.2와 실행했다. 상대 기준선에도 CUDA Graph를 적용했고 전체 wall time은 9.64–17.09배 단축됐다. 점 신호 상대 L2 차이는 0.012–0.037%다. 경계 stencil 차이 때문에 최종 전체 장은 동일하지 않으며, 약한 최종 H의 상대 오차가 큰 사례도 [상세 보고서](validation/OPEN_SOURCE_REPORT.md)에 공개했다. 다른 세 라이브러리의 속도는 아직 측정하지 않았다.

새 `run_tensor_batch()`는 E/H CUDA launch의 실제 batch 축으로 여러 구조물을 처리한다. 32³/64³와 B=1/2/4/8/16의 모든 E/H·점 신호가 독립 native 계산과 bitwise 일치했다. 32³ B=16은 native 순차 실행 대비 2.40배 빠르다. 64³ B=16은 느려져서 `cohort_size=4` 분할 기능을 추가했다. 후속 실험에서 분할은 순차 대비 1.10배, 16개 동시 대비 1.43배 빨랐다. [전체 성능표](MEASUREMENTS.md#measured-cuda-comparisons), [Python 사용법](TENSOR_BATCH.md).

후속 개발에서 `tune_tensor_batch`를 추가해 실제 전체 계산의 중앙값으로 묶음 크기를 고를 수 있게 했다. 준비 비용과 후보별 장·신호 동일성 검사를 보고하며, 일반 실행에 숨겨서 자동 수행하지 않는다. `optimize(execution='tensor')`도 추가해 DE의 각 population을 같은 CUDA 배치로 처리한다. 새 4종 예제의 16-case 비교와 64회 forward solve를 포함한 전체 역설계 루프는 [추가 검증 보고서](validation/ENSEMBLE_REPORT.md)에 정리한다. 자동 선택이 후속 실행에서 고정 크기보다 느려진 경우도 유지한다.

## 현재 위치

[Rectilinear 후속 측정](validation/RECTILINEAR_ENSEMBLE_REPORT.md)은 진공·단층·이중층·다층의 두 크기, 총 8개 작업에 각 4개 독립 case를 사용했다. dx·실제 dt·물리 영역·800 step·17개 flux 주파수는 같고, 균일한 횡방향 간격만 넓혀 셀을 93.75% 줄였다. Native batch의 full wall은 4.33–13.39배 단축됐고, 줄인 메시에서 batch 자체 효과는 1.41–1.80배다. 전체 72회 측정의 중심선 E/H·점 trace는 동일하고 flux 상대 L2는 최대 5.95e-15다. 다른 엔진과의 비교나 일반 곡면의 정확도 우위는 아니다. Python/UI의 독립 dx/dy/dz와 명시적 node 배열을 추가했으며, adjoint와 나머지 세 엔진의 실측은 여전히 필요하다.

[최신 phase/graph 실험](validation/GRAPH_ENSEMBLE_REPORT.md)은 4종 예제 × 두 격자, 각 8개 구조물을 7가지 모드로 3회 측정했다. 상대 flaport에도 동일한 새 DFT observer와 1/8-step graph를 제공하고 더 빠른 중앙값을 기준으로 삼았다. 우리 고정 4-case cohort의 full-wall 처리량 비는 9.87–21.44배다. 상대는 순차 실행이므로 상대의 별도 최적화 batch 구현보다 빠르다는 주장은 아니다. 주파수 위상 kernel을 따로 융합했으며 루프는 1.06–1.19배, full wall은 0.94–1.06배로 일부 조건이 느려졌다. Graph unrolling도 일부 회귀하여 기본값을 1로 유지했다. 새 native single/batch/unrolled 전체 출력은 bitwise 일치하고 외부 DFT 최대 차이는 0.3875%다. Adjoint 및 다른 세 엔진의 실측은 여전히 남아 있다.

스펙트럼을 수집하는 실제 출력 부하를 추가한 [새 8종 배치 측정](validation/SPECTRAL_ENSEMBLE_REPORT.md)도 진행했다. 세 공간면·6성분·9주파수 DFT를 공통 조건으로 사용한다. 비교 기준선에도 같은 새 fused DFT adapter를 제공하며, 기존 native batch 대비 모니터 개선과 같은 새 모니터를 사용한 순차/배치 차이를 따로 표기한다. [Python/UI 사용법](CUDA_SPECTRA.md).

0.14에서는 독립 scatterer의 입사장·산란장을 분리하는 [closed normal-incidence TFSF box](TFSF_SOURCES.md)를 Python/UI/CUDA batch에 추가했다. 이는 native 활용 범위 확장이며 다른 모든 엔진에 없는 독자 기능이라는 주장이 아니다. 독립 이산 기준과 Mie 해로 검증했고 구 산란 메시 오차가 단조 감소하지 않은 결과도 [그대로 기록](validation/TFSF_REPORT.md)했다. 성능 우위 표는 위의 실측 기준선에만 적용된다.

| 프로젝트 | 확인한 계산 경로 | 미분 상태 | TorchFDTD와의 차이 |
|---|---|---|---|
| [FDTDX](https://github.com/ymahlau/fdtdx) | JAX, CUDA 및 ROCm 설치 경로 | 자동미분과 역시간 복원 기반 메모리 절약을 제공 | inverse design에서 우리가 따라가야 할 기준. TorchFDTD의 유전체/Bloch/CPML/ADE/PEC·밀도·일부 모드/radiation adjoint는 구현됐지만, 전체 지원 물리와 응용 검증은 [추적표](FDTDX_PARITY_KO.md)의 완료 조건을 충족해야 한다. |
| [fdtdz](https://github.com/spinsphotonics/fdtdz) | JAX에서 전용 CUDA systolic kernel 호출 | 확인한 공개 primitive에는 JVP/VJP/transpose 규칙 등록이 없음 | 유전체 전용, z 크기와 경계·출력 제약이 있다. 우리 분산 재료, 축별 CPML, graded mesh, 온라인 면 DFT는 기능 차이다. 속도 우위는 미측정이다. |
| [flaport/fdtd](https://github.com/flaport/fdtd) | NumPy 또는 PyTorch CUDA | backend 초기화에서 gradients를 비활성화. 기본 사용을 미분 지원으로 표시하면 안 됨 | 우리는 이 프로젝트의 grid를 사용하고 원저작자 고지를 유지한다. 자체 CPML·ADE·mesh·모니터, GUI와 workflow를 추가한 상태다. |
| [fdtd3d](https://github.com/zer011b/fdtd3d) | C++/CUDA와 MPI | 공식 README에 adjoint 제공이 명시되어 있지 않음 | 단일 큰 문제를 여러 장치로 나누는 병렬 계산이 중요하다. 우리의 여러 작업 분배는 이 기능과 다르다. |
| TorchFDTD | NumPy CPU, PyTorch CUDA graph, fused CUDA와 batch-axis launch | 지원 물리 범위의 Torch 이산 adjoint, 재료·형상·밀도·고정 plane/mode/radiation 목적함수, 계층 메모리와 bounded replay | 브라우저 UI와 Python 모델, GDS, NPZ 결과, 재개 가능한 process batch, 실수 고정시간 tensor batch와 cohort 분할. 새 PMC/tensor/분산 API의 UI 및 일반 실행 통합은 부분 구현. Windows CUDA 실측. |

FDTDX의 PyTorch 전환은 [공식 refactor 논의](https://github.com/ymahlau/fdtdx/discussions/349)에 발표된 계획이다.
확인한 main은 여전히 JAX이다. 자동미분의 제공은 [JOSS 논문](https://joss.theoj.org/papers/10.21105/joss.08912)에도 명시되어 있다.
따라서 현재 라이브러리를 PyTorch 구현으로 비교하지 않는다.

확인한 FDTDX에는 이미 [다중 pole 분산](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/dispersion.py), 이방성 재료와 rectilinear mesh가 있다. 이를 우리의 고유 우위로 표시하지 않는다. Reversible 경로는 분산 매질을 거부하며 해당 모델은 checkpointed gradient 경로를 사용해야 한다. JAX라는 이유만으로 모든 primitive의 vmap/gradient가 지원된다고 추정하지 않는다.

fdtdz의 미분 상태는 [primitive 등록 코드](https://github.com/spinsphotonics/fdtdz/blob/ef4ea7a8ca4c4554c84402912657253cec3ac460/src/fdtdz_jax/fdtdz_jax.py#L626)를 확인한 판단이다.
JAX wrapper 자체가 이 CUDA primitive를 자동으로 미분해 주지는 않는다.
이는 외부에서 별도 adjoint를 구성할 수 없다는 뜻은 아니다.
flaport/fdtd의 [gradient 비활성화 코드](https://github.com/flaport/fdtd/blob/a760cb59e604b403d1f2a13a35b21aa0f89b3a6d/fdtd/backend.py#L47)와 설치된 0.2.2의 기본 backward 실패를 확인했다.
TorchFDTD의 기존 `Simulation.run()`은 미분 경로가 아니다. 별도 `DifferentiableSimulation`의 제한된 지원 범위는 [API](DIFFERENTIABLE_FDTD.md)와 [측정 보고서](validation/ADJOINT_REPORT.md)에 구분한다.

검토한 commit:

- FDTDX: `60c1c2712da8bb0ccaa55c77846217932bb665a2`
- fdtdz: `ef4ea7a8ca4c4554c84402912657253cec3ac460`
- flaport/fdtd: `a760cb59e604b403d1f2a13a35b21aa0f89b3a6d`
- fdtd3d: `7c04c03710f2d0b2366b2adb8c089244b80dfac4`

FDTDX, fdtdz, flaport/fdtd는 MIT로 표시되어 있고 fdtd3d는 GPL-2.0-or-later이다. 실제 flaport 실측은 PyPI 0.2.2이며 위 main commit과 구분한다. 실측 JSON에 설치된 grid/PML 파일의 SHA-256이 있다.
기능 비교와 코드 도입은 별개다. 이번 전용 CUDA 커널에 경쟁 프로젝트의 코드를 복사하지 않았다.

## 이번에 구현한 CUDA 경로

`Region(backend="cuda", cuda_kernel="fused")`로 선택한다.
UI의 simulation region에도 같은 선택 항목이 있다. 기본은 `torch`로 유지한다.

- E 갱신과 H 갱신을 각각 한 CUDA kernel로 실행한다. 중간 source 주입과 stream 순서를 유지한다.
- curl과 각 미분의 전체 격자 임시 배열을 없앤다.
- CPML 상태는 경계 slab에만 보관하고 기존 상태 배열을 그대로 갱신한다.
- 2D/3D, float32/float64, periodic, 면별 CPML, graded metric을 지원한다.
- Drude/Lorentz ADE 보정과 모니터는 기존 검증 경로를 유지한다.
- Bloch 복소장은 기존 `torch` 경로를 사용한다. 명시적으로 fused를 요청하면 오류로 알린다.
- NVRTC에서 fused multiply-add와 subnormal flush를 끈다. 작은 장이 0으로 사라지는 문제를 재현하고 고쳤다.

다중 process batch는 각 작업에서 이 커널을 선택할 수 있다.
추가된 tensor API는 공통 stencil과 case별 pointer table을 사용해 E/H, source와 point trace launch를 공유한다. ADE 보정은 아직 case별로 실행한다. 선택형 `cuda_monitor_kernel="fused"`는 plane 보간과 DFT 누적을 case 간 공유 launch로 처리한다. float32/64, 2D/3D, graded/periodic/CPML, multipole과 native 결과를 지원한다. 동일 격자·step 조건이 필요하고 복소장·auto shutoff·resume·GUI batch 실행은 미지원이다.

설치와 사용:

```bash
python -m pip install -e ".[cuda-kernels]"
```

```python
from torchfdtd import Project, Simulation

project = Project.load("project.json")
project.region.backend = "cuda"
project.region.cuda_kernel = "fused"
result = Simulation(project).run()
result.save("result.npz")
```

CUDA 12 계열과 NVRTC가 필요하다. 검증한 CuPy는 13.6.0이다.
선택하지 않으면 CuPy를 import하지 않는다. 각 격자 형상별 최초 컴파일 비용은 따로 발생한다.

## 5880 측정

[원시 측정](validation/cuda-kernels.json)은 같은 GPU, 같은 입력과 물리 모델,
같은 800 step, float32, 6면 CPML, Yee sampling, point trace와 최종 snapshot을 사용한다.
형상·커널별 warmup 후 순서를 교대하여 세 번 측정한 중앙값이다.
이 표의 기준선은 우리 기존 PyTorch CUDA graph이다. 위 네 프로젝트와의 순위표가 아니다.

| 격자 | 기존 loop | fused loop | loop 가속 | 준비·결과 포함 가속 |
|---|---:|---:|---:|---:|
| 64³ | 196.7 ms | 15.0 ms | 13.08× | 5.76× |
| 96³ | 286.8 ms | 32.7 ms | 8.77× | 3.90× |
| 128³ | 748.7 ms | 123.5 ms | 6.06× | 3.67× |

세 크기에서 최종 E/H 전체 배열과 시간 trace가 기존 경로와 bitwise 일치했다.
Torch allocator의 peak allocated memory는 각각 약 25%, 26%, 27% 감소했다.
이 메모리 수치는 CUDA context와 driver의 전체 사용량을 포함하지 않는다.
크기마다 timestep의 물리적 길이가 달라지므로 이 표를 mesh 수렴 결과로 해석하면 안 된다.

재현 명령:

```bash
python -m benchmarks.cuda_kernels --sizes 64 96 128 --steps 800 --repeats 3
python -m pytest tests/test_cuda_kernels.py
```

이전 4-case 실험에서 CUDA worker를 1개에서 2개 또는 4개로 늘려도 처리량은 좋아지지 않았다.
약 40배라는 기존 수치 역시 우리 NumPy CPU 대비였다.
따라서 CPU 대비 가속 수치나 process 개수만으로 GPU FDTD 경쟁력을 판단하지 않는다.

## 남은 개발과 통과 기준

아래 항목은 완료를 주장하는 기능 목록이 아니라 구현·검증할 작업 목록이다.

| 상태 | 작업 | 통과 기준 |
|---|---|---|
| 완료, 제한 범위 | fused 실수 Yee/CPML | 전체 장·trace 비교, subnormal 회귀, periodic/graded/분산/ADE/면 DFT 검사와 5880 측정 |
| 부분 구현 | 전용 adjoint / custom backward | 다수의 임의 방향에서 finite difference와 Taylor 검사. CPML·재료 상태를 포함한 정확한 이산 연산의 미분. gradient 시간과 peak memory 측정 |
| 완료, 제한 범위 | 같은 격자 실수 구조물의 tensor batch | B=1,2,4,8,16에서 전체 E/H·점 신호 bitwise 일치, 실제 cases/s·objective evaluations/s 측정. 수동 분할, 실측 기반 묶음 선택, DE population 실행 구현. 복소장·개별 자동 종료·GUI는 남음 |
| 미완료 | 큰 격자의 메모리·시간 최적화 | SoA와 tile별 비교. 내부와 CPML/ADE 영역별 비용 분리. 시간 blocking은 halo 및 monitor 정확성 검사를 통과한 경우만 사용 |
| 미완료 | 정확도 목표 기반 mesh | 균일 mesh보다 적은 셀 수만으로 판단하지 않고, 같은 물리량 오차에서 시간·메모리 절약을 입증 |
| 미완료 | 단일 문제의 multi-GPU 분할 | halo 교환, global boundary 일관성, strong/weak scaling을 실제 다중 GPU에서 측정 |
| 부분 완료 | 네 라이브러리와 공통 benchmark | flaport 0.2.2는 8개 fixture 및 10개 batch 설정 실측. 다른 세 프로젝트는 환경 준비 후 실행. 공통 물리량의 정확도·경계 의미를 먼저 맞춘다. |

대규모 topology inverse design에서는 제한된 adjoint를 정규화된 물리 목적함수와 큰 격자에 연결하는 것이 핵심 과제다.
현재 differential evolution은 작은 수의 설계 변수를 다루는 black-box 경로이며
수십만 voxel의 gradient 기반 설계를 대체하지 않는다.

공통 benchmark는 유전체 전파·도파로·분산 공진·batch·inverse-design의 작업군을 나눈다.
정밀도, mesh, CFL, 경계 반사 허용치, source와 monitor 부담을 공개하고
컴파일, 준비, forward, backward, 결과 회수 시간을 분리한다.
fdtdz처럼 경계나 크기의 허용 범위가 다른 경우 동일 모델이라고 가정하지 않는다.
cell updates/s 외에 같은 전송 오차까지 걸리는 시간과 검증된 gradient/s를 보고한다.

현재 5880 호스트는 Windows이며 WSL이 설치되어 있지 않다.
[JAX 공식 설치 표](https://docs.jax.dev/en/latest/installation.html#supported-platforms)는
Windows native NVIDIA GPU를 지원하지 않고 WSL2를 experimental로 표시한다.
따라서 FDTDX/fdtdz의 동일 GPU 실측 비교는 아직 실행하지 않았다.
fdtd3d는 현재 호스트에 호환 compiler/build 환경이 없고 검토 소스에 POSIX 의존성이 있다. 현재 실행하지 못했다는 사실을 제품의 일반적인 플랫폼 한계나 성능 열세로 해석하지 않는다.

핵심 개발 순서는 [최신 우선순위](IMPLEMENTATION_PRIORITIES.md)에 따른다. Torch adjoint 확대와 계층형 메모리 실행이 P0이며, 정규화된 목적함수·물리 gradient·DRAM 타일링을 함께 검증한다. 호환 Linux CUDA 환경에서 외부 엔진의 공통 fixture 실측도 필요하다. FDTDX 대비 inverse design 우위를 주장하려면 forward 속도 외에 정확한 gradient의 시간·메모리 우위를 실측해야 한다. 그 전에는 "최고"라는 배포 문구를 사용하지 않는다.

## 비교우위 개발 프로젝트의 현재 작업

| 우선순위 | 상태 | 작업과 완료 기준 |
|---|---|---|
| P0 | 완료, 제한 범위 | 4종 구조·여기 예제의 32³/64³, 16-case를 같은 5880에서 비교. native 전체 E/H·점 신호 bitwise와 외부 trace 1% gate를 통과해야 표에 반영 |
| P0 | 완료 | 실제 cohort 선택 API, 준비 비용 공개, 별도 후속 타이밍, 메모리 입장 거부 기록. 최적 크기를 보장한다고 표현하지 않음 |
| P0 | 완료, forward-only | DE population CUDA 배치 실행. 독립 실행과 전체 파라미터·목적함수 이력 동일성, 전체 루프 시간·evaluations/s 측정 |
| P1 | 환경 준비 필요 | FDTDX/fdtdz/fdtd3d의 동일 GPU 실행. 호환 Linux CUDA와 검증한 adapter가 필요. 다른 기계의 발표 수치로 대체하지 않음 |
| P0 | 부분 구현 | 실수 유전체/CPML 이산 adjoint와 bounded checkpoint는 구현. ADE·일반 관측량·공간 streaming은 남음. 방향 미분·Taylor 검사와 gradient 시간·메모리 비교를 통과해야 inverse design 우위 주장 |
| P0 | 후속 | 큰 격자 데이터 배치와 kernel profiling. 셀 수·정밀도·출력·정확도를 줄이지 않고 full wall과 메모리가 개선되어야 채택 |
| P2 | 후속 | 적은 pilot 비용으로 cohort를 예측하고 다른 workload에서 평가. 현재 full-workload 튜닝 비용까지 포함한 총시간보다 좋아야 채택 |

현재의 구체적인 장점은 측정된 flaport 대비 forward 처리량과 Python에서 바로 사용 가능한 CUDA population workflow다. FDTDX 대비 adjoint, fdtdz 대비 최고 forward 성능, fdtd3d 대비 단일 문제 MPI 우위는 확보하지 못했다.

## 선택 출력으로 불필요한 DFT 계산 줄이기

추가 실험은 4종 예제 × 32³/64³, 각 8-case·800-step·3-plane·65-frequency다. Signed flux만 요청할 때 접선 E/H 네 성분만 누적하고 불필요한 field/P 배열 저장을 생략한다. 같은 flux의 주파수·공간·시간 샘플은 유지했다. Full-output batch 대비 전체 실행 시간 1.14–1.69배 개선, Torch peak allocation은 32³에서 18.51→14.88 MiB, 64³에서 103.15→96.25 MiB다.

외부 flaport 기준선에도 같은 선택형 DFT observer와 1/8-step graph를 제공했다. 더 빠른 외부 median 대비 native flux batch는 7.74–19.32배다. 120개 timed ensemble의 native 공통 출력은 독립 full-output 실행과 bitwise 일치한다. 외부 trace·flux의 최대 상대 L2는 각각 0.3267%, 0.1314%다. Full-field 동등성, 메시 수렴 정확도, 나머지 세 라이브러리 대비 우위를 뜻하지 않는다. 같은 선택 출력끼리의 native batch 이득은 1.003–1.60배이며, 64³ slab의 0.3% 차이는 강한 성능 근거가 아니다. [모든 반복값과 조건](validation/SELECTIVE_MONITOR_REPORT.md).


## Analytic CAD·재료 준비 후속 실측

Native polygon extrusion, 타원체·타원기둥·부분 타원 링과 3축 회전을 Python/UI/batch에 연결했다. 형상 bound 안에서만 재료 membership을 판정한다. 구·회전 box·concave polygon·elliptical sector의 64³/96³, 각 4-case × 8-solid, 800-step ensemble에서 full wall은 1.44–21.19배 단축됐다. 48회 timed ensemble의 전체 E/H·epsilon·trace·DFT·flux가 bitwise 일치한다. 이는 같은 native 형상을 전 영역에서 판정하는 기준과의 준비 최적화 실험이며 다른 라이브러리 또는 CUDA stepping kernel의 순위가 아니다. [전체 표와 조건](validation/GEOMETRY_ENSEMBLE_REPORT.md).


## 서로 다른 메시와 계산 시간의 자동 배치 분류

`plan_grouped_batch`와 `run_grouped_batch`를 구현했다. 격자 노드·시간 간격·step 수·경계·정밀도가 같은 case끼리 자동으로 묶고 결과는 입력 순서로 복원한다. 서로 다른 group은 한 GPU에서 차례로 실행하고, cohort 내부는 기존 공유 CUDA kernel을 사용한다. Padding이나 시간 단축은 없다. 이는 새 CUDA stencil 자체의 개선이나 모든 경쟁 라이브러리에 없는 고유 기능을 의미하지 않는다.

5880에서 vacuum/sphere/slab/waveguide를 두 메시 또는 두 시간 조건과 섞은 16-case 작업 네 종류를 실행했다. 각 3회 중앙값의 전체 시간은 native 순차 대비 1.05–1.50배, 동일 fused DFT observer와 더 빠른 1/8-step graph를 제공한 flaport 순차 기준 대비 7.44–16.76배 개선됐다. 자동 분류·사전 검사는 38.2–39.5 ms이며, 동시에 네 case를 보관하여 peak Torch allocation은 순차보다 늘어난다. 48회 정확도 gate를 통과했고 native 전체 출력은 bitwise 일치한다. 외부 trace와 complex DFT 최대 상대 L2는 0.3233%, 0.3875%다. 64³ 시간 혼합의 1.05배 차이는 큰 우위를 보장하지 않는다.

[재현 가능한 Python 예제](../examples/grouped_batch.py), [API와 제한](GROUPED_BATCH.md), [전체 조건·시간·메모리·원시값](validation/GROUPED_ENSEMBLE_REPORT.md). 나머지 세 엔진은 같은 GPU에서 미측정이며, 그 우열을 이 수치로 대신하지 않는다. 우선 과제는 호환 Linux CUDA 환경에서 세 adapter의 공통 입력 검증, CPML/ADE를 포함한 adjoint와 gradient 검증, grouped optimizer 연결 및 GUI batch다.
