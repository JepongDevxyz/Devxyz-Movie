"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Profile } from "@/lib/cinemara/store";
import { avatarUrl } from "@/lib/cinemara/art";
interface Props { profiles: Profile[]; onAdd: (p: Profile) => void; onRemove: (id: string) => void; onSelect: (id: string) => void; }
export default function ProfileGate({ profiles, onAdd, onRemove, onSelect }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [kids, setKids] = useState(false);
  const submit = () => { if (!name.trim()) return; onAdd({ id: `p${Date.now()}`, name: name.trim(), avatarIdx: profiles.length, kids }); setName(""); setKids(false); setAdding(false); };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <h1 className="mb-10 text-4xl font-bold text-white">Who&apos;s watching?</h1>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {profiles.map((p) => (
          <div key={p.id} className="group relative flex flex-col items-center gap-2">
            <button onClick={() => onSelect(p.id)} className="h-28 w-28 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
              <img src={avatarUrl(p.avatarIdx)} alt={p.name} className="h-full w-full object-cover" />
            </button>
            <span className="text-sm text-neutral-400 group-hover:text-white">{p.name}</span>
            <button onClick={() => onRemove(p.id)} className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white group-hover:flex"><Trash2 className="h-3 w-3" /></button>
          </div>
        ))}
        <button onClick={() => setAdding(true)} className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-600 text-neutral-500 transition-colors hover:border-white hover:text-white">
          <Plus className="h-8 w-8" /><span className="text-xs">Add Profile</span>
        </button>
      </div>
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setAdding(false)}>
          <div className="w-80 rounded-lg bg-[#181818] p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-xl font-bold text-white">Add Profile</h2>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Name" className="mb-4 w-full rounded bg-[#333] px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none" />
            <label className="mb-4 flex items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} className="accent-[#27E9B5]" /> Kids profile</label>
            <div className="flex gap-2">
              <button onClick={submit} className="flex-1 rounded bg-[#27E9B5] py-2 font-semibold text-black">Add</button>
              <button onClick={() => setAdding(false)} className="flex-1 rounded bg-neutral-700 py-2 text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
