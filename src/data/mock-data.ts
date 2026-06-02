export const truncateHash = (hash: string, chars = 6) =>
  hash ? `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}` : "—";

export const truncateAddress = (address: string) => truncateHash(address, 4);
