import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSupabaseConfig, checkSupabaseHealth } from '../src/cloud/supabase-config.ts';

const url = 'https://abc123.supabase.co';
const key = 'sb_publishable_test_example';

test('未設定でもローカル保存を維持できる', () => {
  assert.equal(parseSupabaseConfig(undefined, undefined), null);
});
test('公式URLとpublishableキーを受け付ける', () => {
  assert.deepEqual(parseSupabaseConfig(url, key), { url, publishableKey: key });
});
test('秘密鍵と不正URLを拒否する', () => {
  assert.throws(() => parseSupabaseConfig(url, 'sb_secret_not_allowed'));
  assert.throws(() => parseSupabaseConfig(url, 'service_role'));
  assert.throws(() => parseSupabaseConfig('http://abc123.supabase.co', key));
  assert.throws(() => parseSupabaseConfig('https://abc123.supabase.co.evil.com', key));
  assert.throws(() => parseSupabaseConfig('https://abc123.supabase.co/prefix', key));
  assert.throws(() => parseSupabaseConfig(url, undefined));
});
test('未設定では外部通信を行わない', async () => {
  assert.equal(await checkSupabaseHealth(null), 'unconfigured');
});
test('成功と通信失敗を明確に区別する', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: true });
    assert.equal(await checkSupabaseHealth({ url, publishableKey:key }), 'reachable');
    globalThis.fetch = async () => { throw new Error('offline'); };
    assert.equal(await checkSupabaseHealth({ url, publishableKey:key }), 'unreachable');
  } finally { globalThis.fetch = original; }
});
