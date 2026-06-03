import { Identity } from "@/lib/journalspro/zk";

const STORAGE_KEY = "journalspro.semaphoreIdentity.v1";

type StoredPayload = {
  v: 1;
  kdf: "PBKDF2";
  it: number;
  saltB64: string;
  ivB64: string;
  ctB64: string;
};

function bytesToB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveAesKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export function hasStoredIdentity(): boolean {
  return localStorage.getItem(STORAGE_KEY) != null;
}

export function clearStoredIdentity(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function saveIdentityEncrypted(identity: Identity, passphrase: string): Promise<void> {
  const secret = identity.export(); // treat as highly sensitive
  const enc = new TextEncoder();

  const iterations = 210_000;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt, iterations);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(secret));

  const payload: StoredPayload = {
    v: 1,
    kdf: "PBKDF2",
    it: iterations,
    saltB64: bytesToB64(salt),
    ivB64: bytesToB64(iv),
    ctB64: bytesToB64(new Uint8Array(ct)),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function loadIdentityEncrypted(passphrase: string): Promise<Identity> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) throw new Error("No saved profile found in this browser.");

  let payload: StoredPayload;
  try {
    payload = JSON.parse(raw) as StoredPayload;
  } catch {
    throw new Error("Saved profile is corrupted (invalid JSON).");
  }
  if (payload.v !== 1) throw new Error("Saved profile version is unsupported.");

  const salt = b64ToBytes(payload.saltB64);
  const iv = b64ToBytes(payload.ivB64);
  const ct = b64ToBytes(payload.ctB64);
  const key = await deriveAesKey(passphrase, salt, payload.it);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  const secret = new TextDecoder().decode(new Uint8Array(pt));
  return Identity.import(secret);
}

