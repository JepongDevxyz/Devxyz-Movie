"use client";
import { useState } from "react";
interface Props { src: string; alt: string; className?: string; loading?: "lazy" | "eager"; }
export default function SafeImg({ src, alt, className, loading }: Props) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className={`${className} bg-neutral-800`} />;
  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setErr(true)} />;
}
