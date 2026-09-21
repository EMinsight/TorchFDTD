"""Combine a crashed and a resumed beyond-VRAM run with whole-machine counters.

Inputs are the driver record of the run that exited after a published backward
record, the driver record of the run that resumed it, and the CSV written by
scripts/sample_system_counters.ps1. The output is a sanitized evidence record:
absolute machine paths are dropped, timings and peaks are kept, and system-wide
memory and disk figures come from the performance counters, which include the
OS file cache and every other process on the machine.

python -m benchmarks.report_beyond_vram_restart --killed runA.json --resumed runB.json \
    --counters counters.csv --total-ram-gib 127.7 --output docs/validation/beyond_vram_restart_5880.json
"""
import argparse
import csv
import hashlib
import json
from datetime import datetime
from pathlib import Path

PRIVATE = {'scratch_directory', 'restart_journal'}


def sanitize(record):
    clean = {k: v for k, v in record.items() if k not in PRIVATE}
    clean['restart_journal_configured'] = bool(record.get('restart_journal'))
    report = dict(clean.get('report') or {})
    for key in ('restart_journal',):
        report.pop(key, None)
    clean['report'] = report
    return clean


def parse_timestamp(text):
    """Parse a PowerShell round-trip timestamp, whose fraction can exceed six digits."""
    head, _, tail = text.partition('.')
    if not tail:
        return datetime.fromisoformat(text)
    digits = ''
    while tail and tail[0].isdigit():
        digits += tail[0]
        tail = tail[1:]
    return datetime.fromisoformat(head + '.' + (digits + '000000')[:6] + tail)


def load_counters(path):
    rows = []
    with open(path, encoding='utf-8-sig') as handle:
        reader = csv.reader(handle)
        header = next(reader)
        for row in reader:
            if len(row) != len(header) or row[1] == 'error':
                continue
            try:
                values = [float(v) for v in row[1:]]
            except ValueError:
                continue
            rows.append((parse_timestamp(row[0]), values))
    return header[1:], rows


