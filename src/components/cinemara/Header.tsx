"use client";
import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import { Bell, ChevronDown, Search, Pencil, Menu, X } from "lucide-react";
import type { Profile } from "@/lib/cinemara/store";
import { avatarUrl } from "@/lib/cinemara/art";
export type NavView = "home" | "shows" | "movies" | "new" | "livetv" | "mylist" | "mycinemara" | "developer" | "search" | "watch";
const NAV_ITEMS: { key: NavView; label: string }[] = [
  { key: "home", label: "Home" }, { key: "shows", label: "Shows" }, { key: "movies", label: "Movies" },
  { key: "new", label: "New & Popular" }, { key: "livetv", label: "Live TV" },
  { key: "mylist", label: "My List" }, { key: "mycinemara", label: "My Devxyz" }, { key: "developer", label: "Developer" },
];
interface Props {
  active: NavView; onNavigate: (v: NavView) => void; onLiveTV?: () => void;
  profile: Profile; profiles: Profile[];
  onManageProfiles: () => void; onSwitchProfile: (id: string) => void; onSignOut: () => void;
}
export default function Header({ active, onNavigate, onLiveTV, profile, profiles, onManageProfiles, onSwitchProfile, onSignOut }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false); }; document.addEventListener("mousedown", onDown); return () => document.removeEventListener("mousedown", onDown); }, []);
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);
  return (
    <div ref={wrapRef}>
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled ? "bg-[#0b0b0b] shadow-lg shadow-black/60" : "bg-gradient-to-b from-black/85 via-black/40 to-transparent"}`}>
        <nav aria-label="Primary" className="flex h-[72px] items-center gap-3 px-4 sm:gap-5 md:px-12">
          <button onClick={() => onNavigate("home")} aria-label="Devxyz Movie home" className="shrink-0 select-none"><Wordmark className="text-[26px] sm:text-[30px]" /></button>
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <button onClick={() => onNavigate(item.key)} aria-current={active === item.key ? "page" : undefined} className={`rounded-full px-3.5 py-2 text-[14px] transition-colors ${active === item.key ? "bg-[#1f1f1f] font-semibold text-white" : "text-neutral-300 hover:text-white"}`}>{item.label}</button>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-4 sm:gap-5">
            {onLiveTV && (
              <button onClick={onLiveTV} aria-label="Live TV" className="hidden items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-red-600 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />LIVE
              </button>
            )}
            <button aria-label="Search" onClick={() => onNavigate("search")} className="text-white transition-transform hover:scale-110"><Search className="h-[22px] w-[22px]" strokeWidth={2.25} /></button>
            <button aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(true); setMenuOpen(false); }} className="text-white transition-transform hover:scale-110 lg:hidden"><Menu className="h-[22px] w-[22px]" strokeWidth={2.25} /></button>
            <div className="relative hidden lg:block">
              <button aria-label="Profile menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2">
                <img src={avatarUrl(profile.avatarIdx)} alt={profile.name} className="h-8 w-8 rounded" />
                <ChevronDown className={`h-4 w-4 text-white transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-md border border-white/10 bg-[#141414] py-1 shadow-xl">
                  {profiles.map((p) => (
                    <button key={p.id} onClick={() => { onSwitchProfile(p.id); setMenuOpen(false); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-200 hover:bg-white/10">
                      <img src={avatarUrl(p.avatarIdx)} alt={p.name} className="h-6 w-6 rounded" />{p.name}
                    </button>
                  ))}
                  <div className="my-1 border-t border-white/10" />
                  <button onClick={() => { onManageProfiles(); setMenuOpen(false); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-200 hover:bg-white/10"><Pencil className="h-4 w-4" />Manage Profiles</button>
                  <button onClick={() => { onSignOut(); setMenuOpen(false); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-200 hover:bg-white/10">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-4">
            <Wordmark className="text-[26px]" />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="h-6 w-6 text-white" /></button>
          </div>
          <div className="flex flex-col gap-1 px-4 pt-4">
            {NAV_ITEMS.map((item) => (
              <button key={item.key} onClick={() => { onNavigate(item.key); setMobileOpen(false); }} className={`rounded-lg px-4 py-3 text-left text-lg ${active === item.key ? "bg-[#1f1f1f] font-semibold text-white" : "text-neutral-300"}`}>{item.label}</button>
            ))}
            <div className="my-2 border-t border-white/10" />
            <button onClick={() => { onSignOut(); setMobileOpen(false); }} className="rounded-lg px-4 py-3 text-left text-lg text-neutral-400">Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}
