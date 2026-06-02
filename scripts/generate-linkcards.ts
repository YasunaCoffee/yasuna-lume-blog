/**
 * 記事内の ```linkcard フェンスに並んだ URL の OGP（og:title / og:description /
 * og:image / og:site_name）を取得し、キャッシュ JSON に保存する。
 *
 * 実行: deno task linkcards
 *
 * - 走査対象: src/posts/*.md と drafts/*.md（下書きのプレビューでもカードを出せるように）
 * - 出力: ./linkcards.cache.json（コミットして CI ビルドはこれを読むだけ＝ネット不要）
 * - 画像は転載せず、リンク先の OGP 画像 URL をそのまま控える（_config.ts でホットリンク）
 * - 取得に失敗した URL は、既存キャッシュがあればそれを残す（ビルドを壊さない）
 */
import { fromFileUrl, join } from "jsr:@std/path@1.0.8";

const ROOT = fromFileUrl(new URL("../", import.meta.url));
const SCAN_DIRS = [join(ROOT, "src", "posts"), join(ROOT, "drafts")];
const CACHE_PATH = join(ROOT, "linkcards.cache.json");

const UA =
  "Mozilla/5.0 (compatible; yasuna-tech-linkcard/1.0; +https://yasunacoffee.github.io/yasuna-tech/)";

type Card = {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
};

/** ```linkcard ... ``` ブロック内の URL を全 md から集める */
async function collectUrls(): Promise<string[]> {
  const urls = new Set<string>();
  const fence = /```linkcard[^\n]*\n([\s\S]*?)```/gi;
  for (const dir of SCAN_DIRS) {
    let entries: AsyncIterable<Deno.DirEntry>;
    try {
      entries = Deno.readDir(dir);
    } catch {
      continue; // ディレクトリが無ければスキップ
    }
    for await (const e of entries) {
      if (!e.isFile || !e.name.endsWith(".md")) continue;
      const text = await Deno.readTextFile(join(dir, e.name));
      for (const m of text.matchAll(fence)) {
        for (const line of m[1].split(/\r?\n/)) {
          const u = line.trim();
          if (/^https?:\/\//i.test(u)) urls.add(u);
        }
      }
    }
  }
  return [...urls];
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** <meta property|name="key" content="..."> を属性順不同で拾う */
function metaContent(html: string, key: string): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const prop =
      (tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1] ?? "")
        .toLowerCase();
    if (prop !== key.toLowerCase()) continue;
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1];
    if (content != null) return decodeEntities(content);
  }
  return undefined;
}

function titleTag(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]) : undefined;
}

async function fetchCard(url: string): Promise<Card> {
  const res = await fetch(url, {
    headers: { "user-agent": UA, "accept": "text/html,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const finalUrl = res.url || url;
  const html = await res.text();

  const title = metaContent(html, "og:title") ?? titleTag(html) ?? finalUrl;
  const description = metaContent(html, "og:description") ??
    metaContent(html, "description") ?? "";
  const rawImage = metaContent(html, "og:image") ??
    metaContent(html, "twitter:image") ?? "";
  const image = rawImage ? new URL(rawImage, finalUrl).href : "";
  const siteName = metaContent(html, "og:site_name") ??
    new URL(finalUrl).hostname.replace(/^www\./, "");

  return { url, title, description, image, siteName };
}

async function main(): Promise<void> {
  let cache: Record<string, Card> = {};
  try {
    cache = JSON.parse(await Deno.readTextFile(CACHE_PATH));
  } catch {
    // 初回は空から
  }

  const urls = await collectUrls();
  console.log(`linkcard URLs found: ${urls.length}`);

  let ok = 0;
  let kept = 0;
  for (const url of urls) {
    try {
      cache[url] = await fetchCard(url);
      const c = cache[url];
      console.log(
        `  ok  ${url}  →  ${c.title}${c.image ? " 🖼" : " (no image)"}`,
      );
      ok++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (cache[url]) {
        console.warn(`  keep(old) ${url}  (${msg})`);
        kept++;
      } else {
        // 最低限のフォールバックを置く（画像なしカード）
        cache[url] = {
          url,
          title: new URL(url).hostname.replace(/^www\./, ""),
          description: "",
          image: "",
          siteName: new URL(url).hostname.replace(/^www\./, ""),
        };
        console.warn(`  fallback ${url}  (${msg})`);
      }
    }
  }

  await Deno.writeTextFile(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
  console.log(
    `wrote ${CACHE_PATH}  (ok ${ok}, kept ${kept}, total ${urls.length})`,
  );
}

main().catch((e) => {
  console.error(e);
  Deno.exit(1);
});
