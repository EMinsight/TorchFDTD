# 실행 제어, 다중 공진 재료와 메시 수렴

이 기능은 Python 프로젝트 모델에 저장되며 JSON 저장, Python export, NPZ 결과에 함께 남는다. 수치 검증에는 자체 계산과 해석해만 사용한다.

## 자동 종료와 발산 감지

```python
from torchfdtd import Project, Simulation, RunControl

project = Project.load("project.json")
project.region.steps = 4000  # 최대 step 수
project.region.run_control = RunControl(
    auto_shutoff=True,
    decay_threshold=1e-6,
    check_interval=50,
    consecutive_checks=3,
    min_steps=100,
    source_tail_amplitude=1e-8,
    after_source_s=0,
    divergence_check=True,
    growth_limit=1e6,
    field_limit=None,
)
result = Simulation(project).run()
print(result.summary["termination_reason"])
print(result.summary["steps"], result.summary["requested_steps"])
result.save("result.npz")
```

자동 종료는 기본적으로 꺼져 있다. 발산 검사는 기본적으로 50 step마다 실행한다. UI의 Simulation → **Termination and diagnostics**에서 같은 항목을 편집한다.

종료 원인은 `max_steps`, `decayed`, `cancelled`로 구분한다. `decayed`는 정상 완료이며 batch 목적함수도 평가한다. trace와 시간 배열은 실제 완료된 step까지만 반환하고 자동 종료 직전의 snapshot도 저장한다. 발산은 예외이며 batch에서는 failed로 처리한다.

진단값은 셀 부피를 가중한 E/H 및 수동 oscillator 저장 상태의 양의 norm이다. 단일 E 성분의 영점이나 한 화면 단면만 검사하지 않는다. 재료 항에는 `(|Q/dt|² + omega_0² |P|²) / A`를 포함한다. CPML의 non-finite 상태도 확인한다. 이 값은 SI 에너지나 엄밀한 이산 보존량이 아니며 DFT 오차의 상한도 아니다.

모든 유한 소스의 envelope가 끝나야 종료 검사를 시작한다. Gaussian은 지정한 tail amplitude까지 기다리고 sampled source는 표의 마지막 시간까지 기다린다. 뒤늦게 켜지는 소스와 sampled source의 중간 무신호 구간을 건너뛰지 않는다. 연속파 소스가 켜져 있으면 decay 종료는 작동하지 않는다. `after_source_s`와 `min_steps`는 추가 대기 조건이다.

소스 종료 전 최대 norm을 기준으로 연속된 저하를 확인한다. 발산의 상대 성장 한도는 종료 이후에 고정한 기준에 적용한다. 구동 중에는 source가 에너지를 공급하므로 임의의 상대 성장만으로 발산이라고 판단하지 않는다. 필요하면 reduced field 단위의 `field_limit`을 지정한다.

CuPy가 설치된 CUDA 환경에서는 두 개의 읽기 전용 reduction kernel을 사용한다. float32/64, 복소장, graded volume과 multipole 상태를 처리하며 제곱과 합산 전에 double로 승격한다. 전체 장의 double 복사본을 만들지 않는다. `diagnostic_backend`가 실제 경로를 알려준다. `diagnostic_seconds`는 진단 호출에서 보낸 **host 경과 시간**이며 앞서 queue에 넣은 GPU step을 기다린 시간도 포함한다. 순수한 진단 kernel 시간이나 추가 오버헤드로 해석하면 안 된다. 오버헤드는 같은 고정 길이를 진단 on/off로 비교해 측정한다.

