import ComposeForm from "@/components/desk/compose-form";

export default function ComposePage() {
  return (
    <div className="flex max-w-[720px] flex-col gap-8">
      <div>
        <p className="mb-3.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-mute">Compose</p>
        <h1 className="m-0 font-display text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.08]">What is your take?</h1>
      </div>
      <ComposeForm />
    </div>
  );
}
