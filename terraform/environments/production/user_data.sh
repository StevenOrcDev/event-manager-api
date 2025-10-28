#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/app
cd /opt/app

# Wait for databases to be ready (important!)
echo "Waiting for databases to be ready..."
sleep 60

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  api:
    image: ${docker_image}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?sslmode=require
      - REDIS_URL=rediss://:${valkey_password}@${valkey_host}:${valkey_port}
      - JWT_SECRET=${jwt_secret}
      - LOG_LEVEL=info
    restart: unless-stopped
EOF

# Start application
docker-compose up -d

# Wait for app to start
sleep 30

# Run Prisma migrations
docker-compose exec -T api npx prisma migrate deploy

# Create systemd service
cat > /etc/systemd/system/event-manager-api.service << 'EOF'
[Unit]
Description=Event Manager API
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/app
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
EOF

# Enable service
systemctl enable event-manager-api.service

# Setup log rotation
cat > /etc/logrotate.d/docker << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

echo "Deployment complete!"