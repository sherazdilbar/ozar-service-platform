#!/bin/bash

# Ozar Platform - Comprehensive Test Script
# This script runs all tests and checks across the platform

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Ozar Platform Test Suite            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to print section header
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}Running: ${test_name}${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED: ${test_name}${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED: ${test_name}${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local url=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}Checking: ${service_name}${NC}"
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ RUNNING: ${service_name}${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ NOT RUNNING: ${service_name}${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# ============================================
# 1. Environment Checks
# ============================================
print_section "1. Environment Checks"

run_test "Node.js installed" "node --version"
run_test "npm installed" "npm --version"
run_test "PostgreSQL accessible" "pg_isready"

# ============================================
# 2. Backend Tests
# ============================================
print_section "2. Backend Tests"

cd apps/backend

run_test "Backend dependencies installed" "test -d node_modules"
run_test "Backend TypeScript compiles" "npm run build"
run_test "Prisma client generated" "test -d node_modules/.prisma"
run_test "Backend unit tests" "npm run test"

# Check if backend is running
check_service "Backend API" "http://localhost:4000/api/v1/health"

cd ../..

# ============================================
# 3. Web App Tests
# ============================================
print_section "3. Web App Tests"

cd apps/web

run_test "Web dependencies installed" "test -d node_modules"
run_test "Web TypeScript compiles" "npm run build"
run_test "Web linting passes" "npm run lint"

# Check if web app is running
check_service "Web App" "http://localhost:3000"

cd ../..

# ============================================
# 4. Mobile App Tests
# ============================================
print_section "4. Mobile App Tests"

cd apps/mobile

run_test "Mobile dependencies installed" "test -d node_modules"
run_test "Mobile TypeScript compiles" "npx tsc --noEmit"

cd ../..

# ============================================
# 5. Database Tests
# ============================================
print_section "5. Database Tests"

cd apps/backend

run_test "Database connection" "npx prisma db execute --stdin <<< 'SELECT 1;'"
run_test "Database migrations up to date" "npx prisma migrate status"

cd ../..

# ============================================
# 6. API Endpoint Tests
# ============================================
print_section "6. API Endpoint Tests"

# Test authentication endpoints
run_test "Login endpoint" "curl -s -X POST http://localhost:4000/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"customer@demo.com\",\"password\":\"password123\"}' | grep -q 'access_token'"

# Test public endpoints
run_test "Categories endpoint" "curl -s http://localhost:4000/api/v1/categories | grep -q 'PLUMBING'"
run_test "Pros list endpoint" "curl -s http://localhost:4000/api/v1/pros | grep -q 'data'"

# ============================================
# 7. Code Quality Checks
# ============================================
print_section "7. Code Quality Checks"

# Backend code quality
cd apps/backend
run_test "Backend: No console.log in src" "! grep -r 'console.log' src/ --include='*.ts' --exclude-dir=node_modules"
run_test "Backend: No TODO comments" "! grep -r 'TODO' src/ --include='*.ts' --exclude-dir=node_modules"
cd ../..

# Web code quality
cd apps/web
run_test "Web: No console.log in src" "! grep -r 'console.log' src/ --include='*.tsx' --include='*.ts' --exclude-dir=node_modules"
cd ../..

# ============================================
# 8. Security Checks
# ============================================
print_section "8. Security Checks"

cd apps/backend
run_test "No hardcoded secrets in backend" "! grep -r 'password.*=.*['\"]' src/ --include='*.ts' --exclude-dir=node_modules"
run_test "JWT_SECRET in .env" "grep -q 'JWT_SECRET' .env"
cd ../..

cd apps/web
run_test "No API keys in web source" "! grep -r 'sk_.*['\"]' src/ --include='*.tsx' --include='*.ts' --exclude-dir=node_modules"
cd ../..

# ============================================
# 9. Performance Checks
# ============================================
print_section "9. Performance Checks"

# Check bundle sizes
cd apps/web
if [ -d ".next" ]; then
    BUNDLE_SIZE=$(du -sh .next | cut -f1)
    echo -e "${YELLOW}Web bundle size: ${BUNDLE_SIZE}${NC}"
fi
cd ../..

# ============================================
# 10. Documentation Checks
# ============================================
print_section "10. Documentation Checks"

run_test "README.md exists" "test -f README.md"
run_test "API documentation exists" "test -f instructions/API_CONTRACT.md"
run_test "Testing guide exists" "test -f instructions/TESTING_GUIDE.md"

# ============================================
# Summary
# ============================================
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Test Summary                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Total Tests:  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed:       ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed:       ${FAILED_TESTS}${NC}"
echo ""

# Calculate percentage
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Success Rate: ${PERCENTAGE}%"
    echo ""
    
    if [ $PERCENTAGE -eq 100 ]; then
        echo -e "${GREEN}🎉 All tests passed! Ready for deployment!${NC}"
        exit 0
    elif [ $PERCENTAGE -ge 80 ]; then
        echo -e "${YELLOW}⚠️  Most tests passed, but some issues need attention.${NC}"
        exit 1
    else
        echo -e "${RED}❌ Many tests failed. Please fix issues before deployment.${NC}"
        exit 1
    fi
else
    echo -e "${RED}No tests were run.${NC}"
    exit 1
fi
