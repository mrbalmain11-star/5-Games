import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SymbolId,
  SpecialSymbolId,
  WinningLine,
  LeaderboardEntry,
  SpinResult,
} from './types/game';
import { generateSpinResult } from './logic/slotEngine';
import { soundEngine } from './audio/soundEngine';
import { ASSETS } from './assets/assets';
import { TopHeader } from './components/TopHeader';
import { FortuneWheel } from './components/FortuneWheel';
import { SlotReels } from './components/SlotReels';
import { BottomControls } from './components/BottomControls';
import { BigWinModal } from './components/BigWinModal';
import { HelpModal } from './components/HelpModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { BetSelectorModal } from './components/BetSelectorModal';
import { SettingsModal } from './components/SettingsModal';

const INITIAL_GRID: SymbolId[][] = [
  ['J', 'GEM_RED', 'GEM_RED'],
  ['GEM_BLUE', 'GEM_GREEN', 'J'],
  ['A', 'GEM_GREEN', 'GEM_BLUE'],
];

const INITIAL_SPECIAL: SpecialSymbolId[] = ['5x', '5x', '2x'];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'سلطان الحظ', avatar: '👑', winAmount: 18500000, multiplier: '1000x', date: 'اليوم' },
  { id: '2', name: 'Dana Busi', avatar: '🦉', winAmount: 9400000, multiplier: '200x', date: 'اليوم' },
  { id: '3', name: 'فارس المعبد', avatar: '🦁', winAmount: 4800000, multiplier: '100x', date: 'أمس' },
  { id: '4', name: 'صائد الجواهر', avatar: '💎', winAmount: 2250000, multiplier: '50x', date: 'أمس' },
  { id: '5', name: 'صقر بغداد', avatar: '🦅', winAmount: 1125000, multiplier: '30x', date: 'منذ يومين' },
];

