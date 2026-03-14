#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { createServer } from 'http-server';
import { promisify } from 'util';

const execAsync = promisify(exec);

const CHECKPOINTS_DIR = path.join(process.cwd(), 'checkpoints');
const AUDITS_DIR = path.join(process.cwd(), '.planning', 'audits', 'light');
const PORT = 8765;
const BASE_URL = `http://localhost:${PORT}`;

// Ensure audit directory exists
if (!fs.existsSync(AUDITS_DIR)) {
  fs.mkdirSync(AUDITS_DIR, { recursive: true });
}

// Get all checkpoint HTML files
function getCheckpointFiles() {
  const files = fs.readdirSync(CHECKPOINTS_DIR)
    .filter(f => f.endsWith('.html'))
    .sort();
  return files;
}

// Start http-server
function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer({ root: process.cwd() });
    server.listen(PORT, 'localhost', () => {
      console.log(`HTTP server started on ${BASE_URL}`);
      resolve(server);
    });
    setTimeout(() => reject(new Error('Server startup timeout')), 5000);
  });
}

// Run pa11y with axe runner on a single URL (for axe-style results)
async function runPa11yAxe(url) {
  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        `pa11y "${url}" --runner axe --reporter json --include-notices`,
        { timeout: 30000, maxBuffer: 10 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error && error.code !== 2) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        }
      );
    });
    const results = JSON.parse(stdout);
    return results;
  } catch (error) {
    console.error(`Pa11y (axe runner) error on ${url}: ${error.message}`);
    return null;
  }
}

// Run pa11y with htmlcs runner on a single URL
async function runPa11yHtmlcs(url) {
  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        `pa11y "${url}" --runner htmlcs --reporter json --include-notices`,
        { timeout: 30000, maxBuffer: 10 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error && error.code !== 2) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        }
      );
    });
    const results = JSON.parse(stdout);
    return results;
  } catch (error) {
    console.error(`Pa11y (htmlcs runner) error on ${url}: ${error.message}`);
    return null;
  }
}

// Main audit function
async function auditCheckpoints() {
  let server;
  try {
    server = await startServer();

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    const files = getCheckpointFiles();
    console.log(`Scanning ${files.length} checkpoint files in LIGHT mode...`);

    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const name = filename.replace('.html', '');
      const url = `${BASE_URL}/checkpoints/${filename}`;

      console.log(`[${i + 1}/${files.length}] Scanning ${name}...`);

      // Run pa11y with axe runner
      const axeResults = await runPa11yAxe(url);
      if (axeResults) {
        const axeFile = path.join(AUDITS_DIR, `${name}.json`);
        fs.writeFileSync(axeFile, JSON.stringify(axeResults, null, 2));
        console.log(`  ✓ Axe results written`);
      } else {
        console.log(`  ✗ Axe failed`);
      }

      // Run pa11y with htmlcs runner
      const htmlcsResults = await runPa11yHtmlcs(url);
      if (htmlcsResults) {
        const htmlcsFile = path.join(AUDITS_DIR, `${name}-pa11y.json`);
        fs.writeFileSync(htmlcsFile, JSON.stringify(htmlcsResults, null, 2));
        console.log(`  ✓ Pa11y (htmlcs) results written`);
      } else {
        console.log(`  ✗ Pa11y failed`);
      }
    }

    console.log('\nLight mode audit complete!');

  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
      console.log('HTTP server closed');
    }
  }
}

auditCheckpoints();
