"""Generate a traceable feature/property checklist from the installed API audit.

Mappings below are explicit human-reviewed semantic scopes. A matching label
does not prove equivalent physics. Unmapped properties stay unchecked.
"""
import json
from pathlib import Path
from collections import Counter
import csv
from photonweave.priorities import annotate_inventory

BASE='https://optics.ansys.com/hc/en-us/articles/'
REFERENCE=BASE+'360033154434-FDTD-product-reference-manual'
refs=dict(solver=BASE+'360034382534-FDTD-solver-Simulation-Object',
          mesh=BASE+'360034901833-Mesh-override-Simulation-Object',
          material=BASE+'360034394634-Standard-optical-permittivity-material-models-in-FDTD-and-MODE',
          field=BASE+'360034902393-Frequency-domain-monitor-Simulation-object',
          time=BASE+'360034902353-Field-time-monitor-Simulation-object',
          source=BASE+'360034382854-Plane-wave-and-beam-source-Simulation-object',
          mode=BASE+'360034902153-Mode-source-Simulation-object',
          advanced=BASE+'360034394734-Advanced-and-custom-optical-material-models-in-FDTD-and-MODE')
MAP={}
def mapping(commands,properties,native='partial',ui='partial',fsp='missing',scope='',evidence=()):
    for command in commands.split():
        for prop in properties.split('|'):
            MAP[command,prop.lower()]=dict(native=native,ui=ui,fsp=fsp,scope=scope,evidence=list(evidence))

structures='addrect addcircle addsphere addring'
mapping(structures,'name|enabled|x|y|z|material|mesh order','implemented','implemented','partial',
        '지원되는 primitive와 등방 재료. 겹침 우선순위 포함.',('photonweave/models.py','photonweave/solver.py','tests/test_solver.py'))
mapping('addrect','x span|y span|z span','implemented','implemented','partial','직육면체 크기.',('photonweave/models.py','tests/test_solver.py'))
mapping('addcircle addring','z span|radius','implemented','implemented','partial','원기둥/링의 z 높이와 원형 반경.',('photonweave/solver.py','tests/test_solver.py'))
mapping('addsphere','radius','implemented','implemented','partial','구의 단일 반경.',('photonweave/solver.py','tests/test_mesh.py'))
mapping('addring','inner radius|outer radius','implemented','implemented','partial','원형/타원형 전체 링과 polar-angle sector. 인식된 FSP layout의 import와 기존 형상 writeback.',('photonweave/geometry.py','tests/test_fsp_geometry_write.py'))
mapping(structures+' addpoly','rotation 1|rotation 2|rotation 3|first axis|second axis|third axis','implemented','implemented','partial',
        'Native right-handed fixed-world 3축 회전, legacy z 회전 후 1/2/3 순서. 인식된 FSP primitive 회전 import/writeback, legacy 네 번째 회전은 동등 XYZ로 보고. 그룹은 미지원.',
        ('photonweave/geometry.py','photonweave/session.py','tests/test_geometry.py','tests/frontend_geometry.test.js','tests/ui/geometry.spec.js'))
mapping('addcircle addsphere','make ellipsoid|radius 2|radius 3','implemented','implemented','partial',
        '회전 가능한 native 타원기둥/타원체. 인식된 FSP circle/sphere import와 기존 형상 writeback.',('photonweave/geometry.py','tests/test_fsp_geometry_write.py','tests/test_geometry.py'))
mapping('addring','make ellipsoid|outer radius 2|inner radius 2|theta start|theta stop','implemented','implemented','partial',
        'Local XY 실제 polar angle의 CCW sector. 인식된 FSP 타원/부분 링 import와 기존 형상 writeback.',('photonweave/geometry.py','tests/test_fsp_geometry_write.py','tests/ui/geometry.spec.js'))
mapping('addpoly','name|enabled|x|y|z|z span|vertices|material|mesh order','implemented','implemented','partial',
        '단일 simple contour 3–2048개 local XY 꼭짓점의 z extrusion. CW/CCW·concavity·3축 회전. 인식된 FSP global vertex/pivot import와 가변 vertex 수 writeback. 그룹은 미지원.',
        ('photonweave/geometry.py','photonweave/session.py','tests/test_geometry.py','tests/ui/geometry.spec.js'))
mapping('addpoly','rotation 1|rotation 2|rotation 3|first axis|second axis|third axis','implemented','implemented','partial',
        'Native 3축 회전과 인식된 FSP polygon pivot/transform import·writeback.',('photonweave/geometry.py','tests/test_fsp_geometry_write.py'))
mapping(structures,'index','partial','implemented','partial','상수 실수 굴절률, 등방·n≥1.',('photonweave/models.py','tests/test_materials.py'))
mapping('addfdtd','dimension|index|dt stability factor|simulation time','implemented','implemented','partial','2D XY/3D, 배경 실수 n, CFL. 시간은 현재 step 수로 지정.',('photonweave/models.py','tests/test_boundaries.py'))
mapping('addfdtd','use auto shutoff|auto shutoff min|auto shutoff max|use divergence checking|use early shutoff',
        'partial','implemented','missing','Native 전체 영역 E/H·수동 oscillator norm과 소스 종료 gate. 연속 검사, growth/field limit. 타 제품의 에너지 정의·기본값 동등성은 주장하지 않음.',
        ('photonweave/run_control.py','tests/test_run_control.py'))
