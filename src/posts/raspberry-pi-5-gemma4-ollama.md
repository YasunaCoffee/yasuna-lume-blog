---
id: post-raspi5-gemma4-ollama
lang: en
title: "Running Gemma4 on a Raspberry Pi 5 (8GB) with Ollama"
date: "2026-04-04"
author: yasuna
emoji: "🫐"
category: "Solo dev"
tags:
  - Solo dev
  - RaspberryPi
  - LLM
  - Ollama
  - Local LLM
draft: false
description: "A record of running Gemma4 on a Raspberry Pi 5 (8GB) with Ollama. e4b wouldn't start due to insufficient RAM; e2b ran, and shrinking the context greatly improved the felt speed."
---

Hi! It's yasuna!

This is a record of trying to run an LLM fully locally by installing Gemma4 with Ollama on a Raspberry Pi 5 (8GB).

Setup:
- Run **Gemma4** (Google's edge-oriented model) with Ollama
- Operate it over SSH from a Mac (Warp)

To get the conclusion out of the way: **it ran, but it's slow** — that's where things stand.

---

# Environment

- Raspberry Pi 5 8GB
- microSD 32GB
- SSH from a Mac via Warp
- OS: Raspberry Pi OS Lite 64-bit (Bookworm)

---

# First, install Ollama

The install is a single official script:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Next, pull Gemma4. At first I installed e4b (Effective 4B).

```bash
ollama pull gemma4:e4b
```

The download itself went through.

---

# e4b ran out of RAM

When I tried to start it, I got an immediate error:

```
Error: 500 Internal Server Error: model requires more system memory (9.9 GiB) than is available (9.2 GiB)
```

Gemma4's e4b needs about 9.6GB of RAM in Ollama, and on a Pi 5 8GB only 9.2GiB is usable once you account for the OS, Ollama itself, and the KV cache. It gets checked strictly and was rejected.

Here's the RAM from `free -h` at the time:

```
               total        used        free      shared  buff/cache   available
Mem:           7.9Gi       581Mi       366Mi        37Mi       7.1Gi       7.3Gi
Swap:          2.0Gi         0B       2.0Gi
```

And the SD card's free space:

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/mmcblk0p2   28G   20G  7.6G  72% /
```

The e4b download alone had already consumed 20GB. 7.6GB left.

---

# Switching to e2b

I deleted e4b and reinstalled e2b (Effective 2B, about 7.2GB):

```bash
ollama rm gemma4:e4b
ollama pull gemma4:e2b
ollama run gemma4:e2b
```

This time it started.

But watching `watch -n 2 free -h` while the model was thinking (during inference):

```
Mem:           7.9Gi       7.3Gi       300Mi        20Mi       399Mi       606Mi
Swap:          2.0Gi       1.4Gi       659Mi
```

Swap was using 1.4GiB and available had dropped to the 600Mi range.

---

# Shrinking the context made it roughly twice as fast

```bash
OLLAMA_NUM_CTX=2048 ollama run gemma4:e2b
```

Just this made it feel about 2x faster.

Starting with the default context size (128K) makes the KV cache large and squeezes RAM, but narrowing it to 2048 lightens it accordingly.

Going further down to 1024 makes it a bit faster still:

```bash
OLLAMA_NUM_CTX=1024 ollama run gemma4:e2b
```

---

# It's slow when "thinking" kicks in

Even after narrowing the context to speed things up, once Gemma4 enters its thinking (internal reasoning) mode the wait gets long. For everyday use it feels a touch slow.

I tried `/set nothink`, but unlike DeepSeek or Qwen, the Gemma4 series seems designed so that thinking control doesn't take much effect, and the change was marginal.

A realistic workaround is to instruct "keep your reasoning short" in the system prompt:

```
You are an ultra-lightweight agent running on a Raspberry Pi 5.
Keep your reasoning as short as possible, within 1-2 steps.
Don't think for long; give the conclusion and reply right away.
Reply concisely.
```

---

# When I tried to configure it with a Modelfile, Japanese got garbled

Since `/set system` didn't take well on Gemma4, I tried building a custom model with a Modelfile:

```
FROM gemma4:e2b

SYSTEM """
You are an ultra-lightweight agent running on a Raspberry Pi 5.
...
"""

PARAMETER num_ctx 1024
```

But when I pasted Japanese into nano, it all turned into symbols like `^a^b ^a ^a^=`.

The cause was the locale setting. Pi OS Lite doesn't ship with a Japanese locale by default:

```bash
export LANG=ja_JP.UTF-8
# → bash: warning: setlocale: LC_ALL: cannot change locale (ja_JP.UTF-8): No such file or directory
```

I solved it by generating `ja_JP.UTF-8` via `sudo dpkg-reconfigure locales` → editing `/etc/locale.gen` → `sudo locale-gen`.

```bash
locale
# LANG=ja_JP.UTF-8
# LC_ALL=ja_JP.UTF-8
# ... shows up correctly
```

---

# What I learned today

- On a Pi 5 8GB, **e2b** is the realistic choice for Gemma4 (e4b can't even start due to insufficient RAM)
- Just setting `OLLAMA_NUM_CTX=1024` or `2048` changes the felt speed dramatically
- Thinking can be suppressed with the prompt, but it's not a fundamental fix
- Pi OS Lite doesn't include a UTF-8 Japanese locale by default, so set it up first

Running Gemma4 within the constraints of a 32GB SD card and a Pi 5 8GB is just barely possible. But making it "wait-free for everyday use" makes model choice tough — phi3:mini or gemma2:2b might be faster. That's what I want to try next.
