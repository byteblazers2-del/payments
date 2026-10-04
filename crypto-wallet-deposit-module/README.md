# 🚀 Standalone Crypto Wallet & Deposit Payment Module
### ماژول کامل ولت کریپتو، انتخاب ارز، واریز و صفحه پرداخت (آماده آپلود در گیت‌هاب و استفاده در پروژه‌های دیگر)

یک پکیج کامل، ماژولار و مستقل به زبان **React + TypeScript + Tailwind CSS** شامل تمام بخش‌های ولت، انتخاب رمزارز، محاسبه نرخ زنده، صدور فاکتور پرداخت (Invoice)، تولید QR Code و ثبت هش تراکنش (TXID).

---

## 📦 محتویات این ماژول (Features Included)

1. **صفحه ولت و دارایی‌ها (`WalletView`):**
   - نمایش موجودی کل دلاری (Total Balance) به صورت لحظه‌ای
   - دکمه‌های شیشه‌ای واریز (Deposit) و برداشت (Withdraw)
   - امکان مخفی‌سازی / نمایش موجودی (Hide/Show Balance)
   - تفکیک موجودی اصلی و پاداش (Bonus Balance)
   - لیست تمام رمزارزها (USDT, TON, BTC, ETH, SOL, TRX, ...) با نرخ زنده بازار
   - تاریخچه تراکنش‌ها (Transaction History) همراه با مودال جزئیات تراکنش

2. **صفحه انتخاب ارز و شبکه واریز (`DepositView`):**
   - انتخاب رمزارز و شبکه دلخواه (TRC20, BEP20, TON, ERC20, Solana, Polygon)
   - ورودی مبلغ دلاری (USD) و چیپ‌های پیش‌فرض ($10, $25, $50, $100, $250)
   - محاسبه و تبدیل خودکار به کریپتوی خالص بر اساس قیمت ثانیه‌ای و دقیق بایننس

3. **صفحه پرداخت و فاکتور (`PaymentInvoiceView`):**
   - نمایش کارت فاکتور با تایمر شمارش معکوس (۶۰ دقیقه)
   - تولید بارکد QR Code با رزولوشن بالا برای اسکن مستقیم در ولت (Trust Wallet, Tonkeeper, Telegram Wallet)
   - دکمه کپی آدرس و مبلغ با یک کلیک و فیدبک لمسی (Haptic)
   - پشتیبانی از Memo / Tag برای شبکه‌هایی مثل TON و XRP
   - فیلد دریافت هش تراکنش (TXID) و ثبت پردازش پرداخت
   - صفحه تأیید موفقیت‌آمیز و رسید پرداخت

4. **سیستم قفل امنیتی پین‌کد (`WalletPinLock`):**
   - کی‌پد عددی اختصاصی برای تعریف و ورود رمز ۴ رقمی کیف پول

5. **موتور استعلام زنده قیمت‌ها (`cryptoRates.ts`):**
   - استعلام مستقیم از API بایننس و کوین‌گکو با نرخ‌های دقیق بازار (TON: $5.48, GRAM: $1.42, ...)

---

## 🛠 نحوه نصب و راه‌اندازی سریع (Quick Start)

### ۱. نصب وابستگی‌ها
```bash
npm install
```

### ۲. اجرای پروژه در حالت توسعه
```bash
npm run dev
```

---

## 💻 نحوه استفاده در پروژه دیگر (How to Use in Any React / Vite / Next.js Project)

کافی است این پوشه یا فایل‌های آن را داخل پروژه جدید خود کپی کنید و کامپوننت‌ها را به دلخواه فراخوانی کنید:

```tsx
import React, { useState } from 'react';
import { 
  WalletView, 
  DepositView, 
  PaymentInvoiceView,
  DepositOrderData 
} from './crypto-wallet-deposit-module/src';

export default function MyCustomApp() {
  const [screen, setScreen] = useState<'wallet' | 'deposit' | 'invoice'>('wallet');
  const [activeOrder, setActiveOrder] = useState<DepositOrderData | null>(null);

  // موجودی‌های کاربر از دیتابیس یا استیت
  const userBalances = {
    USDT: 250.00,
    TON: 15.50,
    BTC: 0.005,
    ETH: 0.12
  };

  return (
    <div>
      {screen === 'wallet' && (
        <WalletView
          userBalances={userBalances}
          onDepositClick={() => setScreen('deposit')}
          onWithdrawClick={() => console.log('Withdraw clicked')}
        />
      )}

      {screen === 'deposit' && (
        <DepositView
          onBack={() => setScreen('wallet')}
          onProceedToInvoice={(order) => {
            setActiveOrder(order);
            setScreen('invoice');
          }}
        />
      )}

      {screen === 'invoice' && activeOrder && (
        <PaymentInvoiceView
          orderId={activeOrder.orderId}
          coin={activeOrder.coin}
          network={activeOrder.network}
          usdAmount={activeOrder.usdAmount}
          cryptoAmount={activeOrder.cryptoAmount}
          onBack={() => setScreen('deposit')}
          onSubmitTxHash={async ({ txHash }) => {
            console.log('Sending TXID to your backend:', txHash);
            return true;
          }}
          onSuccessDone={() => setScreen('wallet')}
        />
      )}
    </div>
  );
}
```

---

## ⚙️ نحوه تغییر آدرس ولت‌ها (Customizing Deposit Addresses)

تمامی آدرس‌های پیش‌فرض در فایل زیر قرار دارند:
`src/data/cryptoAssets.ts`

می‌توانید آدرس ولت‌های خود را مستقیماً در این فایل ویرایش کنید:
```typescript
{
  id: 'trc20',
  name: 'TRON (TRC20)',
  shortName: 'TRC20',
  address: 'YOUR_TRON_WALLET_ADDRESS_HERE',
  minDeposit: '5'
},
{
  id: 'ton-native',
  name: 'TON Network',
  shortName: 'TON',
  address: 'YOUR_TON_WALLET_ADDRESS_HERE',
  minDeposit: '0.5'
}
```

---

## 📤 دستورات آپلود در گیت‌هاب (Upload to GitHub in 1 Minute)

برای ساخت مخزن جدید و آپلود این ماژول در گیت‌هاب، کافی است یک ریپازیتوری خالی در گیت‌هاب بسازید و دستورات زیر را اجرا کنید:

```bash
# وارد پوشه ماژول شوید
cd crypto-wallet-deposit-module

# راه‌اندازی گیت
git init
git add .
git commit -m "feat: Initial standalone Crypto Wallet & Deposit Payment Module"

# اتصال به مخزن گیت‌هاب خودتان (آدرس ریپازیتوری خود را جایگزین کنید)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# تغییر نام برنچ به main و پوش نهایی
git branch -M main
git push -u origin main
```

همچنین می‌توانید از اسکریپت آماده `push-to-github.sh` استفاده کنید:
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```
