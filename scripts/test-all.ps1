# Ozar Platform - Comprehensive Test Script (PowerShell)
# This script runs all tests and checks across the platform

$ErrorActionPreference = "Continue"

# Colors for output
$RED = "Red"
$GREEN = "Green"
$YELLOW = "Yellow"
$BLUE = "Cyan"

# Counters
$TOTAL_TESTS = 0
$PASSED_TESTS = 0
$FAILED_TESTS = 0

function Print-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $BLUE
    Write-Host "  $Title" -ForegroundColor $BLUE
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $BLUE
    Write-Host ""
}

function Run-Test {
    param(
        [string]$TestName,
        [scriptblock]$TestCommand
    )
    
    $script:TOTAL_TESTS++
    Write-Host "Running: $TestName" -ForegroundColor $YELLOW
    
    try {
        $result = & $TestCommand 2>&1
        if ($LASTEXITCODE -eq 0 -or $result) {
            Write-Host "✓ PASSED: $TestName" -ForegroundColor $GREEN
            $script:PASSED_TESTS++
            return $true
        } else {
            Write-Host "✗ FAILED: $TestName" -ForegroundColor $RED
            $script:FAILED_TESTS++
            return $false
        }
    } catch {
        Write-Host "✗ FAILED: $TestName" -ForegroundColor $RED
        $script:FAILED_TESTS++
        return $false
    }
}

function Check-Service {
    param(
        [string]$ServiceName,
        [string]$Url
    )
    
    $script:TOTAL_TESTS++
    Write-Host "Checking: $ServiceName" -ForegroundColor $YELLOW
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ RUNNING: $ServiceName" -ForegroundColor $GREEN
            $script:PASSED_TESTS++
            return $true
        }
    } catch {
        Write-Host "✗ NOT RUNNING: $ServiceName" -ForegroundColor $RED
        $script:FAILED_TESTS++
        return $false
    }
}

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor $BLUE
Write-Host "║   Ozar Platform Test Suite            ║" -ForegroundColor $BLUE
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor $BLUE
Write-Host ""

# ============================================
# 1. Environment Checks
# ============================================
Print-Section "1. Environment Checks"

Run-Test "Node.js installed" { node --version }
Run-Test "npm installed" { npm --version }
Run-Test "PostgreSQL accessible" { 
    $result = & pg_isready 2>&1
    return $LASTEXITCODE -eq 0
}

# ============================================
# 2. Backend Tests
# ============================================
Print-Section "2. Backend Tests"

Push-Location apps/backend

Run-Test "Backend dependencies installed" { Test-Path "node_modules" }
Run-Test "Backend TypeScript compiles" { 
    npm run build
    return $LASTEXITCODE -eq 0
}
Run-Test "Prisma client generated" { Test-Path "node_modules/.prisma" }
Run-Test "Backend unit tests" { 
    npm run test
    return $LASTEXITCODE -eq 0
}

# Check if backend is running
Check-Service "Backend API" "http://localhost:4000/api/v1/health"

Pop-Location

# ============================================
# 3. Web App Tests
# ============================================
Print-Section "3. Web App Tests"

Push-Location apps/web

Run-Test "Web dependencies installed" { Test-Path "node_modules" }
Run-Test "Web TypeScript compiles" { 
    npm run build
    return $LASTEXITCODE -eq 0
}
Run-Test "Web linting passes" { 
    npm run lint
    return $LASTEXITCODE -eq 0
}

# Check if web app is running
Check-Service "Web App" "http://localhost:3000"

Pop-Location

# ============================================
# 4. Mobile App Tests
# ============================================
Print-Section "4. Mobile App Tests"

Push-Location apps/mobile

Run-Test "Mobile dependencies installed" { Test-Path "node_modules" }
Run-Test "Mobile TypeScript compiles" { 
    npx tsc --noEmit
    return $LASTEXITCODE -eq 0
}

Pop-Location

# ============================================
# 5. Database Tests
# ============================================
Print-Section "5. Database Tests"

Push-Location apps/backend

Run-Test "Database connection" { 
    $query = "SELECT 1;"
    $query | npx prisma db execute --stdin
    return $LASTEXITCODE -eq 0
}
Run-Test "Database migrations up to date" { 
    npx prisma migrate status
    return $LASTEXITCODE -eq 0
}

