// Components
export { WalletView } from './components/WalletView';
export type { WalletViewProps, WalletTransaction } from './components/WalletView';

export { DepositView } from './components/DepositView';
export type { DepositViewProps, DepositOrderData } from './components/DepositView';

export { PaymentInvoiceView } from './components/PaymentInvoiceView';
export type { PaymentInvoiceViewProps } from './components/PaymentInvoiceView';

export { CryptoIcon } from './components/CryptoIcon';
export { VerifiedBadge } from './components/VerifiedBadge';
export { TelegramStarIcon, InlineTelegramStarSvg } from './components/TelegramStarIcon';
export { WalletPinLock } from './components/WalletPinLock';
export { FaWalletIcon, FaDollarIcon, FaGiftIcon, TelegramPlaneIcon } from './components/CustomIcons';

// Data & Assets
export { SUPPORTED_COINS, cryptoAssets } from './data/cryptoAssets';
export type { CryptoCoin, CryptoNetwork } from './data/cryptoAssets';

// Utils
export { fetchLiveCryptoRates, formatCryptoAmount, FALLBACK_RATES } from './utils/cryptoRates';
export { 
  isWalletPinSet, 
  isWalletUnlockedInSession, 
  setWalletSessionUnlocked, 
  saveWalletPin, 
  verifyWalletPin, 
  removeWalletPin 
} from './utils/walletSecurity';
export { triggerHaptic } from './utils/haptics';
