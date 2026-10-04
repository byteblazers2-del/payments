import React from 'react';
import { TelegramStarIcon } from './TelegramStarIcon';

interface CryptoIconProps {
  symbol: string;
  network?: string;
  className?: string;
  customIconUrl?: string;
}

export function CryptoIcon({ symbol, network, className = "w-6 h-6", customIconUrl }: CryptoIconProps) {
  const [imgError, setImgError] = React.useState(false);
  let raw = (symbol || '').toUpperCase().trim();
  const net = (network || '').toUpperCase().trim();

  if (raw.endsWith('USDT') && raw !== 'USDT') {
    raw = raw.replace(/USDT$/, '');
  }

  if (raw === 'STARS' || raw === 'XTR') {
    return <TelegramStarIcon className={className} customIconUrl={customIconUrl} />;
  }

  if (customIconUrl && !imgError) {
    return (
      <img
        src={customIconUrl}
        alt={symbol}
        className={`${className} object-contain rounded-full select-none`}
        onError={() => setImgError(true)}
      />
    );
  }

  // 1. USDT & Network variants
  if (raw === 'USDT' || raw.includes('TETHER')) {
    if (net.includes('TRC') || net.includes('TRON')) {
      return (
        <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" fill="#26A17B"/>
          <path fill="#FFF" d="M17.92 16.38c-.1.01-.68.04-1.94.04-1.01 0-1.72-.03-1.97-.04-3.89-.17-6.79-.85-6.79-1.66s2.9-1.49 6.79-1.66v2.64c.25.02.98.06 1.99.06 1.2 0 1.81-.05 1.92-.06v-2.64c3.88.17 6.78.85 6.78 1.66s-2.9 1.48-6.78 1.66m0-3.59v-2.37h5.41V6.82H8.6v3.61h5.41v2.36c-4.4.2-7.7 1.08-7.7 2.12s3.3 1.92 7.7 2.12v6.58h3.91v-6.58c4.4-.2 7.7-1.08 7.7-2.12s-3.3-1.92-7.7-2.12"/>
          <circle cx="24" cy="24" r="6" fill="#EF0027"/>
          <g transform="translate(19, 19) scale(0.3125)">
            <path d="M21.932 9.913L7.5 7.257l7.595 19.112 10.583-12.894-3.746-3.562zm-.232 1.17l2.208 2.099-6.038 1.093 3.83-3.192zm-5.142 2.973l-6.364-5.278 10.402 1.914-4.038 3.364zm-.453.934l-1.038 8.58L9.472 9.487l6.633 5.502zm.96.455l6.687-1.21-7.67 9.343.983-8.133z" fill="#FFF"/>
          </g>
        </svg>
      );
    }
    if (net.includes('TON')) {
      return (
        <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" fill="#26A17B"/>
          <path fill="#FFF" d="M17.92 16.38c-.1.01-.68.04-1.94.04-1.01 0-1.72-.03-1.97-.04-3.89-.17-6.79-.85-6.79-1.66s2.9-1.49 6.79-1.66v2.64c.25.02.98.06 1.99.06 1.2 0 1.81-.05 1.92-.06v-2.64c3.88.17 6.78.85 6.78 1.66s-2.9 1.48-6.78 1.66m0-3.59v-2.37h5.41V6.82H8.6v3.61h5.41v2.36c-4.4.2-7.7 1.08-7.7 2.12s3.3 1.92 7.7 2.12v6.58h3.91v-6.58c4.4-.2 7.7-1.08 7.7-2.12s-3.3-1.92-7.7-2.12"/>
          <circle cx="24" cy="24" r="6" fill="#0098EA"/>
          <g transform="translate(19, 19) scale(0.3125)">
            <path d="M16 6.8c-.3 0-.6.2-.7.4L8.1 19.4c-.2.4-.2.9.1 1.2.3.4.8.6 1.3.4l6.5-2.6 6.5 2.6c.5.2 1 0 1.3-.4.3-.3.3-.8.1-1.2L16.7 7.2c-.1-.2-.4-.4-.7-.4zm0 2.9l4.9 8.6-4.9-2v-6.6zm-1.5 6.6l-4.9 2 4.9-8.6v6.6z" fill="#FFF"/>
          </g>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#26A17B"/>
        <path fill="#FFF" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"/>
      </svg>
    );
  }

  // 2. TON (Toncoin)
  if (raw === 'TON' || raw.includes('TONCOIN')) {
    return (
      <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#0098EA"/>
        <path d="M16 6.8c-.3 0-.6.2-.7.4L8.1 19.4c-.2.4-.2.9.1 1.2.3.4.8.6 1.3.4l6.5-2.6 6.5 2.6c.5.2 1 0 1.3-.4.3-.3.3-.8.1-1.2L16.7 7.2c-.1-.2-.4-.4-.7-.4zm0 2.9l4.9 8.6-4.9-2v-6.6zm-1.5 6.6l-4.9 2 4.9-8.6v6.6z" fill="#FFF"/>
      </svg>
    );
  }

  // 3. GRAM
  if (raw === 'GRAM') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#0098EA" />
        <path d="M16 6.5C16 11.75 20.25 16 25.5 16C20.25 16 16 20.25 16 25.5C16 20.25 11.75 16 6.5 16C11.75 16 16 11.75 16 6.5Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 4. BTC (Bitcoin)
  if (raw === 'BTC') {
    return (
      <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#F7931A"/>
        <path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
      </svg>
    );
  }

  // 5. ETH (Ethereum)
  if (raw === 'ETH') {
    return (
      <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#627EEA"/>
        <g fill="#FFF">
          <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
          <path d="M16.498 4L9 16.22l7.498-3.35z"/>
          <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
          <path d="M16.498 27.995v-6.028L9 17.616z"/>
        </g>
      </svg>
    );
  }

  // 6. SOL (Solana)
  if (raw === 'SOL') {
    return (
      <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#141417"/>
        <path d="M9.925 19.687a.59.59 0 01.415-.17h14.366a.29.29 0 01.207.497l-2.838 2.815a.59.59 0 01-.415.171H7.294a.291.291 0 01-.207-.498l2.838-2.815zm0-10.517A.59.59 0 0110.34 9h14.366c.261 0 .392.314.207.498l-2.838 2.815a.59.59 0 01-.415.17H7.294a.291.291 0 01-.207-.497L9.925 9.17zm12.15 5.225a.59.59 0 00-.415-.17H7.294a.291.291 0 00-.207.498l2.838 2.815c.11.109.26.17.415.17h14.366a.291.291 0 00.207-.498l-2.838-2.815z" fill="#00FFA3"/>
      </svg>
    );
  }

  // 7. TRX (Tron)
  if (raw === 'TRX') {
    return (
      <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle fill="#EF0027" cx="16" cy="16" r="16"/>
        <path d="M21.932 9.913L7.5 7.257l7.595 19.112 10.583-12.894-3.746-3.562zm-.232 1.17l2.208 2.099-6.038 1.093 3.83-3.192zm-5.142 2.973l-6.364-5.278 10.402 1.914-4.038 3.364zm-.453.934l-1.038 8.58L9.472 9.487l6.633 5.502zm.96.455l6.687-1.21-7.67 9.343.983-8.133z" fill="#FFF"/>
      </svg>
    );
  }

  // Fallback badge
  return (
    <div className={`${className} rounded-full bg-[#007AFF]/20 text-[#007AFF] flex items-center justify-center font-bold text-[10px]`}>
      {symbol.slice(0, 3).toUpperCase()}
    </div>
  );
}
