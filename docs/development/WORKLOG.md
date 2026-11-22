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

## Day 3 / Day 4 の追記（2026-11-22）

- Day 3: PR [#10](https://github.com/iwasaki-hub/KondateBiyori/pull/10) をSquashマージ。レシピ10件・型・ID/単位検証。マージSHA `856ce2dde8979a30b1cadb4af739cea061d2bb27`。マージ前CIとVercelステータスは成功。
- Day 4: 家族プロフィール（大人/子ども、時間、苦手/除外食材）の検証と端末内保存を専用ブランチへ追加。保存はiOS/Android SQLite KV、Web localStorage（ブラウザごと）。CI/Preview・実機の結果はPRで追記する。Day 5は未着手。

## Day 5（2026-11-22）
- Day 4 PR [#11](https://github.com/iwasaki-hub/KondateBiyori/pull/11) はSquashマージ済み（`a111ff42ece2011cfeba0846fe5f7bb2ecf912b5`）。
- Day 5: 月〜日7日表示、前週/次週、週単位のローカル永続化、AIなしのサンプル献立、純粋関数テストを `feature/day05-weekly-meal-plan` へ追加。
- CI / Vercel Preview / 実機テストの結果はPR本文に記録する。Day 6には未着手。

## Day 6（2026-11-22）
- Day 5のPR [#12](https://github.com/iwasaki-hub/KondateBiyori/pull/12) はSquashマージ（`7a5c36337af8f37d19af655170fd2f01c7ff5310`）。
- Day 6ブランチ `feature/day06-recipe-detail` で週の料理行→詳細の開閉、レシピ名・時間・材料・手順、人数に応じた表示上の分量変更、数量/単位のテストを追加。
- 単位は元のまま、計算結果は小数第2位まで。保存済み献立の変更とDay 7の献立差し替えは対象外。
- CI/Preview/実機はPRで別途検証。明示指示なしのマージはしない。

## Day 7（2026-11-22）
- Day 6のPR [#13](https://github.com/iwasaki-hub/KondateBiyori/pull/13) をSquashマージ済み（`c7811d3103c75d7277aaded4598dccef82eca485`）。
- Day 7: 週間献立のレシピ詳細から選択日だけ別候補に差し替えるUI、確認・キャンセル、保存失敗時の元プラン保護と純粋関数テストを `feature/day07-replace-one-meal` に追加。
- 既存のレシピ台帳10件と週別ローカル保存を再利用。サンプルからの候補選択のみ、AIなし。CI、Preview、iPhone実機の結果は実PRに記録。

## Day 7.5（2026-11-22）
- Day 7 PR #14 は main `69fd4d3fd0a7d1fd6ac0523218b6f6327e2f3afa` にSquashマージ済み。
- Supabase `iwasaki-hub's Org` に東京リージョンの専用プロジェクト作成を依頼。作成APIが費用確認IDを要求し、`get_cost` は月額$0を報告。金額への明示同意前なので、`confirm_cost`および`create_project`再実行は未実施。
- `feature/day075-supabase-foundation` に公開設定検証、接続状態確認ヘルパー、環境変数サンプル、ドキュメント、単体テストを追加。Auth・同期・DB更新は未実装でローカル保存を維持。

## Day 7.5 追記（2026-11-22）
- 月額$0の明示同意を得て、Supabase新規専用プロジェクト `KondateBiyori` (Tokyo `ap-northeast-1`, ref `nrcilifwdkmojguezbln`) 作成。ACTIVE_HEALTHYを確認。
- Vercel `kondate-biyori` プロジェクトの環境変数作成は403で拒否された。既存の環境設定は変更できていない。
- PR #15へ設定タブの任意のSupabase接続診断と専用URLの環境変数サンプルを追加。SDK/クラウド保存/Auth/RLSは未実装。
