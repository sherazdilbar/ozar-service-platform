#!/bin/bash
# Build script for DigitalOcean deployment

echo "Starting build process..."

# Copy shared package to node_modules
echo "Copying shared package..."
mkdir -p node_modules/@ozar
cp -r ../../packages/shared node_modules/@ozar/

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build NestJS app
echo "Building NestJS application..."
npx nest build

# Verify dist folder was created
if [ -d "dist" ]; then
  echo "✓ Build complete! dist folder created successfully"
  ls -la dist/
else
  echo "✗ ERROR: dist folder not found!"
  exit 1
fi
