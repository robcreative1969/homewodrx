import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-6">
      <h1 className="m-0 text-[28px] font-extrabold tracking-tight">Admin log in</h1>
      <LoginForm />
    </div>
  );
}
