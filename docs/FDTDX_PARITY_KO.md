# FDTDX 동등성 확보를 위한 완료 기준

기능 행마다 실제 실행, 물리 정확도, 미분 범위, Python/UI 노출과 증거를
분리한다. 이 표를 모두 통과하기 전에는 FDTDX 대체 완료나 전체 우위를
선언하지 않는다. 특정 구현의 존재와 같은 조건에서의 성능 우위는 다르다.

비교 기준은 2026-09-21 재확인한 FDTDX
[`60c1c2712da8bb0ccaa55c77846217932bb665a2`](https://github.com/ymahlau/fdtdx/tree/60c1c2712da8bb0ccaa55c77846217932bb665a2)다.
공식 코드와 문서의 지원 범위이며 같은 GPU에서 측정한 성능표가 아니다.
FDTDX는 이미 rectilinear mesh를 제공한다. `vmap 가능`만으로 batch 처리량을,
`자동미분`이라는 설명만으로 모든 설정과 고유모드의 미분을 가정하지 않는다.

고정한 FDTDX 버전의 mode solver는 재료와 좌표에 `stop_gradient`를 적용한
외부 고유모드 계산을 사용한다. ADE는 checkpointed gradient 경로를 사용하며,
reversible 경로에서는 명시적으로 거부한다. 사용자 정의 stopping condition과
gradient의 조합도 거부한다. 따라서 **고유모드 자체의 미분은 추가 연구 목표**로
분리하고, 기본 동등성은 실제 지원하는 고정 모드 주입·검출·설계 영역 gradient로
평가한다. 일반 형상·재료·경계의 모든 조합을 양쪽 모두 지원한다고 가정하지 않는다.
근거: [mode 계산](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/core/physics/modes.py#L363),
[ADE 경로 제한](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/fdtd/fdtd.py#L98),
[stopping condition 제한](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/fdtd/wrapper.py#L24).

| 항목 | FDTDX 확인 범위 | TorchFDTD 현재 검증 범위 | 동등성·우위 판단과 남은 완료 조건 |
|---|---|---|---|
| Browser CAD·결과 | 대응하는 공식 browser CAD workflow는 확인되지 않음 | Tree, 여러 CAD view, 속성, 결과, Python export | 사용성 차별점. 새 물리 기능의 UI와 전체 작업 흐름 검증은 계속 필요 |
| 독립 FSP 읽기/쓰기 | 공식 대응 기능 확인되지 않음 | 문서화한 layout subset, 독립 import/writeback | 제한 범위의 상호운용성 차별점. 전체 FSP 호환 아님 |
| 같은 GPU batch | JAX composition 가능. 동일 workload 미측정 | CUDA tensor batch·cohort grouping·선택, 32³ B=16의 자체 순차 대비 2.40배 | FDTDX 대비 속도 우위 미확인. 동일 물리·출력·준비비용을 포함한 batch/adjoint 측정 필요 |
| VRAM 초과 streaming | 공개 JAX 경로에서 단일 GPU CPU/disk 공간 streaming 확인되지 않음. multi-GPU는 별도 지원 | DRAM/file 공간·시간 tile, 비동기 staging, 재료·밀도 직접 생성, 기존 54 GiB 복소 FP64 짧은 용량 검증 | 차별 기능. 실제 FP32 48 GB 초과 작업·장시간·회복·전체 메모리 계측이 남음 |
| 비균일 mesh | Uniform/QuasiUniform/Rectilinear | Graded/rectilinear, 독립 dx/dy/dz, node API/UI | 기능 동등 범주. 같은 오차에서 속도·메모리 우위는 별도 측정 |
| 분산 재료 | ADE. 경로별 제한 확인 필요 | 다중 Drude/Lorentz·passive fit·resident/streamed ADE adjoint | 지원 모델 범위의 동등 후보. 이방성 ADE·응용 정확도·외부 실측은 남음 |
| GDS | Layer stack, explicit port contracts | Layer/datatype·Z·재료 stack, 단위·계층·array·PATH, 제한 export, 명시적 full-cell TEXT 두 port→실제 ModeNetwork·native 재료 샘플링·S/VJP | 기본 geometry와 제한 port 연결 구현. 좁은 aperture·일반 hole/branch·자동 포트 추론은 남음 |
| 단일 문제 multi-GPU | Sharding | 별도 periodic/Bloch 초기값 API의 rank-owned slab·halo transpose·재료 VJP·binomial checkpoint. 실제 Linux 2/3-process Gloo CPU 검사 통과 | **부분/GPU 미검증**. 실제 NCCL·2장 이상 GPU, source/monitor·물리 경계·scaling 검증 필요 |
| 자동미분 범위 | JAX reversible/checkpointed, 물리·source별 계약 확인 필요 | 유전체·고정 Bloch·CPML·ADE·PEC·고정 검출면·밀도·일부 CAD. 별도 lossless periodic 및 fixed-exterior CPML reversible API, 고정 Bloch·FP32 scalar/diagonal·비동기 CPU trace·online plane 관측, 고정 모드와 radiation 목적함수 | **부분**. PMC/tensor의 추가 물리·실행 경로, 일반 source/eigenmode·동시 adjoint batch 확대 필요 |
| 설계 파라미터화 | Density, projection/binarization, symmetry | Trainable logits/density, 물리 길이 filter, 정확한 mask·대칭, beta continuation, 명시적 STE, optimizer 재시작, 실제 streamed 목적함수 | 기본 topology workflow 구현. 일반 spline/polygon shape derivative·제작 제약·최종 CR 물리 수렴은 별도 |
| Mode source·detector·port | 고정 mode source/detector, overlap/S-parameter. 고유모드 재료·좌표의 미분은 중단 | 전벡터 sparse mode solver, 실제 CUDA 주입, directional detector, 서로 마주보는 두 port의 multimode 복소 S 행렬·interior material VJP | **부분**. 서로 다른 고정 exterior 단면과 입사 포트별 calibration을 지원하며 추가 CPU 물리 검증을 기록. 일반 branch·open/PML 횡단면·streamed injection·일반 물리 수렴·UI가 남음. 고유모드 자체 미분은 별도 연구 목표 |
| Far-field·회절 | Field projection, diffraction detectors | Closed-box 벡터 원거리장, Bloch 회절 차수·방향별 효율, field graph와 재료 VJP, FP32 방사 패턴 수렴. 저장 결과/NPZ adapter와 실제 회절 browser workflow | 기본 homogeneous exterior 기능과 회절 UI 구현. substrate/periodic lattice far-field·일반 응용·closed-box UI는 남음 |
| 이방성 | 대각·일반 tensor | Node-sampled SPD bulk tensor, periodic/Bloch CPU·CUDA와 고정 등방성 CPML 외부, 이산 transpose·6성분 VJP·checkpoint·고유파 검증. Native 재료 편집·Project/CLI·고정 geometry 재료표 미분 연결 | **부분**. 일반 anisotropic CPML·반사/장시간 안정성·interface·tensor ADE·streaming·mode 확대가 남음 |
| 경계 | PML, Bloch/periodic, PEC/PMC 및 symmetry reduction | CPML, periodic/Bloch, PEC/electric antisymmetry. Closed PMC native Project·CLI·browser·endpoint NPZ. 별도 uniform PMC+CPML CPU/CUDA API와 보조 상태·재료·파형 adjoint, 전체/절반 영역 일치와 checkpoint 절반 절감 | **부분**. 제한된 공통 PML profile의 혼합 경계를 Project·CLI·browser에 연결. 일반 profile·흡수 정확도·속도, ADE·streaming·tensor batch 확대가 남음 |

## 이번 구현의 근거

- [GDS](GDS.md): 독립 합성 fixture의 단위·계층·반사·회전·배열·PATH,
  port metadata, native 재료 샘플링과 실제 계산, geometry export/reimport.
  별도 [명시적 mode 연결](GDS_MODE_PORTS.md)은 full-cell TEXT 두 port와
  실제 imported slab 재료로 CPU S 행렬과 내부 재료 VJP를 연결했다.
  일반 waveguide 폭의 포트나 자동 공정 추론을 지원한다는 뜻은 아니다.
- [설계 파라미터화](DESIGN_PARAMETERIZATION.md): 2D 설계 입력에서 실제
  streamed FDTD 목적함수·gradient·optimizer update. 고정 영역, 대칭과 재시작.
- [모드 주입](MODE_INJECTION.md): FP32 native CUDA 5개 실제 전파 사례.
  slab guide 최대 복소 전파 오차 2.24e-5, 역방향 전력 2.14e-7,
  국소 산란체 transmission gradient와 유한차분 상대오차 9.14e-4.
- [마주보는 다중 모드 port](MODE_NETWORK.md): 실제 FP32 CUDA의 4-channel
  S 행렬 최대 복소 오차 2.96e-6, 두 채널 산란체 상반성 오차 8.43e-8,
  복소 S 목적함수 gradient의 유한차분 상대오차 6.82e-5.
  거친 메시의 무손실 전력 합 오차 0.7403%도 기록하며 물리 수렴과 구분한다.
  물리 크기·시간·PML 두께를 유지한 200→100 nm 후속에서는 전력 결함이
  0.000465%로 줄었다. 복소 S 값의 변화는 여전히 커서 전체 수렴 통과는 아니다.
  독립 박막 해석해와 비교한 후속 200→100→50 nm의 최대 복소 S 절대오차는
  0.80149→0.17586→0.04258이다. 독립 Yee 점화식과의 오차는 100/50 nm에서
  1.63e-5/1.02e-6으로, 격자 분산과 반 셀 계면 이동을 확인했다.
  일반 도파로·형상 gradient의 수렴 완료로 확대하지 않는다.
  같은 박막 목적함수에서 coarse native gradient는 -0.20350인 반면 연속계
  해석 기준은 +0.25372로 부호가 반대다. 독립 이산 기준은 100/50 nm에서
  +0.17989/+0.23724로 접근한다. 후속 native VJP는 +0.179893/+0.237240으로
  이산 기준과 상대오차 0.00181%/0.000124%, 연속계와 같은 부호를 확인했다.
  가장 세밀한 메시에도 연속계 gradient 크기 오차 6.50%는 남는다.
  같은 격자의 finite difference 통과를 물리적 설계 방향 검증으로 대체하지 않는다.
  별도 [25 nm 후속](MODE_NETWORK_GRADIENT_ACCEPTANCE.md)은 사전 선언한
  2% 기준을 통과했다. Native gradient +0.249719의 연속계 오차는 1.58%이며,
  epsilon을 0.001 줄인 실제 forward와 해석 기준 모두 목적함수가 감소했다.
  앞선 메시의 오차를 보존하며 CR·일반 형상 미분의 완료로 확대하지 않는다.
- [원거리장·회절](RADIATION.md): 해석 vector dipole의 복소 진폭과 전력,
  Bloch 차수·방향 분리, FP32 normalization, 실제 material VJP.
  native dipole 방사 패턴의 100→75→50 nm 메시 오차는 1.03→0.54→0.23%다.
  [저장 결과 회절 workflow](RADIATION_WORKFLOW.md)는 실제 native 6-field plane을
  browser와 NPZ/Python에서 계산한다. 참조 정규화, 비전파 차수, cutoff와
  외부 매질 조건을 구분하고 기존 필드로 계산해 FDTD를 다시 실행하지 않는다.

- [FDTDX 동일 조건 정확도 gate](FDTDX_MATCHED_CORRECTNESS.md): 같은 Linux·RTX 3060에서
  16³, 64-step FP32 periodic 소스 문제의 두 Ex history, 목적함수와 한 재료
  파라미터 VJP가 일치했다. 독립 Fourier·유한차분도 확인했다. 작은 비교 계약의
  검증이며 속도, 대규모 용량, 전체 물리 동등성의 근거로 확대하지 않는다.

- [전체 재료 gradient 비교](FDTDX_MATCHED_FULL_GRADIENT.md): 동일 frozen 버전의
  64³, 512-step periodic 문제에서 전체 epsilon VJP의 상대 L2 차이는 1.06e-6,
  최대 절대 차이는 8.38e-13이며 두 history는 동일하다. 고정 source의 zero
  cotangent, slab contraction과 독립 방향 유한차분도 통과했다. 속도 비교와
  다른 물리 조합의 동등성을 의미하지 않는다.

- [PMC resident API](PMC_IMPLEMENTATION_PLAN.md): 실제 endpoint의 소스·관측과
  FP32 CUDA·재료/파형 gradient, 10,000-step logical binomial schedule.
  Native Project·CLI·browser의 closed-cavity 실행과 exact endpoint NPZ,
  여섯 경계의 원자적 편집·오류 시 원본 보존을 추가했다.
  별도 uniform PMC+CPML API는 CPU 독립 점화식·보조 상태 transpose와 CUDA
  필드·재료·파형 VJP가 일치했다. 240-step 전체/대칭 절반 영역의 대응 E/H
  차이는 0, 완전 checkpoint는 37,088→18,544 bytes였다. 이 작은 사례의
  메모리 비율을 대규모 속도나 일반 흡수 정확도로 확대하지 않는다.
  [혼합 경계 native workflow](PMC_NATIVE_CPML.md)는 공통 PML 깊이·세기,
  명시적 cubic profile과 균일 등간격 격자에서 Python·CLI·browser를 연결한다.
  지원하지 않는 PML 값은 거부하며 실제 보조 상태와 적용 profile을 결과에 기록한다.
  [제한된 흡수 gate](PMC_CPML_ABSORPTION.md)는 direct endpoint API의 정상입사
  CPU 사례에서 반사장 1%·반사 flux 0.1% 기준을 통과했다. 두 셀 횡단면의
  직접 API 검사이며 native Project나 일반 흡수 수렴 검증으로 확대하지 않는다.
- [Bulk tensor API](ANISOTROPY_IMPLEMENTATION_PLAN.md): periodic/Bloch
  CPU/CUDA, 6성분 유한차분, 독립 Fourier symbol·에너지·mesh dispersion.
  고정 등방성 CPML/collar 안의 tensor에 비주기 정규화 연산자와 전체
  CPML 상태 transpose를 연결했다. CPU 독립 autograd와 FP32 CUDA 실수·복소
  VJP가 일치한다. Eigenvalue 검사의 CUDA batch workspace도 제한했다.
  [회전 이방성 박막](TENSOR_CPML_SLAB_ACCEPTANCE.md)의 독립 연속계 기준
  복소 투과 오차는 1.0088%→0.2421%, coarse 회전각 VJP 오차는 1.5077%다.
  고정 등방성 외부의 정상입사 사례로 CPML 반사·장시간 안정성과 구분한다.
- [단일 도메인 분할](DOMAIN_DECOMPOSITION.md): 동일 도메인의 rank-local
  E/H·epsilon, halo transpose와 material VJP. Linux CI의 실제 2/3-process
  Gloo 경로에서 fields·초기 상태/재료 VJP·halo·local finite difference를
  확인했다. CPU runtime 검증과 실제 multi-GPU 성능 검증은 구분한다.

- [Periodic reversible API](REVERSIBLE_ADJOINT.md): 한 terminal E/H pair에서
  역순 복원하며 checkpoint replay 없이 재료 VJP를 계산한다. 64³·512-step
  CUDA의 checkpoint 기준 전체 gradient 상대 L2 차이는 4.91e-7이며,
  메모리 사전 검사·retained backward·드리프트 거부와 해제를 검증했다.
  일반 경계 조합·장시간 정확도·외부 solver 대비 속도 우위는 아직 확립하지 않았다.
- [Recorded CPML API](REVERSIBLE_CPML.md): periodic/Bloch x/y와 z CPML에서
  lossless 내부만 복원하고 전체 CPML adjoint를 유지한다. FP32 scalar/diagonal
  재료, 실수/complex64 장, 별도 고정 외부 입력과 내부 재료 VJP를 지원한다.
  CPU 2,048-step과 CUDA 96-step device/CPU trace baseline 검증을 보존한다.
  [확장 public workflow](validation/reversible_cpml_extended_workflow.json)는
  2-slot pinned CPU 비동기 trace, z soft plane source와 online 6-field plane을
  검증했다. CUDA point 48-step의 history·동기 archive는 정확히 일치하며
  gradient 상대 L2 차이는 복소 1.52e-7, 실수 2.90e-7 이하, 두 retained seed는
  최대 5.81e-7이다. CUDA plane 32-step의 실수/복소 diagonal spectrum도
  정확히 일치하며 gradient·seed 상대 L2 차이는 최대 3.11e-7·3.02e-7이다.
  관측 seed는 B=7, M=924의 block으로 재생성하며 T*M 이력을 보관하지 않는다.
  경계 archive는 여전히 O(T*횡단면)이다. 일반 CPML·ADE·SSD·48GB 초과나
  FDTDX 대비 성능·전체 동등성의 근거로 확대하지 않는다.

## 다음 구현 순서

1. 진행 중인 원래 CR 24-cycle 결과와 실제 FP32 48 GB 초과 용량 검증을
   보존하며 완료한다. 최적 CR 후보의 세밀한 메시 재검증은 별도 단계다.
2. CPU·CUDA·브라우저에서 확인한 PMC+CPML native dispatch의 흡수 정확도를 검증한 뒤,
   필요한 profile·ADE·streaming·batch 조합으로 확장한다.
   이미 통과한 경로는 변경 없이 반복하지 않는다.
3. [일반 이방성 tensor 계획](ANISOTROPY_IMPLEMENTATION_PLAN.md)의 고정 등방성
   CPML 외부에서 반사·안정성 및 계면을 검증하고 streaming으로 확장한다.
   6성분 재료 편집·Project/CLI·재료표 미분 연결은 완료했다.
4. Mode port의 일반 단면/branch와 streamed 경로, source parameter
   미분을 확장한다. GDS port metadata와 실제 실행 흐름도 연결한다.
5. 단일 문제 multi-GPU의 물리 범위를 확장하고 실제 여러 장치에서 통신·peak memory·
   strong/weak scaling·gradient를 검증한다. 장치가 한 장뿐인 검사는
   multi-GPU 완료 근거로 대체하지 않는다.
6. 같은 물리의 FDTDX checkpointed/reversible 두 경로를 구분해 속도와 메모리를
   비교한다. 현재 정확도 gate만 완료했으며 전체 속도 우위는 확립되지 않았다.
   필요한 UI, Python 예제·문서, 동일 정확도의 FDTDX benchmark와 공개
   패키지 검토를 마친다. 공개 전환과 홍보는 사용자 승인 후 진행한다.

기본 기능이 추가되더라도 모든 열을 O로 바꾸지 않는다. 완료는 위에서
정의한 지원 범위와 수치 근거에 따라 갱신한다.

공식 비교 출처: [FDTDX simulation/grid 설정](https://fdtdx.readthedocs.io/en/latest/api/fdtdx.SimulationConfig.html),
[GDS layer stack](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/objects/static_material/gds_layer_stack.py),
[field projection](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/objects/detectors/field_projection.py),
[diffraction](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/objects/detectors/diffractive.py),
[anisotropic example](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/examples/simulate_gaussian_source_fully_anisotropic.py).
