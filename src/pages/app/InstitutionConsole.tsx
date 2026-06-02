import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { postJson } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function InstitutionConsole() {
  const queryClient = useQueryClient();
  const { data: overview } = useQuery({ queryKey: ["demo-overview"], queryFn: api.demoOverview });
  const [reviewerAddress, setReviewerAddress] = useState("");
  const [credentialTypeId, setCredentialTypeId] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  const [identityCommitment, setIdentityCommitment] = useState("");

  const [manuscriptTitle, setManuscriptTitle] = useState("");
  const [manuscriptDoi, setManuscriptDoi] = useState("");
  const [manuscriptIpfsCid, setManuscriptIpfsCid] = useState("");

  useEffect(() => {
    if (!overview) return;
    if (!credentialTypeId) setCredentialTypeId(String(overview.stats.demoCredentialTypeId));
  }, [overview, credentialTypeId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Institution Console</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administrative actions for issuing credentials and registering reviewer eligibility (requires an institution-backed API key).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Create manuscript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={manuscriptTitle} onChange={(e) => setManuscriptTitle(e.target.value)} placeholder="e.g. A Clinical Study of ..." />
            </div>
            <div className="space-y-2">
              <Label>DOI (or internal reference)</Label>
              <Input value={manuscriptDoi} onChange={(e) => setManuscriptDoi(e.target.value)} placeholder="e.g. doi:10.1000/xyz123" />
            </div>
            <div className="space-y-2">
              <Label>IPFS CID</Label>
              <Input
                value={manuscriptIpfsCid}
                onChange={(e) => setManuscriptIpfsCid(e.target.value)}
                placeholder="e.g. bafy... (metadata/content pointer)"
                className="font-mono"
              />
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  const res = await postJson<{ manuscriptId: string; txHash?: string }>(`/institution/register-manuscript`, {
                    title: manuscriptTitle,
                    doi: manuscriptDoi,
                    ipfsCid: manuscriptIpfsCid,
                  });
                  toast.success(`Created manuscript #${res.manuscriptId}`);
                  await queryClient.invalidateQueries({ queryKey: ["demo-overview"] });
                  await queryClient.invalidateQueries({ queryKey: ["demo-manuscripts"] });
                  setManuscriptTitle("");
                  setManuscriptDoi("");
                  setManuscriptIpfsCid("");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Create manuscript failed");
                }
              }}
            >
              Create manuscript
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Issue credential</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reviewer address</Label>
              <Input value={reviewerAddress} onChange={(e) => setReviewerAddress(e.target.value)} placeholder="0x..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type ID</Label>
                <Input value={credentialTypeId} onChange={(e) => setCredentialTypeId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Token URI</Label>
                <Input
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  placeholder="ipfs://<cid>/credential.json"
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  const res = await postJson<{ tokenId: string; txHash?: string }>(`/institution/mint-credential`, {
                    reviewerAddress,
                    credentialTypeId: Number(credentialTypeId),
                    tokenURI,
                  });
                  toast.success(`Issued credential #${res.tokenId}`);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Issue failed");
                }
              }}
            >
              Issue credential
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Register reviewer eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Credential type ID</Label>
              <Input value={credentialTypeId} onChange={(e) => setCredentialTypeId(e.target.value)} placeholder="e.g. 1" />
            </div>
            <div className="space-y-2">
              <Label>Reviewer profile token</Label>
              <Input
                value={identityCommitment}
                onChange={(e) => setIdentityCommitment(e.target.value)}
                placeholder="e.g. a numeric token string"
                className="font-mono"
              />
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  const res = await postJson<{ ok: boolean; txHash?: string }>(`/institution/enroll-reviewer`, {
                    credentialTypeId: Number(credentialTypeId),
                    identityCommitment,
                  });
                  toast.success(res.txHash ? `Registered (${res.txHash.slice(0, 10)}…)` : "Registered");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Registration failed");
                }
              }}
            >
              Register eligibility
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

