import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | HomeWODRx admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pt-5 pb-28">{children}</div>;
}
