
import type { CrosswordWord } from '@/data/crosswordData'


export interface Cell {
  letter: string
  userInput: string
  isBlocked: boolean
}

export interface Grid {
  rows: number
  cols: number
  cells: Cell[][]
}

export function createEmptyGrid(
  rows: number,
  cols: number
): Grid {
  return {
    rows,
    cols,
    cells: Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        letter: '',
        userInput: '',
        isBlocked: false,
      }))
    ),
  }
}


export function createGridFromWords(
  rows: number,
  cols: number,
  words: CrosswordWord[]
): Grid {
  const grid = createEmptyGrid(rows, cols)

  words.forEach((word) => {
    const letters = word.word.toUpperCase().split('')

    letters.forEach((letter, index) => {
      const row =
        word.direction === 'across'
          ? word.row
          : word.row + index

      const col =
        word.direction === 'across'
          ? word.col + index
          : word.col

      if (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < cols
      ) {
        grid.cells[row][col].letter = letter
      }
    })
  })

  return grid
}

/**
 * Check if a single word is completed correctly
 */
export function checkWord(
  grid: Grid,
  word: CrosswordWord
): boolean {
  const letters = word.word.toUpperCase().split('')

  return letters.every((letter, index) => {
    const row =
      word.direction === 'across'
        ? word.row
        : word.row + index

    const col =
      word.direction === 'across'
        ? word.col + index
        : word.col

    const cell = grid.cells[row]?.[col]
    if (!cell) return false

    return cell.userInput.toUpperCase() === letter
  })
}

/**
 * Check if the entire grid is solved
 */
export function isGridComplete(
  grid: Grid,
  words: CrosswordWord[]
): boolean {
  return words.every((word) => checkWord(grid, word))
}

/**
 * Reveal the solution by copying correct letters into userInput
 */
export function revealSolution(
  grid: Grid,
  words: CrosswordWord[]
): Grid {
  const newGrid: Grid = {
    ...grid,
    cells: grid.cells.map((row) =>
      row.map((cell) => ({ ...cell }))
    ),
  }

  words.forEach((word) => {
    word.word
      .toUpperCase()
      .split('')
      .forEach((letter, index) => {
        const row =
          word.direction === 'across'
            ? word.row
            : word.row + index

        const col =
          word.direction === 'across'
            ? word.col + index
            : word.col

        const cell = newGrid.cells[row]?.[col]
        if (cell) {
          cell.userInput = letter
        }
      })
  })

  return newGrid
}


export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}
