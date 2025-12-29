# 🔑 GitHub Token Setup - Get 5,000 Requests/Hour!

## Why You Need a Token

### Without Token (Current):
```
Rate Limit: 60 requests/hour
Repositories: ~6-10 per hour
Status: ❌ Limited
```

### With Token:
```
Rate Limit: 5,000 requests/hour
Repositories: ~500-1,000 per hour
Status: ✅ Near-unlimited!
```

---

## 🚀 Step-by-Step Token Creation (2 minutes)

### Step 1: Go to GitHub Settings

Open this link: https://github.com/settings/tokens

Or manually:
1. Click your profile picture (top right)
2. **Settings**
3. Scroll down to **Developer settings** (bottom left)
4. **Personal access tokens** → **Tokens (classic)**

### Step 2: Generate New Token

1. Click **"Generate new token (classic)"**
2. Give it a name: `Apify Actor - Repository Insights`
3. Set expiration: **No expiration** (or 1 year)

### Step 3: Select Scopes

**For Public Repositories Only:**
- ✅ `public_repo` (Access public repositories)
- ✅ `read:user` (Read user profile data)

**For Private Repositories Too:**
- ✅ `repo` (Full control of private repositories)
- ✅ `read:user` (Read user profile data)

### Step 4: Generate & Copy

1. Scroll down and click **"Generate token"**
2. **Copy the token immediately!** (starts with `ghp_...`)
3. ⚠️ **You won't see it again!**

Example token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 💻 How to Use the Token

### Method 1: In Test File (Quick)

Create a test file with your token:

```bash
cd /Users/balamsanjay/Desktop/Apify-Actors/github-insights-generator

cat > .actor/INPUT/test-with-token.json << 'EOF'
{
  "repositoryUrls": [
    "https://github.com/Sanjay-Balam/Flutter-App"
  ],
  "githubToken": "ghp_YOUR_TOKEN_HERE",
  "includeCodeQuality": true,
  "includeContributorInsights": true,
  "includeActivityTrends": true,
  "analyzeDays": 90
}
EOF
```

**Replace `ghp_YOUR_TOKEN_HERE` with your actual token!**

Then run:
```bash
apify run --input-file .actor/INPUT/test-with-token.json
```

### Method 2: Environment Variable (Secure)

```bash
# Add to .env file
echo "GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE" > .env

# Or export in terminal (temporary)
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
```

---

## 📊 Before vs After Comparison

### Without Token:
```
➜ apify run --input-file test.json

GitHub API rate limit: 27/60 requests remaining
⚠️ Warning: Low GitHub API rate limit

Analysis: ✅ Works but limited
Speed: 🐌 6-10 repos/hour
```

### With Token:
```
➜ apify run --input-file test-with-token.json

GitHub API rate limit: 4,995/5,000 requests remaining
✅ No warnings!

Analysis: ✅ Works perfectly
Speed: 🚀 500-1,000 repos/hour
```

---

## 🎯 Real-World Examples

### Scenario 1: Analyzing 50 Repositories

**Without Token:**
- Time needed: 5-8 hours ⏰
- Will hit rate limit multiple times
- Need to wait for reset

**With Token:**
- Time needed: 3-5 minutes ⚡
- No rate limit issues
- Smooth operation

### Scenario 2: Production Deployment

**Without Token:**
- ❌ Can't handle multiple users
- ❌ Users will see errors
- ❌ Poor user experience

**With Token:**
- ✅ Handles hundreds of users
- ✅ No errors
- ✅ Professional experience

---

## 🔒 Security Best Practices

### ✅ DO:
- Store token in `.env` file (already in `.gitignore`)
- Use environment variables
- Use Apify Secrets when deployed
- Rotate tokens periodically

### ❌ DON'T:
- Commit tokens to git
- Share tokens publicly
- Hardcode in source files
- Use same token for everything

---

## 🧪 Test Your Token

After creating your token, test it:

