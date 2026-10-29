"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Splash from "@/components/cinemara/Splash";
import ProfileGate from "@/components/cinemara/ProfileGate";
import Header, { type NavView } from "@/components/cinemara/Header";
import LiveTVView from "@/components/cinemara/LiveTVView";
import WatchView from "@/components/cinemara/PlayerModal";
import { useProfiles, useMyList, useWatchHistory } from "@/lib/cinemara/store";
const VALID_VIEWS: NavView[] = ["home", "shows", "movies", "new", "livetv", "mylist", "mycinemara", "developer", "search", "watch"];
function viewFromHash(): NavView { const h = window.location.hash.replace(/^#\/?/, ""); if (h === "watch" || VALID_VIEWS.includes(h as NavView)) return h as NavView; return "home"; }
function hashFor(v: NavView): string { return v === "home" ? "#/" : `#/${v}`; }
function subscribeHash(cb: () => void) { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); }
export default function Home() {
  const [boot, setBoot] = useState<"show" | "fade" | "done">("show");
  useEffect(() => { const a = setTimeout(() => setBoot("fade"), 1500); const b = setTimeout(() => setBoot("done"), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  const { profiles, activeProfile, addProfile, removeProfile, selectProfile, signOut } = useProfiles();
  const view = useSyncExternalStore(subscribeHash, viewFromHash, () => "home");
  const [liveTv, setLiveTv] = useState(false);
  const navigate = useCallback((v: NavView) => { if (window.location.hash !== hashFor(v)) window.location.hash = hashFor(v); else window.scrollTo({ top: 0 }); }, []);
  const openLiveTV = useCallback(() => { setLiveTv(true); }, []);
  if (boot !== "done") return <Splash fading={boot === "fade"} />;
  if (!activeProfile) return <ProfileGate profiles={profiles} onAdd={(p) => { addProfile(p); selectProfile(p.id); navigate("home"); }} onRemove={removeProfile} onSelect={(id) => { selectProfile(id); navigate("home"); }} />;
  if (liveTv) return <LiveTVView onBack={() => setLiveTv(false)} />;
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header active={view} onNavigate={navigate} onLiveTV={openLiveTV} profile={activeProfile} profiles={profiles} onManageProfiles={signOut} onSwitchProfile={selectProfile} onSignOut={signOut} />
      <main className="flex-1">
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-4xl font-black text-[#27E9B5]">DEVXYZ MOVIE</p>
          <p className="max-w-md text-neutral-400">Ad-free streaming with multi-source playback. Click the LIVE button for Live TV, or browse sources in the player.</p>
          <button onClick={openLiveTV} className="mt-4 flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-500"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />Watch Live TV</button>
        </div>
      </main>
    </div>
  );
}
