export interface LiveRate {
  symbol: string;
  usdPrice: number;
  lastUpdated: number;
}

export const FALLBACK_RATES: Record<string, number> = {
  STARS: 0.02,
  USDT: 1.00,
  TON: 5.48,
  GRAM: 1.42,
  USDE: 1.00,
  STAKED: 1.55,
  NOT: 0.00785,
  DOGS: 0.00065,
  BTC: 84950.00,
  ETH: 2690.50,
  TRX: 0.335,
  SOL: 121.50,
  BNB: 787.20,
  XRP: 1.49,
  DOGE: 0.093,
  BCH: 485.00,
  USDC: 1.00,
  SUI: 1.17,
  MATIC: 0.54,
};

const SYMBOL_MAPPING: Record<string, string> = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  TRX: 'TRXUSDT',
  TON: 'TONUSDT',
  NOT: 'NOTUSDT',
  SOL: 'SOLUSDT',
  BNB: 'BNBUSDT',
  XRP: 'XRPUSDT',
  DOGE: 'DOGEUSDT',
  BCH: 'BCHUSDT',
  USDC: 'USDCUSDT',
  SUI: 'SUIUSDT',
  MATIC: 'POLUSDT',
};

export async function fetchLiveCryptoRates(): Promise<Record<string, number>> {
  const rates: Record<string, number> = { ...FALLBACK_RATES };

  // 1. Try local backend proxy if available
  try {
    const proxyRes = await fetch('/api/crypto/live-prices', { cache: 'no-cache' });
    if (proxyRes.ok) {
      const pJson = await proxyRes.json();
      if (pJson.success && pJson.data) {
        Object.keys(pJson.data).forEach(sym => {
          if (typeof pJson.data[sym] === 'number' && pJson.data[sym] > 0) {
            rates[sym] = pJson.data[sym];
          }
        });
        return rates;
      }
    }
  } catch {}

  // 2. Direct Binance public endpoint
  try {
    const symbols = Object.values(SYMBOL_MAPPING);
    const symbolsParam = JSON.stringify(symbols);
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbolsParam)}`);
    
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const reverseMap = Object.entries(SYMBOL_MAPPING).reduce((acc, [k, v]) => {
          acc[v] = k;
          return acc;
        }, {} as Record<string, string>);

        data.forEach((item: { symbol: string; price: string }) => {
          const coinSymbol = reverseMap[item.symbol];
          if (coinSymbol) {
            const p = parseFloat(item.price);
            if (!isNaN(p) && p > 0) {
              rates[coinSymbol] = p;
            }
          }
        });
      }
    }
  } catch {}

  return rates;
}

export function formatCryptoAmount(amount: number, symbol: string): string {
  const sym = (symbol || '').toUpperCase();
  if (sym === 'BTC' || sym === 'ETH') {
    return amount.toFixed(6).replace(/\.?0+$/, '');
  }
  if (sym === 'USDT' || sym === 'USDC' || sym === 'STARS') {
    return amount.toFixed(2);
  }
  if (amount < 0.01) {
    return amount.toFixed(4);
  }
  return amount.toFixed(4).replace(/\.?0+$/, '');
}
