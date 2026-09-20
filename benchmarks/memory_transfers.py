"""Small bounded host/device and file transfer probe, with cache scope recorded."""
import argparse
import json
from pathlib import Path
from torchfdtd import profile_memory_transfers


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--storage-directory',default='.local/memory-probe')
    args=parser.parse_args()
    report=profile_memory_transfers(storage_directory=args.storage_directory)
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps({'gpu':report['gpu']['name'],'h2d_GB_s':report['gpu']['h2d']['effective_bytes_per_second']/1e9,
                      'd2h_GB_s':report['gpu']['d2h']['effective_bytes_per_second']/1e9,
                      'host_GiB':report['host']['total_bytes']/2**30,'storage_scope':report['storage']['read_cache']}))


if __name__=='__main__':main()
