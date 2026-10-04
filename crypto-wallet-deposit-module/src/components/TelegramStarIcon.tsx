import React, { useState } from 'react';

interface TelegramStarIconProps {
  className?: string;
  size?: number;
  customIconUrl?: string;
}

export function InlineTelegramStarSvg({ size, className = "" }: { size?: number; className?: string }) {
  const finalSize = size || 32;
  const hasDimensionClass = /\b(w-|h-)/.test(className);

  return (
    <svg
      viewBox="0 0 24 24"
      width={hasDimensionClass && !size ? undefined : finalSize}
      height={hasDimensionClass && !size ? undefined : finalSize}
      className={`inline-block shrink-0 object-contain select-none ${hasDimensionClass ? '' : 'w-8 h-8'} ${className}`}
      style={size ? { width: size, height: size, minWidth: size, minHeight: size } : undefined}
      fill="none"
    >
      <path
        d="M12 2L14.7 8.2L21.5 8.8L16.3 13.4L17.9 20.1L12 16.6L6.1 20.1L7.7 13.4L2.5 8.8L9.3 8.2L12 2Z"
        fill="url(#starGoldGrad)"
      />
      <defs>
        <linearGradient id="starGoldGrad" x1="12" y1="2" x2="12" y2="20.1" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const TelegramStarIcon: React.FC<TelegramStarIconProps> = ({ className = '', size, customIconUrl }) => {
  const [imgError, setImgError] = useState(false);
  const starsSrc = customIconUrl || '/telegram-stars.png';
  const finalSize = size || 32;

  if (starsSrc && !imgError) {
    return (
      <img 
        src={starsSrc} 
        alt="Telegram Star" 
        referrerPolicy="no-referrer"
        width={finalSize} 
        height={finalSize} 
        className={`inline-block shrink-0 object-contain select-none overflow-visible ${className}`} 
        style={finalSize ? { width: finalSize, height: finalSize, minWidth: finalSize, minHeight: finalSize } : undefined}
        onError={() => setImgError(true)}
      />
    );
  }

  return <InlineTelegramStarSvg size={finalSize} className={className} />;
};
