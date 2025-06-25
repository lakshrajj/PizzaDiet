# Pizza Diet - VPS Deployment Guide

This guide will help you deploy the Pizza Diet application to a VPS server.

## Prerequisites

- VPS server with Ubuntu/CentOS
- Node.js 16+ installed
- MongoDB Atlas account or local MongoDB
- Domain name (optional but recommended)

## Quick Deployment

1. **Clone/Upload the project to your VPS:**
   ```bash
   # Upload your project files to the VPS
   # Or clone from your repository
   git clone <your-repo-url>
   cd PizzaDiet
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

3. **Configure environment variables:**
   - Edit the `.env` file with your actual MongoDB URI
   - Update other configuration as needed

4. **Restart the application:**
   ```bash
   pm2 restart pizza-diet-server
   ```

## Manual Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build React App
```bash
npm run build
```

### 3. Configure Environment Variables
Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizzadiet
NODE_ENV=production
PORT=80
```

### 4. Start with PM2
```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup auto-start on system boot
pm2 startup
```

## Server Management Commands

- **Start server:** `pm2 start pizza-diet-server`
- **Stop server:** `pm2 stop pizza-diet-server`
- **Restart server:** `pm2 restart pizza-diet-server`
- **View logs:** `pm2 logs pizza-diet-server`
- **Monitor:** `pm2 monit`
- **Status:** `pm2 status`

## Server Configuration

The server runs on port 80 by default in production. It serves:
- Static React files from `/build` directory
- API endpoints under `/api/*`
- All other routes redirect to React SPA

## Database Setup

Make sure your MongoDB Atlas cluster:
1. Has the correct connection string in `.env`
2. Allows connections from your VPS IP address
3. Has appropriate user permissions

## Domain Setup (Optional)

If you have a domain name:
1. Point your domain's A record to your VPS IP
2. Consider setting up SSL with Let's Encrypt:
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com
   ```

## Firewall Configuration

Make sure your VPS firewall allows:
- Port 80 (HTTP)
- Port 443 (HTTPS, if using SSL)
- Port 22 (SSH)

```bash
# UFW example
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

## Nginx Reverse Proxy (Optional)

For better performance, you can set up Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

1. **Server won't start:**
   - Check MongoDB connection in logs
   - Verify environment variables
   - Check if port is already in use

2. **API calls failing:**
   - Ensure all API routes work: `/api/health`
   - Check server logs: `pm2 logs pizza-diet-server`

3. **React app not loading:**
   - Verify build files exist in `/build` directory
   - Check static file serving configuration

## Monitoring

- **Application logs:** `pm2 logs pizza-diet-server`
- **System resources:** `pm2 monit`
- **Server status:** `pm2 status`

For any issues, check the logs and ensure all environment variables are properly configured.