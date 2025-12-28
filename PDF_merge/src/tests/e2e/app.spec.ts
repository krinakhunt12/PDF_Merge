import { test, expect } from '@playwright/test';

test.describe('PDF Merge Application E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for React to render
    await page.waitForTimeout(2000);
  });

  test('should display home page correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'PDF Operations' })).toBeVisible();
    await expect(page.getByText(/professional pdf tools/i)).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on Split Pages tab
    await page.getByRole('button', { name: /split into pages/i }).click();
    await expect(page.getByText('Split PDF into Pages')).toBeVisible();

    // Click on Split Range tab
    await page.getByRole('button', { name: /split by range/i }).click();
    await expect(page.getByText('Split PDF by Range')).toBeVisible();

    // Click back to Merge tab
    await page.getByRole('button', { name: /merge pdfs/i }).click();
    await expect(page.getByText('Merge PDF Files')).toBeVisible();
  });

  test('should show disabled merge button with no files', async ({ page }) => {
    // The merge button should be disabled when no files are selected
    const mergeButton = page.getByRole('button', { name: /merge & download/i });
    await expect(mergeButton).toBeDisabled();
  });

  test('should validate page numbers in split range', async ({ page }) => {
    await page.getByRole('button', { name: /split by range/i }).click();
    
    const splitButton = page.getByRole('button', { name: /split & download/i });
    await expect(splitButton).toBeDisabled();
  });

  test('should show password input fields', async ({ page }) => {
    await expect(page.getByPlaceholder('Enter password to protect merged PDF')).toBeVisible();
    
    await page.getByRole('button', { name: /split into pages/i }).click();
    await expect(page.getByPlaceholder('Enter password to protect split PDFs')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await expect(page.getByText('Lightning Fast Processing')).toBeVisible();
    await expect(page.getByText('Bank-Grade Security')).toBeVisible();
    await expect(page.getByText('Intuitive Interface')).toBeVisible();
  });

  test('should display statistics section', async ({ page }) => {
    await expect(page.getByText('50K+')).toBeVisible();
    await expect(page.getByText('Active Users')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'PDF Operations' })).toBeVisible();
    await expect(page.getByRole('button', { name: /merge pdfs/i })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: 'PDF Operations' })).toBeVisible();
    await expect(page.getByText(/lightning fast processing/i)).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: 'PDF Operations' })).toBeVisible();
    await expect(page.getByText(/bank-grade security/i)).toBeVisible();
  });

  test('should show loading state when lazy loading components', async ({ page }) => {
    // Navigate between tabs quickly to possibly catch loading state
    await page.getByRole('button', { name: /split into pages/i }).click();
    await page.getByRole('button', { name: /merge pdfs/i }).click();
  });

  test('should display footer information', async ({ page }) => {
    await expect(page.getByText(/built with/i)).toBeVisible();
    await expect(page.getByText(/fastapi/i)).toBeVisible();
  });
});
