"""Small CPU adjoint inverse design using an installed TorchFDTD package.

Maximize the mean squared Ez at one target by optimizing a continuous
dielectric region. This point-field objective is not normalized efficiency.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.metadata
import json
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F

from torchfdtd import AdjointOptions, DifferentiableSimulation, Monitor, Project, Region, Source


def make_problem():
    project = Project(
        name="Adjoint dielectric design",
        region=Region(dimension="2d", size=(4.8, 4.0, .1), mesh=.1,
                      pml_cells=4, steps=160, precision="float64", backend="cpu"),
        sources=[Source(center=(-1.5, 0, 0), wavelength=1.0, pulse_cycles=2, component="Ez")],
        monitors=[Monitor(name="target", center=(1.5, .5, 0), component="Ez")],
    )
    model = DifferentiableSimulation(project, AdjointOptions(checkpoints=4))
    return project, model


def material(theta, shape):
    density = torch.sigmoid(theta)
    density = F.avg_pool2d(F.pad(density[None, None], (1, 1, 1, 1), mode="replicate"), 3, stride=1)[0, 0]
    epsilon = torch.ones(shape, dtype=theta.dtype, device=theta.device)
    epsilon[16:32, 12:28, :] = 1 + 1.25 * density[..., None]
    return epsilon, density


def render(output, arrays, history, project):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.patches import Rectangle

    plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False})
    figure, axes = plt.subplots(2, 2, figsize=(10.5, 7.0), constrained_layout=True)
    for axis, key, title in zip(axes[0], ("initialepsilon", "finalepsilon"), ("Initial dielectric", "Optimized dielectric")):
        image = axis.imshow(arrays[key][..., 0].T, origin="lower", extent=(-2.4, 2.4, -2, 2),
                            cmap="viridis", vmin=1, vmax=2.25, interpolation="nearest")
        axis.add_patch(Rectangle((-.8, -.8), 1.6, 1.6, fill=False, edgecolor="white", linewidth=1))
        axis.scatter([-1.5], [0], marker="o", c="#f8d24b", edgecolors="black", s=45, label="source")
        axis.scatter([1.5], [.5], marker="*", c="#ff6b6b", edgecolors="black", s=90, label="target")
        axis.set(title=title, xlabel="x (um)", ylabel="y (um)")
    axes[0, 0].legend(loc="upper left", fontsize=8)
    figure.colorbar(image, ax=axes[0].tolist(), label="Relative permittivity")
    axes[1, 0].plot(np.arange(len(history)), np.asarray(history) / history[0], "o-", color="#007f86", markersize=4)
    axes[1, 0].set(xlabel="Adam update", ylabel="Point-field objective J / J0", title="Measured adjoint optimization")
    t_fs = (np.arange(project.region.steps) + 1) * project.region.time_step * 1e15
    axes[1, 1].plot(t_fs, arrays["initialsignals"][:, 0], label="initial", color="#7a8593")
    axes[1, 1].plot(t_fs, arrays["finalsignals"][:, 0], label="optimized", color="#007f86")
    axes[1, 1].set(xlabel="Time (fs)", ylabel="Target Ez (a.u.)", title="Same source, mesh and time window")
    axes[1, 1].legend()
    figure.savefig(output / "summary.png", dpi=150)
    plt.close(figure)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--iterations", type=int, default=12)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--output", type=Path, default=Path("results/adjoint-inverse-design"))
    parser.add_argument("--check-gradient", action="store_true", help="Compare one adjoint derivative with a central finite difference.")
    args = parser.parse_args()
    if args.iterations < 1:
        parser.error("--iterations must be positive")
    torch.set_num_threads(1)
    generator = torch.Generator().manual_seed(args.seed)
    theta = torch.nn.Parameter(.02 * torch.randn((16, 16), generator=generator, dtype=torch.float64))
    project, model = make_problem()
    optimizer = torch.optim.Adam([theta], lr=.25)
    output = args.output
    output.mkdir(parents=True, exist_ok=True)
    history, arrays, derivative = [], {}, None
    started = time.perf_counter()
    for iteration in range(args.iterations + 1):
        optimizer.zero_grad(set_to_none=True)
        epsilon, density = material(theta, project.region.shape)
        result = model(epsilon)
        score = result.signals[:, 0].square().mean()
        value = float(score.detach())
        if not np.isfinite(value) or value <= 0:
            raise RuntimeError("The point-field objective must be finite and positive.")
        history.append(value)
        if iteration in (0, args.iterations):
            prefix = "initial" if iteration == 0 else "final"
            arrays[prefix + "epsilon"] = epsilon.detach().numpy().copy()
            arrays[prefix + "density"] = density.detach().numpy().copy()
            arrays[prefix + "signals"] = result.signals.detach().numpy().copy()
        print(f"update {iteration:02d}: J={value:.9g}, J/J0={value/history[0]:.4f}", flush=True)
        if iteration == args.iterations:
            break
        loss = -torch.log(score)
        loss.backward()  # TorchFDTD's discrete adjoint, followed by the density/filter chain.
        if theta.grad is None or not bool(torch.isfinite(theta.grad).all()):
            raise RuntimeError("The adjoint returned a missing or nonfinite density gradient.")
        if iteration == 0 and args.check_gradient:
            index = int(theta.grad.abs().argmax())
            adjoint = float(theta.grad.flatten()[index])
            base = theta.detach().clone()
            losses = []
            step = 1e-4
            for sign in (-1, 1):
                perturbed = base.clone()
                perturbed.flatten()[index] += sign * step
                trial = model(material(perturbed, project.region.shape)[0])
                losses.append(float(-torch.log(trial.signals[:, 0].square().mean())))
            finite_difference = (losses[1] - losses[0]) / (2 * step)
            relative_error = abs(adjoint - finite_difference) / max(abs(adjoint), abs(finite_difference), 1e-12)
            derivative = {"parameter_flat_index": index, "step": step, "adjoint": adjoint,
                          "finite_difference": finite_difference, "relative_error": relative_error}
            if relative_error > 1e-5:
                raise RuntimeError(f"Adjoint finite-difference check failed: {derivative}")
        optimizer.step()
    arrays["objective"] = np.asarray(history)
    np.savez_compressed(output / "design.npz", **arrays)
    project.save(output / "project.json")
    record = {"torchfdtd_version": importlib.metadata.version("torchfdtd"), "torch_version": torch.__version__,
              "backend": "cpu", "precision": "float64", "shape": project.region.shape, "steps": project.region.steps,
              "checkpoints": 4, "density_parameters": theta.numel(), "seed": args.seed, "iterations": args.iterations,
              "objective": "Mean squared Ez at one point, without power normalization", "history": history,
              "initial_objective": history[0], "final_objective": history[-1], "objective_ratio": history[-1]/history[0],
              "gradient_check": derivative, "seconds": time.perf_counter() - started,
              "driver_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    (output / "result.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    render(output, arrays, history, project)
    print(json.dumps(record, indent=2))


if __name__ == "__main__":
    main()
