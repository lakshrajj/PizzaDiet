# Pizza Diet - Vercel Deployment Guide

This guide will help you deploy your Pizza Diet website to Vercel with automatic serverless backend functions.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Ensure your MongoDB Atlas cluster is running

## Project Structure

```
pizza-diet/
├── api/                    # Vercel serverless functions
│   ├── _lib/              # Shared utilities
│   │   ├── db.js          # Database connection
│   │   ├── models.js      # MongoDB schemas
│   │   └── utils.js       # API utilities
│   ├── franchise/         # Franchise endpoints
│   ├── menu/             # Menu endpoints
│   ├── offers/           # Offers endpoints
│   └── health.js         # Health check
├── src/                  # React frontend
├── public/              # Static assets
├── vercel.json          # Vercel configuration
└── package.json
```

## Deployment Steps

### 1. Environment Variables Setup

In your Vercel dashboard, set the following environment variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizzadiet?retryWrites=true&w=majority
NODE_ENV=production
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### Option B: GitHub Integration

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

### 3. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Update DNS settings as instructed

## API Endpoints

After deployment, your API will be available at:

```
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/menu/grouped
https://your-app.vercel.app/api/offers
https://your-app.vercel.app/api/franchise/apply
```

## Database Initialization

After deployment, initialize your database by calling:

```bash
curl -X POST https://your-app.vercel.app/api/menu/clear-and-seed
curl -X POST https://your-app.vercel.app/api/offers/seed
```

## Environment Configuration

The application automatically detects the environment:

- **Development**: Uses `http://localhost:3001` for API calls
- **Production**: Uses relative URLs (same domain)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to the CORS whitelist in `api/_lib/utils.js`

2. **Database Connection**: Verify MongoDB URI in environment variables

3. **Function Timeout**: Vercel functions timeout after 10 seconds on Hobby plan

4. **Cold Starts**: First request might be slow due to serverless cold starts

### Logs and Monitoring

1. View function logs in Vercel dashboard
2. Use `vercel logs` command for recent logs
3. Monitor database connections in MongoDB Atlas

## Local Development with Vercel

Test your serverless functions locally:

```bash
npm run vercel-dev
```

This runs both frontend and backend in Vercel's development environment.

## Performance Optimization

1. **Database Connections**: Using connection pooling and caching
2. **API Responses**: Optimized for minimal data transfer
3. **Static Assets**: Automatically optimized by Vercel
4. **CDN**: Global distribution via Vercel Edge Network

## Security

1. **Environment Variables**: Stored securely in Vercel
2. **CORS**: Configured for your domains only
3. **Input Validation**: Implemented in all API endpoints
4. **MongoDB**: Uses connection string with authentication

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **MongoDB Atlas**: Database performance metrics
- **Error Tracking**: Console logs accessible in Vercel dashboard

## Support

For deployment issues:
1. Check Vercel documentation
2. Review function logs
3. Verify environment variables
4. Test API endpoints individually

Your Pizza Diet website is now ready for production! 🍕