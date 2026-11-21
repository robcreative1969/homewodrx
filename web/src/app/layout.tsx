import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMetrics } from "@/components/SiteMetrics";
import { isIndexable, OG_IMAGE } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HomeWODRx: free workouts, a WOD Builder and the Daily 20",
    template: "%s | HomeWODRx",
  },
  description:
    "The training platform for functional fitness athletes, at the box, the health club, or at home.",
  metadataBase: new URL("https://homewodrx.com"),
  openGraph: { images: [OG_IMAGE] },
  // The rebuild stays out of search results until it replaces the live site.
  robots: isIndexable() ? undefined : { index: false, follow: false },
  // Pinterest website claim (2026-11-21).
  other: { "p:domain_verify": "b7ab8049fdcd74c19a98ce90dc31c2b1" },
};

// Applies a saved light/dark choice before the page paints, so it never flashes.
const themeScript = `try{var t=localStorage.getItem('hwrx-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans text-base leading-normal">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <BottomNav />
        <SiteMetrics />
      </body>
    </html>
  );
}
