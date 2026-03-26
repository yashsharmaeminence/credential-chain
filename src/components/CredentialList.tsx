import { motion } from "framer-motion";
import { MOCK_CREDENTIALS, truncateHash, type DemoCredential } from "@/data/mock-data";
import { Award, ExternalLink } from "lucide-react";

const CredentialCard = ({ cred }: { cred: DemoCredential }) => (
  <div className="bg-card border border-border rounded-xl p-5 card-shadow flex items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
      <Award className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-foreground text-sm">{cred.typeName}</h3>
        <span className="font-mono text-xs text-muted-foreground">Token #{cred.tokenId}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="text-secondary-foreground">Type</span> {cred.credentialTypeId}
        <span className="mx-2">•</span>
        <span className="font-mono">
          tx {truncateHash(cred.mintTxHash, 4)}
        </span>
      </div>
    </div>
  </div>
);

const CredentialList = () => {
  const mockWallet = "0x7a3E...b9F2";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Wallet Credentials</h2>
      <p className="text-sm text-muted-foreground mb-6 font-mono">
        Connected: {mockWallet} • {MOCK_CREDENTIALS.length} credentials
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CREDENTIALS.map((cred, i) => (
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
