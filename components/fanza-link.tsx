"use client";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * URLから作品IDを取り出す。
 * FANZA: ...cid=d_755181/...  /  DLsite: .../id/RJ01491343.html
 */
function extractContentId(url: string): string | undefined {
  const fanza = url.match(/cid=([^/&]+)/);
  if (fanza) return fanza[1];
  const dlsite = url.match(/\/id\/([^/.]+)\.html/);
  return dlsite ? dlsite[1] : undefined;
}

/** URLの形から購入先ストアを判定する */
function detectStore(url: string): "fanza" | "dlsite" {
  return url.includes("dlaf.jp") || url.includes("dlsite.com")
    ? "dlsite"
    : "fanza";
}

interface FanzaLinkProps {
  /** 購入先アフィリエイトURL。null の場合はリンクを描画しない */
  url: string | null;
  workId?: number;
  source?: string;
  /** 購入先ストア。省略時はURLから判定する */
  store?: "fanza" | "dlsite";
  children: React.ReactNode;
  className?: string;
}

export function FanzaLink({
  url,
  workId,
  source,
  store,
  children,
  className,
}: FanzaLinkProps) {
  // 購入先URLがない作品ではリンクを出さない。
  // 以前は "#" を渡していたため、どこにも行かないリンクが表示されていた。
  if (!url) return null;

  const resolvedStore = store ?? detectStore(url);

  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      // 購入先ごとにイベントを分けないと、GA4上でDLsite送客が
      // すべて fanza_click に集計されてしまう。
      window.gtag("event", `${resolvedStore}_click`, {
        content_id: extractContentId(url),
        work_id: workId,
        ...(source ? { source } : {}),
        transport_type: "beacon",
      });
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
