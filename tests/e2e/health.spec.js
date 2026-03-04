const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Health Check E2E', () => {
  test('GET /api/health returns 200 with status ok', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/health`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('blackroad-stripe');
    expect(body.timestamp).toBeTruthy();
    expect(body.uptime).toBeGreaterThan(0);
  });

  test('GET /nonexistent returns 404', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/nonexistent`);
    expect(res.status()).toBe(404);
  });
});
