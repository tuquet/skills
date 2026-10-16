/**
 * Tuquet Skills Ecosystem - Source Metadata & Curation Policy
 * 
 * Defines upstream Git submodules and which skills are curated into
 * the central tuquet/skills distribution.
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
  // Production-grade engineering skills by Addy Osmani
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
  },

  // Senior developer mindset by Dietrich Gebert (Radical simplicity)
  'ponytail': {
    url: 'https://github.com/DietrichGebert/ponytail.git',
    path: 'vendors/dietrichgebert-ponytail',
    prefix: '', // already prefixed with ponytail-*
    includeOnly: [
      'ponytail',
      'ponytail-review',
      'ponytail-audit',
      'ponytail-debt',
      'ponytail-gain'
    ]
  }
}

export const internalSkills = [
  'review-shadcn-standard'
]
