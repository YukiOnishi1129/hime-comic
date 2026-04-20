import { Header, Footer } from "@/components/layout";
import { CircleListContent } from "@/components/circle-list-content";
import { FeaturedBanners } from "@/components/featured-banners";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getCirclesWithWorkCount,
  getLatestDailyRecommendation,
  getLatestSaleFeature,
  getWorkById,
  getCircleFeatures,
} from "@/lib/parquet";
import { Palette, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "サークル一覧 | ひめコミ",
  description: "TL・乙女向け同人コミックを手掛けるサークル一覧。お気に入りのサークルを見つけよう。",
  openGraph: {
    title: "サークル一覧 | ひめコミ",
    description: "TL・乙女向け同人コミックを手掛けるサークル一覧。お気に入りのサークルを見つけよう。",
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

export default async function CirclesPage() {
  const [circles, dailyRecommendation, saleFeature, circleFeatures] = await Promise.all([
    getCirclesWithWorkCount(),
    getLatestDailyRecommendation(),
    getLatestSaleFeature(),
    getCircleFeatures(),
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

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* バナー */}
        <FeaturedBanners
          saleThumbnail={saleThumbnail}
          saleMaxDiscountRate={saleFeature?.max_discount_rate}
          saleTargetDate={saleFeature?.target_date}
          recommendationThumbnail={recommendationThumbnail}
          recommendationHeadline={dailyRecommendation?.headline}
        />

        {/* サークル特集への導線 */}
        {circleFeatures.length > 0 && (
          <Link href="/features/circle">
            <Card className="mb-6 overflow-hidden border border-pink-500/30 hover:border-pink-500/50 transition-all">
              {circleFeatures[0]?.thumbnail_url ? (
                <div className="relative aspect-[21/9] overflow-hidden">
                  <img
                    src={circleFeatures[0].thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* 上下グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                  {/* ラベル */}
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-sm font-bold text-white bg-pink-500"
                    style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
                  >
                    サークル特集
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-base font-bold text-white mb-1"
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                        >
                          人気サークルのおすすめ作品を厳選紹介
                        </p>
                        <p
                          className="text-sm text-white/80"
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                        >
                          {circleFeatures.length}サークルを特集中
                        </p>
                      </div>
                      <ChevronRight
                        className="h-6 w-6 text-white shrink-0"
                        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/20 shrink-0">
                    <Palette className="h-6 w-6 text-pink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Palette className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-bold text-pink-500">サークル特集</span>
                      <Badge variant="outline" className="text-xs">
                        {circleFeatures.length}サークル
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      人気サークルのおすすめ作品を厳選紹介
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-pink-500 shrink-0" />
                </div>
              )}
            </Card>
          </Link>
        )}

        <CircleListContent circles={circles} />
      </main>

      <Footer />
    </div>
  );
}
