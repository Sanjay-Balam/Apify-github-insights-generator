# GitHub Repository Insights Generator

**Analyze GitHub repositories and generate comprehensive insights reports** including tech stack detection, code quality metrics, activity trends, contributor analytics, and overall repository health scores.

Perfect for **VCs**, **recruiters**, **developer tools**, and anyone who needs deep insights into GitHub repositories.

## 🚀 Features

### 📊 **Tech Stack Analysis**
- Primary and secondary languages with percentage breakdown
- Framework detection (React, Vue, Django, Laravel, etc.)
- Build tools (Webpack, Vite, Gradle, etc.)
- Package managers (npm, Yarn, pip, Cargo, etc.)
- CI/CD tools (GitHub Actions, CircleCI, Jenkins, etc.)
- Dependency analysis for Node.js projects

### 💎 **Code Quality Metrics**
- Documentation analysis (README, Contributing, License, Docs)
- Test coverage estimation
- Code standards (linting, formatting, type checking)
- File structure and organization
- Overall quality score (0-100)

### 📈 **Activity Trends**
- Commit frequency and patterns
- Issue management metrics (open/close rates, response time)
- Pull request statistics (merge rates, turnaround time)
- Release cadence analysis
- Activity trends (increasing, stable, decreasing)

### 👥 **Contributor Insights**
- Total contributor count
- Top contributors (all-time and recent)
- Contributor diversity and distribution
- Active vs. casual contributors
- Community engagement metrics

### 🏥 **Health Score**
- Overall repository health (0-100)
- Detailed breakdown by category:
  - **Popularity** (stars, forks, watchers)
  - **Activity** (recent commits, regular updates)
  - **Maintenance** (issue management, PR handling)
  - **Community** (contributors, engagement)
  - **Quality** (documentation, testing, standards)

## 💰 Use Cases

### For VCs and Investors
- Evaluate potential investment targets
- Assess technical health of portfolio companies
- Compare competing projects
- Due diligence automation

### For Recruiters
- Evaluate candidate's open-source contributions
- Assess project quality and impact
- Verify technical skills
- Compare developers based on contributions

### For Developer Tools
- Repository analytics dashboards
- Automated project assessment
- Dependency tracking
- Tech stack discovery

### For Engineering Teams
- Competitive analysis
- Open-source project evaluation
- Tech debt assessment
- Team productivity metrics

## 📝 Input

```json
{
  "repositoryUrls": [
    "https://github.com/apify/crawlee",
    "https://github.com/microsoft/vscode"
  ],
  "githubToken": "ghp_xxxxx...",
  "includeCodeQuality": true,
  "includeContributorInsights": true,
  "includeActivityTrends": true,
  "analyzeDays": 90
}
```

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `repositoryUrls` | Array | ✅ | - | List of GitHub repository URLs to analyze |
| `githubToken` | String | ❌ | - | GitHub Personal Access Token (increases rate limit from 60 to 5000 req/hr) |
| `includeCodeQuality` | Boolean | ❌ | `true` | Include code quality analysis |
| `includeContributorInsights` | Boolean | ❌ | `true` | Include contributor analytics |
| `includeActivityTrends` | Boolean | ❌ | `true` | Include activity trend analysis |
| `analyzeDays` | Integer | ❌ | `90` | Number of days to analyze (7-365) |

### Getting a GitHub Token (Optional but Recommended)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`
4. Copy the token and paste it in the input

**Why use a token?** Without a token, you're limited to 60 requests per hour. With a token, you get 5,000 requests per hour.

## 📤 Output

The Actor generates a comprehensive JSON report for each repository:

