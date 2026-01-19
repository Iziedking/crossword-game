import { useState, useCallback, useEffect, useRef } from 'react'
import type { CrosswordLevel } from '@/data/crosswordData'
import { checkWord, formatTime } from '@/utils/crosswordUtils'
import { useGameState } from '@/hooks/useGameState'
import { CrosswordGrid } from './CrosswordGrid'
import { CluesPanel } from './CluesPanel'

interface GameBoardProps {
  level: CrosswordLevel
  onComplete: (time: number, gaveUp: boolean) => void
  onBack: () => void
  onGaveUp: () => void
}

export function GameBoard({
  level,
  onComplete,
  onBack,
  onGaveUp,
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

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across')
  const [completedWords, setCompletedWords] = useState<number[]>([])
  const [showGiveUpModal, setShowGiveUpModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)

  const prevCompletedWordsRef = useRef<number[]>([])

  // Reset UI state when level changes
  useEffect(() => {
    setSelectedCell(null)
    setSelectedDirection('across')
    setCompletedWords([])
    setShowGiveUpModal(false)
    setShowSuccessModal(false)
    setGaveUp(false)
    prevCompletedWordsRef.current = []
  }, [level.id])

  // Check completed words
  useEffect(() => {
    const completed = level.words
      .filter((word) => checkWord(grid, word))
      .map((word) => word.clueNumber)

    prevCompletedWordsRef.current = completed
    setCompletedWords(completed)

    // Show success modal if all words completed (and didn't give up)
    if (completed.length === level.words.length && !showSuccessModal && !gaveUp) {
      setShowSuccessModal(true)
    }
  }, [grid, level.words, showSuccessModal, gaveUp])

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

  const handleGiveUp = () => {
    setShowGiveUpModal(true)
  }

  const handleViewSolution = () => {
    setGaveUp(true)
    onGaveUp()
    showSolution()
    setShowGiveUpModal(false)
  }

  const handleContinue = useCallback(() => {
    setShowSuccessModal(false)
    onComplete(secondsElapsed, gaveUp)
  }, [onComplete, secondsElapsed, gaveUp])

  const handleBackToMenu = useCallback(() => {
    setShowGiveUpModal(false)
    onBack()
  }, [onBack])

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

  const badgeColors: Record<string, string> = {
    'Meh': 'text-green-600',
    'Wait': 'text-yellow-600',
    'Damn': 'text-red-600'
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <button
                onClick={onBack}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm mb-2 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to levels
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{level.title}</h1>
              <p className="text-sm text-gray-500">
                Level {level.id}: <span className={badgeColors[level.name]}>{level.name}</span> • {level.difficulty}
              </p>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-mono font-semibold text-cyan-600">
                  {formatTime(secondsElapsed)}
                </div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {completedWords.length}/{level.words.length}
                </div>
                <div className="text-xs text-gray-500">Words</div>
              </div>

              {!isComplete && !gaveUp && (
                <button
                  onClick={handleGiveUp}
                  className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Give Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Grid section */}
          <div className="flex justify-center lg:justify-start">
            <CrosswordGrid
              grid={grid}
              words={level.words}
              selectedCell={selectedCell}
              selectedDirection={selectedDirection}
              onCellClick={handleCellClick}
              onCellInput={handleCellInput}
              onDirectionChange={setSelectedDirection}
              showingSolution={isComplete || gaveUp}
            />
          </div>

          {/* Clues section */}
          <div className="flex-1 lg:max-w-sm">
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

      {/* Give Up Modal */}
      {showGiveUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Don't Give Up!
            </h2>
            <p className="text-gray-500 mb-6">
              Are you sure? If you view the solution, your score won't be recorded on the leaderboard.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowGiveUpModal(false)}
                className="w-full py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Keep Playing
              </button>
              
              <button
                onClick={handleViewSolution}
                className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Solution
              </button>
              
              <button
                onClick={handleBackToMenu}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && !gaveUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Level Complete!
            </h2>
            <p className="text-gray-500 mb-2">
              You solved it in <span className="font-mono font-semibold text-cyan-600">{formatTime(secondsElapsed)}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Great job!
            </p>
            
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Continue to Next Level
            </button>
          </div>
        </div>
      )}

      {/* Solution Viewed - Continue Button */}
      {gaveUp && !showGiveUpModal && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40">
          <button
            onClick={() => onComplete(secondsElapsed, true)}
            className="px-8 py-3 bg-cyan-500 text-white font-medium rounded-lg shadow-lg hover:bg-cyan-600 transition-colors"
          >
            Continue to Next Level
          </button>
        </div>
      )}
    </div>
  )
}