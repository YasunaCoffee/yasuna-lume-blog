---
name: jisseki-2026-update
description: >-
  Updates the annual achievements post `src/posts/jisseki-2026.md` whenever a
  new blog post should be listed under the 2026 track record. Use when adding or
  publishing posts under `src/posts/`, or when the user asks to sync 実績,
  jisseki, or the 2026 summary page.
---

# 2026年の実績（jisseki-2026）の同期

## 方針

新しいブログ記事を `src/posts/` に追加したうえで、その内容を**実績として残したい**ときは、同じ変更のなかで `jisseki-2026.md` を更新する。ユーザーが「実績に載せない」と言った記事は対象外。

## 編集するファイル

| パス | 役割 |
|------|------|
| `src/posts/jisseki-2026.md` | 年次実績の本文・一覧表・冒頭の件数説明 |

`src/_data.yml` の `home.profile_intro_links` にある **「2026年の実績」** は固定リンクのままでよい（通常は触らない）。

## 手順

1. 追加した記事のフロントマターから **`title`・`date`** を確認し、スラッグは **ファイル名の `.md` より前**（例: `foo-bar.md` → `/posts/foo-bar/`）。
2. `jisseki-2026.md` を開き、既存の `## N.` の続きに **新しい番号のセクション**を足す。
3. セクションの型（既存に合わせる）:
   - `## N. （短い見出し）`
   - `**対応記事:** [タイトル](/posts/{slug}/)（YYYY-MM-DD）`
   - `**要約**` の下に **2〜4 行の箇条書き**（事実・技術・位置づけ。本文の要約でよい）
4. **冒頭の導入文**で件数を固定している場合は更新する（例:「次の 2 記事」→「次の 3 記事」、または「以下の記事」に一般化）。
5. **「一覧（このブログ内）」の表**に行を追加する。並び順は **既存の表に合わせる**（現在は日付の並びに揃える）。
6. 必要なら末尾の一文だけ調整する。
7. `deno task build` でビルドし、エラーがないことを確認する。

## 要約の粒度

長文の転載はしない。各記事あたり数行で、ブログ上の説明として足りる程度に留める。

## 年が変わったら

2027 年以降は `jisseki-2027.md` のような**新しい年のファイル**を切るか、ユーザー指示に従う。スキル名はそのときリネームまたは別スキルでよい。
