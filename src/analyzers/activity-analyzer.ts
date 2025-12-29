import { Octokit } from '@octokit/rest';

export async function analyzeActivity(
    octokit: Octokit,
    owner: string,
    repo: string,
    analyzeDays: number
) {
    const since = new Date();
    since.setDate(since.getDate() - analyzeDays);
    const sinceISO = since.toISOString();

    // Get commits
    const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        since: sinceISO,
        per_page: 100,
    });

    // Get issues
    const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'all',
        since: sinceISO,
        per_page: 100,
    });

    // Separate issues and PRs
    const pullRequests = issues.filter((issue: any) => issue.pull_request);
    const actualIssues = issues.filter((issue: any) => !issue.pull_request);

    // Get releases
    const { data: releases } = await octokit.repos.listReleases({
        owner,
        repo,
        per_page: 20,
    });

    const recentReleases = releases.filter((release: any) => 
        new Date(release.created_at) >= since
    );

    // Analyze commit patterns
    const commitsByDay = analyzeCommitFrequency(commits);
    const commitTrend = calculateTrend(commitsByDay);

    // Analyze issue patterns
    const openIssues = actualIssues.filter((i: any) => i.state === 'open');
    const closedIssues = actualIssues.filter((i: any) => i.state === 'closed');
    
    const issueResponseTime = calculateAverageResponseTime(actualIssues);
    const issueCloseRate = actualIssues.length > 0
        ? ((closedIssues.length / actualIssues.length) * 100).toFixed(2)
        : '0';

    // Analyze PR patterns
    const openPRs = pullRequests.filter((pr: any) => pr.state === 'open');
    const closedPRs = pullRequests.filter((pr: any) => pr.state === 'closed');
    
    const prMergeRate = pullRequests.length > 0
        ? ((closedPRs.length / pullRequests.length) * 100).toFixed(2)
        : '0';

    // Release cadence
    const releaseCadence = releases.length > 1
        ? calculateReleaseCadence(releases.slice(0, 5))
        : null;

    return {
        period: {
            days: analyzeDays,
            from: sinceISO,
            to: new Date().toISOString(),
        },
        commits: {
            total: commits.length,
            averagePerDay: (commits.length / analyzeDays).toFixed(2),
            trend: commitTrend,
            commitsByDay: Object.keys(commitsByDay).length <= 30 ? commitsByDay : null,
        },
        issues: {
            total: actualIssues.length,
            open: openIssues.length,
            closed: closedIssues.length,
            closeRate: parseFloat(issueCloseRate),
            averageResponseTimeHours: issueResponseTime,
        },
        pullRequests: {
            total: pullRequests.length,
            open: openPRs.length,
            closed: closedPRs.length,
            mergeRate: parseFloat(prMergeRate),
        },
        releases: {
            total: releases.length,
            recentCount: recentReleases.length,
            latestRelease: releases[0] ? {
                name: releases[0].name,
                tagName: releases[0].tag_name,
                publishedAt: releases[0].published_at,
            } : null,
            averageCadenceDays: releaseCadence,
        },
        activityScore: calculateActivityScore({
            commitsPerDay: commits.length / analyzeDays,
            issueCloseRate: parseFloat(issueCloseRate),
            prMergeRate: parseFloat(prMergeRate),
            hasRecentRelease: recentReleases.length > 0,
        }),
    };
}

function analyzeCommitFrequency(commits: any[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    commits.forEach((commit: any) => {
        const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
        frequency[date] = (frequency[date] || 0) + 1;
    });
    
    return frequency;
}

function calculateTrend(commitsByDay: Record<string, number>): string {
    const days = Object.keys(commitsByDay).sort();
    if (days.length < 7) return 'insufficient-data';
    
    const midpoint = Math.floor(days.length / 2);
    const firstHalf = days.slice(0, midpoint);
    const secondHalf = days.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + commitsByDay[day], 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + commitsByDay[day], 0) / secondHalf.length;
    
    const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    if (change > 20) return 'increasing';
    if (change < -20) return 'decreasing';
    return 'stable';
}

function calculateAverageResponseTime(issues: any[]): number | null {
    const responseTimes: number[] = [];
    
    issues.forEach((issue: any) => {
        if (issue.comments > 0) {
            const created = new Date(issue.created_at).getTime();
            const updated = new Date(issue.updated_at).getTime();
            const diffHours = (updated - created) / (1000 * 60 * 60);
            responseTimes.push(diffHours);
        }
    });
    
    if (responseTimes.length === 0) return null;
    
    const average = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    return parseFloat(average.toFixed(2));
}

function calculateReleaseCadence(releases: any[]): number | null {
    if (releases.length < 2) return null;
    
    const intervals: number[] = [];
    
    for (let i = 0; i < releases.length - 1; i++) {
        const current = new Date(releases[i].published_at).getTime();
        const next = new Date(releases[i + 1].published_at).getTime();
        const diffDays = (current - next) / (1000 * 60 * 60 * 24);
        intervals.push(diffDays);
    }
    
    const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return parseFloat(average.toFixed(2));
}

function calculateActivityScore(metrics: any): number {
    let score = 0;
    
    // Commit activity (40 points)
    if (metrics.commitsPerDay >= 5) score += 40;
    else if (metrics.commitsPerDay >= 2) score += 30;
    else if (metrics.commitsPerDay >= 1) score += 20;
    else if (metrics.commitsPerDay >= 0.5) score += 10;
    
    // Issue management (30 points)
    if (metrics.issueCloseRate >= 80) score += 30;
    else if (metrics.issueCloseRate >= 60) score += 20;
    else if (metrics.issueCloseRate >= 40) score += 10;
    
    // PR merge rate (20 points)
    if (metrics.prMergeRate >= 80) score += 20;
    else if (metrics.prMergeRate >= 60) score += 15;
    else if (metrics.prMergeRate >= 40) score += 10;
    
    // Recent release (10 points)
    if (metrics.hasRecentRelease) score += 10;
    
    return score;
}