```json
{
  "url": "https://github.com/apify/crawlee",
  "owner": "apify",
  "repo": "crawlee",
  "analyzedAt": "2025-12-29T10:30:00.000Z",
  "healthScore": 87,
  "healthBreakdown": {
    "popularity": { "score": 18, "maxScore": 20 },
    "activity": { "score": 22, "maxScore": 25 },
    "maintenance": { "score": 18, "maxScore": 20 },
    "community": { "score": 16, "maxScore": 20 },
    "quality": { "score": 13, "maxScore": 15 }
  },
  "basicInfo": {
    "name": "crawlee",
    "fullName": "apify/crawlee",
    "description": "A web scraping and browser automation library",
    "stars": 15240,
    "forks": 650,
    "watchers": 180,
    "openIssues": 42,
    "license": "Apache-2.0",
    "createdAt": "2018-09-18T10:00:00Z",
    "updatedAt": "2025-12-28T15:30:00Z"
  },
  "techStack": {
    "primaryLanguage": "TypeScript",
    "languages": ["TypeScript", "JavaScript", "Shell"],
    "frameworks": ["Node.js"],
    "buildTools": ["TypeScript", "Webpack"],
    "packageManagers": ["npm"],
    "cicdTools": ["GitHub Actions"],
    "dependencies": {
      "production": ["cheerio", "playwright", "puppeteer"],
      "development": ["jest", "eslint", "prettier"],
      "totalCount": 45
    }
  },
  "codeQuality": {
    "score": 85,
    "documentation": {
      "hasReadme": true,
      "hasLicense": true,
      "hasContributing": true,
      "hasDocsFolder": true,
      "documentationScore": 95
    },
    "testing": {
      "testFileCount": 120,
      "estimatedCoveragePercentage": "75.5",
      "hasTestingFramework": true,
      "testingScore": 80
    },
    "codeStandards": {
      "hasLinting": true,
      "hasFormatting": true,
      "hasTypeChecking": true
    }
  },
  "contributors": {
    "totalContributors": 87,
    "topContributors": [...],
    "recentActivity": {
      "contributorsInPeriod": 15,
      "activeContributors": 8,
      "casualContributors": 7
    },
    "diversity": {
      "contributorConcentration": 45.2,
      "isHealthyDistribution": true
    }
  },
  "activityTrends": {
    "commits": {
      "total": 234,
      "averagePerDay": "2.60",
      "trend": "stable"
    },
    "issues": {
      "total": 89,
      "open": 42,
      "closed": 47,
      "closeRate": 52.81
    },
    "pullRequests": {
      "total": 156,
      "open": 12,
      "closed": 144,
      "mergeRate": 92.31
    },
    "releases": {
      "total": 24,
      "recentCount": 3,
      "latestRelease": {
        "name": "v3.7.0",
        "tagName": "v3.7.0",
        "publishedAt": "2025-12-15T10:00:00Z"
      }
    }
  },
  "success": true
}
```

## 🎯 API Rate Limits

- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

Each repository analysis uses approximately 5-10 API calls depending on settings.

## 🔧 Development

### Local Testing

```bash
# Clone the repository
cd github-insights-generator

# Install dependencies
npm install

# Create .env file with your GitHub token (optional)
echo "GITHUB_TOKEN=your_token_here" > .env

# Build the project
npm run build

# Run locally
npm start
```

### Deploy to Apify

1. Install Apify CLI: `npm install -g apify-cli`
2. Login: `apify login`
3. Push to Apify: `apify push`

## 📊 Example Use Cases

### Evaluate a potential dependency
```json
{
  "repositoryUrls": ["https://github.com/lodash/lodash"],
  "analyzeDays": 180
}
```

### Compare frameworks
```json
{
  "repositoryUrls": [
    "https://github.com/facebook/react",
    "https://github.com/vuejs/vue",
    "https://github.com/angular/angular"
  ]
}
```

### Assess candidate's project
```json
{
  "repositoryUrls": ["https://github.com/username/their-project"],
  "includeContributorInsights": true,
  "analyzeDays": 365
}
```

## 🏆 What Makes This Actor Unique?

1. **Comprehensive Analysis**: Combines multiple data points into actionable insights
2. **Health Score Algorithm**: Proprietary scoring system based on best practices
3. **Smart Detection**: Automatically detects tech stacks, frameworks, and tools
4. **Flexible Configuration**: Customize analysis depth and scope
5. **Fast & Efficient**: Optimized API usage for quick results
6. **No Login Required**: Works with public repositories (token optional)

## 🤝 Support

- **Issues**: Report bugs or request features via GitHub issues
- **Questions**: Contact support@apify.com
- **Discord**: Join the Apify community on Discord

## 📜 License

Apache-2.0

## 🎉 Built for the Apify $1M Challenge

This Actor was built as part of the Apify $1M Challenge to help developers, investors, and recruiters gain deep insights into GitHub repositories.

---

**Made with ❤️ by Sanjay** | [Apify Store](https://apify.com/store) | [Documentation](https://docs.apify.com)

