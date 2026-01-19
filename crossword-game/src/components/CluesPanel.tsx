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
      <button
        key={`${word.direction}-${word.clueNumber}`}
        className={`
          w-full text-left px-3 py-2 rounded-lg transition-colors
          ${isSelected ? 'bg-cyan-100' : 'hover:bg-gray-50'}
        `}
        onClick={() => onClueClick(word)}
      >
        <div className="flex items-start gap-2">
          <span className="text-cyan-600 font-medium min-w-[1.5rem]">
            {word.clueNumber}.
          </span>
          <span className={`flex-1 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {word.clue}
          </span>
          {isCompleted && (
            <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-12rem)]">
      {note && (
        <div className="mb-5 p-3 bg-blue-50 rounded-lg flex gap-2">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-600">Note:</span> {note}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {acrossWords.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-wide mb-2">
              Across
            </h3>
            <div className="space-y-1">
              {acrossWords.map(renderClue)}
            </div>
          </div>
        )}

        {downWords.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-wide mb-2">
              Down
            </h3>
            <div className="space-y-1">
              {downWords.map(renderClue)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
