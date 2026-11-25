import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../audio/soundEngine';
import { ASSETS } from '../assets/assets';

interface BigWinModalProps {
  isOpen: boolean;
  winAmount: number;
  betAmount: number;
  onClose: () => void;
}

export const BigWinModal: React.FC<BigWinModalProps> = ({
  isOpen,
  winAmount,
  betAmount,
  onClose,
}) => {
  const [displayedAmount, setDisplayedAmount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedAmount(0);
      return;
    }

    soundEngine.playBigWinFanfare();

    try {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#facc15', '#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
      });
    } catch {}

    const duration = 2200;
    const steps = 40;
    const increment = winAmount / steps;
    let current = 0;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= winAmount) {
        setDisplayedAmount(winAmount);
        clearInterval(interval);
      } else {
        setDisplayedAmount(Math.floor(current));
        soundEngine.playCoinTick();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isOpen, winAmount]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none p-2 cursor-pointer animate-fade-in"
    >
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center text-center">
        
        {/* Floating/Raining Gold Coins (matching Screenshots 2, 4, 6) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-2 border-yellow-100 shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center font-black text-amber-950 text-xs animate-bounce"
              style={{
                left: `${8 + (i * 12) % 84}%`,
                top: `${10 + (i * 16) % 75}%`,
                animationDuration: `${1.1 + (i % 4) * 0.25}s`,
                animationDelay: `${(i % 5) * 0.15}s`,
              }}
            >
              $
            </div>
          ))}
        </div>

        {/* Central Golden Flare Glow */}
        <div className="absolute w-80 h-80 rounded-full bg-yellow-500/25 blur-3xl pointer-events-none" />

        {/* Flanking Golden Winged Garudas + BIG WIN Title (matching Screenshots 2, 4, 6) */}
        <div className="relative w-full flex items-center justify-between px-1 z-20 pointer-events-none">
          
          {/* Left Winged Garuda Statue (Mirrored) */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.9)] scale-x-[-1] overflow-hidden rounded-full">
            <img
              src={ASSETS.wingedGaruda}
              alt="Winged Garuda"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center 3D BIG WIN Title (matching Screenshot 2, 4, 6) */}
          <div className="relative flex flex-col items-center -mx-4 z-30">
            <h1
              className="font-black text-5xl sm:text-6xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#bbf7d0] via-[#4ade80] to-[#15803d] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-none"
              style={{
                WebkitTextStroke: '2.5px #fde047',
                filter: 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.8))',
              }}
            >
              BIG
            </h1>
            <h1
              className="font-black text-5xl sm:text-6xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#bbf7d0] via-[#4ade80] to-[#15803d] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-none -mt-1"
              style={{
                WebkitTextStroke: '2.5px #fde047',
                filter: 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.8))',
              }}
            >
              WIN
            </h1>
          </div>

          {/* Right Winged Garuda Statue */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.9)] overflow-hidden rounded-full">
            <img
              src={ASSETS.wingedGaruda}
              alt="Winged Garuda"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* 3D Big Golden Number Display (matching Screenshots 2, 4, 6) */}
        <div className="relative z-30 mt-3 px-6 py-1">
          <div
            className="font-black text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#facc15] to-[#ca8a04] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-tight font-mono"
            style={{
              WebkitTextStroke: '1px #78350f',
              filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.7))',
            }}
          >
            {displayedAmount.toLocaleString('en-US')}
          </div>
        </div>

        {/* Tap to continue message */}
        <div className="relative z-30 mt-6 text-yellow-300 text-xs sm:text-sm font-bold animate-pulse drop-shadow">
          انقر في أي مكان للاستمرار
        </div>

      </div>
    </div>
  );
};
