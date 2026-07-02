---
name: yasuna-tech-build
description: >-
  yasuna のテックブログ（Deno + Lume）をビルド・プレビュー・サムネ生成する。
  「ブログをプレビューして」「yasuna-tech をビルド」「ローカルで確認したい」
  「サムネ（OGP）を再生成して」「本番用に出力して」「deno task を実行して」
  などのとき、または yasuna-tech リポジトリの記事を追加・編集したあとに
  表示確認したいときに使う。og / serve / dev / build タスクを使い分ける。
---

# yasuna-tech ビルド/プレビュースキル

yasuna のテックブログ（Deno + Lume）をビルド・プレビューする。

## リポジトリの場所

- ローカル: `/home/yasuna/dev/yasuna-tech`
- 無ければ取得: `git clone https://github.com/YasunaCoffee/yasuna-tech.git`

すべてのコマンドはリポジトリのルートで実行する。

## 前提: Deno

Deno が必要。未インストールなら案内する: https://docs.deno.com/runtime/getting_started/installation/
確認: `deno --version`。初回は依存取得に時間がかかる。

## タスクの使い分け（`deno.json` の tasks）

| やりたいこと | コマンド | 内容 |
|------|------|------|
| サムネ・OGP だけ再生成 | `deno task og` | `src/og/` と `src/thumbnails/` の PNG を再生成（`scripts/generate-og.ts`） |
| プレビューのみ | `deno task serve` | Lume の開発サーバー（`-s`）。サムネ未更新だと OGP 未実行の可能性あり |
| 記事追加後のプレビュー（推奨） | `deno task dev` | `og` → 開発サーバー。サムネ・OGP を生成してからプレビュー |
| 本番ビルド | `deno task build` | `og` → Lume ビルド。出力は `_site/` |

**記事を追加・編集したあとは `deno task dev` を推奨**（自動生成サムネ `/thumbnails/{slug}.png` が更新される）。トップページは本文を出さず、サムネのグリッドのみ表示。

## 実行のしかた（このセッション内で開発サーバーを動かす場合）

開発サーバーは起動しっぱなしになるため、バックグラウンド実行する。例:

```bash
cd /home/yasuna/dev/yasuna-tech && deno task dev
```

起動後、ターミナルに表示される `http://localhost:3000`（など）の URL をユーザーに伝える。ビルドエラーが出たら出力をそのまま報告する。

## やらないこと

- `_site/` を手で編集しない（ビルド成果物）。コミットもしない（`.gitignore` 済みが基本）。
- 依存の更新（`deno task update-deps`）はユーザー指示があるときだけ。
