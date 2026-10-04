import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  Download
} from 'lucide-react';
import { CryptoCoin, CryptoNetwork } from '../data/cryptoAssets';
import { formatCryptoAmount } from '../utils/cryptoRates';
import { CryptoIcon } from './CryptoIcon';
import { triggerHaptic } from '../utils/haptics';

export interface PaymentInvoiceViewProps {
  orderId: string;
  coin: CryptoCoin;
  network: CryptoNetwork;
  usdAmount: number;
  cryptoAmount: number;
  onBack: () => void;
  onSubmitTxHash?: (data: { orderId: string; txHash: string; coin: string; amount: number }) => Promise<boolean> | boolean;
  onSuccessDone?: () => void;
  supportUsername?: string;
}

export const PaymentInvoiceView: React.FC<PaymentInvoiceViewProps> = ({
  orderId,
  coin,
  network,
  usdAmount,
  cryptoAmount,
  onBack,
  onSubmitTxHash,
  onSuccessDone,
  supportUsername = 'ai_zke'
}) => {
  const [copiedType, setCopiedType] = useState<'address' | 'amount' | 'order' | 'memo' | null>(null);
  const [txHashInput, setTxHashInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes countdown

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: 'address' | 'amount' | 'order' | 'memo') => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmitProof = async () => {
    if (!txHashInput.trim()) {
      triggerHaptic('error');
      return;
    }
    triggerHaptic('medium');
    setIsSubmitting(true);

    try {
      if (onSubmitTxHash) {
        await onSubmitTxHash({
          orderId,
          txHash: txHashInput.trim(),
          coin: coin.symbol,
          amount: cryptoAmount
        });
      }
      setIsSuccess(true);
      triggerHaptic('success');
    } catch {
      triggerHaptic('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedCrypto = formatCryptoAmount(cryptoAmount, coin.symbol);

  // Success view
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#000000] text-white flex flex-col justify-between font-sans select-none px-5 pt-8 pb-10">
        <div className="flex flex-col items-center text-center pt-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Payment Submitted</h2>
          <p className="text-xs text-[#8295A8] mt-1 max-w-xs">
            Your transaction hash has been recorded. Your balance will update automatically upon network confirmation.
          </p>

          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-5 w-full mt-6 text-left space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8295A8]">Order ID:</span>
              <span className="font-mono text-white font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8295A8]">Asset:</span>
              <span className="text-white font-bold">{coin.name} ({network.shortName})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8295A8]">Amount:</span>
              <span className="text-emerald-400 font-bold">{formattedCrypto} {coin.symbol} (${usdAmount.toFixed(2)})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8295A8]">TXID:</span>
              <span className="font-mono text-white truncate max-w-[160px]">{txHashInput}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSuccessDone || onBack}
          className="w-full py-4 bg-[#2EA5FF] hover:bg-[#208DE6] text-white rounded-2xl font-bold text-sm shadow-xl active:scale-[0.98] transition-all cursor-pointer"
        >
          Return to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#000000] text-white flex flex-col justify-between font-sans select-none px-5 pt-4 pb-8">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#8295A8] hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-white">Payment Invoice</h1>
            <span className="text-[11px] text-[#8295A8] font-mono">{orderId}</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 flex flex-col items-center text-center shadow-xl mb-5">
          <div className="bg-white p-3 rounded-2xl shadow-inner mb-4">
            <QRCodeSVG 
              value={network.address}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>

          <div className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-tight">
            <span>{formattedCrypto}</span>
            <span className="text-[#2EA5FF]">{coin.symbol}</span>
          </div>
          <div className="text-xs text-[#8295A8] mt-0.5 font-medium">
            ≈ ${usdAmount.toFixed(2)} USD • {network.name}
          </div>
        </div>

        {/* Deposit Address Box */}
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-[#8295A8]">Deposit Address</span>
            <span className="text-[11px] font-bold text-[#2EA5FF] uppercase">{network.shortName}</span>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <span className="text-xs font-mono text-white break-all select-all font-medium leading-relaxed">
              {network.address}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(network.address, 'address')}
              className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white shrink-0 active:scale-90 transition-all cursor-pointer"
            >
              {copiedType === 'address' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Memo / Tag if required */}
        {network.memoRequired && network.memo && (
          <div className="bg-[#1C1C1E] border border-amber-500/20 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-amber-400">Memo / Tag (Required)</span>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <span className="text-sm font-mono text-white font-bold">{network.memo}</span>
              <button
                type="button"
                onClick={() => handleCopy(network.memo!, 'memo')}
                className="p-2 rounded-xl bg-white/[0.06] text-white shrink-0"
              >
                {copiedType === 'memo' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Submit TXID / Hash input */}
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-4 mb-5">
          <label className="text-xs font-semibold text-[#8295A8] block mb-2">
            Submit Transaction Hash (TXID)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={txHashInput}
              onChange={(e) => setTxHashInput(e.target.value)}
              placeholder="Paste transaction hash here..."
              className="flex-1 bg-[#141416] border border-white/[0.06] focus:border-[#2EA5FF] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none"
            />
            <button
              type="button"
              disabled={isSubmitting || !txHashInput.trim()}
              onClick={handleSubmitProof}
              className="px-4 py-2.5 bg-[#2EA5FF] hover:bg-[#208DE6] disabled:opacity-40 text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer shrink-0"
            >
              {isSubmitting ? 'Checking...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Support footer */}
      <div className="text-center pt-2">
        <a
          href={`https://t.me/${supportUsername.replace(/^@/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#8295A8] hover:text-white transition-colors"
        >
          Need help? Contact Support (@{supportUsername.replace(/^@/, '')})
        </a>
      </div>
    </div>
  );
};
