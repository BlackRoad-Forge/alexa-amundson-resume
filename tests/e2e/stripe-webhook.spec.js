const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

function generateStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

test.describe('Stripe Webhook E2E', () => {
  test('POST /api/webhooks/stripe rejects missing signature', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/webhooks/stripe`, {
      data: JSON.stringify({ type: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toContain('Missing stripe-signature');
  });

  test('POST /api/webhooks/stripe rejects invalid signature', async ({ request }) => {
    const payload = JSON.stringify({
      id: 'evt_test_123',
      type: 'invoice.paid',
      data: { object: { id: 'inv_test_123' } },
    });

    const res = await request.post(`${BASE_URL}/api/webhooks/stripe`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 't=123,v1=invalid_signature',
      },
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toContain('Webhook Error');
  });
});
