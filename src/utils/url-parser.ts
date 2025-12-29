/**
 * Parses a GitHub repository URL and extracts owner and repo name
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
    // Remove trailing slash and .git extension if present
    const cleanUrl = url.trim().replace(/\/$/, '').replace(/\.git$/, '');
    
    // Support different GitHub URL formats:
    // - https://github.com/owner/repo
    // - http://github.com/owner/repo
    // - github.com/owner/repo
    // - git@github.com:owner/repo
    
    let match;
    
    // HTTPS/HTTP format
    match = cleanUrl.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
        return { owner: match[1], repo: match[2] };
    }
    
    // SSH format
    match = cleanUrl.match(/git@github\.com:([^\/]+)\/([^\/]+)/);
    if (match) {
        return { owner: match[1], repo: match[2] };
    }
    
    throw new Error(`Invalid GitHub URL format: ${url}. Expected format: https://github.com/owner/repo`);
}

