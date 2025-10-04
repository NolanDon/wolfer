import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sub text-sm">© {new Date().getFullYear()} WolferAI. All rights reserved.</p>
        <div className="flex gap-4 text-sub text-sm">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#waitlist" className="hover:text-ink">Join waitlist</a>
        </div>
      </div>
    </footer>
  );
}
