"""CPU 2D splitter: input waveguide, square design region, two output waveguides.

The objective is balanced spectral Poynting flux in two equal apertures.
Split fractions are not incident-normalized efficiencies or modal S-parameters.
"""
from __future__ import annotations
import argparse
import hashlib
import importlib.metadata
import json
import math
import time
from pathlib import Path
import numpy as np
import torch
import torch.nn.functional as F
from torchfdtd import (AdjointOptions, DifferentiablePlaneSimulation, FieldMonitor,
                       Material, Project, Region, Source, SpectrumSettings, Structure)

WAVELENGTH_UM = 1.55
DESIGN_SIDE_UM = 2.1
GUIDE_WIDTH_UM = .5
OUTPUT_Y_UM = .6
FREQUENCY_HZ = 299792458.0 / (WAVELENGTH_UM * 1e-6)


def make_problem():
    structures = [
        Structure(id="input-guide", name="Input waveguide", center=(-2.225, 0, 0), size=(2.35, .5, .1), material="guide"),
        Structure(id="upper-guide", name="Upper output", center=(2.225, .6, 0), size=(2.35, .5, .1), material="guide"),
        Structure(id="lower-guide", name="Lower output", center=(2.225, -.6, 0), size=(2.35, .5, .1), material="guide"),
        Structure(id="design-box", name="Square design region", center=(0, 0, 0), size=(2.1, 2.1, .1), material="initial design"),
    ]
    project = Project(name="Adjoint 2D 1x2 splitter",
        region=Region(dimension="2d", size=(6.4, 4.8, .1), mesh=.1, pml_cells=4,
                      steps=320, precision="float64", backend="cpu", material_sampling="yee"),
        materials=[Material(name="guide", index=2.0, color="#2c8e9c"),
                   Material(name="initial design", index=math.sqrt(2.5), color="#70b8bd")],
        structures=structures,
        sources=[Source(name="Input excitation", kind="plane", normal="x", center=(-2.2, 0, 0),
                        size=(0, .5, .1), component="Ez", wavelength=1.55, pulse="gaussian",
                        time_definition="standard", pulse_length=10e-15, pulse_offset=20e-15)],
        monitors=[FieldMonitor(id=name, name=name.title()+" output flux", normal="x",
                               center=(2.2, y, 0), size=(0, 1.0, .1), inherit_apodization=False,
                               spectrum=SpectrumSettings(sampling="frequency", wavelength_start=1.55,
                                   wavelength_stop=1.55, frequency_points=1, apodization="none"))
                  for name, y in (("upper", .6), ("lower", -.6))])
    return project, DifferentiablePlaneSimulation(project, AdjointOptions(checkpoints=4))


def design_slices(shape):
    cx, cy = shape[0] // 2, shape[1] // 2
    return slice(cx-10, cx+11), slice(cy-10, cy+11)


def material(theta, shape):
    half = torch.sigmoid(theta)
    density = torch.cat((half, half[:, :-1].flip(1)), dim=1)
    density = F.avg_pool2d(F.pad(density[None, None], (1, 1, 1, 1), mode="replicate"), 3, stride=1)[0, 0]
    contacts = torch.zeros_like(density, dtype=torch.bool)
    contacts[:2, 8:13] = True
    contacts[-2:, 2:7] = True
    contacts[-2:, 14:19] = True
    density = torch.where(contacts, torch.ones_like(density), density)
    epsilon = torch.ones(shape, dtype=theta.dtype, device=theta.device)
    xs, ys = design_slices(shape)
    cy = shape[1] // 2
    epsilon[:xs.start, cy-2:cy+3, :] = 4.0
    epsilon[xs.stop:, cy+4:cy+9, :] = 4.0
    epsilon[xs.stop:, cy-8:cy-3, :] = 4.0
    epsilon[xs, ys, :] = 1 + 3 * density[..., None]
    return epsilon, density


