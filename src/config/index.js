const { resolve } = require('path');

// Load .env from project root if present
require('dotenv').config({ path: resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  pi: {
    hosts: [
      process.env.PI_HOST_1,
      process.env.PI_HOST_2,
      process.env.PI_HOST_3,
    ].filter(Boolean),
    user: process.env.PI_USER || 'pi',
    deployPath: process.env.PI_DEPLOY_PATH || '/opt/blackroad',
    sshKey: process.env.PI_SSH_KEY || '~/.ssh/id_ed25519',
  },

  deployUrl: process.env.DEPLOY_URL || 'http://localhost:3000',
};

function validateConfig() {
  const missing = [];
  if (!config.stripe.secretKey) missing.push('STRIPE_SECRET_KEY');
  if (!config.stripe.webhookSecret) missing.push('STRIPE_WEBHOOK_SECRET');

  if (missing.length > 0 && config.env === 'production') {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  if (missing.length > 0) {
    console.warn(`[config] Missing env vars (non-production): ${missing.join(', ')}`);
  }
}

module.exports = { config, validateConfig };
