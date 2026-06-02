import { motion } from "framer-motion";
import { GraduationCap, Users, FileText, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    title: "Get Verified",
    description: "A trusted institution confirms you’re eligible to review and issues a credential to your wallet.",
    detail: "Institution-issued credential",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Join the Reviewer Network",
    description: "Your eligibility is recognized so you can submit qualified reviews—without exposing who you are.",
    detail: "Eligibility registration",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "Submit Your Review",
    description: "Write your review and submit it anonymously. The protocol keeps it linked to the manuscript for integrity.",
    detail: "Anonymous submission",
    color: "text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Publicly Verifiable",
    description: "Editors and readers can verify the review is qualified and untampered—while your identity stays private.",
    detail: "Verifiable record",
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
            How it <span className="text-gradient-emerald">works</span>
          </h2>
          <p className="font-serif text-lg text-muted-foreground max-w-xl mx-auto">
            Simple for reviewers. Trusted for institutions. Verifiable for everyone.
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
                <div className="text-xs text-muted-foreground bg-muted/60 border border-border px-2 py-1 rounded">
                  {step.detail}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
