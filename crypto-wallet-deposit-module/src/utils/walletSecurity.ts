const WALLET_PIN_KEY = 'crypto_wallet_pin_hash';
const WALLET_UNLOCKED_SESSION_KEY = 'crypto_wallet_unlocked_session';

export function isWalletPinSet(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(WALLET_PIN_KEY));
}

export function isWalletUnlockedInSession(): boolean {
  if (typeof window === 'undefined') return true;
  if (!isWalletPinSet()) return true;
  return sessionStorage.getItem(WALLET_UNLOCKED_SESSION_KEY) === 'true';
}

export function setWalletSessionUnlocked(unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  if (unlocked) {
    sessionStorage.setItem(WALLET_UNLOCKED_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(WALLET_UNLOCKED_SESSION_KEY);
  }
}

export function saveWalletPin(pin: string): void {
  if (typeof window === 'undefined') return;
  // Simple obfuscated hash for client session PIN
  const hash = btoa(`pin_${pin}_secure_salt`);
  localStorage.setItem(WALLET_PIN_KEY, hash);
  setWalletSessionUnlocked(true);
}

export function verifyWalletPin(pin: string): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(WALLET_PIN_KEY);
  if (!stored) return true;
  const testHash = btoa(`pin_${pin}_secure_salt`);
  return stored === testHash;
}

export function removeWalletPin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WALLET_PIN_KEY);
  sessionStorage.removeItem(WALLET_UNLOCKED_SESSION_KEY);
}
