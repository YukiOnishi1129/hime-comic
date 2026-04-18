import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { SaleFilterSort } from "@/components/sale-filter-sort";
import { FeaturedBanners } from "@/components/featured-banners";
import {
  getSaleWorks,
  getLatestSaleFeature,
  getWorkById,
  getLatestDailyRecommendation,
} from "@/lib/parquet";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "セール中の作品一覧 | ひめコミ",
  description: "今お得に買えるTL・乙女向け同人コミック作品をまとめてチェック。割引率・価格順で並び替え可能。",
  openGraph: {
    title: "セール中の作品一覧 | ひめコミ",
    description: "今お得に買えるTL・乙女向け同人コミック作品をまとめてチェック。",
    type: "website",
  },
};

export const dynamic = "force-static";

export default async function SalePage() {
  // セール中の全作品を取得 + バナー用データ
  const [saleWorks, saleFeature, dailyRecommendation] = await Promise.all([
    getSaleWorks(200),
    getLatestSaleFeature(),
    getLatestDailyRecommendation(),
  ]);

  // セール特集のメイン作品のサムネイルを取得
  const saleFeatureMainWork = saleFeature?.main_work_id
    ? await getWorkById(saleFeature.main_work_id)
    : null;

  // おすすめの1位作品のサムネイルを取得
  const recommendationWork = dailyRecommendation?.works?.[0]?.work_id
    ? await getWorkById(dailyRecommendation.works[0].work_id)
    : null;

  // バナー用データ
  const saleThumbnail = saleFeatureMainWork?.thumbnail_url || saleWorks[0]?.thumbnail_url;
  const saleTargetDate = saleFeature?.target_date;
  const recommendationThumbnail = recommendationWork?.thumbnail_url || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-4">
        {/* コンパクトヘッダー */}
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-sale" />
          <h1 className="text-xl font-bold text-foreground">セール中の作品</h1>
          <span className="text-sm text-muted-foreground">
            （{saleWorks.length}件）
          </span>
        </div>

        {/* 今日のセール特集 & 今日のおすすめバナー */}
        <FeaturedBanners
          saleThumbnail={saleThumbnail}
          saleMaxDiscountRate={saleFeature?.max_discount_rate}
          saleTargetDate={saleTargetDate}
          recommendationThumbnail={recommendationThumbnail}
          recommendationHeadline={dailyRecommendation?.headline}
        />

        {/* フィルター・ソート付き作品一覧 */}
        <SaleFilterSort works={saleWorks} />
      </main>

      <Footer />
    </div>
  );
}
