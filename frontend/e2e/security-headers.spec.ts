/**
 * E2E: Security Headers Validation
 *
 * Tests that CSP and security headers are present on all page responses.
 */

import { afterAll, test, expect } from '@playwright/test';
import { cleanupE2eData } from './cleanup';

afterAll(cleanupE2eData);

test.describe('Security Headers', () => {
  const pages = ['/', '/portfolio', '/markets'];

  pages.forEach((pagePath) => {
    test(`CSP header present on ${pagePath}`, async ({ page }) => {
      const response = await page.goto(pagePath);
      
      expect(response?.status()).toBeLessThan(400);
      
      const cspHeader = response?.headers()['content-security-policy'];
      expect(cspHeader).toBeDefined();
      expect(cspHeader).toContain("default-src 'self'");
      expect(cspHeader).toContain('soroban-testnet.stellar.org');
      expect(cspHeader).toContain('horizon-testnet.stellar.org');
    });

    test(`X-Frame-Options header present on ${pagePath}`, async ({ page }) => {
      const response = await page.goto(pagePath);
      
      const xFrameOptions = response?.headers()['x-frame-options'];
      expect(xFrameOptions).toBe('DENY');
    });

    test(`X-Content-Type-Options header present on ${pagePath}`, async ({ page }) => {
      const response = await page.goto(pagePath);
      
      const xContentType = response?.headers()['x-content-type-options'];
      expect(xContentType).toBe('nosniff');
    });

    test(`Referrer-Policy header present on ${pagePath}`, async ({ page }) => {
      const response = await page.goto(pagePath);
      
      const referrerPolicy = response?.headers()['referrer-policy'];
      expect(referrerPolicy).toBe('strict-origin');
    });
  });
});
