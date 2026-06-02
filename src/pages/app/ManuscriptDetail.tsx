import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReviewerFlow from "@/components/ReviewerFlow";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, ChevronDown } from "lucide-react";

export default function ManuscriptDetail() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ["demo-overview"], queryFn: api.demoOverview });
  const ms = data?.manuscripts?.find((m) => m.id === id) ?? null;

  if (!ms) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Manuscript</h1>
        <p className="text-sm text-muted-foreground">Not found (or still loading).</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-serif">{ms.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">Manuscript #{ms.id}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant={ms.openForReview ? "default" : "secondary"}>
          {ms.openForReview ? "Open for review" : "Closed"}
        </Badge>
        <Badge variant="outline" className="font-mono text-xs">
          {ms.reviewCount} reviews
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Manuscript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ms.ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Open manuscript document <ExternalLink className="w-4 h-4" />
            </a>

            <Collapsible>
              <CollapsibleTrigger className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Technical details <ChevronDown className="w-3.5 h-3.5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Document CID</span>
                  <span className="font-mono text-xs break-all">{ms.ipfsCid}</span>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Submit a review</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewerFlow />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

