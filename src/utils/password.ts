import crypto from 'crypto';
const salt = "UwMpbT7KOGuqkEdanj2O5t";
const iterations = 390000;

async function hash(text: string) {
  const derivedKey = crypto.pbkdf2Sync(text, salt, iterations, 32, 'sha256');

  const key = derivedKey.toString("base64");
  const hashed = `pbkdf2_sha256$${iterations}$${salt}$${key}`;

  return hashed
}

async function verify(text: string, hash: string) {
  const derivedKey = crypto.pbkdf2Sync(text, salt, iterations, 32, 'sha256');

  const key = derivedKey.toString("base64");
  const hashed = `pbkdf2_sha256$${iterations}$${salt}$${key}`;

  return hashed === hash
}

export const password = { hash, verify };
