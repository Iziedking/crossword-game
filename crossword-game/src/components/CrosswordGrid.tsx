import { useEffect, useRef, useState } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [cellSize, setCellSize] = useState(36)

  // Build clue number map
  const clueNumbers = new Map<string, number>()
  words.forEach((word) => {
    const key = `${word.row},${word.col}`
    if (!clueNumbers.has(key)) {
      clueNumbers.set(key, word.clueNumber)
    }
  })

  // Responsive cell sizing
  useEffect(() => {
    const calculateCellSize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      
      // Mobile: fit grid in available width (with padding)
      // Desktop: use larger cells
      const maxCols = grid.cols
      const maxRows = grid.rows
      
      let maxWidth: number
      let maxHeight: number
      
      if (vw < 640) {
        // Mobile: use almost full width, reserve space for padding
        maxWidth = vw - 32 // 16px padding on each side
        maxHeight = vh * 0.45 // Reserve space for clues
      } else if (vw < 1024) {
        // Tablet
        maxWidth = Math.min(vw * 0.6, 500)
        maxHeight = vh * 0.55
      } else {
        // Desktop
        maxWidth = Math.min(vw * 0.45, 600)
        maxHeight = vh * 0.7
      }
      
      // Calculate cell size based on grid dimensions
      const sizeByWidth = Math.floor((maxWidth - maxCols) / maxCols) // Account for 1px gaps
      const sizeByHeight = Math.floor((maxHeight - maxRows) / maxRows)
      
      // Use the smaller of the two to ensure grid fits
      const calculatedSize = Math.min(sizeByWidth, sizeByHeight)
      
      // Clamp between reasonable min/max
      const finalSize = Math.max(28, Math.min(50, calculatedSize))
      
      setCellSize(finalSize)
    }

    calculateCellSize()
    window.addEventListener('resize', calculateCellSize)
    
    return () => window.removeEventListener('resize', calculateCellSize)
  }, [grid.cols, grid.rows])

  // Check if cell is in selected word
  const isInSelectedWord = (row: number, col: number): boolean => {
    if (!selectedCell) return false

    for (const word of words) {
      if (word.direction !== selectedDirection) continue
      
      // Check if selected cell is in this word
      let selectedInWord = false
      for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i
        const c = word.direction === 'across' ? word.col + i : word.col
        if (r === selectedCell.row && c === selectedCell.col) {
          selectedInWord = true
          break
        }
      }
      
      if (!selectedInWord) continue
      
      // Check if current cell is in this word
      for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i
        const c = word.direction === 'across' ? word.col + i : word.col
        if (r === row && c === col) {
          return true
        }
      }
    }
    return false
  }

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (showingSolution) return
    
    const currentCell = grid.cells[row]?.[col]
    
    if (e.key === 'Backspace') {
      e.preventDefault()
      // Only clear if not a hint cell
      if (!currentCell?.isHint) {
        onCellInput(row, col, '')
      }
      
      // Move to previous cell in word
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
        
        if (currentIndex > 0) {
          const prevRow = selectedDirection === 'across' ? row : row - 1
          const prevCol = selectedDirection === 'across' ? col - 1 : col
          onCellClick(prevRow, prevCol)
        }
      }
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      onDirectionChange(selectedDirection === 'across' ? 'down' : 'across')
      return
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
      
      let newRow = row
      let newCol = col

      switch (e.key) {
        case 'ArrowUp': newRow = Math.max(0, row - 1); break
        case 'ArrowDown': newRow = Math.min(grid.rows - 1, row + 1); break
        case 'ArrowLeft': newCol = Math.max(0, col - 1); break
        case 'ArrowRight': newCol = Math.min(grid.cols - 1, col + 1); break
      }

      if (grid.cells[newRow][newCol].letter) {
        onCellClick(newRow, newCol)
      }
      return
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault()
      
      // Don't allow typing in hint cells
      if (currentCell?.isHint) {
        // Just move to next cell
      } else {
        onCellInput(row, col, e.key)
      }
      
      // Move to next cell in word
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
          const nextRow = selectedDirection === 'across' ? row : row + 1
          const nextCol = selectedDirection === 'across' ? col + 1 : col
          
          if (grid.cells[nextRow]?.[nextCol]?.letter) {
            onCellClick(nextRow, nextCol)
          }
        }
      }
    }
  }

  // Focus selected cell
  useEffect(() => {
    if (selectedCell && gridRef.current) {
      const input = gridRef.current.querySelector(
        `[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"] input`
      ) as HTMLInputElement
      input?.focus()
    }
  }, [selectedCell])

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div 
        ref={gridRef}
        className="inline-block border border-gray-300 bg-gray-300"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid.cols}, ${cellSize}px)`,
          gap: '1px'
        }}
      >
      {grid.cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Blocked cell (no letter)
          if (!cell.letter) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="bg-gray-300"
                style={{ width: cellSize, height: cellSize }}
              />
            )
          }

          const isSelected = 
            selectedCell?.row === rowIndex && 
            selectedCell?.col === colIndex
          const isInWord = isInSelectedWord(rowIndex, colIndex)
          const clueNum = clueNumbers.get(`${rowIndex},${colIndex}`)

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-row={rowIndex}
              data-col={colIndex}
              className={`
                relative bg-white cursor-pointer
                ${isSelected ? 'bg-cyan-200' : isInWord ? 'bg-cyan-50' : 'bg-white'}
              `}
              style={{ width: cellSize, height: cellSize }}
              onClick={() => {
                if (isSelected && !showingSolution) {
                  onDirectionChange(selectedDirection === 'across' ? 'down' : 'across')
                } else {
                  onCellClick(rowIndex, colIndex)
                }
              }}
            >
              {clueNum && (
                <span 
                  className="absolute text-gray-700 font-medium leading-none"
                  style={{ 
                    top: '2px', 
                    left: '2px', 
                    fontSize: cellSize < 36 ? '8px' : '10px' 
                  }}
                >
                  {clueNum}
                </span>
              )}
              <input
                type="text"
                maxLength={1}
                value={cell.userInput}
                className={`
                  w-full h-full text-center font-semibold bg-transparent outline-none uppercase
                  ${cell.isHint ? 'text-blue-600 cursor-default' : showingSolution ? 'text-blue-600 cursor-pointer' : 'text-gray-900 cursor-pointer'}
                `}
                style={{ 
                  fontSize: cellSize < 36 ? '14px' : '18px',
                  paddingTop: clueNum ? '6px' : '0'
                }}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                onChange={() => {}} // Controlled by onKeyDown
                readOnly={showingSolution || cell.isHint}
                tabIndex={cell.isHint ? -1 : -1}
              />
            </div>
          )
        })
      )}
      </div>
    </div>
  )
}
