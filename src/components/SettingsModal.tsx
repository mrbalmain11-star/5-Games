import React from 'react';
import { X, Volume2, VolumeX, Zap, Info, Coins } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isTurbo: boolean;
  onToggleTurbo: () => void;
  onOpenHelp: () => void;
  onAddFreeCoins: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  isTurbo,
  onToggleTurbo,
  onOpenHelp,
  onAddFreeCoins,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#29170c] via-[#1a0f07] to-[#120904] border-4 border-amber-600 shadow-2xl overflow-hidden p-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-amber-800 pb-2">
          <h3 className="font-black text-amber-200 text-base">إعدادات اللعبة</h3>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-full bg-amber-900/80 text-amber-200 flex items-center justify-center hover:bg-amber-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings rows */}
        <div className="space-y-3">
          
          {/* Sound Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 border border-amber-900">
            <div className="flex items-center gap-2.5">
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
              <div>
                <div className="font-bold text-stone-100 text-sm">المؤثرات الصوتية</div>
                <div className="text-[11px] text-stone-400">أصوات الدوران والجوائز</div>
              </div>
            </div>
            <button
              onClick={onToggleMute}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isMuted ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-700 text-stone-300'
              }`}
            >
              {!isMuted ? 'مفعل' : 'مكتوم'}
            </button>
          </div>

          {/* Turbo Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 border border-amber-900">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-bold text-stone-100 text-sm">الوضع السريع (Turbo)</div>
                <div className="text-[11px] text-stone-400">تسريع توقف البكرات</div>
              </div>
            </div>
            <button
              onClick={onToggleTurbo}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isTurbo ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-700 text-stone-300'
              }`}
            >
              {isTurbo ? 'سريع' : 'عادي'}
            </button>
          </div>

          {/* Free coins recharge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-950/70 to-emerald-950/70 border border-emerald-600/70">
            <div className="flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="font-bold text-emerald-200 text-sm">مكافأة يومية مجانية</div>
                <div className="text-[11px] text-emerald-400/80">+500,000 كونزة فورية</div>
              </div>
            </div>
            <button
              onClick={() => {
                onAddFreeCoins();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-black shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              شحن الآن
            </button>
          </div>

          {/* Rules button */}
          <button
            onClick={() => {
              onClose();
              onOpenHelp();
            }}
            className="w-full py-2.5 rounded-xl bg-stone-800/90 border border-amber-700/60 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-700 transition-all cursor-pointer"
          >
            <Info className="w-4 h-4" />
            عرض قواعد اللعبة والمدفوعات
          </button>

        </div>

      </div>
    </div>
  );
};
