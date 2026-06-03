import { defineChain, type Chain } from "viem";
import {
  arbitrumSepolia,
  baseSepolia,
  hardhat,
  holesky,
  optimismSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains";

/** Chains we recognize for metadata (explorer URLs, native currency). Any other `chainId` becomes a minimal custom chain. */
const KNOWN_CHAINS: readonly Chain[] = [
  hardhat,
  sepolia,
  holesky,
  arbitrumSepolia,
  optimismSepolia,
  baseSepolia,
  polygonAmoy,
];

/**
 * Build a viem `Chain` for the app: uses known testnet/mainnet metadata when `chainId` matches, else a generic chain definition.
 * Always wires RPC to `rpcUrl` (Helius, Alchemy, public endpoint, or local Anvil).
 */
export function appChainFromEnv(rpcUrl: string, chainId: number, nameOverride?: string): Chain {
  const known = KNOWN_CHAINS.find((c) => c.id === chainId);
  if (known) {
    return defineChain({
      ...known,
      rpcUrls: {
        default: { http: [rpcUrl] },
        public: { http: [rpcUrl] },
      },
    });
  }
  const trimmed = nameOverride?.trim();
  return defineChain({
    id: chainId,
    name: trimmed && trimmed.length > 0 ? trimmed : `Chain ${chainId}`,
    nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
    rpcUrls: { default: { http: [rpcUrl] } },
  });
}

export const DEFAULT_LOCAL_CHAIN_ID = hardhat.id;
