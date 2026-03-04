const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Mock the stripe client before requiring webhooks
const { setStripeClient } = require('../../src/stripe/client');

describe('Webhook handler', () => {
  beforeEach(() => {
    // Set a mock stripe client so it doesn't throw
    setStripeClient({});
  });

  it('should handle invoice.paid events', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_1',
      type: 'invoice.paid',
      data: {
        object: {
          id: 'inv_123',
          customer: 'cus_123',
          amount_paid: 10000,
          subscription: 'sub_123',
        },
      },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, true);
    assert.equal(result.action, 'invoice_recorded');
  });

  it('should handle checkout.session.completed events', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_2',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_123',
          customer: 'cus_123',
          amount_total: 50000,
        },
      },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, true);
    assert.equal(result.action, 'checkout_fulfilled');
  });

  it('should handle customer.subscription.created events', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_3',
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'active',
          items: { data: [{ price: { id: 'price_123' } }] },
        },
      },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, true);
    assert.equal(result.action, 'subscription_provisioned');
  });

  it('should handle payment_intent.succeeded events', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_4',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 25000,
          currency: 'usd',
        },
      },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, true);
    assert.equal(result.action, 'payment_confirmed');
  });

  it('should ignore unknown event types', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_5',
      type: 'unknown.event.type',
      data: { object: {} },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, false);
    assert.equal(result.action, 'ignored');
  });

  it('should handle subscription.deleted events', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_6',
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
        },
      },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, true);
    assert.equal(result.action, 'subscription_deprovisioned');
  });

  it('should handle invoice.payment_failed events', async () => {
    const { handleWebhookEvent } = require('../../src/stripe/webhooks');
    const event = {
      id: 'evt_test_7',
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'inv_fail_123',
          customer: 'cus_123',
          attempt_count: 2,
        },
      },
    };
    const result = await handleWebhookEvent(event);
    assert.equal(result.handled, true);
    assert.equal(result.action, 'payment_failure_logged');
  });
});
