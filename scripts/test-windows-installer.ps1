# Windows Installer Testing Script for Kled Desktop
# This script downloads and tests the latest Kled Desktop installer for Windows

param (
    [Parameter(Mandatory=$false)]
    [string]$ReleaseTag = "latest",
    
    [Parameter(Mandatory=$false)]
    [string]$DownloadPath = "$env:TEMP\kled-installer"
)

# Create download directory if it doesn't exist
if (-not (Test-Path -Path $DownloadPath)) {
    New-Item -ItemType Directory -Path $DownloadPath | Out-Null
    Write-Host "Created download directory: $DownloadPath" -ForegroundColor Green
}

# Function to get the latest release or specific tag
function Get-KledRelease {
    param (
        [string]$Tag
    )
    
    Write-Host "Fetching release information for tag: $Tag" -ForegroundColor Cyan
    
    $headers = @{
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $apiUrl = if ($Tag -eq "latest") {
        "https://api.github.com/repos/spectrumwebco/kled.io/releases/latest"
    } else {
        "https://api.github.com/repos/spectrumwebco/kled.io/releases/tags/$Tag"
    }
    
    try {
        $release = Invoke-RestMethod -Uri $apiUrl -Headers $headers
        return $release
    } catch {
        Write-Host "Error fetching release information: $_" -ForegroundColor Red
        exit 1
    }
}

# Function to download the Windows installer
function Download-KledInstaller {
    param (
        [object]$Release
    )
    
    Write-Host "Looking for Windows installer in release assets..." -ForegroundColor Cyan
    
    $windowsAsset = $Release.assets | Where-Object { $_.name -like "*windows*.exe" } | Select-Object -First 1
    
    if (-not $windowsAsset) {
        Write-Host "No Windows installer found in release assets!" -ForegroundColor Red
        exit 1
    }
    
    $installerPath = Join-Path -Path $DownloadPath -ChildPath $windowsAsset.name
    
    Write-Host "Downloading Windows installer: $($windowsAsset.name)" -ForegroundColor Cyan
    Write-Host "Download URL: $($windowsAsset.browser_download_url)" -ForegroundColor Cyan
    
    try {
        Invoke-WebRequest -Uri $windowsAsset.browser_download_url -OutFile $installerPath
        Write-Host "Download complete: $installerPath" -ForegroundColor Green
        return $installerPath
    } catch {
        Write-Host "Error downloading installer: $_" -ForegroundColor Red
        exit 1
    }
}

# Function to test the installer
function Test-KledInstaller {
    param (
        [string]$InstallerPath
    )
    
    Write-Host "Testing installer: $InstallerPath" -ForegroundColor Cyan
    
    # Verify the installer exists
    if (-not (Test-Path -Path $InstallerPath)) {
        Write-Host "Installer file not found at $InstallerPath" -ForegroundColor Red
        exit 1
    }
    
    # Get file information
    $fileInfo = Get-Item $InstallerPath
    Write-Host "Installer file size: $($fileInfo.Length) bytes" -ForegroundColor Green
    Write-Host "Installer created: $($fileInfo.CreationTime)" -ForegroundColor Green
    
    # Test silent installation
    $installDir = Join-Path -Path $env:TEMP -ChildPath "KledDesktopTest"
    Write-Host "Testing silent installation to: $installDir" -ForegroundColor Cyan
    
    try {
        # Create installation directory
        if (Test-Path -Path $installDir) {
            Remove-Item -Path $installDir -Recurse -Force
        }
        New-Item -ItemType Directory -Path $installDir | Out-Null
        
        # Run installer silently
        $installArgs = @("/SILENT", "/NOCANCEL", "/NORESTART", "/SUPPRESSMSGBOXES", "/DIR=`"$installDir`"")
        Start-Process -FilePath $InstallerPath -ArgumentList $installArgs -Wait
        
        # Verify installation
        if (Test-Path -Path "$installDir\Kled Desktop.exe") {
            Write-Host "Installation successful!" -ForegroundColor Green
            
            # Check for critical files
            $criticalFiles = @(
                "Kled Desktop.exe",
                "resources.pak",
                "LICENSE"
            )
            
            foreach ($file in $criticalFiles) {
                if (Test-Path -Path "$installDir\$file") {
                    Write-Host "Found critical file: $file" -ForegroundColor Green
                } else {
                    Write-Host "Missing critical file: $file" -ForegroundColor Yellow
                }
            }
            
            # Test application launch (optional)
            Write-Host "Testing application launch..." -ForegroundColor Cyan
            try {
                $process = Start-Process -FilePath "$installDir\Kled Desktop.exe" -PassThru
                Start-Sleep -Seconds 5
                
                if (-not $process.HasExited) {
                    Write-Host "Application launched successfully!" -ForegroundColor Green
                    Stop-Process -Id $process.Id -Force
                } else {
                    Write-Host "Application launched but exited immediately with code: $($process.ExitCode)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "Error launching application: $_" -ForegroundColor Red
            }
        } else {
            Write-Host "Installation failed - executable not found" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error during installation test: $_" -ForegroundColor Red
    } finally {
        # Clean up
        if (Test-Path -Path $installDir) {
            Write-Host "Cleaning up test installation..." -ForegroundColor Cyan
            Remove-Item -Path $installDir -Recurse -Force
        }
    }
}

# Main execution
Write-Host "=== Kled Desktop Windows Installer Test ===" -ForegroundColor Cyan
Write-Host "Release Tag: $ReleaseTag" -ForegroundColor Cyan
Write-Host "Download Path: $DownloadPath" -ForegroundColor Cyan

$release = Get-KledRelease -Tag $ReleaseTag
Write-Host "Testing release: $($release.name) ($($release.tag_name))" -ForegroundColor Cyan

$installerPath = Download-KledInstaller -Release $release
Test-KledInstaller -InstallerPath $installerPath

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
