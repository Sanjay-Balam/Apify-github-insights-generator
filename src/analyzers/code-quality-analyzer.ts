import { Octokit } from '@octokit/rest';

export async function analyzeCodeQuality(
    octokit: Octokit,
    owner: string,
    repo: string,
    defaultBranch: string
) {
    // Get repository tree to analyze file structure
    const { data: tree } = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: 'true',
    });

    const files = tree.tree.filter((item: any) => item.type === 'blob');
    
    // Analyze documentation
    const documentation = analyzeDocumentation(files);
    
    // Analyze tests
    const tests = analyzeTests(files);
    
    // Analyze file structure
    const structure = analyzeStructure(files);
    
    // Check for configuration files
    const hasLinting = files.some((f: any) => 
        f.path?.includes('.eslintrc') || 
        f.path?.includes('.pylintrc') ||
        f.path?.includes('.rubocop.yml') ||
        f.path?.includes('tslint.json')
    );
    
    const hasFormatting = files.some((f: any) => 
        f.path?.includes('.prettierrc') || 
        f.path?.includes('.editorconfig') ||
        f.path?.includes('.black') ||
        f.path?.includes('.clang-format')
    );

    const hasTypeChecking = files.some((f: any) => 
        f.path?.includes('tsconfig.json') || 
        f.path?.includes('mypy.ini') ||
        f.path?.includes('pyproject.toml')
    );

    const codeQualityScore = calculateCodeQualityScore({
        documentation,
        tests,
        hasLinting,
        hasFormatting,
        hasTypeChecking,
    });

    return {
        score: codeQualityScore,
        documentation,
        testing: tests,
        codeStandards: {
            hasLinting,
            hasFormatting,
            hasTypeChecking,
        },
        fileStructure: structure,
    };
}

function analyzeDocumentation(files: any[]) {
    const readmeFiles = files.filter((f: any) => 
        f.path?.toLowerCase().match(/^readme\.(md|txt|rst)$/)
    );
    
    const contributingFile = files.some((f: any) => 
        f.path?.toLowerCase().includes('contributing')
    );
    
    const licenseFile = files.some((f: any) => 
        f.path?.toLowerCase().match(/^license/)
    );
    
    const codeOfConduct = files.some((f: any) => 
        f.path?.toLowerCase().includes('code_of_conduct') ||
        f.path?.toLowerCase().includes('code-of-conduct')
    );

    const changelogFile = files.some((f: any) => 
        f.path?.toLowerCase().match(/^changelog/)
    );

    const docsFolder = files.some((f: any) => 
        f.path?.toLowerCase().startsWith('docs/')
    );

    const docComments = files.filter((f: any) => {
        const path = f.path?.toLowerCase() || '';
        return path.endsWith('.ts') || path.endsWith('.js') || 
               path.endsWith('.py') || path.endsWith('.java');
    }).length;

    return {
        hasReadme: readmeFiles.length > 0,
        hasContributing: contributingFile,
        hasLicense: licenseFile,
        hasCodeOfConduct: codeOfConduct,
        hasChangelog: changelogFile,
        hasDocsFolder: docsFolder,
        estimatedDocumentedFiles: docComments,
        documentationScore: calculateDocScore({
            hasReadme: readmeFiles.length > 0,
            hasContributing: contributingFile,
            hasLicense: licenseFile,
            hasCodeOfConduct: codeOfConduct,
            hasChangelog: changelogFile,
            hasDocsFolder: docsFolder,
        }),
    };
}

function analyzeTests(files: any[]) {
    const testFiles = files.filter((f: any) => {
        const path = f.path?.toLowerCase() || '';
        return path.includes('test') || 
               path.includes('spec') || 
               path.includes('__tests__') ||
               path.endsWith('.test.ts') ||
               path.endsWith('.test.js') ||
               path.endsWith('.spec.ts') ||
               path.endsWith('.spec.js') ||
               path.endsWith('_test.py') ||
               path.endsWith('_spec.rb');
    });

    const totalFiles = files.length;
    const testCoverage = totalFiles > 0 ? (testFiles.length / totalFiles * 100).toFixed(2) : '0';

    const hasTestingFramework = files.some((f: any) => {
        const path = f.path?.toLowerCase() || '';
        return path.includes('jest.config') ||
               path.includes('vitest.config') ||
               path.includes('pytest.ini') ||
               path.includes('phpunit.xml') ||
               path.includes('karma.conf');
    });

    return {
        testFileCount: testFiles.length,
        totalFileCount: totalFiles,
        estimatedCoveragePercentage: testCoverage,
        hasTestingFramework,
        testingScore: calculateTestScore(testFiles.length, totalFiles, hasTestingFramework),
    };
}

function analyzeStructure(files: any[]) {
    const directories = new Set<string>();
    
    files.forEach((f: any) => {
        if (f.path) {
            const parts = f.path.split('/');
            if (parts.length > 1) {
                directories.add(parts[0]);
            }
        }
    });

    const commonStructures = {
        hasSrcFolder: directories.has('src'),
        hasLibFolder: directories.has('lib'),
        hasTestFolder: directories.has('test') || directories.has('tests') || directories.has('__tests__'),
        hasDocsFolder: directories.has('docs') || directories.has('documentation'),
        hasExamplesFolder: directories.has('examples') || directories.has('sample'),
        hasConfigFolder: directories.has('config') || directories.has('configs'),
    };

    return {
        topLevelDirectories: Array.from(directories),
        totalFiles: files.length,
        ...commonStructures,
        isWellStructured: Object.values(commonStructures).filter(Boolean).length >= 3,
    };
}

function calculateDocScore(docs: any): number {
    let score = 0;
    if (docs.hasReadme) score += 30;
    if (docs.hasLicense) score += 20;
    if (docs.hasContributing) score += 15;
    if (docs.hasDocsFolder) score += 20;
    if (docs.hasChangelog) score += 10;
    if (docs.hasCodeOfConduct) score += 5;
    return score;
}

function calculateTestScore(testFiles: number, totalFiles: number, hasFramework: boolean): number {
    if (totalFiles === 0) return 0;
    
    const coverage = (testFiles / totalFiles) * 100;
    let score = Math.min(coverage * 0.8, 80); // Max 80 points for coverage
    
    if (hasFramework) score += 20; // 20 points for having testing framework
    
    return Math.round(score);
}

function calculateCodeQualityScore(metrics: any): number {
    let score = 0;
    
    // Documentation (30 points)
    score += metrics.documentation.documentationScore * 0.3;
    
    // Testing (30 points)
    score += metrics.tests.testingScore * 0.3;
    
    // Code standards (40 points)
    if (metrics.hasLinting) score += 15;
    if (metrics.hasFormatting) score += 10;
    if (metrics.hasTypeChecking) score += 15;
    
    return Math.round(score);
}

