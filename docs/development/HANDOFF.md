# KondateBiyori — 引き継ぎ（2026-11-22更新）

## 開発状況
- Day 3〜7（PR #10〜14）mainへSquashマージ済み。最新基点 `69fd4d3fd0a7d1fd6ac0523218b6f6327e2f3afa`
- Day 7.5: `feature/day075-supabase-foundation` の PR #15 で接続準備中。明示指示なしにマージしない
- Day 8「買い物リスト集計」は未着手

## 新規Supabaseプロジェクト（実績）
- `KondateBiyori` / `iwasaki-hub's Org` / 東京 `ap-northeast-1`
- Project ref `nrcilifwdkmojguezbln`、`ACTIVE_HEALTHY` 確認済み
- プロジェクト作成費用見積りは月額 $0、明示同意後に作成
- 有効な `sb_publishable_` キーは取得可能だがGitHubには入れていない
- **Vercel環境変数設定APIが403 forbidden**。Vercel UIでURLと公開キーの設定が必要
- 端末のローカル保存を維持。接続診断UIの追加のみで、SDK、Auth、RLS、同期、DBは未実装

## 次回
- [day075-supabase.md](day075-supabase.md) を確認しVercelの環境変数を設定、Previewの再デプロイと接続診断を行う
- CI/Vercelの結果はPR #15で確認
- SDK接続→Auth→RLS→同期は小分けの別PRで導入し、既存環境への変更は行わない
- 1Day 1PR、main直接push禁止、明示依頼なしにマージしない
