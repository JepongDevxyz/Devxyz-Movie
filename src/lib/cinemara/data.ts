export type TrackType = "movie" | "series";
export interface CastMember { n: string; ch: string | null; p: string; }
export interface RecItem { id: number; type: "movie" | "tv"; title: string; year: number; poster: string; }
export type Category = "trending-movies" | "trending-series" | "popular" | "top10-movies" | "top10-series" | "latest-movies" | "latest-tv" | "kdrama" | "jdrama" | "cdrama" | "new-on-cinemara";
export interface Title {
  id: string; title: string; year: number; type: TrackType; genres: string[]; rating: string;
  match: number; duration: string; description: string; tagline: string; categories: Category[];
  kids?: boolean; seasons?: number; episodeCount?: number; runtime?: number;
  posterPath: string; backdropPath: string; trailerKey: string; score: number;
  cast: CastMember[]; director: string; recs: string[]; recItems: RecItem[];
}
export const CATEGORY_LABELS: Record<Category, string> = {
  "trending-movies": "Trending Movies", "trending-series": "Trending Series", popular: "Popular",
  "top10-movies": "Top 10 Movies", "top10-series": "Top 10 Series", "latest-movies": "Latest Movies",
  "latest-tv": "Latest TV Shows", kdrama: "Latest K-Dramas", jdrama: "Latest J-Dramas",
  cdrama: "Latest C-Dramas", "new-on-cinemara": "New on Devxyz Movie",
};
const CATALOG: Title[] = [];
export const HERO_ID = "movie-0";
export const HERO_IDS: string[] = ["movie-0"];
export const AVATAR_URLS: string[] = [];
export function getTitle(id: string): Title | undefined { return undefined; }
export function byCategory(cat: Category): Title[] { return []; }
export function byType(type: TrackType): Title[] { return []; }
export function searchCatalog(q: string): Title[] { return []; }
export function homeRowsFor(historyIds: string[]): { label: string; cat?: Category; titles?: Title[]; numbered?: boolean }[] { return []; }
