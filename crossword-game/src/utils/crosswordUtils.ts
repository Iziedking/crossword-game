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

export function createGrid(rows: number, cols: number, words: CrosswordWord[], levelId: number): Grid {
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

  // Generate random hints based on level
  const hints = generateRandomHints(words, levelId)
  
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

function generateRandomHints(words: CrosswordWord[], levelId: number): HintPosition[] {
  const hints: HintPosition[] = []
  const usedPositions = new Set<string>()
  
  let numHints: number
  
  if (levelId === 1) {
    // Level 1: At most 3 hints (1-3)
    numHints = 1 + Math.floor(Math.random() * 3) // 1, 2, or 3
  } else if (levelId === 2) {
    // Level 2: At least 3 hints (3-5)
    numHints = 3 + Math.floor(Math.random() * 3) // 3, 4, or 5
  } else {
    // Level 3: At least 3 hints (3-6)
    numHints = 3 + Math.floor(Math.random() * 4) // 3, 4, 5, or 6
  }
  
  // Shuffle words to pick random ones for hints
  const shuffledWords = [...words].sort(() => Math.random() - 0.5)
  
  // We might need multiple hints from same word if numHints > words.length
  let wordIndex = 0
  let attempts = 0
  const maxAttempts = numHints * 3
  
  while (hints.length < numHints && attempts < maxAttempts) {
    attempts++
    const word = shuffledWords[wordIndex % shuffledWords.length]
    wordIndex++
    
    // Pick a random position within the word
    let letterIndex: number
    if (word.word.length <= 3) {
      letterIndex = Math.floor(Math.random() * word.word.length)
    } else if (word.word.length <= 5) {
      // Prefer non-first letters
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