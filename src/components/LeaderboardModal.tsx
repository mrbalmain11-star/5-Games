import React from 'react';
import { X, Trophy, Flame, Award } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  playerBestWin: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  playerBestWin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#25150a] via-[#170c05] to-[#0f0703] border-4 border-amber-600 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 border-b-2 border-amber-500/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300 fill-amber-300" />
            <h2 className="text-lg font-black text-amber-200">جدول الصدارة وأعلى الفائزين</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-amber-900/80 border border-amber-400 text-amber-200 flex items-center justify-center hover:bg-amber-700 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Status Card */}
        <div className="p-3 bg-gradient-to-r from-amber-900/40 via-yellow-900/20 to-amber-900/40 border-b border-amber-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border-2 border-amber-200 flex items-center justify-center text-stone-900 font-black">
              أنت
            </div>
            <div>
              <div className="font-bold text-amber-200 text-sm">أعلى فوز حققته</div>
              <div className="text-xs text-stone-400">في هذه الجلسة</div>
            </div>
          </div>
          <div className="text-left font-black text-xl text-amber-300">
            {playerBestWin > 0 ? `${playerBestWin.toLocaleString('en-US')} 🪙` : '0 🪙'}
          </div>
        </div>

        {/* Entries List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {entries.map((entry, idx) => {
            const isTop3 = idx < 3;
            const rankBg =
              idx === 0
                ? 'from-amber-500 to-yellow-300 text-stone-950'
                : idx === 1
                ? 'from-slate-300 to-slate-100 text-stone-950'
                : idx === 2
                ? 'from-amber-700 to-amber-500 text-white'
                : 'bg-stone-800 text-stone-400';

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  entry.isPlayer
                    ? 'bg-amber-950/70 border-amber-400 ring-1 ring-amber-400/50'
                    : 'bg-stone-900/80 border-amber-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shadow ${
                      isTop3 ? `bg-gradient-to-tr ${rankBg}` : rankBg
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.avatar}</span>
                    <div>
                      <div className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                        {entry.name}
                        {entry.isPlayer && (
                          <span className="text-[10px] px-1.5 py-[1px] rounded bg-amber-500 text-stone-950 font-black">
                            أنت
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-400 inline" />
                        <span>مضاعف: {entry.multiplier}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Win Coins */}
                <div className="text-left">
                  <div className="font-black text-amber-300 text-sm sm:text-base">
                    {entry.winAmount.toLocaleString('en-US')}
                  </div>
                  <div className="text-[10px] text-stone-400 text-right">{entry.date}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
