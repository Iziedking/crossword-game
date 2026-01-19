import type { CrosswordWord } from '@/data/crosswordData'

export interface Cell {
  letter: string | null
  userInput: string
}

export interface Grid {
  rows: number
  cols: number
  cells: Cell[][]
}

export function createGrid(rows: number, cols: number, words: CrosswordWord[]): Grid {
  // Initialize empty grid
  const cells: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: null, userInput: '' }))
  )

  // Place words on grid
  for (const word of words) {
    for (let i = 0; i < word.word.length; i++) {
      const row = word.direction === 'across' ? word.row : word.row + i
      const col = word.direction === 'across' ? word.col + i : word.col
      
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        cells[row][col].letter = word.word[i]
      }
    }
  }

  return { rows, cols, cells }
}

export function checkWord(grid: Grid, word: CrosswordWord): boolean {
  for (let i = 0; i < word.word.length; i++) {
    const row = word.direction === 'across' ? word.row : word.row + i
    const col = word.direction === 'across' ? word.col + i : word.col
    
    const cell = grid.cells[row]?.[col]
    if (!cell || cell.userInput.toUpperCase() !== word.word[i].toUpperCase()) {
      return false
    }
  }
  return true
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