mapping('addfdtd','dx|dy|dz','implemented','implemented','partial','독립 축별 간격과 보수적 rectangular CFL. Saved staircase FSP node import와 uniform target 간격·노드·PML bounds·CFL writeback. 재료 sampling 제한과 외부 remeshing 미검증.',('photonweave/mesh.py','tests/test_rectilinear.py','tests/test_fsp_mesh.py','tests/test_fsp_mesh_write.py'))
mapping('addfdtd','mesh type|grading factor|mesh cells per wavelength|min mesh step|mesh refinement','partial','implemented','partial','Uniform / 자체 graded와 Yee staircase. Vendor CMT·auto accuracy와 다름.',('photonweave/mesh.py','tests/test_mesh.py','docs/validation/MESH_REPORT.md'))
mapping('addfdtd','mesh cells x|mesh cells y|mesh cells z|dt','implemented','implemented','partial','실제 노드 배열에서 크기와 보수적 CFL 계산.',('photonweave/models.py','tests/test_mesh.py'))
mapping('addfdtd','x span|y span|z span','implemented','implemented','partial','영점 중심 native 전체 영역(PML 포함). 원본 origin을 보존하는 uniform target FSP span writeback. 외부 CAD 범위는 PML을 제외하고 기록.',('photonweave/models.py','tests/test_fsp_mesh_write.py'))
mapping('addfdtd','x min bc|x max bc|y min bc|y max bc|z min bc|z max bc','partial','implemented','partial','PML, Periodic, Bloch. 다른 BC는 미지원.',('photonweave/boundaries.py','tests/test_boundaries.py'))
mapping('addfdtd','pml layers|pml sigma|pml kappa|pml alpha|pml polynomial|pml alpha polynomial','partial','implemented','partial','면별 native CPML 파라미터. Lumerical profile 정의와 다름.',('photonweave/boundaries.py','docs/validation/BOUNDARY_REPORT.md'))
mapping('addfdtd','kx|ky|kz|bloch units','partial','implemented','missing','축별 Bloch phase(rad/period) 입력. Vendor 파수 변환 미지원.',('photonweave/boundaries.py','tests/test_boundaries.py'))
mapping('addmesh','name|enabled|x|y|z|x span|y span|z span','partial','implemented','missing','native refinement box. 축에 투영되어 공통 fine step 적용.',('photonweave/mesh.py','tests/test_mesh.py'))
mapping('addmesh','dx|dy|dz|based on a structure|buffer','partial','partial','missing','자동 bounds + 고정 2-cell padding. 영역별 간격·buffer 입력 미지원.',('photonweave/mesh.py',))
source_props='amplitude|phase|frequency|wavelength start|wavelength stop|frequency start|frequency stop|set frequency|set wavelength|set time domain|offset|pulselength|pulse type|eliminate discontinuities|optimize for short pulse|use global source settings|override global source settings'
mapping('adddipole',source_props,'partial','implemented','partial','E/H 벡터 soft dipole의 시간 정의. 절대 정규화와 DC 제거는 미지원. FSP는 검증된 electric 부분집합.',('photonweave/waveforms.py','tests/test_broadband.py','tests/test_vector_sources.py','docs/validation/SOURCE_REPORT.md'))
mapping('adddipole','name|enabled|x|y|z','implemented','implemented','partial','E/H point source. FSP는 electric 부분집합.',('photonweave/models.py','tests/test_solver.py','tests/test_vector_sources.py'))
mapping('adddipole','dipole type','partial','implemented','partial','Native reduced E/H soft excitation. 절대 dipole moment·power 보정은 미지원. FSP magnetic type code는 미검증.',('photonweave/solver.py','tests/test_vector_sources.py'))
mapping('adddipole','theta|phi','implemented','implemented','partial','theta: +z 기준 0–180도, phi: +x→+y. 각 Yee 성분에 signed unit-vector 가중치. FSP electric 방향은 매핑, magnetic type은 미검증.',('photonweave/models.py','photonweave/fsp_native.py','tests/test_vector_sources.py'))
mapping('addplane',source_props,'partial','implemented','partial','E/H soft sheet와 normal-incidence one-way. FSP는 3D normal-incidence subset. 보조 Yee line 지연·수치 분산 유지. Oblique/BFAST는 미지원.',('photonweave/solver.py','tests/test_fsp_paired_sources.py','tests/test_vector_sources.py'))
mapping('addplane','name|enabled|x|y|z|injection axis|direction','implemented','implemented','partial','Soft sheet 및 normal-incidence one-way plane의 좌표·축·방향. One-way는 full transverse periodic cell과 균질 주입 이웃 요구. FSP는 3D subset.',('photonweave/injection.py','photonweave/session.py','tests/test_fsp_paired_sources.py','tests/ui/oneway-sources.spec.js'))
mapping('addplane','plane wave type','partial','implemented','missing','Soft sheet / discrete normal-incidence one-way 선택. Oblique/BFAST·mode는 미지원. 별도 TFSF box는 native Source kind로 제공.',('photonweave/injection.py','tests/test_oneway_sources.py'))
mapping('addtfsf',source_props,'partial','implemented','partial','Normal-incidence closed TFSF box의 보조 Yee line drive. FSP는 3D subset. 시간 정의·incident delay·수치 분산 유지. 절대 incident power 보정은 미지원.',('photonweave/tfsf.py','tests/test_fsp_paired_sources.py'))
mapping('addtfsf','name|enabled|x|y|z|x span|y span|z span|injection axis|direction','implemented','implemented','partial','2D/3D closed TFSF box, 활성 Cartesian 축·양 방향. 균질 비분산 shell과 외부 PML 필요. Python/SI facade/UI, CPU/CUDA tensor. FSP는 3D subset, oblique는 미지원.',('photonweave/tfsf.py','photonweave/session.py','tests/test_fsp_paired_sources.py','tests/ui/tfsf-sources.spec.js'))
mapping('addtime','name|enabled|x|y|z','implemented','implemented','partial','점 time monitor.',('photonweave/models.py','tests/test_spectra.py'))
mapping('addtime','monitor type|output Ex|output Ey|output Ez|output Hx|output Hy|output Hz','partial','implemented','partial','점에서 한 성분 선택. 분포 time trace는 미지원.',('photonweave/solver.py','tests/test_spectra.py'))
spectral='frequency points|minimum wavelength|maximum wavelength|minimum frequency|maximum frequency|use wavelength spacing|sample spacing|custom frequency samples|apodization|apodization center|apodization time width|override global monitor settings'
mapping('addpower addprofile',spectral,'partial','implemented','partial','점/평면 DFT. Uniform/Chebyshev roots·Lobatto/custom, 전역 주파수와 독립 로컬 apodization. FSP subset, normalization·sample phase 차이 보고.',('photonweave/spectra.py','tests/test_fsp_monitors.py','tests/test_monitor_outputs.py'))
mapping('addpower addprofile','name|enabled|x|y|z|x span|y span|z span|monitor type|spatial interpolation|down sample X|down sample Y|down sample Z|output Ex|output Ey|output Ez|output Hx|output Hy|output Hz|output Px|output Py|output Pz|output power','partial','implemented','partial','축 정렬 plane/2D line, 선택 E/H/P·signed flux, 축별 stride와 nearest normal/지정 plane 보간. FSP plane subset. Uncollocated·volume는 미지원, native quadrature 차이 보고.',('photonweave/field_monitors.py','tests/test_fsp_monitors.py','tests/test_monitor_outputs.py','tests/ui/monitor-outputs.spec.js'))
mapping('addpower addprofile','use source limits|down sample time|high precision','partial','implemented','partial','명시적 source band의 동적 범위, DFT temporal stride와 Nyquist 검사, 선택형 complex128 누적. 공간 gather/window는 장 정밀도 유지. FSP saved stride·precision subset.',('photonweave/models.py','tests/test_monitor_outputs.py','tests/test_fsp_monitors.py'))
for prefix in ('global source ',):
    for prop in source_props.split('|'):
        MAP['addfdtd',prefix+prop]=dict(native='partial',ui='implemented',fsp='partial',scope='전역 시간 소스 설정의 지원되는 부분집합.',evidence=['photonweave/waveforms.py','tests/test_sources.py'])
