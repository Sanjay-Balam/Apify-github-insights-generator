# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd github-insights-generator
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Test Locally

Create a test input file or run with Apify CLI:

**Option A: Using Apify CLI (Recommended)**

```bash
# Make sure you have Apify CLI installed
npm install -g apify-cli

# Run the actor
apify run -p
```

You'll be prompted to enter input. Use this example:

```json
{
  "repositoryUrls": [
    "https://github.com/apify/crawlee"
  ],
  "analyzeDays": 30
}
```

**Option B: Direct Node Execution**

Create `apify_storage/key_value_stores/default/INPUT.json`:

```json
{
  "repositoryUrls": [
    "https://github.com/apify/crawlee",
    "https://github.com/microsoft/vscode"
  ],
  "githubToken": "ghp_YOUR_TOKEN_HERE",
  "includeCodeQuality": true,
  "includeContributorInsights": true,
  "includeActivityTrends": true,
  "analyzeDays": 90
}
```

Then run:

```bash
npm start
```

### 4. View Results

Results will be saved in `apify_storage/datasets/default/`

## 📊 Sample Analysis

Here's what you'll get for each repository:

```json
{
  "url": "https://github.com/apify/crawlee",
  "healthScore": 87,
  "basicInfo": {
    "stars": 15240,
    "forks": 650,
    "description": "A web scraping and browser automation library"
  },
  "techStack": {
    "primaryLanguage": "TypeScript",
    "frameworks": ["Node.js"],
    "buildTools": ["TypeScript", "Webpack"]
  },
  "codeQuality": {
    "score": 85,
    "testing": { "testFileCount": 120 },
    "documentation": { "hasReadme": true, "hasLicense": true }
  }
}
```

## 🔑 GitHub Token (Optional)

To avoid rate limits:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Repository Insights"
4. Select scopes: `public_repo`, `read:user`
5. Click "Generate token"
6. Copy and use in your input

**Benefits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

## 🐛 Troubleshooting

### "Module not found" error
```bash
npm install
npm run build
```

### "Rate limit exceeded"
Add a GitHub token to your input

### "Invalid URL"
Make sure URLs are in format: `https://github.com/owner/repo`

### TypeScript errors
```bash
rm -rf dist node_modules
npm install
npm run build
```

## 🚢 Deploy to Apify

1. Install Apify CLI:
   ```bash
   npm install -g apify-cli
   ```

2. Login:
   ```bash
   apify login
   ```

3. Push to Apify:
   ```bash
   apify push
   ```

4. Your Actor is now live! 🎉

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed features
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for publishing to Apify Store
- Join the [Apify $1M Challenge](https://apify.com/challenge)

## 💡 Pro Tips

1. **Batch Analysis**: Add multiple repository URLs to compare projects
2. **Adjust Period**: Use `analyzeDays: 30` for recent activity or `analyzeDays: 365` for yearly trends
3. **Save Token**: Create `.env` file with `GITHUB_TOKEN=your_token` for repeated runs
4. **Focus Analysis**: Disable features you don't need to speed up processing

## 🎯 Example Use Cases

**Compare frameworks:**
```json
{
  "repositoryUrls": [
    "https://github.com/facebook/react",
    "https://github.com/vuejs/vue",
    "https://github.com/sveltejs/svelte"
  ],
  "analyzeDays": 90
}
```

**Evaluate a company:**
```json
{
  "repositoryUrls": [
    "https://github.com/company/project1",
    "https://github.com/company/project2"
  ],
  "includeContributorInsights": true,
  "analyzeDays": 180
}
```

**Quick health check:**
```json
{
  "repositoryUrls": ["https://github.com/username/project"],
  "includeCodeQuality": false,
  "includeContributorInsights": false,
  "analyzeDays": 30
}
```

---

**Need help?** Open an issue or contact support@apify.com

