// らぶカル「春のらぶカルフェス 50%OFFクーポン」キャンペーン
// 詳細: らぶカル & FANZA同人 のいずれも購入経験がない方向けの先着クーポン
// - TL/乙女向け: 50%OFF（割引上限1,500円）、先着2,000名、お一人様1度のみ
// - BL: 別途BL用クーポンあり
// - 期限: 2026/05/18 11:59 まで

const FANZA_AFFILIATE_ID = "monodata-996";

// らぶカル TL/乙女向けカテゴリトップ（hime-comic はTL/乙女向け同人コミック専門サイト）
const LOVECUL_TL_LANDING_URL = "https://lovecul.dmm.co.jp/tl/";

// キャンペーン終了日時（JST 2026/05/18 11:59:59 まで有効）
const CAMPAIGN_END = new Date("2026-05-18T11:59:59+09:00");

// キャンペーン全体が現時点で有効か
export function isLoveculCampaignActive(now: Date = new Date()): boolean {
  return now.getTime() <= CAMPAIGN_END.getTime();
}

// アフィリエイトリダイレクト経由のキャンペーン誘導URL（TL/乙女向け）
// ch=toolbar&ch_id=link は DMM公式ツールバーの正規フォーマット
export function getLoveculCampaignAffiliateUrl(): string {
  return `https://al.fanza.co.jp/?lurl=${encodeURIComponent(LOVECUL_TL_LANDING_URL)}&af_id=${FANZA_AFFILIATE_ID}&ch=toolbar&ch_id=link`;
}
