export const docsSite = {
  base: '/docs/',
  name: 'TaskPilot Documentation',
  description: 'Product, architecture, engineering, delivery, and project guidance for TaskPilot.',
};

export const docsSections = [
  {
    title: 'Product',
    pages: [
      { slug: '', label: 'Documentation overview', source: 'docs/README.md' },
      { slug: 'introduction', label: 'Introduction and MVP', source: 'README.md' },
      { slug: 'troubleshooting', label: 'Troubleshooting', source: 'docs/TROUBLESHOOTING.md' },
    ],
  },
  {
    title: 'Architecture',
    pages: [
      { slug: 'architecture', label: 'Architecture overview', source: 'docs/ARCHITECTURE.md' },
      { slug: 'data-contracts', label: 'Data contracts', source: 'docs/API.md' },
      { slug: 'local-storage', label: 'Accessibility and storage', source: 'docs/accessibility-and-storage.md' },
      { slug: 'mobile', label: 'Android and iOS', source: 'docs/mobile-capacitor.md' },
      { slug: 'decisions', label: 'Decision index', source: 'docs/adr/README.md' },
      { slug: 'decisions/frontend-json', label: 'ADR: JSON persistence', source: 'docs/adr/0001-frontend-json-persistence.md' },
      { slug: 'decisions/record-visibility', label: 'ADR: Record visibility', source: 'docs/adr/0002-operational-record-visibility.md' },
      { slug: 'decisions/github-pages', label: 'ADR: GitHub Pages', source: 'docs/adr/0003-github-pages-deployment.md' },
    ],
  },
  {
    title: 'Engineering',
    pages: [
      { slug: 'development', label: 'Development setup', source: 'docs/DEVELOPMENT.md' },
      { slug: 'code-walkthrough', label: 'Code walkthrough', source: 'docs/developer-guide.md' },
      { slug: 'testing', label: 'Testing strategy', source: 'docs/TESTING.md' },
      { slug: 'quality', label: 'Quality evidence', source: 'docs/quality-review.md' },
      { slug: 'security', label: 'Security', source: 'docs/SECURITY.md' },
    ],
  },
  {
    title: 'Delivery',
    pages: [
      { slug: 'deployment', label: 'Deployment', source: 'docs/DEPLOYMENT.md' },
      { slug: 'operations', label: 'Operations', source: 'docs/OPERATIONS.md' },
      { slug: 'release-checklist', label: 'Release checklist', source: 'docs/RELEASE_CHECKLIST.md' },
      { slug: 'changelog', label: 'Changelog', source: 'CHANGELOG.md' },
    ],
  },
  {
    title: 'Project',
    pages: [
      { slug: 'current-status', label: 'Current status', source: 'CURRENT_STATUS.md' },
      { slug: 'contributing', label: 'Contributing', source: 'CONTRIBUTING.md' },
      { slug: 'continuity', label: 'Codex continuity', source: 'AGENTS.md' },
      { slug: 'license', label: 'License', source: 'LICENSE' },
      { slug: 'third-party', label: 'Third-party licenses', source: 'THIRD_PARTY_LICENSES.md' },
    ],
  },
];

export const docsPages = docsSections.flatMap((section) => (
  section.pages.map((page) => ({ ...page, section: section.title }))
));

export function pageUrl(page) {
  return page.slug ? `${docsSite.base}${page.slug}/` : docsSite.base;
}
