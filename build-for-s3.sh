#!/bin/bash

# Build script for S3 + CloudFront deployment
# This script builds the frontend and prepares it for AWS S3 deployment

set -e

echo "🚀 Building GradClass Frontend for AWS S3..."

# Check if API URL is provided
if [ -z "$VITE_API_URL" ]; then
  echo "⚠️  Warning: VITE_API_URL not set. Using default..."
  export VITE_API_URL="https://api.your-domain.com/api/v1"
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building production bundle..."
npm run build

echo "✅ Build complete!"
echo "📂 Build output: ./dist"
echo ""
echo "Next steps:"
echo "1. Upload dist/ folder to S3:"
echo "   aws s3 sync dist/ s3://your-bucket-name --delete"
echo ""
echo "2. Invalidate CloudFront cache:"
echo "   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths '/*'"
