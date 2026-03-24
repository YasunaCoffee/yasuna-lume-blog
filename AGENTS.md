# このリポジトリで AI エージェントがやること

このプロジェクトは [Lume](https://lume.land/) + [Simple Blog テーマ](https://lume.land/theme/simple-blog/) の静的ブログです。記事執筆は **yasuna 文体**（`prompts/yasuna-style-prompt.md`）を前提にします。

## 参照するファイル

| 用途 | パス |
|------|------|
| 2026 実績ページの更新手順（スキル） | `.cursor/skills/jisseki-2026-update/SKILL.md` |
| 文体・トーン | `prompts/yasuna-style-prompt.md` |
| 公開記事（ビルド対象） | `src/posts/*.md` |
| 下書き（ビルドしない） | `drafts/*.md` |
| サイト名・メタ情報 | `src/_data.yml` |
| ナビ用アイコン（任意） | `src/img/icon.png`（サムネ・OGP に使う） |
| Lume 設定 | `_config.ts` |
| サムネ・OGP 自動生成 | `deno task og` → `src/thumbnails/` と `src/og/` |

## 新規記事を書くとき

1. ユーザーから **テーマ・狙い・公開予定日** を確認する。
2. **`prompts/yasuna-style-prompt.md`** のトーンで本文を書く。
3. まだ公開しない場合は **`drafts/`** に `slug.md` として保存する。公開する場合は **`src/posts/`** に移し、ファイル名は **`kebab-case.md`** を推奨。
4. 各記事の先頭に **YAML フロントマター** を付ける。
5. その記事を **2026 年の実績に載せたい**場合は、同じ作業のなかで **`src/posts/jisseki-2026.md`** を更新する（手順は Cursor スキル **`.cursor/skills/jisseki-2026-update/SKILL.md`**）。

```yaml
---
title: "記事タイトル"
date: "YYYY-MM-DD"
author: yasuna
emoji: "📝"
category: "カテゴリ名"
tags:
  - タグ1
  - タグ2
draft: false
---
```

- **`emoji`** … 記事見出し横の絵文字。`scripts/generate-og.ts` のサムネ・OGP にも使う。
- **`category`** … 省略可。省略時は **先頭の `tags`** がサムネ上の「カテゴリ」表示になる。
- **`draft: true`** にすると一覧に出さない運用もできるが、このテーマでは **`drafts/` に置いてビルド対象外にする**方を推奨（ユーザー指示がない限り公開用は `src/posts/` のみ触る）。

## 文体の注意（Lume 用）

- このブログは **Zenn ではない**。Zenn 専用の `:::message` はそのままでは効かないことがある。呼び出しブロックが必要なら、テーマの Markdown 拡張（アラート等）に合わせるか、通常の引用・見出しで代用する。
- **トップページ**は記事本文・抜粋を出さず、**自動生成サムネイル**（`/thumbnails/{slug}.png`）のグリッドのみ。

## コマンド（ユーザーまたはエージェントが実行）

- 開発サーバー: `deno task serve`
- 本番ビルド: `deno task build`（**先に `og` タスクでサムネ・OGP を生成**してから Lume。出力は `_site/`）
- 画像だけ再生成: `deno task og`

Deno が未インストールの環境では、実行前に [Deno のインストール](https://docs.deno.com/runtime/getting_started/installation/) が必要。

## やらないこと

- `_site/` を手で編集しない（ビルド成果物）。
- ユーザーの実体験と矛盾する事実を捏造しない。不明な点は質問する。
- 文体プロンプトにない **別ペルソナ** に勝手に切り替えない。
