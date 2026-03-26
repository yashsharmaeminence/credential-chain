import { useState } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import NetworkStrip from "@/components/NetworkStrip";
import StatsTiles from "@/components/StatsTiles";
import ManuscriptGrid from "@/components/ManuscriptGrid";
import ReviewActivity from "@/components/ReviewActivity";
import CredentialList from "@/components/CredentialList";
import ReviewerFlow from "@/components/ReviewerFlow";
import { Shield } from "lucide-react";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-glass border-b border-border">
        <div className="container max-w-6xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground text-lg tracking-tight">JournalsPro</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            {showDemo && (
              <button onClick={() => setShowDemo(false)} className="hover:text-foreground transition-colors">
                Landing
              </button>
            )}
            {!showDemo && (
              <button
                onClick={() => setShowDemo(true)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all"
              >
                Open Demo
              </button>
            )}
          </nav>
        </div>
      </header>

      {!showDemo ? (
        <>
          <Hero onOpenDemo={() => setShowDemo(true)} />
          <HowItWorks />

          {/* Footer */}
          <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground">
            <div className="container max-w-5xl px-6">
              <p className="font-mono text-xs">
                Built with ERC-721 credentials • Semaphore ZK groups • On-chain peer review registry
              </p>
              <p className="mt-2 text-xs">
                © 2025 JournalsPro — Anonymous. Qualified. Verifiable.
              </p>
            </div>
          </footer>
        </>
      ) : (
        <>
          <div className="pt-14">
            <NetworkStrip />
          </div>

          <main className="container max-w-5xl px-6 py-10 space-y-12">
            <StatsTiles />
            <ManuscriptGrid />
            <ReviewActivity />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ReviewerFlow />
              <CredentialList />
            </div>
          </main>

          <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground font-mono">
            Demo mode • Mock data • No real chain interaction
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
