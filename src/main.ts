import { Actor } from 'apify';
import { Octokit } from '@octokit/rest';
import { analyzeRepository } from './analyzers/repository-analyzer.js';
import { parseGitHubUrl } from './utils/url-parser.js';

interface Input {
    repositoryUrls: string[];
    githubToken?: string;
    includeCodeQuality?: boolean;
    includeContributorInsights?: boolean;
    includeActivityTrends?: boolean;
    analyzeDays?: number;
}

await Actor.main(async () => {
    // Get input
    const input = await Actor.getInput<Input>();
    
    if (!input || !input.repositoryUrls || input.repositoryUrls.length === 0) {
        throw new Error('No repository URLs provided. Please add at least one GitHub repository URL.');
    }

    console.log('GitHub Repository Insights Generator started!');
    console.log(`Analyzing ${input.repositoryUrls.length} repositories...`);

    // Initialize GitHub API client
    const octokit = new Octokit({
        auth: input.githubToken,
    });

    // Verify API rate limit
    const { data: rateLimit } = await octokit.rateLimit.get();
    console.log(`GitHub API rate limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit} requests remaining`);
    
    if (rateLimit.rate.remaining < 50) {
        console.warn('Warning: Low GitHub API rate limit. Consider providing a GitHub token for higher limits.');
    }

    const results = [];

    // Analyze each repository
    for (const repoUrl of input.repositoryUrls) {
        try {
            console.log(`\n📊 Analyzing: ${repoUrl}`);
            
            // Parse GitHub URL
            const { owner, repo } = parseGitHubUrl(repoUrl);
            
            // Analyze repository
            const insights = await analyzeRepository(octokit, owner, repo, {
                includeCodeQuality: input.includeCodeQuality ?? true,
                includeContributorInsights: input.includeContributorInsights ?? true,
                includeActivityTrends: input.includeActivityTrends ?? true,
                analyzeDays: input.analyzeDays ?? 90,
            });

            results.push(insights);
            
            console.log(`✅ Successfully analyzed: ${owner}/${repo}`);
            console.log(`   Health Score: ${insights.healthScore}/100`);
            console.log(`   Tech Stack: ${insights.techStack.languages.slice(0, 3).join(', ')}`);
            
        } catch (error: any) {
            console.error(`❌ Error analyzing ${repoUrl}:`, error.message);
            
            results.push({
                url: repoUrl,
                error: error.message,
                success: false,
            });
        }
    }

    // Save results to dataset
    await Actor.pushData(results);

    console.log('\n🎉 Analysis complete!');
    console.log(`Successfully analyzed ${results.filter((r: any) => r.success !== false).length}/${results.length} repositories`);
});

