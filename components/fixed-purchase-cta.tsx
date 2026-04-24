"use client";

import { Badge } from "@/components/ui/badge";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

interface FixedPurchaseCtaProps {
  price: number;
  salePrice: number | null;
  discountRate: number;
  fanzaUrl: string;
  saleEndDate: string | null;
  workId?: number;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function formatSaleEndDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  return `${month}/${day} ${hours}時まで`;
}

export function FixedPurchaseCta({
  price,
  salePrice,
  discountRate,
  fanzaUrl,
  saleEndDate,
  workId,
}: FixedPurchaseCtaProps) {
  const isOnSale = salePrice !== null && salePrice < price;
  const displayPrice = isOnSale ? salePrice : price;

  if (!fanzaUrl) return null;

  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 border-t border-border bg-background p-3 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        {/* 価格情報 */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(price)}
              </span>
            )}
            <span
              className={`text-xl font-bold ${isOnSale ? "text-red-500" : "text-foreground"}`}
            >
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && discountRate > 0 && (
              <Badge variant="sale" className="text-[10px] px-1.5 py-0">
                {discountRate}%OFF
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">FANZAで購入</span>
            {isOnSale && saleEndDate && (
              <span className="text-xs text-red-500 font-medium">
                {formatSaleEndDate(saleEndDate)}
              </span>
            )}
          </div>
        </div>

        {/* 購入ボタン */}
        <a
          href={fanzaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && window.gtag) {
              const match = fanzaUrl.match(/cid=([^/&]+)/);
              window.gtag("event", "fanza_click", {
                content_id: match ? match[1] : undefined,
                work_id: workId,
                source: "fixed_cta",
                transport_type: "beacon",
              });
            }
          }}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] ${
            isOnSale
              ? "bg-gradient-to-r from-orange-500 to-red-500"
              : "bg-gradient-to-r from-pink-500 to-rose-500"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          立ち読みしてみる
        </a>
      </div>
    </div>
  );
}
