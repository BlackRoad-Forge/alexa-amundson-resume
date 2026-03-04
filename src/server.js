const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config, validateConfig } = require('./config');
const logger = require('./config/logger');
const routes = require('./api/routes');

validateConfig();

const app = express();

// Security headers
app.use(helmet());
app.use(cors());

// NOTE: The webhook route uses express.raw() directly in routes.js
// All other routes use express.json() per-route in routes.js
app.use(routes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  logger.error({ error: err.message, stack: err.stack }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.env }, 'BlackRoad Stripe server started');
  });
}

module.exports = app;
