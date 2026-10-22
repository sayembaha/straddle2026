"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const label = "mb-2 block text-[14px] font-semibold";
const field = "min-h-[48px] w-full border border-line2 bg-white px-3.5 text-[16px] text-ink placeholder:text-faint focus:border-ink";

const ERRORS: Record<string, string> = {
  invalid: "That invite code is not valid or has already been used.",
  full: "All 20 seats are taken. Email hello@straddle.business to join the waiting list.",
  link: "That sign-in link has expired. Request a new one.",
};

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(initialError ? ERRORS[initialError] ?? "Something went wrong. Try again." : "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    const trimmed = code.trim();

    if (trimmed) {
      const { data: ok } = await supabase.rpc("check_invite", { p_code: trimmed });
      if (!ok) {
        setError(ERRORS.invalid);
        setBusy(false);
        return;
      }
    }

    const redirect = `${window.location.origin}/auth/callback?${trimmed ? `invite=${encodeURIComponent(trimmed)}` : "returning=1"}`;
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirect, shouldCreateUser: Boolean(trimmed) },
    });
    setBusy(false);
    if (err) {
      setError(trimmed ? "Could not send the link. Check the email address and try again." : "No account for that email yet. Enter your invite code to join.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border border-line p-5">
        <p className="m-0 text-[16px] font-semibold">Check your email.</p>
        <p className="mt-2 text-[15px] text-mute">We sent a sign-in link to {email}. Open it on this device.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
      </div>
      <div>
        <label htmlFor="code" className={label}>Invite code <span className="font-normal text-mute">&mdash; first time only</span></label>
        <input id="code" type="text" autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} placeholder="STRADDLE-XXXX" className={`${field} font-mono uppercase`} />
      </div>
      <button type="submit" disabled={busy || !email.includes("@")} className="min-h-[52px] w-fit bg-brand px-8 text-base font-medium text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-line2">
        {busy ? "Sending..." : "Email me a sign-in link"}
      </button>
      <p role="alert" className="m-0 min-h-[1.5em] text-[14px] text-ink">{error}</p>
    </form>
  );
}
