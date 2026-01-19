import { formatTime } from '@/utils/crosswordUtils'

interface GameCompleteProps {
  totalTime: number
  onPlayAgain: () => void
}

type Rank = 'superOG' | 'og' | 'realHuman'

function getRank(seconds: number): Rank {
  if (seconds <= 30) return 'superOG'
  if (seconds <= 90) return 'og'
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
  },
  realHuman: {
    title: 'REAL HUMAN',
    subtitle: 'Verified & Authenticated!',
    message: 'You took your time and proved you\'re not a bot. Welcome to the Billions family!',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-300',
    icon: '✅',
    glowColor: 'shadow-green-500/50',
  },
}

export function GameComplete({ totalTime, onPlayAgain }: GameCompleteProps) {
  const rank = getRank(totalTime)
  const config = rankConfig[rank]

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br ${config.bgGradient}`}>
      <div className={`bg-white rounded-3xl max-w-md w-full p-8 text-center border-2 ${config.borderColor} shadow-2xl ${config.glowColor}`}>
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg animate-pulse`}>
            <span className="text-5xl">{config.icon}</span>
          </div>
          {rank === 'superOG' && (
            <>
              <div className="absolute -top-2 -left-2 w-8 h-8 text-2xl animate-bounce">✨</div>
              <div className="absolute -top-2 -right-2 w-8 h-8 text-2xl animate-bounce delay-100">✨</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 text-2xl animate-bounce delay-200">🔥</div>
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
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex -space-x-1">
            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-sm">✓</div>
          </div>
          <span className="text-sm font-medium text-gray-500">All 3 Levels Complete</span>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity shadow-lg`}
        >
          Play Again
        </button>

        {/* Share hint */}
        <p className="mt-4 text-xs text-gray-400">
          Share your achievement with the Billions community!
        </p>
      </div>
    </div>
  )
}