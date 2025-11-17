# Deployment Guide

## Frontend Deployment

### Environment Variables

The frontend uses environment variables to configure the backend API URL.

**For Local Development:**
- No configuration needed - defaults to `http://localhost:5001`

**For Production:**
- Set the `VITE_API_URL` environment variable to your backend URL
- Example: `VITE_API_URL=https://ai-tour-guide-backend.onrender.com`

### Setting Environment Variables

#### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `VITE_API_URL` = `https://ai-tour-guide-backend.onrender.com`
4. Redeploy your application

#### Netlify
1. Go to Site settings → Environment variables
2. Add: `VITE_API_URL` = `https://ai-tour-guide-backend.onrender.com`
3. Redeploy your site

#### Other Platforms
Set the `VITE_API_URL` environment variable in your deployment platform's settings to:
```
https://ai-tour-guide-backend.onrender.com
```

### Build Command
```bash
npm run build
```

The built files will be in the `dist` directory.

## Backend Deployment

The backend is already deployed at: `https://ai-tour-guide-backend.onrender.com`

### CORS Configuration
Make sure your backend has CORS enabled for your frontend domain. The backend should allow requests from your deployed frontend URL.

## Quick Setup for Production

1. **Set Environment Variable:**
   ```bash
   export VITE_API_URL=https://ai-tour-guide-backend.onrender.com
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy the `dist` folder** to your hosting platform

## Testing

After deployment, verify the API connection by:
1. Opening your deployed frontend
2. Trying to generate a tour plan
3. Check browser console for any CORS or API errors