for prop in spectral.split('|'):
    MAP['addfdtd','global monitor '+prop]=dict(native='partial',ui='implemented',fsp='partial',scope='전역 주파수·범위·sampling subset, 로컬 apodization 유지 가능. 전체 advanced option 동등성은 아님.',evidence=['photonweave/models.py','tests/test_fsp_monitors.py'])

features=[]
def feature(id,category,name,native='missing',ui='missing',fsp='missing',scope='미구현. 독립 엔진·사용자 흐름·정확도 검증 필요.',evidence=(),reference=REFERENCE,priority=2):
    features.append(dict(id=id,category=category,name=name,native=native,ui=ui,fsp=fsp,scope=scope,evidence=list(evidence),reference=reference,priority=priority))

for id,name in [('triangle','삼각형'),('polygon','다각형 extrusion'),('ellipse','타원·타원체'),('arc','부분 링·호'),('pyramid','피라미드·테이퍼'),('solid','Planar solid'),('path','곡선 waveguide path'),('surface','표면·custom equation'),('sheet_geometry','2D sheet 구조'),('layer_builder','Layer builder'),('groups','계층 structure group'),('group_script','구조 생성 script·user properties'),('assembly','Assembly·component'),('rotation3','3축 Euler 회전'),('arrays','배열·패턴'),('roughness','표면 roughness'),('gds','GDSII'),('stl','STL'),('spatial_index','공간 n/k import'),('image_geometry','이미지·binary geometry import')]:feature('cad.'+id,'CAD',name)
for id,name in [('sampled_fit','측정 n/k 데이터·passive multi-pole fit'),('nk','중심 주파수 n/k'),('conductive','전기 전도도'),('debye','Debye'),('sellmeier','Sellmeier'),('pec','이상 PEC 재료'),('multipole','다중 oscillator'),('diagonal','대각 이방성'),('tensor','일반 tensor·grid transform'),('magnetic','자기 permeability'),('nonlinear','χ²·χ³·Kerr'),('raman','Raman'),('gain','Gain·active material'),('graphene','2D conductivity·graphene'),('temperature','온도·전하 의존 재료'),('plugin','사용자 material plugin'),('library','상용 재료 DB의 동일 복제')]:feature('material.'+id,'재료',name,reference=refs['advanced'] if id in ('magnetic','nonlinear','raman','gain','plugin') else refs['material'])
for id,name in [('conformal','Conformal CMT 변형'),('subpixel','Subpixel averaging'),('axis_step','독립 dx/dy/dz'),('override_step','영역별 target step'),('user_nodes','사용자 node 배열'),('metal_mesh','금속 skin-depth 자동 메시'),('symmetric_mesh','대칭 강제 메시'),('auto_accuracy','재료·파장 기반 mesh accuracy 1–8'),('subgrid','동적 adaptation·subgrid')]:feature('mesh.'+id,'메시',name,reference=refs['solver'])
for id,name in [('pec','PEC 경계'),('pmc','PMC 경계'),('symmetry','Symmetric'),('antisymmetry','Anti-symmetric'),('vendor_pml','Vendor PML profile·autoscale'),('bfast','BFAST')]:feature('boundary.'+id,'경계',name,reference=refs['solver'])
for id,name in [('magnetic','자기 dipole'),('vector','임의 벡터 dipole'),('dc','Eliminate DC'),('oneway','단방향 plane wave'),('gaussian','Gaussian beam·waist'),('angle','임의 각도 injection'),('tfsf','TFSF box'),('mode','Eigenmode source'),('port','Mode port'),('import','공간 E/H import'),('pupil','Pupil·multifrequency beam'),('calibration','물리 단위·source power calibration'),('incoherence','공간·시간 비간섭 ensemble')]:feature('source.'+id,'소스',name,reference=refs['mode'] if id in ('mode','port') else refs['source'],priority=1 if id in ('oneway','mode','port') else 2)
for id,name in [('time_space','분포 time monitor'),('volume_dft','3D volume DFT'),('index','공간 refractive index monitor'),('movie','독립 movie monitor'),('selection','필드 성분별 record 선택'),('global','Global monitor settings'),('chebyshev','Chebyshev frequency sampling'),('custom','사용자 주파수 표'),('averaging','부분·전체 spectral averaging'),('pml','PML 내부 record'),('time_sampling','시간 downsample·sampling limit')]:feature('monitor.'+id,'모니터',name,reference=refs['field'])
feature('monitor.plane','모니터','평면 DFT E/H·공간 보간','partial','partial','missing','새 native plane DFT와 signed flux 구현 중. 물리 검증 및 UI 연결 후 갱신.',('photonweave/field_monitors.py',),refs['field'],1)
for id,name in [('normalization','면적분 flux·air reference R/T/A'),('sparameters','S-parameters·mode expansion'),('nearfar','Near-to-far field'),('diffraction','회절 차수·grating projection'),('cross_sections','산란·흡수 cross-section'),('absorption','국소 흡수·charge/current'),('resonance','공진 주파수·Q 분석'),('mode_area','Mode area·volume'),('directivity','Directivity·편광 분석'),('impulse','Impulse response convolution')]:feature('analysis.'+id,'분석',name,priority=1 if id in ('normalization','sparameters') else 2)
for id,name in [('shutoff','에너지 기반 auto shutoff'),('divergence','성장 감지·divergence threshold'),('checkpoint','Checkpoint·restart'),('multi_gpu','다중 GPU·MPI'),('distributed','분산 job·resource 설정'),('sweep','Parameter sweep'),('nested_sweep','Nested sweep'),('optimization','Optimization'),('monte_carlo','Monte Carlo·yield'),('sparam_sweep','S-parameter matrix sweep'),('script','전체 LSF·script workspace'),('datasets','Rectilinear/unstructured dataset API'),('fsp_write','독립 FSP 전체 저장'),('fsp_results','FSP 결과·history 보존'),('fsp_versions','다른 FSP 버전'),('library','Object/analysis library'),('ui_tabs','모든 property tab·results browser')]:feature('workflow.'+id,'실행·자동화·호환',name,priority=1 if id in ('shutoff','sweep','fsp_write') else 2)
for id,name,code,test in [('cpu','CPU solver','photonweave/solver.py','tests/test_solver.py'),('cuda','CUDA·CUDA Graph','photonweave/solver.py','tests/test_boundaries.py'),('precision','float32 / float64','photonweave/solver.py','tests/test_mesh.py'),('cancel','사용자 실행 중단','photonweave/solver.py','tests/test_solver.py'),('python','Native Python·JSON API','photonweave/models.py','tests/test_solver.py'),('npz','NPZ 필드·좌표·스펙트럼 export','photonweave/solver.py','tests/test_mesh.py'),('mesh_preview','실제 mesh node 미리보기','photonweave/mesh.py','tests/test_mesh.py')]:
    feature('native.'+id,'자체 실행·출력',name,'implemented','implemented','n/a','명시된 native 범위에서 구현. Vendor 전체 동등성 주장이 아님.',(code,test),priority=0)

