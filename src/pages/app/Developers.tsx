import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";

function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied.");
}

export default function Developers() {
  const { data: config } = useQuery({ queryKey: ["demo-config"], queryFn: api.demoConfig });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Developers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Contract addresses, endpoints, and verifiability metadata for integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Contracts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {config ? (
              <>
                {Object.entries(config.contracts).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{k}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{v}</span>
                      <Button variant="ghost" size="icon" onClick={() => copy(v)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-muted-foreground">Loading…</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono">
            <div>/config</div>
            <div>/overview</div>
            <div>/group-members/:groupId</div>
            <div>/credentials/:address</div>
            <div className="text-muted-foreground font-sans text-xs mt-4">
              Explorer:{" "}
              {config?.blockExplorerUrl ? (
                <a href={config.blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">
                  {config.blockExplorerUrl} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                "—"
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

