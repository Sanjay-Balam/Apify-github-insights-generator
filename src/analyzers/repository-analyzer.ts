import { Octokit } from '@octokit/rest';
import { analyzeTechStack } from './tech-stack-analyzer.js';
import { analyzeCodeQuality } from './code-quality-analyzer.js';
import { analyzeContributors } from './contributor-analyzer.js';
import { analyzeActivity } from './activity-analyzer.js';
import { calculateHealthScore } from './health-score-calculator.js';

export interface AnalysisOptions {
    includeCodeQuality: boolean;
    includeContributorInsights: boolean;
    includeActivityTrends: boolean;
    analyzeDays: number;
}

export interface RepositoryInsights {
    url: string;
    owner: string;
    repo: string;
    analyzedAt: string;
    basicInfo: any;
    techStack: any;
    codeQuality?: any;
    contributors?: any;
    activityTrends?: any;
    healthScore: number;
    healthBreakdown: any;
    success: boolean;
}

export async function analyzeRepository(
    octokit: Octokit,
    owner: string,
    repo: string,
    options: AnalysisOptions
): Promise<RepositoryInsights> {
    
    // Get basic repository information
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    
    const basicInfo = {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        openIssues: repoData.open_issues_count,
        license: repoData.license?.name || 'None',
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        size: repoData.size,
        defaultBranch: repoData.default_branch,
        isPrivate: repoData.private,
        isFork: repoData.fork,
        hasWiki: repoData.has_wiki,
        hasPages: repoData.has_pages,
        hasIssues: repoData.has_issues,
        hasProjects: repoData.has_projects,
        hasDownloads: repoData.has_downloads,
    };

    console.log('  → Analyzing tech stack...');
    const techStack = await analyzeTechStack(octokit, owner, repo, repoData.default_branch);

    let codeQuality;
    if (options.includeCodeQuality) {
        console.log('  → Analyzing code quality...');
        codeQuality = await analyzeCodeQuality(octokit, owner, repo, repoData.default_branch);
    }

    let contributors;
    if (options.includeContributorInsights) {
        console.log('  → Analyzing contributors...');
        contributors = await analyzeContributors(octokit, owner, repo, options.analyzeDays);
    }

    let activityTrends;
    if (options.includeActivityTrends) {
        console.log('  → Analyzing activity trends...');
        activityTrends = await analyzeActivity(octokit, owner, repo, options.analyzeDays);
    }

    console.log('  → Calculating health score...');
    const { healthScore, breakdown } = calculateHealthScore({
        basicInfo,
        techStack,
        codeQuality,
        contributors,
        activityTrends,
    });

    return {
        url: `https://github.com/${owner}/${repo}`,
        owner,
        repo,
        analyzedAt: new Date().toISOString(),
        basicInfo,
        techStack,
        codeQuality,
        contributors,
        activityTrends,
        healthScore,
        healthBreakdown: breakdown,
        success: true,
    };
}

