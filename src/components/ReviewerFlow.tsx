import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ShieldCheck, Upload, UserPlus } from "lucide-react";

type Step = "identity" | "enroll" | "write" | "proof" | "submit" | "done";

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "identity", label: "Generate Identity", icon: ShieldCheck },
  { id: "enroll", label: "Enroll in Group", icon: UserPlus },
  { id: "write", label: "Write Review", icon: Upload },
  { id: "proof", label: "Generate ZK Proof", icon: ShieldCheck },
  { id: "submit", label: "Submit On-Chain", icon: CheckCircle },
];

const ReviewerFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);

  const advance = () => {
    if (currentStep >= STEPS.length) return;
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setCurrentStep((s) => s + 1);
    }, 1200);
  };

  const reset = () => {
    setCurrentStep(0);
    setRunning(false);
  };

  const done = currentStep >= STEPS.length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Reviewer Flow</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Walk through the anonymous review submission process step by step.
      </p>

      <div className="bg-card border border-border rounded-xl card-shadow p-6">
        {/* Stepper */}
        <div className="flex flex-col gap-4 mb-8">
          {STEPS.map((step, i) => {
            const completed = i < currentStep;
            const active = i === currentStep && !running;
            const processing = i === currentStep && running;

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    completed
                      ? "bg-primary border-primary"
                      : active
                      ? "border-primary bg-primary/10"
                      : processing
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted"
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                  ) : processing ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <step.icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>

                <div>
                  <span
                    className={`text-sm font-medium ${
                      completed ? "text-primary" : active || processing ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {processing && (
                    <span className="ml-2 text-xs text-muted-foreground">Processing…</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action button */}
        {done ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 text-primary font-semibold mb-4"
            >
              <CheckCircle className="w-5 h-5" />
              Review submitted anonymously!
            </motion.div>
            <div className="text-xs font-mono text-muted-foreground mb-4">
              tx 0x1234…cdef • verified by Semaphore group 0
            </div>
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              Reset Demo
            </button>
          </div>
        ) : (
          <button
            onClick={advance}
            disabled={running}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? "Processing…" : `Step ${currentStep + 1}: ${STEPS[currentStep].label}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewerFlow;
