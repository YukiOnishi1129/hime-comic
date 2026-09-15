// 作品データ
export interface Work {
  id: number;
  fanza_content_id: string;
  /** 購入先アフィリエイトURL。FANZA作品はFANZA、DLsite作品はDLsiteを指す */
  affiliate_url: string;
  /** 購入先ストア。計測イベントの出し分けに使う */
  store: "fanza" | "dlsite";
  title: string;
  price: number;
  sale_price: number | null;
  discount_rate: number;
  thumbnail_url: string;
  sample_images: string[] | null;
  circle_id: number;
  circle_name: string;
  author_name: string | null;
  rating: number | null;
  review_count: number | null;
  page_count: number | null;
  ranking: number | null;
  is_posted: number;
  posted_at: string | null;
  x_post_id: string | null;
  sale_end_date: string | null;
  ai_summary: string | null;
  ai_appeal_points: string | null;
  ai_target_audience: string | null;
  ai_recommend_reason: string | null;
  ai_warnings: string | null;
  ai_review: string | null;
  genre_tags: string[] | null;
  created_at?: string;
  updated_at?: string;
}

// サークルデータ
export interface Circle {
  id: number;
  name: string;
  work_count: number;
}

// 特集内の作品（共通）
export interface FeatureWork {
  work_id: number;
  title: string;
  thumbnail_url: string;
  price: number;
  rating: number;
  reason: string;
  target_audience: string;
}

// サークル特集内の作品
export interface CircleFeatureWork extends FeatureWork {
  page_count: number;
}

// サークル特集
export interface CircleFeature {
  id: number;
  circle_id: number;
  circle_name: string;
  slug: string;
  headline: string;
  description: string;
  total_sales: number;
  work_count: number;
  avg_rating: number;
  thumbnail_url: string | null;
  works: CircleFeatureWork[];
  created_at?: string;
}

// 今日のおすすめ内の作品
export interface DailyRecommendationWork extends FeatureWork {
  circle_name: string;
  author_name: string | null;
}

// 今日のおすすめ
export interface DailyRecommendation {
  id: number;
  target_date: string;
  headline: string;
  total_works_count: number;
  works: DailyRecommendationWork[];
  created_at?: string;
}

// ジャンル特集内の作品
export interface GenreFeatureWork extends FeatureWork {
  page_count: number;
}

// ジャンル特集
export interface GenreFeature {
  id: number;
  slug: string;
  name: string;
  headline: string;
  description: string;
  work_count: number;
  thumbnail_url: string | null;
  works: GenreFeatureWork[];
  created_at?: string;
}

// セール特集（2D-ADB形式）
export interface SaleFeature {
  id: number;
  target_date: string;

  // メイン作品
  main_work_id: number | null;
  main_headline: string | null;
  main_reason: string | null;

  // サブ作品1
  sub1_work_id: number | null;
  sub1_one_liner: string | null;

  // サブ作品2
  sub2_work_id: number | null;
  sub2_one_liner: string | null;

  // 横スクロール用リスト
  cheapest_work_ids: number[] | null;
  high_discount_work_ids: number[] | null;
  high_rating_work_ids: number[] | null;

  // 統計
  total_sale_count: number;
  max_discount_rate: number;

  created_at?: string;
  updated_at?: string;
}
