const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Billing API E2E', () => {
  test('POST /api/customers rejects missing email', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/customers`, {
      data: { name: 'Test User' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('email is required');
  });

  test('POST /api/checkout rejects missing fields', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/checkout`, {
      data: {},
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toContain('required');
  });

  test('POST /api/payments rejects missing fields', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/payments`, {
      data: { customerId: 'cust_123' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toContain('required');
  });
});
