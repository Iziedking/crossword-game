import { useState, useCallback, useEffect, useRef } from 'react'
import type { CrosswordLevel } from '@/data/crosswordData'
import { checkWord, formatTime } from '@/utils/crosswordUtils'
import { useGameState } from '@/hooks/useGameState'
import { CrosswordGrid } from './CrosswordGrid'
import { CluesPanel } from './CluesPanel'
import { useSoundEffects } from '@/hooks/useSoundEffects'

interface GameBoardProps {
  level: CrosswordLevel
  onComplete: () => void
  onBack: () => void
  onRestartFromLevel1: () => void
}

export function GameBoard({
  level,
  onComplete,
  onBack,
  onRestartFromLevel1,
}: GameBoardProps) {
  const {
    grid,
    secondsElapsed,
    isComplete,
    updateCell,
    showSolution,
  } = useGameState({
    rows: level.gridSize.rows,
    cols: level.gridSize.cols,
    words: level.words,
  })

  const [selectedCell, setSelectedCell] =
    useState<{ row: number; col: number } | null>(null)
  const [selectedDirection, setSelectedDirection] =
    useState<'across' | 'down'>('across')
  const [completedWords, setCompletedWords] = useState<number[]>([])
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const prevCompletedWordsRef = useRef<number[]>([])
  const { playCorrectWord, playLevelComplete } = useSoundEffects()

  // Reset UI state when level changes
  useEffect(() => {
    setSelectedCell(null)
    setSelectedDirection('across')
    setCompletedWords([])
    setShowCompletionModal(false)
    prevCompletedWordsRef.current = []
  }, [level.id])

  // Check completed words + sounds
  useEffect(() => {
    const completed = level.words
      .filter((word) => checkWord(grid, word))
      .map((word) => word.clueNumber)

    const newlyCompleted = completed.filter(
      (n) => !prevCompletedWordsRef.current.includes(n)
    )

    if (newlyCompleted.length > 0 && !isComplete) {
      playCorrectWord()
    }

    prevCompletedWordsRef.current = completed
    setCompletedWords(completed)

    if (completed.length === level.words.length && !showCompletionModal) {
      setShowCompletionModal(true)
      playLevelComplete()
    }
  }, [grid, level.words, isComplete, playCorrectWord, playLevelComplete, showCompletionModal])

  const handleContinue = useCallback(() => {
    setShowCompletionModal(false)
    onComplete()
  }, [onComplete])

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col })
  }, [])

  const handleCellInput = useCallback(
    (row: number, col: number, value: string) => {
      updateCell(row, col, value)
    },
    [updateCell]
  )

  const handleClueClick = useCallback((word: typeof level.words[0]) => {
    setSelectedCell({ row: word.row, col: word.col })
    setSelectedDirection(word.direction)
  }, [])

  const getSelectedClueNumber = (): number | null => {
    if (!selectedCell) return null

    const word = level.words.find((w) => {
      if (w.direction !== selectedDirection) return false
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.row : w.row + i
        const c = w.direction === 'across' ? w.col + i : w.col
        if (r === selectedCell.row && c === selectedCell.col) return true
      }
      return false
    })

    return word?.clueNumber ?? null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <button
                onClick={onBack}
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium mb-2"
              >
                <span className="mr-1">←</span>
                Back to levels
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{level.title}</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Level {level.id}: {level.name} • {level.difficulty}
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatTime(secondsElapsed)}
                </div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {completedWords.length}/{level.words.length}
                </div>
                <div className="text-xs text-gray-500">Words</div>
              </div>

              {!isComplete && (
                <button
                  onClick={() => {
                    showSolution()
                    setShowCompletionModal(true)
                  }}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors text-sm border border-red-200"
                >
                  Give Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_350px] gap-6 h-full max-w-7xl mx-auto">
          <div className="flex items-start justify-center lg:justify-start overflow-x-auto pb-4">
            <CrosswordGrid
              grid={grid}
              words={level.words}
              selectedCell={selectedCell}
              selectedDirection={selectedDirection}
              onCellClick={handleCellClick}
              onCellInput={handleCellInput}
              onDirectionChange={setSelectedDirection}
              showingSolution={isComplete}
            />
          </div>

          <div className="lg:order-last">
            <CluesPanel
              words={level.words}
              note={level.note}
              selectedClueNumber={getSelectedClueNumber()}
              selectedDirection={selectedDirection}
              onClueClick={handleClueClick}
              completedWords={completedWords}
            />
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
            {isComplete ? (
              <>
                <div className="text-6xl sm:text-7xl mb-4">🎉</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Amazing Work!
                </h2>
                <p className="text-gray-600 mb-6 text-base sm:text-lg">
                  You solved it in <span className="font-bold text-blue-600">{formatTime(secondsElapsed)}</span>
                </p>
                <button
                  onClick={handleContinue}
                  className="w-full py-3 sm:py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-base sm:text-lg"
                >
                  Continue to Next Level
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl sm:text-7xl mb-4">💪</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">Don't Give Up!</h2>
                <p className="text-gray-600 mb-2 text-base sm:text-lg">
                  Time: <span className="font-bold">{formatTime(secondsElapsed)}</span>
                </p>
                <p className="text-blue-600 font-semibold mb-6 text-sm sm:text-base">
                  Every puzzle makes you stronger! 🧠
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={onBack} 
                    className="py-3 sm:py-4 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-base sm:text-lg"
                  >
                    Back to Menu
                  </button>
                  <button
                    onClick={onRestartFromLevel1}
                    className="py-3 sm:py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all text-base sm:text-lg"
                  >
                    Try Again from Level 1
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}