import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { validateEasPreparation } from '../scripts/check-eas.mjs';

const base = ['eas.json', 'app.json', 'package.json', 'tsconfig.json'].map(path => JSON.parse(readFileSync(path, 'utf8')));
test('approved simulator configuration is valid without cloud authentication', () => {
  assert.doesNotThrow(() => validateEasPreparation(...structuredClone(base)));
});

const forbiddenChanges = [
  ['store build profile', ([eas]) => { eas.build.production = {}; }],
  ['simulator disabled', ([eas]) => { eas.build['ios-simulator'].ios.simulator = false; }],
  ['submit configuration', ([eas]) => { eas.submit = { production: {} }; }],
  ['internal distribution', ([eas]) => { eas.build['ios-simulator'].distribution = 'internal'; }],
  ['update channel', ([eas]) => { eas.build['ios-simulator'].channel = 'preview'; }],
  ['credential environment', ([eas]) => { eas.build['ios-simulator'].env = { TOKEN: 'fixture' }; }],
  ['dirty builds allowed', ([eas]) => { eas.cli.requireCommit = false; }],
  ['unapproved project link', ([, app]) => { app.expo.extra = { eas: { projectId: 'another-project' } }; }],
  ['development client', ([,, pkg]) => { pkg.dependencies['expo-dev-client'] = 'fixture'; }],
  ['SDK upgrade', ([,, pkg]) => { pkg.dependencies.expo = '59.0.0'; }],
  ['non-static web', ([, app]) => { app.expo.web.output = 'server'; }],
];
for (const [name, change] of forbiddenChanges) {
  test(`reject ${name}`, () => {
    const candidate = structuredClone(base);
    change(candidate);
    assert.throws(() => validateEasPreparation(...candidate));
  });
}
