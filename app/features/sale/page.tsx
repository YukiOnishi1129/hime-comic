import Link from "next/link";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import {
  getLatestSaleFeature,
  getWorkById,
  getWorksByIds,
  getCircleFeatures,
} from "@/lib/parquet";
import { WorkCard } from "@/components/work";
import { FanzaLink } from "@/components/fanza-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, formatDate, getFanzaUrl } from "@/lib/utils";
import type { Work } from "@/types";
import {
  Flame,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Sparkles,
  FileText,
  Play,
  ExternalLink,
  Palette,
} from "lucide-react";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const feature = await getLatestSaleFeature();

  const title = "今日のセール特集 | ひめコミ";
  const description = feature?.main_headline
    ? `${feature.main_headline} - セール中のおすすめ作品を厳選。迷ったらここから選べばハズレなし。`
    : "セール中のおすすめ作品を厳選。迷ったらここから選べばハズレなし。";

  // メイン作品のサムネイルをOGP画像に使用
  let ogpImageUrl: string | undefined;
  if (feature?.main_work_id) {
    const mainWork = await getWorkById(feature.main_work_id);
    ogpImageUrl = mainWork?.thumbnail_url || undefined;
  }

  return {
    title,
    description,
    alternates: { canonical: "/features/sale/" },
    openGraph: {
      title,
      description,
      images: ogpImageUrl ? [{ url: ogpImageUrl, width: 1200, height: 630 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogpImageUrl ? [ogpImageUrl] : [],
    },
  };
}

// セール残り時間を計算
function getTimeRemaining(endDate: string | null): string | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "終了間近";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `残り${days}日`;
  return `残り${hours}時間`;
}

// CTAボタンの文言を生成
function getCTAText(discountRate: number | null): string {
  if (!discountRate) return "詳細を見る";
  if (discountRate >= 50) return `半額以下で手に入れる`;
  return `${discountRate}%OFFで手に入れる`;
}

// メインフォーカスカード（縦積み・大きいサムネ）
function MainFocusCard({
  work,
  headline,
  reason,
}: {
  work: Work;
  headline: string | null;
  reason: string | null;
}) {
  const isOnSale = work.sale_price !== null && work.sale_price < work.price;
  const displayPrice = isOnSale ? work.sale_price! : work.price;
  const timeRemaining = getTimeRemaining(work.sale_end_date);
  const fanzaUrl = getFanzaUrl(work.fanza_content_id);

  return (
    <Card className="overflow-hidden border-2 border-sale/50 bg-gradient-to-b from-sale/5 to-transparent">
      <div className="p-4 sm:p-6">
        {/* ヘッドライン */}
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-6 w-6 text-sale" />
          <h2 className="text-lg sm:text-xl font-bold text-sale">
            {headline || "今日これ買っとけ"}
          </h2>
        </div>

        {/* 大きいサムネイル（横幅いっぱい） */}
        <Link href={`/works/${work.id}`}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-4">
            <img
              src={
                work.thumbnail_url ||
                "https://placehold.co/800x450/f4f4f5/71717a?text=No+Image"
              }
              alt={work.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {work.discount_rate > 0 && (
              <Badge
                variant="sale"
                className="absolute top-3 left-3 text-lg px-4 py-1.5"
              >
                {work.discount_rate}%OFF
              </Badge>
            )}
            {/* カテゴリ・スペック */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <FileText className="h-3 w-3 mr-1" />
                コミック
              </Badge>
              {work.page_count && (
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {work.page_count}P
                </Badge>
              )}
            </div>
          </div>
        </Link>

        {/* タイトル */}
        <Link href={`/works/${work.id}`}>
          <h3 className="text-lg sm:text-xl font-bold text-foreground hover:text-sale transition-colors mb-2">
            {work.title}
          </h3>
        </Link>

        {/* 評価・価格・残り時間 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* 評価 */}
          {work.rating && work.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(work.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-amber-500">
                {work.rating.toFixed(1)}
              </span>
              {work.review_count && (
                <span className="text-xs text-muted-foreground">
                  ({work.review_count}件)
                </span>
              )}
            </div>
          )}

          {/* 価格 */}
          <div className="flex items-baseline gap-2">
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(work.price)}
              </span>
            )}
            <span className="text-2xl font-bold text-sale">
              {formatPrice(displayPrice)}
            </span>
          </div>

          {/* 残り時間 */}
          {timeRemaining && (
            <div className="flex items-center gap-1 text-orange-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{timeRemaining}</span>
            </div>
          )}
        </div>

        {/* ここがヤバい */}
        {(work.ai_appeal_points || reason) && (
          <div className="mb-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-sale" />
              <span className="text-sm font-bold text-sale">
                ここがヤバい
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.ai_appeal_points || reason}
            </p>
          </div>
        )}

        {/* こんな人は見逃すな */}
        {work.ai_target_audience && (
          <div className="mb-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                こんな人は見逃すな
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.ai_target_audience}
            </p>
          </div>
        )}

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 試し読みボタン */}
          <FanzaLink
            url={fanzaUrl}
            workId={work.id}
            source="sale_main"
            className="flex-1"
          >
            <Button variant="outline" className="w-full font-bold">
              <Play className="h-4 w-4 mr-2" />
              試し読み
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </FanzaLink>
          {/* 購入ボタン */}
          <Link href={`/works/${work.id}`} className="flex-1">
            <Button className="w-full bg-sale hover:bg-sale/90 text-white text-base font-bold py-6">
              {getCTAText(work.discount_rate)}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

