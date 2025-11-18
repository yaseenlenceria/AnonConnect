# Deployment Guide - DigitalOcean

This guide will walk you through deploying **AnonConnect** to DigitalOcean App Platform.

## Prerequisites

Before you begin, ensure you have:
- ✅ A [DigitalOcean account](https://www.digitalocean.com/)
- ✅ Your code pushed to GitHub
- ✅ Google AI API Key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## Deployment Methods

### Method 1: One-Click Deploy (Recommended)

This is the fastest way to deploy AnonConnect to DigitalOcean.

#### Step 1: Click the Deploy Button

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/yaseenlenceria/AnonConnect/tree/main)

#### Step 2: Configure Your App

1. **Sign in** to your DigitalOcean account
2. **Confirm the repository** - It should auto-detect `yaseenlenceria/AnonConnect`
3. **Authorize GitHub** - Allow DigitalOcean to access your repository
4. Click **Next**

#### Step 3: Configure Resources

DigitalOcean will auto-detect two services:
- **signaling-server** (Backend)
- **web** (Frontend)

Keep the default settings:
- Instance Size: `Basic (512 MB RAM, 1 vCPU)` - $5/month per service
- Total cost: ~$10/month

Click **Next**

#### Step 4: Set Environment Variables

**For the `web` service:**

| Key | Value | Notes |
|-----|-------|-------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | `your_api_key_here` | Mark as **SECRET** |
| `NEXT_PUBLIC_SIGNALING_SERVER_URL` | `${signaling-server.PUBLIC_URL}` | Auto-filled |

**For the `signaling-server` service:**

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | - |
| `PORT` | `8080` | Default |

Click **Next**

#### Step 5: Review and Deploy

1. Review your app configuration
2. Choose your app name (e.g., `anonconnect`)
3. Select your region (e.g., `New York`)
4. Click **Create Resources**

#### Step 6: Wait for Deployment

- DigitalOcean will build and deploy your app (5-10 minutes)
- Monitor the build logs in real-time
- Once complete, you'll get two URLs:
  - **Web App**: `https://anonconnect-xxxxx.ondigitalocean.app`
  - **Signaling Server**: `https://signaling-server-xxxxx.ondigitalocean.app`

#### Step 7: Test Your App

Visit your web app URL and test:
- ✅ Home page loads with animations
- ✅ Can select country
- ✅ Can start connecting
- ✅ Dialer opens and works
- ✅ WebRTC connection establishes

---

### Method 2: Manual Setup via DigitalOcean Dashboard

#### Step 1: Create a New App

