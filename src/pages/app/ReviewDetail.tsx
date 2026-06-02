import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateHash } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function ReviewDetail() {
  const { txHash } = useParams();
  const { data: overview } = useQuery({ queryKey: ["demo-overview"], queryFn: api.demoOverview });
  const { data: config } = useQuery({ queryKey: ["demo-config"], queryFn: api.demoConfig });

  const review = overview?.reviews?.find((r) => r.txHash.toLowerCase() === (txHash ?? "").toLowerCase()) ?? null;

  if (!review) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Review</h1>
        <p className="text-sm text-muted-foreground">Not found (or still loading).</p>
      </div>
    );
  }

  const explorer = config?.blockExplorerUrl ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review</h1>
        <p className="text-sm text-muted-foreground font-mono mt-2">{truncateHash(review.txHash, 10)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">On-chain metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Manuscript</span>
              <span className="font-mono">#{review.manuscriptId}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Group</span>
              <span className="font-mono">{review.groupId}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Privacy token</span>
              <span className="font-mono">{truncateHash(review.nullifier, 10)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Review reference</span>
              <span className="font-mono">{truncateHash(review.reviewContentHash, 10)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">CID</span>
              <span className="font-mono">{review.reviewIpfsCid ? truncateHash(review.reviewIpfsCid, 10) : "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {explorer ? (
              <Button asChild variant="outline" className="w-full justify-between">
                <a href={`${explorer}/tx/${review.txHash}`} target="_blank" rel="noopener noreferrer">
                  View transaction <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            ) : null}

            {review.reviewIpfsCid ? (
              <Button asChild variant="outline" className="w-full justify-between">
                <a href={`https://gateway.pinata.cloud/ipfs/${review.reviewIpfsCid}`} target="_blank" rel="noopener noreferrer">
                  View content on IPFS <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">
                No content link stored for this review (content pinning may have been unavailable during submission).
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

