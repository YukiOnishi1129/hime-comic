import { Header, Footer } from "@/components/layout";
import { SearchContent } from "@/components/search-content";
import { FeaturedBanners } from "@/components/featured-banners";
import {
  getLatestDailyRecommendation,
  getLatestSaleFeature,
  getWorkById,
} from "@/lib/parquet";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作品検索",
  description: "TL・乙女向け同人コミック作品を検索。タイトル、作者、サークル、タグで絞り込み。",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "作品検索 | ひめコミ",
    description: "TL・乙女向け同人コミック作品を検索。タイトル、作者、サークル、タグで絞り込み。",
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

export default async function SearchPage() {
  // バナー用データを取得
  const [dailyRecommendation, saleFeature] = await Promise.all([
    getLatestDailyRecommendation(),
    getLatestSaleFeature(),
  ]);

  // サムネイル取得
  const recommendationWork = dailyRecommendation?.works?.[0]?.work_id
    ? await getWorkById(dailyRecommendation.works[0].work_id)
    : null;
  const saleFeatureMainWork = saleFeature?.main_work_id
    ? await getWorkById(saleFeature.main_work_id)
    : null;

  const recommendationThumbnail = recommendationWork?.thumbnail_url || null;
  const saleThumbnail = saleFeatureMainWork?.thumbnail_url || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-4">
        {/* 今日のおすすめ & セール特集バナー */}
        <FeaturedBanners
          saleThumbnail={saleThumbnail}
          saleMaxDiscountRate={saleFeature?.max_discount_rate}
          saleTargetDate={saleFeature?.target_date}
          recommendationThumbnail={recommendationThumbnail}
          recommendationHeadline={dailyRecommendation?.headline}
        />

        <SearchContent />
      </main>

      <Footer />
    </div>
  );
}
