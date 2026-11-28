import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/Card";
import { secondaryButton } from "@/components/account/ui";
import { NewPasswordForm } from "../reset-password/ResetForm";
import { DeleteAccount, EmailForm, UsernameForm } from "./AccountForms";
import { signOut } from "./actions";

export const metadata: Metadata = { title: "Me", robots: { index: false } };

export default async function MePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/me");
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  const username = profile?.username ?? "";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-5 pb-28">
      <div>
        <h1 className="m-0 text-[32px] font-extrabold tracking-tight">Me</h1>
        <p className="m-0 text-ink-2">Signed in as {username || user.email}</p>
      </div>

      <Card title="Account" labelledBy="me-account">
        <UsernameForm userId={user.id} current={username} />
        <EmailForm current={user.email ?? ""} />
      </Card>

      <Card title="Password" labelledBy="me-password">
        <p className="m-0 text-[15px] text-ink-2">Add a password if you&apos;d rather log in with one. An emailed code always works too.</p>
        <NewPasswordForm button="Save password" />
      </Card>

      <form action={signOut}>
        <button type="submit" className={secondaryButton}>Log out</button>
      </form>

      <DeleteAccount userId={user.id} />
    </div>
  );
}
