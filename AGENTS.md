# このリポジトリで AI エージェントがやること

このプロジェクトは [Lume](https://lume.land/) + [Simple Blog テーマ](https://lume.land/theme/simple-blog/) の静的ブログです。記事執筆は **yasuna 文体**（`prompts/yasuna-style-prompt.md`）を前提にします。

## 参照するファイル

| 用途 | パス |
|------|------|
| 文体・トーン | `prompts/yasuna-style-prompt.md` |
| 公開記事（ビルド対象） | `src/posts/*.md` |
| 下書き（ビルドしない） | `drafts/*.md` |
| サイト名・メタ情報 | `src/_data.yml` |
| Lume 設定 | `_config.ts` |

## 新規記事を書くとき

1. ユーザーから **テーマ・狙い・公開予定日** を確認する。
2. **`prompts/yasuna-style-prompt.md`** のトーンで本文を書く。
3. まだ公開しない場合は **`drafts/`** に `slug.md` として保存する。公開する場合は **`src/posts/`** に移し、ファイル名は **`kebab-case.md`** を推奨。
4. 各記事の先頭に **YAML フロントマター** を付ける。

```yaml
---
title: "記事タイトル"
date: "YYYY-MM-DD"
author: yasuna
tags:
  - タグ1
  - タグ2
draft: false
---
```

- **`draft: true`** にすると一覧に出さない運用もできるが、このテーマでは **`drafts/` に置いてビルド対象外にする**方を推奨（ユーザー指示がない限り公開用は `src/posts/` のみ触る）。

## 文体の注意（Lume 用）

- このブログは **Zenn ではない**。Zenn 専用の `:::message` はそのままでは効かないことがある。呼び出しブロックが必要なら、テーマの Markdown 拡張（アラート等）に合わせるか、通常の引用・見出しで代用する。
- 一覧の抜粋は、テーマの仕様に従い、本文の冒頭段落が使われる。長い場合は冒頭で要約を書く。

## コマンド（ユーザーまたはエージェントが実行）

- 開発サーバー: `deno task serve`
- 本番ビルド: `deno task build`（出力は `_site/`）

Deno が未インストールの環境では、実行前に [Deno のインストール](https://docs.deno.com/runtime/getting_started/installation/) が必要。

## やらないこと

- `_site/` を手で編集しない（ビルド成果物）。
- ユーザーの実体験と矛盾する事実を捏造しない。不明な点は質問する。
- 文体プロンプトにない **別ペルソナ** に勝手に切り替えない。
