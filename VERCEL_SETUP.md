# Vercel Backend Conversion Complete! 🚀

Your Express.js server has been successfully converted to Vercel-compatible serverless functions.

## What Changed

### ✅ **Serverless Functions Created**
- All Express routes converted to individual Vercel functions
- Located in `/api` directory
- Automatic scaling and global distribution

### ✅ **Frontend Updated**
- API calls now use environment-aware URLs
- Automatic switching between development and production
- Added centralized API configuration

### ✅ **Database Optimized**
- Connection pooling for serverless environment
- Cached connections to prevent cold start issues
- MongoDB Atlas ready for production

## Quick Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Convert to Vercel serverless backend"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `MONGODB_URI`
   - Deploy!

3. **Initialize Database**:
   ```bash
   # After deployment, seed your database
   curl -X POST https://your-app.vercel.app/api/menu/clear-and-seed
   curl -X POST https://your-app.vercel.app/api/offers/seed
   ```

## Environment Variables Required

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizzadiet?retryWrites=true&w=majority
NODE_ENV=production
```

## Available API Endpoints

- `/api/health` - Health check
- `/api/menu/grouped` - Menu items by category
- `/api/offers` - Active offers
- `/api/franchise/apply` - Franchise applications

## Benefits

- ⚡ **Faster**: Global CDN and edge functions
- 💰 **Cost-effective**: Pay only for usage
- 🔄 **Auto-scaling**: Handles traffic spikes automatically
- 🛡️ **Secure**: Built-in security features
- 📊 **Analytics**: Built-in performance monitoring

Your Pizza Diet website is now production-ready! 🍕