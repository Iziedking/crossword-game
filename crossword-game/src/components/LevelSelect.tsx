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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Choose Your Challenge
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              Test your knowledge across three exciting levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {levels.map((level, index) => {
              const isCompleted = completedLevels.includes(level.id)
              
              const difficultyColors = {
                Easy: 'from-green-500 to-emerald-500',
                Medium: 'from-yellow-500 to-orange-500',
                Hard: 'from-red-500 to-pink-500'
              }
              
              const difficultyBg = {
                Easy: 'bg-green-50 text-green-700 border-green-200',
                Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                Hard: 'bg-red-50 text-red-700 border-red-200'
              }
              
              return (
                <button
                  key={level.id}
                  onClick={() => onSelectLevel(index)}
                  className="group relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 min-h-[300px] sm:min-h-[350px] flex flex-col"
                >
                  {isCompleted && (
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r ${difficultyColors[level.difficulty as keyof typeof difficultyColors]} text-white shadow-md`}>
                      Level {level.id}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors flex-grow">
                    {level.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${difficultyBg[level.difficulty as keyof typeof difficultyBg]}`}>
                      {level.difficulty}
                    </span>
                    <span className="text-gray-400 text-lg">•</span>
                    <span className="text-gray-700 text-base font-semibold">
                      {level.words.length} words
                    </span>
                  </div>
                  
                  <div className="pt-6 border-t-2 border-gray-100">
                    <p className="text-base text-gray-500 italic font-medium">
                      {level.name}
                    </p>
                  </div>
                  
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}