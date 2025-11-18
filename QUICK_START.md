# Quick Start Guide

Get AnonConnect running in **5 minutes**!

## Option 1: Deploy to DigitalOcean (Production Ready)

**Click this button:**

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/yaseenlenceria/AnonConnect/tree/main)

### Steps:

1. **Sign in** to DigitalOcean (or create an account)

2. **Authorize GitHub** access

3. **Configure the app:**
   - App name: `anonconnect` (or choose your own)
   - Region: Select closest to you

4. **Set environment variables:**

   For the **web** service:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY = your_api_key_here (mark as SECRET)
   ```

   Get your API key: https://makersuite.google.com/app/apikey

5. **Click "Create Resources"**

6. **Wait 5-10 minutes** ⏱️

7. **Done!** 🎉 Your app is live at:
   ```
   https://your-app-name.ondigitalocean.app
   ```

**Cost:** $10/month (both frontend + backend included)

---

## Option 2: Run Locally (Development)

### Prerequisites
- Node.js 18+ installed
- Git installed

### Steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yaseenlenceria/AnonConnect.git
   cd AnonConnect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local` and add your API key:**
   ```env
   NEXT_PUBLIC_SIGNALING_SERVER_URL=http://localhost:3001
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

5. **Run the app:**
   ```bash
   npm run dev:all
   ```

6. **Open your browser:**
   ```
   http://localhost:3000
   ```

**Done!** 🎉 The app is running locally.

---

## Testing the App

Once deployed or running locally:

1. ✅ **Home page** - Should show animated background and title
2. ✅ **Select country** - Choose "Global" or a specific country
3. ✅ **Start connecting** - Click the button
4. ✅ **Allow microphone** - Grant browser permissions
5. ✅ **Open dialer** - Test the interactive dialer
6. ✅ **Connect** - Open in two browser tabs/windows to test

---

## Troubleshooting

### Issue: "Microphone access denied"
**Solution:** Check browser permissions and reload page

### Issue: "Cannot connect to signaling server"
**Solution:**
- Check if signaling server is running
- Verify `NEXT_PUBLIC_SIGNALING_SERVER_URL` is correct
- Check browser console for errors

### Issue: "Build failed on DigitalOcean"
**Solution:**
- Check build logs in DigitalOcean dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

---

## Next Steps

- 📖 Read the [full README](./README.md)
- 🚀 View [deployment guide](./DEPLOYMENT.md)
- 🔧 Customize the app for your needs
- 🎨 Modify styling in `tailwind.config.ts`
- 🌐 Set up custom domain

---

## Getting Help

- 📚 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yaseenlenceria/AnonConnect/issues)
- 💬 [DigitalOcean Community](https://www.digitalocean.com/community)

---

**Happy connecting! 🎉**
