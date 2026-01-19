export interface CrosswordWord {
  word: string;
  clue: string;
  clueNumber: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
}

export interface CrosswordLevel {
  id: number;
  name: string;
  title: string;
  difficulty: string;
  note?: string;
  words: CrosswordWord[];
  gridSize: { rows: number; cols: number };
}

// Level 1: Know Your Billions Team
const level1Words: CrosswordWord[] = [
  { word: 'JAVI', clue: 'CM', clueNumber: 1, direction: 'across', row: 3, col: 0 },
  { word: 'LUNATICANTO', clue: 'LATAM Lead', clueNumber: 2, direction: 'down', row: 0, col: 1 },
  { word: 'CABEN', clue: 'Creator Growth', clueNumber: 3, direction: 'across', row: 7, col: 0 },
];

// Level 2: Know Your Yappers
const level2Words: CrosswordWord[] = [
  { word: 'MONICATALAN', clue: 'Top5', clueNumber: 1, direction: 'across', row: 4, col: 0 },
  { word: 'JAVI', clue: 'Top3', clueNumber: 2, direction: 'down', row: 1, col: 3 },
  { word: 'GHOST', clue: 'Top10', clueNumber: 3, direction: 'down', row: 2, col: 1 },
  { word: 'NIKYAPS', clue: '80-100', clueNumber: 4, direction: 'down', row: 4, col: 2 },
  { word: 'HIZZY', clue: '80-95', clueNumber: 5, direction: 'across', row: 7, col: 4 },
  { word: 'ADRI', clue: '45-60', clueNumber: 6, direction: 'down', row: 4, col: 5 },
  { word: 'THEBKI', clue: '70-80', clueNumber: 7, direction: 'down', row: 6, col: 4 },
];

// Level 3: Know Your Billions Partners
const level3Words: CrosswordWord[] = [
  { word: 'SINGULARITYNET', clue: 'Partnered with Billions to make AI trustworthy with decentralized identity', clueNumber: 1, direction: 'across', row: 5, col: 0 },
  { word: 'SONYBANK', clue: 'Consulted with SettleMint to work with Billions as one of the largest fintech companies in Japan', clueNumber: 2, direction: 'across', row: 2, col: 0 },
  { word: 'AGGLAYER', clue: 'This product connects blockchains and Billions is their official identity layer', clueNumber: 3, direction: 'down', row: 2, col: 5 },
  { word: 'GATEWAY', clue: 'Provides the infrastructure to make Billions an enterprise grade product', clueNumber: 4, direction: 'down', row: 5, col: 3 },
  { word: 'BASE', clue: 'Billions works as the native identity layer for this L2 blockchain', clueNumber: 5, direction: 'down', row: 4, col: 6 },
  { word: 'DISCO', clue: 'Announced a merger with Privado ID to launch unified identity across blockchains and legacy systems', clueNumber: 6, direction: 'down', row: 4, col: 1 },
  { word: 'TRIA', clue: 'Borderless web3 banking with a Visa-powered card', clueNumber: 7, direction: 'down', row: 5, col: 9 },
  { word: 'CAMP', clue: 'Partnered with Billions to preserve human creativity in the AI era', clueNumber: 8, direction: 'across', row: 8, col: 8 },
];

export const levels: CrosswordLevel[] = [
  {
    id: 1,
    name: 'Meh',
    title: 'Know Your Billions Team',
    difficulty: 'Easy',
    note: 'All names are X (formerly Twitter) usernames.',
    words: level1Words,
    gridSize: { rows: 12, cols: 6 },
  },
  {
    id: 2,
    name: 'Wait',
    title: 'Know Your Yappers',
    difficulty: 'Medium',
    note: 'All names are X (formerly Twitter) usernames. The hints refer to their position on the creator Yapper leaderboard. Note: Positions are subject to change.',
    words: level2Words,
    gridSize: { rows: 12, cols: 12 },
  },
  {
    id: 3,
    name: 'Damn',
    title: 'Know Your Billions Partners',
    difficulty: 'Hard',
    words: level3Words,
    gridSize: { rows: 13, cols: 15 },
  },
];