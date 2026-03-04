# BlackRoad OS — Stripe Integration Service

Production Stripe integration with billing, webhooks, e2e tests, and Raspberry Pi deployment.

## Architecture

```
src/
├── server.js              # Express server entry point
├── config/
│   ├── index.js           # Environment config
│   └── logger.js          # Structured logging (pino)
├── api/
│   └── routes.js          # API routes (health, billing, webhooks)
└── stripe/
    ├── client.js          # Stripe client singleton
    ├── billing.js         # Customer, checkout, payments, subscriptions
    └── webhooks.js        # Webhook verification + event handlers

tests/
├── unit/
│   └── webhooks.test.js   # Webhook handler unit tests
└── e2e/
    ├── health.spec.js     # Health endpoint e2e
    ├── billing-api.spec.js # Billing API e2e
    └── stripe-webhook.spec.js # Webhook e2e

deploy/pi/
├── deploy.sh              # Deploy to Pi nodes via SSH
└── setup-nginx.sh         # NGINX load balancer for Pi cluster
```

## Quick Start

```bash
# Install dependencies
npm install

# Copy env template and fill in your Stripe keys
cp .env.example .env

# Run server
npm start

# Run in dev mode (auto-reload)
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/webhooks/stripe` | Stripe webhook receiver |
| POST | `/api/customers` | Create Stripe customer |
| POST | `/api/checkout` | Create checkout session |
| POST | `/api/payments` | Create payment intent |
| GET | `/api/customers/:id/invoices` | List customer invoices |
| GET | `/api/subscriptions/:id` | Get subscription |
| DELETE | `/api/subscriptions/:id` | Cancel subscription |

## Stripe Webhooks

Handled events:
- `checkout.session.completed` — Fulfill orders
- `invoice.paid` / `invoice.payment_failed` — Track payments
- `customer.subscription.created/updated/deleted` — Manage subscriptions
- `payment_intent.succeeded/payment_failed` — Payment lifecycle

To test locally:
```bash
# Forward Stripe events to local server
npm run stripe:listen
```

## Testing

```bash
# Unit tests
npm test

# E2E tests (starts server automatically)
npm run test:e2e

# All tests
npm run test:all
```

## Deploy to Raspberry Pi

1. Set `PI_HOST_1`, `PI_HOST_2`, `PI_HOST_3` in `.env`
2. Ensure SSH key access to each Pi
3. Run:

```bash
npm run deploy:pi
```

This will:
- rsync code to each Pi
- Install Node.js if missing
- Install production dependencies
- Create/restart systemd service (`blackroad-stripe`)
- Run health checks

For load balancing across Pis:
```bash
bash deploy/pi/setup-nginx.sh
```

## Docker

```bash
docker build -t blackroad-stripe .
docker run -p 3000:3000 --env-file .env blackroad-stripe
```

## CI/CD

- **test.yml** — Runs unit + e2e tests on every push/PR
- **auto-deploy.yml** — Deploys to Railway/Cloudflare on main push
- **deploy-pi.yml** — Deploys to Pi nodes (manual trigger or on main push)
- **self-healing.yml** — Health monitoring every 30 min, auto-rollback
- **security-scan.yml** — CodeQL + dependency audit

## Resume Docs

Career portfolio documents are in [`docs/`](docs/).

---

**Contact:** amundsonalexa@gmail.com | (507) 828-0842
**GitHub:** [@blackboxprogramming](https://github.com/blackboxprogramming)