feature('native.cuda_fused','자체 실행·출력','Fused CUDA Yee/CPML kernel','implemented','implemented','n/a',
        '선택형 실수 CUDA kernel. 2D/3D, float32/64, CPML·periodic·graded 및 기존 ADE. 별도 선택형 plane DFT는 위상·공간 보간·복소 누적을 single/batch에서 공유 launch. Python cuda_graph_steps는 관측 시점을 보존한 선택형 graph unrolling. 5880 장·스펙트럼 비교와 준비 비용·회귀 포함 성능 측정. 고정 Bloch의 fused forward·transpose를 별도 미분 API에서 지원. ADE 미분은 resident Torch 경로이며 fused·공간 ADE는 후속.',
        ('photonweave/cuda_kernels.py','photonweave/cuda_monitors.py','photonweave/cuda_graph.py','tests/test_cuda_kernels.py','tests/test_cuda_monitors.py','tests/test_cuda_graph_steps.py','tests/ui/cuda-kernels.spec.js','tests/ui/cuda-monitors.spec.js','benchmarks/cuda_kernels.py','benchmarks/spectral_ensemble.py','benchmarks/graph_ensembles.py'),reference='',priority=0)

updates={
 'mesh.subpixel':('partial','implemented','실험적 lossless dielectric subpixel. 축별 일정 간격의 2D/3D, 전역 Hermitian/positive edge-triplet 연산자, CPU/Torch/fused CUDA·tensor, Python/UI/JSON. 해석 평면 분율·고굴절률 이산 에너지·Mie 구 산란 검사. 모든 조건의 오차 개선은 아니며 고굴절률 소자·모드·분산 혼합·비균일 subpixel 검증은 남음.',('photonweave/subpixel.py','photonweave/subpixel_geometry.py','tests/test_subpixel.py','tests/ui/subpixel.spec.js','docs/SUBPIXEL_INTERFACES.md','docs/validation/SUBPIXEL_REPORT.md')),
 'cad.triangle':('implemented','implemented','3개 꼭짓점의 polygon extrusion으로 지원. Native Python/GUI vertex editor. 별도 addtriangle facade나 FSP triangle은 미지원.',('photonweave/geometry.py','tests/test_geometry.py','tests/ui/geometry.spec.js')),
 'cad.polygon':('implemented','implemented','Simple concave polygon의 local XY vertex·z extrusion. 3–2048 vertices, 3축 회전, native CPU/CUDA/batch. 독립 volume·contour·배치와 UI 검사.',('photonweave/geometry.py','tests/test_geometry.py','tests/frontend_geometry.test.js','tests/ui/geometry.spec.js')),
 'cad.ellipse':('implemented','implemented','타원체·타원기둥·타원 링. Native 해석적 membership. 인식된 FSP 회전 형상 import·writeback.',('photonweave/geometry.py','tests/test_geometry.py','tests/test_fsp_geometry_write.py')),
 'cad.arc':('implemented','implemented','Local physical polar angle의 circular/elliptical ring sector. Native CPU/CUDA/batch·CAD 투영과 인식된 FSP import·writeback.',('photonweave/geometry.py','tests/test_fsp_geometry_write.py','tests/frontend_geometry.test.js')),
 'cad.rotation3':('implemented','implemented','Native fixed world axis의 right-handed 1/2/3 회전, legacy z 먼저 적용. x/y/z/none, 중심 pivot. 인식된 FSP primitive import·writeback, 그룹은 남음.',('photonweave/geometry.py','tests/test_fsp_geometry_write.py','tests/frontend_geometry.test.js','tests/ui/geometry.spec.js')),
 'workflow.fsp_write':('partial', 'partial', '독립 기존 primitive geometry writeback. 위치·크기·회전·가변 polygon·이름·상수 재료·priority. 원본 fingerprint와 미수정 byte 보존, Python/CLI/UI. 소스 시간/위상·모니터 주파수/window·duration/CFL·일부 PML/Periodic와 uniform target 메시 간격/크기 writeback. 입력 controls·node·PML 범위·dt 갱신 및 native E/H/DFT 왕복 검사. Primitive 추가·삭제·복제·순서 저장과 ID/미수정 byte 대응표 추가. 새 레코드는 자체 metadata 기본값을 쓰며 외부 reader 미검증. Electric dipole·3D plane/TFSF·TIME/DFT 목록 추가·삭제·복제·순서와 shared point component 분리 저장 구현. 외부 remeshing·전체 저장·미지원 class·일반 설정·그룹·결과는 남음.', ('photonweave/fsp_geometry.py', 'photonweave/fsp_settings.py', 'tests/test_fsp_geometry_write.py', 'tests/test_fsp_settings_write.py', 'tests/test_fsp_mesh_write.py', 'tests/ui/fsp-settings-write.spec.js', 'tests/ui/fsp-mesh-write.spec.js', 'photonweave/fsp_objects.py', 'tests/test_fsp_objects_write.py', 'tests/ui/fsp-objects-write.spec.js', 'photonweave/fsp_instruments.py', 'tests/test_fsp_instruments_write.py', 'tests/ui/fsp-instruments-write.spec.js')),
 'mesh.axis_step':('implemented','implemented','독립 dx/dy/dz. 실제 시간 간격·미분 metric·물리 PML 깊이·paired source 보정, CPU/CUDA/tensor, Python/SI facade/UI. 등방 baseline과 matched-dt layer ensemble 실측.',('photonweave/models.py','tests/test_rectilinear.py','tests/ui/rectilinear.spec.js','benchmarks/rectilinear_ensembles.py')),
 'mesh.user_nodes':('implemented','implemented','중심 대칭 끝점의 세 strictly increasing coordinate 배열. Python/SI setmesh/UI 원자적 편집, JSON/NPZ 보존. 임의 격자의 정확도 보장은 아니며 TFSF support는 축별 일정 간격 필요.',('photonweave/models.py','tests/test_rectilinear.py','tests/test_fsp_mesh.py','tests/ui/rectilinear.spec.js')),
 'source.tfsf':('partial','implemented','Normal-incidence closed box, 2D/3D 활성 축·양 방향·횡편광, live scalar incident line, sparse Yee face correction과 shared CUDA batch. 균질 shell·최소 uniform mesh·외부 PML. 독립 이산 기준과 Mie 구 산란 검증. FSP는 3D normal-incidence subset. Oblique·일반 FSP 호환은 남음.',('photonweave/tfsf.py','photonweave/cuda_tfsf.py','tests/test_tfsf.py','tests/ui/tfsf-sources.spec.js','examples/tfsf_sphere.py')),
 'source.oneway':('partial','implemented','Discrete normal-incidence E/H plane. 2D/3D 모든 활성 축·양 방향·횡편광, 보조 Yee line과 CPML, CPU/CUDA·tensor. Transverse periodic·균질 주입 이웃만 지원. Oblique/finite aperture는 남음.',('photonweave/injection.py','tests/test_oneway_sources.py','tests/ui/oneway-sources.spec.js','benchmarks/oneway_sources.py')),
 'source.magnetic':('implemented','implemented','Hx/Hy/Hz 및 theta/phi 자기 soft source. H 갱신 후 H 반 시간에 주입. reduced field 단위이며 절대 자기 dipole moment·power 보정은 별도.',('photonweave/solver.py','photonweave/cuda_batch.py','tests/test_vector_sources.py','tests/ui/vector-sources.spec.js')),
 'source.vector':('implemented','implemented','E/H family의 선형 unit-vector theta/phi. 독립 위상을 가진 Cartesian source 조합도 가능. 각 성분의 Yee 위치 유지. FSP electric vector 방향 매핑.',('photonweave/models.py','photonweave/fsp_native.py','tests/test_vector_sources.py','tests/ui/vector-sources.spec.js')),
 'workflow.shutoff':('implemented','implemented','선택형 전체 영역·재료 상태 decay norm, 모든 유한 소스 종료 후 연속 검사. 연속파는 decay 종료 비활성. 종료 원인·실제 step·history 저장. 관측량 오차 보장은 아님.',('photonweave/run_control.py','tests/test_run_control.py','frontend/src/run_control.js')),
 'workflow.divergence':('implemented','implemented','E/H와 CPML·oscillator의 전체 영역 검사. 유한 소스 종료 후 norm 증가와 선택형 절대 장 크기 제한. 발산은 실패로 처리.',('photonweave/run_control.py','tests/test_run_control.py')),
 'material.sampled_fit':('implemented','implemented','사용자 CSV/nk/복소 epsilon의 수동 등방 Drude/Lorentz fit. 3–8192개 sample, 최대 16 poles, 명시적 band·tolerance·실패와 원자료 hash. 연속/ADE target·고정 epsilon infinity·Python facade·UI import/plot/apply·JSON/Python 저장. 이방성/gain/자기 및 일반 재료 FSP writeback 미지원.',('photonweave/optical_data.py','photonweave/material_fit.py','tests/test_material_fit.py','frontend/src/material_fit.js','tests/ui/material-fit.spec.js','docs/MATERIAL_FITTING.md')),
 'material.multipole':('implemented','implemented','최대 16개 수동 Drude/Lorentz pole의 합. 공통 E를 동시에 구하는 trapezoidal ADE, n/k preview·JSON/Python·GUI pole 편집. 측정 데이터 피팅은 material.sampled_fit에서 지원 범위 확인.',('photonweave/materials.py','tests/test_multipole.py','frontend/src/materials.js')),
 'monitor.plane':('implemented','partial','축 정렬 plane/2D line의 6성분 DFT, Yee 공간 보간과 H 반 시간 보정, signed flux. 세 normal의 합성장과 Fresnel/에너지 보존, CPU/CUDA 검증. UI는 flux plot 제공. 주파수 공간장 UI 미리보기는 미완성.',('photonweave/field_monitors.py','tests/test_field_monitors.py')),
 'monitor.global':('implemented','implemented','Native global SpectrumSettings 상속. Python set/getglobalmonitor와 UI 편집.',('photonweave/session.py','tests/test_session.py','tests/test_field_monitors.py')),
 'monitor.custom':('implemented','implemented','양수·오름차순 custom frequency Hz 배열과 Nyquist 검증. UI는 THz 입력.',('photonweave/spectra.py','tests/test_field_monitors.py')),
 'monitor.chebyshev':('implemented','implemented','Chebyshev roots와 Lobatto 선택, 주파수/파장 좌표. FSP는 끝점을 포함한 Lobatto. 독립 명시 수식 검사.',('photonweave/spectra.py','tests/test_fsp_monitors.py','tests/test_monitor_outputs.py')),
 'monitor.selection':('implemented','implemented','Plane DFT E/H/P 성분과 signed flux 선택. 필요한 최소 성분만 누적, 출력 metadata 및 NPZ round trip. Flux-only는 접선 4성분, field subtraction에는 별도 field 저장 필요.',('photonweave/field_monitors.py','tests/test_monitor_outputs.py','tests/ui/monitor-outputs.spec.js')),
 'monitor.time_sampling':('partial','implemented','DFT temporal stride와 Nyquist 검사. Plane CUDA는 비선택 시점 gather/누적 생략, point는 전체 trace 보존 후 DFT에 적용. 자동 sampling-rate optimizer는 미지원.',('photonweave/models.py','photonweave/cuda_monitors.py','tests/test_monitor_outputs.py')),
 'analysis.normalization':('partial','partial','동일 run signature·격자·소스·주파수·unapodized air reference로 signed flux 비율. Reflection은 complex E/H incident subtraction. 박막 R/T 및 R+T 검증. 일반 source power calibration, closed-box A는 미지원.',('photonweave/field_monitors.py','tests/test_field_monitors.py')),
 'workflow.sweep':('implemented','missing','Python parameter_sweep + BatchRunner. 독립 프로세스, 메모리 기반 GPU 동시 실행 제한, per-case 결과·재개. 단일 grid MPI 분할은 아님.',('photonweave/batch.py','tests/test_batch.py')),
 'workflow.nested_sweep':('implemented','missing','여러 dotted Project path의 Cartesian product, atomic project validation과 결정적 case id.',('photonweave/batch.py','tests/test_batch.py')),
 'workflow.optimization':('partial','missing','Python 병렬 DE와 별도 Torch differentiable API의 Adam 예제. 후자는 실수 비분산 epsilon·점 관측·regularized sphere 부분집합이며 일반 소자 최적화 검증은 남음.',('photonweave/design.py','photonweave/differentiable.py','examples/differentiable_design.py','tests/test_differentiable.py')),
 'workflow.checkpoint':('partial','missing','Adjoint 내부 E/H·CPML·명시적 ADE P/Q checkpoint/replay와 device/host/disk 저장. 일반 forward 작업의 영구 저장·재개, TFSF 상태 및 UI checkpoint는 남음.',('photonweave/differentiable.py','tests/test_differentiable.py')),
 'workflow.multi_gpu':('partial','missing','Python devices 목록으로 독립 case를 여러 CUDA 장치에 배정. 현재 single-GPU 검증만 실시. 단일 grid multi-GPU/MPI는 미지원.',('photonweave/batch.py','tests/test_batch.py')),
}
for row in features:
    if row['id'] in updates:
        native,ui,scope,evidence=updates[row['id']]
        row.update(native=native,ui=ui,scope=scope,evidence=list(evidence))
    if row['id'] in ('cad.polygon','cad.arc','cad.ellipse','cad.rotation3','workflow.fsp_write','source.oneway','source.tfsf','monitor.plane','monitor.global','monitor.custom','monitor.chebyshev','monitor.selection','monitor.time_sampling','mesh.axis_step','mesh.user_nodes'):
        row['fsp']='partial'
    if row['id'] == 'source.vector':
        row['fsp'] = 'partial'
