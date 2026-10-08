#!/usr/bin/env node

/**
 * Tuquet Skills Symlink & Distribution Tool
 *
 * Creates zero-overhead symlinks (or Windows junctions without Admin rights)
 * for AI Agent Skills at global or project level.
 *
 * Compatible with Antigravity, Claude Code, Cursor, and Agent Skills standard.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

// Target directory resolvers
function getAgentTargets(isGlobal, projectDir = process.cwd()) {
  const home = os.homedir();
  if (isGlobal) {
    return {
      antigravity: path.join(home, '.gemini', 'config', 'skills'),
      claude: path.join(home, '.claude', 'skills'),
      cursor: path.join(home, '.cursor', 'skills'),
      agents: path.join(home, '.agents', 'skills'),
    };
  } else {
    return {
      antigravity: path.join(projectDir, '.gemini', 'skills'),
      claude: path.join(projectDir, '.claude', 'skills'),
      cursor: path.join(projectDir, '.cursor', 'skills'),
      agents: path.join(projectDir, '.agents', 'skills'),
    };
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    global: false,
    project: false,
    projectDir: process.cwd(),
    skills: [],
    agents: ['antigravity', 'claude', 'agents'],
    unlink: false,
    list: false,
    copy: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-g' || arg === '--global') {
      options.global = true;
    } else if (arg === '-p' || arg === '--project') {
      options.project = true;
      if (args[i + 1] && !args[i + 1].startsWith('-')) {
        options.projectDir = path.resolve(args[++i]);
      }
    } else if (arg === '-s' || arg === '--skill') {
      if (args[i + 1] && !args[i + 1].startsWith('-')) {
        options.skills.push(args[++i]);
      }
    } else if (arg === '-a' || arg === '--agent') {
      if (args[i + 1] && !args[i + 1].startsWith('-')) {
        const val = args[++i].toLowerCase();
        options.agents = val === '*' || val === 'all' 
          ? ['antigravity', 'claude', 'cursor', 'agents'] 
          : val.split(',').map(s => s.trim());
      }
    } else if (arg === '-u' || arg === '--unlink' || arg === '--remove') {
      options.unlink = true;
    } else if (arg === '-l' || arg === '--list') {
      options.list = true;
    } else if (arg === '--copy') {
      options.copy = true;
    } else if (arg === '-h' || arg === '--help') {
      options.help = true;
    }
  }

  // Default to global if neither is specified
  if (!options.global && !options.project && !options.list && !options.help) {
    options.global = true;
  }

  return options;
}

function printHelp() {
  console.log(`
Tuquet Skills Linker (Zero-Dependency Node.js)

Usage:
  node scripts/link.mjs [options]
  tuquet-skills link [options]

Options:
  -g, --global           Link to global agent config (~/.gemini, ~/.claude, ~/.agents) [Default]
  -p, --project [dir]    Link to current project or specified project directory
  -s, --skill <name>     Link specific skill(s) (can be specified multiple times)
  -a, --agent <agents>   Target agents: antigravity, claude, cursor, agents, or all (comma-separated)
  -u, --unlink           Remove existing symlinks instead of creating
  -l, --list             List available skills in the repository
  --copy                 Copy files instead of symlinking
  -h, --help             Show this help message

Examples:
  node scripts/link.mjs --global
  node scripts/link.mjs --global --skill specter-security
  node scripts/link.mjs --project ./my-web-app --skill specter
  node scripts/link.mjs --unlink --global
`);
}

function getAvailableSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, dirent.name, 'SKILL.md')))
    .map(dirent => dirent.name);
}

function createSymlink(source, destination, copy = false) {
  // Ensure parent directory exists
  const parent = path.dirname(destination);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }

  // Check if destination exists
  if (fs.existsSync(destination)) {
    const stat = fs.lstatSync(destination);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(destination);
    } else if (stat.isDirectory()) {
      // Windows junction check
      try {
        fs.unlinkSync(destination);
      } catch {
        fs.rmSync(destination, { recursive: true, force: true });
      }
    } else {
      fs.unlinkSync(destination);
    }
  }

  if (copy) {
    fs.cpSync(source, destination, { recursive: true });
    return 'COPIED';
  } else {
    // On Windows, use 'junction' for directory symlinks to bypass Admin rights requirement
    const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(source, destination, symlinkType);
    return 'LINKED';
  }
}

function removeSymlink(destination) {
  if (!fs.existsSync(destination)) return false;
  const stat = fs.lstatSync(destination);
  if (stat.isSymbolicLink() || stat.isDirectory()) {
    try {
      fs.unlinkSync(destination);
      return true;
    } catch {
      try {
        fs.rmSync(destination, { recursive: true, force: true });
        return true;
      } catch {
        return false;
      }
    }
  }
  return false;
}

function registerMcpServer() {
  const home = os.homedir();
  const mcpConfigPath = path.join(home, '.gemini', 'config', 'mcp_config.json');
  try {
    const dir = path.dirname(mcpConfigPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let config = { mcpServers: {} };
    if (fs.existsSync(mcpConfigPath)) {
      try {
        const raw = fs.readFileSync(mcpConfigPath, 'utf8').trim();
        if (raw) config = JSON.parse(raw);
      } catch {}
    }
    if (!config.mcpServers) config.mcpServers = {};
    delete config.mcpServers.tuquet;
    config.mcpServers.specter = {
      command: 'specter',
      args: ['mcp'],
    };
    fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`\x1b[35m[MCP SERVER]\x1b[0m Auto-registered native specter MCP server in ${mcpConfigPath}\n`);
  } catch (e) {
    console.error(`\x1b[33m[MCP WARNING]\x1b[0m Failed to auto-register MCP: ${e.message}\n`);
  }
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    return;
  }

  if (options.global && !options.unlink && options.agents.includes('antigravity')) {
    registerMcpServer();
  }

  const availableSkills = getAvailableSkills();

  if (options.list) {
    console.log('\n📦 Available Skills in Tuquet Skills Repository:\n');
    for (const skill of availableSkills) {
      const skillFile = path.join(SKILLS_DIR, skill, 'SKILL.md');
      let desc = '';
      try {
        const content = fs.readFileSync(skillFile, 'utf8');
        const match = content.match(/description:\s*>?-?\s*([^\n\r]+)/);
        if (match) desc = match[1].trim();
      } catch {}
      console.log(`  • \x1b[36m${skill}\x1b[0m: ${desc || 'Agent Skill'}`);
    }
    console.log(`\nTotal: ${availableSkills.length} skills\n`);
    return;
  }

  const targetSkills = options.skills.length > 0 
    ? options.skills.filter(s => availableSkills.includes(s))
    : availableSkills;

  if (targetSkills.length === 0) {
    console.error('\x1b[31m[ERROR]\x1b[0m No valid skills found to process.');
    process.exit(1);
  }

  const targets = getAgentTargets(options.global, options.projectDir);
  const scopeName = options.global ? 'GLOBAL' : `PROJECT (${options.projectDir})`;
  const modeName = options.unlink ? 'UNLINKING' : (options.copy ? 'COPYING' : 'SYMLINKING');

  console.log(`\n🚀 Tuquet Skills Manager [${modeName}] -> [${scopeName}]`);
  console.log(`   Skills: ${targetSkills.join(', ')}`);
  console.log(`   Agents: ${options.agents.join(', ')}\n`);

  let successCount = 0;

  for (const agent of options.agents) {
    const baseDir = targets[agent];
    if (!baseDir) continue;

    console.log(`\x1b[34m[${agent.toUpperCase()}]\x1b[0m -> ${baseDir}`);

    for (const skill of targetSkills) {
      const source = path.join(SKILLS_DIR, skill);
      const dest = path.join(baseDir, skill);

      try {
        if (options.unlink) {
          const removed = removeSymlink(dest);
          if (removed) {
            console.log(`  \x1b[33m✕ UNLINKED\x1b[0m ${skill}`);
            successCount++;
          } else {
            console.log(`  ○ (not found) ${skill}`);
          }
        } else {
          const action = createSymlink(source, dest, options.copy);
          console.log(`  \x1b[32m✓ ${action}\x1b[0m ${skill} -> ${dest}`);
          successCount++;
        }
      } catch (err) {
        console.error(`  \x1b[31m✗ FAILED\x1b[0m ${skill}: ${err.message}`);
      }
    }
    console.log();
  }

  console.log(`✨ Completed successfully! Processed ${successCount} operation(s).\n`);
}

main().catch(err => {
  console.error('\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
