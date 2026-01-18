import type { CrosswordWord } from '@/data/crosswordData'

interface CluesPanelProps {
  words: CrosswordWord[]
  note?: string
  selectedClueNumber: number | null
  selectedDirection: 'across' | 'down'
  onClueClick: (word: CrosswordWord) => void
  completedWords: number[]
}

export function CluesPanel({
  words,
  note,
  selectedClueNumber,
  selectedDirection,
  onClueClick,
  completedWords,
}: CluesPanelProps) {
  const acrossWords = words
    .filter((w) => w.direction === 'across')
    .sort((a, b) => a.clueNumber - b.clueNumber)
  
  const downWords = words
    .filter((w) => w.direction === 'down')
    .sort((a, b) => a.clueNumber - b.clueNumber)

  const renderClue = (word: CrosswordWord) => {
    const isSelected = 
      word.clueNumber === selectedClueNumber && 
      word.direction === selectedDirection
    const isCompleted = completedWords.includes(word.clueNumber)

    return (
      <li
        key={`${word.direction}-${word.clueNumber}`}
        className={`
          p-3 rounded-lg cursor-pointer transition-all
          ${isSelected 
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-sm' 
            : 'hover:bg-gray-50 border-2 border-transparent'
          }
          ${isCompleted ? 'opacity-60' : ''}
        `}
        onClick={() => onClueClick(word)}
      >
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-600 min-w-[2rem]">
            {word.clueNumber}.
          </span>
          <span className={isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
            {word.clue}
          </span>
          {isCompleted && (
            <span className="ml-auto text-green-600 flex-shrink-0">✓</span>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 h-full overflow-y-auto max-h-[calc(100vh-12rem)] lg:max-h-none">
      {note && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-blue-600">💡 Note:</span> {note}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
            <span className="text-blue-600">→</span>
            Across
          </h3>
          <ul className="space-y-2">
            {acrossWords.length > 0 ? (
              acrossWords.map(renderClue)
            ) : (
              <li className="text-gray-400 italic text-sm">No across clues</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
            <span className="text-purple-600">↓</span>
            Down
          </h3>
          <ul className="space-y-2">
            {downWords.length > 0 ? (
              downWords.map(renderClue)
            ) : (
              <li className="text-gray-400 italic text-sm">No down clues</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
