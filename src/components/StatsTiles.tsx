import { motion } from "framer-motion";
import { MOCK_STATS } from "@/data/mock-data";
import { FileText, MessageSquare, Award, Users } from "lucide-react";

const tiles = [
  { label: "Manuscripts", value: MOCK_STATS.totalManuscripts, icon: FileText },
  { label: "Reviews", value: MOCK_STATS.totalReviews, icon: MessageSquare },
  { label: "Credentials Minted", value: MOCK_STATS.totalCredentialsMinted, icon: Award },
  { label: "Active Reviewers", value: MOCK_STATS.activeReviewers, icon: Users },
];

const StatsTiles = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tiles.map((tile, i) => (
        <motion.div
          key={tile.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-card border border-border rounded-xl p-5 card-shadow"
        >
          <div className="flex items-center gap-2 mb-3">
            <tile.icon className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {tile.label}
            </span>
          </div>
          <span className="text-3xl font-bold text-foreground font-mono">
            {tile.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsTiles;
