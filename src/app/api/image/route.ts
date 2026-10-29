import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("https://media.themoviedb.org/")) return new Response("Invalid URL", { status: 400 });
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) return new Response("Fetch failed", { status: res.status });
  const headers = new Headers();
  headers.set("Content-Type", res.headers.get("Content-Type") ?? "image/jpeg");
  headers.set("Cache-Control", "public, max-age=86400");
  return new Response(res.body, { headers });
}
