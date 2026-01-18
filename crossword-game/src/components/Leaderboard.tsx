import { useState } from 'react'
import type { LeaderboardEntry } from '@/data/crosswordData'
import { formatTime } from '@/utils/crosswordUtils'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  onClose: () => void
}

export function Leaderboard({ entries, onClose }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => a.totalTime - b.totalTime)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Leaderboard</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-7rem)]">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg">
                No entries yet. Be the first to complete all levels!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl transition-all
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-md' : ''}
                    ${index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300' : ''}
                    ${index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300' : ''}
                    ${index > 2 ? 'bg-gray-50 border border-gray-200' : ''}
                  `}
                >
                  <div className={`
                    text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                    ${index === 1 ? 'bg-gray-400 text-gray-900' : ''}
                    ${index === 2 ? 'bg-orange-400 text-orange-900' : ''}
                    ${index > 2 ? 'bg-gray-300 text-gray-700' : ''}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900">{entry.nickname}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatTime(entry.totalTime)}
                    </div>
                    <div className="text-xs text-gray-500">Total time</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface GameCompleteProps {
  totalTime: number
  levelTimes: { levelId: number; time: number }[]
  onSubmitScore: (nickname: string) => void
  onPlayAgain: () => void
}

export function GameComplete({
  totalTime,
  levelTimes,
  onSubmitScore,
  onPlayAgain,
}: GameCompleteProps) {
  const [nickname, setNickname] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname.trim()) {
      onSubmitScore(nickname.trim())
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border border-gray-200">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Congratulations!
        </h2>
        
        <p className="text-gray-600 mb-6 text-lg">
          You completed all levels!
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {formatTime(totalTime)}
          </div>
          <div className="text-sm text-gray-600 mb-4 font-medium">Total time</div>
          
          <div className="space-y-2 text-sm">
            {levelTimes.map((lt) => (
              <div key={lt.levelId} className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-2">
                <span className="text-gray-700 font-medium">Level {lt.levelId}:</span>
                <span className="font-mono font-bold text-gray-900">{formatTime(lt.time)}</span>
              </div>
            ))}
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={20}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg"
            >
              Submit to Leaderboard
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
            <span className="text-green-600 font-semibold text-lg">✓ Score submitted!</span>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors border-2 border-gray-200"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
