# Quick Installation Script

# Navigate to project directory
Set-Location "d:\Python Project\PDF merge\PDF_merge"

# Install all dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Green
npm install

# Install testing dependencies
Write-Host "`nInstalling testing dependencies..." -ForegroundColor Green
npm install -D vitest@latest `
  @vitest/ui@latest `
  @testing-library/react@latest `
  @testing-library/jest-dom@latest `
  @testing-library/user-event@latest `
  jsdom@latest `
  @playwright/test@latest `
  @vitest/coverage-v8@latest

# Install Playwright browsers
Write-Host "`nInstalling Playwright browsers..." -ForegroundColor Green
npx playwright install

Write-Host "`n✅ Installation complete!" -ForegroundColor Green
Write-Host "`nYou can now run:" -ForegroundColor Cyan
Write-Host "  npm run dev          - Start development server" -ForegroundColor Yellow
Write-Host "  npm test             - Run unit tests" -ForegroundColor Yellow
Write-Host "  npm run test:ui      - Run tests with UI" -ForegroundColor Yellow
Write-Host "  npm run test:e2e     - Run E2E tests" -ForegroundColor Yellow
Write-Host "  npm run test:coverage - Generate coverage report" -ForegroundColor Yellow