적분값이 0이 아닌 전류형 soft dipole은 정전기 잔류장을 남길 수 있다. 이때 엄격한 임계값에서 자동 종료하지 않는 것이 정상이며 최대 step에서 끝난다. [Meep의 소스 설명](https://meep.readthedocs.io/en/master/Python_User_Interface/)도 dipole moment와 전류의 적분 관계를 구분한다. native 검증은 원래 Gaussian의 잔류 사례와, 유한 dipole pulse의 이산 차분으로 만든 적분값 0의 sampled current 사례를 모두 기록한다. 기존 소스 정의나 종료 threshold를 몰래 바꾸지 않는다. [측정 결과](validation/RUN_CONTROL_REPORT.md).

고-Q 공진이나 약한 신호는 더 엄격한 threshold와 더 긴 시간으로 확인해야 한다. 서로 다른 step 수로 자동 종료한 sample/reference는 정규화 서명이 일치하지 않는다. R/T 비교에는 같은 고정 시간을 쓰거나 실제 종료 step으로 두 계산을 맞춰 다시 실행한다. 자동 종료만으로 스펙트럼 수렴을 증명하지 않는다. 시간 길이가 Fourier 수렴에 미치는 영향은 [Meep FAQ](https://meep.readthedocs.io/en/latest/FAQ/)에서도 설명한다.

## 수동 다중 공진 재료

```python
from torchfdtd import Material, LorentzPole

material = Material(
    name="Passive multi-pole example", model="multipole", epsilon_inf=2,
    poles=[
        LorentzPole(resonance_rad_s=0, strength_rad_s_squared=1e30,
                    damping_rad_s=6e14),
        LorentzPole(resonance_rad_s=2e15, strength_rad_s_squared=4e30,
                    damping_rad_s=4e14),
    ],
)
project.materials.append(material)
```

주파수 응답은 `epsilon_inf + sum(A_j / (omega_j² - omega² - i gamma_j omega))`이다. `resonance_rad_s=0`이면 Drude 항이다. 모든 A는 양수, damping은 0 이상이며 최대 16개 pole을 지원한다. 모든 주파수 파라미터는 angular SI 단위다. Lorentz 기존 입력의 `linewidth_rad_s`는 damping의 절반이며, 새 pole의 `damping_rad_s`는 식의 gamma 자체다.

공통 전기장을 먼저 함께 구한 뒤 각 P/Q 상태를 갱신한다. pole별 보정을 E에 순서대로 적용하는 방식이 아니다. 기존 단일 pole 계산 순서와 수치를 유지한다. CPU/CUDA, real/Bloch complex, graph/eager와 실수 fused kernel 경로에서 같은 sparse ADE를 사용한다. 메모리 추정은 pole 개수를 반영한다.

UI에서는 Materials → **Multiple Drude / Lorentz poles**에서 추가·삭제·편집하고 n/k 및 timestep에 따른 ADE 응답을 확인한다. 이는 사용자가 pole 계수를 입력하는 모델이다. 측정 n/k의 자동 passive fitting과 광학상수 DB는 아직 구현되지 않았다. 연속 감수율과 별개로 공간 이산화, 계면과 PML 안정성은 검증해야 한다. 일반적인 분산 감수율 표현은 [Meep Materials](https://meep.readthedocs.io/en/latest/Materials/)를 참고할 수 있다.

## 같은 물리적 조건의 메시 수렴

```python
from torchfdtd import mesh_convergence, normalize_flux

reference = project.model_copy(deep=True)
reference.structures = []

def transmission(sample, reference_result):
    values = normalize_flux(sample.field_monitor("transmission"),
                            reference_result.field_monitor("transmission"))
    if not values["valid"].all():
        raise ValueError("Reference signal is too weak")
    return {"transmission": values["ratio"]}

study = mesh_convergence(
    project, [.05, .025, .0125], transmission,
    reference_project=reference,
    rtol=0, atol=.006, consecutive=2,
    output_dir="results/convergence",
)
print(study.status)
```

실행 가능한 예제:

```bash
python -m examples.mesh_convergence --backend cpu
python -m examples.mesh_convergence --backend cuda
```

격자 간격을 줄이면서 같은 step 수를 사용하면 물리적 계산 시간이 짧아진다. 이 API는 원래의 `steps * dt`를 보존하도록 step 수를 다시 계산한다. 올림으로 생기는 차이는 한 timestep 미만이며 보고서에 실제 시간도 기록한다. 영역 크기와 PML 물리 두께가 각 간격의 정수 배가 아니면 명시적으로 거부한다. PML layer 수와 총 step 수의 기존 모델 한도도 그대로 적용된다.

기본은 uniform mesh다. `mesh_type="graded"`를 지정하면 같은 graded 알고리즘을 단계별로 평가한다. matched reference는 각 sample의 refinements를 동결하여 동일한 node 배열을 사용한다. source/monitor 정의도 사용자가 일치시켜야 하며 `normalize_flux`가 최종 서명을 검사한다. 자동 종료는 이 study에서 꺼져 있으므로 sample/reference의 시간 길이가 달라지지 않는다.

관측량은 유한한 실수 scalar, 배열 또는 이름별 mapping을 반환해야 한다. 단계마다 이름과 배열 shape가 같아야 한다. 마지막 연속 비교가 모두 `abs(a-b) <= atol + rtol * max(abs(a), abs(b))`를 만족해야 `converged`다. 취소와 잘못된 값은 성공으로 처리하지 않는다. 보고서는 각 grid, 실제 시간, 관측량, 변화량, 계산 비용과 summary를 포함한다. 선택형 출력 폴더에 sample/reference NPZ와 `convergence.json`을 저장한다.

같은 결과가 나온다는 사실만으로 해석해와의 오차가 증명되지는 않는다. 파장 표를 고정하고 정규화된 물리량을 선택해야 한다. 격자에 따라 물리적 dipole 강도가 달라질 수 있는 unnormalized point-source peak를 전송률처럼 해석하지 않는다. 자동 error estimator, conformal mesh나 전용 GUI study 실행은 아직 별도 작업이다.

`mesh_refinement_projects(project, meshes)`는 동일 조건의 프로젝트 목록만 만든다. 이를 `BatchCase`로 감싸 기존 `BatchRunner`에 넘기면 메모리 admission을 사용하는 독립 병렬 sweep으로 실행할 수 있다. `mesh_convergence`는 한 번에 한 단계의 sample/reference를 처리해 큰 최종 field 배열을 전부 메모리에 보관하지 않는다.
