import { Octokit } from '@octokit/rest';

export async function analyzeTechStack(
    octokit: Octokit,
    owner: string,
    repo: string,
    defaultBranch: string
) {
    // Get languages used in the repository
    const { data: languages } = await octokit.repos.listLanguages({ owner, repo });
    
    const totalBytes = Object.values(languages).reduce((sum: number, bytes) => sum + (bytes as number), 0);
    
    const languageStats = Object.entries(languages).map(([lang, bytes]) => ({
        name: lang,
        bytes: bytes as number,
        percentage: ((bytes as number) / totalBytes * 100).toFixed(2),
    })).sort((a, b) => b.bytes - a.bytes);

    // Get root directory contents to detect frameworks and tools
    const { data: contents } = await octokit.repos.getContent({
        owner,
        repo,
        path: '',
    });

    const fileNames = Array.isArray(contents) 
        ? contents.map((item: any) => item.name.toLowerCase())
        : [];

    // Detect frameworks and tools based on file presence
    const frameworks = detectFrameworks(fileNames);
    const buildTools = detectBuildTools(fileNames);
    const packageManagers = detectPackageManagers(fileNames);
    const cicdTools = detectCICDTools(fileNames);

    // Get dependencies (for Node.js projects)
    let dependencies = null;
    if (fileNames.includes('package.json')) {
        try {
            const { data: packageJson } = await octokit.repos.getContent({
                owner,
                repo,
                path: 'package.json',
            });
            
            if ('content' in packageJson) {
                const content = Buffer.from(packageJson.content, 'base64').toString('utf-8');
                const pkg = JSON.parse(content);
                dependencies = {
                    production: Object.keys(pkg.dependencies || {}),
                    development: Object.keys(pkg.devDependencies || {}),
                    totalCount: Object.keys(pkg.dependencies || {}).length + Object.keys(pkg.devDependencies || {}).length,
                };
            }
        } catch (error) {
            console.log('    Could not parse package.json');
        }
    }

    return {
        languages: languageStats.map(l => l.name),
        primaryLanguage: languageStats[0]?.name || 'Unknown',
        languageBreakdown: languageStats,
        frameworks,
        buildTools,
        packageManagers,
        cicdTools,
        dependencies,
    };
}

function detectFrameworks(fileNames: string[]): string[] {
    const frameworks: string[] = [];
    
    const frameworkDetectors: Record<string, string[]> = {
        'React': ['package.json'], // Will check package.json content separately
        'Next.js': ['next.config.js', 'next.config.mjs', 'next.config.ts'],
        'Vue': ['vue.config.js', 'vite.config.js'],
        'Angular': ['angular.json'],
        'Svelte': ['svelte.config.js'],
        'Django': ['manage.py', 'wsgi.py'],
        'Flask': ['app.py', 'wsgi.py'],
        'FastAPI': ['main.py'],
        'Express': ['package.json'], // Will check package.json
        'Ruby on Rails': ['rakefile', 'gemfile', 'config.ru'],
        'Spring Boot': ['pom.xml', 'build.gradle'],
        'Laravel': ['artisan', 'composer.json'],
        'ASP.NET': ['web.config', 'appsettings.json'],
        '.NET Core': ['program.cs', 'startup.cs'],
    };

    for (const [framework, indicators] of Object.entries(frameworkDetectors)) {
        if (indicators.some(indicator => fileNames.includes(indicator))) {
            frameworks.push(framework);
        }
    }

    return frameworks;
}

function detectBuildTools(fileNames: string[]): string[] {
    const tools: string[] = [];
    
    const buildToolMap: Record<string, string> = {
        'webpack.config.js': 'Webpack',
        'vite.config.js': 'Vite',
        'vite.config.ts': 'Vite',
        'rollup.config.js': 'Rollup',
        'gulpfile.js': 'Gulp',
        'gruntfile.js': 'Grunt',
        'tsconfig.json': 'TypeScript',
        'babel.config.js': 'Babel',
        '.babelrc': 'Babel',
        'makefile': 'Make',
        'cmake.txt': 'CMake',
        'build.gradle': 'Gradle',
        'pom.xml': 'Maven',
    };

    for (const [file, tool] of Object.entries(buildToolMap)) {
        if (fileNames.includes(file)) {
            tools.push(tool);
        }
    }

    return [...new Set(tools)];
}

function detectPackageManagers(fileNames: string[]): string[] {
    const managers: string[] = [];
    
    const managerMap: Record<string, string> = {
        'package-lock.json': 'npm',
        'yarn.lock': 'Yarn',
        'pnpm-lock.yaml': 'pnpm',
        'requirements.txt': 'pip',
        'pipfile': 'Pipenv',
        'poetry.lock': 'Poetry',
        'gemfile.lock': 'Bundler',
        'composer.lock': 'Composer',
        'go.mod': 'Go Modules',
        'cargo.toml': 'Cargo',
    };

    for (const [file, manager] of Object.entries(managerMap)) {
        if (fileNames.includes(file)) {
            managers.push(manager);
        }
    }

    return managers;
}

function detectCICDTools(fileNames: string[]): string[] {
    const tools: string[] = [];
    
    if (fileNames.includes('.github')) tools.push('GitHub Actions');
    if (fileNames.includes('.gitlab-ci.yml')) tools.push('GitLab CI');
    if (fileNames.includes('.travis.yml')) tools.push('Travis CI');
    if (fileNames.includes('.circleci')) tools.push('CircleCI');
    if (fileNames.includes('jenkinsfile')) tools.push('Jenkins');
    if (fileNames.includes('.drone.yml')) tools.push('Drone CI');
    if (fileNames.includes('azure-pipelines.yml')) tools.push('Azure Pipelines');

    return tools;
}

