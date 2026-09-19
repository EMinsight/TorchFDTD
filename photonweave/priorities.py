"""Product priorities for the native photonics workflow, independent of property counts."""
from collections import Counter

# Priority is product importance. Rank is dependency-aware delivery order.
WORKSTREAMS = {
    'reliability': (0,1,'required','실행 신뢰성·낭비 방지','자동 종료, 전체 장 발산 검사, 취소·저장 결과의 구분은 모든 계산의 기반이다.'),
    'convergence': (0,2,'required','정확도·수렴 검증','같은 물리량과 물리적 시간으로 메시를 비교해야 정확도 대비 비용을 판단할 수 있다.'),
    'release': (0,3,'required','독립 배포 패키지','공개할 코드·데이터·라이선스·자격증명 제외 목록을 검증해야 한다.'),
    'ports': (1,4,'required','소스·모드·정규화','단방향 여기, 모드 포트와 검증된 전송 목적함수가 실제 소자 설계에 필요하다.'),
    'materials': (1,5,'required','수동 분산 재료','다중 공진과 측정 광학상수의 수동 피팅이 파장 범위의 정확도를 결정한다.'),
    'interfaces': (1,6,'required','인터페이스·메시 효율','subpixel 및 독립 축 간격은 같은 오차에서 셀 수를 줄이는 수단이다. 수렴 증명이 먼저다.'),
    'adjoint': (1,7,'required','이산 adjoint·자동미분','많은 설계 변수를 다루는 inverse design에 필수다. Taylor 검사와 gradient 비용 측정이 필요하다.'),
    'tensor_batch': (1,8,'required','GPU tensor batch','같은 격자의 독립 구조물을 함께 처리하고 동일 결과와 실제 cases/s 향상을 검증해야 한다.'),
    'observables': (1,9,'required','관측량·주파수 공간장','전송·흡수·회절·방사와 성분 선택은 장 그림을 물리적 설계 지표로 바꾼다.'),
    'geometry': (1,10,'required','핵심 CAD·설계 영역','다각형, 회전과 공간 재료 표현은 실제 소자와 topology 설계에 필요하다.'),
    'workflow': (2,11,'required','사용성·자동화','결과 탐색, GUI sweep, 그룹과 checkpoint는 연구 생산성을 높인다.'),
    'special_physics': (2,12,'conditional','특수 물성·실험 조건','비선형·자기·열·전하·박막 모델은 대상 연구가 요구할 때 추가한다.'),
    'distributed': (2,13,'conditional','단일 문제 multi-GPU·클러스터','한 GPU의 메모리를 넘는 문제나 실제 다중 GPU 환경이 생기면 우선순위를 올린다.'),
    'special_cad': (2,14,'conditional','특수 CAD·제조 포맷','곡면·STL·공정 builder는 구체적인 사용 사례와 형상 검증이 있을 때 추가한다.'),
    'fsp_compatibility': (1,11,'required','FSP 독립 호환','요청된 완전 대체 목표에 필요한 FSP 버전·결과·writeback. 원본 보존과 명시적 미지원 보고를 유지하며 단계적으로 검증해야 한다.'),
    'compatibility': (3,15,'omit','제품별 내부 구현의 복제','전용 스크립트 언어 전체와 제품 고유 내부 알고리즘의 동일 구현은 필요하지 않다. 요청된 FSP 호환은 별도 필수 작업이다.'),
    'cosmetic': (3,16,'omit','세부 표시 옵션의 일대일 복제','계산과 결과 해석에 영향 없는 표시 속성은 동일하게 복제할 필요가 없다.'),
}

