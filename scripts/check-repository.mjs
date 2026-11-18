import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const forbiddenPath = /(^|\/)(?:node_modules|dist|\.expo|\.vercel|\.ci-build)(?:\/|$)|(^|\/)credentials\.json$|\.(?:p8|p12|key|mobileprovision)$/i;
const secretPatterns = [
  /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bsk-[A-Za-z0-9_-]{24,}\b/,
];
for (const file of files) {
  assert.ok(!forbiddenPath.test(file), `Forbidden generated/credential path: ${file}`);
  const name = file.split('/').at(-1);
  assert.ok(!name.startsWith('.env') || name === '.env.example', `Environment file must stay private: ${file}`);
  const bytes = readFileSync(file);
  if (bytes.includes(0)) continue; // Binary assets (including the OGP PNG).
  const text = bytes.toString('utf8');
  assert.ok(!secretPatterns.some(pattern => pattern.test(text)), `Potential secret in ${file}; value withheld`);
}
execFileSync('git', ['diff', '--check'], { stdio: 'inherit' });
execFileSync('git', ['diff', '--cached', '--check'], { stdio: 'inherit' });
// The CI checkout is clean, so also inspect the committed PR/main change.
// fetch-depth: 2 supplies the parent even on GitHub's temporary PR merge commit.
execFileSync('git', ['diff', '--check', 'HEAD^', 'HEAD'], { stdio: 'inherit' });
console.log(`PASS repository hygiene: ${files.length} files; generated/credential paths and common secret patterns checked (not a comprehensive secret audit)`);
