# 현재 지원 범위

현재는 0.9 개발 버전입니다. Lumerical 전체 기능을 완성한 상태가 아닙니다.
[1,656개 체크리스트](FEATURE_CHECKLIST.md)에서 엔진·Python·UI·FSP를 따로 확인합니다.
구현 72, 부분 208, 미구현/미검증 1,376은 속성 수이며 제품 완성도 비율이 아닙니다.

| 기능 | 현재 범위 |
| --- | --- |
| Python만으로 사용 | native 설정 Project, 실행 Simulation, 전체 결과 Result |
| UI | 구조물 트리, 2D/3D CAD, 속성·재료·메시 편집, 결과, Python export |
| 계산 | 2D/3D Yee, CPU/CUDA, float32/64, CUDA Graph |
| 전용 CUDA kernel | 선택형 fused Yee/CPML. 실수장·periodic·graded·기존 ADE/DFT. Bloch는 torch 경로 |
| 메시 | Uniform/Graded, 자동·수동 refinement, node preview |
| 경계 | 면별 CPML, Periodic/Bloch |
| 재료 | 상수 n, 수동 등방 단일 Drude/Lorentz |
| 소스 | 전기 point/양방향 sheet, 시간·global 설정. Legacy 자동 pulse 출처 검토 중 |
| 모니터 | 점 time/DFT, 평면 6성분 DFT·flux, global/custom/Chebyshev |
| 반사·투과 | 동일 air reference 정규화. 반사는 complex E/H incident subtraction |
| batch | 독립 process, 메모리 제한, 오류/중단, checksum resume |
| inverse design | Python 목적함수, 병렬 차분진화, seed·기록. Adjoint 미구현 |
| 파일 | JSON, NPZ, CSV, 제한적 FSP layout. FSP 공개 배포 검토 미해결 |

Lumerical 계산 결과는 사용하지 않습니다. 기존 자료는 공개 배포 경로에서
제외했습니다. 현재 근거는 자체 CPU/GPU 계산 및 해석해입니다.

RTX 5880의 native 구 구조물 4개(각 64³, 800 step)는 NumPy CPU 47.04초,
CUDA 1 worker 1.175초로 약 40배 차이였습니다. 2/4 workers는 1.182/1.204초라
추가 병렬화 이득이 없었습니다. [조건과 원자료](validation/BATCH_REPORT.md).

박막 해석해 대비 최대 R/T 절대 오차는 약 0.00154, R+T 잔차는 4.44e-6입니다.
이는 모든 구조·재료의 정확도 보장이 아닙니다. [Python 사용법](PYTHON_BATCH.md),
[남은 요구사항](PARITY_ROADMAP.md), [배포 검토](RELEASE_REVIEW.md)를 참고하세요.