EXACT = {
    'reliability': 'workflow.shutoff workflow.divergence native.cpu native.cuda native.precision native.cancel native.python native.npz native.cuda_fused native.batch_resume',
    'convergence': 'native.convergence',
    'release': 'native.release',
    'ports': 'source.oneway source.tfsf source.mode source.port source.angle source.gaussian source.import source.calibration analysis.normalization analysis.sparameters workflow.sparam_sweep',
    'materials': 'material.sampled_fit material.nk material.multipole material.sellmeier material.diagonal',
    'interfaces': 'mesh.subpixel mesh.axis_step mesh.override_step mesh.user_nodes mesh.metal_mesh mesh.symmetric_mesh boundary.pec boundary.pmc boundary.symmetry boundary.antisymmetry native.mesh_preview',
    'adjoint': 'workflow.adjoint',
    'tensor_batch': 'workflow.fused_batch',
    'observables': 'monitor.plane monitor.global monitor.custom monitor.chebyshev monitor.selection monitor.volume_dft monitor.time_space monitor.index monitor.time_sampling analysis.diffraction analysis.nearfar analysis.absorption analysis.cross_sections analysis.resonance analysis.mode_area analysis.directivity',
    'geometry': 'cad.polygon cad.triangle cad.ellipse cad.rotation3 cad.arrays cad.spatial_index cad.image_geometry cad.gds',
    'workflow': 'cad.groups cad.group_script cad.assembly workflow.checkpoint workflow.sweep workflow.nested_sweep workflow.optimization workflow.monte_carlo workflow.datasets workflow.ui_tabs monitor.movie monitor.averaging',
    'special_physics': 'material.conductive material.debye material.pec material.tensor material.magnetic material.nonlinear material.raman material.gain material.graphene material.temperature material.plugin source.magnetic source.vector source.dc source.pupil source.incoherence monitor.pml analysis.impulse boundary.bfast',
    'distributed': 'workflow.multi_gpu workflow.distributed',
    'special_cad': 'cad.arc cad.pyramid cad.solid cad.path cad.surface cad.sheet_geometry cad.layer_builder cad.roughness cad.stl mesh.subgrid',
    'fsp_compatibility': 'workflow.fsp_write workflow.fsp_results workflow.fsp_versions',
    'compatibility': 'mesh.conformal mesh.auto_accuracy boundary.vendor_pml workflow.script workflow.library material.library',
}
EXACT = {id:group for group,ids in EXACT.items() for id in ids.split()}
OBJECTS = {
    'addfdtd':'reliability', 'addmesh':'interfaces',
    **{k:'geometry' for k in 'addrect addcircle addsphere addpoly addtriangle addimport'.split()},
    **{k:'special_cad' for k in 'addring addpyramid addwaveguide addsurface addcustom addplanarsolid addlayerbuilder add2drect add2dpoly'.split()},
    **{k:'ports' for k in 'addplane addgaussian addmode addport addimportedsource addtfsf addmodeexpansion'.split()},
    'adddipole':'ports',
    **{k:'observables' for k in 'addpower addprofile addtime addindex'.split()},
    **{k:'workflow' for k in 'addmovie addgroup addstructuregroup addanalysisgroup'.split()},
}


def classify(row):
    id,name,category=row['id'],row['name'].lower(),row['category']
    group=EXACT.get(id)
    if group is None and category.startswith('Material: '):
        group='materials' if category.split(': ',1)[1] in ('Sampled data','Lorentz','Plasma','Dielectric','Sellmeier','(n,k) Material') else 'special_physics'
    if group is None:
        group=OBJECTS.get(category)
        if group is None:raise ValueError('Unclassified feature: '+id)
        if any(s in name for s in ('opacity','wireframe','render detail','override color','color opacity','render type','render mode')):
            group='cosmetic'
        elif any(s in name for s in ('express mode','legacy conformal','mesh accuracy','conformal variant')):
            group='compatibility'
        elif category=='addfdtd':
            if any(s in name for s in ('mesh','dx','dy','dz','grading','refinement')):group='interfaces'
            elif any(s in name for s in ('global source','bloch','angle')):group='ports'
            elif any(s in name for s in ('global monitor','down sample')):group='observables'
            elif any(s in name for s in ('thread','process','resource','mpi')):group='distributed'
            elif any(s in name for s in ('checkpoint','restart')):group='workflow'
            elif not any(s in name for s in ('shutoff','diverg','stability','simulation time')):group='workflow'
    priority,rank,decision,title,reason=WORKSTREAMS[group]
    return dict(product_priority=f'P{priority}',delivery_rank=rank,decision=decision,
                workstream=group,workstream_title=title,priority_reason=reason,
                remaining=row['native']!='implemented' or row['ui'] not in ('implemented','n/a'))


def annotate_inventory(inventory):
    for row in inventory['features']:row.update(classify(row))
    inventory['priority_labels']={'P0':'P0 · 기반 필수','P1':'P1 · 핵심 필수','P2':'P2 · 후속·조건부','P3':'P3 · 복제 제외'}
    inventory['decision_labels']={'required':'필요','conditional':'사용 사례에 따라','omit':'목표에서 제외'}
    inventory['remaining_priority_counts']=dict(Counter(r['product_priority'] for r in inventory['features'] if r['remaining']))
    inventory['priority_note']='선형 photonics, Python 자동화, 단일 CUDA GPU와 inverse design을 기준으로 분류. 속성 행 수는 기능 수나 완성률이 아님. P3도 구현된 기능을 삭제한다는 뜻은 아님.'
    return inventory
