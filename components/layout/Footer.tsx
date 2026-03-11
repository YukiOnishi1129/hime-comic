import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-foreground/60">
        <p className="mb-2">DJ-ADB - 同人コミック・CGデータベース</p>
        <div className="mb-4 flex justify-center gap-4">
          <Link href="/works" className="hover:text-foreground">
            作品一覧
          </Link>
          <Link href="/sale" className="hover:text-foreground">
            セール
          </Link>
          <Link href="/features/daily" className="hover:text-foreground">
            おすすめ
          </Link>
        </div>
        {/* 姉妹サイト */}
        <div className="mb-4">
          <p className="mb-2 text-xs text-foreground/40">姉妹サイト</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://2d-adb.com" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">
              2D-ADB（二次元ASMR）
            </a>
          </div>
        </div>
        {/* FANZA API クレジット表記 */}
        <p className="mt-4 text-xs text-foreground/40">
          Powered by{" "}
          <a
            href="https://affiliate.dmm.com/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground/60"
          >
            FANZA Webサービス
          </a>
        </p>
      </div>
    </footer>
  );
}
