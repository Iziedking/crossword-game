import { useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { LevelSelect } from '@/components/LevelSelect'
import { GameBoard } from '@/components/GameBoard'
import { Leaderboard, GameComplete } from '@/components/Leaderboard'
import { levels, type LeaderboardEntry } from '@/data/crosswordData'

type View = 'home' | 'game' | 'complete'

interface LevelProgress {
  levelId: number
  time: number
  completed: boolean
}

const Index = () => {
  const [view, setView] = useState<View>('home')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [levelProgress, setLevelProgress] = useState<LevelProgress[]>([])
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([])

  const handleSelectLevel = useCallback((levelIndex: number) => {
    setCurrentLevelIndex(levelIndex)
    setView('game')
  }, [])

  const handleLevelComplete = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1)
    } else {
      setView('complete')
    }
  }, [currentLevelIndex])

  const handleSubmitScore = useCallback((nickname: string) => {
    const totalTime = levelProgress.reduce((acc, lp) => acc + lp.time, 0)
    const entry: LeaderboardEntry = {
      id: Date.now().toString(),
      nickname,
      totalTime,
      completedAt: new Date().toISOString(),
      levelTimes: levelProgress.reduce((acc, lp) => {
        acc[lp.levelId] = lp.time
        return acc
      }, {} as { [key: number]: number })
    }
    setLeaderboardEntries(prev => [...prev, entry])
  }, [levelProgress])

  const handlePlayAgain = useCallback(() => {
    setLevelProgress([])
    setCurrentLevelIndex(0)
    setView('home')
  }, [])

  const handleRestartFromLevel1 = useCallback(() => {
    setLevelProgress([])
    setCurrentLevelIndex(0)
    setView('game')
  }, [])

  const handleBackToHome = useCallback(() => {
    setView('home')
  }, [])

  const completedLevelIds = levelProgress
    .filter((lp) => lp.completed)
    .map((lp) => lp.levelId)

  const currentLevel = levels[currentLevelIndex]

  return (
    <div className="min-h-screen">
      <Header
        showLeaderboardButton={view === 'home'}
        onLeaderboardClick={() => setShowLeaderboard(true)}
        onHomeClick={handleBackToHome}
      />

      {view === 'home' && (
        <LevelSelect
          onSelectLevel={handleSelectLevel}
          completedLevels={completedLevelIds}
        />
      )}

      {view === 'game' && currentLevel && (
        <GameBoard
          level={currentLevel}
          onComplete={handleLevelComplete}
          onBack={handleBackToHome}
          onRestartFromLevel1={handleRestartFromLevel1}
        />
      )}

      {view === 'complete' && (
        <GameComplete
          totalTime={levelProgress.reduce((acc, lp) => acc + lp.time, 0)}
          levelTimes={levelProgress.map((lp) => ({
            levelId: lp.levelId,
            time: lp.time,
          }))}
          onSubmitScore={handleSubmitScore}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          entries={leaderboardEntries}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  )
}

export default Index
