import { formatTime } from '@/utils/crosswordUtils'

interface GameCompleteProps {
  totalTime: number
  levelsCompletedLegit: number
  onPlayAgain: () => void
}

type Rank = 'superOG' | 'og' | 'realHuman' | 'betterLuck'

function getRank(seconds: number, levelsCompletedLegit: number): Rank {
  // If gave up on all 3 levels
  if (levelsCompletedLegit === 0) return 'betterLuck'
  
  // If completed at least 1 but not all 3 without giving up
  if (levelsCompletedLegit < 3) return 'realHuman'
  
  // Completed all 3 without giving up - rank by time
  if (seconds <= 60) return 'superOG'
  if (seconds <= 120) return 'og'
  return 'realHuman'
}

const rankConfig = {
  superOG: {
    title: 'SUPER OG',
    subtitle: 'Legendary Status Achieved!',
    message: 'You crushed it in record time. You truly know the Billions ecosystem inside out!',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    bgGradient: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-300',
    icon: '👑',
    glowColor: 'shadow-yellow-500/50',
    showCheckmarks: true,
  },
  og: {
    title: 'OG',
    subtitle: 'Impressive Performance!',
    message: 'You know your stuff! A true member of the Billions community.',
    gradient: 'from-cyan-400 via-blue-500 to-purple-500',
    bgGradient: 'from-cyan-50 to-blue-50',
    borderColor: 'border-cyan-300',
    icon: '⭐',
    glowColor: 'shadow-cyan-500/50',
    showCheckmarks: true,
  },
  realHuman: {
    title: 'REAL HUMAN',
    subtitle: 'Verified & Authenticated!',
    message: 'You proved you\'re not a bot. Welcome to the Billions family!',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-300',
    icon: '✅',
    glowColor: 'shadow-green-500/50',
    showCheckmarks: true,
  },
  betterLuck: {
    title: 'NICE TRY',
    subtitle: 'Better Luck Next Time!',
    message: 'You viewed the solutions for all levels. Come back and try again to earn your rank!',
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    bgGradient: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-300',
    icon: '🔄',
    glowColor: 'shadow-gray-500/30',
    showCheckmarks: false,
  },
}

export function GameComplete({ totalTime, levelsCompletedLegit, onPlayAgain }: GameCompleteProps) {
  const rank = getRank(totalTime, levelsCompletedLegit)
  const config = rankConfig[rank]

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br ${config.bgGradient}`}>
      <div className={`bg-white rounded-3xl max-w-md w-full p-8 text-center border-2 ${config.borderColor} shadow-2xl ${config.glowColor}`}>
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ${rank !== 'betterLuck' ? 'animate-pulse' : ''}`}>
            <span className="text-5xl">{config.icon}</span>
          </div>
          {rank === 'superOG' && (
            <>
              <div className="absolute -top-2 -left-2 w-8 h-8 text-2xl animate-bounce">✨</div>
              <div className="absolute -top-2 -right-2 w-8 h-8 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</div>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-4xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-2`}>
          {config.title}
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {config.subtitle}
        </h2>

        {/* Time Display */}
        <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${config.gradient} mb-6`}>
          <div className="text-white text-sm font-medium opacity-90">Total Time</div>
          <div className="text-white text-3xl font-mono font-bold">
            {formatTime(totalTime)}
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {config.message}
        </p>

        {/* Completion Badge */}
        {config.showCheckmarks && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex -space-x-1">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm ${
                    i < levelsCompletedLegit ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  {i < levelsCompletedLegit ? '✓' : '✗'}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-500">
              {levelsCompletedLegit}/3 Levels Solved
            </span>
          </div>
        )}

        {/* Stats for betterLuck */}
        {rank === 'betterLuck' && (
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-500">
              💡 <strong>Tip:</strong> Try to solve at least one level without viewing the solution to earn the "Real Human" achievement!
            </p>
          </div>
        )}

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity shadow-lg`}
        >
          {rank === 'betterLuck' ? 'Try Again' : 'Play Again'}
        </button>

        {/* Share hint */}
        {rank !== 'betterLuck' && (
          <p className="mt-4 text-xs text-gray-400">
            Share your achievement with the Billions community!
          </p>
        )}
      </div>
    </div>
  )
}