import fs from 'fs';
import path from 'path';

/**
 * Custom Playwright reporter that collects a11y issues from test annotations
 * and outputs issues-report.json + coverage-matrix.md.
 */
class IssueReporter {
  constructor() {
    this.issues = [];
    this.coverage = {};
  }

  onTestEnd(test, result) {
    // Extract checkpoint from test title (format: "1.1.1 - test name")
    const match = test.title.match(/^(\d+\.\d+\.\d+)/);
    const checkpoint = match ? match[1] : 'unknown';

    // Determine suite from parent
    const suiteName = test.parent?.title || 'unknown';

    // Track coverage
    if (!this.coverage[checkpoint]) {
      this.coverage[checkpoint] = {
        checkpoint,
        pageLoad: false,
        skipLink: false,
        keyboardNav: false,
        toggle: false,
        passDemoA11y: false,
        announcements: false,
        manualNeeded: [],
      };
    }

    const cov = this.coverage[checkpoint];
    if (suiteName.includes('Global')) {
      cov.pageLoad = true;
      cov.skipLink = true;
    }
    if (suiteName.includes('Keyboard')) cov.keyboardNav = true;
    if (suiteName.includes('Toggle')) {
      cov.toggle = true;
      cov.announcements = true;
    }
    if (suiteName.includes('Pass Demo')) cov.passDemoA11y = true;

    // Collect issues from annotations
    for (const annotation of result.annotations || []) {
      if (annotation.type === 'a11y-issue') {
        try {
          const issue = JSON.parse(annotation.description);
          this.issues.push(issue);
        } catch {
          // skip malformed annotations
        }
      }
    }

    // Also record test failures as issues
    if (result.status === 'failed') {
      this.issues.push({
        checkpoint,
        file: '',
        category: suiteName.toLowerCase().includes('pass') ? 'pass-demo' : 'site-shell',
        severity: 'error',
        description: `Test failed: ${test.title} — ${result.error?.message?.slice(0, 200) || 'unknown error'}`,
        element: '',
        action: 'needs-review',
      });
    }
  }

  async onEnd() {
    const outDir = path.resolve('test-results');
    fs.mkdirSync(outDir, { recursive: true });

    // Write issues report
    const issuesPath = path.join(outDir, 'issues-report.json');
    fs.writeFileSync(issuesPath, JSON.stringify(this.issues, null, 2));

    // Write coverage matrix
    const matrixPath = path.join(outDir, 'coverage-matrix.md');
    const lines = [
      '# Coverage Matrix',
      '',
      '| Checkpoint | Page Load | Skip Link | Keyboard Nav | Toggle | Pass Demo A11y | Announcements | Manual UAT Needed |',
      '|-----------|-----------|-----------|-------------|--------|---------------|--------------|-------------------|',
    ];

    const checkpoints = Object.values(this.coverage).sort((a, b) =>
      a.checkpoint.localeCompare(b.checkpoint, undefined, { numeric: true })
    );

    for (const c of checkpoints) {
      const yn = (v) => (v ? 'auto' : '-');
      const manual = c.manualNeeded.length > 0 ? c.manualNeeded.join(', ') : 'SR verification';
      lines.push(
        `| ${c.checkpoint} | ${yn(c.pageLoad)} | ${yn(c.skipLink)} | ${yn(c.keyboardNav)} | ${yn(c.toggle)} | ${yn(c.passDemoA11y)} | ${yn(c.announcements)} | ${manual} |`
      );
    }

    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Total issues found: ${this.issues.length}`);

    const bySeverity = { error: 0, warning: 0, info: 0 };
    for (const issue of this.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1;
    }
    lines.push(`Errors: ${bySeverity.error} | Warnings: ${bySeverity.warning} | Info: ${bySeverity.info}`);

    fs.writeFileSync(matrixPath, lines.join('\n'));

    console.log(`\n📋 Issues report: ${issuesPath} (${this.issues.length} issues)`);
    console.log(`📊 Coverage matrix: ${matrixPath}`);
  }
}

export default IssueReporter;
