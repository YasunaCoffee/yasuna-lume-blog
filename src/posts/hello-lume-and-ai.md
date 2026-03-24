---
title: このブログは Lume で、AIエージェントと書く
date: "2025-03-24"
author: yasuna
tags:
  - Lume
  - Deno
  - AI
draft: false
---

こんにちは、yasunaです。

端的に言うと、**静的サイトジェネレータの Lume（ルメ）でブログを立ち上げ、記事は Cursor などの AI エージェントと一緒に書く**前提でリポジトリを組んでいます。

## なぜ Lume か

SSG の選択肢は多いですが、Deno ベースで **node_modules を抱えずに済む**のが気持ちいいです。セットアップは [Simple Blog テーマ](https://lume.land/theme/simple-blog/) を `site.use(blog())` で読み込む形にしています。

## AI とどう書くか

- 文体の基準はリポジトリ直下の **`prompts/yasuna-style-prompt.md`**（yasuna 用プロンプト）
- 下書き用に **`drafts/`** を置き、整ったら **`src/posts/`** に移して公開、という流れを想定
- 詳しい手順は **`AGENTS.md`** にまとめてあるので、エージェントに `@AGENTS.md` を渡すと運用しやすいです

## ローカルで動かす

[Deno](https://deno.land/) を入れたあと、プロジェクトのルートで次を実行します。

```bash
deno task serve
```

`http://localhost:3000` でプレビューできます。

## まとめ

- 公開用の本文は **`src/posts/*.md`** に置く（フロントマター付き Markdown）
- 執筆のトーンは **`prompts/yasuna-style-prompt.md`** に合わせる
- 運用ルールは **`AGENTS.md`**

みなさんのブログ制作にも幸あれ。
