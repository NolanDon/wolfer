"use client";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-bg/60 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sub">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#proof" className="hover:text-ink">Proof</a>
        </nav>
        <a href="#waitlist" className="btn-primary">Join the waitlist</a>
      </div>
    </header>
  );
}
