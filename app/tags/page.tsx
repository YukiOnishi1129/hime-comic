import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getWorks } from "@/lib/parquet";

export const metadata: Metadata = {
  title: "タグ一覧 | ひめコミ",
  description: "TL・乙女向け同人コミックのタグ一覧。ジャンルから作品を探せます。",
};

export const dynamic = "force-static";

export default async function TagsPage() {
  const works = await getWorks();

  // タグごとの作品数を収集
  const tagCounts = new Map<string, number>();
  works.forEach((w) => {
    w.genre_tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // 作品数順でソート
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1]);

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
          <span className="text-foreground">タグ一覧</span>
        </nav>

        {/* ヘッダーカード */}
        <Card className="mb-6 border-border">
          <CardContent className="p-5">
            <h1 className="text-xl font-bold text-foreground">タグ一覧</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {sortedTags.length}種類のタグ
            </p>
          </CardContent>
        </Card>

        {/* タグ一覧 */}
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count]) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <Badge
                variant="tag"
                className="cursor-pointer px-3 py-1.5 text-sm hover:opacity-80"
              >
                {tag}
                <span className="ml-1 opacity-70">({count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
