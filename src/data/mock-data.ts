export interface DemoManuscript {
  id: number;
  title: string;
  doiHash: string;
  ipfsCid: string;
  openForReview: boolean;
  reviewCount: number;
  submittedAt: string;
}

export interface DemoReview {
  manuscriptId: number;
  groupId: number;
  reviewContentHash: string;
  reviewIpfsCid: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface DemoCredential {
  tokenId: number;
  credentialTypeId: number;
  typeName: string;
  tokenURI: string;
  mintTxHash: string;
}

export interface DemoStats {
  totalManuscripts: number;
  totalReviews: number;
  totalCredentialsMinted: number;
  semaphoreGroupIdForDemoType: number;
  activeReviewers: number;
}

export const MOCK_CHAIN_CONFIG = {
  chainId: 11155111,
  chainName: "Sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://rpc.sepolia.org",
  contracts: {
    credentialNFT: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    reviewerGroupRegistry: "0x2b3C4d5E6f7890aBcDeF1234567890AbCdEf1234",
    manuscriptRegistry: "0x3c4D5e6F7890AbCdEf1234567890aBcDeF123456",
    peerReviewRegistry: "0x4d5E6f7890aBcDeF1234567890AbCdEf12345678",
  },
};

export const MOCK_STATS: DemoStats = {
  totalManuscripts: 12,
  totalReviews: 47,
  totalCredentialsMinted: 23,
  semaphoreGroupIdForDemoType: 0,
  activeReviewers: 15,
};

export const MOCK_MANUSCRIPTS: DemoManuscript[] = [
  {
    id: 1,
    title: "Zero-Knowledge Proofs for Scalable Anonymous Credential Verification",
    doiHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    ipfsCid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    openForReview: true,
    reviewCount: 5,
    submittedAt: "2025-03-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Decentralized Identity Frameworks in Academic Publishing",
    doiHash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
    ipfsCid: "bafybeie5gq4jxvzmsym6hjlwxej4rwdoxt7nm6hi3t3stry4x3xgm54iku",
    openForReview: true,
    reviewCount: 3,
    submittedAt: "2025-03-18T14:20:00Z",
  },
  {
    id: 3,
    title: "Semaphore-Based Group Membership for Blind Peer Review",
    doiHash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890",
    ipfsCid: "bafybeihkoviema7g3gxyt6la7vd5ho32uj3i7wpbyga7m36o7pnhresxce",
    openForReview: false,
    reviewCount: 8,
    submittedAt: "2025-02-28T09:15:00Z",
  },
  {
    id: 4,
    title: "On-Chain Reputation Systems Without Identity Disclosure",
    doiHash: "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789012",
    ipfsCid: "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenosa7elu",
    openForReview: true,
    reviewCount: 1,
    submittedAt: "2025-03-22T16:45:00Z",
  },
];

export const MOCK_REVIEWS: DemoReview[] = [
  {
    manuscriptId: 1,
    groupId: 0,
    reviewContentHash: "0xe7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
    reviewIpfsCid: "bafybeif2qlgt7zni2q5y7oqhkfpwq6oqh7z5n6xfvw3k4l5m6n7o8p9q0r1",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 5234120,
    timestamp: "2025-03-20T11:30:00Z",
  },
  {
    manuscriptId: 1,
    groupId: 0,
    reviewContentHash: "0xf8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
    reviewIpfsCid: "bafybeig3rlht8zoj3q6z8orhlfqxq7prh8a6o7ygxw4l5m6n7o8p9q0r1s2",
    txHash: "0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef1",
    blockNumber: 5234156,
    timestamp: "2025-03-20T14:15:00Z",
  },
  {
    manuscriptId: 2,
    groupId: 0,
    reviewContentHash: "0xa9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    reviewIpfsCid: "bafybeidh4smiu9zokg4q7y9osjlgryq8qsi9b7p8zhx5l6m7n8o9p0q1r2s3",
    txHash: "0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef12",
    blockNumber: 5234200,
    timestamp: "2025-03-21T09:45:00Z",
  },
  {
    manuscriptId: 3,
    groupId: 0,
    reviewContentHash: "0xb0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    reviewIpfsCid: "",
    txHash: "0x456789013def1234567890123def1234567890123def1234567890123def1234",
    blockNumber: 5234250,
    timestamp: "2025-03-21T16:20:00Z",
  },
  {
    manuscriptId: 1,
    groupId: 0,
    reviewContentHash: "0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
    reviewIpfsCid: "bafybeiej5umjv0alh5q8z0ptkmhswq9ruj0c8q9zia6m7n8o9p0q1r2s3t4",
    txHash: "0x56789014ef12345678901234ef12345678901234ef12345678901234ef123456",
    blockNumber: 5234310,
    timestamp: "2025-03-22T10:10:00Z",
  },
];

export const MOCK_CREDENTIALS: DemoCredential[] = [
  {
    tokenId: 1,
    credentialTypeId: 1,
    typeName: "PhD — Cryptography",
    tokenURI: "data:application/json;base64,eyJuYW1lIjoiUGhEIOKAlCBDcnlwdG9ncmFwaHkiLCJkZXNjcmlwdGlvbiI6IkRvY3RvcmFsIGRlZ3JlZSBpbiBDcnlwdG9ncmFwaHkgZnJvbSBFVEggWsO8cmljaCJ9",
    mintTxHash: "0x789012345ef6789012345ef6789012345ef6789012345ef6789012345ef67890",
  },
  {
    tokenId: 2,
    credentialTypeId: 2,
    typeName: "MSc — Distributed Systems",
    tokenURI: "data:application/json;base64,eyJuYW1lIjoiTVNjIOKAlCBEaXN0cmlidXRlZCBTeXN0ZW1zIiwiZGVzY3JpcHRpb24iOiJNYXN0ZXIncyBpbiBEaXN0cmlidXRlZCBTeXN0ZW1zIGZyb20gTUlUIn0=",
    mintTxHash: "0x890123456f78901234567f78901234567f78901234567f78901234567f789012",
  },
  {
    tokenId: 3,
    credentialTypeId: 1,
    typeName: "PhD — Cryptography",
    tokenURI: "data:application/json;base64,eyJuYW1lIjoiUGhEIOKAlCBDcnlwdG9ncmFwaHkiLCJkZXNjcmlwdGlvbiI6IkRvY3RvcmFsIGRlZ3JlZSBpbiBDcnlwdG9ncmFwaHkgZnJvbSBTdGFuZm9yZCJ9",
    mintTxHash: "0x901234567890123456789012345678901234567890123456789012345678901a",
  },
];

export const truncateHash = (hash: string, chars = 6) =>
  hash ? `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}` : "—";

export const truncateAddress = (address: string) => truncateHash(address, 4);
