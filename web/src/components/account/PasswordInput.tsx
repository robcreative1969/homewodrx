"use client";

import { useState } from "react";
import { field } from "./ui";

/** A password box with a Show/Hide button, so one box is enough (no "type it again"). */
export function PasswordInput(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className">) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={shown ? "text" : "password"} className={`${field} pr-20`} />
      <button
        type="button"
        onClick={() => setShown(!shown)}
        aria-pressed={shown}
        aria-controls={props.id}
        className="absolute top-0 right-0 flex h-12 min-w-[64px] items-center justify-center rounded-r-xl px-3 text-sm font-semibold text-accent-text"
      >
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}
