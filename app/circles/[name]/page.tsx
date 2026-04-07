import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { WorkGridWithLoadMore } from "@/components/work";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getWorksByCircleName, getAllCircleNames, getCircleFeatureByName } from "@/lib/parquet";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const works = await getWorksByCircleName(name);

  if (works.length === 0) {
    return {
      title: "サークルが見つかりません | DJ-ADB",
    };
  }

  const title = `${decodedName}の作品レビュー一覧（${works.length}作品） | DJ-ADB`;
  const description = `サークル「${decodedName}」の同人コミック・CG ${works.length}作品を掲載。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const names = await getAllCircleNames();
  return names.map((name) => ({
    name: name,
  }));
}

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function CircleDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const [works, circleFeature] = await Promise.all([
    getWorksByCircleName(name),
    getCircleFeatureByName(decodedName),
  ]);

  if (works.length === 0) {
    notFound();
  }

  // 評価順にソート
  const sortedWorks = [...works].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // セール中の作品数
  const saleWorksCount = works.filter((w) => w.sale_price !== null && w.sale_price < w.price).length;

  // 平均評価
  const ratedWorks = works.filter((w) => w.rating !== null);
  const avgRating = ratedWorks.length > 0
    ? ratedWorks.reduce((sum, w) => sum + (w.rating ?? 0), 0) / ratedWorks.length
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/circles" className="hover:text-foreground">
            サークル一覧
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{decodedName}</span>
        </nav>

        {/* ヘッダーカード */}
        <Card className="mb-6 border-border">
          <CardContent className="p-5">
            <h1 className="text-xl font-bold text-foreground">
              {decodedName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {works.length}作品
            </p>
          </CardContent>
        </Card>

        {/* サークル特集バナー */}
        {circleFeature && (
          <div className="mb-8">
            <Link href={`/features/circle/${circleFeature.slug}`}>
              <Card className="overflow-hidden border border-pink-500/30 hover:border-pink-500/50 transition-all">
                {circleFeature.thumbnail_url ? (
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <img
                      src={circleFeature.thumbnail_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-sm font-bold text-white bg-pink-500"
                      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
                    >
                      🎨 {circleFeature.circle_name}特集
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-base font-bold text-white mb-1"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                          >
                            {circleFeature.headline || `${circleFeature.circle_name}ファン必見の厳選${circleFeature.work_count}作品`}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-white/80" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                            {avgRating && (
                              <span>★ 平均{avgRating.toFixed(1)}</span>
                            )}
                            {saleWorksCount > 0 && (
                              <span className="text-orange-300">🔥 {saleWorksCount}作品セール中</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className="h-6 w-6 text-white shrink-0"
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-500/10 to-pink-500/5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/20 shrink-0">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="sale" className="text-xs">
                          特集ページ
                        </Badge>
                        <span className="text-sm font-bold text-foreground">
                          {circleFeature.circle_name}特集
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {circleFeature.headline || `厳選${circleFeature.work_count}作品をチェック`}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-pink-500 shrink-0" />
                  </div>
                )}
              </Card>
            </Link>
          </div>
        )}

        {/* 作品一覧 */}
        <h2 className="mb-4 text-lg font-bold text-foreground">作品一覧</h2>
        <WorkGridWithLoadMore works={sortedWorks} initialCount={20} loadMoreCount={20} />
      </main>

      <Footer />
    </div>
  );
}
