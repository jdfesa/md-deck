#!/usr/bin/env node

/**
 * md-deck CLI
 * Markdown to polished Reveal.js presentation generator.
 *
 * Usage:
 *   md-deck build input.md [options]
 *   md-deck serve input.md [options]
 */

import { Command } from 'commander';
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { parse } from '../src/parser.js';
import { render } from '../src/renderer.js';
import { startServer } from '../src/server.js';

const program = new Command();

program
  .name('md-deck')
  .description('📽️  Markdown → Polished Reveal.js Presentation')
  .version('1.0.0');

// ── BUILD ──
program
  .command('build')
  .description('Build a presentation from a Markdown file')
  .argument('<file>', 'Markdown source file')
  .option('-t, --theme <name>', 'Theme name', 'default')
  .option('-o, --output <dir>', 'Output directory')
  .option('--title <string>', 'Override presentation title')
  .option('--expires <date>', 'Expiration date (YYYY-MM-DD)')
  .option('--no-uuid', 'Don\'t add UUID prefix to output folder')
  .action((file, opts) => {
    try {
      const result = buildPresentation(file, opts);
      console.log('');
      console.log('  ✅ Presentation built successfully!');
      console.log(`  📂 ${result.outputDir}`);
      console.log(`  📄 ${result.outputFile}`);
      console.log('');
    } catch (err) {
      console.error(`\n  ❌ Error: ${err.message}\n`);
      process.exit(1);
    }
  });

// ── SERVE ──
program
  .command('serve')
  .description('Build and serve locally with live preview')
  .argument('<file>', 'Markdown source file')
  .option('-t, --theme <name>', 'Theme name', 'default')
  .option('-p, --port <number>', 'Port number', '8080')
  .option('--title <string>', 'Override presentation title')
  .option('--open', 'Open browser automatically')
  .action(async (file, opts) => {
    try {
      const result = buildPresentation(file, { ...opts, noUuid: true, output: null });

      const port = parseInt(opts.port, 10);
      const server = await startServer(result.outputDir, port);
      const actualPort = server.address().port;

      console.log('');
      console.log('  📽️  md-deck — Live Preview');
      console.log('  ─────────────────────────');
      console.log(`  🌐 http://localhost:${actualPort}`);
      console.log(`  📂 ${result.outputDir}`);
      console.log('  ⌨️  Press Ctrl+C to stop');
      console.log('');

      if (opts.open) {
        const { exec } = await import('node:child_process');
        const cmd = process.platform === 'darwin' ? 'open' :
                    process.platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${cmd} http://localhost:${actualPort}`);
      }
    } catch (err) {
      console.error(`\n  ❌ Error: ${err.message}\n`);
      process.exit(1);
    }
  });

program.parse();

// ── Core Build Logic ──

/**
 * Build a presentation from a markdown file.
 * @param {string} file - Path to the markdown source
 * @param {object} opts - CLI options
 * @returns {{ outputDir: string, outputFile: string }}
 */
function buildPresentation(file, opts) {
  const inputPath = resolve(file);

  if (!existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  const raw = readFileSync(inputPath, 'utf-8');
  const inputDir = dirname(inputPath);
  const fileBaseName = basename(inputPath, '.md');

  // Parse
  const ast = parse(raw);

  // Apply CLI overrides
  if (opts.title) ast.meta.title = opts.title;
  if (opts.expires) ast.meta.expires = opts.expires;

  // Render
  const html = render(ast, { theme: opts.theme });

  // Determine output directory
  let outputDir;
  if (opts.output) {
    outputDir = resolve(opts.output);
  } else {
    const prefix = opts.noUuid ? '' : `${randomUUID().slice(0, 8)}-`;
    outputDir = resolve('output', `${prefix}${fileBaseName}`);
  }

  // Create output directory
  mkdirSync(outputDir, { recursive: true });

  // Write HTML
  const outputFile = join(outputDir, 'index.html');
  writeFileSync(outputFile, html, 'utf-8');

  // Copy images: look for img/ folder relative to the input file
  const imgDir = join(inputDir, 'img');
  if (existsSync(imgDir)) {
    const outImgDir = join(outputDir, 'img');
    cpSync(imgDir, outImgDir, { recursive: true });
  }

  // Also copy diagramas/ folder if it exists (backwards compat with test/)
  const diagramasDir = join(inputDir, 'diagramas');
  if (existsSync(diagramasDir)) {
    const outDiagramasDir = join(outputDir, 'diagramas');
    cpSync(diagramasDir, outDiagramasDir, { recursive: true });
  }

  return { outputDir, outputFile };
}
