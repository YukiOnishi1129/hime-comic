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

function extractContentId(url: string): string | undefined {
  const match = url.match(/cid=([^/&]+)/);
  return match ? match[1] : undefined;
}

interface FanzaLinkProps {
  url: string;
  workId?: number;
  source?: string;
  children: React.ReactNode;
  className?: string;
}

export function FanzaLink({
  url,
  workId,
  source,
  children,
  className,
}: FanzaLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      const contentId = extractContentId(url);
      window.gtag("event", "fanza_click", {
        content_id: contentId,
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
