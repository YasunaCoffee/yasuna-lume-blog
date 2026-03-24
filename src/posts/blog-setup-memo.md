---
title: "Lume でブログを立ち上げて、M3 っぽい色までやったメモ"
description: "Deno・Simple Blog・AI 執筆フロー・OGP・Material Design 3・CSS の読み込み忘れまで、試行錯誤の記録です。"
date: "2025-03-24"
author: yasuna
tags:
  - Lume
  - Deno
  - ブログ
emoji: "🛠️"
draft: false
---

# はじめに

端的に言うと、**静的サイトジェネレータの Lume で個人ブログを作り、AI エージェントと一緒に書く前提のリポジトリにしたあと、見た目を Zenn っぽく寄せたり Material Design 3 の色を入れたり、途中で CSS が効いてないことに気づいたりした**、という話です。

参考にした記事は、Lume + Simple Blog の紹介として逆瀬川ちゃんさんの「[このブログを Lume で作った話](https://nyosegawa.com/posts/hello-lume/)」です。セットアップのイメージはここから借りました。

## そもそも何をしたか

- **Lume** と **Simple Blog テーマ**でブログ基盤を用意した（`deno task serve` でプレビュー）
- **文体**は `prompts/yasuna-style-prompt.md` にまとめて、執筆ルールは **`AGENTS.md`** に書いた
- 下書き用に **`drafts/`**、記事のひな形に **`templates/post.md`** を置いた
- **Git** で管理して **GitHub** に push（リポジトリ名は既存の `blog` と被ったので **`yasuna-lume-blog`** で作成）
- Windows で **Deno を入れたとき**、`deno` が PATH に載らなかったり、インストール中に `Can't unlink` が出たりした。**フルパス**か **`$env:Path` を足す**か、ターミナルを開き直すとよかったです
- 記事まわりは **フロントマターに `emoji`** を書けるようにレイアウトを上書きし、**OGP 画像をビルド前に生成するスクリプト**（`scripts/generate-og.ts`）を置いた。アイコンは **`src/img/icon.png`** があれば OGP に載せる想定
- **見た目**は `src/zenn.css` で [Material Design 3](https://m3.material.io/styles/color) のサーフェス／Primary 系の色に寄せた

## ネットの声との対比（というほどでもないが）

「テーマの CSS を足したのに色が変わらない」という状態になったとき、**原因はシンプルでした**。Lume は `zenn.css` を **`/zenn.css` として別ファイルで出力する**のに、**HTML では `/styles.css` しか読んでいなかった**のです。`layouts/base.vto` に `<link rel="stylesheet" href="/zenn.css">` を足したら、トップページも含めて一気に M3 っぽい背景とナビのトーンが効きました。

ちなみに、自分用のメモとして README にも「`zenn.css` は `styles.css` の次に読む」と書いておきました。次にハマったときの自分への手紙です。

## まとめ

- **ブログの土台**は Lume + Simple Blog、**執筆の型**は `AGENTS.md` と yasuna 用プロンプトで固定した
- **デザイン**は M3 風の変数を `zenn.css` に置き、**読み込み忘れ**で一瞬トラブったが、`base.vto` でリンクすれば解決
- OGP はスクリプトで生成する前提なので、**本番 URL** は `SITE_URL` などで揃えたい（GitHub Pages のパスにも注意）

ここまで読んで、「自分もメモ残したい」となったら、それはそれで正解だと思います。みなさんのブログ制作にも幸あれ。
