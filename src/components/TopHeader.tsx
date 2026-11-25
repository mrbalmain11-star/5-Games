import React from 'react';
import { Home, Plus, Trophy, Settings, HelpCircle, Wifi } from 'lucide-react';

interface TopHeaderProps {
  balance: number;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onAddCoins: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  balance,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenHelp,
  onAddCoins,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="relative w-full max-w-[420px] mx-auto px-1 pt-1 pb-1 flex items-center justify-between select-none z-30">
      
      {/* Left Section: Home Button + Coin Balance Capsule (matching IMG-20261008-WA0081.jpg) */}
      <div className="flex items-center gap-1.5">
        
        {/* Home / Mute Toggle Button: circular, brown background, gold rim */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          type="button"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
          style={{
            background: 'linear-gradient(180deg, #6b4325 0%, #452812 50%, #291507 100%)',
            border: '2.5px solid #d4af37',
          }}
        >
          <Home className={`w-4 h-4 ${isMuted ? 'fill-stone-500 stroke-stone-400 opacity-70' : 'fill-yellow-400 stroke-yellow-500'}`} />
        </button>

        {/* Coin Balance Capsule: Gold Coin + Digits + Green [+] */}
        <div className="relative flex flex-col">
          <div
            className="flex items-center rounded px-1.5 py-0.5 shadow-md"
            style={{
              background: 'linear-gradient(90deg, #381b0a 0%, #522912 50%, #381b0a 100%)',
              border: '2px solid #d4af37',
            }}
          >
            {/* Gold Coin Icon with $ on left */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#ca8a04] via-[#facc15] to-[#fef08a] border border-yellow-100 flex items-center justify-center text-stone-900 font-black text-[11px] shadow mr-1">
              $
            </div>

            {/* Balance Gold Digits */}
            <span className="font-black text-xs sm:text-sm text-yellow-300 font-mono tracking-tight px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {balance.toLocaleString('en-US')}
            </span>

            {/* Green Square [+] Refill Button on right */}
            <button
              onClick={onAddCoins}
              title="شحن رصيد مجاني"
              type="button"
              className="w-4 h-4 rounded-sm bg-gradient-to-b from-[#16a34a] to-[#14532d] border border-green-300 text-white flex items-center justify-center hover:brightness-125 active:scale-90 transition-all cursor-pointer ml-1 shadow"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          {/* Green Ping Indicator: 📶 82ms */}
          <div className="flex items-center gap-0.5 text-[9px] text-emerald-400 font-semibold px-1 mt-0.5">
            <Wifi className="w-2.5 h-2.5" />
            <span>82ms</span>
          </div>
        </div>

      </div>

      {/* Right Section: Settings ⚙, Help ?, Trophy "الجدول" (matching IMG-20261008-WA0081.jpg) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Circular Gold Settings Button */}
        <button
          onClick={onOpenSettings}
          title="الإعدادات"
          type="button"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
          style={{
            background: 'linear-gradient(180deg, #6b4325 0%, #452812 50%, #291507 100%)',
            border: '2px solid #d4af37',
          }}
        >
          <Settings className="w-4 h-4 fill-yellow-400 stroke-stone-900" />
        </button>

        {/* Circular Gold Help Button (?) */}
        <button
          onClick={onOpenHelp}
          title="شرح اللعبة"
          type="button"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
          style={{
            background: 'linear-gradient(180deg, #6b4325 0%, #452812 50%, #291507 100%)',
            border: '2px solid #d4af37',
          }}
        >
          <HelpCircle className="w-4 h-4 text-yellow-300 fill-yellow-500/20" />
        </button>

        {/* Golden Trophy with "الجدول" below (matching IMG-20261008-WA0081.jpg) */}
        <button
          onClick={onOpenLeaderboard}
          type="button"
          className="flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
          </div>
          <span className="text-[9px] font-black text-yellow-300 drop-shadow -mt-0.5 leading-none">
            الجدول
          </span>
        </button>

      </div>

    </header>
  );
};
