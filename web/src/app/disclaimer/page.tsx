import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";

export const metadata: Metadata = { title: "Disclaimer", alternates: { canonical: "https://homewodrx.com/disclaimer" } };

export default function Page() {
  return <LegalArticle slug="disclaimer" />;
}