1. Log in to [DigitalOcean](https://cloud.digitalocean.com)
2. Go to **Apps** in the left sidebar
3. Click **Create App**

#### Step 2: Connect Your Repository

1. Choose **GitHub** as your source
2. Authorize DigitalOcean to access your GitHub account
3. Select repository: `yaseenlenceria/AnonConnect`
4. Select branch: `main`
5. Enable **Autodeploy** (deploys on every push)
6. Click **Next**

#### Step 3: Configure Services

DigitalOcean should auto-detect your services. If not, add them manually:

**Service 1: Signaling Server**
- **Name**: `signaling-server`
- **Type**: Web Service
- **Build Command**: `npm install`
- **Run Command**: `npm run server`
- **HTTP Port**: `8080`
- **HTTP Routes**: `/socket.io`
- **Instance Size**: Basic (512 MB, $5/mo)

**Service 2: Frontend**
- **Name**: `web`
- **Type**: Web Service
- **Build Command**: `npm install && npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: `3000`
- **HTTP Routes**: `/`
- **Instance Size**: Basic (512 MB, $5/mo)

Click **Next**

#### Step 4: Environment Variables

Configure environment variables as shown in Method 1, Step 4.

#### Step 5: App Info

1. **App Name**: Choose a unique name (e.g., `anonconnect-prod`)
2. **Region**: Select the closest to your users
   - `NYC` (New York) - East Coast USA
   - `SFO` (San Francisco) - West Coast USA
   - `AMS` (Amsterdam) - Europe
   - `SGP` (Singapore) - Asia

Click **Next**

#### Step 6: Review and Launch

1. Review your configuration
2. Check the monthly cost (~$10)
3. Click **Create Resources**

---

### Method 3: Using the App Spec YAML

If you want full control, use the app spec file.

#### Step 1: Prepare the Spec File

The project includes `.do/app.yaml` with pre-configured settings.

#### Step 2: Create App from Spec

1. Install [doctl CLI](https://docs.digitalocean.com/reference/doctl/how-to/install/):
   ```bash
   # macOS
   brew install doctl

   # Windows
   choco install doctl

   # Linux
   cd ~
   wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
   tar xf ~/doctl-1.94.0-linux-amd64.tar.gz
   sudo mv ~/doctl /usr/local/bin
   ```

2. Authenticate:
   ```bash
   doctl auth init
   ```
   Enter your DigitalOcean API token when prompted.

3. Create the app:
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

4. Get your app ID:
   ```bash
   doctl apps list
   ```

5. Monitor deployment:
   ```bash
   doctl apps logs <app-id> --follow
   ```

#### Step 3: Set Secret Environment Variables

You can't put secrets in the YAML file, so set them via CLI:

```bash
# Set Google AI API Key
doctl apps update <app-id> --set-env "web.GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here"
```

---

## Post-Deployment Configuration

### 1. Configure Custom Domain (Optional)

1. Go to your app in DigitalOcean dashboard
2. Click on **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `anonconnect.com`)
5. Add DNS records as shown:
   ```
   Type: CNAME
   Name: @
   Value: <your-app>.ondigitalocean.app
   ```
6. Wait for DNS propagation (5-30 minutes)
7. SSL certificate will be auto-issued

### 2. Enable WebSocket Support

DigitalOcean App Platform automatically supports WebSockets on:
- `/socket.io/*` - For Socket.IO connections

No additional configuration needed!

### 3. Monitor Your App

**View Logs:**
```bash
# Web service logs
doctl apps logs <app-id> --type web

# Server logs
doctl apps logs <app-id> --type signaling-server

# Follow live logs
doctl apps logs <app-id> --follow
```

**View Metrics:**
1. Go to your app dashboard
2. Click on each service
3. View CPU, memory, and request metrics

### 4. Update Your App

**Via Git Push:**
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```
3. DigitalOcean auto-deploys (if autodeploy is enabled)

**Via doctl:**
```bash
doctl apps update <app-id> --spec .do/app.yaml
```

---

## Scaling Your App

### Horizontal Scaling (More Instances)

1. Go to your app dashboard
2. Click on a service
3. Click **Edit**
4. Increase **Instance Count** (e.g., 1 → 3)
5. Click **Save**

**Note:** Each instance costs $5/month.

### Vertical Scaling (Bigger Instances)

1. Go to your app dashboard
2. Click on a service
3. Click **Edit**
4. Choose a larger **Instance Size**:
   - Basic ($5/mo): 512 MB RAM, 1 vCPU
   - Professional ($12/mo): 1 GB RAM, 1 vCPU
   - Professional ($24/mo): 2 GB RAM, 1 vCPU
5. Click **Save**

---

## Troubleshooting

### Issue 1: Build Failed

**Solution:**
- Check build logs in DigitalOcean dashboard
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

### Issue 2: WebSocket Connection Failed

**Solution:**
- Verify `NEXT_PUBLIC_SIGNALING_SERVER_URL` is set correctly
- Check that signaling server is running
- Look at browser console for errors

### Issue 3: Audio Not Working

**Solution:**
- HTTPS is required for WebRTC (DigitalOcean provides this)
- Check browser permissions for microphone
- Test on multiple browsers

### Issue 4: High Latency

**Solution:**
- Add a TURN server for users behind strict NATs
- Use a CDN for static assets
- Choose a region closer to your users

### Issue 5: App Crashed

**Solution:**
```bash
# Check logs
doctl apps logs <app-id> --type web --follow
doctl apps logs <app-id> --type signaling-server --follow

# Restart services
doctl apps update <app-id> --restart-only
```

---

## Cost Estimation

### Basic Setup (Small Traffic)
- Frontend: $5/month
- Backend: $5/month
- **Total: $10/month**

### Medium Setup (Moderate Traffic)
- Frontend (2 instances): $10/month
- Backend (2 instances): $10/month
- **Total: $20/month**

### Enterprise Setup (High Traffic)
- Frontend (Professional, 3 instances): $72/month
- Backend (Professional, 3 instances): $72/month
- CDN: ~$5/month
- **Total: ~$149/month**

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Enable rate limiting** - Prevent abuse
3. **Use HTTPS only** - DigitalOcean provides free SSL
4. **Monitor logs** - Check for suspicious activity
5. **Update dependencies** - Run `npm audit` regularly
6. **Set CORS properly** - Restrict origins in production

---

## Additional Resources

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [doctl CLI Reference](https://docs.digitalocean.com/reference/doctl/)
- [App Platform Pricing](https://www.digitalocean.com/pricing/app-platform)
- [DigitalOcean Community](https://www.digitalocean.com/community)

---

## Support

If you encounter issues:
1. Check the [troubleshooting section](#troubleshooting)
2. Review [DigitalOcean docs](https://docs.digitalocean.com)
3. Open an issue on [GitHub](https://github.com/yaseenlenceria/AnonConnect/issues)

---

**Happy Deploying! 🚀**
