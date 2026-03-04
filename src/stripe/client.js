const Stripe = require('stripe');
const { config } = require('../config');

let stripeClient = null;

function getStripe() {
  if (!stripeClient) {
    if (!config.stripe.secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeClient = new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-06-20',
      appInfo: {
        name: 'BlackRoad OS',
        version: '1.0.0',
        url: 'https://blackroad.io',
      },
    });
  }
  return stripeClient;
}

// For testing — inject a mock client
function setStripeClient(client) {
  stripeClient = client;
}

module.exports = { getStripe, setStripeClient };
