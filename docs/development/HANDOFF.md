# KondateBiyori — 次回開発引き継ぎ（2026-11-22 JST）

> **次回はここから読む。** 本書は確認時点のスナップショット。まずGitHubの現行 `main` とオープンPR・CIを再取得し、記載されたSHAやデプロイの状態を現在の実績と混同しない。

## 1. 現在地（2026-11-22 最終確認）

- Repository: https://github.com/iwasaki-hub/KondateBiyori
- `main`: `793b4c7ac505dfbacce158692056887dd8087968`（Day 7.5のPR [#15](https://github.com/iwasaki-hub/KondateBiyori/pull/15) Squashマージ）
- オープンPR: **0件**（引き継ぎ調査時点）
- Production: Vercelデプロイ `5i9EjNDgf81RPMz14F9MCNLxDWWZ` **READY**。GitHubのVercelステータス成功、デプロイコミットは上記mainと一致。
- PR #15のCI [Run #35](https://github.com/iwasaki-hub/KondateBiyori/actions/runs/44991415663) 成功。マージ後のmainについて新しいCI実行が見えない場合、PR側成功と区別する。
- ユーザーから「Vercel環境変数を設定した」「同期完了」と報告あり。**アプリ内のクラウドデータ同期が動作した証拠ではない**。現行コードに同期処理・ログイン機能は無い。
- Vercel環境変数の読み取りAPIは権限エラー403。実際の設定内容や適用済みビルドからの疎通結果は直接確認できていない。
- 現時点の引き継ぎ資料更新用ブランチはドキュメント専用。**機能実装やPRの自動マージはしない**。

## 2. 完了済み工程（すべてmainにマージ済み）

| 工程 | 実PR | 内容 | main Squash SHA |
| --- | --- | --- | --- |
| Day 3 | [#10](https://github.com/iwasaki-hub/KondateBiyori/pull/10) | レシピ台帳10件 | `856ce2dd` |
| Day 4 | [#11](https://github.com/iwasaki-hub/KondateBiyori/pull/11) | 家族プロフィール＋ローカル保存 | `a111ff42` |
| Day 5 | [#12](https://github.com/iwasaki-hub/KondateBiyori/pull/12) | 週間献立・週別保存 | `7a5c3633` |
| Day 6 | [#13](https://github.com/iwasaki-hub/KondateBiyori/pull/13) | レシピ詳細・1〜10人分換算 | `c7811d31` |
| Day 7 | [#14](https://github.com/iwasaki-hub/KondateBiyori/pull/14) | 1日差し替え・確認・取消 | `69fd4d3f` |
| Day 7.5-A | [#15](https://github.com/iwasaki-hub/KondateBiyori/pull/15) | Supabase専用プロジェクト作成・公開設定検証・接続診断 | `793b4c7a` |

## 3. Supabase：実在する接続先と実装の境界

- **対象はKondateBiyori専用のみ**（他プロジェクトに触れない）
- Organization: `iwasaki-hub's Org` / Project: `KondateBiyori`
- Region: `ap-northeast-1`（東京）
- Ref: `nrcilifwdkmojguezbln`
- API URL: `https://nrcilifwdkmojguezbln.supabase.co`
- Dashboard: https://supabase.com/dashboard/project/nrcilifwdkmojguezbln
- Supabaseの`get_project`: **ACTIVE_HEALTHY**。PostgreSQL 17.12で読み取り専用テストクエリ成功（作成時）。
- 有効な`sb_publishable_`型の公開可能キーが存在する。**実際のキーやsecretキーをGitHub・ドキュメント・ログに記録しない**。
- Vercelへ設定済みとのユーザー報告: `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。一覧APIの403により自動再確認不可。Preview/Production別適用範囲も未確認。
- 現行の`src/cloud/supabase-config.ts`は設定値の形式検証と`/auth/v1/health`のGETだけ。`app/(tabs)/settings.tsx`に診断ボタンあり。
- **未導入**: `@supabase/supabase-js`、Supabase Auth、ログイン状態保持、家族/献立テーブル、RLS、クラウドCRUD、既存端末データの同期・移行。
- データ保存の現在地: WebはlocalStorage、iOS/Androidは`expo-sqlite/kv-store`。接続診断が成功してもこれは変わらない。

## 4. 次回の最初の作業（Day 7.5-B）

**推奨: Supabase認証クライアントとログイン導線を1専用PRで実装。** Day 8はその後。認証だけとDBスキーマ／データ同期を同じPRに無理に混ぜない。

1. `AGENTS.md` → 本書 → `WORKLOG.md` → `docs/planning/01_PRD_仕様書.md`、`02_画面と技術設計.md`、`03_14日間開発計画とCodex指示.md` → [Day 7.5資料](day075-supabase.md) を読む。
2. GitHub最新main、オープンPR、作業ツリー、SupabaseプロジェクトID、Vercel Preview/Productionを再確認。古いSHAへ上書きしない。
3. Supabase公式ドキュメント／SDKの最新対応方法とExpo SDK 58の互換性を確認。正規のnpm操作で**固定バージョン＋package-lock.json更新**（手でlockfileを捏造しない）。
4. Web/iPhone双方のセッション保存を設計。ログイン・新規登録・ログアウト、ローディング／失敗／メール確認、ログイン状態保持のテストを実装。既存のゲスト向け献立機能は維持する。
5. 環境変数が未設定・誤設定・通信失敗でもローカル保存を破壊せず、Auth設定を秘密鍵なしで扱う。接続診断の成功を認証完了と誤記しない。
6. CI: `npm ci`, `npm test`, `npx expo-doctor`, `npm run build:web`, `npm run export:ios`。PRのPreviewで静的ページ/JS/CSS/疎通、iPhone Safariの手動確認を行う。未確認は未確認と明記。
7. PR作成後、明示的な指示までマージしない。次の別PRで家族・献立のDB設計、RLS、認証ユーザーA/Bの越境CRUDテスト。実DBのマイグレーション適用は別途範囲確認を行う。
8. データ同期実装はさらに次段階。既存ローカルデータの上書き・重複・オフライン競合の対処を先に設計し、暗黙のアップロードをしない。

**次回の起動プロンプト例**:
> KondateBiyoriの続きを進めましょう。最新mainとPR、`AGENTS.md`・`docs/development/HANDOFF.md`・`WORKLOG.md`を確認し、Day 7.5-B「Supabase Auth・ログイン状態保持」を専用ブランチ・専用PRで進めてください。ローカル保存は維持し、DBマイグレーション・クラウド同期・マージは行わないでください。

## 5. 禁止事項・未確認事項

- **禁止**: mainへ直接push／force push／無断マージ／LittleDiary・next-app・typing-appへの変更／service_roleやsecretキーをクライアントへ投入／課金・EASネイティブビルド・本番DB破壊を無断実行。
- RLSは`auth.uid() = user_id`等の本人所有制約。更新はUSINGとWITH CHECK双方、anon拒否。スキーマ作成時点ではData API公開範囲とGRANTも検証する。
- iPhone実機・iPhone Safariのレシピ差し替え、接続診断、ログインの手動操作は**未確認**。Webビルド／CI成功を実機成功と混同しない。
- Vercel Previewは保護、Productionは公開。Production READYでも接続診断の実動作確認とは別。
- Apple Developer Program未加入、Expo GoとSDK 58の互換問題あり。EASのiOS JS exportはネイティブビルドではない。
- 過去に記録したnpm audit警告、mainブランチ保護の有無は現行再確認が必要。費用見積りは作成時$0/月で将来の無課金保証ではない。
- Day 8「買い物リスト集計」は未着手。14日計画のDay 10/11のSupabase内容をDay 7.5へ前倒ししているため、計画書と実PR番号を混同しない。

参考: [運用ルール](../../AGENTS.md) / [開発履歴](WORKLOG.md) / [Supabase詳細](day075-supabase.md) / [計画](../planning/03_14日間開発計画とCodex指示.md)
