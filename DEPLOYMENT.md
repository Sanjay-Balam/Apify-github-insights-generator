# Deployment Guide

## Prerequisites

1. **Apify Account**: Sign up at https://apify.com
2. **Apify CLI**: Install globally
   ```bash
   npm install -g apify-cli
   ```

## Step 1: Login to Apify

```bash
apify login
```

This will open your browser to authenticate.

## Step 2: Initialize the Actor (if needed)

If you haven't already initialized this as an Apify actor:

```bash
cd github-insights-generator
apify init
```

## Step 3: Test Locally

Before deploying, test the Actor locally:

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run locally with Apify storage
apify run
```

You'll be prompted for input, or you can create a test input file:

```bash
echo '{
  "repositoryUrls": ["https://github.com/apify/crawlee"],
  "analyzeDays": 90
}' > apify_storage/key_value_stores/default/INPUT.json
```

## Step 4: Deploy to Apify

```bash
apify push
```

This will:
- Build your Actor
- Upload it to Apify platform
- Make it available in your account

## Step 5: Publish to Apify Store (Optional)

To make your Actor public and participate in the $1M Challenge:

1. Go to https://console.apify.com/actors
2. Find your Actor
3. Click "Publish to Store"
4. Fill in the required information:
   - **Title**: GitHub Repository Insights Generator
   - **Description**: Use the one from actor.json
   - **Categories**: Developer Tools
   - **README**: Already included
   - **SEO Title**: GitHub Repository Analyzer & Insights Generator
   - **SEO Description**: Analyze GitHub repos: tech stack, code quality, activity, contributors, and health scores. Perfect for VCs, recruiters, and developers.

5. Add screenshots/demo if possible
6. Click "Submit for Review"

## Step 6: Monetization (Optional)

### Option 1: Pay-per-Event
Set up pricing for each repository analyzed:
- Go to Actor settings → Monetization
- Enable "Charge users"
- Set price per compute unit

### Option 2: Open Source Fair Share
- Keep the Actor free
- Enroll in Apify's fair share program
- Earn affiliate revenue

## Continuous Deployment

To automatically deploy on git push:

1. Go to Actor settings → Builds
2. Connect your GitHub repository
3. Enable "Build on push"
4. Every push to main will trigger a new build

## Testing After Deployment

Test your deployed Actor:

```bash
apify call <your-username>/github-insights-generator --input '{
  "repositoryUrls": ["https://github.com/apify/crawlee"],
  "analyzeDays": 30
}'
```

## Monitoring

- **Dashboard**: https://console.apify.com/actors
- **Runs**: Check Actor runs and logs
- **Usage**: Monitor compute units used
- **Revenue**: Track earnings (if monetized)

## Tips for Success in the Challenge

1. **Quality First**: Ensure your Actor works reliably
2. **Great README**: Clear documentation attracts users
3. **SEO Optimization**: Use good keywords in title/description
4. **Share It**: Promote on Twitter, Reddit, Product Hunt
5. **Examples**: Include clear use cases and examples
6. **Support**: Respond to user issues quickly
7. **Updates**: Keep improving based on feedback

## Marketing Your Actor

- Post on r/webdev, r/programming
- Share on Twitter with #ApifyChallenge
- Product Hunt launch
- Write a blog post about it
- Create demo videos
- Add to your portfolio

## Support

If you run into issues:
- Check Apify docs: https://docs.apify.com
- Join Discord: https://discord.gg/apify
- Email: support@apify.com

Good luck with the $1M Challenge! 🚀

