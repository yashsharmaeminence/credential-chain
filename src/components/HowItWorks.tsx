import { motion } from "framer-motion";
import { GraduationCap, Users, FileText, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    title: "Credential Minted",
    description: "Institution issues an ERC-721 credential NFT to a reviewer's wallet, encoding qualification type on-chain.",
    detail: "CredentialNFT.mint(reviewer, typeId)",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Semaphore Enrollment",
    description: "Qualified reviewer generates a Semaphore identity and is enrolled into the credential-type group.",
    detail: "ReviewerGroupRegistry.addQualifiedReviewer()",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "ZK Review Submitted",
    description: "Reviewer submits a zero-knowledge proof binding their review to the manuscript — no wallet signature revealed.",
    detail: "PeerReviewRegistry.submitReview(proof)",
    color: "text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Publicly Verifiable",
    description: "Anyone can verify the review was submitted by a qualified group member, without knowing who.",
    detail: "On-chain event + IPFS content",
    color: "text-primary",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <div className="container max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From Credential to <span className="text-gradient-emerald">Proof</span>
          </h2>
          <p className="font-serif text-lg text-muted-foreground max-w-xl mx-auto">
            Four steps. Full anonymity. Complete accountability.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-surface-elevated border border-glow flex items-center justify-center mb-4">
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>

                {/* Step number */}
                <span className="font-mono text-xs text-muted-foreground mb-2">
                  0{i + 1}
                </span>

                <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {step.description}
                </p>
                <code className="text-xs font-mono text-primary/70 bg-muted px-2 py-1 rounded">
                  {step.detail}
                </code>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
