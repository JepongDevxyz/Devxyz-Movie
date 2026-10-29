"use client";
import type { Title, CastMember } from "./data";
interface RecItem { id: number; type: "movie" | "tv"; title: string; year: number; poster: string; }
export async function fetchTitleInfo(type: "movie" | "tv", id: number): Promise<Partial<Title> & { recItems?: RecItem[] }> {
  const res = await fetch(`/api/info/${type}/${id}`);
  if (!res.ok) throw new Error(`info ${res.status}`);
  return (await res.json()).data;
}
const cache = new Map<string, Partial<Title> & { recItems?: RecItem[] }>();
export function getCachedInfo(id: string) { return cache.get(id); }
export function setCachedInfo(id: string, info: Partial<Title> & { recItems?: RecItem[] }) { cache.set(id, info); }
