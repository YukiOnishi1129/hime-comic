import Link from "next/link";
import Image from "next/image";
import { Star, Users } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { getCircleFeatures } from "@/lib/parquet";
import { formatRating } from "@/lib/utils";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サークル特集",
  description: "注目サークルの作品を特集！人気サークルの魅力をご紹介。",
  alternates: { canonical: "/features/circle/" },
  openGraph: {
    title: "サークル特集 | ひめコミ",
    description: "注目サークルの作品を特集！人気サークルの魅力をご紹介。",
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

export default async function CircleFeaturePage() {
  const features = await getCircleFeatures();

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { label: "ホーム", href: "/" },
          { label: "サークル特集", href: "/features/circle" },
        ]}
      />
      <ItemListJsonLd
        items={features.map((f) => ({
          url: `/features/circle/${f.slug}`,
          name: f.headline || f.circle_name || f.slug,
          image: f.thumbnail_url || undefined,
        }))}
      />
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">サークル特集</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">サークル特集</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            注目サークルの作品を特集してご紹介
          </p>
        </div>

        {/* Features list */}
        {features.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">サークル特集データがまだありません</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <Link
                key={feature.id}
                href={`/features/circle/${feature.slug}`}
                className="block overflow-hidden rounded-lg bg-card transition-all hover:ring-2 hover:ring-accent"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-muted">
                  {feature.thumbnail_url && (
                    <Image
                      src={feature.thumbnail_url}
                      alt={feature.headline}
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
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{feature.work_count}作品</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>平均 {formatRating(feature.avg_rating)}</span>
                    </div>
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
