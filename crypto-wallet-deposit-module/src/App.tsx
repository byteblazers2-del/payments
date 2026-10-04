import React, { useState } from 'react';
import { WalletView, WalletTransaction } from './components/WalletView';
import { DepositView, DepositOrderData } from './components/DepositView';
import { PaymentInvoiceView } from './components/PaymentInvoiceView';
import { CryptoCoin } from './data/cryptoAssets';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'wallet' | 'deposit' | 'invoice'>('wallet');
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | undefined>(undefined);
  const [activeOrder, setActiveOrder] = useState<DepositOrderData | null>(null);

  // Mock initial balances
  const [balances, setBalances] = useState<Record<string, number>>({
    USDT: 125.50,
    TON: 14.20,
    BTC: 0.0015,
    ETH: 0.045
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx_1',
      type: 'deposit',
      coin: 'USDT',
      amount: 100,
      usdAmount: 100,
      status: 'completed',
      txHash: '0x3598a6ec35b6172a308ece3a2bf2b06bed3e370a',
      createdAt: Date.now() - 3600000 * 24
    }
  ]);

  const handleDepositClick = (coin?: CryptoCoin) => {
    setSelectedCoin(coin);
    setCurrentScreen('deposit');
  };

  const handleProceedToInvoice = (data: DepositOrderData) => {
    setActiveOrder(data);
    setCurrentScreen('invoice');
  };

  const handleSubmitTxHash = (data: { orderId: string; txHash: string; coin: string; amount: number }) => {
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      coin: data.coin,
      amount: data.amount,
      usdAmount: activeOrder?.usdAmount || 0,
      status: 'pending',
      txHash: data.txHash,
      createdAt: Date.now()
    };
    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {currentScreen === 'wallet' && (
        <WalletView
          userBalances={balances}
          bonusBalance={5.00}
          transactions={transactions}
          onDepositClick={handleDepositClick}
          onWithdrawClick={() => alert('Withdraw flow')}
          onCoinSelect={(coin) => handleDepositClick(coin)}
        />
      )}

      {currentScreen === 'deposit' && (
        <DepositView
          initialCoin={selectedCoin}
          onBack={() => setCurrentScreen('wallet')}
          onProceedToInvoice={handleProceedToInvoice}
        />
      )}

      {currentScreen === 'invoice' && activeOrder && (
        <PaymentInvoiceView
          orderId={activeOrder.orderId}
          coin={activeOrder.coin}
          network={activeOrder.network}
          usdAmount={activeOrder.usdAmount}
          cryptoAmount={activeOrder.cryptoAmount}
          onBack={() => setCurrentScreen('deposit')}
          onSubmitTxHash={handleSubmitTxHash}
          onSuccessDone={() => setCurrentScreen('wallet')}
        />
      )}
    </div>
  );
}