```bash
cd /Users/balamsanjay/Desktop/Apify-Actors/github-insights-generator

# Create test file
cat > .actor/INPUT/test-token.json << 'EOF'
{
  "repositoryUrls": ["https://github.com/Sanjay-Balam/Flutter-App"],
  "githubToken": "PASTE_YOUR_TOKEN_HERE",
  "analyzeDays": 90
}
EOF

# Run test
apify run --input-file .actor/INPUT/test-token.json
```

**Expected output:**
```
GitHub API rate limit: 4,995/5,000 requests remaining
✅ No warnings!
```

---

## 📈 Rate Limit Monitoring

### Check Current Rate Limit

```bash
# Without token
curl https://api.github.com/rate_limit

# With token
curl -H "Authorization: token ghp_YOUR_TOKEN" \
     https://api.github.com/rate_limit
```

### Output Explanation

```json
{
  "rate": {
    "limit": 5000,        // Max requests per hour
    "remaining": 4995,    // Requests left
    "reset": 1640000000,  // When it resets
    "used": 5             // Requests used
  }
}
```

---

## 🚀 When Deployed to Apify

### Using Apify Secrets (Production)

1. Deploy your Actor:
   ```bash
   apify login
   apify push
   ```

2. Go to Actor settings on Apify Console

3. Add secret environment variable:
   - Key: `GITHUB_TOKEN`
   - Value: `ghp_YOUR_TOKEN`

4. Users can provide their own tokens (optional):
   - They enter token in the input form
   - Stored securely by Apify

---

## 💡 Pro Tips

### Tip 1: Multiple Tokens
For heavy usage, create multiple tokens:
- Token 1: 5,000 req/hour
- Token 2: 5,000 req/hour
- Token 3: 5,000 req/hour
- **Total: 15,000 req/hour!**

### Tip 2: Token Rotation
Automatically switch between tokens:
```javascript
const tokens = [
  'ghp_token1',
  'ghp_token2',
  'ghp_token3'
];
const token = tokens[Math.floor(Math.random() * tokens.length)];
```

### Tip 3: Smart Rate Limiting
Your Actor already shows warnings:
```
Warning: Low GitHub API rate limit. Consider providing a GitHub token for higher limits.
```

---

## 🎯 Quick Start Commands

### Create token file:
```bash
cd github-insights-generator

# Add your token here 👇
cat > .actor/INPUT/unlimited.json << 'EOF'
{
  "repositoryUrls": [
    "https://github.com/facebook/react",
    "https://github.com/microsoft/vscode",
    "https://github.com/Sanjay-Balam/Flutter-App"
  ],
  "githubToken": "ghp_YOUR_ACTUAL_TOKEN_HERE",
  "analyzeDays": 90
}
EOF

# Run unlimited analysis!
apify run --input-file .actor/INPUT/unlimited.json
```

---

## ✅ Token Checklist

- [ ] Went to https://github.com/settings/tokens
- [ ] Generated new token (classic)
- [ ] Selected `public_repo` and `read:user` scopes
- [ ] Copied token (starts with `ghp_`)
- [ ] Added to test file
- [ ] Ran test successfully
- [ ] Saw 5,000 requests/hour limit
- [ ] Saved token securely in `.env`
- [ ] Added to `.gitignore`

---

## 🆘 Troubleshooting

### Issue: "Bad credentials"
- Token expired or invalid
- Regenerate token and try again

### Issue: Still seeing 60 requests/hour
- Token not properly passed to API
- Check token format (should start with `ghp_`)
- Verify token is in input JSON

### Issue: "Token doesn't have required permissions"
- Add `repo` scope for private repos
- Add `public_repo` scope for public repos

---

## 🎉 Summary

| Feature | Without Token | With Token |
|---------|--------------|------------|
| **Rate Limit** | 60/hour | 5,000/hour |
| **Repos/Hour** | ~10 | ~1,000 |
| **Private Repos** | ❌ No | ✅ Yes |
| **Production Ready** | ❌ No | ✅ Yes |
| **Cost** | Free | Free |
| **Setup Time** | 0 min | 2 min |

**Get your token now and unlock unlimited analysis!** 🚀

---

Need help? I can:
1. Walk you through token creation
2. Test the token with your Actor
3. Set up automatic token rotation

