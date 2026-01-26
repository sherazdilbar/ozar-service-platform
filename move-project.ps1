# Move Ozar Project from OneDrive to Local Storage
# This script safely moves the project while preserving all files

$source = "C:\Users\justf\OneDrive\Desktop\ozar"
$destination = "C:\Projects\ozar"

Write-Host "🚀 Moving Ozar Project to Local Storage" -ForegroundColor Cyan
Write-Host "From: $source" -ForegroundColor Yellow
Write-Host "To: $destination" -ForegroundColor Green
Write-Host ""

# Check if source exists
if (-not (Test-Path $source)) {
    Write-Host "❌ Source directory not found: $source" -ForegroundColor Red
    exit 1
}

# Create destination parent directory if it doesn't exist
$destParent = Split-Path $destination -Parent
if (-not (Test-Path $destParent)) {
    Write-Host "📁 Creating directory: $destParent" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $destParent -Force | Out-Null
}

# Check if destination already exists
if (Test-Path $destination) {
    Write-Host "⚠️  Destination already exists: $destination" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "❌ Operation cancelled" -ForegroundColor Red
        exit 1
    }
    Write-Host "🗑️  Removing existing destination..." -ForegroundColor Yellow
    Remove-Item -Path $destination -Recurse -Force
}

# Copy the project
Write-Host "📦 Copying project files..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray

try {
    # Use robocopy for better performance and progress
    $robocopyArgs = @(
        $source,
        $destination,
        "/E",           # Copy subdirectories, including empty ones
        "/MT:8",        # Multi-threaded (8 threads)
        "/R:2",         # Retry 2 times on failed copies
        "/W:5",         # Wait 5 seconds between retries
        "/NFL",         # No file list
        "/NDL",         # No directory list
        "/NP",          # No progress percentage
        "/XD", "node_modules", ".next", "dist", "build", ".git"  # Exclude these directories initially
    )
    
    $result = robocopy @robocopyArgs
    
    # Robocopy exit codes: 0-7 are success, 8+ are errors
    if ($LASTEXITCODE -ge 8) {
        throw "Robocopy failed with exit code: $LASTEXITCODE"
    }
    
    Write-Host "✅ Project files copied successfully!" -ForegroundColor Green
    
    # Verify the copy
    Write-Host ""
    Write-Host "📊 Verifying copy..." -ForegroundColor Cyan
    $sourceSize = (Get-ChildItem -Path $source -Recurse -File -Exclude "node_modules",".next","dist","build" | Measure-Object -Property Length -Sum).Sum
    $destSize = (Get-ChildItem -Path $destination -Recurse -File | Measure-Object -Property Length -Sum).Sum
    
    Write-Host "Source size: $([math]::Round($sourceSize/1MB, 2)) MB" -ForegroundColor Gray
    Write-Host "Destination size: $([math]::Round($destSize/1MB, 2)) MB" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "✅ Project successfully moved to: $destination" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open the new location in your editor" -ForegroundColor White
    Write-Host "2. Run 'npm install' in the root directory" -ForegroundColor White
    Write-Host "3. Run 'npm install' in apps/web and apps/backend" -ForegroundColor White
    Write-Host "4. Update any absolute paths in your configuration" -ForegroundColor White
    Write-Host ""
    Write-Host "🗑️  You can safely delete the OneDrive folder after verifying everything works" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error during copy: $_" -ForegroundColor Red
    exit 1
}
