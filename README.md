# yasuna blog（Lume）

[Deno](https://deno.land/) の [Lume](https://lume.land/) と [Simple Blog](https://lume.land/theme/simple-blog/) で作る静的ブログです。記事は **AI エージェントと yasuna 文体**（`prompts/yasuna-style-prompt.md`）を前提に執筆します。

## 必要なもの

- [Deno](https://docs.deno.com/runtime/getting_started/installation/)

## コマンド

```bash
deno task serve   # http://localhost:3000 でプレビュー
deno task build   # _site/ に出力
```

初回は依存の取得で時間がかかります。

### Windows: `deno` が認識されないとき

インストール直後は **PATH がまだ現在のターミナルに載っていない**ことがあります。次のいずれかを試してください。

1. **Cursor のターミナルを閉じて新しく開く**（または PC に再ログイン）
2. そのセッションだけ PATH を通す:

```powershell
$env:Path = "$env:USERPROFILE\.deno\bin;$env:Path"
deno task serve
```

3. フルパスで実行: `& "$env:USERPROFILE\.deno\bin\deno.exe" task serve`

### インストール時に `Can't unlink` / `tar.exe` エラーが出たとき

既存の `deno.exe` を別プロセスが掴んでいると、上書きに失敗することがあります。`deno --version` が **フルパス** で動くか確認し、動かない場合は Cursor をいったん終了し、**管理者ではない**通常の PowerShell で `irm https://deno.land/install.ps1 | iex` を再実行するか、`%USERPROFILE%\.deno` を削除してから入れ直してください。

## ディレクトリ

| パス | 説明 |
|------|------|
| `src/posts/` | 公開記事（Markdown + フロントマター） |
| `drafts/` | 下書き（ビルドしない） |
| `prompts/yasuna-style-prompt.md` | 文体プロンプト |
| `AGENTS.md` | Cursor 等のエージェント向け運用ルール |
| `templates/post.md` | 新規記事のひな形 |

## GitHub Pages

`.github/workflows/deploy.yml` で `main` へ push すると `_site` をデプロイする想定です。リポジトリの **Settings → Pages** で GitHub Actions を有効にしてください。

プロジェクトサイト（`https://USER.github.io/REPO/`）の場合は、`_config.ts` で `basePath` 等が必要になることがあります。[Lume の base_path](https://lume.land/plugins/base_path/) を参照してください。

## 参考

- [このブログを Lume で作った話（逆瀬川ちゃん）](https://nyosegawa.com/posts/hello-lume/) — セットアップとデプロイのイメージ
