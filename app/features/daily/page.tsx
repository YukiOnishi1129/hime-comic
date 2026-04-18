import Link from "next/link";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import {
  getLatestDailyRecommendation,
  getLatestSaleFeature,
  getWorkById,
  getCircleFeatures,
} from "@/lib/parquet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { DailyRecommendationWork } from "@/types";
import {
  Star,
  FileText,
  Trophy,
  ThumbsUp,
  Users,
  Sparkles,
  ChevronRight,
  Palette,
} from "lucide-react";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const recommendation = await getLatestDailyRecommendation();

  const title = "今日のおすすめ | ひめコミ";
  const description = recommendation?.headline
    ? `${recommendation.headline} - 毎日更新！おすすめのTL・乙女向け同人コミック作品を厳選して紹介。`
    : "毎日更新！おすすめのTL・乙女向け同人コミック作品を厳選して紹介。";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        { url: "https://hime-comic.com/ogp/recommendation_ogp.png", width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://hime-comic.com/ogp/recommendation_ogp.png"],
    },
  };
}

// おすすめカード（2D-ADB形式）
function RecommendationCard({
  work,
  rank,
}: {
  work: DailyRecommendationWork;
  rank: number;
}) {
  return (
    <Card className="overflow-hidden border border-border hover:border-primary/50 transition-all">
      <div className="p-4">
        {/* ランクバッジ */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                rank === 1
                  ? "bg-amber-500 text-white"
                  : rank === 2
                    ? "bg-gray-400 text-white"
                    : rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {rank}
            </div>
            <Badge variant="secondary" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              コミック
            </Badge>
          </div>
        </div>

        <Link href={`/works/${work.work_id}`}>
          {/* サムネイル */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3">
            <img
              src={
                work.thumbnail_url ||
                "https://placehold.co/400x225/f4f4f5/71717a?text=No"
              }
              alt={work.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>

          {/* タイトル */}
          <h3 className="text-base font-bold line-clamp-2 text-foreground hover:text-primary transition-colors mb-2">
            {work.title}
          </h3>
        </Link>

        {/* サークル名 */}
        {work.circle_name && (
          <p className="text-xs text-muted-foreground mb-2 truncate">
            {work.circle_name}
          </p>
        )}

        {/* 評価・価格 */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {work.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(work.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-amber-500">
                {work.rating.toFixed(1)}
              </span>
            </div>
          )}
          <span className="text-lg font-bold text-foreground">
            {formatPrice(work.price)}
          </span>
        </div>

        {/* おすすめ理由 */}
        {work.reason && (
          <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">
                おすすめポイント
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.reason}
            </p>
          </div>
        )}

        {/* こんな人におすすめ */}
        {work.target_audience && (
          <div className="mb-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground">
                こんな人におすすめ
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.target_audience}
            </p>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-2">
          <Link href={`/works/${work.work_id}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-sale hover:bg-sale/90 text-white text-xs font-bold"
            >
              詳細を見る
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default async function DailyRecommendationPage() {
  // データを取得
  const [recommendation, saleFeature, circleFeatures] = await Promise.all([
    getLatestDailyRecommendation(),
    getLatestSaleFeature(),
    getCircleFeatures(),
  ]);

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-muted-foreground">おすすめデータがありません</p>
        </main>
        <Footer />
      </div>
    );
  }

  // セール特集のメイン作品を取得
  const saleFeatureMainWork = saleFeature?.main_work_id
    ? await getWorkById(saleFeature.main_work_id)
    : null;

  const saleThumbnail = saleFeatureMainWork?.thumbnail_url || null;
  const saleTargetDate = saleFeature?.target_date;
  const saleMaxDiscountRate = saleFeature?.max_discount_rate;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* ページヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl font-bold text-foreground">
              {recommendation.headline || "今日のおすすめ"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            迷ったらここから選べばハズレなし。厳選{recommendation.works.length}
            作品。
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            {recommendation.target_date} 更新
          </div>
        </div>

        {/* おすすめ作品リスト */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-pink-500" />
            <h2 className="text-lg font-bold text-foreground">
              迷ったらこれ読んどけ
            </h2>
            <Badge variant="secondary" className="text-xs">
              TOP {recommendation.works.length}
            </Badge>
          </div>
          <div className="grid gap-4">
            {recommendation.works.map((work, index) => (
              <RecommendationCard key={work.work_id} work={work} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* 他のコンテンツへの誘導 */}
        <section className="mt-10 space-y-4">
          {/* セール特集バナー */}
          {saleFeature && (
            <Link href="/features/sale">
              <Card className="overflow-hidden border border-sale/30 hover:border-sale/50 transition-all">
                <div className="flex items-center gap-4 p-4">
                  {saleThumbnail && (
                    <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={saleThumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-sale" />
                      <span className="text-sm font-bold text-sale">
                        {saleTargetDate
                          ? `${new Date(saleTargetDate).getMonth() + 1}/${new Date(saleTargetDate).getDate()}のセール特集`
                          : "セール特集"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">
                      {saleMaxDiscountRate
                        ? `最大${saleMaxDiscountRate}%OFF！`
                        : "厳選おすすめ作品"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-sale shrink-0" />
                </div>
              </Card>
            </Link>
          )}

          {/* サークル特集 */}
          {circleFeatures.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-pink-500" />
                人気サークル特集
              </h3>
              <div className="grid gap-3">
                {circleFeatures.slice(0, 5).map((cf) => (
                  <Link
                    key={cf.slug}
                    href={`/features/circle/${cf.slug}`}
                  >
                    <Card className="overflow-hidden border border-pink-500/30 hover:border-pink-500/50 transition-all">
                      <div className="flex items-center gap-4 p-4">
                        {cf.thumbnail_url && (
                          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={cf.thumbnail_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Palette className="h-3.5 w-3.5 text-pink-500" />
                            <span className="text-sm font-bold text-foreground">
                              {cf.circle_name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {cf.headline || `${cf.circle_name}のおすすめ作品`}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-pink-500 shrink-0" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
