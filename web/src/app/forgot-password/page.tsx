import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/ui";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password" intro="Enter your email and we'll send you a link to set a new password.">
      <ForgotForm />
      <p className="m-0 text-center">
        <Link href="/login" className="font-semibold text-accent-text">Back to log in</Link>
      </p>
    </AuthShell>
  );
}
