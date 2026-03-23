/**
 * Issue collector — accumulates findings during test runs.
 * Issues are attached to test results via annotations and collected by the reporter.
 *
 * Usage in tests:
 *   import { reportIssue } from './helpers/issue-collector.js';
 *   reportIssue(testInfo, { checkpoint, category, severity, description, element, action });
 */

/**
 * Attach an issue to the current test's annotations for the reporter to collect.
 * @param {import('@playwright/test').TestInfo} testInfo
 * @param {Object} issue
 * @param {string} issue.checkpoint - e.g. "1.1.1"
 * @param {string} issue.file - e.g. "1-1-1-non-text-content.html"
 * @param {string} issue.category - "pass-demo" | "site-shell" | "toggle" | "announcement"
 * @param {string} issue.severity - "error" | "warning" | "info"
 * @param {string} issue.description - Human-readable description
 * @param {string} issue.element - CSS selector or element description
 * @param {string} issue.action - "needs-fix" | "needs-review" | "manual-uat-required"
 */
export function reportIssue(testInfo, issue) {
  testInfo.annotations.push({
    type: 'a11y-issue',
    description: JSON.stringify(issue),
  });
}
