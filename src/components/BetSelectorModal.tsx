import React from 'react';
import { X } from 'lucide-react';
import { BET_LEVELS } from '../types/game';

interface BetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBet: number;
  onSelectBet: (bet: number) => void;
  isExActive: boolean;
}

export const BetSelectorModal: React.FC<BetSelectorModalProps> = ({
  isOpen,
  onClose,
  currentBet,
  onSelectBet,
  isExActive,
}) => {
  if (!isOpen) return null;

  const formatBetLabel = (bet: number) => {
    if (bet >= 1000) {
      return `${bet / 1000}K`;
    }
    return `${bet}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#29170c] via-[#1a0f07] to-[#120904] border-4 border-amber-600 shadow-2xl overflow-hidden p-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-amber-800 pb-2">
          <div>
            <h3 className="font-black text-amber-200 text-base">اختر قيمة الرهان</h3>
            <p className="text-[11px] text-amber-100/70">
              {isExActive ? 'الرهان الحالي يشمل +50% EX Bet' : 'الرهان الأساسي'}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-full bg-amber-900/80 text-amber-200 flex items-center justify-center hover:bg-amber-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of bet options */}
        <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto p-1">
          {BET_LEVELS.map((bet) => {
            const isSelected = currentBet === bet;
            return (
              <button
                key={bet}
                onClick={() => {
                  onSelectBet(bet);
                  onClose();
                }}
                type="button"
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500 to-yellow-600 border-yellow-200 text-stone-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.7)] scale-105'
                    : 'bg-stone-900/80 border-amber-900 text-amber-200 hover:border-amber-500 hover:bg-stone-800'
                }`}
              >
                <span className="text-base font-black tracking-tight">{formatBetLabel(bet)}</span>
                <span className="text-[10px] opacity-80 mt-0.5">{bet.toLocaleString('en-US')} 🪙</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
