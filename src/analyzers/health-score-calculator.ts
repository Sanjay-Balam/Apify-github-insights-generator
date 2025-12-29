export function calculateHealthScore(data: any): { healthScore: number; breakdown: any } {
    const scores = {
        popularity: 0,
        activity: 0,
        maintenance: 0,
        community: 0,
        quality: 0,
    };

    // Popularity Score (20 points)
    const stars = data.basicInfo.stars;
    if (stars >= 10000) scores.popularity = 20;
    else if (stars >= 5000) scores.popularity = 18;
    else if (stars >= 1000) scores.popularity = 15;
    else if (stars >= 500) scores.popularity = 12;
    else if (stars >= 100) scores.popularity = 9;
    else if (stars >= 50) scores.popularity = 6;
    else if (stars >= 10) scores.popularity = 3;

    // Activity Score (25 points)
    if (data.activityTrends) {
        scores.activity = Math.round(data.activityTrends.activityScore * 0.25);
    } else {
        // Fallback: check recent push
        const daysSinceUpdate = Math.floor(
            (Date.now() - new Date(data.basicInfo.pushedAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceUpdate <= 7) scores.activity = 25;
        else if (daysSinceUpdate <= 30) scores.activity = 20;
        else if (daysSinceUpdate <= 90) scores.activity = 15;
        else if (daysSinceUpdate <= 180) scores.activity = 10;
        else scores.activity = 5;
    }

    // Maintenance Score (20 points)
    let maintenancePoints = 0;
    if (data.basicInfo.hasIssues) maintenancePoints += 5;
    if (data.basicInfo.openIssues < 50) maintenancePoints += 5;
    if (data.activityTrends?.issues?.closeRate > 60) maintenancePoints += 5;
    if (data.activityTrends?.pullRequests?.mergeRate > 60) maintenancePoints += 5;
    scores.maintenance = maintenancePoints;

    // Community Score (20 points)
    if (data.contributors) {
        let communityPoints = 0;
        
        // Multiple contributors
        if (data.contributors.totalContributors >= 50) communityPoints += 8;
        else if (data.contributors.totalContributors >= 20) communityPoints += 6;
        else if (data.contributors.totalContributors >= 10) communityPoints += 4;
        else if (data.contributors.totalContributors >= 5) communityPoints += 2;
        
        // Healthy distribution
        if (data.contributors.diversity.isHealthyDistribution) communityPoints += 6;
        
        // Active contributors
        if (data.contributors.recentActivity.activeContributors >= 5) communityPoints += 6;
        else if (data.contributors.recentActivity.activeContributors >= 3) communityPoints += 4;
        else if (data.contributors.recentActivity.activeContributors >= 1) communityPoints += 2;
        
        scores.community = communityPoints;
    } else {
        // Fallback based on forks and watchers
        const forks = data.basicInfo.forks;
        if (forks >= 1000) scores.community = 20;
        else if (forks >= 500) scores.community = 15;
        else if (forks >= 100) scores.community = 10;
        else if (forks >= 50) scores.community = 5;
    }

    // Quality Score (15 points)
    if (data.codeQuality) {
        scores.quality = Math.round(data.codeQuality.score * 0.15);
    } else {
        // Fallback: basic checks
        let qualityPoints = 0;
        if (data.basicInfo.license !== 'None') qualityPoints += 5;
        if (data.techStack.cicdTools?.length > 0) qualityPoints += 5;
        if (data.techStack.buildTools?.length > 0) qualityPoints += 5;
        scores.quality = qualityPoints;
    }

    const healthScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return {
        healthScore: Math.round(healthScore),
        breakdown: {
            popularity: { score: scores.popularity, maxScore: 20 },
            activity: { score: scores.activity, maxScore: 25 },
            maintenance: { score: scores.maintenance, maxScore: 20 },
            community: { score: scores.community, maxScore: 20 },
            quality: { score: scores.quality, maxScore: 15 },
        },
    };
}

