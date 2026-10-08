#!/usr/bin/env node

/**
 * Tuquet Skills CLI
 * Executable entry point for npx and global package execution.
 */

const cmd = process.argv[2];

if (cmd === 'setup' || cmd === 'install' || cmd === 'init') {
  await import('../scripts/setup.mjs');
} else {
  await import('../scripts/link.mjs');
}
