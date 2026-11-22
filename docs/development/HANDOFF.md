# KondateBiyori — 開発引き継ぎ（2026-11-22更新）

## 現在地
- Day 3: PR #10 レシピ台帳をマージ済み
- Day 4: PR #11 家族プロフィールをマージ済み
- Day 5: PR #12 週間献立をマージ済み
- Day 6: PR #13 レシピ詳細・人数別分量をマージ済み。mainコミット `c7811d3103c75d7277aaded4598dccef82eca485`
- **Day 7: `feature/day07-replace-one-meal` で1日分の献立差し替えを実装、PRの検証中**。マージ前
- 次はDay 8の買い物リスト集計。Day 7完了後に別PRで開始する

## Day 7 の変更
- 週間献立で料理の詳細を開き「この日の献立を変更する」→候補一覧→選択→内容確認→確定
- 1日分だけrecipe_idを更新。日付・人数・他6日は変更しない
- キャンセルでは保存しない。保存失敗時には既存の献立表示を維持し、再試行できる
- 既存のWeb localStorage／ネイティブSQLite KV storeを利用。独立したDBやAIは追加しない
- 純粋関数テストは存在しないID／週外の日付／7日不正／他6日不変／元データ不変を確認

## 次回の確認
- 最新のGitHub PRとmain、CI／Vercel Previewを確認する
- iPhone Safariで候補選択、キャンセル、確定、再訪時の保存確認。実機は未確認なら未確認扱い
- 明示指示までマージ、EASビルド、課金、Supabase接続、LittleDiary変更はしない
- 詳細は[AGENTS.md](../../AGENTS.md)、[WORKLOG.md](WORKLOG.md)、[開発計画](../planning/03_14日間開発計画とCodex指示.md)
