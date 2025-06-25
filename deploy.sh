#!/bin/bash

# Pizza Diet VPS Deployment Script

echo "🚀 Starting Pizza Diet deployment..."

# Create logs directory
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build React app
echo "🔨 Building React application..."
npm run build

# Set environment variables (create .env file with your MongoDB URI)
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file template..."
    cat > .env << EOL
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/pizzadiet?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=production
PORT=80

# Add other environment variables as needed
EOL
    echo "📝 Please update .env file with your actual MongoDB URI and other configurations"
fi

# Start with PM2
echo "🚀 Starting server with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

echo "✅ Deployment completed!"
echo "🌐 Your Pizza Diet app should be running on port 80"
echo "📊 Monitor with: pm2 monit"
echo "📋 Check logs with: pm2 logs pizza-diet-server"
echo "🔄 Restart with: pm2 restart pizza-diet-server"