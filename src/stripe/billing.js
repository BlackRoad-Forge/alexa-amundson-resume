const { getStripe } = require('./client');
const logger = require('../config/logger');

/**
 * Create a Stripe customer.
 */
async function createCustomer({ email, name, metadata = {} }) {
  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { platform: 'blackroad', ...metadata },
  });
  logger.info({ customerId: customer.id, email }, 'Customer created');
  return customer;
}

/**
 * Create a checkout session for a BlackRoad OS subscription.
 */
async function createCheckoutSession({ customerId, priceId, successUrl, cancelUrl }) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { platform: 'blackroad' },
  });
  logger.info({ sessionId: session.id, customerId }, 'Checkout session created');
  return session;
}

/**
 * Create a one-time payment intent (e.g., for API domain add-ons).
 */
async function createPaymentIntent({ customerId, amount, currency = 'usd', description }) {
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    customer: customerId,
    amount, // in cents
    currency,
    description,
    metadata: { platform: 'blackroad' },
  });
  logger.info({ intentId: intent.id, amount, currency }, 'Payment intent created');
  return intent;
}

/**
 * List invoices for a customer.
 */
async function listInvoices(customerId, { limit = 10 } = {}) {
  const stripe = getStripe();
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });
  return invoices.data;
}

/**
 * Cancel a subscription immediately.
 */
async function cancelSubscription(subscriptionId) {
  const stripe = getStripe();
  const sub = await stripe.subscriptions.cancel(subscriptionId);
  logger.info({ subscriptionId, status: sub.status }, 'Subscription cancelled');
  return sub;
}

/**
 * Get subscription details.
 */
async function getSubscription(subscriptionId) {
  const stripe = getStripe();
  return stripe.subscriptions.retrieve(subscriptionId);
}

module.exports = {
  createCustomer,
  createCheckoutSession,
  createPaymentIntent,
  listInvoices,
  cancelSubscription,
  getSubscription,
};