def evaluate(model, epsilon, project):
    planes = model(epsilon, [FREQUENCY_HZ])
    # Remove the common squared DFT timestep factor. Only relative flux is reported.
    powers = torch.stack([planes[name].flux()[0] for name in ("upper", "lower")]) / project.region.time_step**2
    if not bool(torch.isfinite(powers).all()) or bool((powers <= 0).any()):
        raise RuntimeError("Both apertures must carry finite positive forward flux.")
    return 4 * powers[0] * powers[1] / powers.sum(), powers


def export_project(project, epsilon, path):
    """Export a 64-level CAD approximation within the default workbench limits."""
    import matplotlib
    from matplotlib.colors import to_hex
    xs, ys = design_slices(project.region.shape)
    materials = [project.materials[0]]
    structures = [s for s in project.structures if s.id != "design-box"]
    patch = epsilon[xs, ys, 0]
    levels = np.clip(np.rint(63 * (patch-1)/3), 0, 63).astype(int)
    levels[:, 11:] = levels[:, :10][:, ::-1]
    names = {63: "guide"}
    for level in sorted(set(levels.ravel()) - {0, 63}):
        name = f"design-level-{level}"
        names[level] = name
        materials.append(Material(name=name, index=math.sqrt(1+3*level/63),
            color=to_hex(matplotlib.colormaps["viridis"](level/63))))
    for i in range(xs.start, xs.stop):
        for j in range(ys.start, ys.stop):
            level = levels[i-xs.start, j-ys.start]
            if level == 0:
                continue
            name = f"pixel-{i}-{j}"
            structures.append(Structure(id=name, name=name, material=names[level],
                center=(float(project.region.mesh_nodes[0][i]), float(project.region.mesh_nodes[1][j]), 0), size=(.1, .1, .1)))
    exported = Project.model_validate(project.model_copy(update={"materials": materials, "structures": structures}).model_dump())
    exported.save(path)
    return {"permittivity_levels": 64, "materials": len(materials), "structures": len(structures),
            "max_permittivity_difference": float(np.max(np.abs(1+3*levels/63-patch)))}


def view_project(project):
    view = project.model_copy(deep=True)
    # The 2D plane API uses x/y-normal observation lines. Collect Ez on x lines
    # to assemble a 2D image without enabling an unsupported z-normal plane.
    view.monitors = [FieldMonitor(id=f"view-{i}", normal="x", center=(float(x), 0, 0),
                                 size=(0, 4.0, .1), inherit_apodization=False)
                     for i, x in enumerate(np.linspace(-2.75, 2.75, 56))]
    return Project.model_validate(view.model_dump())


def field_image(project, epsilon):
    view = view_project(project)
    model = DifferentiablePlaneSimulation(view, AdjointOptions(checkpoints=4))
    with torch.no_grad():
        planes = model(epsilon, [FREQUENCY_HZ])
    first = planes[view.monitors[0].id]
    return {"field_ez": np.stack([planes[m.id].fields[0, :, 2].numpy() for m in view.monitors]),
            "field_x_um": np.array([m.center[0] for m in view.monitors]),
            "field_y_um": first.points_um[:, 1].numpy()}


