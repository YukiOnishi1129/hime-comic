import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { WorkCard } from "@/components/work";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { getWorks, getCircleFeatures, getLatestSaleFeature } from "@/lib/parquet";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作品一覧",
  description: "TL・乙女向け同人コミックの作品一覧。ランキング順に表示。",
  alternates: { canonical: "/works/" },
  openGraph: {
    title: "作品一覧 | ひめコミ",
    description: "TL・乙女向け同人コミックの作品一覧。ランキング順に表示。",
    type: "website",
    images: [
      { url: "https://hime-comic.com/ogp/recommendation_ogp.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://hime-comic.com/ogp/recommendation_ogp.png"],
  },
};

export const dynamic = "force-static";

// 表示件数制限
const DISPLAY_LIMIT = 20;

export default async function WorksPage() {
  const [works, circleFeatures, saleFeature] = await Promise.all([
    getWorks(),
    getCircleFeatures(),
    getLatestSaleFeature(),
  ]);

  // セール中の作品数
  const saleCount = works.filter(
    (w) => w.sale_price !== null && w.sale_price < w.price
  ).length;

  // サークル（上位4件）
  const topCircles = circleFeatures.slice(0, 4);

  // ランキング作品（上位DISPLAY_LIMIT件）
  const rankedWorks = works
    .filter((w) => w.ranking !== null)
    .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0))
    .slice(0, DISPLAY_LIMIT);

  // 新着作品（上位DISPLAY_LIMIT件）
  const latestWorks = works.slice(0, DISPLAY_LIMIT);

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { label: "ホーム", href: "/" },
          { label: "作品一覧", href: "/works" },
        ]}
      />
      <ItemListJsonLd
        items={rankedWorks.map((w) => ({
          url: `/works/${w.id}`,
          name: w.title,
          image: w.thumbnail_url || undefined,
        }))}
      />
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* タイトル + 導入文 */}
        <div className="mb-4">
          <h1 className="mb-2 text-2xl font-bold text-foreground">作品一覧</h1>
          <p className="text-sm text-muted-foreground">
            TL・乙女向け同人コミックデータベース - {works.length}作品収録
          </p>
        </div>

        {/* クイックアクセス: セール・人気サークル */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link href="/features/sale">
            <Badge
              variant="sale"
              className="cursor-pointer text-xs hover:opacity-80"
            >
              セール中 ({saleCount})
            </Badge>
          </Link>
          {topCircles.length > 0 && (
            <>
              <span className="text-xs text-muted-foreground">人気サークル:</span>
              {topCircles.map((circle) => (
                <Link
                  key={circle.id}
                  href={`/features/circle/${circle.slug}`}
                >
                  <Badge
                    variant="circle"
                    className="cursor-pointer text-xs hover:opacity-80"
                  >
                    {circle.headline.slice(0, 15)}
                  </Badge>
                </Link>
              ))}
            </>
          )}
        </div>

        {/* ランキング作品 */}
        {rankedWorks.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              人気ランキング ({rankedWorks.length})
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {rankedWorks.map((work, index) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  showRankBadge
                  rank={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* 新着作品 */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            新着作品 ({latestWorks.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {latestWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
