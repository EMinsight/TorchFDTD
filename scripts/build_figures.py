"""Original README artwork and scientific figures from native solver results."""
import json
from pathlib import Path
import shutil
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from photonweave.models import demo_project
from photonweave import Simulation


def main():
    assets=Path('docs/assets');assets.mkdir(parents=True,exist_ok=True)
    dest=Path('docs/validation')
    p=demo_project();p.region.backend='cpu';p.region.steps=600;p.region.snapshot_interval=20
    result=Simulation(p).run()
    # Use an actual computed field at the snapshot with largest field norm.
    k=int(np.argmax(np.sum(abs(result.frames)**2,axis=(1,2))))
    wave=result.frames[k];scale=np.max(abs(wave))
    fig=plt.figure(figsize=(14.4,5.4),facecolor='#071322')
    ax=fig.add_axes([.49,.17,.47,.7],facecolor='#0c1e33')
    ax.imshow(wave.T/scale,origin='lower',extent=(-4,4,-3,3),cmap='RdBu_r',vmin=-.65,vmax=.65,interpolation='bilinear',aspect='auto')
    ax.axhline(.325,color='#8ccddf',lw=.8,alpha=.6);ax.axhline(-.325,color='#8ccddf',lw=.8,alpha=.6)
    ax.set_xlabel('x (µm)',color='#829eb7',fontsize=10);ax.set_ylabel('y (µm)',color='#829eb7',fontsize=10)
    ax.tick_params(colors='#829eb7',labelsize=9)
    for spine in ax.spines.values():spine.set_color('#264661')
    ax.set_title(f'NATIVE YEE FIELD   /   $E_z$   /   STEP {result.frame_steps[k]}',loc='left',color='#91b5cd',fontsize=9,pad=16)
    fig.text(.05,.85,'OPEN PHOTONICS  /  GPU COMPUTING',color='#72d8d5',fontsize=10,fontweight='bold')
    fig.text(.05,.68,'PhotonWeave',color='#f1f6fc',fontsize=38,fontweight='bold')
    fig.text(.05,.58,'From one field to a design space.',color='#bfd0e3',fontsize=17)
    fig.text(.05,.39,'Build visually. Run entirely in Python.\nExplore independent designs on CUDA.',color='#8fa9c1',fontsize=13,linespacing=1.8)
    for x,label in [(.05,'YEE + CPML'),(.175,'GRADED MESH'),(.32,'BATCH API')]:
        fig.patches.append(FancyBboxPatch((x,.19),.112,.06,boxstyle='round,pad=0.005,rounding_size=0.009',
            transform=fig.transFigure,facecolor='#102840',edgecolor='#254760',lw=.8))
        fig.text(x+.008,.209,label,color='#b7dcf1',fontsize=9)
    fig.text(.05,.065,'Independent implementation  •  Explicit numerical conventions  •  Reproducible validation',color='#6688a4',fontsize=9)
    fig.savefig(assets/'hero.png',dpi=180,facecolor=fig.get_facecolor());plt.close(fig)
    (assets/'hero-provenance.json').write_text(json.dumps(dict(project=p.model_dump(),step=int(result.frame_steps[k]),
        scale=float(scale),description='Native computed Ez field, divided by its absolute maximum. Original matplotlib layout. No vendor artwork.'),indent=2),encoding='utf-8')
    flux=json.loads(Path('results/flux/validation.json').read_text())
    shutil.copyfile('results/flux/validation.json',dest/'flux.json')
    fig,axes=plt.subplots(1,2,figsize=(9,3.5),layout='constrained')
    wl=np.array(flux['wavelength_um']);order=np.argsort(wl)
    for key,color in [('T','#1679aa'),('R','#d65c43')]:
        axes[0].plot(wl[order],np.array(flux[key])[order],color=color,label=f'Native {key}',lw=2)
    axes[0].plot(wl[order],np.array(flux['analytic_T'])[order],'k--',lw=1,label='Analytic T')
    axes[0].plot(wl[order],1-np.array(flux['analytic_T'])[order],'k:',lw=1,label='Analytic R')
    axes[0].set(xlabel='Wavelength (µm)',ylabel='Power ratio',ylim=(-.03,1.03));axes[0].legend(fontsize=8,ncol=2)
    for key,exact,color in [('T',np.array(flux['analytic_T']),'#1679aa'),('R',1-np.array(flux['analytic_T']),'#d65c43')]:
        axes[1].plot(wl[order],abs(np.array(flux[key])-exact)[order],color=color,label=f'|{key} − analytic|')
    axes[1].plot(wl[order],abs(np.array(flux['R'])+np.array(flux['T'])-1)[order],color='#609a64',label='|R + T − 1|')
    axes[1].set(xlabel='Wavelength (µm)',ylabel='Absolute error',yscale='log');axes[1].legend(fontsize=8)
    for ax in axes:ax.grid(alpha=.2)
    fig.savefig(dest/'flux-validation.png',dpi=220);plt.close(fig)
    path=Path('results/batch/validation.json')
    if path.exists():
        data=json.loads(path.read_text());shutil.copyfile(path,dest/'batch.json')
        rows=data['measurements'];fig,axes=plt.subplots(1,2,figsize=(9,3.6),layout='constrained')
        labels=[f"{r['backend'].upper()}\n{r['workers']} worker"+('s' if r['workers']>1 else '') for r in rows]
        values=[r['median_seconds'] for r in rows]
        axes[0].bar(labels,values,color=['#718da8','#137fab','#48a9b9','#82c7c1']);axes[0].set(yscale='log',ylabel='Four-case wall time (s)')
        for i,v in enumerate(values):axes[0].text(i,v*1.12,f'{v:.3f}',ha='center',fontsize=9)
        axes[0].set_ylim(.7,max(values)*1.9)
        axes[1].bar(labels,[r['cases_per_second'] for r in rows],color=['#718da8','#137fab','#48a9b9','#82c7c1'])
        axes[1].set(ylabel='Cases per second',ylim=(0,4));axes[1].grid(axis='y',alpha=.2)
        fig.savefig(dest/'batch-throughput.png',dpi=220);plt.close(fig)
    print('Original hero, flux and batch figures written.')


if __name__=='__main__':main()
