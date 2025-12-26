// utils/storage.js

export function saveVault(vault) {
  return new Promise(resolve => {
    chrome.storage.local.set({ vault }, resolve);
  });
}

export function loadVault() {
  return new Promise(resolve => {
    chrome.storage.local.get(["vault"], res => {
      resolve(res.vault || null);
    });
  });
}

export function clearVault() {
  return new Promise(resolve => {
    chrome.storage.local.remove("vault", resolve);
  });
}
