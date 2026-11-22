# KondateBiyori — 引き継ぎ（2026-11-22更新）

## 開発状況
- Day 3〜Day 7（PR #10〜#14）実装し、mainへマージ済み。Day 7のmain SHA `69fd4d3fd0a7d1fd6ac0523218b6f6327e2f3afa`
- Day 7.5: 新規専用Supabaseへの接続基盤を `feature/day075-supabase-foundation` で準備中。明示指示なしにマージしない
- Day 8「買い物リスト集計」はDay 7.5完了後に実施する

## Day 7.5の現状
- 接続先: `iwasaki-hub's Org` / `KondateBiyori` / `ap-northeast-1`（東京）
- 新規プロジェクトは**未作成**。Supabaseが月額$0の見積りを出したが、`confirm_cost` の明示同意を要するため作成は保留
- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` の任意設定と形式検証を追加。接続可否のヘルスチェック補助関数はあるが、UIへ接続せず、認証・DB・データ同期は実装していない
- ローカル保存 (Web localStorage / iOS SQLite KV) を完全に維持。既存の別Supabaseプロジェクトは触れない
- 次工程と安全事項の詳細は [day075-supabase.md](day075-supabase.md)

## 次回
- 月額$0への同意を得てから`confirm_cost`/専用プロジェクト作成、ACTIVE_HEALTHYまで確認
- Supabase SDKのバージョン固定・lockfile生成、Auth、RLS、データ移行は別段階で慎重に実施
- PR CI、Vercel Preview、iPhone実機検証を確認してから明示依頼に従いマージ
- 運用ルール: [AGENTS.md](../../AGENTS.md)
