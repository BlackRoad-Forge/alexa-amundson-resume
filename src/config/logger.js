const pino = require('pino');
const { config } = require('./index');

const logger = pino({
  level: config.logLevel,
  transport: config.env !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

module.exports = logger;
