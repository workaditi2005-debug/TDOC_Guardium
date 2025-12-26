// utils/CryptoService.js

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 200000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptVault(data, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(data))
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: Array.from(iv),
    salt: Array.from(salt),
  };
}

export async function decryptVault(vault, password) {
  const key = await deriveKey(password, new Uint8Array(vault.salt));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(vault.iv) },
    key,
    Uint8Array.from(atob(vault.ciphertext), c => c.charCodeAt(0))
  );

  return JSON.parse(decoder.decode(decrypted));
}
