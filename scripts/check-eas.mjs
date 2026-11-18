import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Deliberately stricter than EAS's full schema: this phase is simulator-only,
// unlinked, with no credentials, distribution, updates, or submit configuration.
export function validateEasPreparation(eas, app, pkg, tsconfig) {
  assert.deepEqual(eas, {
    cli: { requireCommit: true },
    build: { 'ios-simulator': { ios: { simulator: true } } },
  }, 'Only the approved, clean-commit iOS Simulator profile is allowed');
  assert.match(pkg.dependencies.expo, /^58\.0\.\d+$/, 'Keep SDK 58 with an exact patch version');
  assert.equal(pkg.main, 'expo-router/entry');
  assert.equal(pkg.scripts.start, 'expo start', 'Keep the Expo Go entry point');
  assert.equal(pkg.dependencies['expo-dev-client'], undefined, 'No development client in this phase');
  assert.equal(pkg.dependencies['expo-updates'], undefined, 'No EAS Update in this phase');
  assert.equal(app.expo.slug, 'kondate-biyori');
  assert.deepEqual(app.expo.platforms, ['ios', 'web']);
  assert.equal(app.expo.web.output, 'static');
  assert.equal(app.expo.owner, undefined, 'Linking requires a separate approved task');
  assert.equal(app.expo.extra?.eas?.projectId, undefined, 'Do not reuse another project ID');
  assert.equal(app.expo.ios.bundleIdentifier, undefined, 'Bundle identifier is not approved yet');
  assert.equal(app.expo.updates, undefined, 'No remote updates configuration');
  assert.equal(tsconfig.compilerOptions.strict, true);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
  validateEasPreparation(readJson('eas.json'), readJson('app.json'), readJson('package.json'), readJson('tsconfig.json'));
  console.log('PASS EAS preparation: simulator-only, clean commit, unlinked, no credentials/submit/update; SDK 58, Expo Go and static web preserved (offline)');
}
