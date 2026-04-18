import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Heart,
  ThumbsUp,
  ExternalLink,
  Eye,
  FileText,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { SisterSiteBanner } from "@/components/sister-site-banner";
import {
  getGenreFeatures,
  getGenreFeatureBySlug,
  getWorks,
} from "@/lib/parquet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FanzaLink } from "@/components/fanza-link";
import { formatRating, formatPrice, getFanzaUrl } from "@/lib/utils";
import type { Metadata } from "next";
import type { Work, GenreFeatureWork } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = await getGenreFeatureBySlug(slug);

  if (!feature) {
    return { title: "性癖特集が見つかりません" };
  }

  const title = `${feature.name}特集 - おすすめ同人コミックレビュー厳選${feature.works.length}作品 | ひめコミ`;
  const description =
    feature.description ||
    `${feature.name}の人気TL・乙女向け同人コミックを厳選。迷ったらここから選べばハズレなし。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: feature.thumbnail_url ? [feature.thumbnail_url] : [],
    },
  };
}

export async function generateStaticParams() {
  const features = await getGenreFeatures();
  return features.map((feature) => ({
    slug: feature.slug,
  }));
}

export const dynamic = "force-static";

// おすすめカード
function RecommendationCard({
  work,
  allWorks,
  rank,
}: {
  work: GenreFeatureWork;
  allWorks: Work[];
  rank: number;
}) {
  const fullWork = allWorks.find((w) => w.id === work.work_id);
  const isOnSale =
    fullWork?.sale_price !== null &&
    fullWork?.sale_price !== undefined &&
    fullWork.sale_price < fullWork.price;
  const displayPrice = isOnSale ? fullWork!.sale_price! : work.price;
  const discountRate = fullWork?.discount_rate || 0;
  const fanzaUrl = fullWork ? getFanzaUrl(fullWork.fanza_content_id) : "#";

  return (
    <Card className="overflow-hidden border border-border hover:border-primary/50 transition-all">
      <div className="p-4">
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
          {isOnSale && discountRate > 0 && (
            <Badge variant="sale" className="text-xs">
              {discountRate}%OFF
            </Badge>
          )}
        </div>

        <Link href={`/works/${work.work_id}`}>
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted mb-3">
            <img
              src={
                work.thumbnail_url ||
                "https://placehold.co/400x225/f4f4f5/71717a?text=No"
              }
              alt={work.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {work.page_count > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <FileText className="h-3 w-3" />
                {work.page_count}P
              </div>
            )}
          </div>

          <h3 className="text-base font-bold line-clamp-2 text-foreground hover:text-primary transition-colors mb-2">
            {work.title}
          </h3>
        </Link>

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
              {fullWork?.review_count && (
                <span className="text-xs text-muted-foreground">
                  ({fullWork.review_count}件)
                </span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(work.price)}
              </span>
            )}
            <span
              className={`text-lg font-bold ${isOnSale ? "text-red-500" : "text-foreground"}`}
            >
              {formatPrice(displayPrice)}
            </span>
          </div>
        </div>

        {/* おすすめポイント */}
        <div className="mb-3 p-3 bg-pink-500/5 rounded-lg border border-pink-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-3.5 w-3.5 text-pink-500" />
            <span className="text-xs font-bold text-pink-500">
              おすすめポイント
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {work.reason || "人気の作品です"}
          </p>
        </div>

        {/* こんな人におすすめ */}
        <div className="mb-3 p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">
              こんな人におすすめ
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {work.target_audience || "この作品に興味がある人"}
          </p>
        </div>

        <div className="flex gap-2">
          <FanzaLink
            url={fanzaUrl}
            workId={work.work_id}
            source="genre_feature"
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold"
            >
              <Eye className="h-3 w-3 mr-1" />
              試し読み
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </FanzaLink>
          <Link href={`/works/${work.work_id}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold"
            >
              詳細を見る
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default async function GenreFeatureDetailPage({ params }: Props) {
  const { slug } = await params;
  const [feature, allFeatures, allWorks] = await Promise.all([
    getGenreFeatureBySlug(slug),
    getGenreFeatures(),
    getWorks(),
  ]);

  if (!feature) {
    notFound();
  }

  // この特集の作品
  const recommendedWorks = feature.works;

  // 他の性癖特集
  const otherFeatures = allFeatures
    .filter((f) => f.slug !== feature.slug)
    .sort((a, b) => b.work_count - a.work_count)
    .slice(0, 6);

  const formatUpdatedAt = (dateStr?: string) => {
    if (!dateStr) return "不明";
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* パンくずリスト */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/features/genre" className="hover:text-foreground">
            性癖特集
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{feature.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 text-white">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {feature.name}特集
              </h1>
              <p className="text-sm text-muted-foreground">
                {feature.work_count}作品から厳選
              </p>
            </div>
          </div>

          {/* 統計バッジ */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              全{feature.work_count}作品
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              厳選{recommendedWorks.length}作品
            </Badge>
          </div>

          {/* ヘッドライン */}
          <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                今週のおすすめ
              </span>
            </div>
            <p className="text-base font-bold text-foreground">
              {feature.headline ||
                `${feature.name}好き必見の厳選${feature.works.length}作品`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {feature.description ||
                `${feature.name}の作品から迷ったらこれを選べ。`}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatUpdatedAt(feature.created_at)} 更新
            </p>
          </div>
        </div>

        {/* 厳選おすすめ */}
        {recommendedWorks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="h-5 w-5 text-pink-500" />
              <h2 className="text-lg font-bold text-foreground">
                厳選おすすめ
              </h2>
              <Badge variant="secondary" className="text-xs">
                {recommendedWorks.length}作品
              </Badge>
            </div>
            <div className="grid gap-4">
              {recommendedWorks.map((work, index) => (
                <RecommendationCard
                  key={work.work_id}
                  work={work}
                  allWorks={allWorks}
                  rank={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* このジャンルの作品一覧へ */}
        <section className="mb-8">
          <Card className="overflow-hidden border border-orange-500/30 hover:border-orange-500/50 transition-all">
            <Link href={`/tags/${encodeURIComponent(feature.name)}`}>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-orange-500/10 to-orange-500/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-foreground">
                    「{feature.name}」の作品をもっと見る
                  </p>
                  <p className="text-sm text-muted-foreground">
                    全{feature.work_count}作品のタグ一覧ページへ
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-orange-500" />
              </div>
            </Link>
          </Card>
        </section>

        {/* 他の性癖特集 */}
        {otherFeatures.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">
                他の性癖特集
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherFeatures.map((other) => (
                <Link
                  key={other.slug}
                  href={`/features/genre/${other.slug}`}
                >
                  <Card className="overflow-hidden border border-border hover:border-pink-500/50 transition-all">
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={
                          other.thumbnail_url ||
                          "https://placehold.co/200x112/f4f4f5/71717a?text=Genre"
                        }
                        alt={other.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-foreground truncate">
                        {other.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {other.work_count}作品
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/features/genre">
                <Button variant="outline" size="sm">
                  全ての性癖特集を見る
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
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