feature('workflow.adjoint','실행·자동화·호환','Adjoint·자동미분 FDTD','partial','missing','n/a',scope='고정 실수/복소 Bloch의 diagonal epsilon→Yee/CPML→점·주파수·고정 plane 관측→Torch backward. Fused transpose·제한 checkpoint·공간 slab·형상 graph 지원. 명시적 ADE 재료 미분은 resident Torch 경로. Fused·공간 ADE, TFSF·mode port·coupled subpixel 및 물리 shape-gradient 수렴은 남음.',evidence=('photonweave/differentiable.py','tests/test_differentiable.py','photonweave/dispersive_adjoint.py','tests/test_dispersive_adjoint.py','docs/DIFFERENTIABLE_FDTD.md','docs/DISPERSIVE_ADJOINT.md'),reference='',priority=0)
feature('workflow.memory_hierarchy','실행·자동화·호환','GPU·DRAM·디스크 계층형 checkpoint','partial','missing','n/a',scope='명시적인 tier별 slot 수, binomial 분할·재계산, 무손실 state 저장과 byte 한도. 현재 동기식 전송. 비동기·자동 정책·전체 host RSS 한도·공간 스트리밍은 미구현.',evidence=('photonweave/differentiable.py','tests/test_differentiable.py','docs/HIERARCHICAL_EXECUTION.md'),reference='',priority=0)
feature('workflow.out_of_core','실행·자동화·호환','Space-time tiled out-of-core GPU FDTD',scope='필수 후속. causal halo·DRAM slab·async prefetch·tile/K tuning 뒤 NVMe backing과 정확한 backward를 검증. 현재 시간 checkpoint는 공간 out-of-core 지원이 아니다.',evidence=('docs/HIERARCHICAL_EXECUTION.md',),reference='',priority=0)
feature('native.memory_profile','자체 실행·출력','GPU·host·파일 전송 비용 측정','partial','missing','n/a',scope='제한된 pinned H2D/D2H, host capacity, fsync write·warm-cache file read. 실제 NVMe 지속 대역폭·copy/compute overlap·자동 tile 정책은 미검증.',evidence=('photonweave/memory_profile.py','tests/test_memory_profile.py'),reference='',priority=0)
feature('workflow.fused_batch','실행·자동화·호환','단일 CUDA kernel의 tensor batch','implemented','missing','n/a',
        scope='run_tensor_batch: 동일 격자의 실수 2D/3D·float32/64, CPML/periodic, graded, multipole, native DFT 결과. E/H/source/point trace의 batch-axis launch와 cohort 분할. tune_tensor_batch는 실제 전체 실행으로 묶음 크기 선택, 준비 비용·오차 검사를 기록. optimize의 tensor population 경로 지원. run_grouped_batch의 혼합 mesh/시간/정밀도 자동 분류와 입력 순서 복원 추가. 복소장·auto shutoff·resume·GUI batch 실행은 미지원.',
        evidence=('photonweave/cuda_batch.py','photonweave/tensor_batch.py','photonweave/tuning.py','photonweave/design.py','photonweave/grouped_batch.py','tests/test_grouped_batch.py','tests/test_tensor_batch.py','tests/test_tuning.py','docs/TENSOR_BATCH.md'),reference='',priority=1)