export default function App() {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fortune_gem_balance');
      const parsed = saved !== null ? parseInt(saved, 10) : NaN;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 988;
    } catch {
      return 988;
    }
  });
  const [currentBet, setCurrentBet] = useState<number>(500);
  const [isExActive, setIsExActive] = useState<boolean>(false);

  const [grid, setGrid] = useState<SymbolId[][]>(INITIAL_GRID);
  const [specialReel, setSpecialReel] = useState<SpecialSymbolId[]>(INITIAL_SPECIAL);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reelSpinningState, setReelSpinningState] = useState<boolean[]>([false, false, false, false]);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);

  const [isTurbo, setIsTurbo] = useState<boolean>(false);
  const [autoSpinCount, setAutoSpinCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [winDisplayAmount, setWinDisplayAmount] = useState<number>(0);
  const [winStatusText, setWinStatusText] = useState<string>('تمنياتي لك بحظ سعيد');
  const [bannerMessage, setBannerMessage] = useState<string>('عند التفعيل، فرصة تحقيق مضاعفات ستكون 2x أو أعلى.');
  const [bigWinOpen, setBigWinOpen] = useState<boolean>(false);
  const [bigWinAmount, setBigWinAmount] = useState<number>(0);

  const [isWheelBonusActive, setIsWheelBonusActive] = useState<boolean>(false);
  const [targetWheelMultiplier, setTargetWheelMultiplier] = useState<number | null>(null);

  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [helpPage, setHelpPage] = useState<number>(0);
  const [leaderboardOpen, setLeaderboardOpen] = useState<boolean>(false);
  const [betSelectorOpen, setBetSelectorOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [playerBestWin, setPlayerBestWin] = useState<number>(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs to prevent stale closures across async spin timers & auto-spin
  const balanceRef = useRef<number>(balance);
  const currentBetRef = useRef<number>(currentBet);
  const isExActiveRef = useRef<boolean>(isExActive);
  const isTurboRef = useRef<boolean>(isTurbo);
  const isSpinningRef = useRef<boolean>(isSpinning);
  const autoSpinCountRef = useRef<number>(autoSpinCount);
  const playerBestWinRef = useRef<number>(playerBestWin);
  const pendingWheelBaseWinRef = useRef<number>(0);
  const pendingAutoResumeRef = useRef<boolean>(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const autoSpinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    balanceRef.current = balance;
    try {
      localStorage.setItem('fortune_gem_balance', balance.toString());
    } catch {}
  }, [balance]);

  useEffect(() => {
    currentBetRef.current = currentBet;
  }, [currentBet]);

  useEffect(() => {
    isExActiveRef.current = isExActive;
  }, [isExActive]);

  useEffect(() => {
    isTurboRef.current = isTurbo;
  }, [isTurbo]);

  useEffect(() => {
    playerBestWinRef.current = playerBestWin;
  }, [playerBestWin]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      if (autoSpinTimerRef.current) clearTimeout(autoSpinTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      soundEngine.stopSpinLoop();
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.playClick();
    }
    showToast(next ? 'تم كتم الصوت 🔇' : 'تم تشغيل الصوت 🔊');
  };

  const handleAddFreeCoins = () => {
    const nextBalance = balanceRef.current + 500000;
    balanceRef.current = nextBalance;
    setBalance(nextBalance);
    soundEngine.playCoinTick();
    showToast('تم شحن 500,000 كونزة مجانية بنجاح! 🪙');
  };

  const scheduleAutoSpin = useCallback((delay: number, executeFn: () => void) => {
    if (autoSpinTimerRef.current) {
      clearTimeout(autoSpinTimerRef.current);
      autoSpinTimerRef.current = null;
    }
    autoSpinTimerRef.current = setTimeout(() => {
      autoSpinTimerRef.current = null;
      if (autoSpinCountRef.current > 0 && !isSpinningRef.current) {
        executeFn();
      }
    }, delay);
  }, []);

  const executeSpinRef = useRef<() => void>(() => {});

  const advanceAutoSpin = useCallback(
    (wonAmount: number, openedBigWinModal: boolean) => {
      const currentAuto = autoSpinCountRef.current;
      if (currentAuto <= 0) return;

      const remaining = currentAuto === 999 ? 999 : currentAuto - 1;
      autoSpinCountRef.current = remaining;
      setAutoSpinCount(remaining);

      if (remaining > 0) {
        if (openedBigWinModal) {
          pendingAutoResumeRef.current = true;
        } else {
          const turbo = isTurboRef.current;
          const delay = wonAmount > 0 ? (turbo ? 900 : 1500) : (turbo ? 350 : 600);
          scheduleAutoSpin(delay, () => executeSpinRef.current());
        }
      } else {
        pendingAutoResumeRef.current = false;
      }
    },
    [scheduleAutoSpin]
  );

  const finishSpin = useCallback(
    (result: SpinResult, betUsed: number) => {
      isSpinningRef.current = false;
      setIsSpinning(false);

      let openedBigWin = false;

      if (result.totalWin > 0) {
        const nextBalance = balanceRef.current + result.totalWin;
        balanceRef.current = nextBalance;
        setBalance(nextBalance);
        setWinningLines(result.winningLines);
        setWinDisplayAmount(result.totalWin);
        setWinStatusText(`+${result.totalWin.toLocaleString('en-US')}`);
        soundEngine.playWinChime();

        if (result.totalWin > playerBestWinRef.current) {
          playerBestWinRef.current = result.totalWin;
          setPlayerBestWin(result.totalWin);
        }

        // If win >= 8x bet, show Big Win Modal (Screenshots 2, 4, 6)
        if (result.totalWin >= betUsed * 8) {
          openedBigWin = true;
          setBigWinAmount(result.totalWin);
          setBigWinOpen(true);

          const newEntry: LeaderboardEntry = {
            id: Date.now().toString(),
            name: 'أنت (البطل)',
            avatar: '⚡',
            winAmount: result.totalWin,
            multiplier: `${result.multiplierValue}x`,
            date: 'الآن',
            isPlayer: true,
          };
          setLeaderboard((prev) => [newEntry, ...prev.slice(0, 7)]);
        }

        setBannerMessage(`مبروك! فوز بمضاعف ${result.multiplierValue}x`);
      } else {
        setWinDisplayAmount(0);
        setWinStatusText('تمنياتي لك بحظ سعيد');
        setBannerMessage('الفوز (حتى x15)');
      }

      advanceAutoSpin(result.totalWin, openedBigWin);
    },
    [advanceAutoSpin]
  );

  const executeSpin = useCallback(() => {
    if (isSpinningRef.current) return;

    const betUsed = currentBetRef.current;
    const exActive = isExActiveRef.current;
    const turbo = isTurboRef.current;
    const actualCost = exActive ? betUsed * 1.5 : betUsed;

    if (balanceRef.current < actualCost) {
      soundEngine.playClick();
      showToast('رصيدك غير كافٍ! انقر على زر (+) لشحن كونزات مجانية');
      autoSpinCountRef.current = 0;
      pendingAutoResumeRef.current = false;
      setAutoSpinCount(0);
      return;
    }

    if (autoSpinTimerRef.current) {
      clearTimeout(autoSpinTimerRef.current);
      autoSpinTimerRef.current = null;
    }

    const nextBalance = balanceRef.current - actualCost;
    balanceRef.current = nextBalance;
    setBalance(nextBalance);

    isSpinningRef.current = true;
    setIsSpinning(true);
    setWinningLines([]);
    setWinDisplayAmount(0);
    setWinStatusText('جارٍ الدوران...');

    // Authentic banners matching the screenshots
    const spinBanners = [
      'لوحظة بشكل عشوائي بتأثيرا مضاعفة',
      'الفوز (حتى x15)',
      'مضاعفات النتائج ستكون 2x أو أعلى.',
      'فرصة تحقيق مضاعفات النتائج ستكون...',
      'عند الاستخدام ، يتم منح جائزة كل رول',
      'نقاط المضاعف التي يتم تحقيقها من...',
    ];
    setBannerMessage(spinBanners[Math.floor(Math.random() * spinBanners.length)]);

    soundEngine.startSpinLoop();
    setReelSpinningState([true, true, true, true]);

    const result = generateSpinResult(betUsed, exActive);

    const baseDuration = turbo ? 220 : 650;
    const reelGap = turbo ? 160 : 320;

    // Clear any leftover timers before scheduling this spin's reel stops
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    const t0 = setTimeout(() => {
      setGrid((prev) => [result.grid[0], prev[1], prev[2]]);
      setReelSpinningState((prev) => [false, prev[1], prev[2], prev[3]]);
      soundEngine.playReelStop(0);
    }, baseDuration);

    const t1 = setTimeout(() => {
      setGrid((prev) => [prev[0], result.grid[1], prev[2]]);
      setReelSpinningState((prev) => [prev[0], false, prev[2], prev[3]]);
      soundEngine.playReelStop(1);
    }, baseDuration + reelGap);

    const t2 = setTimeout(() => {
      setGrid((prev) => [prev[0], prev[1], result.grid[2]]);
      setReelSpinningState((prev) => [prev[0], prev[1], false, prev[3]]);
      soundEngine.playReelStop(2);
    }, baseDuration + reelGap * 2);

    const t3 = setTimeout(() => {
      setSpecialReel(result.specialReel);
      setReelSpinningState([false, false, false, false]);
      soundEngine.stopSpinLoop();

      const isHigh = result.multiplierValue >= 10 || result.centerSpecial === 'WHEEL';
      soundEngine.playSpecialReelStop(isHigh);

      if (result.isWheelTriggered) {
        pendingWheelBaseWinRef.current = result.baseWin;
        setWinningLines(result.winningLines);
        setBannerMessage('🔥 تم تفعيل عجلة الحظ الأسطورية! 🔥');
        setWinStatusText('عجلة الحظ تدور الآن!');
        setIsWheelBonusActive(true);
        setTargetWheelMultiplier(result.wheelMultiplier ?? (result.wheelWin / betUsed || 5));
      } else {
        finishSpin(result, betUsed);
      }
    }, baseDuration + reelGap * 3);

    timersRef.current = [t0, t1, t2, t3];
  }, [finishSpin, showToast]);

  useEffect(() => {
    executeSpinRef.current = executeSpin;
  }, [executeSpin]);

  const handleWheelSpinComplete = useCallback(
    (wonMultiplier: number, prizeCoins: number) => {
      const baseWin = pendingWheelBaseWinRef.current;
      pendingWheelBaseWinRef.current = 0;
      const totalCombinedWin = baseWin + prizeCoins;

      setIsWheelBonusActive(false);
      setTargetWheelMultiplier(null);
      isSpinningRef.current = false;
      setIsSpinning(false);

      const nextBalance = balanceRef.current + totalCombinedWin;
      balanceRef.current = nextBalance;
      setBalance(nextBalance);
      setWinDisplayAmount(totalCombinedWin);
      setWinStatusText(`جائزة عجلة الحظ! +${totalCombinedWin.toLocaleString('en-US')}`);

      if (totalCombinedWin > playerBestWinRef.current) {
        playerBestWinRef.current = totalCombinedWin;
        setPlayerBestWin(totalCombinedWin);
      }

      setBigWinAmount(totalCombinedWin);
      setBigWinOpen(true);

      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        name: 'أنت (عجلة الحظ)',
        avatar: '🌟',
        winAmount: totalCombinedWin,
        multiplier: `${wonMultiplier}x`,
        date: 'الآن',
        isPlayer: true,
      };
      setLeaderboard((prev) => [newEntry, ...prev.slice(0, 7)]);

      setBannerMessage(`جائزة عجلة الحظ الكبرى: ${wonMultiplier}x!`);
      advanceAutoSpin(totalCombinedWin, true);
    },
    [advanceAutoSpin]
  );

  return (
    <div className="relative min-h-screen w-full text-white flex flex-col items-center justify-center overflow-x-hidden select-none bg-[#0a0603]">
      
      {/* Authentic Tropical Jungle & Ancient Temple Backdrop (matching Screenshots) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <img
          src={ASSETS.templeBg}
          alt="Temple Jungle Background"
          className="w-full h-full max-w-[460px] object-cover object-top opacity-95 filter brightness-100"
        />
        {/* Subtle shadow gradient overlay to enhance slot contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      {/* Main Mobile App Frame */}
      <div className="relative z-10 w-full max-w-[430px] min-h-screen flex flex-col justify-between py-1 px-0.5 mx-auto">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-2 border-yellow-200 text-stone-950 font-black text-xs sm:text-sm shadow-2xl animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* 1. Top Header Bar (matching Screenshot 1 & 3 & IMG-20261008-WA0081.jpg) */}
        <TopHeader
          balance={balance}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenHelp={() => {
            setHelpPage(0);
            setHelpOpen(true);
          }}
          onAddCoins={handleAddFreeCoins}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* 2. Main Game Arena: Mayan Fortune Wheel + Temple Slot Grid */}
        <main className="w-full flex-1 flex flex-col items-center justify-center px-1 py-0.5">
          
          {/* Fortune Wheel mounted in the temple trees */}
          <FortuneWheel
            currentBet={currentBet}
            isSpinning={isWheelBonusActive}
            targetMultiplier={targetWheelMultiplier}
            onSpinComplete={handleWheelSpinComplete}
            isTriggeredBonus={isWheelBonusActive}
            className="-mb-3 sm:-mb-4 z-10"
          />

          {/* Slot Reels with Temple Pillars & Multiplier Reel */}
          <SlotReels
            grid={grid}
            specialReel={specialReel}
            isSpinning={isSpinning}
            reelSpinningState={reelSpinningState}
            winningLines={winningLines}
            isExActive={isExActive}
            onToggleEx={() => {
              if (isSpinningRef.current) return;
              soundEngine.playClick();
              const next = !isExActiveRef.current;
              isExActiveRef.current = next;
              setIsExActive(next);
            }}
            onOpenExHelp={() => {
              setHelpPage(2);
              setHelpOpen(true);
            }}
            bannerMessage={bannerMessage}
            winDisplayAmount={winDisplayAmount}
          />

        </main>

        {/* 3. Bottom Controls, Bet Selector, Turbo, Auto, Start Button */}
        <footer className="w-full mt-auto">
          <BottomControls
            currentBet={currentBet}
            isExActive={isExActive}
            onBetChange={(newBet) => {
              if (isSpinningRef.current) return;
              soundEngine.playClick();
              currentBetRef.current = newBet;
              setCurrentBet(newBet);
            }}
            onOpenBetSelector={() => {
              if (isSpinningRef.current) return;
              soundEngine.playClick();
              setBetSelectorOpen(true);
            }}
            isTurbo={isTurbo}
            onToggleTurbo={() => {
              soundEngine.playClick();
              const next = !isTurboRef.current;
              isTurboRef.current = next;
              setIsTurbo(next);
            }}
            autoSpinCount={autoSpinCount}
            onSetAutoSpins={(count) => {
              soundEngine.playClick();
              autoSpinCountRef.current = count;
              setAutoSpinCount(count);
              if (count === 0) {
                pendingAutoResumeRef.current = false;
                if (autoSpinTimerRef.current) {
                  clearTimeout(autoSpinTimerRef.current);
                  autoSpinTimerRef.current = null;
                }
              } else if (!isSpinningRef.current && !bigWinOpen) {
                executeSpin();
              }
            }}
            isSpinning={isSpinning}
            onSpin={() => {
              soundEngine.playClick();
              executeSpin();
            }}
            winDisplayAmount={winDisplayAmount}
            winStatusText={winStatusText}
          />
        </footer>

      </div>

      {/* Modals & Celebrations */}
      <BigWinModal
        isOpen={bigWinOpen}
        winAmount={bigWinAmount}
        betAmount={currentBet}
        onClose={() => {
          setBigWinOpen(false);
          if (pendingAutoResumeRef.current && autoSpinCountRef.current > 0 && !isSpinningRef.current) {
            pendingAutoResumeRef.current = false;
            scheduleAutoSpin(isTurboRef.current ? 450 : 750, () => executeSpinRef.current());
          }
        }}
      />

      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        initialPage={helpPage}
      />

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        entries={leaderboard}
        playerBestWin={playerBestWin}
      />

      <BetSelectorModal
        isOpen={betSelectorOpen}
        onClose={() => setBetSelectorOpen(false)}
        currentBet={currentBet}
        onSelectBet={(b) => {
          if (isSpinningRef.current) return;
          currentBetRef.current = b;
          setCurrentBet(b);
        }}
        isExActive={isExActive}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isTurbo={isTurbo}
        onToggleTurbo={() => {
          const next = !isTurboRef.current;
          isTurboRef.current = next;
          setIsTurbo(next);
        }}
        onOpenHelp={() => {
          setHelpPage(0);
          setHelpOpen(true);
        }}
        onAddFreeCoins={handleAddFreeCoins}
      />

    </div>
  );
}
