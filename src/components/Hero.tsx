import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LogoMark from "@/components/LogoMark";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      
      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: "hsl(var(--primary))" }} />

      <div className="container relative z-10 max-w-5xl text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glow bg-surface-elevated mb-8">
            <div className="w-4 h-4 text-foreground">
              <LogoMark className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Qualified Anonymous Peer Review</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            <span className="text-foreground">Anonymous.</span>
            <br />
            <span className="text-foreground">Qualified.</span>
            <br />
            <span className="text-gradient-emerald">Verifiable.</span>
          </h1>

          <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Institutions issue credentials, and privacy-preserving verification enables qualified anonymous reviews.
            Reviews remain verifiable on-chain without exposing the reviewer’s identity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app/overview"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg transition-all hover:brightness-110 glow-emerald"
            >
              Launch App
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-medium text-lg transition-colors hover:bg-secondary"
            >
              How It Works
            </a>
          </div>
        </motion.div>

        {/* Floating protocol snippet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-xl mx-auto"
        >
          <div className="bg-surface-elevated rounded-xl border border-border p-5 text-left text-sm">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="ml-2 text-xs font-mono">On-chain review record</span>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Submit a review, publish a verifiable record, and attach the content link for public integrity.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
