import { useEffect, useRef } from 'react'
import type { CrosswordWord } from '@/data/crosswordData'
import type { Grid } from '@/utils/crosswordUtils'

interface CrosswordGridProps {
  grid: Grid
  words: CrosswordWord[]
  selectedCell: { row: number; col: number } | null
  selectedDirection: 'across' | 'down'
  onCellClick: (row: number, col: number) => void
  onCellInput: (row: number, col: number, value: string) => void
  onDirectionChange: (direction: 'across' | 'down') => void
  showingSolution: boolean
}

export function CrosswordGrid({
  grid,
  words,
  selectedCell,
  selectedDirection,
  onCellClick,
  onCellInput,
  onDirectionChange,
  showingSolution,
}: CrosswordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  const clueNumbers = new Map<string, number>()
  words.forEach((word) => {
    const key = `${word.row},${word.col}`
    if (!clueNumbers.has(key)) {
      clueNumbers.set(key, word.clueNumber)
    }
  })

  const isInSelectedWord = (row: number, col: number): boolean => {
    if (!selectedCell) return false

    const word = words.find((w) => {
      if (w.direction !== selectedDirection) return false
      
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.row : w.row + i
        const c = w.direction === 'across' ? w.col + i : w.col
        if (r === selectedCell.row && c === selectedCell.col) {
          const checkR = w.direction === 'across' ? w.row : w.row + i
          const checkC = w.direction === 'across' ? w.col + i : w.col
          return checkR === row && checkC === col
        }
      }
      return false
    })

    return !!word
  }

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      onCellInput(row, col, '')
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      onDirectionChange(selectedDirection === 'across' ? 'down' : 'across')
      return
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      
      let newRow = row
      let newCol = col

      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1)
          break
        case 'ArrowDown':
          newRow = Math.min(grid.rows - 1, row + 1)
          break
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1)
          break
        case 'ArrowRight':
          newCol = Math.min(grid.cols - 1, col + 1)
          break
      }

      if (grid.cells[newRow][newCol].letter) {
        onCellClick(newRow, newCol)
      }
      return
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault()
      onCellInput(row, col, e.key)
      
      const word = words.find((w) => {
        if (w.direction !== selectedDirection) return false
        for (let i = 0; i < w.word.length; i++) {
          const r = w.direction === 'across' ? w.row : w.row + i
          const c = w.direction === 'across' ? w.col + i : w.col
          if (r === row && c === col) return true
        }
        return false
      })

      if (word) {
        const currentIndex = selectedDirection === 'across' 
          ? col - word.col 
          : row - word.row
        
        if (currentIndex < word.word.length - 1) {
          const nextRow = selectedDirection === 'across' 
            ? row 
            : row + 1
          const nextCol = selectedDirection === 'across' 
            ? col + 1 
            : col
          
          if (grid.cells[nextRow]?.[nextCol]?.letter) {
            onCellClick(nextRow, nextCol)
          }
        }
      }
    }
  }

  useEffect(() => {
    if (selectedCell && gridRef.current) {
      const input = gridRef.current.querySelector(
        `[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"] input`
      ) as HTMLInputElement
      input?.focus()
    }
  }, [selectedCell])

  return (
    <div 
      ref={gridRef}
      className="inline-block bg-white border-2 border-gray-900 shadow-xl"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, 40px)`,
        gap: 0
      }}
    >
      {grid.cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (!cell.letter) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-10 h-10 bg-gray-900"
              />
            )
          }

          const isSelected = 
            selectedCell?.row === rowIndex && 
            selectedCell?.col === colIndex
          const isInWord = isInSelectedWord(rowIndex, colIndex)
          const clueNum = clueNumbers.get(`${rowIndex},${colIndex}`)
          const isCorrect = cell.userInput && 
            cell.userInput.toUpperCase() === cell.letter.toUpperCase()

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative w-10 h-10 sm:w-12 sm:h-12 border border-gray-900
                ${isSelected ? 'bg-yellow-200' : isInWord ? 'bg-blue-100' : 'bg-white'}
                ${isCorrect && !showingSolution ? 'bg-green-50' : ''}
              `}
              data-row={rowIndex}
              data-col={colIndex}
              onClick={() => {
                if (isSelected) {
                  onDirectionChange(
                    selectedDirection === 'across' ? 'down' : 'across'
                  )
                } else {
                  onCellClick(rowIndex, colIndex)
                }
              }}
            >
              {clueNum && (
                <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-blue-600 leading-none">
                  {clueNum}
                </span>
              )}
              <input
                type="text"
                maxLength={1}
                value={cell.userInput}
                className="w-full h-full text-center text-lg sm:text-xl font-bold bg-transparent outline-none cursor-pointer uppercase pt-2"
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                readOnly={showingSolution}
                tabIndex={-1}
              />
            </div>
          )
        })
      )}
    </div>
  )
}