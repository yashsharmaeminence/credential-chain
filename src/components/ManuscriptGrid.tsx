import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, type DemoManuscript } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

    <Collapsible>
      <CollapsibleTrigger className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        Details <ChevronDown className="w-3.5 h-3.5" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-xs text-muted-foreground">
        <a
          href={`https://gateway.pinata.cloud/ipfs/${ms.ipfsCid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          View manuscript document <ExternalLink className="w-3 h-3" />
        </a>
      </CollapsibleContent>
    </Collapsible>

    <div className="pt-2 flex items-center justify-between gap-3">
      <Button asChild size="sm" className="w-full">
        <Link to={`/app/manuscripts/${ms.id}`}>View details</Link>
      </Button>
    </div>
  </div>
);

const ManuscriptGrid = () => {
  const { data } = useQuery({
    queryKey: ["demo-overview"],
    queryFn: api.demoOverview,
  });

  const manuscripts = data?.manuscripts ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Manuscripts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {manuscripts.map((ms, i) => (
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
