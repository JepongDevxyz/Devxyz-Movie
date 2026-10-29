import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Devxyz Movie", description: "Ad-free streaming" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
