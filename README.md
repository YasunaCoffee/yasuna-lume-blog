# yasunaのてっくぶろぐ（Lume）

[Deno](https://deno.land/) の [Lume](https://lume.land/) と [Simple Blog](https://lume.land/theme/simple-blog/) で作る静的ブログです。見た目は [Material Design 3](https://m3.material.io/styles/color) のカラー・サーフェス階層を `src/zenn.css` で少しだけ寄せています（ビルド後は `/zenn.css` として出力され、`layouts/base.vto` から `/styles.css` の次に読み込みます）。記事は **AI エージェントと yasuna 文体**（`prompts/yasuna-style-prompt.md`）を前提に執筆します。

## 必要なもの

- [Deno](https://docs.deno.com/runtime/getting_started/installation/)

## コマンド

```bash
deno task serve   # プレビューのみ（サムネ未更新のときは og 未実行の可能性あり）
deno task dev     # サムネ・OGP 生成してからプレビュー（記事追加後におすすめ）
deno task build   # og 生成 → _site/ に出力（本番用）
deno task og      # src/og/ と src/thumbnails/ の PNG だけ再生成
```

トップページは **本文を表示せず**、各記事の **自動生成サムネ**（タイトル・カテゴリ・著者・アイコン・ブログ名）が並びます。

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

## 多言語（日英バイリンガル）

[Lume の multilanguage プラグイン](https://lume.land/plugins/multilanguage/)で日英を出し分けます。**既定は日本語**（URL プレフィックスなし）、**英語は `/en/` 配下**に出力されます。

- 言語別の文言（UI ラベル・i18n）とプロフィールは `src/_data.yml` の **`ja:` / `en:`** ブロックで管理します。共通項目はトップレベル（`metas`・`home.profile_links`・`languageNames`）に置きます。
- 記事の英訳を足すときは、`src/posts/` に英語スラッグの `.md` を新規作成し、フロントマターに **`lang: en`** と、日本語版と**同じ `id:`** を付けます。`id` が一致したペアが「言語切り替え」（ナビ右上）の対訳として相互リンクされます。
- 例: `lume-deno-de-tech-blog-kochiku.md`（`lang: ja`, `id: post-lume-deno-blog`）↔ `building-tech-blog-with-lume-deno.md`（`lang: en`, `id: post-lume-deno-blog`）。
- 英語記事もサムネ・OGP は `deno task og`（`src/posts/*.md` を走査）で生成されます。追加後は `deno task og` → `deno task build` を回してください。
- トップページ（`src/index.vto`）は `lang: [ja, en]` の 1 ファイルで日英両方を出力し、記事グリッドは表示言語で絞り込みます。
- RSS/JSON Feed は現状**日本語記事のみ**（`_config.ts` の `feed.query` で `lang=ja` に限定）。英語フィードは将来追加する想定です。

## GitHub Pages

`.github/workflows/deploy.yml` で `main` へ push すると `_site` をデプロイする想定です。

### 初回・`Failed to create deployment` / `HttpError: Not Found` (404) のとき

1. リポジトリの **Settings → Pages** を開く。
2. **Build and deployment** の **Source** を **GitHub Actions** にする（**Deploy from a branch** のままだと `actions/deploy-pages` が 404 になりやすい）。
3. 保存後、**Actions** タブから失敗したワークフローを **Re-run all jobs** する。

無料プランでは **パブリック** リポジトリ向けの Pages 前提が強いです。プライベートにした直後は Pages が無効になる場合があります。

プロジェクトサイト（`https://USER.github.io/REPO/`）の場合は、`_config.ts` で `basePath` 等が必要になることがあります。[Lume の base_path](https://lume.land/plugins/base_path/) を参照してください。

## 参考

- [このブログを Lume で作った話（逆瀬川ちゃん）](https://nyosegawa.com/posts/hello-lume/) — セットアップとデプロイのイメージ
