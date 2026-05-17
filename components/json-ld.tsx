import type { Work } from "@/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ProductJsonLdProps {
  work: Work;
}

export function ProductJsonLd({ work }: ProductJsonLdProps) {
  const isOnSale = work.sale_price !== null && work.sale_price < work.price;
  const displayPrice = isOnSale ? work.sale_price! : work.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: work.title,
    description: work.ai_summary || work.ai_appeal_points || `${work.title}の詳細ページ`,
    image: work.thumbnail_url,
    brand: work.circle_name
      ? {
          "@type": "Brand",
          name: work.circle_name,
        }
      : undefined,
    category: "同人漫画",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "JPY",
      lowPrice: displayPrice,
      highPrice: work.price,
      offerCount: 1,
      availability: "https://schema.org/InStock",
    },
    ...(work.rating &&
      work.review_count && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: work.rating.toFixed(1),
          bestRating: "5",
          worstRating: "1",
          reviewCount: work.review_count,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ReviewJsonLd({ work }: ProductJsonLdProps) {
  const reviewBody = work.ai_review || work.ai_appeal_points || work.ai_summary;

  if (!reviewBody) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: work.title,
      ...(work.thumbnail_url && { image: work.thumbnail_url }),
    },
    author: {
      "@type": "Organization",
      name: "ひめコミ",
    },
    reviewBody: reviewBody,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export function BreadcrumbJsonLd({
  items,
  baseUrl = "https://hime-comic.com",
}: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ひめコミ",
    alternateName: "ひめコミ｜TL・乙女向け同人コミックまとめ",
    url: "https://hime-comic.com",
    inLanguage: "ja",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://hime-comic.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ひめコミ",
    url: "https://hime-comic.com",
    logo: "https://hime-comic.com/favicon-256.png",
    description:
      "TL・乙女向け同人コミックの最新ランキング、セール情報、おすすめ作品を毎日更新するキュレーションサイト。",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ItemListJsonLdItem {
  url: string;
  name: string;
  image?: string;
}

interface ItemListJsonLdProps {
  items: ItemListJsonLdItem[];
  baseUrl?: string;
}

export function ItemListJsonLd({
  items,
  baseUrl = "https://hime-comic.com",
}: ItemListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
      name: item.name,
      ...(item.image && { image: item.image }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================================================
// Circle (Organization) JSON-LD（サークルページ用）
// =============================================================================
interface CircleOrganizationJsonLdProps {
  name: string;
  workCount: number;
  mainGenre?: string | null;
  pageUrl: string;
}

export function CircleOrganizationJsonLd({
  name,
  workCount,
  mainGenre,
  pageUrl,
}: CircleOrganizationJsonLdProps) {
  const genreText = mainGenre ? `（${mainGenre}）` : "";
  const description = `同人サークル「${name}」${genreText}の作品${workCount}件をまとめたページ。代表作・人気作・セール情報をひめコミ編集部が整理しています。`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: pageUrl,
    description,
    additionalType: "https://schema.org/CreativeWork",
  };

  if (mainGenre) {
    jsonLd.knowsAbout = [mainGenre, "TL同人コミック", "乙女向け同人コミック"];
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// =============================================================================
// Article JSON-LD（特集ページ用 / 編集部記事として明示）
// =============================================================================
interface ArticleJsonLdProps {
  headline: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  datePublished?: string;
}

function getBuildDateIso(): string {
  return new Date().toISOString();
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  imageUrl,
  datePublished,
}: ArticleJsonLdProps) {
  const buildDate = getBuildDateIso();
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: headline.slice(0, 110),
    description,
    url,
    inLanguage: "ja",
    datePublished: datePublished ?? buildDate,
    dateModified: buildDate,
    author: {
      "@type": "Organization",
      name: "ひめコミ編集部",
      url: "https://hime-comic.com/editorial/",
    },
    publisher: {
      "@type": "Organization",
      name: "ひめコミ",
      url: "https://hime-comic.com",
      logo: {
        "@type": "ImageObject",
        url: "https://hime-comic.com/favicon-256.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (imageUrl) {
    jsonLd.image = imageUrl;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
