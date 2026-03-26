import { motion } from "framer-motion";
import { MOCK_REVIEWS, MOCK_CHAIN_CONFIG, truncateHash, type DemoReview } from "@/data/mock-data";
import { ExternalLink, Copy, ShieldCheck } from "lucide-react";

const ReviewItem = ({ review }: { review: DemoReview }) => {
  const explorer = MOCK_CHAIN_CONFIG.blockExplorerUrl;
  const date = new Date(review.timestamp);

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* ZK indicator */}
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">
            Manuscript #{review.manuscriptId}
          </span>
          <span className="text-xs text-muted-foreground">
            Group {review.groupId}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
          <span>
            <span className="text-secondary-foreground">hash</span>{" "}
            {truncateHash(review.reviewContentHash, 6)}
          </span>

          {review.reviewIpfsCid && (
            <a
              href={`https://w3s.link/ipfs/${review.reviewIpfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              IPFS <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {explorer ? (
            <a
              href={`${explorer}/tx/${review.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              tx {truncateHash(review.txHash, 4)} <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1">
              tx {truncateHash(review.txHash, 4)} <Copy className="w-3 h-3" />
            </span>
          )}

          <span>block {review.blockNumber.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const ReviewActivity = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Review Activity</h2>
      <div className="bg-card border border-border rounded-xl card-shadow overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span>Anonymous ZK-verified reviews • {MOCK_REVIEWS.length} events</span>
        </div>
        <div className="px-5">
          {MOCK_REVIEWS.map((review, i) => (
            <motion.div
              key={review.txHash}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <ReviewItem review={review} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewActivity;
