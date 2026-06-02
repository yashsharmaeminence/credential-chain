import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReviewerNetwork() {
  const { data: overview } = useQuery({ queryKey: ["demo-overview"], queryFn: api.demoOverview });
  const groupId = overview?.stats.semaphoreGroupIdForDemoType ?? null;

  const { data: members } = useQuery({
    queryKey: ["demo-group-members", groupId],
    enabled: !!groupId,
    queryFn: () => api.demoGroupMembers(String(groupId)),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviewer Network</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reviewer groups are organized by credential type, with auditable enrollment history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Reviewer group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Group ID</span>
              <Badge variant="outline" className="font-mono">
                {groupId ?? "—"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Members (from logs)</span>
              <Badge variant="secondary" className="font-mono">
                {members?.members?.length ?? "—"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Members are derived from on-chain enrollment events (no off-chain indexer).
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground break-all">
              {(members?.members ?? []).slice(0, 3).join("\n") || "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              Showing a small sample for quick verification.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

