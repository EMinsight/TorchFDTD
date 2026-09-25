"""Record the GPU, driver, CUDA runtime, Torch, CuPy, Python and OS of this host.

The record is one JSON file under docs/validation/platforms/ and is the only
basis for a row of docs/PLATFORM_MATRIX.md: a platform without a record file
is "not recorded" there, never assumed. Nothing is executed on the GPU beyond
the memory query; this is an inventory, not a verification. The interpreter
path is written with the user's home directory replaced by ``<user home>``, so
a record never carries the account name.
"""
import argparse
import datetime
import json
import platform
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from record_gate_evidence import redact_home  # noqa: E402

RECORD_VERSION = 1
PLATFORMS_DIR = Path('docs') / 'validation' / 'platforms'


def nvidia_smi(query):
    try:
        completed = subprocess.run(['nvidia-smi', f'--query-gpu={query}', '--format=csv,noheader,nounits'],
                                   capture_output=True, text=True, timeout=30)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return [line.strip() for line in completed.stdout.splitlines() if line.strip()] if completed.returncode == 0 else None


def module_version(name):
    try:
        return getattr(__import__(name), '__version__', None)
    except Exception:  # noqa: BLE001 - an absent or broken optional dependency is recorded as absent.
        return None


def collect():
    import torch
    record = dict(
        record_version=RECORD_VERSION,
        recorded_at=datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat(),
        os=platform.platform(), machine=platform.machine(),
        python=sys.version.split()[0], python_executable=redact_home(sys.executable),
        torch=torch.__version__, cupy=module_version('cupy'), numpy=module_version('numpy'),
        cuda_runtime=torch.version.cuda, torch_cuda_available=bool(torch.cuda.is_available()),
        driver=None, gpus=[],
    )
    drivers = nvidia_smi('driver_version')
    if drivers:
        record['driver'] = drivers[0]
    if torch.cuda.is_available():
        for index in range(torch.cuda.device_count()):
            properties = torch.cuda.get_device_properties(index)
            with torch.cuda.device(index):
                free, total = torch.cuda.mem_get_info()
            record['gpus'].append(dict(index=index, name=properties.name,
                                       compute_capability=f'{properties.major}.{properties.minor}',
                                       total_memory_bytes=int(total), free_memory_bytes_at_record=int(free)))
    return record


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--id', required=True, help='platform id, also the record file name, for example rtx3060-win11-lab')
    parser.add_argument('--output', default=None, help='record path (default: docs/validation/platforms/<id>.json)')
    args = parser.parse_args(argv)
    record = dict(platform_id=args.id, **collect())
    output = Path(args.output) if args.output else Path(__file__).resolve().parents[1] / PLATFORMS_DIR / f'{args.id}.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    with open(output, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(json.dumps(record, indent=2) + '\n')
    gpus = ', '.join(f"{g['name']} (cc {g['compute_capability']})" for g in record['gpus']) or 'no CUDA device'
    print(f"{output}: {gpus}; driver {record['driver']}; CUDA runtime {record['cuda_runtime']}; torch {record['torch']}; "
          f"cupy {record['cupy']}; Python {record['python']}; {record['os']}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
