import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";

export const metadata: Metadata = { title: "Cookie Policy", alternates: { canonical: "https://homewodrx.com/cookies" } };

export default function Page() {
  return <LegalArticle slug="cookies" />;
}
