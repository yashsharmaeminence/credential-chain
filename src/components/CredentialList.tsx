import { motion } from "framer-motion";
import { truncateHash } from "@/data/mock-data";
import { Award, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/http";

type DemoCredential = {
  tokenId: string;
  credentialTypeId: string;
  tokenURI: string;
};

const CredentialCard = ({ cred }: { cred: DemoCredential }) => (
  <div className="bg-card border border-border rounded-xl p-5 card-shadow flex items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
      <Award className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-foreground text-sm">Credential</h3>
        <span className="font-mono text-xs text-muted-foreground">Token #{cred.tokenId}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="text-secondary-foreground">Type</span> {cred.credentialTypeId}
        <span className="mx-2">•</span>
        <span className="font-mono">uri {truncateHash(cred.tokenURI, 6)}</span>
      </div>
    </div>
  </div>
);

const CredentialList = () => {
  const [account, setAccount] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["demo-credentials", account],
    enabled: !!account,
    queryFn: async () => {
      if (!account) throw new Error("Missing wallet address.");
      const res = await fetch(apiUrl(`/demo/credentials/${account}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as { tokens: DemoCredential[]; balance: string };
    },
  });
  const creds = data?.tokens ?? [];

  useEffect(() => {
    if (!window.ethereum) return;
    (async () => {
      try {
        const accounts = (await window.ethereum!.request({ method: "eth_accounts" })) as string[];
        setAccount(accounts?.[0] ?? null);
      } catch {
        // ignore
      }
    })();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("No wallet provider detected.");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
      const addr = accounts?.[0] ?? null;
      if (!addr) throw new Error("No account returned.");
      setAccount(addr);
      toast.success("Wallet connected.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wallet connection failed.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Wallet Credentials</h2>
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground font-mono">
          {account ? `Address: ${truncateHash(account, 4)}` : "Address: (not connected)"}
          {account ? ` • ${isLoading ? "Loading…" : `${creds.length} tokens`}` : ""}
        </p>
        <button
          onClick={connectWallet}
          className="shrink-0 px-3 py-2 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors inline-flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {account ? "Reconnect" : "Connect Wallet"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creds.map((cred, i) => (
          <motion.div
            key={cred.tokenId}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <CredentialCard cred={cred} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CredentialList;