def render(output, arrays, history, record):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.colors import PowerNorm
    from matplotlib.patches import Rectangle
    plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False})
    figure, axes = plt.subplots(2, 2, figsize=(11, 7.2), constrained_layout=True)
    for axis, key, title in zip(axes[0], ("initial_epsilon", "optimized_epsilon"), ("Initial 1x2 splitter", "Optimized square design region")):
        # Scalar Ez coefficients live on x/y Yee nodes, so center display pixels there.
        image = axis.imshow(arrays[key][..., 0].T, origin="lower", extent=(-3.25, 3.15, -2.45, 2.35), cmap="viridis", vmin=1, vmax=4, interpolation="nearest")
        axis.add_patch(Rectangle((-1.05, -1.05), 2.1, 2.1, fill=False, edgecolor="white", linestyle="--"))
        axis.plot([-2.2, -2.2], [-.25, .25], color="#ffad32", linewidth=3)
        axis.plot([2.2, 2.2], [.1, 1.1], color="#ee6666", linewidth=2)
        axis.plot([2.2, 2.2], [-1.1, -.1], color="#ee6666", linewidth=2)
        axis.set(title=title, xlabel="x (um)", ylabel="y (um)")
    axes[0, 0].text(-2.9, .45, "input", color="white")
    axes[0, 0].text(1.55, 1.3, "upper output", color="white")
    axes[0, 0].text(1.55, -1.6, "lower output", color="white")
    figure.colorbar(image, ax=axes[0].tolist(), label="Relative permittivity")
    intensity = np.abs(arrays["field_ez"])**2
    intensity /= intensity.max()
    field = axes[1, 0].pcolormesh(arrays["field_x_um"], arrays["field_y_um"], intensity.T,
                                 shading="nearest", cmap="inferno", norm=PowerNorm(.45, vmin=0, vmax=1))
    axes[1, 0].add_patch(Rectangle((-1.05, -1.05), 2.1, 2.1, fill=False, edgecolor="white", linestyle="--"))
    axes[1, 0].set(title="Computed Ez spectrum at 1.55 um", xlabel="x (um)", ylabel="y (um)", aspect="equal")
    figure.colorbar(field, ax=axes[1, 0], label="Normalized |Ez| squared")
    powers = np.asarray([entry["powers"] for entry in history])
    scale = powers[0].sum()
    axes[1, 1].plot(powers[:, 0]/scale, "o-", color="#007f86", label="upper aperture", markersize=3)
    axes[1, 1].plot(powers[:, 1]/scale, "^--", color="#df8f2d", label="lower aperture", markersize=3)
    axes[1, 1].plot(powers.sum(1)/scale, color="#2c3440", label="total captured flux")
    axes[1, 1].set(title="Measured output flux during optimization", xlabel="Adam update", ylabel="Flux / initial total flux")
    axes[1, 1].legend(fontsize=8)
    split = record["split_fraction"]
    axes[1, 1].text(.04, .96, f"Selected split: {100*split[0]:.2f}% / {100*split[1]:.2f}%", transform=axes[1, 1].transAxes, va="top", bbox={"facecolor": "white", "alpha": .85, "edgecolor": "none"})
    figure.savefig(output / "summary.png", dpi=150)
    plt.close(figure)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--iterations", type=int, default=20)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--output", type=Path, default=Path("results/adjoint-splitter"))
    parser.add_argument("--check-gradient", action="store_true")
    parser.add_argument("--render-only", action="store_true", help="Regenerate plots/CAD export from saved numerical results.")
    args = parser.parse_args()
    if args.iterations < 1:
        parser.error("--iterations must be positive")
    torch.set_num_threads(1)
    if args.render_only:
        record = json.loads((args.output / "result.json").read_text())
        with np.load(args.output / "design.npz") as saved:
            arrays = {key: saved[key] for key in saved.files}
        project = Project.load(args.output / "project.json")
        if "field_ez" not in arrays:
            arrays.update(field_image(project, torch.from_numpy(arrays["optimized_epsilon"])))
            np.savez_compressed(args.output / "design.npz", **arrays)
        record["cad_export"] = export_project(project, arrays["optimized_epsilon"], args.output / "optimized_project.json")
        record["render_driver_sha256"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
        (args.output / "result.json").write_text(json.dumps(record, indent=2)+"\n", encoding="utf-8")
        render(args.output, arrays, record["history"], record)
        return
    theta = torch.nn.Parameter(.02 * torch.randn((21, 11), generator=torch.Generator().manual_seed(args.seed), dtype=torch.float64))
    project, model = make_problem()
    optimizer = torch.optim.Adam([theta], lr=.2)
    output = args.output
    output.mkdir(parents=True, exist_ok=True)
    history, arrays, derivative, best = [], {}, None, None
    started = time.perf_counter()
    for iteration in range(args.iterations + 1):
        optimizer.zero_grad(set_to_none=True)
        epsilon, density = material(theta, project.region.shape)
        score, powers = evaluate(model, epsilon, project)
        value = float(score.detach())
        row = {"update": iteration, "score": value, "powers": powers.detach().tolist()}
        history.append(row)
        if iteration == 0:
            arrays["initial_epsilon"] = epsilon.detach().numpy().copy()
            arrays["initial_density"] = density.detach().numpy().copy()
        if best is None or value > best["score"]:
            best = row.copy()
            arrays["optimized_epsilon"] = epsilon.detach().numpy().copy()
            arrays["optimized_density"] = density.detach().numpy().copy()
            arrays["half_logits"] = theta.detach().numpy().copy()
        fraction = powers.detach() / powers.detach().sum()
        print(f"update {iteration:02d}: J/J0={value/history[0]['score']:.4f}, split={100*float(fraction[0]):.2f}/{100*float(fraction[1]):.2f}", flush=True)
        if iteration == args.iterations:
            break
        loss = -torch.log(score / history[0]["score"])
        loss.backward()
        if theta.grad is None or not bool(torch.isfinite(theta.grad).all()):
            raise RuntimeError("Nonfinite or missing adjoint gradient.")
        if iteration == 0 and args.check_gradient:
            index = int(theta.grad.abs().argmax())
            adjoint = float(theta.grad.flatten()[index])
            losses, step = [], 1e-4
            for sign in (-1, 1):
                trial = theta.detach().clone()
                trial.flatten()[index] += sign * step
                trial_score, _ = evaluate(model, material(trial, project.region.shape)[0], project)
                losses.append(float(-torch.log(trial_score / history[0]["score"])))
            finite_difference = (losses[1]-losses[0])/(2*step)
            error = abs(adjoint-finite_difference)/max(abs(adjoint), abs(finite_difference), 1e-12)
            derivative = {"parameter_flat_index": index, "step": step, "adjoint": adjoint, "finite_difference": finite_difference, "relative_error": error}
            if error > 1e-5:
                raise RuntimeError(f"Gradient check failed: {derivative}")
        optimizer.step()
    selected = torch.from_numpy(arrays["optimized_epsilon"])
    xs, ys = design_slices(project.region.shape)
    fixed = np.ones(project.region.shape, dtype=bool)
    fixed[xs, ys, :] = False
    np.testing.assert_array_equal(arrays["initial_epsilon"][fixed], arrays["optimized_epsilon"][fixed])
    arrays["flux_history"] = np.asarray([row["powers"] for row in history])
    arrays["score_history"] = np.asarray([row["score"] for row in history])
    np.savez_compressed(output / "design.npz", **arrays)
    project.save(output / "project.json")
    total = sum(best["powers"])
    record = {"torchfdtd_version": importlib.metadata.version("torchfdtd"), "torch_version": torch.__version__, "numpy_version": np.__version__,
              "backend": "cpu", "precision": "float64", "shape": project.region.shape, "steps": project.region.steps, "checkpoints": 4,
              "density_parameters": theta.numel(), "design_side_um": DESIGN_SIDE_UM, "guide_width_um": GUIDE_WIDTH_UM,
              "output_centers_y_um": [OUTPUT_Y_UM, -OUTPUT_Y_UM], "wavelength_um": WAVELENGTH_UM, "core_index": 2.0,
              "mirror_symmetric_design": True, "fixed_port_contacts": True, "seed": args.seed, "iterations": args.iterations,
              "objective": "4 * upper_flux * lower_flux / (upper_flux + lower_flux)", "history": history,
              "selected_iteration": best["update"], "initial_objective": history[0]["score"], "selected_objective": best["score"],
              "objective_ratio": best["score"]/history[0]["score"], "total_flux_ratio": total/sum(history[0]["powers"]),
              "split_fraction": [power/total for power in best["powers"]], "gradient_check": derivative,
              "fixed_guides_unchanged": True, "seconds": time.perf_counter()-started,
              "scope": "Spectral flux captured by two equal apertures. Not modal S-parameters or incident-normalized device efficiency.",
              "driver_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    (output / "result.json").write_text(json.dumps(record, indent=2)+"\n", encoding="utf-8")
    arrays.update(field_image(project, selected))
    np.savez_compressed(output / "design.npz", **arrays)
    record["cad_export"] = export_project(project, arrays["optimized_epsilon"], output / "optimized_project.json")
    (output / "result.json").write_text(json.dumps(record, indent=2)+"\n", encoding="utf-8")
    render(output, arrays, history, record)
    print(json.dumps(record, indent=2))


if __name__ == "__main__":
    main()
