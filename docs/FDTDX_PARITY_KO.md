# FDTDX 동등성 확보를 위한 완료 기준

기능 행마다 실제 실행, 물리 정확도, 미분 범위, Python/UI 노출과 증거를
분리한다. 이 표를 모두 통과하기 전에는 FDTDX 대체 완료나 전체 우위를
선언하지 않는다. 특정 구현의 존재와 같은 조건에서의 성능 우위는 다르다.

비교 기준은 2026-09-21 재확인한 FDTDX
[`60c1c2712da8bb0ccaa55c77846217932bb665a2`](https://github.com/ymahlau/fdtdx/tree/60c1c2712da8bb0ccaa55c77846217932bb665a2)다.
공식 코드와 문서의 지원 범위이며 같은 GPU에서 측정한 성능표가 아니다.
FDTDX는 이미 rectilinear mesh를 제공한다. `vmap 가능`만으로 batch 처리량을,
`자동미분`이라는 설명만으로 모든 설정과 고유모드의 미분을 가정하지 않는다.

| 항목 | FDTDX 확인 범위 | TorchFDTD 현재 검증 범위 | 동등성·우위 판단과 남은 완료 조건 |
|---|---|---|---|
| Browser CAD·결과 | 대응하는 공식 browser CAD workflow는 확인되지 않음 | Tree, 여러 CAD view, 속성, 결과, Python export | 사용성 차별점. 새 물리 기능의 UI와 전체 작업 흐름 검증은 계속 필요 |
| 독립 FSP 읽기/쓰기 | 공식 대응 기능 확인되지 않음 | 문서화한 layout subset, 독립 import/writeback | 제한 범위의 상호운용성 차별점. 전체 FSP 호환 아님 |
| 같은 GPU batch | JAX composition 가능. 동일 workload 미측정 | CUDA tensor batch·cohort grouping·선택, 32³ B=16의 자체 순차 대비 2.40배 | FDTDX 대비 속도 우위 미확인. 동일 물리·출력·준비비용을 포함한 batch/adjoint 측정 필요 |
| VRAM 초과 streaming | 공개 JAX 경로에서 단일 GPU CPU/disk 공간 streaming 확인되지 않음. multi-GPU는 별도 지원 | DRAM/file 공간·시간 tile, 비동기 staging, 재료·밀도 직접 생성, 기존 54 GiB 복소 FP64 짧은 용량 검증 | 차별 기능. 실제 FP32 48 GB 초과 작업·장시간·회복·전체 메모리 계측이 남음 |
| 비균일 mesh | Uniform/QuasiUniform/Rectilinear | Graded/rectilinear, 독립 dx/dy/dz, node API/UI | 기능 동등 범주. 같은 오차에서 속도·메모리 우위는 별도 측정 |
| 분산 재료 | ADE. 경로별 제한 확인 필요 | 다중 Drude/Lorentz·passive fit·resident/streamed ADE adjoint | 지원 모델 범위의 동등 후보. 이방성 ADE·응용 정확도·외부 실측은 남음 |
| GDS | Layer stack, explicit port contracts | Layer/datatype·Z·재료 stack, 단위·계층·array·PATH, 제한 export, 명시적 TEXT port metadata | 기본 geometry workflow 구현. 자동 GDS port→실행 모드 연결과 일반 hole/다중 port 흐름은 남음 |
| 단일 문제 multi-GPU | Sharding | 독립 case 여러 장치 배정만 존재 | **미달**. 단일 도메인 halo 교환·transpose·분산 checkpoint·실제 2장 이상 검증 필요 |
| 자동미분 범위 | JAX reversible/checkpointed, 물리·source별 계약 확인 필요 | 유전체·고정 Bloch·CPML·ADE·PEC·고정 검출면·밀도·일부 CAD. 새 고정 모드와 radiation 목적함수 | **부분**. PMC runtime·full tensor·source/eigenmode·관련 모든 실행 경로, 동시 adjoint batch 확대 필요 |
| 설계 파라미터화 | Density, projection/binarization, symmetry | Trainable logits/density, 물리 길이 filter, 정확한 mask·대칭, beta continuation, 명시적 STE, optimizer 재시작, 실제 streamed 목적함수 | 기본 topology workflow 구현. 일반 spline/polygon shape derivative·제작 제약·최종 CR 물리 수렴은 별도 |
| Mode source·detector·port | Mode source/detector, overlap/S-parameter | 전벡터 sparse mode solver, 이산 시간·공간 보정 실제 주입, directional detector, 단일 선택 channel의 복소 t/r·material VJP | **부분**. 자동 multiport/multimode S 행렬·open/PML 횡단면·streamed injection·모드 미분·UI가 남음 |
| Far-field·회절 | Field projection, diffraction detectors | Closed-box 벡터 원거리장, Bloch 회절 차수·방향별 효율, field graph와 재료 VJP, FP32 방사 패턴 수렴 | 기본 homogeneous exterior 기능 구현. substrate/periodic lattice far-field·일반 응용·UI는 남음 |
| 이방성 | 대각·일반 tensor | Adjoint API의 Yee diagonal epsilon. Native material UI는 등방성, subpixel 전용 연산자는 별도 | **부분/미달**. 일반 물리 tensor rasterization·안정성·forward/transpose·ADE·UI를 일관되게 연결해야 함 |
| 경계 | PML, Bloch/periodic, PEC/PMC 및 symmetry reduction | CPML, periodic/Bloch, PEC/electric antisymmetry. PMC 추가 endpoint 상태와 CPU/CUDA 연산자 검증 | **부분**. PMC를 source/monitor/ADE/checkpoint/streaming에 연결하고 실제 domain reduction을 검증해야 함 |

## 이번 구현의 근거

- [GDS](GDS.md): 독립 합성 fixture의 단위·계층·반사·회전·배열·PATH,
  port metadata, native 재료 샘플링과 실제 계산, geometry export/reimport.
- [설계 파라미터화](DESIGN_PARAMETERIZATION.md): 2D 설계 입력에서 실제
  streamed FDTD 목적함수·gradient·optimizer update. 고정 영역, 대칭과 재시작.
- [모드 주입](MODE_INJECTION.md): FP32 native CUDA 5개 실제 전파 사례.
  slab guide 최대 복소 전파 오차 2.24e-5, 역방향 전력 2.14e-7,
  국소 산란체 transmission gradient와 유한차분 상대오차 9.14e-4.
- [원거리장·회절](RADIATION.md): 해석 vector dipole의 복소 진폭과 전력,
  Bloch 차수·방향 분리, FP32 normalization, 실제 material VJP.
  native dipole 방사 패턴의 100→75→50 nm 메시 오차는 1.03→0.54→0.23%다.

## 다음 구현 순서

1. 진행 중인 원래 CR 24-cycle 결과와 실제 FP32 48 GB 초과 용량 검증을
   보존하며 완료한다. 최적 CR 후보의 세밀한 메시 재검증은 별도 단계다.
2. PMC endpoint 상태를 production source/monitor/checkpoint/streaming에
   연결한다. 이미 통과한 operator 검사를 반복하는 대신 새 연결만 검증한다.
3. [일반 이방성 tensor 계획](ANISOTROPY_IMPLEMENTATION_PLAN.md)에 따라
   정확한 이산 transpose를 구현하고 안정성·회전
   매질·해석 고유파·gradient 검사를 통과시킨다.
4. Mode port의 여러 channel/S 행렬과 streamed 경로, source parameter
   미분을 확장한다. GDS port metadata와 실제 실행 흐름도 연결한다.
5. 단일 문제 multi-GPU를 구현하고 실제 여러 장치에서 통신·peak memory·
   strong/weak scaling·gradient를 검증한다. 장치가 한 장뿐인 검사는
   multi-GPU 완료 근거로 대체하지 않는다.
6. 필요한 UI, Python 예제·문서, 동일 정확도의 FDTDX benchmark와 공개
   패키지 검토를 마친다. 공개 전환과 홍보는 사용자 승인 후 진행한다.

기본 기능이 추가되더라도 모든 열을 O로 바꾸지 않는다. 완료는 위에서
정의한 지원 범위와 수치 근거에 따라 갱신한다.

공식 비교 출처: [FDTDX simulation/grid 설정](https://fdtdx.readthedocs.io/en/latest/api/fdtdx.SimulationConfig.html),
[GDS layer stack](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/objects/static_material/gds_layer_stack.py),
[field projection](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/objects/detectors/field_projection.py),
[diffraction](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/src/fdtdx/objects/detectors/diffractive.py),
[anisotropic example](https://github.com/ymahlau/fdtdx/blob/60c1c2712da8bb0ccaa55c77846217932bb665a2/examples/simulate_gaussian_source_fully_anisotropic.py).
