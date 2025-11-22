# Deployment Guide for MelodyFetch

## Prerequisites
- Node.js v18+
- npm or yarn
- Git
- Server with sufficient disk space for downloads
- Spotify Developer credentials
- yt-dlp installed or binary available

## Production Deployment

### 1. Environment Setup

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Spotify API
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# File Paths
DOWNLOADS_DIR=/var/app/downloads
TEMP_DIR=/var/app/temp

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/melodyfetch/backend.log

# Optional: Rate Limiting
MAX_REQUESTS_PER_MINUTE=60
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Installation

```bash
# Clone repository
git clone <repo-url>
cd New

# Backend setup
cd backend
npm install --production
npm run build  # if applicable

# Frontend setup
cd ../frontend
npm install --production
npm run build
```

### 3. Using PM2 for Process Management

Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js` in root:
```javascript
module.exports = {
  apps: [
    {
      name: 'melodyfetch-backend',
      script: './backend/src/server.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/melodyfetch/backend-error.log',
      out_file: '/var/log/melodyfetch/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'melodyfetch-frontend',
      script: './frontend/node_modules/.bin/next',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/melodyfetch/frontend-error.log',
      out_file: '/var/log/melodyfetch/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy Configuration

```nginx
upstream backend {
    server localhost:3001;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 5. SSL Certificate (Let's Encrypt)

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### 6. Monitoring & Logging

Create log directory:
```bash
sudo mkdir -p /var/log/melodyfetch
sudo chown $USER:$USER /var/log/melodyfetch
```

Set up log rotation (`/etc/logrotate.d/melodyfetch`):
```
/var/log/melodyfetch/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 7. Cleanup Cron Job

Create `cleanup.sh`:
```bash
#!/bin/bash
# Remove downloads older than 24 hours
find /var/app/downloads -type f -mtime +1 -delete
find /var/app/temp -type f -mtime +1 -delete
```

Add to crontab:
```bash
crontab -e
# Add: 0 3 * * * /path/to/cleanup.sh
```

### 8. Database (Optional)

If implementing user authentication:
- Use PostgreSQL or MongoDB
- Set connection string in `.env`
- Run migrations before startup

### 9. Backup Strategy

```bash
# Daily backup script
tar -czf /backups/melodyfetch-$(date +%Y%m%d).tar.gz \
  /var/app/downloads \
  backend/.env \
  frontend/.env.local
```

## Docker Deployment (Alternative)

Create `Dockerfile.backend`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 3001
CMD ["node", "src/server.js"]
```

Create `Dockerfile.frontend`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

## Health Checks

Monitor endpoints:
- **Backend**: `GET /health` (implement in backend)
- **Frontend**: Check for 200 response

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### yt-dlp Issues
```bash
# Update yt-dlp binary
./backend/bin/yt-dlp -U
```

### Out of Disk Space
```bash
# Force cleanup
rm -rf /var/app/downloads/*
```

## Security Checklist

- [ ] Environment variables properly set
- [ ] SSL certificates installed and valid
- [ ] Firewall configured (only ports 80, 443 open)
- [ ] Regular backups scheduled
- [ ] Log rotation configured
- [ ] Monitoring and alerting set up
- [ ] Rate limiting enabled
- [ ] API keys rotated periodically
