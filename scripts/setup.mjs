#!/usr/bin/env node

/**
 * Universal Workstation Setup Script for Specter & Tuquet Agent Skills
 *
 * Automatically provisions:
 * 1. Tuquet/Specter Plugin in ~/.gemini/config/plugins/
 * 2. Addy Osmani's agent-skills plugin in ~/.gemini/config/plugins/agent-skills
 * 3. Specter Native MCP server in ~/.gemini/config/mcp_config.json
 * 4. Specter MCP Tool Schemas in ~/.gemini/antigravity/mcp/specter/
 * 5. Global Agent Skills links in ~/.gemini/config/skills, ~/.claude/skills, ~/.cursor/skills, ~/.agents/skills
 *
 * Idempotent, zero external dependencies, works across Windows, Linux, and macOS.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const HOME = os.homedir();

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

function log(color, prefix, msg) {
  console.log(`${color}${prefix}${COLORS.reset} ${msg}`);
}

function createSymlinkOrJunction(source, destination) {
  const parent = path.dirname(destination);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }

  if (fs.existsSync(destination)) {
    try {
      const stat = fs.lstatSync(destination);
      if (stat.isSymbolicLink() || stat.isDirectory()) {
        try {
          fs.unlinkSync(destination);
        } catch {
          fs.rmSync(destination, { recursive: true, force: true });
        }
      }
    } catch {}
  }

  const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(source, destination, symlinkType);
}

function setupGeminiPlugins() {
  log(COLORS.cyan, '[PLUGINS]', 'Configuring Gemini / Antigravity plugins...');
  const pluginsDir = path.join(HOME, '.gemini', 'config', 'plugins');
  fs.mkdirSync(pluginsDir, { recursive: true });

  // 1. Link this skills repo as 'tuquet' and 'specter' plugins
  const tuquetPlugin = path.join(pluginsDir, 'tuquet');
  const specterPlugin = path.join(pluginsDir, 'specter');

  createSymlinkOrJunction(REPO_ROOT, tuquetPlugin);
  createSymlinkOrJunction(REPO_ROOT, specterPlugin);
  log(COLORS.green, '  ✓', `Linked Tuquet & Specter plugin -> ${pluginsDir}`);

  // 2. Clone or update addyosmani/agent-skills
  const agentSkillsDir = path.join(pluginsDir, 'agent-skills');
  const gitUrl = 'https://github.com/addyosmani/agent-skills.git';

  if (!fs.existsSync(agentSkillsDir)) {
    log(COLORS.cyan, '  ⬇', `Cloning addyosmani/agent-skills from ${gitUrl}...`);
    try {
      cp.execSync(`git clone ${gitUrl} "${agentSkillsDir}"`, { stdio: 'inherit' });
      log(COLORS.green, '  ✓', `Cloned agent-skills plugin into ${agentSkillsDir}`);
    } catch (e) {
      log(COLORS.yellow, '  ⚠', `Failed to git clone agent-skills: ${e.message}`);
    }
  } else {
    log(COLORS.cyan, '  ↻', `Updating addyosmani/agent-skills at ${agentSkillsDir}...`);
    try {
      cp.execSync('git pull', { cwd: agentSkillsDir, stdio: 'ignore' });
      log(COLORS.green, '  ✓', 'agent-skills plugin is up-to-date');
    } catch {
      log(COLORS.yellow, '  ℹ', 'agent-skills already present (git pull skipped)');
    }
  }

  // 3. Ensure gemini-extension.json in agent-skills
  if (fs.existsSync(agentSkillsDir)) {
    const geminiExtPath = path.join(agentSkillsDir, 'gemini-extension.json');
    if (!fs.existsSync(geminiExtPath)) {
      const manifest = {
        name: 'agent-skills',
        version: '0.6.12',
        description: 'Production-grade engineering skills for AI coding agents by Addy Osmani.',
        contextFileName: 'AGENTS.md',
      };
      fs.writeFileSync(geminiExtPath, JSON.stringify(manifest, null, 2), 'utf8');
      log(COLORS.green, '  ✓', `Generated gemini-extension.json for agent-skills`);
    }
  }
}

function setupMcpServer() {
  log(COLORS.magenta, '[MCP]', 'Registering Specter MCP Server...');
  const mcpConfigPath = path.join(HOME, '.gemini', 'config', 'mcp_config.json');
  fs.mkdirSync(path.dirname(mcpConfigPath), { recursive: true });

  let config = { mcpServers: {} };
  if (fs.existsSync(mcpConfigPath)) {
    try {
      const raw = fs.readFileSync(mcpConfigPath, 'utf8').trim();
      if (raw) config = JSON.parse(raw);
    } catch {}
  }

  if (!config.mcpServers) config.mcpServers = {};

  config.mcpServers.specter = {
    command: 'specter',
    args: ['mcp'],
  };
  config.mcpServers.tuquet = {
    command: 'specter',
    args: ['mcp'],
  };

  fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2), 'utf8');
  log(COLORS.green, '  ✓', `Registered specter MCP in ${mcpConfigPath}`);

  // Query specter mcp tools and write schemas into antigravity mcp folders
  const targetMcpDirs = [
    path.join(HOME, '.gemini', 'antigravity', 'mcp', 'specter'),
    path.join(HOME, '.gemini', 'antigravity-cli', 'mcp', 'specter'),
  ];

  try {
    const specterBin = process.platform === 'win32'
      ? path.join(HOME, '.specter', 'bin', 'specter.exe')
      : path.join(HOME, '.specter', 'bin', 'specter');

    const binCmd = fs.existsSync(specterBin) ? specterBin : 'specter';

    const child = cp.spawn(binCmd, ['mcp'], { stdio: ['pipe', 'pipe', 'ignore'] });
    let buf = '';
    child.stdout.on('data', d => (buf += d.toString()));

    child.on('close', () => {
      const lines = buf.trim().split('\n');
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line.trim());
          if (parsed.result && parsed.result.tools) {
            for (const dir of targetMcpDirs) {
              fs.mkdirSync(dir, { recursive: true });
              for (const tool of parsed.result.tools) {
                const schemaPath = path.join(dir, `${tool.name}.json`);
                fs.writeFileSync(
                  schemaPath,
                  JSON.stringify(
                    {
                      name: tool.name,
                      description: tool.description,
                      parameters: tool.inputSchema,
                    },
                    null,
                    2
                  ),
                  'utf8'
                );
              }
            }
            log(COLORS.green, '  ✓', `Installed ${parsed.result.tools.length} specter tool schemas in Antigravity`);
            break;
          }
        } catch {}
      }
    });

    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) + '\n');
    setTimeout(() => {
      try { child.stdin.end(); } catch {}
    }, 500);
  } catch (e) {
    log(COLORS.yellow, '  ℹ', `Skipped live schema extraction (specter binary probe: ${e.message})`);
  }
}

function linkGlobalSkills() {
  log(COLORS.cyan, '[SKILLS]', 'Linking Tuquet skills to global agent directories...');
  const linkScript = path.join(__dirname, 'link.mjs');
  try {
    cp.execSync(`node "${linkScript}" --global`, { stdio: 'inherit' });
  } catch (e) {
    log(COLORS.red, '  ✗', `Error running link.mjs: ${e.message}`);
  }
}

async function main() {
  console.log(`\n${COLORS.bold}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}  Tuquet & Specter Workstation Skills Setup Tool    ${COLORS.reset}`);
  console.log(`${COLORS.bold}====================================================${COLORS.reset}\n`);

  setupGeminiPlugins();
  setupMcpServer();
  linkGlobalSkills();

  console.log(`\n${COLORS.bold}${COLORS.green}✨ Workstation setup successfully completed!${COLORS.reset}\n`);
}

main().catch(err => {
  console.error(`\n${COLORS.red}Fatal error during setup:${COLORS.reset}`, err);
  process.exit(1);
});
