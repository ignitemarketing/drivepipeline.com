#!/usr/bin/env node
// Fails when a workflow check step could hide a later failure:
//   - every step other than setup (checkout, setup-*) needs `if: ${{ !cancelled() }}`
//   - no `run:` may chain commands with `&&`
// Usage: node scripts/check-ci-run-through.mjs [workflow files...]
// With no arguments it checks every file in .github/workflows/.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SETUP_USES = /^\s*-?\s*uses:\s*actions\/(checkout|setup-[a-z]+)@/m;
const RUN_THROUGH = /^\s*-?\s*if:\s*\$\{\{\s*!cancelled\(\)\s*\}\}\s*$/m;

const indentOf = (line) => line.length - line.trimStart().length;

function stepsOf(text) {
  const lines = text.split('\n');
  const steps = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*steps:\s*$/.test(lines[i])) continue;
    const parent = indentOf(lines[i]);
    let item = -1;
    let current = null;
    for (i++; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
      const indent = indentOf(line);
      if (indent <= parent) { i--; break; }
      if (item < 0 && line.trimStart().startsWith('- ')) item = indent;
      if (indent === item && line.trimStart().startsWith('- ')) {
        current = { line: i + 1, text: '' };
        steps.push(current);
      }
      if (current) current.text += line + '\n';
    }
  }
  return steps;
}

export function check(file, text) {
  const problems = [];
  for (const step of stepsOf(text)) {
    const name = (step.text.match(/name:\s*(.+)/) || [, `step at line ${step.line}`])[1].trim();
    if (!SETUP_USES.test(step.text) && !RUN_THROUGH.test(step.text)) {
      problems.push(`${file}:${step.line} "${name}" lacks if: \${{ !cancelled() }}`);
    }
    if (/&&/.test(step.text.split(/^\s*-?\s*run:/m)[1] ?? '')) {
      problems.push(`${file}:${step.line} "${name}" chains commands with &&`);
    }
  }
  return problems;
}

const dir = '.github/workflows';
const files = process.argv.length > 2
  ? process.argv.slice(2)
  : readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).map((f) => join(dir, f));

const problems = files.flatMap((f) => check(f, readFileSync(f, 'utf8')));
for (const p of problems) console.error(`::error::${p}`);
console.log(`checked ${files.length} workflow file(s): ${problems.length} problem(s)`);
process.exit(problems.length ? 1 : 0);
