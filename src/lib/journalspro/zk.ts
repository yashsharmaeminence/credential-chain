import { generateProof as semaphoreGenerateProof } from "@semaphore-protocol/proof";
import type { SemaphoreProof } from "@semaphore-protocol/proof";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { keccak256, stringToHex } from "viem";

export { Group, Identity };
export type { SemaphoreProof };
export { semaphoreGenerateProof as generateSemaphoreProof };

/** Keccak-256 of UTF-8 review text, as `bytes32` hex (for `reviewContentHash` / Semaphore message). */
export function reviewContentHashFromText(reviewText: string): `0x${string}` {
  return keccak256(stringToHex(reviewText));
}

/** `uint256(bytes32)` as bigint — must match `PeerReviewRegistry` binding `message == uint256(reviewContentHash)`. */
export function bytes32ToUint256(h: `0x${string}`): bigint {
  return BigInt(h);
}

/** Convert Semaphore proof to `PeerReviewRegistry.submitReview` arguments (minus `groupId` / IPFS cid). */
export function semaphoreProofToSubmitArgs(
  proof: SemaphoreProof,
  input: {
    groupId: bigint;
    manuscriptId: bigint;
    reviewContentHash: `0x${string}`;
    reviewIpfsCid: string;
  },
) {
  const messageUint = bytes32ToUint256(input.reviewContentHash);
  const proofMessage = BigInt(proof.message);
  if (proofMessage !== messageUint) {
    throw new Error(
      `Semaphore proof message ${proofMessage} does not match uint256(reviewContentHash) ${messageUint}`,
    );
  }
  const scope = BigInt(proof.scope);
  if (scope !== input.manuscriptId) {
    throw new Error(`Semaphore proof scope ${scope} does not match manuscriptId ${input.manuscriptId}`);
  }

  const rawPoints = proof.points as unknown as readonly (string | bigint)[];
  if (!Array.isArray(rawPoints) || rawPoints.length !== 8) {
    throw new Error("Expected Semaphore proof.points to unpack to 8 uint256 values");
  }
  const points = rawPoints.map((p) => BigInt(p)) as [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ];

  return {
    groupId: input.groupId,
    manuscriptId: input.manuscriptId,
    merkleTreeDepth: BigInt(proof.merkleTreeDepth),
    merkleTreeRoot: BigInt(proof.merkleTreeRoot),
    nullifier: BigInt(proof.nullifier),
    message: proofMessage,
    scope,
    points,
    reviewContentHash: input.reviewContentHash,
    reviewIpfsCid: input.reviewIpfsCid,
  } as const;
}

/**
 * High-level: build Semaphore proof for JournalsPro anonymous review.
 * @param identityCommitments All members in the same order as on-chain `addMember` calls (local demo).
 */
export async function generateJournalReviewProof(input: {
  identity: Identity;
  identityCommitments: bigint[];
  reviewText: string;
  manuscriptId: bigint;
}): Promise<SemaphoreProof> {
  const reviewContentHash = reviewContentHashFromText(input.reviewText);
  const message = bytes32ToUint256(reviewContentHash);
  const group = new Group(input.identityCommitments);
  return semaphoreGenerateProof(input.identity, group, message, input.manuscriptId);
}
