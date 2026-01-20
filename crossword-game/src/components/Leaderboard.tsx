import { useState } from 'react'
import { formatTime } from '@/utils/crosswordUtils'

export interface LeaderboardEntry {
  id: string
  nickname: string
  totalTime: number
  completedAt: string
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  onClose: () => void
}

export function Leaderboard({ entries, onClose }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => a.totalTime - b.totalTime)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-cyan-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500">
                No entries yet. Be the first to complete all levels!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-50 border border-yellow-200' : 
                    index === 1 ? 'bg-gray-50 border border-gray-200' : 
                    index === 2 ? 'bg-orange-50 border border-orange-200' : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-900' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{entry.nickname}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.completedAt).toLocaleDateString()} at {new Date(entry.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-cyan-600 text-lg">
                      {formatTime(entry.totalTime)}
                    </div>
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
  onSubmitScore: (nickname: string) => void
  onPlayAgain: () => void
  canSubmit: boolean
}

export function GameComplete({
  totalTime,
  onSubmitScore,
  onPlayAgain,
  canSubmit,
}: GameCompleteProps) {
  const [nickname, setNickname] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname.trim() && canSubmit) {
      onSubmitScore(nickname.trim())
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center border border-gray-200 shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Congratulations!
        </h2>
        
        <p className="text-gray-500 mb-6">
          You completed all levels!
        </p>

        <div className="bg-cyan-50 rounded-xl p-5 mb-6">
          <div className="text-sm text-cyan-600 font-medium mb-1">Total Time</div>
          <div className="text-4xl font-mono font-bold text-cyan-700">
            {formatTime(totalTime)}
          </div>
        </div>

        {canSubmit && !submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your name for leaderboard"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              maxLength={20}
              required
            />
            
            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Submit to Leaderboard
            </button>
          </form>
        ) : submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Score submitted!
            </div>
          </div>
        ) : null}

        <button
          onClick={onPlayAgain}
          className={`w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors ${submitted || !canSubmit ? 'mt-0' : 'mt-3'}`}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}