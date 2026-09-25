module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/serve-dist.mjs',
      startServerReadyPattern: 'Static build:',
      url: [
        'http://127.0.0.1:4173/id/',
        'http://127.0.0.1:4173/id/product/',
        'http://127.0.0.1:4173/id/portfolio/',
        'http://127.0.0.1:4173/id/news/',
        process.env.LHCI_ARTICLE_URL || 'http://127.0.0.1:4173/id/news/',
      ],
      numberOfRuns: 1,
      settings: { chromeFlags: '--headless --no-sandbox', formFactor: 'mobile', throttlingMethod: 'simulate' },
    },
    assert: {
      assertions: {
        // Route-level baseline guard. Asset budgets below remain the stricter regression gate.
        'categories:performance': ['warn', { minScore: 0.65 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 8500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.13 }],
        'total-blocking-time': ['error', { maxNumericValue: 700 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
