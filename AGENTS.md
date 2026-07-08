# このリポジトリで AI エージェントがやること

このプロジェクトは [Lume](https://lume.land/) + [Simple Blog テーマ](https://lume.land/theme/simple-blog/) の静的ブログです。記事執筆は **yasuna 文体**（`prompts/yasuna-style-prompt.md`）を前提にします。

## 参照するファイル

| 用途 | パス |
|------|------|
| 記事執筆（Claude Code スキル） | `.claude/skills/yasuna-tech-post/SKILL.md` |
| ビルド/プレビュー（Claude Code スキル） | `.claude/skills/yasuna-tech-build/SKILL.md` |
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

## 英語版（日英バイリンガル）

このブログは [Lume の multilanguage プラグイン](https://lume.land/plugins/multilanguage/)で日英を出し分けます（既定 `ja`・英語は `/en/`）。記事を英訳するときは:

1. `src/posts/` に**英語スラッグ**の `.md` を新規作成する（既存の日本語ファイルは消さない）。
2. フロントマターに **`lang: en`** と、日本語版と**同じ `id:`** を付ける（`id` 一致で対訳がリンクされる）。日本語版にも同じ `id:` と `lang: ja` を付ける。
3. 言語別の UI 文言・プロフィールは `src/_data.yml` の `ja:` / `en:` ブロックに追記する（共通項目はトップレベル）。
4. 追加後は `deno task og`（サムネ・OGP 生成）→ `deno task build` を回す。
5. 翻訳は逐語訳でなく、**yasuna 文体を英語で自然に**再現する。事実（コマンド・数値・固有名詞）は改変しない。

## 文体の注意（Lume 用）

- このブログは **Zenn ではない**。Zenn 専用の `:::message` はそのままでは効かないことがある。呼び出しブロックが必要なら、テーマの Markdown 拡張（アラート等）に合わせるか、通常の引用・見出しで代用する。
- **トップページ**は記事本文・抜粋を出さず、**自動生成サムネイル**（`/thumbnails/{slug}.png`）のグリッドのみ。

## コマンド（ユーザーまたはエージェントが実行）

- 開発サーバー: `deno task serve`
- 本番ビルド: `deno task build`（**先に `og` タスクでサムネ・OGP を生成**してから Lume。出力は `_site/`）
- 画像だけ再生成: `deno task og`
- リンクカードの OGP 取得: `deno task linkcards`

## OGP リンクカード（```linkcard）

記事に外部リンクを **カード**（リンク先の og:image・タイトル・説明）で並べたいときは、フェンスに URL を 1 行 1 つで書く。複数行ならグリッドのギャラリーになる。

````markdown
```linkcard
https://muilab.com/
https://remarkable.com/
```
````

- 画像は **リンク先の OGP 画像をホットリンク**する（転載しない）。
- 仕組み: `deno task linkcards` が `src/posts/*.md`・`drafts/*.md` を走査して OGP を取得し、`linkcards.cache.json`（**コミットする**）に保存。ビルド時は `_config.ts` の HTML 後処理がこのキャッシュを読んでカード化する（**ビルド自体はネット不要＝CI で安全**）。
- 新しい URL を足したら **`deno task linkcards` を実行してキャッシュを更新**してからコミット・ビルドする。未取得の URL はホスト名だけの簡易カードにフォールバックする。
- カードの見た目は `src/zenn.css` の `.link-card*`（`.post-card` と同じ Material Design 3 のサーフェス階層）。

Deno が未インストールの環境では、実行前に [Deno のインストール](https://docs.deno.com/runtime/getting_started/installation/) が必要。

## やらないこと

- `_site/` を手で編集しない（ビルド成果物）。
- ユーザーの実体験と矛盾する事実を捏造しない。不明な点は質問する。
- 文体プロンプトにない **別ペルソナ** に勝手に切り替えない。
