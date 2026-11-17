# こんだて日和

家族向けAI週間献立アプリの開発リポジトリです。Day 1ではExpo SDK 58 / React Native / TypeScript / Expo Routerの基盤と、日本語の最小ホーム画面を実装しています。

献立生成、保存、タブ、Supabase、AI API、課金は未実装です。現在、外部サービスのアカウントや環境変数は不要です。

## セットアップ

Node.js 22.13以上のLTS（推奨: Node.js 24 LTS）、npm、Gitを用意してください。

```sh
git clone https://github.com/iwasaki-hub/KondateBiyori.git
cd KondateBiyori
npm ci
```

PowerShellでnpm.ps1の制約に遭遇した場合は `npm.cmd` / `npx.cmd` を使用できます。

## 起動

```sh
npm start
# Web
npm run web
```

iPhoneは開発PCと同じネットワークに接続し、ExpoのQRコードをSDK 58対応のExpo Goで開きます。Expo Goの対応状況は配布時期で変わるため、SDKが一致するか確認してください。非対応の場合はSDK 58対応のdevelopment buildが必要です。WindowsではiOS Simulatorは使用できません。macOSとXcodeがある環境では `npm run ios` でSimulatorを起動できます。

## 検証

```sh
npm run typecheck
npm run lint
npm test
npx expo-doctor
npm run build:web
```

`npm test` は型チェックとESLintをまとめて実行します。Day 1には業務ロジックがないためユニットテストはまだありません。Web書き出しは `dist/` に生成され、Git管理対象外です。実機ではSafe Area、日本語表示、大きい文字設定、スクロール、縦画面での表示を確認してください。

### 既知の依存監査結果

ESLintはExpoのReactプラグインとの互換性のため9.39.5に固定しています。ESLint 10では `react/display-name` の実行時エラーが発生するため、プラグイン対応後に更新してください（9系のサポート終了警告あり）。

2026-11-17の `npm audit` では、Expoの開発ツール `@expo/fingerprint` が依存するminimatchのDoS問題（GHSA-g3hv-75wg-m249）に由来するmoderate 3件を検出しています。外部入力を扱うアプリ機能はまだありませんが、開発時も信頼できないプロジェクトを処理しないでください。SDK 58の互換性を維持するため、SDKをダウングレードする `npm audit fix --force` や依存のメジャー強制上書きは行っていません。Expo側の対応版を追跡します。

## Vercel Web Preview（Day 1.5）

Expo Routerの `expo.web.output: static` を維持し、生成されたHTMLをそのまま配信します。`vercel.json`にビルド設定を置き、SPA向けの一括rewriteは使用しません。iOSの設定・依存関係は変更しません。

| 設定 | 値 |
| --- | --- |
| Framework Preset | Other（JSONではnull） |
| Root Directory | `.`（Vercelプロジェクト側で指定） |
| Install Command | `npm ci` |
| Build Command | `npm run build:web` |
| Output Directory | `dist` |
| Node.js | 24.xを推奨 |
| 環境変数 | 現時点では不要 |

### GitHub連携

1. Vercelの既存アカウント・チーム・プランを確認し、`iwasaki-hub/KondateBiyori`に既存プロジェクトが接続されていないか調べます。他プロジェクトを変更しません。
2. 新規プロジェクト名は `kondate-biyori` を候補とし、対象アカウント・プラン・Previewの閲覧範囲を利用者に提示して承認を受けます。有料プランへの変更は行いません。
3. 通常のImportはmainの初回Productionデプロイを開始する可能性があるため、承認なしにDeployを押さないでください。今回はProductionデプロイを作らず、プロジェクト作成とGit接続を分けて実施します。`vercel.json`の `git.deploymentEnabled.main: false` は、設定が存在するコミットのmain自動デプロイを無効にしますが、まだ設定がないmainの初回Importを保護するものではありません。
4. 承認後、上表の設定・main自動デプロイ無効・PreviewのDeployment Protectionを確認してGit連携します。GitHub Appの承認が必要なら、対象リポジトリだけの権限を付与します。PreviewはVercel Authenticationで保護する方針です。認証を要するURLを一般公開するために保護を解除しないでください。
5. featureブランチへのPushでPreviewを作り、PRのVercelチェックまたはVercelダッシュボードで対象ブランチ・コミット・環境Preview・ビルド成功を確認します。接続前にPush済みなら、そのブランチとコミットを指定してPreviewを作成します。mainへのマージやProductionへの昇格は行いません。

Vercel CLIは必須のアプリ依存ではありません。必要な場合は `npx vercel@<確認済みバージョン> --version` で利用できます。CLI操作前にアカウントとリンク先を確認し、トークンをコマンド・README・Gitに記載しないでください。ローカルリンク情報・環境ファイルを含む `.vercel/` はGit管理から除外します。

### PRごとのPreview検証

- ローカルで `npm ci`、`npm test`、`npx expo-doctor`、`npm run build:web` を実行し、distのHTMLと参照JS/CSS/画像が存在することを確認します。
- Previewの対象コミットとビルド成功、HTTPアクセス、ホームの「こんだて日和」、JS/CSS読込、404と重大なブラウザエラーがないことを確認します。CSSがHTML内にインライン出力される場合もあります。
- Previewが保護されている場合はVercelにログインして閲覧します。未認証の401/認証画面と、アプリ自体のエラーを区別してください。
- iPhone SafariでSafe Area、文字の折返し、横はみ出し、スクロール、大きい文字設定での読みやすさを確認してください。URL・結果・未確認項目をPRに記載します。

ロールバックは未マージならPRを閉じ、マージ後ならPR変更をrevertします。設定をrevertする前に対象VercelプロジェクトのGit連携を解除し、意図しないmainデプロイを防いでください。作成済みPreviewの停止・削除は対象プロジェクトだけで実施します。

参考: [ExpoのWeb公開](https://docs.expo.dev/guides/publishing-websites/)、[Vercel設定](https://vercel.com/docs/project-configuration/vercel-json)、[Gitデプロイ設定](https://vercel.com/docs/project-configuration/git-configuration)。

## 構成と仕様

- `app/_layout.tsx`: Routerと画面共通設定
- `app/index.tsx`: 最小ホーム画面
- `app.json`: アプリ名・iOS・Webの設定
- `.env.example`: 環境変数不要の案内（秘密鍵は記載しない）
- `docs/planning/01_PRD_仕様書.md`: 製品仕様
- `docs/planning/02_画面と技術設計.md`: 画面・技術設計
- `docs/planning/03_14日間開発計画とCodex指示.md`: 日別開発計画
- `AGENTS.md`: Codex開発ルール

1タスク＝1ブランチ＝1PRで開発し、mainへの直接コミット・Push、自動マージは行いません。Day 2はデザイントークン・共通UI・3タブを予定しています。
