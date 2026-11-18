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
npm run check:social
npm run check:eas
npm run check:repository
npm run export:ios
```

`npm test` は型チェック・ESLint・EAS準備設定の安全境界テストを実行します。アプリ業務ロジックのテストはまだありません。Web書き出しは `dist/`、iOSのJS/Hermesバンドルは `.ci-build/ios/` に生成され、いずれもGit管理対象外です。`export:ios`はローカルでJSを変換するだけで、ネイティブアプリのビルド・署名・クラウドアップロードは行いません。実機ではSafe Area、日本語表示、大きい文字設定、スクロールを別途確認してください。

### 既知の依存監査結果

ESLintはExpoのReactプラグインとの互換性のため9.39.5に固定しています。ESLint 10では `react/display-name` の実行時エラーが発生するため、プラグイン対応後に更新してください（9系のサポート終了警告あり）。

2026-11-17の `npm audit` では、Expoの開発ツール `@expo/fingerprint` が依存するminimatchのDoS問題（GHSA-g3hv-75wg-m249）に由来するmoderate 3件を検出しています。外部入力を扱うアプリ機能はまだありませんが、開発時も信頼できないプロジェクトを処理しないでください。SDK 58の互換性を維持するため、SDKをダウングレードする `npm audit fix --force` や依存のメジャー強制上書きは行っていません。Expo側の対応版を追跡します。

2026-11-18の再監査では42件（high 40、moderate 2）を検出しました。根本のアドバイザリは上記minimatchと、picomatchの繰り返しextglobによるReDoSで、依存先からExpo等へ影響が集計されています。npmが提示するExpo 52への強制変更はSDK 58要件と矛盾するため実行していません。Day 2.7ではExpo Doctorが求めるSDK 58の推奨パッチ（Expo 58.0.26 / Router 58.0.32）へ更新しましたが、監査警告42件は残っています。このPRのCI成功は脆弱性が解消したことを意味しません。

## 安全な開発パイプライン（Day 2.7）

```text
VS Code + Codex
      |
      v
featureブランチ → GitHub Pull Request
      |
      +--> GitHub Actions（シークレット不要）
      |      型チェック / ESLint / 安全境界テスト / Expo Doctor
      |      EAS設定検証 / Git差分・基本秘密情報検査
      |      Webビルド / OGP検証 / iOS JSバンドル検証
      |
      +--> Vercel Preview（Git連携、認証保護を維持）
      |      Web表示 / 3ルート / OGP・画像・アセット確認
      |
      +--> Expo / EAS（今回は既存状態の調査と設定確認のみ）
             ネイティブビルド・署名・配信は未実行
      |
      v
人間によるPRレビュー → 手動Squash Merge → main
      |
      v
