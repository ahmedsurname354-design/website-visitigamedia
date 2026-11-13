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
        // Performance is tracked separately by the asset budget and browser tests.
        // Lighthouse's simulated mobile timings are too variable for a blocking gate.
        'categories:performance': 'off',
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        // Keep these metrics available in uploaded Lighthouse reports, but do not
        // fail deployment because simulated mobile runs fluctuate between CI hosts.
        'largest-contentful-paint': 'off',
        'cumulative-layout-shift': 'off',
        'total-blocking-time': 'off',
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
