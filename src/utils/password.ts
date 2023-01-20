import argon2 from "argon2";

async function hash(text: string) {
  return await argon2.hash(text);
}

async function verify(text: string, hash: string) {
  return await argon2.verify(hash, text);
}

export const password = { hash, verify };
