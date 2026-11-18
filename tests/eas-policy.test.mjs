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
  ['unapproved project link', ([, app]) => { app.expo.extra.eas.projectId = '00000000-0000-4000-8000-000000000000'; }],
  ['unapproved owner', ([, app]) => { app.expo.owner = 'another-owner'; }],
  ['unapproved bundle identifier', ([, app]) => { app.expo.ios.bundleIdentifier = 'com.example.other'; }],
  ['update configuration', ([, app]) => { app.expo.updates = { enabled: true }; }],
  ['authentication token in app config', ([, app]) => { app.expo.extra.token = 'fixture'; }],
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

test('a rejected credential value is not included in validation errors', () => {
  const candidate = structuredClone(base);
  const privateValue = ['do-not', 'echo', 'fixture-value'].join('-');
  candidate[0].build['ios-simulator'].env = { TOKEN: privateValue };
  assert.throws(() => validateEasPreparation(...candidate), error => {
    assert.ok(!error.message.includes(privateValue));
    assert.equal(error.actual, false);
    return true;
  });
  candidate[0] = structuredClone(base[0]);
  candidate[1].expo.owner = privateValue;
  assert.throws(() => validateEasPreparation(...candidate), error => {
    assert.ok(!error.stack.includes(privateValue));
    return true;
  });
});
