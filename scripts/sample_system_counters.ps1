# Sample whole-machine memory and disk counters to a CSV until a stop file appears.
# Usage: powershell -NoProfile -File scripts/sample_system_counters.ps1 -Output counters.csv -StopFile stop.txt [-IntervalSeconds 5]
# These are Windows performance counters for the whole system, including the OS
# file cache and every process. They complement, and do not replace, the
# per-process RSS and Torch allocator peaks recorded by the benchmarks.
param(
    [Parameter(Mandatory = $true)][string]$Output,
    [Parameter(Mandatory = $true)][string]$StopFile,
    [int]$IntervalSeconds = 5
)
$ProgressPreference = 'SilentlyContinue'
$counters = @(
    '\Memory\Available Bytes',
    '\Memory\Cache Bytes',
    '\Memory\Committed Bytes',
    '\Memory\Standby Cache Normal Priority Bytes',
    '\PhysicalDisk(_Total)\Disk Read Bytes/sec',
    '\PhysicalDisk(_Total)\Disk Write Bytes/sec',
    '\PhysicalDisk(_Total)\Current Disk Queue Length',
    '\Processor(_Total)\% Processor Time'
)
$header = 'timestamp,' + (($counters | ForEach-Object { ($_ -replace '^\\', '') -replace '[\\ ,/%()]+', '_' }) -join ',')
Set-Content -Path $Output -Value $header -Encoding utf8
while (-not (Test-Path -LiteralPath $StopFile)) {
    try {
        $sample = Get-Counter -Counter $counters -SampleInterval 1 -MaxSamples 1 -ErrorAction Stop
        $values = $sample.CounterSamples | ForEach-Object { [string]([math]::Round($_.CookedValue, 3)) }
        $line = ((Get-Date).ToString('o')) + ',' + ($values -join ',')
        Add-Content -Path $Output -Value $line -Encoding utf8
    } catch {
        Add-Content -Path $Output -Value (((Get-Date).ToString('o')) + ',error,' + $_.Exception.Message.Replace(',', ';')) -Encoding utf8
    }
    Start-Sleep -Seconds ([math]::Max(1, $IntervalSeconds - 1))
}