Vercel Production自動更新
```

VercelとEASは独立した経路です。GitHub Actionsの`checks`は`contents: read`のみで実行し、checkoutの認証情報を残しません。`pull_request_target`、EASのビルド・Update・submit、ProductionへのCLIデプロイは含みません。Expo Doctorは確認済みの1.21.8に固定しています。

| 経路 | 確認できること / できないこと |
| --- | --- |
| GitHub Actions | 型・lint・設定・静的Web・JS変換。実機のUIや署名は検証しない |
| Vercel Preview | Webの3ルート・画像・OGP。iOSネイティブの検証ではない |
| Expo Go | 対応SDKでのiPhone実行。独自ネイティブアプリのビルド成功とは別 |
| EAS Build | ネイティブアプリのコンパイル。今回は未実行 |
| TestFlight | Appleで処理されたベータ版の配布。今回は未実施 |
| App Store | 審査と一般公開。今回は未実施 |

### EAS準備設定と現在の紐付け

`eas.json`は`cli.requireCommit: true`と`build.ios-simulator.ios.simulator: true`だけを定義しています。未コミット状態のビルド/Updateを防ぐEASの設定ですが、今回はどちらも起動しません。Simulator用は将来の設定であり、Windows上でiOS Simulatorを実行できるようにするものではありません。developmentClient、実機internal distribution、store/submit、Update channel、環境変数、署名情報はありません。`$schema`の外部取得にも依存しません。

`npm run check:eas`はJSON解析と今回の許可構成の厳密な照合を行い、認証・ネットワーク・EAS CLIなしで実行できます。SDK 58、strict、Expo Goの起動方法、static出力、未紐付け状態も確認します。store/submit/channel/env/別Project IDなどを拒否するテストを`npm test`で実行します。将来承認された紐付けやプロファイルを追加する際は、この制約とテストも同じPRで意図的に更新してください。

2026-11-18の読み取り調査:

- EAS CLI 27.10.0は`masa-practice`でログイン済み。公式APIで同アカウントを参照でき、現在のプロジェクト一覧は`appCount: 0`でした。
- `@masa-practice/kondate-biyori`の照会は存在しないとの応答でした。ほかのアカウントに属するプロジェクトの有無はこの結果から断定しません。
- ローカルslugは`kondate-biyori`。owner、`extra.eas.projectId`、iOS Bundle Identifierは未設定です。新規作成・紐付けは行っていません。
- 対応プロジェクトがないためKondateBiyoriのEASビルド履歴は取得対象なしで未確認です。「ビルド履歴0件」とは区別します。
- 過去に確認されたLittleDiaryのIDは流用しません。今回そのプロジェクトへの変更は行っていません。
- 提示した設定は、公式EAS CLI 27.10.0の`@expo/eas-json` validatorでもオフラインで検証しました。通常のCIは上記ローカル検証だけを使います。

`check:repository`はGit管理対象と非除外の追加ファイルのパス・基本秘密情報パターン・差分空白を検査します。包括的なsecret scannerではないため、レビューで最終差分を確認してください。EASのアップロード準備はまだ行わず、将来初回ビルド前に`.gitignore`（`.easignore`を作る場合はそちらが優先）の除外とアップロード対象も再確認します。

### main保護の調査結果と提案（今回は未適用）

2026-11-18に管理権限のあるGitHub CLIで読み取り確認しました。公開リポジトリで`main.protected: false`、従来の保護APIは404 `Branch not protected`、Rulesets一覧とmainに適用されるルール一覧はいずれも空でした。今回は403ではなく確認できています。PR必須・チェック必須・force push/削除禁止・承認レビューの強制は現在確認できず、管理者/自動化の例外ルールもありません。チームの運用ルールとGitHub上の強制設定は区別してください。

別作業で承認後に、mainを対象とする保護ルールまたはActive Rulesetへ次を設定することを推奨します。

- PR経由の変更と最新mainに対する必須ステータスチェックを要求する。既存ジョブ名`checks`（発行元GitHub Actions、成功履歴あり）を必須化できます。
- force pushとブランチ削除を禁止し、管理者にも適用する。無制限のbypassを管理者や自動化アカウントへ与えない。
- 会話の解決を必須にし、必要なレビュー人数を承認者の体制に合わせて決める。独立したレビュー担当がいる場合は1承認以上を推奨。単独開発では自分のPRを承認できないため、機械的に1承認を設定して運用を止めない。
- 設定後は意図した例外と`checks`の発行元を再確認する。今回ブランチ保護の設定APIは呼び出していません。

参考: [EAS設定](https://docs.expo.dev/eas/json/)、[Simulator設定](https://docs.expo.dev/build-reference/simulators/)、[GitHubブランチ保護](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)。

### Apple Developer Program加入後の別作業

以下は将来の独立PRと利用者承認で実施し、今回のCIからは起動しません。

1. Apple Developer Programへ加入する。
2. iOS Bundle Identifierを確定する。
3. 正しいExpoアカウント・プロジェクトを確定して紐付ける。
4. SDK互換の`expo-dev-client`を追加する。
5. 実機用Development Build設定を追加する。
6. アカウント所有者がApple署名とデバイス登録を行う。
7. 対象・プロファイル・アップロード除外を確認し、初回EAS Buildを手動実行する。
8. iPhone実機で起動・遷移・データ動作を確認する。
9. TestFlightとApp Store公開のパイプラインを後日の別作業で構築する。

Day 2.7のロールバックは未マージならPRを閉じ、マージ済みならこの変更をrevertするPRを作成します。元の4チェックを維持したまま追加検証・EAS設定・ドキュメントを戻せます。mainへrevertをマージするとVercel Productionが自動更新されることに注意してください。今回変更する外部Expo資源はありません。

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