// サブカード
function SubCard({
  work,
  oneLiner,
}: {
  work: Work;
  oneLiner: string | null;
}) {
  const isOnSale = work.sale_price !== null && work.sale_price < work.price;
  const displayPrice = isOnSale ? work.sale_price! : work.price;
  const timeRemaining = getTimeRemaining(work.sale_end_date);
  const fanzaUrl = getFanzaUrl(work.fanza_content_id);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-border">
      <div className="p-4">
        {/* カテゴリラベル */}
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-pink-500" />
          <Badge variant="secondary" className="text-xs">
            おすすめコミック
          </Badge>
        </div>

        <Link href={`/works/${work.id}`}>
          {/* 大きめサムネ */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3">
            <img
              src={
                work.thumbnail_url ||
                "https://placehold.co/400x225/f4f4f5/71717a?text=No"
              }
              alt={work.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {work.discount_rate > 0 && (
              <Badge variant="sale" className="absolute top-2 left-2 text-sm px-2 py-1">
                {work.discount_rate}%OFF
              </Badge>
            )}
            {/* スペック */}
            {work.page_count && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {work.page_count}P
              </div>
            )}
          </div>

          {/* タイトル */}
          <h4 className="text-base font-bold line-clamp-2 text-foreground hover:text-sale transition-colors mb-2">
            {work.title}
          </h4>
        </Link>

        {/* 評価・価格・残り時間 */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* 評価 */}
          {work.rating && work.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(work.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-500">
                {work.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* 価格 */}
          <div className="flex items-baseline gap-1">
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(work.price)}
              </span>
            )}
            <span className="text-lg font-bold text-sale">
              {formatPrice(displayPrice)}
            </span>
          </div>

          {/* 残り時間 */}
          {timeRemaining && (
            <span className="text-xs text-orange-500 font-medium">
              {timeRemaining}
            </span>
          )}
        </div>

        {/* ここがヤバい */}
        {(work.ai_appeal_points || oneLiner) && (
          <div className="mb-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3 w-3 text-sale" />
              <span className="text-xs font-bold text-sale">ここがヤバい</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {work.ai_appeal_points || oneLiner}
            </p>
          </div>
        )}

        {/* こんな人は見逃すな */}
        {work.ai_target_audience && (
          <div className="mb-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-primary">こんな人は見逃すな</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {work.ai_target_audience}
            </p>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-2">
          <FanzaLink
            url={fanzaUrl}
            workId={work.id}
            source="sale_sub"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full text-xs font-bold">
              <Play className="h-3 w-3 mr-1" />
              試し読み
            </Button>
          </FanzaLink>
          <Link href={`/works/${work.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-sale hover:bg-sale/90 text-white text-xs font-bold">
              {getCTAText(work.discount_rate)}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

// 横スクロールセクション
function HorizontalScrollSection({
  title,
  icon: Icon,
  works,
}: {
  title: string;
  icon: typeof Flame;
  works: Work[];
}) {
  if (works.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-sale" />
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {works.map((work) => (
            <div key={work.id} className="w-[200px] flex-shrink-0">
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 追従CTA（モバイル）
function FixedCTA({ work }: { work: Work }) {
  const displayPrice = work.sale_price ?? work.price;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border p-3 sm:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{work.title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-sale">
              {formatPrice(displayPrice)}
            </span>
            {work.discount_rate > 0 && (
              <Badge variant="sale" className="text-xs">
                {work.discount_rate}%OFF
              </Badge>
            )}
          </div>
        </div>
        <Link href={`/works/${work.id}`}>
          <Button className="bg-sale hover:bg-sale/90 text-white whitespace-nowrap">
            {getCTAText(work.discount_rate)}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function SaleTokushuPage() {
  // 特集データを取得
  const [feature, circleFeatures] = await Promise.all([
    getLatestSaleFeature(),
    getCircleFeatures(),
  ]);

  if (!feature) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-muted-foreground">特集データがありません</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 作品データを取得
  const [mainWork, sub1Work, sub2Work, cheapestWorks, highDiscountWorks, highRatingWorks] = await Promise.all([
    feature.main_work_id ? getWorkById(feature.main_work_id) : Promise.resolve(undefined),
    feature.sub1_work_id ? getWorkById(feature.sub1_work_id) : Promise.resolve(undefined),
    feature.sub2_work_id ? getWorkById(feature.sub2_work_id) : Promise.resolve(undefined),
    getWorksByIds(feature.cheapest_work_ids || []),
    getWorksByIds(feature.high_discount_work_ids || []),
    getWorksByIds(feature.high_rating_work_ids || []),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* ページヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sale" />
            <h1 className="text-lg font-bold text-foreground">
              今日のセール特集
            </h1>
          </div>
          <div className="text-xs text-muted-foreground">
            {feature.target_date}更新
          </div>
        </div>

        {/* メインフォーカス */}
        {mainWork && (
          <MainFocusCard
            work={mainWork}
            headline={feature.main_headline}
            reason={feature.main_reason}
          />
        )}

        {/* サブ作品 */}
        {(sub1Work || sub2Work) && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-sale" />
              <h2 className="text-lg font-bold text-foreground">
                他のおすすめ作品
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {sub1Work && (
                <SubCard
                  work={sub1Work}
                  oneLiner={feature.sub1_one_liner}
                />
              )}
              {sub2Work && (
                <SubCard
                  work={sub2Work}
                  oneLiner={feature.sub2_one_liner}
                />
              )}
            </div>
          </div>
        )}

        {/* セール統計 → 全部見る */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-sale" />
              <span className="font-bold text-foreground">
                {feature.total_sale_count}作品がセール中
              </span>
            </div>
            <Link href="/search?sale=true">
              <Button variant="outline" size="sm">
                全部見る
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="text-sale font-medium">
              最大{feature.max_discount_rate}%OFF
            </span>
          </div>
        </div>

        {/* 横スクロールセクション */}
        <HorizontalScrollSection
          title="最安値TOP"
          icon={Zap}
          works={cheapestWorks}
        />

        <HorizontalScrollSection
          title="高割引率（70%OFF以上）"
          icon={Flame}
          works={highDiscountWorks}
        />

        <HorizontalScrollSection
          title="高評価（4.5以上）"
          icon={Star}
          works={highRatingWorks}
        />

        {/* サークル特集 */}
        {circleFeatures.length > 0 && (
          <section className="mt-10 space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Palette className="h-4 w-4 text-pink-500" />
              人気サークル特集
            </h3>
            <div className="grid gap-3">
              {circleFeatures.slice(0, 5).map((cf) => (
                <Link key={cf.slug} href={`/features/circle/${cf.slug}`}>
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
                          <span className="text-sm font-bold text-foreground">{cf.circle_name}</span>
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
          </section>
        )}
      </main>

      <Footer />

      {/* 追従CTA（モバイル） */}
      {mainWork && <FixedCTA work={mainWork} />}
    </div>
  );
}
