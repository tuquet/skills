#!/usr/bin/env node

/**
 * Tuquet Skills Vendor Synchronizer & Exporter
 * 
 * Clones/updates submodules and curates skills into skills/<skill-name>/
 * following the Open Agent Skills specification.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

function exec(cmd, cwd = REPO_ROOT) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd, stdio: 'inherit', encoding: 'utf-8' });
}

async function run() {
  console.log('\n📦 Step 1: Initializing / Updating Git Submodules...');
  try {
    exec('git submodule update --init --recursive');
  } catch (err) {
    console.error('Warning while updating submodules:', err.message);
  }

  console.log('\n🔍 Step 2: Reading Curation Rules from meta.ts...');
  const vendors = [
    {
      name: 'antfu',
      dir: path.join(REPO_ROOT, 'vendors', 'antfu-skills', 'skills'),
      prefix: '',
      skills: [
        'vue',
        'vitest',
        'vite',
        'pnpm',
        'pinia',
        'antfu-create-pr'
      ]
    },
    {
      name: 'ponytail',
      dir: path.join(REPO_ROOT, 'vendors', 'dietrichgebert-ponytail', 'skills'),
      prefix: '',
      skills: [
        'ponytail',
        'ponytail-review',
        'ponytail-audit',
        'ponytail-debt',
        'ponytail-gain'
      ]
    },
    {
      name: 'addyosmani',
      dir: path.join(REPO_ROOT, 'vendors', 'addyosmani-agent-skills', 'skills'),
      prefix: 'addy-',
      skills: [
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
  ];

  console.log('\n🚀 Step 3: Curating and Syncing Skills into skills/ ...');
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
  }

  for (const vendor of vendors) {
    console.log(`\nProcessing vendor [${vendor.name}]...`);
    if (!fs.existsSync(vendor.dir)) {
      console.warn(`Vendor directory not found: ${vendor.dir}`);
      continue;
    }

    for (const skillName of vendor.skills) {
      const srcSkillDir = path.join(vendor.dir, skillName);
      if (!fs.existsSync(srcSkillDir)) {
        console.warn(`  [!] Skill "${skillName}" not found at ${srcSkillDir}`);
        continue;
      }

      const destName = `${vendor.prefix}${skillName}`;
      const destSkillDir = path.join(SKILLS_DIR, destName);

      console.log(`  -> Copying ${skillName} => skills/${destName}`);
      fs.cpSync(srcSkillDir, destSkillDir, { recursive: true });

      // Update name inside SKILL.md if prefix is added
      const skillMdPath = path.join(destSkillDir, 'SKILL.md');
      if (fs.existsSync(skillMdPath) && vendor.prefix) {
        let content = fs.readFileSync(skillMdPath, 'utf-8');
        content = content.replace(/^name:\s*(.+)$/m, `name: ${destName}`);
        fs.writeFileSync(skillMdPath, content, 'utf-8');
      }
    }
  }

  console.log('\n✨ Step 4: Updating Documentation Catalog...');
  try {
    const catalogScript = path.join(__dirname, 'generate-catalog.mjs');
    if (fs.existsSync(catalogScript)) {
      exec(`node "${catalogScript}"`);
    }
  } catch (err) {
    console.warn('Could not run catalog generator:', err.message);
  }

  console.log('\n✅ All skills synchronized successfully!\n');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
