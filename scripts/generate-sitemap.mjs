/**
 * サイトマップ生成スクリプト
 * prebuildで生成したJSONキャッシュからデータを取得
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://hime-comic.com";

function loadJson(filename) {
  const CACHE_DIR = join(__dirname, "../.cache/data");
  const path = join(CACHE_DIR, filename);
  if (!existsSync(path)) {
    console.warn(`Warning: ${filename} not found, using empty array`);
    return [];
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

async function main() {
  console.log("Loading data from prebuild cache...");

  const works = loadJson("works.json");
  const circles = loadJson("circles.json");
  const genreFeatures = loadJson("genre_features.json");
  const circleFeatures = loadJson("circle_features.json");

  // 利用可能な作品のみ
  const availableWorks = works.filter((w) => w.is_available !== false);

  // 作品ID一覧
  const workIds = availableWorks.map((w) => w.id);

  // タグ一覧
  const tagNames = new Set();
  for (const work of availableWorks) {
    if (work.ai_tags) {
      for (const tag of work.ai_tags) {
        tagNames.add(tag);
      }
    }
  }

  // サークル一覧（作品があるもののみ）
  const circleIdsWithWorks = new Set(
    availableWorks.map((w) => w.circle_id).filter((id) => id !== null)
  );
  const circleNames = circles
    .filter((c) => circleIdsWithWorks.has(c.id))
    .map((c) => c.name);

  console.log(
    `[Sitemap] Works: ${workIds.length}, Tags: ${tagNames.size}, Circles: ${circleNames.length}`
  );

  const today = new Date().toISOString().split("T")[0];

  // XMLを生成
  const urls = [];

  // 静的ページ
  const staticPages = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "/works/", priority: "0.9", changefreq: "daily" },
    { path: "/sale/", priority: "0.9", changefreq: "daily" },
    { path: "/features/daily/", priority: "0.8", changefreq: "daily" },
    { path: "/features/sale/", priority: "0.8", changefreq: "daily" },
    { path: "/features/genre/", priority: "0.8", changefreq: "weekly" },
    { path: "/features/circle/", priority: "0.8", changefreq: "weekly" },
    { path: "/search/", priority: "0.7", changefreq: "weekly" },
    { path: "/tags/", priority: "0.7", changefreq: "weekly" },
    { path: "/circles/", priority: "0.7", changefreq: "weekly" },
  ];

  for (const page of staticPages) {
    urls.push(`
    <url>
      <loc>${BASE_URL}${page.path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`);
  }

  // 作品ページ
  for (const id of workIds) {
    urls.push(`
    <url>
      <loc>${BASE_URL}/works/${id}/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`);
  }

  // タグページ
  for (const name of tagNames) {
    urls.push(`
    <url>
      <loc>${BASE_URL}/tags/${encodeURIComponent(name)}/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`);
  }

  // サークルページ
  for (const name of circleNames) {
    urls.push(`
    <url>
      <loc>${BASE_URL}/circles/${encodeURIComponent(name)}/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`);
  }

  // ジャンル特集ページ
  for (const feature of genreFeatures) {
    if (feature.slug) {
      urls.push(`
    <url>
      <loc>${BASE_URL}/features/genre/${encodeURIComponent(feature.slug)}/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`);
    }
  }

  // サークル特集ページ
  for (const feature of circleFeatures) {
    if (feature.slug) {
      urls.push(`
    <url>
      <loc>${BASE_URL}/features/circle/${encodeURIComponent(feature.slug)}/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>
`;

  writeFileSync("public/sitemap.xml", sitemap);
  console.log(`[Sitemap] Generated with ${urls.length} URLs`);
}

main().catch(console.error);
