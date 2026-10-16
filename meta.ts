/**
 * Tuquet Skills Ecosystem - Source Metadata & Curation Policy
 * 
 * Defines upstream Git submodules and internal modules curated into
 * the central tuquet/skills distribution hub.
 */

export interface VendorConfig {
  url: string
  path: string
  branch?: string
  /** Prefix applied to skill folders when curated, to avoid collision */
  prefix?: string
  /** Explicit skills to import. If empty or omitted, imports all */
  includeOnly?: string[]
}

export const vendors: Record<string, VendorConfig> = {
  // Anthony Fu's modern web & framework skills (Vue, Vitest, Vite, Pnpm, Pinia, PR)
  'antfu': {
    url: 'https://github.com/antfu/skills.git',
    path: 'vendors/antfu-skills',
    prefix: '',
    includeOnly: [
      'vue',
      'vitest',
      'vite',
      'pnpm',
      'pinia',
      'antfu-create-pr'
    ]
  },

  // Senior developer mindset by Dietrich Gebert (Radical simplicity & minimalism)
  'ponytail': {
    url: 'https://github.com/DietrichGebert/ponytail.git',
    path: 'vendors/dietrichgebert-ponytail',
    prefix: '',
    includeOnly: [
      'ponytail',
      'ponytail-review',
      'ponytail-audit',
      'ponytail-debt',
      'ponytail-gain'
    ]
  },

  // Production-grade engineering skills by Addy Osmani (Google)
  'addyosmani': {
    url: 'https://github.com/addyosmani/agent-skills.git',
    path: 'vendors/addyosmani-agent-skills',
    prefix: 'addy-',
    includeOnly: [
      'code-review-and-quality',
      'browser-testing-with-devtools',
      'performance-optimization',
      'security-and-hardening',
      'frontend-ui-engineering',
      'test-driven-development',
      'debugging-and-error-recovery',
      'api-and-interface-design',
      'planning-and-task-breakdown',
      'context-engineering'
    ]
  }
}

/**
 * Tuquet & Specter Native Ecosystem Skills
 */
export const internalSkills = [
  'review-shadcn-standard',
  'specter',
  'specter-runner',
  'specter-cli',
  'specter-automa',
  'specter-bridge',
  'specter-browser',
  'specter-cicd',
  'specter-cloud',
  'specter-desktop',
  'specter-dev',
  'specter-faker',
  'specter-help',
  'specter-security',
  'automa-core',
  'automa-monorepo',
  'automa-shadcn',
  'automa-webe'
]
