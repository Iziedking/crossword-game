import { useState, useEffect, useCallback, useRef } from 'react'
import type { CrosswordWord } from '@/data/crosswordData'
import { createGrid, checkWord, type Grid } from '@/utils/crosswordUtils'

interface UseGameStateProps {
  rows: number
  cols: number
  words: CrosswordWord[]
  levelId: number
  initialTime: number
}

export function useGameState({ rows, cols, words, levelId, initialTime }: UseGameStateProps) {
  const [grid, setGrid] = useState<Grid>(() => createGrid(rows, cols, words, levelId))
  const [secondsElapsed, setSecondsElapsed] = useState(initialTime)
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
      const cell = prev.cells[row]?.[col]
      // Don't allow editing hint cells
      if (!cell || cell.isHint) return prev
      
      const newCells = prev.cells.map((r) => r.map((c) => ({ ...c })))
      newCells[row][col].userInput = value.toUpperCase()
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