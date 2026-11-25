import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SymbolTile, SpecialSymbolTile } from './SymbolTile';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, initialPage = 0 }) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const totalPages = 4;

  React.useEffect(() => {
    if (isOpen) {
      setCurrentPage(initialPage);
    }
  }, [isOpen, initialPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#29170c] via-[#1a0f07] to-[#120904] border-4 border-amber-600 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 border-b-2 border-amber-500/80 flex items-center justify-between">
          <h2 className="text-lg font-black text-amber-200 drop-shadow">
            {currentPage === 0 && 'قواعد اللعبة وجدول المدفوعات'}
            {currentPage === 1 && 'البكرة الخاصة (Reel 4)'}
            {currentPage === 2 && 'الرهانات الإضافية (EX Bet)'}
            {currentPage === 3 && 'خطوط الدفع الـ 5 (Paylines)'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-amber-900/80 border border-amber-400 text-amber-200 flex items-center justify-center hover:bg-amber-700 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-stone-200 text-sm">
          
          {/* PAGE 0: Payout Table */}
          {currentPage === 0 && (
            <div className="space-y-4 animate-fade-in">
              {/* WILD Explainer Box */}
              <div className="rounded-xl bg-amber-950/60 border border-amber-500/60 p-3 flex items-center gap-3">
                <div className="w-16 h-16 shrink-0">
                  <SymbolTile symbol="WILD" />
                </div>
                <div>
                  <div className="font-black text-amber-300 text-base">رمز البرتقالي (WILD)</div>
                  <p className="text-xs text-amber-100/80 mt-0.5 leading-relaxed">
                    يظهر على جميع البكرات ويحل محل جميع الرموز الأخرى لإكمال خطوط الفوز.
                  </p>
                </div>
              </div>

              {/* Symbol Payout Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Wild */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="WILD" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-amber-300 text-lg">25x</span>
                  </div>
                </div>

                {/* Red Gem */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="GEM_RED" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-rose-400 text-lg">20x</span>
                  </div>
                </div>

                {/* Blue Gem */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="GEM_BLUE" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-blue-400 text-lg">15x</span>
                  </div>
                </div>

                {/* Green Gem */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="GEM_GREEN" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-emerald-400 text-lg">12x</span>
                  </div>
                </div>

                {/* A */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="A" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-amber-200 text-lg">10x</span>
                  </div>
                </div>

                {/* K */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="K" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-purple-300 text-lg">8x</span>
                  </div>
                </div>

                {/* Q */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="Q" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-sky-300 text-lg">5x</span>
                  </div>
                </div>

                {/* J */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900/80 border border-amber-800/80">
                  <div className="w-11 h-11"><SymbolTile symbol="J" /></div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">3x</span>
                    <span className="font-black text-green-300 text-lg">2x</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 1: Special Reel & Fortune Wheel */}
          {currentPage === 1 && (
            <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
              <div className="rounded-xl bg-amber-950/60 border border-amber-500/60 p-3">
                <div className="font-black text-amber-300 text-sm mb-1">بكرة خاصة (Reel 4)</div>
                <p className="text-stone-200">
                  البكرة الرابعة هي بكرة خاصة، وتحتوي فقط على رموز مضاعف وعجلة الحظ.
                </p>
                <p className="text-amber-200 mt-1 font-semibold">
                  سيتم ضرب جميع الأرباح بالمضاعف الذي يهبط في <span className="underline text-yellow-300">مركز البكرة الخاصة</span> (الصف الأوسط).
                </p>
              </div>

              <div className="rounded-xl bg-stone-900/80 border border-amber-900 p-3">
                <div className="font-bold text-amber-300 mb-2">رموز المضاعف العادية:</div>
                <div className="flex items-center justify-between gap-1">
                  {(['1x', '2x', '3x', '5x', '10x', '15x'] as const).map((m) => (
                    <div key={m} className="w-11 h-11">
                      <SpecialSymbolTile symbol={m} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-amber-950/70 to-emerald-950/70 border border-emerald-500/60 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-9 h-9 shrink-0"><SpecialSymbolTile symbol="WHEEL" /></div>
                  <div className="font-black text-emerald-300 text-sm">مكافأة عجلة الحظ (Fortune Wheel)</div>
                </div>
                <p className="text-stone-200">
                  عندما يكون هناك خط فائز، ورمز <span className="font-bold text-yellow-300">WHEEL</span> في وسط البكرة الخاصة، سيتم تفعيل العجلة الحظية أعلى المعبد!
                </p>
                <p className="text-amber-300 mt-1 font-semibold">
                  تمنحك العجلة مكافأة عشوائية تتراوح بين:
                  <span className="block mt-0.5 font-black text-yellow-300">
                    1x، 3x، 5x، 8x، 10x، 15x، 20x، 30x، 50x، 100x، 200x أو حتى 1000x الرهان!
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* PAGE 2: EX Bet */}
          {currentPage === 2 && (
            <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
              <div className="rounded-xl bg-gradient-to-r from-amber-950/80 via-red-950/80 to-amber-950/80 border-2 border-amber-500 p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-red-500 text-stone-950 font-black text-xs">
                    EX BET
                  </span>
                  <span className="font-black text-amber-200 text-sm">خاصية الرهان الإضافي EX</span>
                </div>
                <p className="text-stone-200">
                  مطلوب رهان إضافي بنسبة <span className="font-black text-yellow-300">50%</span> من الرهان الأساسي لدفع الرهانات الإضافية.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-900/80 border border-amber-900">
                  <span className="text-amber-400 font-black text-base">★</span>
                  <p className="text-stone-300">
                    في وضع الرهان الإضافي، <span className="font-bold text-red-400">سيتم إزالة رمز المضاعف 1x تماماً</span> من البكرة الخاصة، وسيزداد بشكل كبير فرصة الهبوط على رموز المضاعفات العالية (5x, 10x, 15x)!
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-900/80 border border-amber-900">
                  <span className="text-amber-400 font-black text-base">★</span>
                  <p className="text-stone-300">
                    فرصة هبوط رمز عجلة الحظ <span className="font-bold text-yellow-400">WHEEL</span> تتضاعف مع ترقية الجوائز!
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-900/80 border border-amber-900">
                  <span className="text-amber-400 font-black text-base">★</span>
                  <p className="text-stone-300">
                    انقر على زر <span className="font-bold text-amber-400">EX</span> أسفل يسار البكرات لتشغيل أو إيقاف وظيفة الرهان الإضافي في أي وقت.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: 5 Paylines */}
          {currentPage === 3 && (
            <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
              <div className="rounded-xl bg-amber-950/60 border border-amber-500/60 p-3">
                <div className="font-black text-amber-300 text-sm mb-1">5 خطوط دفع ثابتة</div>
                <p className="text-stone-200">
                  تتشكل خطوط الفوز بتطابق 3 رموز متماثلة (أو مع الرمز البري WILD) من اليسار إلى اليمين عبر البكرات الثلاث الأولى.
                </p>
              </div>

              {/* 5 mini grids diagram */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                {/* Line 1: Top */}
                <div className="p-2 rounded bg-stone-900 border border-amber-900">
                  <div className="text-[11px] font-bold text-amber-300 mb-1">خط 1: أفقي علوي</div>
                  <div className="grid grid-cols-3 gap-1 w-20 mx-auto">
                    {[1,1,1, 0,0,0, 0,0,0].map((on, i) => (
                      <div key={i} className={`w-5 h-5 rounded ${on ? 'bg-amber-400 border border-white' : 'bg-stone-800'}`} />
                    ))}
                  </div>
                </div>

                {/* Line 2: Center */}
                <div className="p-2 rounded bg-stone-900 border border-amber-900">
                  <div className="text-[11px] font-bold text-amber-300 mb-1">خط 2: أفقي أوسط</div>
                  <div className="grid grid-cols-3 gap-1 w-20 mx-auto">
                    {[0,0,0, 1,1,1, 0,0,0].map((on, i) => (
                      <div key={i} className={`w-5 h-5 rounded ${on ? 'bg-emerald-400 border border-white' : 'bg-stone-800'}`} />
                    ))}
                  </div>
                </div>

                {/* Line 3: Bottom */}
                <div className="p-2 rounded bg-stone-900 border border-amber-900">
                  <div className="text-[11px] font-bold text-amber-300 mb-1">خط 3: أفقي سفلي</div>
                  <div className="grid grid-cols-3 gap-1 w-20 mx-auto">
                    {[0,0,0, 0,0,0, 1,1,1].map((on, i) => (
                      <div key={i} className={`w-5 h-5 rounded ${on ? 'bg-blue-400 border border-white' : 'bg-stone-800'}`} />
                    ))}
                  </div>
                </div>

                {/* Line 4: Diagonal top-left */}
                <div className="p-2 rounded bg-stone-900 border border-amber-900">
                  <div className="text-[11px] font-bold text-amber-300 mb-1">خط 4: قطري نازل</div>
                  <div className="grid grid-cols-3 gap-1 w-20 mx-auto">
                    {[1,0,0, 0,1,0, 0,0,1].map((on, i) => (
                      <div key={i} className={`w-5 h-5 rounded ${on ? 'bg-pink-400 border border-white' : 'bg-stone-800'}`} />
                    ))}
                  </div>
                </div>

                {/* Line 5: Diagonal bottom-left */}
                <div className="p-2 rounded bg-stone-900 border border-amber-900">
                  <div className="text-[11px] font-bold text-amber-300 mb-1">خط 5: قطري صاعد</div>
                  <div className="grid grid-cols-3 gap-1 w-20 mx-auto">
                    {[0,0,1, 0,1,0, 1,0,0].map((on, i) => (
                      <div key={i} className={`w-5 h-5 rounded ${on ? 'bg-purple-400 border border-white' : 'bg-stone-800'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Equation Box */}
              <div className="rounded-xl bg-stone-900/90 border border-amber-800 p-2.5 text-center text-xs space-y-1">
                <div className="text-amber-200 font-bold">
                  الأرباح في اللعبة العادية = قيمة الرمز × الرهان × مضاعف البكرة الرابعة
                </div>
                <div className="text-amber-400 font-bold">
                  الأرباح مع EX = قيمة الرمز × رهان EX × مضاعف البكرة الرابعة (1.5x)
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Pagination Footer */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-t border-amber-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-amber-900/80 border border-amber-500 text-amber-200 text-xs font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  currentPage === idx
                    ? 'bg-amber-400 scale-125 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-stone-700 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-amber-900/80 border border-amber-500 text-amber-200 text-xs font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
