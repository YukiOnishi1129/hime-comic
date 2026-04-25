import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { HorizontalScrollSection } from "@/components/horizontal-scroll-section";
import { HeroSaleBanner } from "@/components/hero-sale-banner";
import { isLoveculCampaignActive, getLoveculCampaignAffiliateUrl } from "@/lib/lovecul-campaign";
import { FeaturedBanners } from "@/components/featured-banners";
import { TrendingChips } from "@/components/trending-chips";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/json-ld";
import { SisterSiteBanner } from "@/components/sister-site-banner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
import { Badge } from "@/components/ui/badge";
import {
  getWorks,
  getLatestDailyRecommendation,
  getLatestSaleFeature,
  getCirclesWithWorkCount,
  getCircleFeatures,
  getGenreFeatures,
} from "@/lib/parquet";

export const dynamic = "force-static";

export default async function Home() {
  const [works, dailyRecommendation, saleFeature, circlesWithCount, circleFeatures, genreFeatures] =
    await Promise.all([
      getWorks(),
      getLatestDailyRecommendation(),
      getLatestSaleFeature(),
      getCirclesWithWorkCount(),
      getCircleFeatures(),
      getGenreFeatures(),
    ]);

  // ランキング作品（上位12件）
  const rankedWorks = works
    .filter((w) => w.ranking !== null)
    .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0))
    .slice(0, 12);

  // セール中作品（12件）
  const saleWorks = works
    .filter((w) => w.sale_price !== null && w.sale_price < w.price)
    .sort((a, b) => b.discount_rate - a.discount_rate)
    .slice(0, 12);

  // 高評価作品（評価4.5以上、12件）
  const highRatedWorks = works
    .filter((w) => w.rating !== null && w.rating >= 4.5)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 12);

  // 爆安コーナー（500円以下）
  const bargainWorks = works
    .filter((w) => {
      const price = w.sale_price ?? w.price;
      return price <= 500;
    })
    .sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
    .slice(0, 12);

  // 新着作品（最新12件）
  const latestWorks = works.slice(0, 12);

  // 人気サークル（作品数順、上位12件）
  const topCircles = circlesWithCount.slice(0, 12);

  // 人気タグ（genre_tagsから収集）
  const tagCounts = new Map<string, number>();
  works.forEach((w) => {
    w.genre_tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const popularTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);

  // バナー用データ
  const recommendationThumbnail = dailyRecommendation?.works?.[0]?.thumbnail_url;
  const saleThumbnail = saleWorks[0]?.thumbnail_url;
  const maxDiscount = Math.max(...saleWorks.map((w) => w.discount_rate || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-4">
        {/* セールバナー（コンパクト） */}
        {/* 春のらぶカルフェス 50%OFFクーポンバナー（〜2026/05/18 11:59まで） */}
        {isLoveculCampaignActive() && (
          <a
            href={getLoveculCampaignAffiliateUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 p-4 text-white shadow-lg transition-transform hover:scale-[1.01]"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold opacity-90">🌸 期間限定 〜5/18 11:59</span>
              <span className="text-lg font-black tracking-wide md:text-xl">
                春のらぶカルフェス 50%OFFクーポン
              </span>
              <span className="text-xs opacity-90">
                初回購入限定・先着2,000名・割引上限1,500円
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold backdrop-blur">
              クーポンを見る →
            </span>
          </a>
        )}

        <HeroSaleBanner maxDiscount={maxDiscount} saleCount={saleWorks.length} />

        {/* 今日のおすすめ & セール特集 & サークル特集カルーセル */}
        <FeaturedBanners
          saleThumbnail={saleThumbnail}
          saleMaxDiscountRate={saleFeature?.max_discount_rate}
          saleTargetDate={saleFeature?.target_date}
          recommendationThumbnail={recommendationThumbnail}
          recommendationHeadline={dailyRecommendation?.headline}
          circleFeatures={circleFeatures}
          genreFeatures={genreFeatures}
        />

        {/* トレンドチップ（コンパクト） */}
        <TrendingChips circles={topCircles} tags={popularTags} />

        {/* 人気ランキング（横スクロール＋金銀銅バッジ） */}
        {rankedWorks.length > 0 && (
          <HorizontalScrollSection
            title="迷ったらこれ読んどけ"
            subtitle="売上ランキング"
            href="/search?sort=rank"
            works={rankedWorks}
            showRankBadge
            rankBadgeColor="emerald"
          />
        )}

        {/* 高評価4.5以上（横スクロール） */}
        {highRatedWorks.length > 0 && (
          <HorizontalScrollSection
            title="ハズレなしの高評価"
            subtitle="評価4.5以上の厳選作品"
            href="/search?sort=rating"
            works={highRatedWorks}
          />
        )}

        {/* 爆安コーナー（横スクロール） */}
        {bargainWorks.length > 0 && (
          <HorizontalScrollSection
            title="ワンコインで買える"
            subtitle="500円以下の掘り出し物"
            href="/search?max=500"
            works={bargainWorks}
          />
        )}

        {/* セール中（横スクロール） */}
        {saleWorks.length > 0 && (
          <HorizontalScrollSection
            title="今がチャンス"
            subtitle="セール中の作品"
            href="/features/sale"
            works={saleWorks}
          />
        )}

        {/* 新着作品（横スクロール） */}
        <HorizontalScrollSection
          title="新着作品"
          subtitle="最新リリース"
          href="/search?sort=new"
          works={latestWorks}
        />

        {/* 人気サークル */}
        {topCircles.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">人気サークル</h2>
              <Link
                href="/circles"
                className="flex items-center gap-1 text-sm text-accent transition-colors hover:text-accent/80"
              >
                もっと見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {topCircles.map((circle) => (
                <Link
                  key={circle.name}
                  href={`/circles/${encodeURIComponent(circle.name)}`}
                >
                  <Badge
                    variant="circle"
                    className="cursor-pointer px-3 py-1.5 text-sm hover:opacity-80"
                  >
                    {circle.name}
                    <span className="ml-1 opacity-70">({circle.workCount})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 人気タグ */}
        {popularTags.length > 0 && (
          <section className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">人気タグ</h2>
              <Link
                href="/tags"
                className="flex items-center gap-1 text-sm text-accent transition-colors hover:text-accent/80"
              >
                もっと見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="tag"
                    className="cursor-pointer px-3 py-1.5 text-sm hover:opacity-80"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 姉妹サイトバナー */}
        <SisterSiteBanner />
      </main>

      <Footer />
    </div>
  );
}
