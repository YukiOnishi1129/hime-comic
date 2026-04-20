"use client";

export function SisterSiteBanner() {
  const handleClick = () => {
    window.gtag?.("event", "sister_site_click_to_tl_toroama", {
      source_page: window.location.pathname,
    });
  };

  return (
    <section className="mt-10 mb-4">
      <a
        href="https://tl-toroama.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all"
        onClick={handleClick}
      >
        <div className="relative aspect-[1200/630] w-full">
          <img
            src="https://tl-toroama.com/ogp/recommendation_ogp.png"
            alt="とろあま｜女性向けASMR・TL・乙女ゲームの厳選おすすめ作品"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-card p-3 text-center">
          <p className="text-sm font-bold text-foreground">
            姉妹サイト「とろあま」もチェック！
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            女性向けASMR・TL・乙女ゲームのおすすめランキング・セール情報を毎日更新中
          </p>
        </div>
      </a>
    </section>
  );
}
