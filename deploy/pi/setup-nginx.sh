#!/usr/bin/env bash
set -euo pipefail

# Sets up NGINX as a reverse proxy + load balancer across Pi nodes
# Run this on a Pi that will act as the entry point (or any Pi with NGINX)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

PORT="${PORT:-3000}"
PI_HOSTS=("${PI_HOST_1:-}" "${PI_HOST_2:-}" "${PI_HOST_3:-}")

# Filter out empty hosts
ACTIVE_HOSTS=()
for host in "${PI_HOSTS[@]}"; do
  if [ -n "$host" ]; then
    ACTIVE_HOSTS+=("$host")
  fi
done

echo "Setting up NGINX load balancer for ${#ACTIVE_HOSTS[@]} Pi nodes..."

# Install nginx if needed
if ! command -v nginx &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y nginx
fi

# Build upstream block
UPSTREAM=""
for host in "${ACTIVE_HOSTS[@]}"; do
  UPSTREAM+="    server ${host}:${PORT};\n"
done

# Write nginx config
sudo tee /etc/nginx/sites-available/blackroad-stripe > /dev/null <<EOF
upstream blackroad_stripe {
    least_conn;
$(printf "    server %s:${PORT};\n" "${ACTIVE_HOSTS[@]}")
}

server {
    listen 80;
    server_name _;

    # Health check endpoint — no rate limiting
    location /api/health {
        proxy_pass http://blackroad_stripe;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Stripe webhooks — higher body size limit, raw body passthrough
    location /api/webhooks/stripe {
        proxy_pass http://blackroad_stripe;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Stripe-Signature \$http_stripe_signature;
        client_max_body_size 5m;
    }

    # All other API routes
    location /api/ {
        proxy_pass http://blackroad_stripe;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 1m;
    }

    location / {
        return 404 '{"error":"Not found"}';
        add_header Content-Type application/json;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/blackroad-stripe /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "NGINX load balancer configured:"
echo "  Upstream nodes: ${ACTIVE_HOSTS[*]}"
echo "  Listening on:   port 80"
echo "  Routes:"
echo "    /api/health          → health check"
echo "    /api/webhooks/stripe → Stripe webhooks"
echo "    /api/*               → billing API"
echo ""
echo "Point your Stripe webhook URL to: http://<this-pi-ip>/api/webhooks/stripe"