Pop-Location

# ============================================
# 6. API Endpoint Tests
# ============================================
Print-Section "6. API Endpoint Tests"

# Test authentication endpoints
Run-Test "Login endpoint" {
    $body = @{
        email = "customer@demo.com"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/login" `
            -Method Post `
            -Body $body `
            -ContentType "application/json" `
            -ErrorAction Stop
        return $response.access_token -ne $null
    } catch {
        return $false
    }
}

# Test public endpoints
Run-Test "Categories endpoint" {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/categories" -ErrorAction Stop
        return $response -match "PLUMBING"
    } catch {
        return $false
    }
}

Run-Test "Pros list endpoint" {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/pros" -ErrorAction Stop
        return $response.data -ne $null
    } catch {
        return $false
    }
}

# ============================================
# 7. Code Quality Checks
# ============================================
Print-Section "7. Code Quality Checks"

# Backend code quality
Push-Location apps/backend
Run-Test "Backend: No console.log in src" {
    $found = Select-String -Path "src\*.ts" -Pattern "console.log" -Recurse
    return $found.Count -eq 0
}
Run-Test "Backend: No TODO comments" {
    $found = Select-String -Path "src\*.ts" -Pattern "TODO" -Recurse
    return $found.Count -eq 0
}
Pop-Location

# Web code quality
Push-Location apps/web
Run-Test "Web: No console.log in src" {
    $found = Select-String -Path "src\*.tsx","src\*.ts" -Pattern "console.log" -Recurse
    return $found.Count -eq 0
}
Pop-Location

# ============================================
# 8. Security Checks
# ============================================
Print-Section "8. Security Checks"

Push-Location apps/backend
Run-Test "No hardcoded secrets in backend" {
    $found = Select-String -Path "src\*.ts" -Pattern "password.*=.*['\"]" -Recurse
    return $found.Count -eq 0
}
Run-Test "JWT_SECRET in .env" {
    return (Get-Content ".env" -ErrorAction SilentlyContinue) -match "JWT_SECRET"
}
Pop-Location

Push-Location apps/web
Run-Test "No API keys in web source" {
    $found = Select-String -Path "src\*.tsx","src\*.ts" -Pattern "sk_.*['\"]" -Recurse
    return $found.Count -eq 0
}
Pop-Location

# ============================================
# 9. Performance Checks
# ============================================
Print-Section "9. Performance Checks"

# Check bundle sizes
Push-Location apps/web
if (Test-Path ".next") {
    $size = (Get-ChildItem ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Web bundle size: $([math]::Round($size, 2)) MB" -ForegroundColor $YELLOW
}
Pop-Location

# ============================================
# 10. Documentation Checks
# ============================================
Print-Section "10. Documentation Checks"

Run-Test "README.md exists" { Test-Path "README.md" }
Run-Test "API documentation exists" { Test-Path "instructions/API_CONTRACT.md" }
Run-Test "Testing guide exists" { Test-Path "instructions/TESTING_GUIDE.md" }

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor $BLUE
Write-Host "║   Test Summary                         ║" -ForegroundColor $BLUE
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor $BLUE
Write-Host ""
Write-Host "Total Tests:  $TOTAL_TESTS"
Write-Host "Passed:       $PASSED_TESTS" -ForegroundColor $GREEN
Write-Host "Failed:       $FAILED_TESTS" -ForegroundColor $RED
Write-Host ""

# Calculate percentage
if ($TOTAL_TESTS -gt 0) {
    $PERCENTAGE = [math]::Round(($PASSED_TESTS / $TOTAL_TESTS) * 100, 0)
    Write-Host "Success Rate: $PERCENTAGE%"
    Write-Host ""
    
    if ($PERCENTAGE -eq 100) {
        Write-Host "🎉 All tests passed! Ready for deployment!" -ForegroundColor $GREEN
        exit 0
    } elseif ($PERCENTAGE -ge 80) {
        Write-Host "⚠️  Most tests passed, but some issues need attention." -ForegroundColor $YELLOW
        exit 1
    } else {
        Write-Host "❌ Many tests failed. Please fix issues before deployment." -ForegroundColor $RED
        exit 1
    }
} else {
    Write-Host "No tests were run." -ForegroundColor $RED
    exit 1
}
