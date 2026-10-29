import type { Title } from "./data";
import { AVATAR_URLS } from "./data";
const TMDB = "https://media.themoviedb.org/t/p";
export function proxied(url: string): string { return url ? `/api/image?url=${encodeURIComponent(url)}` : ""; }
export function posterUrl(t: Title, size = "w440_and_h660_face"): string { return t.posterPath ? proxied(`${TMDB}/${size}/${t.posterPath}`) : ""; }
export function backdropUrl(t: Title, size = "w1066_and_h600_face"): string { return t.backdropPath ? proxied(`${TMDB}/${size}/${t.backdropPath}`) : ""; }
export function castProfileUrl(path: string, size = "w276_and_h350_face"): string { return path ? proxied(`${TMDB}/${size}/${path}`) : ""; }
export function avatarUrl(idx: number): string { const url = AVATAR_URLS[idx % AVATAR_URLS.length]; return url ? proxied(url) : avatarFallback(idx); }
export function avatarFallback(idx: number, size = 160): string {
  const hue = (idx * 137.5) % 360; const hue2 = (hue + 60) % 360;
  const c1 = `hsl(${hue}, 60%, 42%)`; const c2 = `hsl(${hue2}, 65%, 22%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${size}" height="${size}" rx="${size * 0.5}" fill="url(#a)"/><circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.14}" fill="rgba(255,255,255,0.85)"/><path d="M ${size * 0.2} ${size * 0.86} Q ${size / 2} ${size * 0.52} ${size * 0.8} ${size * 0.86} Z" fill="rgba(255,255,255,0.85)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
export function trailerEmbed(key: string, opts: { autoplay?: boolean; mute?: boolean; controls?: boolean; loop?: boolean } = {}): string {
  if (!key) return ""; const { autoplay = true, mute = true, controls = false, loop = false } = opts;
  const params = new URLSearchParams({ autoplay: autoplay ? "1" : "0", mute: mute ? "1" : "0", controls: controls ? "1" : "0", modestbranding: "1", rel: "0", playsinline: "1", iv_load_policy: "3", enablejsapi: "1" });
  if (loop) params.set("loop", "1");
  return `https://www.youtube-nocookie.com/embed/${key}?${params.toString()}`;
}
