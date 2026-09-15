import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 価格をフォーマット
 */
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

/**
 * 評価を星表示用にフォーマット
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return "0.0";
  return rating.toFixed(1);
}

/**
 * 日付をフォーマット (YYYY年MM月DD日)
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 割引率を表示用にフォーマット
 */
export function formatDiscount(rate: number): string {
  return `${rate}%OFF`;
}

/**
 * 購入先アフィリエイトURLを取得
 *
 * DBが各ストアの正しいアフィリエイトURLを持っているため、そのまま使う。
 * URLを持たない作品だけ、FANZAのIDからフォールバックで組み立てる。
 * DLsiteのID（RJxxxx）をFANZAのURLに埋めると404になるため、
 * フォールバックは FANZA の ID 形式（d_xxxxx 等）のときだけ行う。
 */
export function getPurchaseUrl(work: {
  affiliate_url?: string;
  fanza_content_id?: string;
  store?: "fanza" | "dlsite";
}): string | null {
  if (work.affiliate_url) return work.affiliate_url;

  const id = work.fanza_content_id;
  if (!id || work.store === "dlsite" || id.startsWith("RJ")) return null;

  const rawUrl = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=${id}/`;
  return `https://al.dmm.co.jp/?lurl=${encodeURIComponent(rawUrl)}&af_id=monodata-996&ch=link_tool&ch_id=link`;
}
