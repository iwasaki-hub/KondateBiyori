# KondateBiyori — 引き継ぎ（2026-11-22更新）

## 現在地
- Day 3: PR #10（レシピ台帳）マージ済み。main `856ce2dd`。
- Day 4: PR #11（家族プロフィール）マージ済み。main `a111ff42`。
- Day 5: `feature/day05-weekly-meal-plan` で実装・PR確認中。明示指示なしにマージしない。
- Day 6: レシピ詳細と人数別分量。Day 5の完了後に別ブランチ/PRで実施する。

## Day 5 で追加したもの
- 「今週」タブを月曜〜日曜7行へ変更。前週・次週切り替え。
- 既存の自作レシピ台帳から、AIを使わない固定的なサンプル献立生成。
- Web: localStorage / iOS・Android: expo-sqlite KVストアに週別保存。端末間同期はない。
- 読込中、未作成、読込エラーと再試行、保存エラーを区別。失敗時に既存データを削除しない。
- 家族プロフィールの人数・調理時間・苦手/除外食材をサンプル候補選択へ反映する（食材名の部分文字列照合、アレルギー安全保証ではない）。
- 月末・年末・うるう年、7日整列、有効なrecipe_idなどの純粋関数テスト。

## 安全な再開手順
最新main・PR・GitHub Actions・Vercel Previewを照合し、未確認を成功扱いしない。
[AGENTS.md](../../AGENTS.md)、[WORKLOG.md](WORKLOG.md)、[14日計画](../planning/03_14日間開発計画とCodex指示.md) を参照。
1Day=1PR、無断マージ・EASビルド・Supabase/AI/課金なし。iPhone実機での操作検証は引き続き必要。
