
type WinningCombinationsResult = [number, number[]][];

type CurrentCombination = {
  symbol: number;
  count: number;
  specialSequenceCount: number;
  indexes: number[];
};

function isPaySymbol(symbol: number): boolean {
  return symbol < 10;
}

function call(lines: number[]): WinningCombinationsResult {
  const winningCombinations: WinningCombinationsResult = [];

  let currentCombination: CurrentCombination = {
    symbol: -1,
    count: 0,
    specialSequenceCount: 0,
    indexes: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const symbol = lines[i];

    if(!isPaySymbol(symbol)) {
      if( currentCombination.count > 2) {
        winningCombinations.push([currentCombination.symbol, currentCombination.indexes]);
      }
      currentCombination = { symbol: -1, count: 0, specialSequenceCount: 0, indexes: [] };
      continue;
    }

    // handle wild cases
    if(symbol === 0) {
      // handle wild sequence start
      if(currentCombination.count === 0) {
        currentCombination.symbol = 0;  
      }

      currentCombination.count++;
      currentCombination.specialSequenceCount++;
      currentCombination.indexes.push(i);
    } 
    // handle previous sequence was wild sequence
    else if( currentCombination.symbol === 0 ) {
      currentCombination.count++;
      currentCombination.symbol = symbol;
      currentCombination.specialSequenceCount = 0;
      currentCombination.indexes.push(i);
    }
    // handle same symbol sequence 
    else if (currentCombination.symbol === symbol) {
      currentCombination.count++;
      currentCombination.specialSequenceCount = 0;
      currentCombination.indexes.push(i);
    } 
    // handle different symbol sequence
    else { // new sequence
      if (currentCombination.count > 2) {
        winningCombinations.push([currentCombination.symbol, currentCombination.indexes]);
      } 

      currentCombination = { 
        symbol: symbol, 
        count: 1 + currentCombination.specialSequenceCount, 
        specialSequenceCount: currentCombination.specialSequenceCount, 
        indexes: [...currentCombination.indexes.slice(currentCombination.indexes.length - currentCombination.specialSequenceCount, currentCombination.indexes.length), i] 
      };
    }
  }

  if (currentCombination.count > 2) {
    winningCombinations.push([currentCombination.symbol, currentCombination.indexes]);
  }

  return winningCombinations;
}

export const WinningCombinations = { call };
