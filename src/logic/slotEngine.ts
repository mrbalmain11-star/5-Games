import {
  SymbolId,
  SpecialSymbolId,
  SYMBOLS,
  PAYLINES,
  WHEEL_MULTIPLIERS,
  WinningLine,
  SpinResult,
} from '../types/game';

// Weights for standard reels
const STANDARD_REEL_WEIGHTS: { symbol: SymbolId; weight: number }[] = [
  { symbol: 'WILD', weight: 6 },
  { symbol: 'GEM_RED', weight: 8 },
  { symbol: 'GEM_BLUE', weight: 10 },
  { symbol: 'GEM_GREEN', weight: 12 },
  { symbol: 'A', weight: 16 },
  { symbol: 'K', weight: 16 },
  { symbol: 'Q', weight: 16 },
  { symbol: 'J', weight: 16 },
];

const NORMAL_SPECIAL_WEIGHTS: { symbol: SpecialSymbolId; weight: number }[] = [
  { symbol: '1x', weight: 38 },
  { symbol: '2x', weight: 26 },
  { symbol: '3x', weight: 16 },
  { symbol: '5x', weight: 10 },
  { symbol: '10x', weight: 5 },
  { symbol: '15x', weight: 2 },
  { symbol: 'WHEEL', weight: 3 },
];

// In EX mode: 1x is eliminated, high multipliers boosted
const EX_SPECIAL_WEIGHTS: { symbol: SpecialSymbolId; weight: number }[] = [
  { symbol: '2x', weight: 26 },
  { symbol: '3x', weight: 24 },
  { symbol: '5x', weight: 22 },
  { symbol: '10x', weight: 14 },
  { symbol: '15x', weight: 7 },
  { symbol: 'WHEEL', weight: 7 },
];

function pickWeightedSymbol<T>(items: { symbol: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    if (random < item.weight) {
      return item.symbol;
    }
    random -= item.weight;
  }
  return items[0].symbol;
}

export function generateSpinResult(bet: number, isExActive: boolean): SpinResult {
  // Generate 3x3 main grid
  const grid: SymbolId[][] = [
    [pickWeightedSymbol(STANDARD_REEL_WEIGHTS), pickWeightedSymbol(STANDARD_REEL_WEIGHTS), pickWeightedSymbol(STANDARD_REEL_WEIGHTS)],
    [pickWeightedSymbol(STANDARD_REEL_WEIGHTS), pickWeightedSymbol(STANDARD_REEL_WEIGHTS), pickWeightedSymbol(STANDARD_REEL_WEIGHTS)],
    [pickWeightedSymbol(STANDARD_REEL_WEIGHTS), pickWeightedSymbol(STANDARD_REEL_WEIGHTS), pickWeightedSymbol(STANDARD_REEL_WEIGHTS)],
  ];

  // Occasionally boost excitement with partial matching if random roll
  if (Math.random() < 0.28) {
    const luckySymbol = pickWeightedSymbol(STANDARD_REEL_WEIGHTS);
    const luckyLine = Math.floor(Math.random() * 5);
    const coords = PAYLINES[luckyLine].coords;
    coords.forEach(([r, row]) => {
      grid[r][row] = Math.random() < 0.3 ? 'WILD' : luckySymbol;
    });
  }

  // Generate Reel 4 (Special Reel)
  const specialWeights = isExActive ? EX_SPECIAL_WEIGHTS : NORMAL_SPECIAL_WEIGHTS;
  const specialReel: SpecialSymbolId[] = [
    pickWeightedSymbol(specialWeights),
    pickWeightedSymbol(specialWeights), // Center is index 1
    pickWeightedSymbol(specialWeights),
  ];

  const centerSpecial = specialReel[1];

  // Evaluate Paylines
  const winningLines: WinningLine[] = [];
  let baseWin = 0;

  PAYLINES.forEach((line) => {
    const s0 = grid[line.coords[0][0]][line.coords[0][1]];
    const s1 = grid[line.coords[1][0]][line.coords[1][1]];
    const s2 = grid[line.coords[2][0]][line.coords[2][1]];

    const symbols = [s0, s1, s2];
    const nonWilds = symbols.filter((s) => s !== 'WILD');

    let isWin = false;
    let winningSymbol: SymbolId = 'WILD';

    if (nonWilds.length === 0) {
      // 3 WILDs
      isWin = true;
      winningSymbol = 'WILD';
    } else {
      const target = nonWilds[0];
      const allMatch = nonWilds.every((s) => s === target);
      if (allMatch) {
        isWin = true;
        winningSymbol = target;
      }
    }

    if (isWin) {
      const payoutMultiplier = SYMBOLS[winningSymbol].payoutMultiplier;
      const lineBasePayout = payoutMultiplier * bet;
      winningLines.push({
        lineIndex: line.id,
        symbol: winningSymbol,
        payoutBase: payoutMultiplier,
        totalPayout: lineBasePayout,
        coords: line.coords,
      });
      baseWin += lineBasePayout;
    }
  });

  // Evaluate Center Reel 4 multiplier & Wheel Trigger
  let multiplierValue = 1;
  let isWheelTriggered = false;
  let wheelWin = 0;

  if (centerSpecial === 'WHEEL') {
    if (winningLines.length > 0) {
      isWheelTriggered = true;
    } else {
      // When wheel lands without line win, give small consolation or 1x
      multiplierValue = 1;
    }
  } else {
    // Parse multiplier '1x', '2x', etc.
    multiplierValue = parseInt(centerSpecial.replace('x', ''), 10) || 1;
  }

  // Total win calculation
  let totalWin = 0;
  let wheelMultiplier: number | undefined = undefined;
  if (isWheelTriggered) {
    // Pick wheel prize from WHEEL_MULTIPLIERS
    // Weights: higher prizes rarer
    const wheelWeights = [
      { mult: 1, w: 25 },
      { mult: 3, w: 20 },
      { mult: 5, w: 18 },
      { mult: 8, w: 12 },
      { mult: 10, w: 9 },
      { mult: 15, w: 6 },
      { mult: 20, w: 4 },
      { mult: 30, w: 3 },
      { mult: 50, w: 1.8 },
      { mult: 100, w: 0.8 },
      { mult: 200, w: 0.3 },
      { mult: 1000, w: 0.1 },
    ];
    let r = Math.random() * wheelWeights.reduce((s, w) => s + w.w, 0);
    let chosen = 5;
    for (const w of wheelWeights) {
      if (r < w.w) {
        chosen = w.mult;
        break;
      }
      r -= w.w;
    }
    wheelMultiplier = chosen;
    wheelWin = chosen * bet;
    totalWin = baseWin + wheelWin;
  } else {
    totalWin = baseWin * multiplierValue;
  }

  return {
    grid,
    specialReel,
    centerSpecial,
    multiplierValue,
    winningLines,
    baseWin,
    totalWin,
    isWheelTriggered,
    wheelWin,
    wheelMultiplier,
    isExActive,
  };
}
