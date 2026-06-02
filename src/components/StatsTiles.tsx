import { motion } from "framer-motion";
import { FileText, MessageSquare, Award, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const StatsTiles = () => {
  const { data } = useQuery({
    queryKey: ["demo-overview"],
    queryFn: api.demoOverview,
  });

  const tiles = [
    { label: "Manuscripts", value: data?.stats.manuscriptCount ?? "—", icon: FileText },
    { label: "Reviews", value: data?.stats.totalReviews ?? "—", icon: MessageSquare },
    { label: "Credentials Minted", value: data?.stats.credentialsMinted ?? "—", icon: Award },
    { label: "Reviewer Network", value: data?.stats.semaphoreGroupIdForDemoType ?? "—", icon: Users },
  ];

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
