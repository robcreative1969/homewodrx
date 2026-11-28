import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/account/ui";
import { NewPasswordForm } from "./ResetForm";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false } };

// Reached after the forgot-password code (or the old reset link via /auth/callback), which signs the person in first.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");
  return (
    <AuthShell title="Set a new password">
      <NewPasswordForm done="/me" />
    </AuthShell>
  );
}
