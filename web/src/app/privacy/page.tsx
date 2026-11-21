import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "https://homewodrx.com/privacy" } };

export default function Page() {
  return <LegalArticle slug="privacy" />;
}
