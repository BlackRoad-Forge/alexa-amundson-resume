const { getStripe } = require('./client');
const { config } = require('../config');
const logger = require('../config/logger');

/**
 * Verify and parse a Stripe webhook event from the raw request.
 */
function constructEvent(rawBody, signature) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    config.stripe.webhookSecret
  );
}

/**
 * Route webhook events to handlers.
 * Returns { handled: boolean, action: string }
 */
async function handleWebhookEvent(event) {
  const handlers = {
    'checkout.session.completed': handleCheckoutComplete,
    'invoice.paid': handleInvoicePaid,
    'invoice.payment_failed': handleInvoiceFailed,
    'customer.subscription.created': handleSubscriptionCreated,
    'customer.subscription.updated': handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted,
    'payment_intent.succeeded': handlePaymentSucceeded,
    'payment_intent.payment_failed': handlePaymentFailed,
  };

  const handler = handlers[event.type];
  if (!handler) {
    logger.info({ eventType: event.type }, 'Unhandled webhook event type');
    return { handled: false, action: 'ignored' };
  }

  logger.info({ eventType: event.type, eventId: event.id }, 'Processing webhook event');
  const action = await handler(event.data.object, event);
  return { handled: true, action };
}

// --- Event Handlers ---

async function handleCheckoutComplete(session) {
  logger.info({
    sessionId: session.id,
    customerId: session.customer,
    amount: session.amount_total,
  }, 'Checkout session completed');

  // Fulfill the order — activate subscription, send confirmation, etc.
  return 'checkout_fulfilled';
}

async function handleInvoicePaid(invoice) {
  logger.info({
    invoiceId: invoice.id,
    customerId: invoice.customer,
    amount: invoice.amount_paid,
    subscription: invoice.subscription,
  }, 'Invoice paid');

  return 'invoice_recorded';
}

async function handleInvoiceFailed(invoice) {
  logger.warn({
    invoiceId: invoice.id,
    customerId: invoice.customer,
    attemptCount: invoice.attempt_count,
  }, 'Invoice payment failed');

  // Could trigger dunning email, pause service, etc.
  return 'payment_failure_logged';
}

async function handleSubscriptionCreated(subscription) {
  logger.info({
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    plan: subscription.items?.data?.[0]?.price?.id,
    status: subscription.status,
  }, 'Subscription created');

  return 'subscription_provisioned';
}

async function handleSubscriptionUpdated(subscription) {
  logger.info({
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAt: subscription.cancel_at,
  }, 'Subscription updated');

  return 'subscription_synced';
}

async function handleSubscriptionDeleted(subscription) {
  logger.warn({
    subscriptionId: subscription.id,
    customerId: subscription.customer,
  }, 'Subscription deleted');

  // Deprovision access
  return 'subscription_deprovisioned';
}

async function handlePaymentSucceeded(paymentIntent) {
  logger.info({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  }, 'Payment succeeded');

  return 'payment_confirmed';
}

async function handlePaymentFailed(paymentIntent) {
  logger.warn({
    paymentIntentId: paymentIntent.id,
    error: paymentIntent.last_payment_error?.message,
  }, 'Payment failed');

  return 'payment_failure_logged';
}

module.exports = { constructEvent, handleWebhookEvent };
