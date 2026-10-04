import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LiquidGlassNav } from './LiquidGlassNav';

export function Layout() {
  const location = useLocation();

  // Instantly scroll window to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#000000] text-white font-sans flex flex-col relative antialiased selection:bg-[#2EA5FF]">
      {/* Main App Page Container - Smooth non-blocking entry without transform trap */}
      <main className="flex-1 w-full max-w-xl mx-auto px-0 pb-28 pt-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Floating Liquid Glass Navigation Bar with Isolated GPU Layer */}
      <div className="fixed bottom-4 left-0 right-0 px-3 w-full max-w-xl mx-auto z-40 safe-area-bottom pointer-events-none flex justify-center">
        <LiquidGlassNav />
      </div>
    </div>
  );
}

