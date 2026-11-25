import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { BET_LEVELS } from '../types/game';

interface BottomControlsProps {
  currentBet: number;
  isExActive: boolean;
  onBetChange: (newBet: number) => void;
  onOpenBetSelector: () => void;
  isTurbo: boolean;
  onToggleTurbo: () => void;
  autoSpinCount: number;
  onSetAutoSpins: (count: number) => void;
  isSpinning: boolean;
  onSpin: () => void;
  winDisplayAmount: number;
  winStatusText: string;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  currentBet,
  isExActive,
  onBetChange,
  onOpenBetSelector,
  isTurbo,
  onToggleTurbo,
  autoSpinCount,
  onSetAutoSpins,
  isSpinning,
  onSpin,
  winDisplayAmount,
  winStatusText,
}) => {
  const [showAutoMenu, setShowAutoMenu] = useState<boolean>(false);

  const formatBet = (bet: number) => {
    if (bet >= 1000) {
      const thousands = bet / 1000;
      return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
    }
    return `${bet}`;
  };

  const handleDecreaseBet = () => {
    const currentIndex = BET_LEVELS.indexOf(currentBet as any);
    if (currentIndex > 0) {
      onBetChange(BET_LEVELS[currentIndex - 1]);
    }
  };

  const handleIncreaseBet = () => {
    const currentIndex = BET_LEVELS.indexOf(currentBet as any);
    if (currentIndex < BET_LEVELS.length - 1 && currentIndex !== -1) {
      onBetChange(BET_LEVELS[currentIndex + 1]);
    }
  };

  const actualCost = isExActive ? currentBet * 1.5 : currentBet;

  return (
    <div className="relative w-full max-w-[420px] mx-auto px-1 pb-2 pt-0.5 select-none flex flex-col gap-1 z-20">
      
      {/* Curved Dark Mahogany Win Banner (matching IMG-20261008-WA0081.jpg) */}
      <div
        className="relative w-full rounded-2xl py-1 px-4 flex items-center justify-center text-center overflow-hidden min-h-[44px]"
        style={{
          background: 'radial-gradient(ellipse at center, #6b1b10 0%, #3e0b05 70%, #1e0502 100%)',
          border: '2px solid #d4af37',
          boxShadow: 'inset 0 1px 3px rgba(254,240,138,0.4), 0 4px 12px rgba(0,0,0,0.9)',
        }}
      >
        {/* Red lotus decorative corners */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-600 border border-yellow-300 shadow" />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-600 border border-yellow-300 shadow" />

        {winDisplayAmount > 0 ? (
          <div className="flex items-center gap-1.5 animate-bounce">
            <span className="font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] font-mono tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {winDisplayAmount.toLocaleString('en-US')}
            </span>
          </div>
        ) : (
          <span className="text-[#fef08a] text-xs sm:text-sm font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {winStatusText || 'تمنياتي لك بحظ سعيد'}
          </span>
        )}
      </div>

      {/* Control Panel Grid Bar (matching IMG-20261008-WA0081.jpg) */}
      <div
        className="relative grid grid-cols-12 gap-1 items-center p-1 rounded-lg shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #6b4325 0%, #4a2d16 50%, #2e1a0b 100%)',
          border: '2px solid #b8864b',
        }}
      >
        
        {/* Bet Selector Box (cols 1 to 5) */}
        <div
          className="col-span-5 flex items-center rounded p-0.5"
          style={{
            background: '#241307',
            border: '1.5px solid #d4af37',
          }}
        >
          {/* Minus Button */}
          <button
            onClick={handleDecreaseBet}
            disabled={isSpinning || BET_LEVELS.indexOf(currentBet as any) === 0}
            type="button"
            className="w-7 h-9 rounded bg-gradient-to-b from-[#7a4c28] to-[#452712] border border-[#d4af37] text-yellow-300 flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Bet Display Box */}
          <button
            onClick={onOpenBetSelector}
            disabled={isSpinning}
            type="button"
            className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer px-1"
          >
            <span className="text-[10px] text-yellow-200 font-bold leading-tight">
              {isExActive ? 'الرهان EX' : 'الرهان'}
            </span>
            <span className="text-sm sm:text-base font-black text-yellow-300 font-mono leading-tight drop-shadow">
              {formatBet(actualCost)}
            </span>
          </button>

          {/* Plus Button */}
          <button
            onClick={handleIncreaseBet}
            disabled={isSpinning || BET_LEVELS.indexOf(currentBet as any) === BET_LEVELS.length - 1}
            type="button"
            className="w-7 h-9 rounded bg-gradient-to-b from-[#7a4c28] to-[#452712] border border-[#d4af37] text-yellow-300 flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Turbo Mode Button "سريع" (cols 6 to 7) */}
        <div className="col-span-2">
          <button
            onClick={onToggleTurbo}
            type="button"
            className={`w-full h-9 rounded flex items-center justify-center border-2 transition-all cursor-pointer active:scale-95 shadow ${
              isTurbo
                ? 'bg-gradient-to-b from-emerald-600 to-green-900 border-yellow-300 text-yellow-200 font-black shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                : 'bg-gradient-to-b from-[#52331b] to-[#301c0d] border-[#b45309] text-yellow-200 font-bold'
            }`}
          >
            <div className={`w-full h-full flex items-center justify-center rounded border ${isTurbo ? 'border-green-300' : 'border-green-600/70'}`}>
              <span className="text-xs font-black">سريع</span>
            </div>
          </button>
        </div>

        {/* Auto Spin Button "تلقائي" (cols 8 to 9) */}
        <div className="col-span-2 relative">
          <button
            onClick={() => {
              if (autoSpinCount > 0) {
                onSetAutoSpins(0);
              } else {
                setShowAutoMenu(!showAutoMenu);
              }
            }}
            type="button"
            className={`w-full h-9 rounded flex items-center justify-center border-2 transition-all cursor-pointer active:scale-95 shadow ${
              autoSpinCount > 0
                ? 'bg-gradient-to-b from-amber-600 to-yellow-800 border-yellow-200 text-stone-950 font-black animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                : 'bg-gradient-to-b from-[#52331b] to-[#301c0d] border-[#b45309] text-yellow-200 font-bold'
            }`}
          >
            <div className={`w-full h-full flex items-center justify-center rounded border ${autoSpinCount > 0 ? 'border-yellow-200' : 'border-amber-600/60'}`}>
              <span className="text-xs font-black">
                {autoSpinCount > 0 ? (autoSpinCount === 999 ? '∞' : autoSpinCount) : 'تلقائي'}
              </span>
            </div>
          </button>

          {/* Auto spin popover */}
          {showAutoMenu && (
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-50 bg-[#1c1007] border-2 border-yellow-400 rounded-lg p-1 shadow-2xl flex flex-col gap-1 w-24">
              <span className="text-[9px] text-yellow-300 font-bold text-center">دورات تلقائية</span>
              {[10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    onSetAutoSpins(num);
                    setShowAutoMenu(false);
                  }}
                  className="py-1 px-1.5 rounded bg-amber-950 hover:bg-amber-700 text-yellow-200 text-xs font-bold transition-all cursor-pointer"
                >
                  {num} دورة
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onSetAutoSpins(999);
                  setShowAutoMenu(false);
                }}
                className="py-1 px-1.5 rounded bg-emerald-950 hover:bg-emerald-700 text-emerald-200 text-xs font-bold transition-all cursor-pointer"
              >
                بلا حدود ∞
              </button>
            </div>
          )}
        </div>

        {/* Large Circular Green "بدء" Start Button (cols 10 to 12) (matching IMG-20261008-WA0081.jpg) */}
        <div className="col-span-3 flex justify-end">
          <button
            onClick={() => {
              setShowAutoMenu(false);
              onSpin();
            }}
            disabled={isSpinning}
            type="button"
            className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black transition-all active:scale-90 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.8)] ${
              isSpinning
                ? 'bg-gradient-to-b from-amber-600 to-yellow-700 opacity-90 cursor-not-allowed'
                : 'bg-gradient-to-b from-[#22c55e] via-[#16a34a] to-[#14532d] hover:brightness-110'
            }`}
            style={{
              border: '3.5px solid #facc15',
            }}
          >
            {/* Inner ring */}
            <div className="absolute inset-1 rounded-full border border-yellow-100/50 pointer-events-none" />

            <span className="text-xl sm:text-2xl text-white font-extrabold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {isSpinning ? '...' : 'بدء'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
