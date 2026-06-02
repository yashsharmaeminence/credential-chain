export type DemoConfigResponse = {
  chainId: number;
  chainName: string;
  blockExplorerUrl: string | null;
  rpcUrl: string;
  contracts: {
    credentialNFT: string;
    reviewerGroupRegistry: string;
    manuscriptRegistry: string;
    peerReviewRegistry: string;
  };
  logsFromBlock: string;
};

export type DemoManuscript = {
  id: string;
  doiHash: `0x${string}`;
  ipfsCid: string;
  title: string;
  openForReview: boolean;
  reviewCount: string;
};

export type DemoReview = {
  txHash: `0x${string}`;
  blockNumber: string;
  logIndex: number;
  groupId: string;
  manuscriptId: string;
  nullifier: string;
  message: string;
  scope: string;
  reviewContentHash: `0x${string}`;
  reviewIpfsCid: string;
};

export type DemoStats = {
  manuscriptCount: string;
  totalReviews: string;
  credentialsMinted: string;
  demoCredentialTypeId: number;
  semaphoreGroupIdForDemoType: string | null;
};

export type DemoOverviewResponse = {
  stats: DemoStats;
  manuscripts: DemoManuscript[];
  reviews: DemoReview[];
};

import { getJson } from "@/lib/http";

export const api = {
  demoConfig: () => getJson<DemoConfigResponse>("/demo/config"),
  demoOverview: () => getJson<DemoOverviewResponse>("/demo/overview"),
  demoGroupMembers: (groupId: string) =>
    getJson<{ groupId: string; semaphore: `0x${string}`; members: string[] }>(`/demo/group-members/${groupId}`),
};

