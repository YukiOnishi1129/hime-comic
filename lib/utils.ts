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
 * FANZAの作品ページURLを生成（アフィリエイトリンク）
 */
export function getFanzaUrl(contentId: string): string {
  const rawUrl = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=${contentId}/`;
  return `https://al.dmm.co.jp/?lurl=${encodeURIComponent(rawUrl)}&af_id=monodata-996&ch=link_tool&ch_id=link`;
}
