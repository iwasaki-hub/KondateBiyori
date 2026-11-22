/**
 * Day 7.5: Optional connection-only configuration.
 * No user data is sent and no session is created from this module.
 * Expo embeds EXPO_PUBLIC_* at build time: only publishable keys are allowed.
 */
export type SupabasePublicConfig = Readonly<{ url: string; publishableKey: string }>;

export function parseSupabaseConfig(url: string | undefined, key: string | undefined): SupabasePublicConfig | null {
  if (!url && !key) return null;
  if (!url || !key) throw new Error('SupabaseのURLと公開可能キーの両方が必要です。');
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error('Supabase URLが不正です。'); }
  if (parsed.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/i.test(parsed.hostname) ||
    parsed.username || parsed.password || parsed.port || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('Supabase URLは公式のHTTPSプロジェクトURLを使用してください。');
  }
  if (!key.startsWith('sb_publishable_') || key.length <= 'sb_publishable_'.length) {
    throw new Error('sb_publishable_ 形式の公開可能キーのみ設定できます。');
  }
  return { url: parsed.origin, publishableKey: key };
}

export function getSupabaseConfig(): SupabasePublicConfig | null {
  return parseSupabaseConfig(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export type ConnectionState = 'unconfigured' | 'reachable' | 'unreachable';

/** Non-authenticated connectivity check. Do not interpret it as successful login or RLS verification. */
export async function checkSupabaseHealth(config: SupabasePublicConfig | null): Promise<ConnectionState> {
  if (!config) return 'unconfigured';
  try {
    const response = await fetch(`${config.url}/auth/v1/health`, {
      method: 'GET',
      headers: { apikey: config.publishableKey },
    });
    return response.ok ? 'reachable' : 'unreachable';
  } catch {
    return 'unreachable';
  }
}
