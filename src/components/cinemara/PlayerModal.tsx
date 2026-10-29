"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, RefreshCw, Server, Tv } from "lucide-react";
import type { Title } from "@/lib/cinemara/data";
import { recordWatch } from "@/lib/cinemara/store";
import { SOURCES } from "@/lib/cinemara/sources";
interface Props { title: Title; episode?: number; profileId: string | null; onBack: () => void; }
function parseId(id: string): { type: "movie" | "tv"; numId: number } { const [type, numId] = id.split("-"); return { type: type === "tv" ? "tv" : "movie", numId: Number(numId) }; }
export default function WatchView({ title: initial, episode, profileId, onBack }: Props) {
  const seeded = useRef(false);
  const [title, setTitle] = useState<Title>(initial);
  const [prevInitial, setPrevInitial] = useState<Title>(initial);
  if (prevInitial !== initial) { setPrevInitial(initial); setTitle(initial); }
  const { type, numId } = parseId(title.id);
  const totalSeasons = title.seasons ?? 1;
  const totalEpisodes = title.episodeCount ?? 12;
  const [season, setSeason] = useState(1);
  const [ep, setEp] = useState(episode ?? 1);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [epOpen, setEpOpen] = useState(false);
  const [sourceIdx, setSourceIdx] = useState(0);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  useEffect(() => { if (seeded.current) return; seeded.current = true; const progress = 18 + Math.floor(Math.random() * 40); recordWatch(profileId, title.id, progress, ep); }, [profileId, title.id, ep]);
  const activeIdx = useMemo(() => { for (let i = 0; i < SOURCES.length; i++) { const idx = (sourceIdx + i) % SOURCES.length; if (!failed.has(idx)) return idx; } return sourceIdx; }, [sourceIdx, failed]);
  const src = SOURCES[activeIdx];
  const embedUrl = src.build(type, numId, season, ep);
  const handleIframeError = () => { setFailed((f) => { const next = new Set(f); next.add(activeIdx); return next; }); setIframeKey((k) => k + 1); };
  const label = type === "tv" ? `S${season}:E${ep}` : "Feature";
  const epList = useMemo(() => Array.from({ length: Math.min(totalEpisodes, 60) }, (_, i) => i + 1), [totalEpisodes]);
  return (
    <div className="fixed inset-0 z-[60] bg-black" role="dialog" aria-modal="true" aria-label={`Playing ${title.title}`} style={{ backgroundImage: "radial-gradient(80% 60% at 20% 10%, #0d2226 0%, #06141a 40%, #02070a 100%)" }}>
      {embedUrl ? (
        <iframe key={`${src.key}-${iframeKey}`} src={embedUrl} title={`${title.title} player`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="origin" className="absolute inset-0 h-full w-full" onError={handleIframeError} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center"><p className="text-2xl font-bold text-white">{title.title}</p><p className="text-sm text-neutral-400">No playable source available right now.</p></div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent px-5 py-5">
        <button onClick={onBack} aria-label="Go back" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"><ArrowLeft className="h-6 w-6" /></button>
        <span className="pointer-events-auto rounded bg-black/50 px-3 py-1 text-xs text-neutral-300">{title.title} · {label} · {src.label}</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-10">
        <div className="pointer-events-auto relative">
          <button onClick={() => { setSourceOpen((v) => !v); setSeasonOpen(false); setEpOpen(false); }} aria-label="Change source" className="flex items-center gap-2 rounded-md bg-black/60 px-3 py-2 text-xs text-white transition-colors hover:bg-black/80"><Server className="h-4 w-4" /><span>{src.label}</span><ChevronDown className="h-3.5 w-3.5" /></button>
          {sourceOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-44 overflow-hidden rounded-md border border-white/10 bg-[#141414] shadow-xl">
              {SOURCES.map((s, i) => (
                <button key={s.key} onClick={() => { setSourceIdx(i); setSourceOpen(false); setIframeKey((k) => k + 1); }} className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 ${i === activeIdx ? "text-[#27E9B5]" : "text-neutral-200"}`}><span>{s.label}</span>{i === activeIdx && <span className="h-1.5 w-1.5 rounded-full bg-[#27E9B5]" />}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setIframeKey((k) => k + 1)} aria-label="Reload player" className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md bg-black/60 text-white transition-colors hover:bg-black/80"><RefreshCw className="h-4 w-4" /></button>
        {type === "tv" && (
          <>
            <div className="pointer-events-auto relative">
              <button onClick={() => { setSeasonOpen((v) => !v); setSourceOpen(false); setEpOpen(false); }} className="flex items-center gap-2 rounded-md bg-black/60 px-3 py-2 text-xs text-white transition-colors hover:bg-black/80"><span>Season {season}</span><ChevronDown className="h-3.5 w-3.5" /></button>
              {seasonOpen && (
                <div className="absolute bottom-full left-0 mb-2 max-h-56 w-36 overflow-y-auto rounded-md border border-white/10 bg-[#141414] shadow-xl">
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                    <button key={s} onClick={() => { setSeason(s); setEp(1); setSeasonOpen(false); setIframeKey((k) => k + 1); }} className={`w-full px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 ${s === season ? "text-[#27E9B5]" : "text-neutral-200"}`}>Season {s}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="pointer-events-auto relative">
              <button onClick={() => { setEpOpen((v) => !v); setSourceOpen(false); setSeasonOpen(false); }} className="flex items-center gap-2 rounded-md bg-black/60 px-3 py-2 text-xs text-white transition-colors hover:bg-black/80"><span>Episode {ep}</span><ChevronDown className="h-3.5 w-3.5" /></button>
              {epOpen && (
                <div className="absolute bottom-full left-0 mb-2 max-h-56 w-36 overflow-y-auto rounded-md border border-white/10 bg-[#141414] shadow-xl">
                  {epList.map((e) => (
                    <button key={e} onClick={() => { setEp(e); setEpOpen(false); setIframeKey((k) => k + 1); }} className={`w-full px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/10 ${e === ep ? "text-[#27E9B5]" : "text-neutral-200"}`}>E{e}</button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <span className="pointer-events-auto ml-auto hidden items-center gap-1.5 rounded bg-black/50 px-2.5 py-1 text-[11px] text-neutral-400 sm:flex"><Tv className="h-3.5 w-3.5" /> Ad-free source {activeIdx + 1}/{SOURCES.length}</span>
      </div>
    </div>
  );
}
