import { pbkdf2Sync, randomBytes } from "crypto";

// Constants for the algorithm
const ITERATIONS = 100000; // Number of iterations
const KEY_LENGTH = 64; // Length of the derived key
const DIGEST = "sha512"; // Hash digest algorithm

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  ).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || !storedHash.includes(":")) {
    return false;
  }

  try {
    const [salt, hash] = storedHash.split(":");
    const verifyHash = pbkdf2Sync(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST
    ).toString("hex");
    return hash === verifyHash;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
