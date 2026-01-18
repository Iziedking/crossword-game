import { useEffect, useState } from 'react'
import type { CrosswordWord } from '@/data/crosswordData'
import {
  createGridFromWords,
  isGridComplete,
  revealSolution,
  type Grid,
} from '@/utils/crosswordUtils'

interface UseGameStateOptions {
  rows: number
  cols: number
  words: CrosswordWord[]
}

export function useGameState({
  rows,
  cols,
  words,
}: UseGameStateOptions) {
  const [grid, setGrid] = useState<Grid>(() =>
    createGridFromWords(rows, cols, words)
  )

  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Timer
  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      setSecondsElapsed((s) => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isComplete])

  // Completion check
  useEffect(() => {
    if (isGridComplete(grid, words)) {
      setIsComplete(true)
    }
  }, [grid, words])

  function updateCell(
    row: number,
    col: number,
    value: string
  ) {
    if (isComplete) return

    setGrid((prev) => {
      const next: Grid = {
        ...prev,
        cells: prev.cells.map((r) =>
          r.map((c) => ({ ...c }))
        ),
      }

      const cell = next.cells[row]?.[col]
      if (!cell || cell.isBlocked) return prev

      cell.userInput = value.toUpperCase().slice(-1)
      return next
    })
  }

 
   // Restart the game
 
  function resetGame() {
    setGrid(createGridFromWords(rows, cols, words))
    setSecondsElapsed(0)
    setIsComplete(false)
  }


  function showSolution() {
    setGrid((prev) => revealSolution(prev, words))
    setIsComplete(true)
  }

  return {
    grid,
    secondsElapsed,
    isComplete,
    updateCell,
    resetGame,
    showSolution,
  }
}
