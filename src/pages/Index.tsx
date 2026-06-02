import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LiveProtocolStrip from "@/components/LiveProtocolStrip";
import LogoMark from "@/components/LogoMark";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-glass border-b border-border">
        <div className="container max-w-6xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 text-foreground">
              <LogoMark className="w-7 h-7" />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight">JournalsPro</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <Link
              to="/app/overview"
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all"
            >
              Launch App
            </Link>
          </nav>
        </div>
      </header>

      <Hero />
      <LiveProtocolStrip />
      <HowItWorks />

      {/* Footer */}
      <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground">
        <div className="container max-w-5xl px-6">
          <p className="font-mono text-xs">
                Built with verifiable credentials and privacy-preserving anonymous reviews
          </p>
          <p className="mt-2 text-xs">© 2026 JournalsPro — Anonymous. Qualified. Verifiable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
