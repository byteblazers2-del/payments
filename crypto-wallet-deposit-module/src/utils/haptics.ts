export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light') {
  try {
    const tg = (window as any).Telegram?.WebApp?.HapticFeedback;
    if (tg) {
      if (type === 'selection') {
        tg.selectionChanged();
      } else if (type === 'success' || type === 'warning' || type === 'error') {
        tg.notificationOccurred(type);
      } else {
        tg.impactOccurred(type);
      }
      return;
    }
  } catch {}

  // Fallback to navigator.vibrate if supported
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'selection') navigator.vibrate(10);
      else if (type === 'success') navigator.vibrate([15, 50, 15]);
      else if (type === 'error') navigator.vibrate([40, 40, 40]);
      else navigator.vibrate(20);
    }
  } catch {}
}
