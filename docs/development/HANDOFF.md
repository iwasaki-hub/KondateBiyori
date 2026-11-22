# KondateBiyori — 開発引き継ぎ（2026-11-22更新）

## 現在地
- Day 3 レシピ台帳は実PR #10でSquashマージ済み（main `856ce2dd`）。
- Day 4 家族プロフィールは `feature/day04-family-profile` で実装中。マージ前にはCI/Vercel Preview・Web/iPhoneの動作を確認する。
- 次工程 Day 5 はDay 4の検証・マージ後に別ブランチ/別PRで行う。

## Day 4 の仕様
- 設定タブの家族プロフィールに、大人1〜5・子ども0〜5・調理時間10/20/30/45分・任意の苦手/除外食材を入力。
- 入力検証し、iOS/Androidは `expo-sqlite/kv-store`、WebはブラウザlocalStorageに保存する。端末・ブラウザごとの保存であり同期しない。
- 空欄の任意項目は正常。読み込み中・読み込み失敗/再試行・保存失敗・成功表示を設ける。
- 除外食材はアレルギー安全保証ではない。

## 既存ルールとリスク
- [AGENTS.md](../../AGENTS.md) / [WORKLOG.md](WORKLOG.md) / [仕様書](../planning/) を確認する。
- 1タスク1PR。明示指示なしのマージ・EAS Build・署名・Supabase/AI・課金は禁止。
- iPhone実機/Simulatorの操作は未確認。Expo FreeのクラウドSimulator制約がある。
- 2026-11-18の依存監査は42件。アップグレードを無断強制しない。
- VercelのWebは静的出力・認証付きPreview。公開ProductionのURLは https://kondate-biyori-seven.vercel.app/ 。

## 次回の開始手順
GitHubの最新main/PR/CIを確認し、差分・設定・検証結果を照合。未確認をPASSと書かず、マージ後にはWORKLOGとHANDOFFを更新する。
