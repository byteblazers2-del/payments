import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { SUPPORTED_COINS, CryptoCoin, CryptoNetwork } from '../data/cryptoAssets';
import { fetchLiveCryptoRates, formatCryptoAmount, FALLBACK_RATES } from '../utils/cryptoRates';
import { CryptoIcon } from './CryptoIcon';
import { VerifiedBadge } from './VerifiedBadge';
import { triggerHaptic } from '../utils/haptics';

export interface DepositOrderData {
  orderId: string;
  coin: CryptoCoin;
  network: CryptoNetwork;
  usdAmount: number;
  cryptoAmount: number;
  rates: Record<string, number>;
}

export interface DepositViewProps {
  initialCoin?: CryptoCoin;
  onBack?: () => void;
  onProceedToInvoice: (data: DepositOrderData) => void;
  minDepositUsd?: number;
}

export const DepositView: React.FC<DepositViewProps> = ({
  initialCoin,
  onBack,
  onProceedToInvoice,
  minDepositUsd = 5
}) => {
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>(initialCoin || SUPPORTED_COINS.find(c => c.symbol === 'USDT') || SUPPORTED_COINS[0]);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState<number>(selectedCoin.defaultNetworkIndex || 0);
  const [usdAmount, setUsdAmount] = useState<string>('50');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [showNetworkModal, setShowNetworkModal] = useState<boolean>(false);
  const [showCoinModal, setShowCoinModal] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveCryptoRates().then(setRates);
  }, []);

  const currentNetwork = selectedCoin.networks[selectedNetworkIndex] || selectedCoin.networks[0];
  const coinRate = rates[selectedCoin.symbol] || FALLBACK_RATES[selectedCoin.symbol] || 1;
  const parsedUsd = parseFloat(usdAmount) || 0;
  const calculatedCrypto = coinRate > 0 ? parsedUsd / coinRate : parsedUsd;

  const handleAmountChange = (val: string) => {
    setUsdAmount(val);
    const num = parseFloat(val);
    if (!val || isNaN(num) || num < minDepositUsd) {
      setAmountError(`Minimum deposit is $${minDepositUsd}`);
    } else {
      setAmountError(null);
    }
  };

  const handleProceed = () => {
    if (parsedUsd < minDepositUsd) {
      setAmountError(`Minimum deposit is $${minDepositUsd}`);
      triggerHaptic('error');
      return;
    }
    triggerHaptic('medium');
    const orderId = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    onProceedToInvoice({
      orderId,
      coin: selectedCoin,
      network: currentNetwork,
      usdAmount: parsedUsd,
      cryptoAmount: calculatedCrypto,
      rates
    });
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#000000] text-white flex flex-col justify-between font-sans select-none px-5 pt-4 pb-8">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#8295A8] hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white">Deposit Crypto</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Coin Selector Field */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-[#8295A8] block mb-2">Select Asset</label>
          <div
            onClick={() => {
              triggerHaptic('selection');
              setShowCoinModal(true);
            }}
            className="bg-[#1C1C1E] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3">
              <CryptoIcon symbol={selectedCoin.symbol} className="w-9 h-9 rounded-full" />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-white text-base">{selectedCoin.name}</span>
                  <VerifiedBadge className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs text-[#8295A8] mt-0.5 font-medium">
                  {selectedCoin.symbol} • ${coinRate >= 1 ? coinRate.toFixed(2) : coinRate.toFixed(4)}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8295A8]" />
          </div>
        </div>

        {/* Network Selector Field */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-[#8295A8] block mb-2">Deposit Network</label>
          <div
            onClick={() => {
              triggerHaptic('selection');
              setShowNetworkModal(true);
            }}
            className="bg-[#1C1C1E] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div>
              <div className="font-bold text-white text-sm">{currentNetwork.name}</div>
              <div className="text-xs text-[#8295A8] mt-0.5">
                {currentNetwork.shortName} • {currentNetwork.blockConfirmations}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8295A8]" />
          </div>
        </div>

        {/* Deposit Amount Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-[#8295A8]">Amount (USD)</label>
            <span className="text-xs font-semibold text-emerald-400">
              ≈ {formatCryptoAmount(calculatedCrypto, selectedCoin.symbol)} {selectedCoin.symbol}
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              step="any"
              value={usdAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#1C1C1E] border border-white/[0.08] focus:border-[#2EA5FF] rounded-2xl py-3.5 px-4 text-xl font-bold text-white outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8295A8]">
              USD
            </span>
          </div>

          {amountError && (
            <p className="text-xs text-rose-400 font-medium mt-1.5">{amountError}</p>
          )}

          {/* Quick preset amount chips */}
          <div className="flex space-x-2 mt-3">
            {[10, 25, 50, 100, 250].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  handleAmountChange(String(preset));
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  usdAmount === String(preset)
                    ? 'bg-[#2EA5FF] text-white'
                    : 'bg-[#1C1C1E] text-[#8295A8] hover:text-white border border-white/[0.06]'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {/* Notice Card */}
        <div className="bg-[#1C1C1E]/60 border border-white/[0.06] rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-[#8295A8]">
          <Info className="w-4 h-4 text-[#2EA5FF] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Send only <strong className="text-white">{selectedCoin.symbol}</strong> via <strong className="text-white">{currentNetwork.shortName}</strong> network. Deposits are credited automatically upon blockchain confirmation.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleProceed}
        className="w-full py-4 bg-[#2EA5FF] hover:bg-[#208DE6] text-white rounded-2xl font-bold text-base shadow-xl active:scale-[0.98] transition-all cursor-pointer mt-6"
      >
        Proceed to Payment
      </button>

      {/* Coin Selector Modal */}
      {showCoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full max-h-[80vh] flex flex-col">
            <h3 className="text-base font-bold text-white mb-3">Select Cryptocurrency</h3>
            <div className="overflow-y-auto divide-y divide-white/[0.06]">
              {SUPPORTED_COINS.filter(c => c.id !== 'stars').map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedCoin(c);
                    setSelectedNetworkIndex(c.defaultNetworkIndex || 0);
                    setShowCoinModal(false);
                  }}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <CryptoIcon symbol={c.symbol} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-[#8295A8]">{c.symbol}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8295A8]" />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowCoinModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-white/[0.08] text-xs font-semibold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Network Selector Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full">
            <h3 className="text-base font-bold text-white mb-3">Select Network</h3>
            <div className="space-y-2">
              {selectedCoin.networks.map((net, idx) => (
                <div
                  key={net.id}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedNetworkIndex(idx);
                    setShowNetworkModal(false);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedNetworkIndex === idx
                      ? 'border-[#2EA5FF] bg-[#2EA5FF]/10 text-white'
                      : 'border-white/[0.06] bg-[#141416] text-[#8295A8] hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">{net.name}</div>
                    <div className="text-xs text-[#8295A8]">{net.shortName} • Min: {net.minDeposit} {selectedCoin.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowNetworkModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-white/[0.08] text-xs font-semibold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
