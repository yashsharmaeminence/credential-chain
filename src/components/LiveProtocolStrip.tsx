import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function formatInt(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString();
}

export default function LiveProtocolStrip() {
  const { data: config } = useQuery({ queryKey: ["demo-config"], queryFn: api.demoConfig });
  const { data: overview } = useQuery({ queryKey: ["demo-overview"], queryFn: api.demoOverview });

  const chainName = config?.chainName ?? "Network";
  const chainId = config?.chainId ?? null;

  return (
    <section className="py-10 border-y border-border bg-surface-glass">
      <div className="container max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Live protocol status</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-lg font-semibold text-foreground">{chainName}</div>
              {chainId ? (
                <Badge variant="secondary" className="font-mono">
                  chain {chainId}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
            <Card className="px-4 py-3">
              <div className="text-xs text-muted-foreground">Manuscripts</div>
              <div className="text-xl font-semibold text-foreground mt-1">
                {formatInt(overview?.stats.manuscriptCount)}
              </div>
            </Card>
            <Card className="px-4 py-3">
              <div className="text-xs text-muted-foreground">Reviews</div>
              <div className="text-xl font-semibold text-foreground mt-1">{formatInt(overview?.stats.totalReviews)}</div>
            </Card>
            <Card className="px-4 py-3 hidden md:block">
              <div className="text-xs text-muted-foreground">Credentials</div>
              <div className="text-xl font-semibold text-foreground mt-1">
                {formatInt(overview?.stats.credentialsMinted)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