feature('native.batch_resume','자체 실행·출력','Batch 중단·실패·checksum resume','implemented','missing','n/a',
        '각 case의 검증된 Project·source-code fingerprint, NPZ checksum, objective_key 일치 확인. pickle 없이 결과 복구.',('photonweave/batch.py','tests/test_batch.py'),priority=0)
feature('native.convergence','자체 실행·출력','물리 시간·PML 두께 고정 mesh 수렴 검사','implemented','missing','n/a',
        'Python mesh_convergence. 동일 domain·PML 물리 두께, 시간 반올림 기록, 선택 관측량의 연속 오차 검사, 선택형 matched reference, NPZ/JSON 보고. GUI study 실행과 자동 오차 추정 mesher는 미구현.',
        ('photonweave/convergence.py','tests/test_convergence.py'),reference='',priority=0)
feature('native.release','자체 실행·출력','독립 공개 배포 패키지·출처 검증',scope='필수 미완료. 공개 export의 코드·라이선스·데이터·자격증명 제외 검사를 통과한 뒤 배포.',
        evidence=('scripts/release_audit.py','scripts/package_source.py'),reference='',priority=0)

def build():
    installed=json.loads(Path('docs/validation/installed-property-catalog.json').read_text(encoding='utf-8'))
    rows=list(features)
    for obj in installed['objects']:
        command=obj['command'];ref=refs.get({'addfdtd':'solver','addmesh':'mesh','addpower':'field','addprofile':'field','addtime':'time','addmode':'mode','addport':'mode'}.get(command),REFERENCE)
        for prop in obj['properties']:
            status=MAP.get((command,prop.lower()),dict(native='missing',ui='missing',fsp='missing',scope='해당 vendor 속성의 native 동작·변환이 매핑/검증되지 않음.',evidence=[]))
            rows.append(dict(id=f'{command}.{prop}',category=command,name=prop,reference=ref,priority=2,**status))
    for model in installed['materials']:
        for prop in model['properties']:
            supported=model['model'] in ('Dielectric','Plasma','Lorentz') and prop not in ('anisotropy','mesh order')
            rows.append(dict(id=f"material.{model['model']}.{prop}",category='Material: '+model['model'],name=prop,
                native='partial' if supported else 'missing',ui='partial' if supported else 'missing',fsp='partial' if supported else 'missing',
                scope='등방·수동 analytic subset. Vendor 속성 간 자동 환산은 일부만 제공.' if supported else '미구현 또는 의미 대응 미검증.',
                evidence=['photonweave/materials.py','tests/test_materials.py'] if supported else [],reference=refs['material'],priority=2))
    inventory=dict(version='0.14.0-dev',target='Installed Lumerical v241 / '+installed['version'],collected_utc=installed['collected_utc'],
        scope_note='설치 버전의 33종 객체에서 추출한 1458개 속성과 9종 재료 모델 속성, 공식 문서의 추가 기능군. 옵션 값 조합·전체 LSF 명령·모든 object-library 항목까지 완전 조사한 목록은 아니며 계속 확장합니다. 수치는 속성 수이며 제품 완성도가 아닙니다. missing은 미구현 또는 native 의미 대응 미검증입니다.',
        status_labels={'implemented':'구현','partial':'부분','missing':'미구현/미검증','n/a':'해당 없음'},
        counts=dict(Counter(r['native'] for r in rows)),features=rows)
    for row in rows:
        # All native solver settings are serialized Project fields and callable
        # through Simulation, or explicit workflow functions. UI is not required.
        row['python']=row['native']
        row['evidence']=[p for p in row['evidence'] if not p.startswith('docs/validation/')]
        for file in row['evidence']:
            if not Path(file).is_file():raise ValueError('Missing evidence: '+file)
    annotate_inventory(inventory)
    package=Path('photonweave/feature_inventory.json');package.write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
    with Path('docs/FEATURE_PRIORITY_INDEX.csv').open('w',encoding='utf-8-sig',newline='') as stream:
        columns=['id','name','product_priority','delivery_rank','decision','workstream_title','remaining','native','python','ui','priority_reason']
        writer=csv.DictWriter(stream,fieldnames=columns,extrasaction='ignore');writer.writeheader()
        writer.writerows(sorted(rows,key=lambda r:(r['delivery_rank'],r['id'])))
    Path('docs/validation/installed-property-catalog.json').write_text(json.dumps(installed,ensure_ascii=False,indent=2),encoding='utf-8')
    lines=['# Lumerical 기능·속성 체크리스트','',inventory['scope_note'],'',f"기준: {inventory['target']} / {inventory['collected_utc']}",'',
           '체크는 해당 행의 명시된 native 범위만 의미합니다. Python은 native Project/Simulation 또는 workflow API로 그 범위를 사용할 수 있다는 뜻이며, 동일한 LSF 명령을 모두 지원한다는 뜻이 아닙니다. UI와 FSP를 별도로 확인해야 합니다. API bridge로 읽히는 기능은 독립 GPU 엔진 구현으로 세지 않습니다.','',
           f"전체 {len(rows)}행: "+', '.join(f'{inventory["status_labels"][k]} {v}' for k,v in inventory['counts'].items()),'',
           '구현 우선순위와 제외 기준: [개발 우선순위](IMPLEMENTATION_PRIORITIES.md). 모든 행의 분류: [CSV](FEATURE_PRIORITY_INDEX.csv). UI 체크리스트에서도 중요도로 필터할 수 있습니다.','']
    categories=list(dict.fromkeys(r['category'] for r in rows))
    for category in categories:
        lines += ['## '+category,'','| 체크 | 기능/속성 | 엔진 | Python | UI | 독립 FSP | 범위·검증 근거 |','| --- | --- | --- | --- | --- | --- | --- |']
        for row in (r for r in rows if r['category']==category):
            scope=row['scope'].replace('|','/')+' '+' '.join(f'[{Path(e).name}](../{e})' for e in row['evidence'])
            labels=[inventory['status_labels'][row[k]] for k in ('native','python','ui','fsp')]
            lines.append('| '+('☑' if row['native']=='implemented' else '☐')+f" | [{row['name']}]({row['reference']}) | "+' | '.join(labels)+f' | {scope} |')
        lines.append('')
    Path('docs/FEATURE_CHECKLIST.md').write_text('\n'.join(lines),encoding='utf-8')
    print('Inventory:',len(rows),'rows;',inventory['counts'])

if __name__=='__main__':build()
