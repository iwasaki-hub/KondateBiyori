# KondateBiyori — 開発履歴（WORKLOG）

> 最終整理: 2026-11-18（JST）。対象: Day 1〜Day 2.8。GitHubのマージ済みPR #2〜#8、README、Expo EASのビルド結果に基づく。計画上の「PR #n」と実際のGitHub PR番号は異なる。
>
> **次回再開の入口:** [HANDOFF.md](HANDOFF.md)。本書は作業履歴であり、現行の運用ルールは [AGENTS.md](../../AGENTS.md)、仕様・受け入れ条件は [docs/planning](../planning/) を優先する。

## 現在の到達点（2026-11-18）

- リポジトリ: [iwasaki-hub/KondateBiyori](https://github.com/iwasaki-hub/KondateBiyori)
- フレームワーク: Expo SDK 58 / React Native / TypeScript strict / Expo Router。iOS・Web対応、Webは静的出力。
- 実装済み: 「今週」「買い物」「設定」の3タブ、暖色デザイントークンと共通UI、Web静的配信、OGP・SNSプレビュー、CI、EAS iOS Simulator専用プロジェクト連携と初回ビルド。
- **未実装:** レシピ台帳、献立生成・保存、買い物リストの操作・永続化、家族プロフィール、Supabase、AI API、課金。
- Day 2.8のアプリ・設定変更はPR #8までSquashマージ済み。マージ時の`main`コミット: `e644b52b1aae229d0491259fa443a1d9a3d8dd09`。これは**文書整備前の基準SHA**であり、後続の文書PRのマージで更新される。
- Web Production: https://kondate-biyori-seven.vercel.app/ （Vercelで`main`の更新時に自動デプロイ）。
- Apple Developer Programは未加入。iPhone実機向けの署名済みビルド、TestFlight配布、App Store公開は未実施。

## 開発履歴（実際のGitHub PR）

| 工程 | 実PR | 実施内容 | Squashマージコミット |
| --- | --- | --- | --- |
| Day 1 | [#2](https://github.com/iwasaki-hub/KondateBiyori/pull/2) | Expo SDK 58 / TypeScript / Expo Routerの初期アプリ、CI・基本文書 | `e60a6649` |
| Day 1.5 | [#3](https://github.com/iwasaki-hub/KondateBiyori/pull/3) | Vercel Production・認証付きPreviewのGit連携、静的Web出力 | `a14014d4` |
| Day 2 | [#4](https://github.com/iwasaki-hub/KondateBiyori/pull/4) | 暖色テーマ、共通Button/Card/Icon/Screen、3タブ | `9f606fca` |
| Day 2 Web修正 | [#5](https://github.com/iwasaki-hub/KondateBiyori/pull/5) | Vercel `cleanUrls: true`で`/shopping`・`/settings`の404を修正 | `03ce8ab4` |
| Day 2.5 | [#6](https://github.com/iwasaki-hub/KondateBiyori/pull/6) | 静的HTMLのOGP/Twitter Card、日本語設定、1200×630のOGP画像・検証 | `b5fd9175` |
| Day 2.7 | [#7](https://github.com/iwasaki-hub/KondateBiyori/pull/7) | Simulator限定`eas.json`、EAS・リポジトリ安全検査、GitHub Actions強化 | `ebd361bb` |
| Day 2.8 | [#8](https://github.com/iwasaki-hub/KondateBiyori/pull/8) | EAS Project ID・Owner・iOS Bundle Identifier登録、ポリシーテスト17件、初回iOS Simulatorクラウドビルド | `e644b52b` |

過去PRの検証詳細・当時の未確認項目・ロールバックは、それぞれのPR本文を参照する。実際のPR #1〜#8を計画書内の仮の番号へ読み替えない。

## Day 2.7〜Day 2.8 の検証結果

- Day 2.7: EAS未紐付け状態でSimulator専用設定とCIを追加。GitHub Actions成功、Vercel Preview READY、マージ後のProduction READY。**この時点ではネイティブビルド未実行**。
- Day 2.8: GitHub Actions成功、Expo Doctor 20/20、EASポリシーテスト17件、Webビルド・OGP検証・iOS JS/Hermesエクスポート成功。Vercel Previewで`/`・`/shopping`・`/settings`・OGP画像・参照JSのHTTP 200を検証。PR #8マージ後の`main` CIとProduction READY・同一コミット・3ルート/OGPのHTTP 200を確認。
- `npm run export:ios`はJavaScript/Hermesのエクスポートであり、ネイティブビルドや端末起動確認とは別。
- Expo EAS初回ビルド（2026-11-18 21:20 JST完了）：[Build 8c58ca17-4308-4593-a9f6-10b28dfcfb29](https://expo.dev/accounts/masa-practice/projects/kondate-biyori/builds/8c58ca17-4308-4593-a9f6-10b28dfcfb29)。**FINISHED**、iOS `ios-simulator`、対象PR HEAD `a82d62a76484bb8a0cce10587dc51104d6c09aec`、Simulator用`.tar.gz`生成。成果物は実機向けIPAではない。ビルドエラーなし。
- Expo Owner: `masa-practice`、Slug: `kondate-biyori`、Project ID: `5a32cac4-2dfb-4ae0-84e2-64b789fcf365`、Bundle Identifier: `com.iwasakihub.kondatebiyori`。他プロジェクトのIDは使っていない。
- EAS Buildの警告: `cli.appVersionSource`の将来必須化、App Store Connect向け暗号化申告、ネイティブの非推奨・コンパイル警告。今回はビルド成功。設定変更は独立タスクで判断する。
- PR #8はSquashマージ済みだが、マージにより**新しいEASビルドは自動実行されない**。

## 未解決・未確認（次回も引き継ぐ）

1. **iOS Simulatorの実際の起動・画面操作は未確認。** WindowsにApple純正iOS Simulatorは直接導入できない。ExpoのクラウドSimulatorは`masa-practice`のFreeプランで利用不可（`eas simulator:start`実行時にStarter/Production/Enterpriseが必要というエラーを確認）。プラン変更・課金は実施していない。
2. **iPhone実機・iPhone Safariの最新3タブの目視・操作、ブラウザ実行時のエラー/スクリーンショットは未確認。** HTTP 200・静的出力の成功と、実画面での動作を混同しない。
3. **iPhoneのApp Store版Expo GoはSDK 58プロジェクトに対応しない**（2026-11-18時点の[Expo公式説明](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)ではApp Store版はSDK 54まで）。通常のExpo GoだけでSDK 58アプリをiPhone実機検証できると約束しない。
4. **Apple Developer Program未加入。** 署名・端末登録、Apple側Bundle Identifier所有権確認、TestFlight・App Store公開は未実施。
5. **依存監査:** 2026-11-18時点の`npm audit`は42件（high 40、moderate 2）。主に間接依存`minimatch` / `picomatch`のReDoSアドバイザリ由来。CI成功は解消を意味しない。SDK 58と互換性を保つ修正を別タスクで検討し、`npm audit fix --force`によるSDK 52への変更はしない。
6. **mainブランチ保護:** 2026-11-18の調査では`main.protected=false`、Rulesetsなし。1タスク1PRは運用上の取り決めでありGitHub上の強制設定ではない。別途承認後に保護設定を検討する。

## 安全運用

- 1タスク=1ブランチ=1PR。ローカル変更を保護し、`main`へ直接Pushしない。PRをマージする場合はユーザーの明示依頼を確認する。
- GitHub Actionsは検証用、VercelはWeb版のProduction/Preview、Expo EASはiOSクラウドビルド。Vercelへのマージ後自動反映とEASの手動ビルドを区別する。
- LittleDiaryやその他の外部プロジェクト、Supabase、課金、Apple署名、EAS Submit/Updateにはこの記録整備作業で触れない。
- 次回開始手順とDay 3の受け入れ条件は [HANDOFF.md](HANDOFF.md) を参照する。
