# Day 7.5 — Supabase接続基盤（段階導入）

## 接続先
- 組織: iwasaki-hub's Org（承認済み）
- 新規専用プロジェクト: KondateBiyori
- リージョン: ap-northeast-1（東京）
- **プロジェクト作成: 費用確認 $0/月への明示同意待ち。まだ未作成。**
- 既存のnext-app、typing-app、LittleDiaryプロジェクトは変更禁止。

## このPRの範囲
- Expo Web/iOSで使用する公開設定（URLとsb_publishable_公開キー）の入力検証
- 外部データを送信しないAuthヘルスチェック補助関数。到達可能性のみの確認で認証・RLSの成功は意味しない
- `.env.example` に環境変数名を示す。実際の鍵・URLはVercelなど各環境の設定で管理
- 従来の家族設定・週次献立は引き続きlocalStorage/SQLite KVにのみ保存。ログインもデータ同期もまだ行わない
- 既存ユーザーのローカルデータをリモートに自動アップロードしない

## 後続の安全な工程（別PRを推奨）
1. 新規プロジェクトを作成・ACTIVE_HEALTHY確認、publishable keyとURLを取得
2. `@supabase/supabase-js` を互換バージョンで固定し、npm lockfileと共に追加。Web/Nativeのsession storage、Auth、ログイン・ログアウトと通信失敗時のUXを実装
3. 家族設定と週別献立の表・行単位RLSを作り隔離テスト。所有者ID=auth.uid()、anon拒否、SELECT/INSERT/UPDATE/DELETEをA/Bで検証
4. マイグレーション・リアルユーザーの保存操作はテスト後、明示承認を得てから実施
5. オフライン競合、端末内データの移行方針、アカウント削除と同期の境界を決める

## セキュリティ
- `EXPO_PUBLIC_*` は公開情報。service_role / sb_secret_ / DBパスワードを設定しない
- Supabaseの公開鍵は認可を担わない。RLSによりユーザー本人の行だけ閲覧・書き込み可にする
- RLSの無い表をData APIへ公開しない。認証情報のログ出力禁止
- 適用する変更は専用Supabaseプロジェクトのみ。既存のプロジェクトには一切変更しない
- npm依存追加はネットワークおよびlockfile生成が可能な環境で安全に行い、バージョンを固定する