def summarize_counters(header, rows, total_ram_bytes):
    def column(fragment):
        matches = [i for i, name in enumerate(header) if fragment in name]
        if len(matches) != 1:
            raise ValueError(f'counter column for {fragment!r} is not unique in {header}')
        return matches[0]
    available = [v[column('Available_Bytes')] for _, v in rows]
    cache = [v[column('Memory_Cache_Bytes')] for _, v in rows]
    committed = [v[column('Committed_Bytes')] for _, v in rows]
    standby = [v[column('Standby_Cache')] for _, v in rows]
    reads = [v[column('Disk_Read_Bytes')] for _, v in rows]
    writes = [v[column('Disk_Write_Bytes')] for _, v in rows]
    cpu = [v[column('Processor_Time')] for _, v in rows]
    seconds = [(rows[i + 1][0] - rows[i][0]).total_seconds() for i in range(len(rows) - 1)]
    read_total = sum(r * s for r, s in zip(reads, seconds))
    write_total = sum(w * s for w, s in zip(writes, seconds))
    span = (rows[-1][0] - rows[0][0]).total_seconds()
    return dict(
        samples=len(rows), span_seconds=span, first_sample=rows[0][0].isoformat(), last_sample=rows[-1][0].isoformat(),
        total_ram_bytes=total_ram_bytes,
        min_available_bytes=min(available), peak_system_in_use_bytes=total_ram_bytes - min(available),
        max_cache_bytes=max(cache), max_standby_cache_bytes=max(standby), max_committed_bytes=max(committed),
        mean_read_bytes_per_second=sum(reads) / len(reads), max_read_bytes_per_second=max(reads),
        mean_write_bytes_per_second=sum(writes) / len(writes), max_write_bytes_per_second=max(writes),
        integrated_read_bytes=read_total, integrated_write_bytes=write_total,
        mean_cpu_percent=sum(cpu) / len(cpu), max_cpu_percent=max(cpu),
        scope='Whole-machine Windows performance counters sampled every five seconds: OS file cache and every process '
              'are included, so peak_system_in_use is an upper bound on what this run added to the machine. '
              'Integrated bytes are rate times sampling interval, not a byte-exact I/O count.')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--killed', required=True)
    parser.add_argument('--resumed', required=True)
    parser.add_argument('--counters', required=True)
    parser.add_argument('--total-ram-gib', type=float, required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    killed = json.loads(Path(args.killed).read_text(encoding='utf-8'))
    resumed = json.loads(Path(args.resumed).read_text(encoding='utf-8'))
    assert killed['stage'] == 'killed_after_backward_record', killed['stage']
    assert resumed['stage'] == 'forward_backward_validated', resumed['stage']
    assert resumed['report'].get('forward_resumed_from_block') == 'complete'
    assert resumed['report'].get('backward_resumed_from_block') is not None
    for key in ('grid', 'steps', 'precision', 'eh_bytes', 'checkpoints', 'restart_every_blocks'):
        assert killed[key] == resumed[key], key
    header, rows = load_counters(args.counters)
    counters = summarize_counters(header, rows, int(args.total_ram_gib * 1024 ** 3))
    record = dict(
        scope='One crash-and-resume measurement of a real FP32 streamed adjoint whose E/H state exceeds physical VRAM. '
              'The first process exited abruptly right after publishing its first backward record; a second process '
              'resumed from the journal and its gradient was validated against the causal-cone oracle. This measures '
              'recovery on this machine and policy, not sustained application throughput or competitor speed.',
        grid=resumed['grid'], cells=int(resumed['grid'][0] * resumed['grid'][1] * resumed['grid'][2]),
        steps=resumed['steps'], precision=resumed['precision'], eh_bytes=resumed['eh_bytes'],
        state_bytes=resumed['report']['state_bytes'], physical_vram_bytes=resumed['physical_vram_bytes'],
        physical_vram_exceeded=resumed['physical_vram_exceeded'], hardware=resumed['hardware'],
        policy=dict(slab_width=resumed['report'].get('slab_width'), temporal_depth=resumed['report'].get('temporal_depth'),
                    checkpoints=resumed['checkpoints'], restart_every_blocks=resumed['restart_every_blocks'],
                    reservation=resumed['reservation']),
        killed_run=dict(elapsed_seconds=killed['elapsed_seconds'], forward_seconds=killed.get('forward_seconds'),
                        killed_after_backward_records=killed['killed_after_backward_records'],
                        peak_process_rss_bytes=killed['peak_process_rss_bytes'],
                        journal_records_written=killed['report'].get('journal_records_written'),
                        forward_journal_seconds=killed['report'].get('journal_seconds'),
                        signals_relative_l2=None),
        resumed_run=dict(elapsed_seconds=resumed['elapsed_seconds'], forward_seconds=resumed['forward_seconds'],
                         backward_seconds=resumed['report']['backward_seconds'],
                         forward_resumed_from_block=resumed['report']['forward_resumed_from_block'],
                         backward_resumed_from_block=resumed['report']['backward_resumed_from_block'],
                         replayed_blocks=resumed['report']['replayed_blocks'],
                         journal_records_written=resumed['report'].get('journal_records_written'),
                         journal_seconds=resumed['report'].get('journal_seconds'),
                         peak_torch_cuda_bytes=resumed['peak_torch_cuda_bytes'], peak_process_rss_bytes=resumed['peak_process_rss_bytes'],
                         comparison_errors=resumed['comparison_errors'], tolerance=resumed['comparison_tolerance_relative_l2'],
                         gradient_norm=resumed['gradient_norm'],
                         backing=dict(forward=resumed['report']['forward_backing_store'], backward=resumed['report']['backward_backing_store'])),
        total_wall_seconds_both_processes=killed['elapsed_seconds'] + resumed['elapsed_seconds'],
        system_counters=counters,
        source_sha256=resumed['source_sha256'],
        driver_records=dict(killed=sanitize(killed), resumed=sanitize(resumed)))
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes((json.dumps(record, indent=2) + '\n').encode('utf-8'))
    summary = {k: v for k, v in record.items() if k not in ('driver_records', 'source_sha256', 'policy')}
    summary['record_sha256'] = hashlib.sha256(out.read_bytes()).hexdigest()
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
