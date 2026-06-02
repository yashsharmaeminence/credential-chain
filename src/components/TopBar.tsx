import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export default function TopBar({ left }: { left?: React.ReactNode }) {
  const { data: config } = useQuery({ queryKey: ["demo-config"], queryFn: api.demoConfig });

  const chainLabel = useMemo(() => {
    if (!config) return "Network";
    return `${config.chainName} (${config.chainId})`;
  }, [config]);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="h-14 container max-w-6xl px-6 flex items-center gap-3">
        {left ?? null}

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="text-sm font-semibold text-foreground truncate">{chainLabel}</div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="hidden md:flex items-center gap-2 min-w-0">
          <Badge variant="secondary" className="text-[11px]">
            {config ? "Connected" : "Connecting"}
          </Badge>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {config?.blockExplorerUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={config.blockExplorerUrl} target="_blank" rel="noopener noreferrer">
                Explorer <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

