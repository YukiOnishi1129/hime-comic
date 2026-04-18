import Link from "next/link";
import Image from "next/image";
import { Heart, BookOpen } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { getGenreFeatures } from "@/lib/parquet";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "性癖特集",
  description:
    "性癖別のTL・乙女向け同人コミックを厳選して特集。フェラ、巨乳、NTR、制服など人気ジャンルのおすすめ作品をご紹介。",
};

export const dynamic = "force-static";

export default async function GenreFeaturePage() {
  const features = await getGenreFeatures();

  // work_count降順でソート
  const sortedFeatures = [...features].sort(
    (a, b) => b.work_count - a.work_count
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">性癖特集</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">性癖特集</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            性癖別に厳選したTL・乙女向け同人コミックをご紹介
          </p>
        </div>

        {/* Features list */}
        {sortedFeatures.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              性癖特集データがまだありません
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {sortedFeatures.map((feature) => (
              <Link
                key={feature.id}
                href={`/features/genre/${feature.slug}`}
                className="block overflow-hidden rounded-lg bg-card transition-all hover:ring-2 hover:ring-accent"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-muted">
                  {feature.thumbnail_url && (
                    <Image
                      src={feature.thumbnail_url}
                      alt={feature.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="line-clamp-1 text-lg font-bold text-foreground">
                      {feature.headline}
                    </h2>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-bold text-foreground">
                      {feature.name}特集
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{feature.work_count}作品</span>
                    </div>
                    <span>厳選{feature.works.length}作品を紹介</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
