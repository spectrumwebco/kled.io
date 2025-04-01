# Windows Installer Validation Script for Kled Desktop
# This script validates the Windows installer for Kled Desktop

param (
    [Parameter(Mandatory=$true)]
    [string]$InstallerPath
)

Write-Host "Validating Kled Desktop Windows installer at: $InstallerPath"

# Check if installer file exists
if (-not (Test-Path -Path $InstallerPath)) {
    Write-Host "Error: Installer file not found at $InstallerPath" -ForegroundColor Red
    exit 1
}

# Get file information
$fileInfo = Get-Item $InstallerPath
Write-Host "Installer file size: $($fileInfo.Length) bytes" -ForegroundColor Green
Write-Host "Installer created: $($fileInfo.CreationTime)" -ForegroundColor Green

# Check file signature (optional, requires signtool.exe)
try {
    $signtoolPath = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64\signtool.exe"
    if (Test-Path $signtoolPath) {
        $signResult = & $signtoolPath verify /pa $InstallerPath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Installer signature is valid" -ForegroundColor Green
        } else {
            Write-Host "Installer signature validation failed or not signed" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Signtool not found, skipping signature validation" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error checking signature: $_" -ForegroundColor Yellow
}

# Test installer extraction (silent mode)
Write-Host "Testing installer extraction..."
$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    # Extract installer (this is for NSIS-based installers, adjust if using different format)
    $extractArgs = @("/SILENT", "/NOCANCEL", "/NORESTART", "/SUPPRESSMSGBOXES", "/DIR=`"$tempDir`"")
    Start-Process -FilePath $InstallerPath -ArgumentList $extractArgs -Wait
    
    # Check if extraction succeeded
    if (Test-Path -Path "$tempDir\Kled Desktop.exe") {
        Write-Host "Installer extraction successful" -ForegroundColor Green
    } else {
        Write-Host "Installer extraction failed - executable not found" -ForegroundColor Red
    }
    
    # Check for critical files
    $criticalFiles = @(
        "Kled Desktop.exe",
        "resources.pak",
        "LICENSE"
    )
    
    foreach ($file in $criticalFiles) {
        if (Test-Path -Path "$tempDir\$file") {
            Write-Host "Found critical file: $file" -ForegroundColor Green
        } else {
            Write-Host "Missing critical file: $file" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "Error during extraction test: $_" -ForegroundColor Red
} finally {
    # Clean up
    if (Test-Path -Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
    }
}

Write-Host "Validation complete" -ForegroundColor Green
