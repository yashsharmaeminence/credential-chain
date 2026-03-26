import { motion } from "framer-motion";
import { MOCK_MANUSCRIPTS, truncateHash, type DemoManuscript } from "@/data/mock-data";
import { ExternalLink, CheckCircle, XCircle, MessageSquare } from "lucide-react";

const ManuscriptCard = ({ ms }: { ms: DemoManuscript }) => (
  <div className="bg-card border border-border rounded-xl p-5 card-shadow flex flex-col gap-3 hover:border-glow transition-colors">
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-serif text-base font-semibold text-foreground leading-snug flex-1">
        {ms.title}
      </h3>
      <span className="font-mono text-xs text-muted-foreground shrink-0">#{ms.id}</span>
    </div>

    <div className="flex flex-wrap gap-2">
      {ms.openForReview ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          <CheckCircle className="w-3 h-3" /> Open for Review
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          <XCircle className="w-3 h-3" /> Closed
        </span>
      )}
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
        <MessageSquare className="w-3 h-3" /> {ms.reviewCount} reviews
      </span>
    </div>

    <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="text-secondary-foreground">DOI</span>
        {truncateHash(ms.doiHash, 8)}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-secondary-foreground">IPFS</span>
        <a
          href={`https://w3s.link/ipfs/${ms.ipfsCid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          {truncateHash(ms.ipfsCid, 8)}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  </div>
);

const ManuscriptGrid = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Manuscripts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_MANUSCRIPTS.map((ms, i) => (
          <motion.div
            key={ms.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <ManuscriptCard ms={ms} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManuscriptGrid;
