import { useState, useEffect, useCallback, useRef } from 'react'
import type { CrosswordWord } from '@/data/crosswordData'
import { createGrid, checkWord, type Grid } from '@/utils/crosswordUtils'

interface UseGameStateProps {
  rows: number
  cols: number
  words: CrosswordWord[]
}

export function useGameState({ rows, cols, words }: UseGameStateProps) {
  const [grid, setGrid] = useState<Grid>(() => createGrid(rows, cols, words))
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Check for completion
  useEffect(() => {
    const allComplete = words.every((word) => checkWord(grid, word))
    if (allComplete && !isComplete) {
      setIsComplete(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [grid, words, isComplete])

  const updateCell = useCallback((row: number, col: number, value: string) => {
    setGrid((prev) => {
      const newCells = prev.cells.map((r) => r.map((c) => ({ ...c })))
      if (newCells[row]?.[col]) {
        newCells[row][col].userInput = value.toUpperCase()
      }
      return { ...prev, cells: newCells }
    })
  }, [])

  const showSolution = useCallback(() => {
    setGrid((prev) => {
      const newCells = prev.cells.map((row) =>
        row.map((cell) => ({
          ...cell,
          userInput: cell.letter || ''
        }))
      )
      return { ...prev, cells: newCells }
    })
    setIsComplete(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  return {
    grid,
    secondsElapsed,
    isComplete,
    updateCell,
    showSolution,
  }
}
