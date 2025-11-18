# Deploy AnonConnect to Render

This guide will help you deploy AnonConnect to Render (free tier available!).

## Prerequisites

- A [Render account](https://render.com) (free)
- Your code pushed to GitHub
- Google AI API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## Option 1: Deploy Frontend Only (Quick Test)

If you just want to test the frontend quickly:

### Steps:

1. **Go to [Render Dashboard](https://dashboard.render.com)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository:**
   - Repository: `yaseenlenceria/AnonConnect`
   - Branch: `main`

4. **Configure the service:**
   - **Name**: `anonconnect-web`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variables:**
   Click "Advanced" and add:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `NEXT_PUBLIC_SIGNALING_SERVER_URL` | `http://localhost:3001` (temporary) |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | `your_api_key_here` |

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

---

## Option 2: Deploy Full Stack (Frontend + Backend)

To deploy both the frontend and signaling server:

### Step 1: Deploy Signaling Server (Backend)

1. **Go to [Render Dashboard](https://dashboard.render.com)**

2. **Click "New +" → "Web Service"**

3. **Connect GitHub repository**

4. **Configure:**
   - **Name**: `anonconnect-signaling`
   - **Region**: Choose closest to you
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Plan**: `Free`

5. **Add Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |

6. **Click "Create Web Service"**

7. **Copy the service URL** (e.g., `https://anonconnect-signaling-xxxxx.onrender.com`)

### Step 2: Deploy Frontend

1. **Click "New +" → "Web Service"** again

2. **Connect same GitHub repository**

3. **Configure:**
   - **Name**: `anonconnect-web`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Add Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `NEXT_PUBLIC_SIGNALING_SERVER_URL` | `https://anonconnect-signaling-xxxxx.onrender.com` |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | `your_api_key_here` |

   **Important:** Replace the signaling server URL with the actual URL from Step 1.

5. **Click "Create Web Service"**

6. **Wait for deployment**

---

## Option 3: Deploy Using Blueprint (Automated)

Render blueprints allow you to deploy multiple services at once.

### Steps:

1. **Ensure `render.yaml` is in your repository root** (already included)

2. **Go to [Render Dashboard](https://dashboard.render.com)**

3. **Click "New +" → "Blueprint"**

4. **Connect your GitHub repository**

5. **Render will detect `render.yaml`** and configure both services automatically

6. **Set the secret environment variable:**
   - Service: `anonconnect-web`
   - Key: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Value: Your API key

7. **Click "Apply"**

8. **Wait for both services to deploy**

---

## Important Notes About Free Tier

⚠️ **Render's free tier has these limitations:**

1. **Services spin down after 15 minutes of inactivity**
   - First request after spin-down can take 50+ seconds
   - Users might see "Service Unavailable" briefly

2. **750 hours/month of runtime per account**
   - Enough for 1 service running 24/7
   - Or multiple services with less usage

3. **No persistent storage**
   - Perfect for this app (uses in-memory matching)

4. **Automatic deploys on git push**
   - Every push to `main` triggers redeployment

### To Avoid Cold Starts:

Use a service like [UptimeRobot](https://uptimerobot.com) to ping your app every 10 minutes:
- URL to ping: `https://your-app.onrender.com`
- Interval: 10 minutes

---

## Troubleshooting

### Issue 1: "Build failed - yarn: not found"

**Solution:**
- Make sure `.npmrc` file exists in your repo
- Or manually set build command to: `npm install && npm run build`

### Issue 2: "Module not found" errors

**Solution:**
- Clear Render's cache: Settings → "Clear build cache & deploy"
- Check that all dependencies are in `package.json`

### Issue 3: "WebSocket connection failed"

**Solution:**
- Verify `NEXT_PUBLIC_SIGNALING_SERVER_URL` is set correctly
- Make sure it includes `https://`
- Check signaling server is running

### Issue 4: "Service is taking too long to respond"

**Solution:**
- This is normal for free tier on first request
- Service is spinning up from sleep
- Wait 30-60 seconds and try again

### Issue 5: "PORT environment variable not found"

**Solution:**
- Render automatically provides `PORT` env variable
- Make sure your server uses `process.env.PORT || 3001`

---

## Monitoring Your Services

### View Logs:

1. Go to your service dashboard
2. Click on "Logs" tab
3. View real-time logs

### Metrics:

1. Click on "Metrics" tab
2. View CPU, memory, and request metrics

### Restart a Service:

1. Go to service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Or click "Settings" → "Redeploy"

---

## Updating Your Deployment

### Auto-Deploy (Default):

Every time you push to GitHub, Render automatically deploys.

```bash
git add .
git commit -m "your changes"
git push origin main
```

Render will detect the push and redeploy automatically!

### Manual Deploy:

1. Go to service dashboard
2. Click "Manual Deploy"
3. Choose "Deploy latest commit"

---

## Custom Domain (Optional)

### Add Your Domain:

1. Go to service dashboard
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `anonconnect.com`)
4. Update DNS records as shown:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: your-app.onrender.com
   ```
5. Wait for DNS propagation (5-30 minutes)
6. SSL certificate will be auto-issued

---

## Cost Comparison

### Free Tier:
- **Cost**: $0/month
- **Services**: 2 web services
- **Limitation**: Services spin down after 15 min inactivity
- **Good for**: Testing, demos, low-traffic apps

### Starter Plan ($7/month per service):
- **Cost**: $14/month (frontend + backend)
- **Services**: Always running, no spin-down
- **Includes**: 512 MB RAM, auto-scaling
- **Good for**: Production apps with moderate traffic

---

## Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Custom Domains](https://render.com/docs/custom-domains)

---

## Need Help?

- Check [Render Community](https://community.render.com)
- Open an issue on [GitHub](https://github.com/yaseenlenceria/AnonConnect/issues)
- Read the [main README](./README.md)

---

**Your app should now be live! 🎉**

Visit: `https://your-app-name.onrender.com`
