# こんだて日和

家族向けAI週間献立アプリの開発リポジトリです。Expo SDK 58 / React Native / TypeScript / Expo Routerを使い、Day 2では暖色デザイン・共通UI・今週/買い物/設定の3タブを実装しています。

献立生成、保存、買い物操作、家族設定、Supabase、AI API、課金は未実装です。現在、アプリ起動に外部サービスのアカウントや環境変数は不要です。

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

## Vercel Webデプロイ（Day 1.5）

Expo Routerの `expo.web.output: static` を維持し、`vercel.json` でWebビルドを定義しています。SPA用の一括rewriteは使いません。iOS向けコードと依存関係は変更していません。

| 設定 | 値 |
| --- | --- |
| Vercelチーム | masa's projects（Hobby） |
| Project | `kondate-biyori` |
| Framework | Other（`framework: null`） |
| Root Directory | リポジトリ直下 |
| Install | `npm ci` |
| Build | `npm run build:web` |
| Output | `dist` |
| Node.js | 24.x |
| 環境変数 | Day 1.5時点では不要 |

### GitHub連携と公開フロー

- **Production**: `main` の内容を自動デプロイします。最初のProductionはPR #2を取り込んだ `main` (`e60a6649`) から作成済みです。公開URL: https://kondate-biyori-seven.vercel.app/ 。公開Web版は一般アクセス可能です。
- **Preview**: PRのfeatureブランチごとにVercel Previewを生成し、ビルド・表示を確認します。Previewの認証保護はVercel側で有効にし、Productionには適用しません。
- **Merge**: CI・Preview・必要なiPhone Safari確認が成功してからSquash Mergeします。マージによって `main` のProduction更新が走ります。
- `main` の自動デプロイを禁止する `git.deploymentEnabled.main: false` は使用しません。VercelのIgnored Build Stepにも `main` スキップ設定を置きません。
- `main` への直接Push、認証トークンのGitコミット、有料プラン変更、外部DBやAI課金APIへの無断接続は禁止です。
- 本プロジェクトのHobby運用は開発・個人的な検証を対象とし、商用運用を始める前にプラン・利用規約を再評価します。

### PRのPreview検証

1. `npm ci`、`npm test`、`npx expo-doctor`、`npm run build:web` を実行し、静的HTMLと参照アセットを確認します。
2. Vercelで対象PRブランチ・コミット・環境`Preview`を照合し、ビルドがREADYであることを確認します。
3. 認証済みPreviewと公開ProductionのそれぞれでHTTP・アプリ名・JS/CSSアセット・404・重大エラーを確認します。保護されたPreviewの認証ページはアプリのエラーとは区別します。
4. iPhone SafariでSafe Area、文字の折返し、横はみ出し、スクロール、大きい文字設定を目視確認し、PRに結果・URL・対象SHAを記載します。
5. Previewが成功したPRのみmainにマージし、Production READY・公開URL HTTP 200とコミット一致を再確認します。ロールバックには対象マージコミットのrevertを優先します。

参考: [ExpoのWeb公開](https://docs.expo.dev/guides/publishing-websites/)、[Vercel設定](https://vercel.com/docs/project-configuration/vercel-json)、[Gitのデプロイ設定](https://vercel.com/docs/project-configuration/git-configuration)。

## 構成と仕様

### SNSリンクプレビュー（Day 2.5）

サイト名・説明・公開URL・OGP画像URLは`src/config/siteMetadata.ts`に集約しています。各ページのSDK 58 `generateMetadata()`がビルド時にOGP/Twitter Cardを生成し、`app/+html.tsx`はExpoのhead/bodyノードと属性を保持して`lang="ja"`を指定します。`/`・`/shopping`・`/settings`は同じサイト紹介とProductionの正規URLを共有します。PreviewのURLを正規URLへ使用しません。

画像は`public/og-kondate-biyori.png`（1200×630、不透明PNG）です。オリジナル図形とWindows同梱のYu Gothic UIによる文字描画のみを使用し、外部の写真・イラストは含みません。Windowsで`pwsh -File scripts/generate-og-image.ps1`を実行すると、テーマの色トークンを参照して再生成できます。フォントファイル自体は配布しません。再生成は通常のビルドには不要です。

`npm run build:web`後に`npm run check:social`で3ルートのhead、タグ重複、絶対URL、日本語lang、JS/CSS/SVGと画像形式・サイズを検証します。CIでも実行します。検証スクリプトはNode.js 24 LTSを推奨します。

Previewは認証保護されているためSNSクローラーで取得できない場合があります。保護設定は解除せず、認証付きHTTPでHTMLと画像を確認してください。マージ後に公開Productionで画像URLの200応答、各SNSのカード表示を確認します。X・LINE・Facebook・Discord側のキャッシュ、再取得タイミング、表示仕様によって結果が異なるため、未確認のSNS表示は成功扱いにしません。

- `app/_layout.tsx`: Routerと画面共通設定
- `app/(tabs)/`: 今週 `/`、買い物 `/shopping`、設定 `/settings`。静的出力でも各URLを直接開けます。
- `src/theme/tokens.ts`: 色・文字・余白・角丸・アイコンサイズ
- `src/components/`: AppButton（primary/secondary/disabled）、AppCard、AppIcon、AppScreen
- `AppIcon`: `week` / `shopping` / `settings` / `meal` / `cooking` / `time` / `back` / `forward` / `info` / `success` の意味名を使用。サイズ20/24/32/48、toneとstateを指定し、Lucideへの依存をこの1ファイルに集約。必要なアイコンだけをimportします。ラベル省略時は装飾として読み上げ対象から除外します。
- アイコン依存: `lucide-react-native@1.74.0`、Expo SDK 58互換の`react-native-svg@15.16.0`を固定。全アイコンのバンドルを避けるため`lucide-react-native/icons/*`から個別importします。ESLintの解決用にExpoと同じ`eslint-import-resolver-typescript@3.10.1`を開発依存へ明示しています。
- `tests/icon-api.typecheck.ts`: 不正な意味名・色・サイズがTypeScriptで拒否されることを`npm test`で確認します（描画の実行テストではありません）。
- `app.json`: アプリ名・iOS・Webの設定
- `.env.example`: 環境変数不要の案内（秘密鍵は記載しない）
- `docs/planning/01_PRD_仕様書.md`: 製品仕様
- `docs/planning/02_画面と技術設計.md`: 画面・技術設計
- `docs/planning/03_14日間開発計画とCodex指示.md`: 日別開発計画
- `AGENTS.md`: Codex開発ルール

1タスク＝1ブランチ＝1PRで開発し、mainへの直接コミット・Push、自動マージは行いません。iPhoneでは3タブ移動、Safe Area、文字拡大、狭い画面での横はみ出し、アイコン表示、ボタンの押下/無効状態、VoiceOverの選択状態を確認してください。
