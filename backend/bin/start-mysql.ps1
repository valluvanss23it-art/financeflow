# Start MySQL service or launch mysqld from the given bin path.
$serviceName = 'MySQL96'
$binPath = 'C:\Program Files\MySQL\MySQL Server 9.6\bin'
$mysqld = Join-Path $binPath 'mysqld.exe'

Try {
    $svc = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if ($svc) {
        if ($svc.Status -ne 'Running') {
            Write-Output "Starting Windows service: $serviceName"
            Start-Service -Name $serviceName -ErrorAction Stop
            Write-Output "Service $serviceName started"
        } else {
            Write-Output "Service $serviceName is already running"
        }
        exit 0
    }

    if (Test-Path $mysqld) {
        Write-Output "Service $serviceName not found. Launching mysqld from: $mysqld"
        $proc = Start-Process -FilePath $mysqld -NoNewWindow -PassThru -WindowStyle Hidden
        Write-Output "Started mysqld with PID $($proc.Id)"
        exit 0
    }

    Write-Error "Neither Windows service '$serviceName' found nor mysqld present at $mysqld"
    exit 1
} Catch {
    Write-Error "Error starting MySQL: $($_.Exception.Message)"
    exit 1
}
