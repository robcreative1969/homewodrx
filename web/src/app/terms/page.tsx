import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "https://homewodrx.com/terms" } };

export default function Page() {
  return <LegalArticle slug="terms" />;
}
