import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Loader2, ShieldCheck, Upload, UserPlus, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { truncateHash } from "@/data/mock-data";
import { api, type DemoManuscript } from "@/lib/api";
import { postJson } from "@/lib/http";
import {
  clearStoredIdentity,
  hasStoredIdentity,
  loadIdentityEncrypted,
  saveIdentityEncrypted,
} from "@/lib/identity-store";
import { Identity, generateJournalReviewProof, reviewContentHashFromText, semaphoreProofToSubmitArgs, type SemaphoreProof } from "@journalspro/zk";
import { appChainFromEnv, peerReviewRegistryAbi } from "@journalspro/shared";
import { createPublicClient, createWalletClient, custom, http } from "viem";

type Step = "identity" | "enroll" | "write" | "proof" | "submit" | "done";

const STEPS: { id: Exclude<Step, "done">; label: string; icon: React.ElementType }[] = [
  { id: "identity", label: "Create Reviewer Profile", icon: ShieldCheck },
  { id: "enroll", label: "Register Eligibility", icon: UserPlus },
  { id: "write", label: "Draft Review", icon: Upload },
  { id: "proof", label: "Generate Privacy Verification", icon: ShieldCheck },
  { id: "submit", label: "Submit Review", icon: CheckCircle },
];

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
    };
  }
}

function parseBigIntList(csv: string): bigint[] {
  const parts = csv
    .split(/[,\s]+/g)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return [];
  return parts.map((p) => BigInt(p));
}

