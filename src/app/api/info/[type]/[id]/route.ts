import { NextRequest, NextResponse } from "next/server";
export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  if (!["movie", "tv"].includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  return NextResponse.json({ data: { id: numId, type, title: `Title ${numId}`, year: 2024, runtime: 120, seasons: null, episodes: null, genres: [], tagline: "", overview: "", score: 7.5, cert: "TV-14", poster: "", backdrop: "", trailer: "", cast: [], director: "", recs: [] } });
}
