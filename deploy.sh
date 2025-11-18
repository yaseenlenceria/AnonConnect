#!/bin/bash

# AnonConnect Deployment Script
# This script helps you deploy AnonConnect to DigitalOcean

set -e

echo "🚀 AnonConnect Deployment Helper"
echo "=================================="
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI is not installed."
    echo ""
    echo "Please install doctl:"
    echo "  macOS:   brew install doctl"
    echo "  Ubuntu:  snap install doctl"
    echo "  Windows: choco install doctl"
    echo ""
    echo "Or visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

echo "✅ doctl CLI found"
echo ""

# Check if user is authenticated
if ! doctl account get &> /dev/null; then
    echo "❌ You are not authenticated with DigitalOcean."
    echo ""
    echo "Please run: doctl auth init"
    echo ""
    exit 1
fi

echo "✅ Authenticated with DigitalOcean"
echo ""

# Get API key
read -p "📝 Enter your Google AI API Key: " GOOGLE_API_KEY

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "❌ API key is required"
    exit 1
fi

echo ""
echo "🔨 Creating app on DigitalOcean..."
echo ""

# Create the app
APP_ID=$(doctl apps create --spec .do/app.yaml --format ID --no-header)

if [ -z "$APP_ID" ]; then
    echo "❌ Failed to create app"
    exit 1
fi

echo "✅ App created successfully!"
echo "   App ID: $APP_ID"
echo ""

# Set the secret environment variable
echo "🔐 Setting environment variables..."
doctl apps update "$APP_ID" --spec .do/app.yaml

# Add the secret (this requires manual intervention or different approach)
echo ""
echo "⚠️  Please manually set the following environment variable in the DigitalOcean dashboard:"
echo "   Service: web"
echo "   Key: GOOGLE_GENERATIVE_AI_API_KEY"
echo "   Value: $GOOGLE_API_KEY"
echo "   Type: SECRET"
echo ""

# Get app URL
echo "🌐 Getting app URL..."
sleep 5
APP_URL=$(doctl apps list --format DefaultIngress,ID | grep "$APP_ID" | awk '{print $1}')

if [ ! -z "$APP_URL" ]; then
    echo "✅ Your app will be available at: https://$APP_URL"
else
    echo "ℹ️  App URL will be available after deployment completes"
fi

echo ""
echo "📊 Deployment Status:"
doctl apps list --format ID,Spec.Name,Phase | grep "$APP_ID"

echo ""
echo "📝 To view logs:"
echo "   doctl apps logs $APP_ID --follow"
echo ""
echo "📝 To view deployment progress:"
echo "   doctl apps list-deployments $APP_ID"
echo ""
echo "🎉 Deployment initiated successfully!"
echo ""
echo "Visit the DigitalOcean dashboard to monitor progress:"
echo "   https://cloud.digitalocean.com/apps/$APP_ID"
