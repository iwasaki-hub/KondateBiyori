# Day 7.5 — Supabase接続基盤（2026-11-22）

## 新規プロジェクトの作成結果
- **作成済み**: KondateBiyori / iwasaki-hub's Org / ap-northeast-1（東京）
- Project ref: `nrcilifwdkmojguezbln`
- URL: `https://nrcilifwdkmojguezbln.supabase.co`
- Supabase API `get_project`: `ACTIVE_HEALTHY` を確認
- `sb_publishable_` 形式の公開可能キーが有効であることを確認した（実値はリポジトリに記載しない）
- 作成の見積り: 月額 $0。ユーザーの明示同意後に作成。
- 既存の next-app / typing-app / LittleDiary を変更していない。

## 本PRで導入するもの
- Expo Web/Native向けの任意環境設定 `EXPO_PUBLIC_SUPABASE_URL` と `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` の形式検証
- 接続状態を確認する `auth/v1/health` の軽量GETリクエスト、設定タブから手動実行
- レシピ/家族設定/週別献立は従来どおり端末の `localStorage` / `expo-sqlite/kv-store` に保存
- 通信失敗時も既存のデータに影響しない。ローカルデータのアップロードは実行しない
- 純粋関数テストと既存CIへ接続設定検査を追加

## 接続設定（必要な手動操作）
- Vercelの `kondate-biyori` プロジェクトに対し、環境変数の作成APIが **403 forbidden** を返した。アプリ側からの自動登録は実行できていない
- Vercel → kondate-biyori → Settings → Environment Variables で Preview と Production に次の2つを設定し、該当ブランチを再デプロイする
  - `EXPO_PUBLIC_SUPABASE_URL=https://nrcilifwdkmojguezbln.supabase.co`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=` （Supabase Dashboard → Project Settings → API Keys の `sb_publishable_` からコピー）
- ローカル開発環境では同じ2変数を `.env.local` に設定する。環境変数はExpoのビルド時に埋め込まれる
- 設定タブの「Supabase接続を確認」で「到達できました」が出ても、認証・RLS・同期を保証するものではない
- **secret/service_role/DBパスワードを `EXPO_PUBLIC_*` に入れない**

## 次工程（本PRでは未実装）
- `@supabase/supabase-js` と対応する認証用session storageの安全な依存バージョンをピン留めし、lockfileを同時更新
- 認証 UI、メール確認、ログイン継続・ログアウト
- 家族プロフィール・週別献立テーブル、所有者限定RLSとA/B別ユーザー認証・CRUDテスト
- 既存端末データのクラウド移行/マージ時の競合解決
- マイグレーション/クラウドデータ保存は別PR・安全検証後に実施
- npmレジストリの名前解決が作業コンテナから失敗したため、依存追加やlockfile更新を無理に実施していない

## 制約
- Expoは `EXPO_PUBLIC_*` をクライアントに公開する。公開キーの安全性はRLS設計が前提
- サンプル献立機能は既存のローカル保存のままで、クラウドへの書込みは行われない
- Web静的出力を維持し、有料サービス/署名/本番データの変更は行わない
