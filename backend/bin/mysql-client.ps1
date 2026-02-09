# Launch the MySQL client from the provided bin path using environment variables.
$binPath = 'C:\Program Files\MySQL\MySQL Server 8.0\bin'
$mysqlExe = Join-Path $binPath 'mysql.exe'

if (-not (Test-Path $mysqlExe)) {
    Write-Error "mysql.exe not found at $mysqlExe"
    exit 1
}

# Build connection args from env vars, falling back to defaults
$host = $env:MYSQL_HOST -or 'localhost'
$port = $env:MYSQL_PORT -or '3306'
$user = $env:MYSQL_USER -or 'root'
$pass = $env:MYSQL_PASSWORD
$db   = $env:MYSQL_DATABASE -or ''

$args = @('-h', $host, '-P', $port, '-u', $user)
if ($pass) { $args += "-p$pass" }
if ($db) { $args += $db }

Write-Output "Running: $mysqlExe $($args -join ' ')"
Start-Process -FilePath $mysqlExe -ArgumentList $args -NoNewWindow -Wait
