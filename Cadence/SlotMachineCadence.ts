type AnticipatorConfig = {
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};

type SlotCoordinate = {
  column: number;
  row: number;
};

type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };

type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};

type SlotCadence = Array<number>;

type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};

/**
 * Anticipator configuration. Has all information needed to check anticipator.
 * @param columnSize It's the number of columns the slot machine has.
 * @param minToAnticipate It's the minimum number of symbols to start anticipation.
 * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
 * @param anticipateCadence It's the cadence value when has anticipation.
 * @param defaultCadence It's the cadence value when don't has anticipation.
 */
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 6,
  minToAnticipate: 2,
  maxToAnticipate: 3,
  anticipateCadence: 2,
  defaultCadence: 0.25,
};

/**
 * Game rounds with special symbols position that must be used to generate the SlotCadences.
 */
const gameRounds: RoundsSymbols = {
  roundOne: {
    specialSymbols: [
      { column: 3, row: 4 },
      { column: 0, row: 2 },
      { column: 1, row: 3 },
    ],
  },
  roundTwo: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 0, row: 3 },
    ],
  },
  roundThree: {
    specialSymbols: [
      { column: 4, row: 3 },
      { column: 4, row: 1 },
      { column: 4, row: 3 },
      { column: 4, row: 3 },
      { column: 4, row: 1 },
      { column: 4, row: 3 },
      { column: 4, row: 1 },
      { column: 4, row: 3 },
      { column: 4, row: 1 },
    ],
  },
};


/**
 * This must be used to get all game rounds cadences.
 */
const slotMachineCadences: RoundsCadences = { roundOne: [], roundTwo: [], roundThree: [] };

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
 */
function slotCadence(symbols: Array<SlotCoordinate>): SlotCadence {
  // sort the symbols by column and remove duplicates
  symbols.sort((a, b) => {
    if (a.column !== b.column) {
      return a.column - b.column;
    }
    return a.row - b.row;
  });

  symbols = symbols.filter((symbol, index, self) => 
    {
      if( index === 0 ) return true; 

      let previousSymbol = self[index - 1];
      return previousSymbol.column !== symbol.column || previousSymbol.row !== symbol.row;
    }
  );
  
  // calculate the cadences
  let numberOfSpecialSymbols = 0;
  let cadence: SlotCadence = [];
  let accumulatedCadence = 0;

  for (let column = 0; column < anticipatorConfig.columnSize; column++) {
    cadence.push(accumulatedCadence);

    const specialSymbolInColumn = symbols.filter((symbol) => symbol.column === column).length;
    numberOfSpecialSymbols += specialSymbolInColumn;

    if(numberOfSpecialSymbols >= anticipatorConfig.minToAnticipate && numberOfSpecialSymbols < anticipatorConfig.maxToAnticipate) {
      accumulatedCadence += anticipatorConfig.anticipateCadence;
    } else {
      accumulatedCadence += anticipatorConfig.defaultCadence;
    }
    
  }
  // Magic
  return cadence;
}

/**
 * Get all game rounds and return the final cadences of each.
 * @param rounds RoundsSymbols with contains all rounds special symbols positions.
 * @return RoundsCadences has all cadences for each game round.
 */
function handleCadences(rounds: RoundsSymbols): RoundsCadences {
  slotMachineCadences.roundOne = slotCadence(rounds.roundOne.specialSymbols);
  slotMachineCadences.roundTwo = slotCadence(rounds.roundTwo.specialSymbols);
  slotMachineCadences.roundThree = slotCadence(rounds.roundThree.specialSymbols);

  return slotMachineCadences;
}

console.log('CADENCES: ', handleCadences(gameRounds));
