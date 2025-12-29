import { Octokit } from '@octokit/rest';

export async function analyzeContributors(
    octokit: Octokit,
    owner: string,
    repo: string,
    analyzeDays: number
) {
    // Get contributors
    const { data: contributors } = await octokit.repos.listContributors({
        owner,
        repo,
        per_page: 100,
    });

    // Get recent commits for activity analysis
    const since = new Date();
    since.setDate(since.getDate() - analyzeDays);

    const { data: recentCommits } = await octokit.repos.listCommits({
        owner,
        repo,
        since: since.toISOString(),
        per_page: 100,
    });

    // Analyze contributor patterns
    const contributorMap = new Map<string, any>();
    
    recentCommits.forEach((commit: any) => {
        const author = commit.author?.login || commit.commit.author.name;
        
        if (!contributorMap.has(author)) {
            contributorMap.set(author, {
                login: author,
                commits: 0,
                additions: 0,
                deletions: 0,
                firstCommit: commit.commit.author.date,
                lastCommit: commit.commit.author.date,
            });
        }
        
        const contributor = contributorMap.get(author);
        contributor.commits++;
        
        if (new Date(commit.commit.author.date) < new Date(contributor.firstCommit)) {
            contributor.firstCommit = commit.commit.author.date;
        }
        if (new Date(commit.commit.author.date) > new Date(contributor.lastCommit)) {
            contributor.lastCommit = commit.commit.author.date;
        }
    });

    const recentContributors = Array.from(contributorMap.values())
        .sort((a, b) => b.commits - a.commits);

    // Top contributors (all time)
    const topContributors = contributors.slice(0, 10).map((c: any) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
        profileUrl: c.html_url,
    }));

    // Calculate contributor diversity
    const totalContributions = contributors.reduce((sum: number, c: any) => sum + c.contributions, 0);
    const top10Contributions = topContributors.reduce((sum, c) => sum + c.contributions, 0);
    const contributorConcentration = totalContributions > 0 
        ? ((top10Contributions / totalContributions) * 100).toFixed(2)
        : '0';

    // Activity metrics
    const activeContributors = recentContributors.filter(c => c.commits >= 3).length;
    const casualContributors = recentContributors.filter(c => c.commits < 3).length;

    return {
        totalContributors: contributors.length,
        topContributors,
        recentActivity: {
            contributorsInPeriod: recentContributors.length,
            activeContributors,
            casualContributors,
            topRecentContributors: recentContributors.slice(0, 5).map(c => ({
                login: c.login,
                commits: c.commits,
                firstCommit: c.firstCommit,
                lastCommit: c.lastCommit,
            })),
        },
        diversity: {
            contributorConcentration: parseFloat(contributorConcentration),
            isHealthyDistribution: parseFloat(contributorConcentration) < 70,
        },
        engagement: {
            averageCommitsPerContributor: recentContributors.length > 0
                ? (recentCommits.length / recentContributors.length).toFixed(2)
                : '0',
            hasActiveCore: activeContributors >= 3,
        },
    };
}

