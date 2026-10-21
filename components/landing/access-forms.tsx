"use client";

import { useState } from "react";

// Placeholder behaviour until sign-in and invite codes are built (plan day 3).
// Nothing is sent anywhere, and the page says so.
export default function AccessForms() {
  const [note, setNote] = useState("");

  function block(e: React.FormEvent<HTMLFormElement>, message: string) {
    e.preventDefault();
    setNote(message);
  }

  return (
    <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
      <form className="border border-ink p-[clamp(24px,2.6vw,32px)]" onSubmit={(e) => block(e, "Invite codes switch on shortly. Nothing was sent.")}>
        <h3 className="mb-4 text-lg font-semibold">Have an invite code?</h3>
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor="code" className="sr-only">Invite code</label>
          <input id="code" name="code" type="text" placeholder="STRD-0000" autoComplete="off" className="min-h-[48px] min-w-0 flex-[1_1_180px] border border-line2 px-3.5 font-mono text-[15px] tracking-[0.08em] text-ink" />
          <button type="submit" className="min-h-[48px] bg-brand px-6 text-[15.5px] font-medium text-white hover:bg-ink">Enter</button>
        </div>
      </form>
      <form className="border border-line bg-wash p-[clamp(24px,2.6vw,32px)]" onSubmit={(e) => block(e, "Seat requests open shortly. Nothing was sent.")}>
        <h3 className="mb-2 text-lg font-semibold">No code yet?</h3>
        <p className="mb-4 text-[14.5px] text-mute">Leave an email and where you publish. Seats go out in small batches.</p>
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@firm.com" className="min-h-[48px] min-w-0 flex-[1_1_180px] border border-line2 px-3.5 text-[15px] text-ink" />
          <button type="submit" className="min-h-[48px] border border-ink bg-white px-6 text-[15.5px] font-medium text-ink hover:bg-ink hover:text-white">Request a seat</button>
        </div>
      </form>
      <p role="status" className="m-0 min-h-[1.5em] text-[14px] text-mute">{note}</p>
    </div>
  );
}
