import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, ChevronRight, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { WorkGridWithLoadMore } from "@/components/work";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getWorks, getGenreFeatures } from "@/lib/parquet";
import type { GenreFeature } from "@/types";

// タグ名 → 性癖特集slugの逆引きマップ（タグ一覧の実際のタグ名に合わせる）
const TAG_TO_SLUG = new Map<string, string>([
  ["フェラ", "fellatio"],
  ["巨乳", "big-breasts"],
  ["おっぱい", "big-breasts"],
  ["寝取り・寝取られ・NTR", "ntr"],
  ["制服", "uniform"],
  ["アナル", "anal"],
  ["処女", "virgin"],
  ["学園もの", "school"],
  ["パイズリ", "paizuri"],
  ["ラブラブ・あまあま", "lovey-dovey"],
  ["性転換・女体化", "gender-bender"],
  ["人妻・主婦", "married-woman"],
  ["ぶっかけ", "bukkake"],
  ["熟女", "mature"],
  ["ビッチ", "bitch"],
  ["野外・露出", "outdoor"],
  ["ハーレム", "harem"],
  ["学生", "student"],
  ["オナニー", "masturbation"],
  ["ベスト・総集編", "best-collection"],
  ["妊娠・孕ませ", "pregnancy"],
  ["お尻・ヒップ", "ass"],
  ["触手", "tentacle"],
]);

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const works = await getWorks();
  const tagWorks = works.filter((w) => w.genre_tags?.includes(decodedName));

  if (tagWorks.length === 0) {
    return {
      title: "タグが見つかりません | ひめコミ",
    };
  }

  const title = `「${decodedName}」タグの作品レビュー一覧（${tagWorks.length}作品） | ひめコミ`;
  const description = `「${decodedName}」タグが付いたTL・乙女向け同人コミック${tagWorks.length}作品を掲載。`;

  return {
    title,
    description,
  };
}

export async function generateStaticParams(): Promise<{ name: string }[]> {
  const works = await getWorks();

  // 全タグを収集
  const tagSet = new Set<string>();
  works.forEach((w) => {
    w.genre_tags?.forEach((tag) => tagSet.add(tag));
  });

  console.log(`[Tag Page] generateStaticParams: ${tagSet.size} tags found`);

  if (tagSet.size === 0) {
    return [{ name: "__placeholder__" }];
  }

  return Array.from(tagSet).map((name) => ({ name }));
}

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function TagDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const [allWorks, genreFeatures] = await Promise.all([
    getWorks(),
    getGenreFeatures(),
  ]);

  // このタグを持つ作品を取得
  const tagWorks = allWorks.filter((w) => w.genre_tags?.includes(decodedName));

  // タグ名に対応するジャンル特集を検索
  let relatedGenreFeature: GenreFeature | undefined;
  const matchSlug = TAG_TO_SLUG.get(decodedName);
  if (matchSlug) {
    relatedGenreFeature = genreFeatures.find((f) => f.slug === matchSlug);
  }

  if (tagWorks.length === 0) {
    notFound();
  }

  // 評価順でソート
  const sortedWorks = tagWorks.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // 関連タグを収集（このタグの作品に付いている他のタグ）
  const relatedTagCounts = new Map<string, number>();
  tagWorks.forEach((w) => {
    w.genre_tags?.forEach((tag) => {
      if (tag !== decodedName) {
        relatedTagCounts.set(tag, (relatedTagCounts.get(tag) || 0) + 1);
      }
    });
  });
  const relatedTags = Array.from(relatedTagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

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
          <Link href="/tags" className="hover:text-foreground">
            タグ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{decodedName}</span>
        </nav>

        {/* ヘッダーカード */}
        <Card className="mb-6 border-border">
          <CardContent className="p-5">
            <h1 className="text-xl font-bold text-foreground">#{decodedName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {sortedWorks.length}作品
            </p>
          </CardContent>
        </Card>

        {/* 関連性癖特集バナー */}
        {relatedGenreFeature && (
          <div className="mb-6">
            <Link href={`/features/genre/${relatedGenreFeature.slug}`}>
              <Card className="overflow-hidden border border-orange-500/30 transition-all hover:border-orange-500/50">
                {relatedGenreFeature.thumbnail_url ? (
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <img
                      src={relatedGenreFeature.thumbnail_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                    <div
                      className="absolute left-3 top-3 rounded-md bg-orange-500 px-2.5 py-1 text-sm font-bold text-white"
                      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
                    >
                      🔥 {relatedGenreFeature.name}特集
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="mb-1 flex items-center gap-2">
                        <Flame
                          className="h-5 w-5 text-orange-400"
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}
                        />
                        <span
                          className="text-base font-bold text-white"
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                        >
                          {relatedGenreFeature.headline}
                        </span>
                      </div>
                      <p
                        className="line-clamp-2 text-sm text-white/90"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                      >
                        {relatedGenreFeature.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500/10 to-orange-500/5 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                      <Sparkles className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-sm font-bold text-orange-500">
                        🔥 {relatedGenreFeature.name}特集
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {relatedGenreFeature.headline}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-orange-500" />
                  </div>
                )}
              </Card>
            </Link>
          </div>
        )}

        {/* 関連タグ */}
        {relatedTags.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-foreground">関連タグ</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map(([tagName, count]) => (
                <Link key={tagName} href={`/tags/${encodeURIComponent(tagName)}`}>
                  <Badge variant="tag" className="cursor-pointer text-sm hover:opacity-80">
                    {tagName}
                    <span className="ml-1 opacity-70">({count})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 作品一覧 */}
        <h2 className="mb-4 text-lg font-bold text-foreground">作品一覧</h2>
        <WorkGridWithLoadMore works={sortedWorks} initialCount={20} loadMoreCount={20} />
      </main>

      <Footer />
    </div>
  );
}
