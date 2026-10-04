import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  CheckCircle2, 
  Info, 
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { SUPPORTED_COINS, CryptoCoin } from '../data/cryptoAssets';
import { fetchLiveCryptoRates, FALLBACK_RATES } from '../utils/cryptoRates';
import { CryptoIcon } from './CryptoIcon';
import { VerifiedBadge } from './VerifiedBadge';
import { triggerHaptic } from '../utils/haptics';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'bonus';
  coin: string;
  amount: number;
  usdAmount: number;
  status: 'pending' | 'completed' | 'rejected';
  txHash?: string;
  createdAt: number;
}

export interface WalletViewProps {
  userBalances?: Record<string, number>;
  bonusBalance?: number;
  transactions?: WalletTransaction[];
  onDepositClick: (coin?: CryptoCoin) => void;
  onWithdrawClick?: (coin?: CryptoCoin) => void;
  onCoinSelect?: (coin: CryptoCoin) => void;
  supportUsername?: string;
}

export const WalletView: React.FC<WalletViewProps> = ({
  userBalances = { USDT: 0, TON: 0, BTC: 0, ETH: 0 },
  bonusBalance = 0,
  transactions = [],
  onDepositClick,
  onWithdrawClick,
  onCoinSelect,
  supportUsername = 'ai_zke'
}) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'history'>('crypto');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchLiveCryptoRates().then(r => {
      if (mounted) setRates(r);
    });
    const interval = setInterval(() => {
      fetchLiveCryptoRates().then(r => {
        if (mounted) setRates(r);
      });
    }, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Compute total USD net worth
  const totalCryptoUsd = Object.entries(userBalances).reduce((acc, [symbol, amount]) => {
    const rate = rates[symbol] || FALLBACK_RATES[symbol] || 0;
    return acc + (amount * rate);
  }, 0);

  const totalNetWorth = totalCryptoUsd + bonusBalance;

  // Filtered coins
  const filteredCoins = SUPPORTED_COINS.filter(c => {
    if (c.id === 'stars' || c.symbol === 'STARS') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#000000] text-white flex flex-col font-sans select-none pb-20">
      {/* Header Balance Card */}
      <div className="px-5 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="flex items-center space-x-2 text-[#8295A8] text-xs font-medium mb-1.5">
          <span>Total Balance</span>
          <button 
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setShowBalance(!showBalance);
            }}
            className="hover:text-white transition-colors"
          >
            {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="text-[34px] font-extrabold tracking-tight text-white flex items-baseline justify-center">
          <span>$</span>
          {showBalance ? (
            <span>
              {totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          ) : (
            <span className="tracking-widest">••••••</span>
          )}
        </div>

        {bonusBalance > 0 && showBalance && (
          <div className="mt-2 text-xs text-amber-400/90 bg-amber-400/10 px-3 py-1 rounded-full font-medium">
            Bonus Balance: ${bonusBalance.toFixed(2)}
          </div>
        )}

        {/* Action Buttons: Deposit & Withdraw */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              onDepositClick();
            }}
            className="py-3 px-4 bg-[#2EA5FF] hover:bg-[#208DE6] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              if (onWithdrawClick) onWithdrawClick();
            }}
            className="py-3 px-4 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 border border-white/[0.08] active:scale-95 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Tabs: Crypto / History */}
      <div className="px-5 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex space-x-6">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('crypto');
            }}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'crypto' ? 'text-white' : 'text-[#8295A8] hover:text-slate-300'
            }`}
          >
            <span>Crypto Assets</span>
            {activeTab === 'crypto' && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#2EA5FF] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('history');
            }}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'history' ? 'text-white' : 'text-[#8295A8] hover:text-slate-300'
            }`}
          >
            <span>History</span>
            {activeTab === 'history' && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#2EA5FF] rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'crypto' && (
          <div className="relative pb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-[#1C1C1E] text-xs text-white placeholder-[#8295A8] px-3 py-1.5 rounded-lg w-28 focus:w-36 transition-all border border-white/[0.06] outline-none"
            />
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="px-5 pt-4">
        {activeTab === 'crypto' ? (
          <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-white/[0.06] border border-white/[0.06]">
            {filteredCoins.map((coin) => {
              const amount = userBalances[coin.symbol] || 0;
              const rate = rates[coin.symbol] || FALLBACK_RATES[coin.symbol] || 0;
              const usdVal = amount * rate;

              return (
                <div
                  key={coin.id}
                  onClick={() => {
                    triggerHaptic('light');
                    if (onCoinSelect) onCoinSelect(coin);
                    else onDepositClick(coin);
                  }}
                  className="p-4 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <CryptoIcon symbol={coin.symbol} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-white">{coin.name}</span>
                        <VerifiedBadge className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold text-[#8295A8]">{coin.symbol}</span>
                      </div>
                      <div className="text-xs text-[#8295A8] mt-0.5">
                        ${rate >= 1 ? rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : rate.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      ${showBalance ? usdVal.toFixed(2) : '••••'}
                    </div>
                    <div className="text-xs text-[#8295A8] mt-0.5">
                      {showBalance ? `${amount > 0 ? amount.toFixed(4) : '0'} ${coin.symbol}` : '••••'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* History Tab */
          <div>
            {transactions.length === 0 ? (
              <div className="py-16 text-center text-[#8295A8]">
                <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No transactions yet</p>
                <p className="text-xs text-slate-500 mt-1">Deposits and withdrawals will appear here</p>
              </div>
            ) : (
              <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-white/[0.06] border border-white/[0.06]">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="p-4 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white capitalize">{tx.type}</div>
                        <div className="text-xs text-[#8295A8]">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.usdAmount.toFixed(2)}
                      </div>
                      <div className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
              selectedTx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white capitalize">{selectedTx.type} Details</h3>
              <p className="text-2xl font-extrabold text-white mt-1">${selectedTx.usdAmount.toFixed(2)}</p>
              <p className="text-xs text-[#8295A8] mt-0.5">{selectedTx.amount} {selectedTx.coin}</p>
            </div>

            <div className="bg-[#141416] p-3 rounded-xl text-left text-xs space-y-2 border border-white/[0.04]">
              <div className="flex justify-between">
                <span className="text-[#8295A8]">Status:</span>
                <span className="font-semibold text-emerald-400 capitalize">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8295A8]">Date:</span>
                <span className="text-white">{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>
              {selectedTx.txHash && (
                <div className="flex justify-between items-center">
                  <span className="text-[#8295A8]">TXID:</span>
                  <span className="text-white font-mono text-[11px] truncate max-w-[140px]">{selectedTx.txHash}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-[#2EA5FF] text-white font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
