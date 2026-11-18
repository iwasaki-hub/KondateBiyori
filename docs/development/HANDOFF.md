# KondateBiyori — 次回開発の引き継ぎ（HANDOFF）

> 2026-11-18（JST）時点。**次のChatGPT/Codexが最初に読むファイル。** 実施済みはDay 2.8まで。Day 3は未着手。

## 新しいチャットで最初に送る文章

```text
iwasaki-hub/KondateBiyori の開発を再開します。
最初に docs/development/HANDOFF.md、docs/development/WORKLOG.md、
AGENTS.md、README.md、docs/planning の仕様書3点を読み、
GitHub の最新 main と実PR履歴を確認してください。
Day 2.8まで完了済み、Day 3は未着手です。
まず現状と次の安全な作業手順を報告し、指定範囲を1タスク1PRで進めてください。
既存の変更を破棄せず、明示承認のないマージ・EASビルド・課金は行わないでください。
```

## 必ず読む順番

1. [HANDOFF.md](HANDOFF.md) — 現在地・注意点・次の開始方法（本書）。
2. [WORKLOG.md](WORKLOG.md) — Day 1〜2.8の実際の作業履歴、PR、EAS結果、未確認事項。
3. [AGENTS.md](../../AGENTS.md) — Codexの安全ルール。内容が競合する場合は仕様とユーザーの最新指示を確認する。
4. [README.md](../../README.md) — セットアップ、CI、Web/EASの運用構成。
5. [仕様書/PRD](../planning/01_PRD_仕様書.md)、[画面・技術設計](../planning/02_画面と技術設計.md)、[14日間計画](../planning/03_14日間開発計画とCodex指示.md) — Day 3の要件の一次資料。
6. GitHubの実PR [#2〜#8](https://github.com/iwasaki-hub/KondateBiyori/pulls?q=is%3Apr+is%3Aclosed) と最新`main` — 文章の「最新」という表現は作成日時に依存するため、毎回Gitで確認する。

## 現在地（作成時）

| 項目 | 状態 |
| --- | --- |
| Repository | `iwasaki-hub/KondateBiyori` |
| 最終アプリ変更 | Day 2.8 / PR [#8](https://github.com/iwasaki-hub/KondateBiyori/pull/8) Squashマージ済み |
| PR #8マージ時のmain SHA | `e644b52b1aae229d0491259fa443a1d9a3d8dd09`（文書PR後には変わる） |
| 次の開発工程 | **Day 3：レシピ台帳とスキーマ**（未着手） |
| Web Production | https://kondate-biyori-seven.vercel.app/ （`main`の変更で自動デプロイ） |
| EAS project | `@masa-practice/kondate-biyori`、`5a32cac4-2dfb-4ae0-84e2-64b789fcf365` |
| iOS Bundle Identifier | `com.iwasakihub.kondatebiyori` |
| iOS Simulator Build | [Build 8c58ca17…](https://expo.dev/accounts/masa-practice/projects/kondate-biyori/builds/8c58ca17-4308-4593-a9f6-10b28dfcfb29) **FINISHED**（`.tar.gz`） |
| 実機/Simulatorでの画面検証 | 未完了 |

この文書の記載時点で、Day 3のコード、Supabase、AI、課金は実装していない。

## 次回の安全な開始チェック

- まずGitHubで現在の`main`、オープンPR、最新CI、Vercel Productionを**読み取り**で確認する。
- VS Codeで`git status --short`を確認。変更があれば停止し、未コミット作業を勝手に破棄・stash・上書きしない。
- 作業ツリーがクリーンなら`git switch main` → `git pull --ff-only origin main`で最新化し、**Day 3専用の新しいブランチ**を作る。既存ブランチやPRを重複作成しない。
- `AGENTS.md`と仕様書のDay 3条件を確認し、追加作業はユーザーが指定した範囲内のみ実施する。
- 1タスク1PR。検証成功後のSquashマージは**ユーザーの明示依頼があるときだけ**行う。マージした場合は`main`、GitHub Actions、Vercel ProductionのREADYと公開3ルートを再確認する。
- PR完了後は本書とWORKLOGを更新し、次回の開始点を残す。

## Day 3の予定（計画書の受け入れ条件）

**Day 3：レシピ台帳とスキーマ（まだ実装しない）**

- `Recipe` / `Ingredient` / `MealPlan` のTypeScript型を定義。
- 権利関係を確認した**自作のサンプルレシピ10件**を用意（50件への増量は後続）。
- バリデータを実装し、存在しない`recipe_id`を拒否する。
- 各レシピに材料・分量・手順がそろっていることを検証する。
- 単位の検証テストを追加する。
- TypeScript strict、Expo SDK 58、既存の3タブとWeb static出力を維持する。
- CI・Vercel Previewを確認し、実端末の目視は未確認ならそのまま記録する。先のDayへ自動着手しない。

## 引き続き注意すること

- **Expo FreeプランではクラウドSimulatorは利用不可。** `eas simulator:start`はStarter以上を要求して失敗。クラウドSimulatorの利用には事前のプラン・費用承認が必要。WindowsにApple純正iOS Simulatorを直接導入できない。Apple Developer Program未加入。
- **iOSビルドFINISHEDは端末起動PASSではない。** 最新iPhone Safariの目視・操作も未確認。通常のiPhone App Store版Expo GoとSDK 58の互換性にも注意（[Expo公式](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)）。
- **`npm audit`42件**（2026-11-18、high40/moderate2）とESLint 9のサポート警告を別途調査。無断の依存強制更新・SDKメジャー変更はしない。
- **`main`ブランチ保護は未設定**（2026-11-18確認）。Day 3前の独立作業として設定を検討できるが、設定変更には明示依頼が必要。
- **他プロジェクトは変更しない。** Vercel Previewの保護解除、Apple署名、EAS Build/Submit/Update、EASプラン変更、Supabase・AI・課金は別承認。
- このHANDOFFとWORKLOGの作成は**ドキュメント専用の別PR**とする。Day 3の実装とは切り離す。
