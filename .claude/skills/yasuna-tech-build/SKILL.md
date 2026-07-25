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

開発サーバーは起動しっぱなしになるため、**バックグラウンド実行**する（`deno task dev`）。
起動後、ターミナルに表示される `http://localhost:3000`（など）の URL をユーザーに伝える。
ビルドエラーが出たら出力をそのまま報告する。

## リンクカード（`deno task linkcards`）

記事に `linkcard` フェンス（言語指定を `linkcard` にして URL を1行1つ）を足したときだけ実行する。
書き方は `yasuna-tech-post` スキルにある。

- `src/posts/*.md` と `drafts/*.md` を走査して OGP を取得し、`linkcards.cache.json` に保存する。
- **このキャッシュはコミットする。** ビルド時は `_config.ts` の HTML 後処理がキャッシュを読むので、
  **ビルド自体はネット不要**（CI で安全）。
- 未取得の URL はホスト名だけの簡易カードにフォールバックする。新しい URL を足したら、
  コミット・ビルドの前にこのタスクを流す。
- **ネットワークが無い環境では失敗する。** その場合は既存のキャッシュのまま進めて、
  カードが簡易表示になることをユーザーに伝える。
- 見た目は `src/zenn.css` の `.link-card*`。

## やらないこと

- `_site/` を手で編集しない（ビルド成果物）。コミットもしない（`.gitignore` 済みが基本）。
- 依存の更新（`deno task update-deps`）はユーザー指示があるときだけ。
