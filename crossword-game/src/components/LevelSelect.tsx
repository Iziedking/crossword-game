import { levels } from '@/data/crosswordData'

interface LevelSelectProps {
  onSelectLevel: (levelIndex: number) => void
  completedLevels: number[]
}

export function LevelSelect({ 
  onSelectLevel, 
  completedLevels 
}: LevelSelectProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gray-50">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Hero section */}
        <div className="text-center mb-12">
          {/*logo */}
          <img 
            src="/billions-logo.png" 
            alt="Billions" 
            className="w-20 h-20 rounded-2xl mx-auto mb-8"
          />
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Billions Crossword
          </h1>
          <p className="text-gray-500 text-lg">
            Test your knowledge of the Billions Network ecosystem
          </p>
        </div>
        
        {/* Level cards */}
        <div className="space-y-4">
          {levels.map((level, index) => {
            const isCompleted = completedLevels.includes(level.id)
            const isLocked = index > 0 && !completedLevels.includes(levels[index - 1].id)
            
            const badgeColors: Record<string, string> = {
              'Meh': 'bg-green-100 text-green-700',
              'Wait': 'bg-yellow-100 text-yellow-700',
              'Damn': 'bg-red-100 text-red-700'
            }
            
            return (
              <button
                key={level.id}
                onClick={() => !isLocked && onSelectLevel(index)}
                disabled={isLocked}
                className={`w-full bg-white rounded-2xl p-6 text-left transition-all border ${
                  isLocked 
                    ? 'border-gray-100 opacity-60 cursor-not-allowed' 
                    : 'border-gray-200 hover:border-cyan-300 hover:shadow-md cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                        Level {level.id}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeColors[level.name] || 'bg-gray-100 text-gray-700'}`}>
                        {level.name}
                      </span>
                    </div>
                    <h3 className={`text-base font-medium mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                      {level.title}
                    </h3>
                    <p className={`text-sm ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                      {level.words.length} words • {level.difficulty}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    {isCompleted ? (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : isLocked ? (
                      <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
