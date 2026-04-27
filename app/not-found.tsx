import Link from "next/link";
import { Home, Search, TrendingUp, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは削除されたか、URLが間違っている可能性があります。トップページや人気ランキング・特集ページから作品を探してください。",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-pink-500">404</h1>
          <p className="mt-4 text-xl font-bold text-foreground">
            ページが見つかりませんでした
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            お探しのページは削除されたか、URLが間違っている可能性があります。
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-600"
          >
            <Home className="h-4 w-4" />
            トップページへ戻る
          </Link>
        </div>

        {/* 行き先候補（離脱防止） */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-foreground">こちらから探してみてください</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/works">
              <Card className="hover:border-pink-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <TrendingUp className="h-6 w-6 text-pink-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">作品ランキング</div>
                    <div className="text-xs text-muted-foreground">人気のTL同人コミック</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/sale">
              <Card className="hover:border-orange-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <Sparkles className="h-6 w-6 text-orange-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">セール中の作品</div>
                    <div className="text-xs text-muted-foreground">お得に買える作品をチェック</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/circles">
              <Card className="hover:border-purple-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="text-2xl shrink-0">🎨</span>
                  <div>
                    <div className="text-sm font-bold text-foreground">サークル一覧</div>
                    <div className="text-xs text-muted-foreground">人気サークルから探す</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tags">
              <Card className="hover:border-blue-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <Search className="h-6 w-6 text-blue-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">ジャンル・タグ</div>
                    <div className="text-xs text-muted-foreground">ジャンル別に探す</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* 特集ページへの誘導 */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-foreground">人気の特集</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Link href="/features/daily">
              <Card className="hover:border-pink-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">📅 今日のおすすめ</div>
                  <div className="mt-1 text-xs text-muted-foreground">毎日更新の厳選作品</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/features/sale">
              <Card className="hover:border-orange-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">🔥 セール特集</div>
                  <div className="mt-1 text-xs text-muted-foreground">今がチャンスのお得な作品</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/features/genre">
              <Card className="hover:border-purple-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">🎯 ジャンル特集</div>
                  <div className="mt-1 text-xs text-muted-foreground">溺愛・年上・幼なじみなど</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
