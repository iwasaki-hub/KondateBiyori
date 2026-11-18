import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

// Deliberately stricter than EAS's full schema: this phase is simulator-only,
// linked to the approved project, with no credentials, updates, or submit configuration.
export function validateEasPreparation(eas, app, pkg, tsconfig) {
  // Compare as a boolean so a rejected env/credential value is never echoed
  // by an assertion diff into a local or CI log.
  assert.ok(isDeepStrictEqual(eas, {
    cli: { requireCommit: true },
    build: { 'ios-simulator': { ios: { simulator: true } } },
  }), 'Only the approved, clean-commit iOS Simulator profile is allowed; rejected values withheld');
  assert.ok(/^58\.0\.\d+$/.test(pkg.dependencies.expo), 'Keep SDK 58 with an exact patch version');
  assert.ok(pkg.main === 'expo-router/entry', 'Keep the Expo Router entry point');
  assert.ok(pkg.scripts.start === 'expo start', 'Keep the Expo Go start command');
  for (const dependencies of [pkg.dependencies, pkg.devDependencies, pkg.optionalDependencies, pkg.peerDependencies]) {
    assert.ok(dependencies?.['expo-dev-client'] === undefined, 'No development client in this phase');
    assert.ok(dependencies?.['expo-updates'] === undefined, 'No EAS Update in this phase');
  }
  assert.ok(app.expo.slug === 'kondate-biyori', 'Keep the approved Expo slug');
  assert.ok(isDeepStrictEqual(app.expo.platforms, ['ios', 'web']), 'Keep iOS and web platforms');
  assert.ok(app.expo.web.output === 'static', 'Keep static web output');
  assert.ok(app.expo.owner === 'masa-practice', 'Use the approved Expo owner');
  assert.ok(isDeepStrictEqual(app.expo.extra, {
    eas: { projectId: '5a32cac4-2dfb-4ae0-84e2-64b789fcf365' },
  }), 'Only the approved EAS project link is allowed in expo.extra; rejected values withheld');
  assert.ok(app.expo.ios.bundleIdentifier === 'com.iwasakihub.kondatebiyori', 'Use the approved iOS bundle identifier');
  assert.ok(app.expo.updates === undefined && app.expo.runtimeVersion === undefined
    && app.expo.ios.runtimeVersion === undefined, 'No EAS Update configuration');
  assert.ok(isDeepStrictEqual(app.expo.plugins, ['expo-router']), 'Keep the Expo Router plugin configuration');
  assert.ok(tsconfig.compilerOptions.strict === true, 'Keep TypeScript strict mode');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const readJson = path => {
    try {
      return JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      throw new Error(`Unable to read or parse ${path}; contents withheld`);
    }
  };
  validateEasPreparation(readJson('eas.json'), readJson('app.json'), readJson('package.json'), readJson('tsconfig.json'));
  console.log('PASS EAS policy: approved project, Simulator only, clean commit, SDK 58, Expo Go and static web (offline)');
}
