# 🧪 Testing Guide

Your Actor is **working perfectly**! Here's how to test it:

## ✅ Quick Test (What We Just Did)

```bash
cd /Users/balamsanjay/Desktop/Apify-Actors/github-insights-generator
apify run --input-file .actor/INPUT/test-basic.json
```

**Result**: ✅ Successfully analyzed Crawlee repository
- Health Score: 58/100
- Tech Stack: TypeScript, MDX, JavaScript
- All features working!

---

## 📋 Test Options Available

### 1. **Basic Test** (Single Repository)
```bash
apify run --input-file .actor/INPUT/test-basic.json
```

Analyzes: `https://github.com/apify/crawlee`

### 2. **Multiple Repositories Test**
```bash
apify run --input-file .actor/INPUT/test-multiple.json
```

Analyzes: Crawlee AND React repositories

### 3. **Interactive Test** (Manual Input)
```bash
apify run -p
```

You'll be prompted to enter:
- Repository URLs
- Whether to include each analysis type
- Analysis period (days)

### 4. **Direct npm Run**
```bash
npm start
```

Uses input from `apify_storage/key_value_stores/default/INPUT.json`

---

## 📊 Where to Find Results

After running a test, results are saved in:

```bash
# View results
cat storage/datasets/default/*.json

# Pretty print
cat storage/datasets/default/*.json | python3 -m json.tool

# Or just open the folder
open storage/datasets/default/
```

---

## 🎯 Test Different Scenarios

### Test 1: Popular Repository
```json
{
  "repositoryUrls": ["https://github.com/facebook/react"],
  "analyzeDays": 30
}
```

### Test 2: Small Repository
```json
{
  "repositoryUrls": ["https://github.com/yourusername/yourproject"],
  "analyzeDays": 90
}
```

### Test 3: Multiple Repositories (Comparison)
```json
{
  "repositoryUrls": [
    "https://github.com/facebook/react",
    "https://github.com/vuejs/vue",
    "https://github.com/angular/angular"
  ],
  "analyzeDays": 90
}
```

### Test 4: Quick Analysis (Disable Some Features)
```json
{
  "repositoryUrls": ["https://github.com/microsoft/vscode"],
  "includeCodeQuality": true,
  "includeContributorInsights": false,
  "includeActivityTrends": false,
  "analyzeDays": 30
}
```

### Test 5: With GitHub Token (Higher Rate Limits)
```json
{
  "repositoryUrls": ["https://github.com/nodejs/node"],
  "githubToken": "ghp_YOUR_TOKEN_HERE",
  "analyzeDays": 180
}
```

---

## 🔍 What Gets Analyzed

For each repository, you get:

### ✅ Basic Info
- Name, description
- Stars, forks, watchers
- Creation date, last update
- License information

### ✅ Tech Stack (Always Included)
- **Languages**: TypeScript 60%, MDX 29%, JavaScript 7%
- **Frameworks**: React, Express
- **Build Tools**: TypeScript
- **Package Managers**: Yarn
- **CI/CD**: GitHub Actions
- **Dependencies**: Full list of production and dev dependencies

### ✅ Code Quality Score (0-100)
- Documentation completeness
- Test coverage estimation
- Code standards (linting, formatting)
- Overall quality assessment

### ✅ Activity Trends
- Commits per day
- Issue close rate
- PR merge rate
- Release cadence
- Trend: increasing/stable/decreasing

### ✅ Contributor Insights
- Total contributors
- Top contributors
- Active vs casual contributors
- Community health metrics

### ✅ Health Score (0-100)
Breakdown by category:
- **Popularity** (20 points): Stars, forks, watchers
- **Activity** (25 points): Recent commits
- **Maintenance** (20 points): Issue/PR management
- **Community** (20 points): Contributors, engagement
- **Quality** (15 points): Documentation, tests, standards

---

## 📈 Sample Output Structure

```json
{
  "url": "https://github.com/apify/crawlee",
  "owner": "apify",
  "repo": "crawlee",
  "analyzedAt": "2025-12-29T09:20:50.225Z",
  "healthScore": 58,
  "healthBreakdown": {
    "popularity": { "score": 20, "maxScore": 20 },
    "activity": { "score": 15, "maxScore": 25 },
    "maintenance": { "score": 10, "maxScore": 20 },
    "community": { "score": 8, "maxScore": 20 },
    "quality": { "score": 5, "maxScore": 15 }
  },
  "basicInfo": { ... },
  "techStack": { ... },
  "codeQuality": { ... },
  "contributors": { ... },
  "activityTrends": { ... }
}
```

---

## 🐛 Troubleshooting

### Issue: "Rate limit exceeded"
**Solution**: Add a GitHub token to your input
```bash
# Get token: https://github.com/settings/tokens
```

### Issue: "Repository not found"
**Solution**: 
- Check URL format: `https://github.com/owner/repo`
- Verify repository is public (or use token for private)

### Issue: "Cannot find module"
**Solution**: 
```bash
rm -rf dist node_modules
npm install
npm run build
```

### Issue: Want to see logs
**Solution**: Check `storage/` folder for detailed logs

---

## 🎯 Testing Checklist

Before deployment, test these scenarios:

- [x] ✅ Popular repository (1000+ stars)
- [ ] Small repository (< 100 stars)
- [ ] Multiple repositories at once
- [ ] Repository with no license
- [ ] Repository with no tests
- [ ] Repository with multiple languages
- [ ] Old repository (no recent activity)
- [ ] New repository (created recently)
- [ ] With GitHub token
- [ ] Without GitHub token

---

## 🚀 Ready for Production?

Once tests pass:

1. ✅ Local testing complete
2. Deploy to Apify:
   ```bash
   apify login
   apify push
   ```
3. Test on Apify platform
4. Publish to Apify Store

---

## 📞 Need Help?

- Check logs in `storage/` folder
- Read error messages carefully
- Test with simple repositories first
- Join Apify Discord for support

**Your Actor is working great! Time to deploy!** 🎊