const ReviewerFlow = () => {
  const queryClient = useQueryClient();
  const { data: config } = useQuery({ queryKey: ["demo-config"], queryFn: api.demoConfig });
  const { data: overview } = useQuery({ queryKey: ["demo-overview"], queryFn: api.demoOverview });

  const chainIdExpected = config?.chainId ?? null;
  const explorerBase = config?.blockExplorerUrl ?? null;

  const groupIdForDemoType = overview?.stats.semaphoreGroupIdForDemoType ?? null;
  const demoCredentialTypeId = overview?.stats.demoCredentialTypeId ?? null;

  const manuscripts = overview?.manuscripts ?? [];

  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);

  const [walletAccount, setWalletAccount] = useState<string | null>(null);

  const [identity, setIdentity] = useState<Identity | null>(null);
  const [identityCommitment, setIdentityCommitment] = useState<string>("");
  const [profilePassphrase, setProfilePassphrase] = useState<string>("");
  const [importSecret, setImportSecret] = useState<string>("");
  const [identityCommitmentsCsv, setIdentityCommitmentsCsv] = useState<string>("");
  const [enrollTxHash, setEnrollTxHash] = useState<string | null>(null);

  const [manuscriptId, setManuscriptId] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");

  const [proof, setProof] = useState<SemaphoreProof | null>(null);
  const [reviewContentHash, setReviewContentHash] = useState<`0x${string}` | null>(null);
  const [reviewIpfsCid, setReviewIpfsCid] = useState<string>("");
  const [submitTxHash, setSubmitTxHash] = useState<string | null>(null);

  const done = currentStep >= STEPS.length;

  const currentStepId = useMemo(() => {
    return done ? "done" : STEPS[currentStep]?.id ?? "identity";
  }, [currentStep, done]);

  useEffect(() => {
    if (!manuscriptId && manuscripts.length > 0) {
      const first = manuscripts[0] as DemoManuscript;
      setManuscriptId(first.id);
    }
  }, [manuscripts, manuscriptId]);

  useEffect(() => {
    if (identityCommitment && !identityCommitmentsCsv) {
      setIdentityCommitmentsCsv(identityCommitment);
    }
  }, [identityCommitment, identityCommitmentsCsv]);

  const { data: groupMembers } = useQuery({
    queryKey: ["demo-group-members", groupIdForDemoType],
    enabled: !!groupIdForDemoType,
    queryFn: async () => api.demoGroupMembers(String(groupIdForDemoType)),
  });

  useEffect(() => {
    if (!groupMembers?.members?.length) return;
    // Auto-fill commitments from on-chain group (in correct index order).
    setIdentityCommitmentsCsv(groupMembers.members.join(","));
  }, [groupMembers]);

  const groupHasIdentity =
    !!identityCommitment &&
    !!groupMembers?.members?.length &&
    groupMembers.members.some((m) => m === identityCommitment);

  const copyText = async (text: string) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard unavailable in this browser.");
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Copied.");
  };

  const ensureWalletConnectedAndOnChain = async (): Promise<string> => {
    if (!window.ethereum) throw new Error("No wallet provider detected. Install MetaMask or another EVM wallet.");
    if (!chainIdExpected) throw new Error("Missing chainId from protocol config.");

    const eth = window.ethereum;
    await eth.request({ method: "eth_requestAccounts" });

    const accounts = (await eth.request({ method: "eth_accounts" })) as string[];
    const account = accounts?.[0] ?? null;
    if (!account) throw new Error("Wallet did not return an account.");

    const currentChainIdHex = (await eth.request({ method: "eth_chainId" })) as string;
    const currentChainId = Number(currentChainIdHex);
    if (currentChainId !== chainIdExpected) {
      const hex = `0x${chainIdExpected.toString(16)}`;
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
    }

    setWalletAccount(account);
    return account;
  };

  const reset = () => {
    setCurrentStep(0);
    setRunning(false);
    setWalletAccount(null);
    setIdentity(null);
    setIdentityCommitment("");
      setProfilePassphrase("");
      setImportSecret("");
    setIdentityCommitmentsCsv("");
    setEnrollTxHash(null);
    setManuscriptId(manuscripts[0]?.id ?? "");
    setReviewText("");
    setProof(null);
    setReviewContentHash(null);
    setReviewIpfsCid("");
    setSubmitTxHash(null);
  };

  const identityReady = !!identityCommitment && !!identity;
  const enrollReady = identityReady && demoCredentialTypeId !== null;
  const enrollDone = enrollTxHash !== null;
  const proofReady =
    enrollReady &&
    enrollDone &&
    groupIdForDemoType !== null &&
    groupHasIdentity &&
    manuscriptId.trim().length > 0 &&
    reviewText.trim().length > 0 &&
    identityCommitmentsCsv.trim().length > 0;

  const advanceIfSucceeded = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));

  const doGenerateIdentity = async () => {
    setRunning(true);
    try {
      const newIdentity = new Identity();
      const commitmentStr = String((newIdentity as any).commitment);
      setIdentity(newIdentity);
      setIdentityCommitment(commitmentStr);
      setIdentityCommitmentsCsv(commitmentStr);
      toast.success("Profile created (local only).");
      advanceIfSucceeded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate identity.");
    } finally {
      setRunning(false);
    }
  };

  const doSaveProfile = async () => {
    if (!identity) {
      toast.error("Create or load a profile first.");
      return;
    }
    if (!profilePassphrase.trim()) {
      toast.error("Enter a passphrase to encrypt the profile in this browser.");
      return;
    }
    setRunning(true);
    try {
      await saveIdentityEncrypted(identity, profilePassphrase);
      toast.success("Profile saved in this browser (encrypted).");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setRunning(false);
    }
  };

  const doLoadProfile = async () => {
    if (!hasStoredIdentity()) {
      toast.error("No saved profile found in this browser.");
      return;
    }
    if (!profilePassphrase.trim()) {
      toast.error("Enter the passphrase used to encrypt the saved profile.");
      return;
    }
    setRunning(true);
    try {
      const id = await loadIdentityEncrypted(profilePassphrase);
      const commitmentStr = String((id as any).commitment);
      setIdentity(id);
      setIdentityCommitment(commitmentStr);
      toast.success("Profile loaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setRunning(false);
    }
  };

  const doClearSavedProfile = () => {
    clearStoredIdentity();
    toast.success("Saved profile cleared from this browser.");
  };

  const doExportProfile = async () => {
    if (!identity) {
      toast.error("Create or load a profile first.");
      return;
    }
    try {
      const secret = identity.export();
      await copyText(secret);
      toast.warning("Exported secret copied. Treat it like a private key.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to export profile.");
    }
  };

  const doImportProfile = async () => {
    const secret = importSecret.trim();
    if (!secret) {
      toast.error("Paste an exported secret to import.");
      return;
    }
    setRunning(true);
    try {
      const id = Identity.import(secret);
      const commitmentStr = String((id as any).commitment);
      setIdentity(id);
      setIdentityCommitment(commitmentStr);
      setIdentityCommitmentsCsv(commitmentStr);
      toast.success("Profile imported (local only).");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to import profile.");
    } finally {
      setRunning(false);
    }
  };

  const doEnroll = async () => {
    if (!enrollReady) {
      toast.error("Missing identity commitment or credential type.");
      return;
    }
    setRunning(true);
    try {
      if (!identityCommitment) throw new Error("Missing identityCommitment.");
      const res = await postJson<{ ok: boolean; txHash?: `0x${string}` }>(`/institution/enroll-reviewer`, {
        credentialTypeId: demoCredentialTypeId,
        identityCommitment,
      });
      if (!res.ok) throw new Error("Enrollment failed.");
      if (res.txHash) setEnrollTxHash(res.txHash);
      toast.success("Eligibility registered successfully.");
      if (groupIdForDemoType) {
        await queryClient.invalidateQueries({ queryKey: ["demo-group-members", groupIdForDemoType] });
      }
      advanceIfSucceeded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enroll failed. Check API logs/env (INSTITUTION_PRIVATE_KEY).");
    } finally {
      setRunning(false);
    }
  };

  const doGenerateProof = async () => {
    if (!proofReady) {
      if (!groupHasIdentity) {
        toast.error("Your identity is not in the group yet. Wait a moment after enrollment and try again.");
      } else {
        toast.error("Missing inputs for verification.");
      }
      return;
    }
    setRunning(true);
    try {
      if (!identity || !groupIdForDemoType || !manuscriptId || !reviewText) throw new Error("Missing proof inputs.");
      if (!reviewText.trim()) throw new Error("Missing reviewText.");

      const identityCommitments = groupMembers?.members?.length
        ? groupMembers.members.map((m) => BigInt(m))
        : parseBigIntList(identityCommitmentsCsv);
      if (identityCommitments.length === 0) throw new Error("Identity commitments list is empty.");

      const manuscriptIdBig = BigInt(manuscriptId);
      const proofResult = await generateJournalReviewProof({
        identity,
        identityCommitments,
        reviewText,
        manuscriptId: manuscriptIdBig,
      });

      const contentHash = reviewContentHashFromText(reviewText);
      setProof(proofResult);
      setReviewContentHash(contentHash);

      toast.success("Privacy verification generated.");
      advanceIfSucceeded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Proof generation failed.");
    } finally {
      setRunning(false);
    }
  };

  const submitOnChain = async (account: string) => {
    if (!config) throw new Error("Missing protocol config.");
    if (!proof || !reviewContentHash) throw new Error("Missing proof arguments.");
    if (!groupIdForDemoType) throw new Error("Missing reviewer groupId.");

    setRunning(true);
    try {
      // Pin review text to IPFS (optional; uses Pinata when configured).
      let cid = "";
      try {
        const pinned = await postJson<{ cid: string }>(`/ipfs/pin-review`, { reviewText });
        cid = pinned.cid ?? "";
        if (!cid) {
          toast.warning(
            "Review was not pinned to IPFS (missing IPFS credentials or pinning failed). Submitting on-chain without a content link.",
          );
        }
      } catch (err) {
                toast.warning(err instanceof Error ? err.message : "Content pinning failed; submitting without a content link.");
      }

      const submitArgs = semaphoreProofToSubmitArgs(proof, {
        groupId: BigInt(groupIdForDemoType),
        manuscriptId: BigInt(manuscriptId),
        reviewContentHash,
        reviewIpfsCid: cid,
      });

      const chain = appChainFromEnv(config.rpcUrl, config.chainId, config.chainName);
      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum as any),
        account: account as any,
      });

      const publicClient = createPublicClient({
        chain,
        transport: http(config.rpcUrl),
      });

      let gas: bigint | undefined;
      try {
        gas = await publicClient.estimateContractGas({
          address: config.contracts.peerReviewRegistry,
          abi: peerReviewRegistryAbi as any,
          functionName: "submitReview",
          args: [
            submitArgs.groupId,
            submitArgs.manuscriptId,
            submitArgs.merkleTreeDepth,
            submitArgs.merkleTreeRoot,
            submitArgs.nullifier,
            submitArgs.message,
            submitArgs.scope,
            submitArgs.points,
            submitArgs.reviewContentHash,
            submitArgs.reviewIpfsCid,
          ],
          account: account as any,
        });
        // Add some buffer but keep comfortably under typical block gas limits.
        gas = (gas * 12n) / 10n;
        if (gas > 5_000_000n) gas = 5_000_000n;
      } catch {
        // If estimation fails (RPC oddities / revert), use a conservative cap.
        gas = 3_000_000n;
      }

      const txHash = await walletClient.writeContract({
        address: config.contracts.peerReviewRegistry,
        abi: peerReviewRegistryAbi as any,
        functionName: "submitReview",
        args: [
          submitArgs.groupId,
          submitArgs.manuscriptId,
          submitArgs.merkleTreeDepth,
          submitArgs.merkleTreeRoot,
          submitArgs.nullifier,
          submitArgs.message,
          submitArgs.scope,
          submitArgs.points,
          submitArgs.reviewContentHash,
          submitArgs.reviewIpfsCid,
        ],
        gas,
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setReviewIpfsCid(cid);
      setSubmitTxHash(txHash as string);
      toast.success("Submitted review on-chain.");
      advanceIfSucceeded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "On-chain submission failed.");
    } finally {
      setRunning(false);
    }
  };

  const renderStepContent = () => {
    if (currentStepId === "identity") {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
                <div className="font-semibold text-foreground">Create a private reviewer profile</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Your profile is generated in your browser. Nothing is shared off-chain.
                </div>
            </div>
          </div>

          <button
            onClick={doGenerateIdentity}
            disabled={running}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? "Creating…" : "Create Profile"}
          </button>

          <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
            <div className="text-sm font-medium text-foreground">Save / load (encrypted in this browser)</div>
            <input
              type="password"
              value={profilePassphrase}
              onChange={(e) => setProfilePassphrase(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              placeholder="Passphrase to encrypt/decrypt your profile"
              autoComplete="current-password"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                onClick={doSaveProfile}
                disabled={running || !identityReady}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={doLoadProfile}
                disabled={running}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load
              </button>
              <button
                onClick={doClearSavedProfile}
                disabled={running}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              This saves an encrypted copy in <span className="font-mono">localStorage</span>. If you lose the passphrase,
              you cannot recover it.
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
            <div className="text-sm font-medium text-foreground">Export / import (advanced)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                onClick={doExportProfile}
                disabled={running || !identityReady}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export secret (copy)
              </button>
              <button
                onClick={doImportProfile}
                disabled={running}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import secret
              </button>
            </div>
            <textarea
              value={importSecret}
              onChange={(e) => setImportSecret(e.target.value)}
              className="w-full min-h-20 px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-xs"
              placeholder="Paste exported secret here to import"
            />
            <div className="text-xs text-muted-foreground">
              Treat exported secrets like a private key. Anyone with it can generate proofs as you.
            </div>
          </div>

          {identityCommitment ? (
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">Private profile token</div>
                <button
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-secondary"
                  onClick={() => copyText(identityCommitment)}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
              <div className="font-mono text-xs text-foreground break-all">{truncateHash(identityCommitment, 8)}</div>
            </div>
          ) : null}
        </div>
      );
    }

    if (currentStepId === "enroll") {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">Register eligibility</div>
              <div className="text-sm text-muted-foreground mt-1">
                Requires an institution-backed server configuration to register your eligibility.
              </div>
            </div>
          </div>

          <button
            onClick={doEnroll}
            disabled={running || !enrollReady}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? "Registering…" : "Register Eligibility"}
          </button>

          {enrollTxHash ? (
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
              <div className="text-sm text-muted-foreground">Enrollment tx</div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-xs break-all">{truncateHash(enrollTxHash, 8)}</div>
                {explorerBase ? (
                  <a href={`${explorerBase}/tx/${enrollTxHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    View
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {!enrollReady ? (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Create a profile first (step 1).
            </div>
          ) : null}
        </div>
      );
    }

    if (currentStepId === "write") {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">Draft your anonymous review</div>
              <div className="text-sm text-muted-foreground mt-1">
                Your submission will be linked to the selected manuscript for public verification.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Manuscript</label>
            <select
              value={manuscriptId}
              onChange={(e) => setManuscriptId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              {manuscripts.map((m) => (
                <option key={m.id} value={m.id} disabled={!m.openForReview}>
                  {m.title} (#{m.id}){m.openForReview ? "" : " - closed"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Review text</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full min-h-28 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              placeholder="Write your review. A verification reference will be stored on-chain."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Group membership list (advanced)</label>
            <input
              value={identityCommitmentsCsv}
              onChange={(e) => setIdentityCommitmentsCsv(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-xs"
              placeholder="Paste one or more tokens, separated by commas or spaces"
            />
            <div className="text-xs text-muted-foreground">
              Verification depends on using the same member list and ordering as the reviewer network.
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
            <div className="text-sm text-muted-foreground">Preview: review reference</div>
            <div className="font-mono text-xs text-foreground break-all">
              {reviewText.trim().length > 0 ? reviewContentHashFromText(reviewText) : "—"}
            </div>
          </div>

          <button
            onClick={() => {
              if (!manuscriptId || !reviewText.trim()) {
                toast.error("Select a manuscript and enter review text first.");
                return;
              }
              advanceIfSucceeded();
            }}
            disabled={running}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Proof
          </button>
        </div>
      );
    }

    if (currentStepId === "proof") {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">Generate the privacy verification</div>
              <div className="text-sm text-muted-foreground mt-1">
                Generated in your browser using your profile and reviewer group membership.
              </div>
            </div>
          </div>

          {!enrollDone ? (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Registration step not completed yet.
            </div>
          ) : null}

          {enrollDone && !groupHasIdentity ? (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Waiting for your eligibility to appear in the network. Try again in a few seconds.
            </div>
          ) : null}

          {!groupIdForDemoType ? (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Missing reviewer network settings.
            </div>
          ) : null}

          <button
            onClick={doGenerateProof}
            disabled={running || !proofReady}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </span>
            ) : (
              "Generate Privacy Verification"
            )}
          </button>
        </div>
      );
    }

    if (currentStepId === "submit") {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">Attach content and submit</div>
              <div className="text-sm text-muted-foreground mt-1">
                The API may store a content link (if configured), then you submit the transaction.
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
              const account = await ensureWalletConnectedAndOnChain();
              await submitOnChain(account);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Wallet connection failed.");
                return;
              }
            }}
            disabled={running || !proofReady}
            className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </span>
            ) : (
              "Attach & Submit Review"
            )}
          </button>

          {reviewIpfsCid || submitTxHash ? (
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
              {reviewIpfsCid ? (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Pinned content link</div>
                  <div className="font-mono text-xs break-all">{truncateHash(reviewIpfsCid, 10)}</div>
                </div>
              ) : null}
              {submitTxHash ? (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Transaction id</div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-xs break-all">{truncateHash(submitTxHash, 10)}</div>
                    {explorerBase ? (
                      <a href={`${explorerBase}/tx/${submitTxHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        View
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Reviewer Flow</h2>
      <p className="text-sm text-muted-foreground mb-6">Anonymous reviewer submission with on-chain verification.</p>

      <div className="bg-card border border-border rounded-xl card-shadow p-6">
        <div className="flex flex-col gap-4 mb-8">
          {STEPS.map((step, i) => {
            const completed = i < currentStep;
            const active = i === currentStep && !running;
            const processing = i === currentStep && running;

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    completed
                      ? "bg-primary border-primary"
                      : active
                        ? "border-primary bg-primary/10"
                        : processing
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-muted"
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                  ) : processing ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <step.icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>

                <div>
                  <span
                    className={`text-sm font-medium ${
                      completed ? "text-primary" : active || processing ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {processing ? <span className="ml-2 text-xs text-muted-foreground">Processing…</span> : null}
                </div>
              </div>
            );
          })}
        </div>

        {done ? (
          <div className="text-center space-y-3">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 text-primary font-semibold">
              <CheckCircle className="w-5 h-5" />
              Review submitted anonymously!
            </motion.div>
            <div className="text-xs font-mono text-muted-foreground">
              {submitTxHash ? `tx ${truncateHash(submitTxHash, 8)}` : ""}
            </div>
            <button onClick={reset} className="px-6 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors">
              Submit Another Review
            </button>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>
    </div>
  );
};

export default ReviewerFlow;
