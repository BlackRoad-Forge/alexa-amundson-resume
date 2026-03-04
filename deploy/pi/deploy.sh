#!/usr/bin/env bash
set -euo pipefail

# BlackRoad OS → Raspberry Pi Deployment Script
# Deploys the Stripe integration service to Pi nodes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load config from .env or environment
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

PI_USER="${PI_USER:-pi}"
PI_DEPLOY_PATH="${PI_DEPLOY_PATH:-/opt/blackroad}"
PI_SSH_KEY="${PI_SSH_KEY:-$HOME/.ssh/id_ed25519}"
PI_HOSTS=("${PI_HOST_1:-}" "${PI_HOST_2:-}" "${PI_HOST_3:-}")

# Filter out empty hosts
ACTIVE_HOSTS=()
for host in "${PI_HOSTS[@]}"; do
  if [ -n "$host" ]; then
    ACTIVE_HOSTS+=("$host")
  fi
done

if [ ${#ACTIVE_HOSTS[@]} -eq 0 ]; then
  echo "ERROR: No Pi hosts configured. Set PI_HOST_1, PI_HOST_2, PI_HOST_3 in .env"
  exit 1
fi

echo "========================================="
echo "  BlackRoad OS → Pi Deployment"
echo "========================================="
echo "  Hosts: ${ACTIVE_HOSTS[*]}"
echo "  Path:  $PI_DEPLOY_PATH"
echo "  User:  $PI_USER"
echo "========================================="

SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10 -i $PI_SSH_KEY"

deploy_to_host() {
  local host="$1"
  echo ""
  echo "--- Deploying to $host ---"

  # Create deploy directory
  ssh $SSH_OPTS "$PI_USER@$host" "mkdir -p $PI_DEPLOY_PATH"

  # Sync project files (exclude dev stuff)
  rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'tests' \
    --exclude '.env' \
    --exclude 'docs/' \
    --exclude '*.md' \
    -e "ssh $SSH_OPTS" \
    "$PROJECT_ROOT/" "$PI_USER@$host:$PI_DEPLOY_PATH/"

  # Copy .env if it exists (separately so rsync --delete doesn't remove it)
  if [ -f "$PROJECT_ROOT/.env" ]; then
    scp $SSH_OPTS "$PROJECT_ROOT/.env" "$PI_USER@$host:$PI_DEPLOY_PATH/.env"
  fi

  # Install dependencies and restart service
  ssh $SSH_OPTS "$PI_USER@$host" bash <<REMOTE
    cd $PI_DEPLOY_PATH
    export NODE_ENV=production

    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
      echo "Installing Node.js 20..."
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      sudo apt-get install -y nodejs
    fi

    # Install production dependencies
    npm ci --production 2>/dev/null || npm install --production

    # Set up systemd service
    sudo tee /etc/systemd/system/blackroad-stripe.service > /dev/null <<EOF
[Unit]
Description=BlackRoad Stripe Integration
After=network.target

[Service]
Type=simple
User=$PI_USER
WorkingDirectory=$PI_DEPLOY_PATH
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=$PI_DEPLOY_PATH/.env

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable blackroad-stripe
    sudo systemctl restart blackroad-stripe

    echo "Service status on $HOSTNAME:"
    sudo systemctl status blackroad-stripe --no-pager || true
REMOTE

  echo "--- $host: deployment complete ---"
}

# Health check after deployment
check_health() {
  local host="$1"
  local port="${PORT:-3000}"
  echo "Checking health on $host:$port..."

  for i in 1 2 3 4 5; do
    if ssh $SSH_OPTS "$PI_USER@$host" "curl -sf http://localhost:$port/api/health" 2>/dev/null; then
      echo ""
      echo "  $host: HEALTHY"
      return 0
    fi
    echo "  Attempt $i/5 - waiting..."
    sleep 2
  done

  echo "  $host: UNHEALTHY"
  return 1
}

# Deploy to all active hosts
FAILED=()
for host in "${ACTIVE_HOSTS[@]}"; do
  if deploy_to_host "$host"; then
    echo ""
  else
    FAILED+=("$host")
    echo "WARN: Deployment to $host failed, continuing..."
  fi
done

echo ""
echo "========================================="
echo "  Health Checks"
echo "========================================="

UNHEALTHY=()
for host in "${ACTIVE_HOSTS[@]}"; do
  if ! check_health "$host"; then
    UNHEALTHY+=("$host")
  fi
done

echo ""
echo "========================================="
echo "  Deployment Summary"
echo "========================================="
echo "  Total hosts:    ${#ACTIVE_HOSTS[@]}"
echo "  Deploy failed:  ${#FAILED[@]}"
echo "  Unhealthy:      ${#UNHEALTHY[@]}"

if [ ${#FAILED[@]} -gt 0 ] || [ ${#UNHEALTHY[@]} -gt 0 ]; then
  echo ""
  echo "  FAILED:    ${FAILED[*]:-none}"
  echo "  UNHEALTHY: ${UNHEALTHY[*]:-none}"
  exit 1
fi

echo ""
echo "  All Pis deployed and healthy!"
echo "========================================="
