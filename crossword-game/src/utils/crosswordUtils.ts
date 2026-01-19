import type { CrosswordWord } from '@/data/crosswordData'

export interface Cell {
  letter: string | null
  userInput: string
  isHint: boolean
}

export interface Grid {
  rows: number
  cols: number
  cells: Cell[][]
}

export function createGrid(rows: number, cols: number, words: CrosswordWord[]): Grid {
  // Initialize empty grid
  const cells: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: null, userInput: '', isHint: false }))
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

  // Generate random hints
  const hints = generateRandomHints(words)
  
  // Apply hints to grid
  for (const hint of hints) {
    const { row, col, letter } = hint
    if (cells[row]?.[col]) {
      cells[row][col].userInput = letter.toUpperCase()
      cells[row][col].isHint = true
    }
  }

  return { rows, cols, cells }
}

interface HintPosition {
  row: number
  col: number
  letter: string
}

function generateRandomHints(words: CrosswordWord[]): HintPosition[] {
  const hints: HintPosition[] = []
  const usedPositions = new Set<string>()
  
  // Determine number of hints based on total words
  // Fewer words = more likely to get hints per word
  // More words = fewer hints overall
  const totalWords = words.length
  
  let numHints: number
  if (totalWords <= 3) {
    // Level 1 (easy): 1-2 hints
    numHints = Math.random() < 0.7 ? 1 : 2
  } else if (totalWords <= 7) {
    // Level 2 (medium): 2-3 hints
    numHints = Math.random() < 0.6 ? 2 : 3
  } else {
    // Level 3 (hard): 2-4 hints, rarely 4
    const rand = Math.random()
    if (rand < 0.5) numHints = 2
    else if (rand < 0.85) numHints = 3
    else numHints = 4
  }
  
  // Shuffle words to pick random ones for hints
  const shuffledWords = [...words].sort(() => Math.random() - 0.5)
  
  // Pick hints from different words
  for (let i = 0; i < Math.min(numHints, shuffledWords.length); i++) {
    const word = shuffledWords[i]
    
    // Pick a random position within the word (not first letter to make it harder)
    // Prefer middle letters for longer words
    let letterIndex: number
    if (word.word.length <= 3) {
      // Short words: any position
      letterIndex = Math.floor(Math.random() * word.word.length)
    } else if (word.word.length <= 5) {
      // Medium words: avoid first letter 70% of the time
      if (Math.random() < 0.7) {
        letterIndex = 1 + Math.floor(Math.random() * (word.word.length - 1))
      } else {
        letterIndex = Math.floor(Math.random() * word.word.length)
      }
    } else {
      // Long words: prefer middle section
      const start = Math.floor(word.word.length * 0.2)
      const end = Math.floor(word.word.length * 0.8)
      letterIndex = start + Math.floor(Math.random() * (end - start))
    }
    
    // Calculate grid position
    const row = word.direction === 'across' ? word.row : word.row + letterIndex
    const col = word.direction === 'across' ? word.col + letterIndex : word.col
    const posKey = `${row},${col}`
    
    // Skip if position already has a hint
    if (usedPositions.has(posKey)) continue
    
    usedPositions.add(posKey)
    hints.push({
      row,
      col,
      letter: word.word[letterIndex]
    })
  }
  
  return hints
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