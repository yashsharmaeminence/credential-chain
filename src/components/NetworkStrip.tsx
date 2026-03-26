import { MOCK_CHAIN_CONFIG, truncateAddress } from "@/data/mock-data";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

const NetworkStrip = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const config = MOCK_CHAIN_CONFIG;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const contracts = [
    { label: "CredentialNFT", addr: config.contracts.credentialNFT },
    { label: "GroupRegistry", addr: config.contracts.reviewerGroupRegistry },
    { label: "ManuscriptReg", addr: config.contracts.manuscriptRegistry },
    { label: "PeerReviewReg", addr: config.contracts.peerReviewRegistry },
  ];

  return (
    <div className="border-y border-border bg-surface-elevated">
      <div className="container max-w-6xl px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-foreground font-semibold">{config.chainName}</span>
          <span className="text-muted-foreground">ID {config.chainId}</span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-border" />

        {contracts.map((c) => (
          <button
            key={c.label}
            onClick={() => copyToClipboard(c.addr, c.label)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-secondary-foreground">{c.label}</span>
            <span>{truncateAddress(c.addr)}</span>
            <Copy className="w-3 h-3" />
            {copied === c.label && <span className="text-primary text-[10px]">✓</span>}
          </button>
        ))}

        {config.blockExplorerUrl && (
          <a
            href={config.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline ml-auto"
          >
            Explorer <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default NetworkStrip;
