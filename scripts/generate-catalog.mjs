#!/usr/bin/env node

/**
 * Tuquet Skills Catalog Generator & SSOT Synchronizer
 *
 * Scans `skills/` directory, extracts frontmatter metadata, and automatically
 * updates the Skills Catalog table in README.md and tuquet-help/SKILL.md.
 * Eliminates parallel manual markdown table maintenance completely.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
const README_PATH = path.join(REPO_ROOT, 'README.md');
const HELP_SKILL_PATH = fs.existsSync(path.join(SKILLS_DIR, 'specter-help', 'SKILL.md'))
  ? path.join(SKILLS_DIR, 'specter-help', 'SKILL.md')
  : path.join(SKILLS_DIR, 'tuquet-help', 'SKILL.md');

function parseSkillFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const nameMatch = yaml.match(/^name:\s*(.+)$/m);
  const argMatch = yaml.match(/^argument-hint:\s*(.+)$/m);
  
  // Extract description (single or multi-line)
  let description = '';
  const descMatch = yaml.match(/^description:\s*(?:>|-)?\s*\r?\n([\s\S]*?)(?=^[a-z-]+:|$)/m);
  if (descMatch) {
    description = descMatch[1].replace(/\r?\n\s*/g, ' ').trim();
  } else {
    const singleDescMatch = yaml.match(/^description:\s*(.+)$/m);
    if (singleDescMatch) {
      description = singleDescMatch[1].trim();
    }
  }

  const name = nameMatch ? nameMatch[1].trim() : '';
  const rawArg = argMatch ? argMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const argumentHint = rawArg || '*(None)*';

  return { name, description, argumentHint };
}

function getSkills() {
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;

    const content = fs.readFileSync(skillMd, 'utf8');
    const meta = parseSkillFrontmatter(content);
    if (meta && meta.name) {
      skills.push(meta);
    }
  }

  // Sort: 'tuquet' first, then alphabetical
  skills.sort((a, b) => {
    if (a.name === 'tuquet') return -1;
    if (b.name === 'tuquet') return 1;
    return a.name.localeCompare(b.name);
  });

  return skills;
}

function generateMarkdownTable(skills) {
  let table = '| Skill | Trigger | Argument Hint | Scope & Purpose |\n';
  table += '| :--- | :--- | :--- | :--- |\n';

  for (const skill of skills) {
    const slash = `\`/${skill.name}\``;
    const arg = skill.argumentHint === '*(None)*' ? '*(None)*' : `\`${skill.argumentHint.replace(/\|/g, '\\|')}\``;
    // Extract short summary up to first sentence or 120 chars
    let shortDesc = skill.description.split(/\. |\.\r?\n/)[0];
    if (!shortDesc.endsWith('.')) shortDesc += '.';
    table += `| **${skill.name}** | ${slash} | ${arg} | ${shortDesc} |\n`;
  }

  return table.trim();
}

function generateMarkdownList(skills) {
  let list = '';
  for (const skill of skills) {
    let shortDesc = skill.description.split(/\. |\.\r?\n/)[0];
    if (!shortDesc.endsWith('.')) shortDesc += '.';
    list += `   - [**\`${skill.name}\`**](./skills/${skill.name}/SKILL.md) (\`/${skill.name}\`): ${shortDesc}\n`;
  }
  return list.trimEnd();
}

function updateFileSection(filePath, startMarker, endMarker, newContent) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    return false;
  }

  const updated = 
    content.slice(0, startIndex + startMarker.length) +
    '\n' + newContent + '\n' +
    content.slice(endIndex);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const isCheck = process.argv.includes('--check');
  const skills = getSkills();
  console.log(`\n🔍 Found ${skills.length} skills in ${SKILLS_DIR}`);

  const table = generateMarkdownTable(skills);
  const list = generateMarkdownList(skills);

  const startMarker = '<!-- SKILLS_CATALOG_START -->';
  const endMarker = '<!-- SKILLS_CATALOG_END -->';

  let changed = false;

  // 1. Update tuquet-help/SKILL.md table
  if (fs.existsSync(HELP_SKILL_PATH)) {
    const helpContent = fs.readFileSync(HELP_SKILL_PATH, 'utf8');
    if (!helpContent.includes(startMarker)) {
      // Inject markers around the table
      const tableRegex = /\| Skill \| Trigger[\s\S]*?(?=\n\n## CLI Cheatsheet)/;
      const injected = helpContent.replace(tableRegex, `${startMarker}\n${table}\n${endMarker}`);
      fs.writeFileSync(HELP_SKILL_PATH, injected, 'utf8');
      console.log(`  ✓ Injected catalog markers and updated: ${path.relative(REPO_ROOT, HELP_SKILL_PATH)}`);
      changed = true;
    } else {
      const updated = updateFileSection(HELP_SKILL_PATH, startMarker, endMarker, table);
      if (updated) {
        console.log(`  ✓ Updated catalog table in: ${path.relative(REPO_ROOT, HELP_SKILL_PATH)}`);
        changed = true;
      }
    }
  }

  // 2. Update README.md list
  if (fs.existsSync(README_PATH)) {
    const readmeContent = fs.readFileSync(README_PATH, 'utf8');
    if (!readmeContent.includes(startMarker)) {
      // Inject markers around the skill list
      const listRegex = /1\. \*\*Bộ Skills[\s\S]*?(?=\n2\. \*\*Kiến trúc)/;
      const injected = readmeContent.replace(
        listRegex,
        `1. **Bộ Skills Chuẩn hóa Atomic (\`tuquet-*\`)**:\n${startMarker}\n${list}\n${endMarker}`
      );
      fs.writeFileSync(README_PATH, injected, 'utf8');
      console.log(`  ✓ Injected catalog markers and updated: ${path.relative(REPO_ROOT, README_PATH)}`);
      changed = true;
    } else {
      const updated = updateFileSection(README_PATH, startMarker, endMarker, list);
      if (updated) {
        console.log(`  ✓ Updated catalog list in: ${path.relative(REPO_ROOT, README_PATH)}`);
        changed = true;
      }
    }
  }

  if (isCheck && changed) {
    console.error('\n❌ Skills catalog is out of sync. Run "pnpm run sync:docs" to regenerate.\n');
    process.exit(1);
  }

  console.log('✨ Skills Catalog is 100% in sync with physical files!\n');
}

main();
