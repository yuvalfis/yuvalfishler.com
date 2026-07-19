export type UpWestAuthResult = "authorized" | "unauthorized" | "unavailable";

export const UPWEST_COOKIE_NAME = "upwest_session";
export const UPWEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const SESSION_TOKEN_CONTEXT = "upwest-session-v1";
const SESSION_TOKEN_PATTERN = /^([1-9]\d*)\.([0-9a-f]{64})$/;

const textEncoder = new TextEncoder();

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(value)));
}

async function hmacSha256(value: string, keyMaterial: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(keyMaterial),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(value)));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }

  return bytes;
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return difference === 0;
}

async function digestsMatch(candidate: string, expected: string): Promise<boolean> {
  const [candidateDigest, expectedDigest] = await Promise.all([sha256(candidate), sha256(expected)]);
  return constantTimeEqual(candidateDigest, expectedDigest);
}

function sessionSignaturePayload(expiresAtEpochSeconds: number): string {
  return `${SESSION_TOKEN_CONTEXT}:${expiresAtEpochSeconds}`;
}

export async function authenticateUpWestToken(
  token: string | null,
  configuredPassword: string | undefined,
): Promise<UpWestAuthResult> {
  if (!configuredPassword) {
    return "unavailable";
  }

  if (!token) {
    return "unauthorized";
  }

  return (await digestsMatch(token, configuredPassword)) ? "authorized" : "unauthorized";
}

export async function deriveUpWestSessionToken(configuredPassword: string): Promise<string> {
  const expiresAtEpochSeconds =
    Math.floor(Date.now() / 1000) + UPWEST_COOKIE_MAX_AGE_SECONDS;
  const signature = await hmacSha256(
    sessionSignaturePayload(expiresAtEpochSeconds),
    configuredPassword,
  );

  return `${expiresAtEpochSeconds}.${toHex(signature)}`;
}

export async function authenticateUpWestSession(
  sessionCookie: string | null,
  configuredPassword: string | undefined,
): Promise<UpWestAuthResult> {
  if (!configuredPassword) {
    return "unavailable";
  }

  if (!sessionCookie) {
    return "unauthorized";
  }

  const tokenParts = SESSION_TOKEN_PATTERN.exec(sessionCookie);

  if (!tokenParts) {
    return "unauthorized";
  }

  const expiresAtEpochSeconds = Number(tokenParts[1]);
  const nowEpochSeconds = Math.floor(Date.now() / 1000);

  if (
    !Number.isSafeInteger(expiresAtEpochSeconds) ||
    expiresAtEpochSeconds <= nowEpochSeconds ||
    expiresAtEpochSeconds > nowEpochSeconds + UPWEST_COOKIE_MAX_AGE_SECONDS
  ) {
    return "unauthorized";
  }

  const candidateSignature = fromHex(tokenParts[2]);
  const expectedSignature = await hmacSha256(
    sessionSignaturePayload(expiresAtEpochSeconds),
    configuredPassword,
  );

  return constantTimeEqual(candidateSignature, expectedSignature) ? "authorized" : "unauthorized";
}
