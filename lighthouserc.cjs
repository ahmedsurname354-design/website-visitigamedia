module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local:',
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/product',
        'http://127.0.0.1:4173/portfolio',
        'http://127.0.0.1:4173/news',
        process.env.LHCI_ARTICLE_URL || 'http://127.0.0.1:4173/news',
      ],
      numberOfRuns: 1,
      settings: { chromeFlags: '--headless --no-sandbox', formFactor: 'mobile', throttlingMethod: 'devtools' },
    },
    assert: {
      assertions: {
        // Route-level baseline guard. Asset budgets below remain the stricter regression gate.
        'categories:performance': ['error', { minScore: 0.65 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 8500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
