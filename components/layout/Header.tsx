"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SearchBox } from "@/components/search-box";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* ロゴ + タグライン */}
        <Link href="/" className="flex shrink-0 flex-col">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary md:text-xl">ひめ</span>
            <span className="text-lg font-bold text-foreground md:text-xl">
              コミ
            </span>
            <span className="rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">PR</span>
          </div>
          <span className="text-[9px] text-muted-foreground md:text-[10px]">
            TL・乙女向け同人コミックまとめ
          </span>
        </Link>

        {/* 検索ボックス */}
        <div className="flex flex-1 justify-center">
          <SearchBox />
        </div>

        {/* ナビゲーション */}
        <nav className="hidden shrink-0 items-center gap-6 lg:flex">
          <NavLink href="/works">作品一覧</NavLink>
          <NavLink href="/circles">サークル</NavLink>
          <NavLink href="/features/genre">ジャンル特集</NavLink>
          <NavLink href="/features/circle">サークル特集</NavLink>
          <NavLink href="/features/daily">おすすめ</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  variant = "default",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "accent";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        variant === "default"
          ? "text-muted-foreground hover:text-foreground"
          : "text-accent hover:text-accent/80"
      )}
    >
      {children}
    </Link>
  );
}
