param(
    [Parameter(Mandatory=$true)][string]$GpuHost,
    [string]$User = 'admin',
    [string]$RemoteRoot = 'C:/Users/admin/torchfdtd',
    [int]$LocalPort = 8766,
    [int]$RemotePort = 8765
)
$ErrorActionPreference = 'Stop'
$workspacePath = Split-Path -Parent $PSScriptRoot
$pythonPath = Join-Path $workspacePath '.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $pythonPath)) { throw 'Create the local .venv and install paramiko first.' }
if (-not $env:TORCHFDTD_SSH_PASSWORD) {
    $securePassword = Read-Host 'GPU workstation SSH password' -AsSecureString
    $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    try { $env:TORCHFDTD_SSH_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer) }
}
Push-Location -LiteralPath $workspacePath
try {
    New-Item -ItemType Directory -Path '.local' -Force | Out-Null
    try { $existing = Invoke-RestMethod -Uri "http://127.0.0.1:$LocalPort/api/health" -TimeoutSec 2 } catch { $existing = $null }
    if ($existing) { Write-Output "Already running: http://127.0.0.1:$LocalPort"; return }
    $tunnelArgs = "scripts/tunnel.py --host $GpuHost --user $User --port $LocalPort --remote-port $RemotePort --start-server --remote-root $RemoteRoot"
    $tunnelProcess = Start-Process -FilePath $pythonPath -ArgumentList $tunnelArgs -WorkingDirectory $workspacePath -WindowStyle Hidden -RedirectStandardOutput ".local/tunnel-$LocalPort.log" -RedirectStandardError ".local/tunnel-$LocalPort-error.log" -PassThru
    $tunnelProcess.Id | Set-Content -LiteralPath ".local/tunnel-$LocalPort.pid"
    Write-Output "Open http://127.0.0.1:$LocalPort (SSH tunnel PID $($tunnelProcess.Id))."
} finally {
    Remove-Item Env:TORCHFDTD_SSH_PASSWORD -ErrorAction SilentlyContinue
    Pop-Location
}
