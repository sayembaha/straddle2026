import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

export const metadata = { title: "Sign in — Straddle" };

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col justify-center gap-8 px-5 py-12">
      <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
        <span className="inline-block h-3 w-3 bg-ink" />
        <span className="font-mono text-sm font-medium tracking-[0.22em]">STRADDLE</span>
      </Link>
      <div>
        <h1 className="m-0 font-display text-[clamp(30px,6vw,40px)] font-normal leading-[1.1]">Sign in to your desk</h1>
        <p className="mt-3 text-[15px] text-mute">Straddle is invite-only. New here? Enter the code you were sent. Already in? Leave the code blank.</p>
      </div>
      <LoginForm initialError={searchParams.error} />
    </main>
  );
}
