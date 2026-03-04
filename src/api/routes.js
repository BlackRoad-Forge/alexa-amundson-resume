const express = require('express');
const { constructEvent, handleWebhookEvent } = require('../stripe/webhooks');
const billing = require('../stripe/billing');
const logger = require('../config/logger');

const router = express.Router();

// --- Health ---

router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'blackroad-stripe',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --- Stripe Webhook (raw body required) ---

router.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;
  try {
    event = constructEvent(req.body, signature);
  } catch (err) {
    logger.error({ error: err.message }, 'Webhook signature verification failed');
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    const result = await handleWebhookEvent(event);
    res.json({ received: true, ...result });
  } catch (err) {
    logger.error({ error: err.message, eventType: event.type }, 'Webhook handler error');
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// --- Billing API ---

router.post('/api/customers', express.json(), async (req, res) => {
  try {
    const { email, name, metadata } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    const customer = await billing.createCustomer({ email, name, metadata });
    res.status(201).json(customer);
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to create customer');
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/checkout', express.json(), async (req, res) => {
  try {
    const { customerId, priceId, successUrl, cancelUrl } = req.body;
    if (!customerId || !priceId) {
      return res.status(400).json({ error: 'customerId and priceId are required' });
    }
    const session = await billing.createCheckoutSession({
      customerId,
      priceId,
      successUrl: successUrl || 'https://blackroad.io/success',
      cancelUrl: cancelUrl || 'https://blackroad.io/cancel',
    });
    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to create checkout session');
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/payments', express.json(), async (req, res) => {
  try {
    const { customerId, amount, currency, description } = req.body;
    if (!customerId || !amount) {
      return res.status(400).json({ error: 'customerId and amount are required' });
    }
    const intent = await billing.createPaymentIntent({ customerId, amount, currency, description });
    res.json({ clientSecret: intent.client_secret, intentId: intent.id });
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to create payment intent');
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/customers/:customerId/invoices', async (req, res) => {
  try {
    const invoices = await billing.listInvoices(req.params.customerId, {
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json({ invoices });
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to list invoices');
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/subscriptions/:subscriptionId', async (req, res) => {
  try {
    const sub = await billing.cancelSubscription(req.params.subscriptionId);
    res.json(sub);
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to cancel subscription');
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/subscriptions/:subscriptionId', async (req, res) => {
  try {
    const sub = await billing.getSubscription(req.params.subscriptionId);
    res.json(sub);
  } catch (err) {
    logger.error({ error: err.message }, 'Failed to get subscription');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
