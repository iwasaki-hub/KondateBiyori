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
