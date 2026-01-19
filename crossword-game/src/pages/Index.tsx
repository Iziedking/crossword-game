import { useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { LevelSelect } from '@/components/LevelSelect'
import { GameBoard } from '@/components/GameBoard'
import { GameComplete } from '@/components/GameComplete'
import { levels } from '@/data/crosswordData'

type View = 'home' | 'game' | 'complete'

const Index = () => {
  const [view, setView] = useState<View>('home')
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [completedLevelIds, setCompletedLevelIds] = useState<number[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const [levelsCompletedLegit, setLevelsCompletedLegit] = useState(0)

  const handleSelectLevel = useCallback((levelIndex: number) => {
    setCurrentLevelIndex(levelIndex)
    setView('game')
  }, [])

  const handleLevelComplete = useCallback((time: number, gaveUp: boolean) => {
    const currentLevel = levels[currentLevelIndex]
    
    // Update total time (time is cumulative from GameBoard)
    setTotalTime(time)
    
    // Mark level as completed
    setCompletedLevelIds(prev => 
      prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]
    )
    
    // Track legitimate completions (without giving up)
    if (!gaveUp) {
      setLevelsCompletedLegit(prev => prev + 1)
    }
    
    // Move to next level or complete
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1)
    } else {
      setView('complete')
    }
  }, [currentLevelIndex])

  const handlePlayAgain = useCallback(() => {
    setCompletedLevelIds([])
    setCurrentLevelIndex(0)
    setTotalTime(0)
    setLevelsCompletedLegit(0)
    setView('home')
  }, [])

  const handleBackToHome = useCallback(() => {
    setView('home')
  }, [])

  const currentLevel = levels[currentLevelIndex]
  const isLastLevel = currentLevelIndex === levels.length - 1

  return (
    <div className="min-h-screen w-full bg-white">
      <Header onHomeClick={handleBackToHome} />

      {view === 'home' && (
        <LevelSelect
          onSelectLevel={handleSelectLevel}
          completedLevels={completedLevelIds}
        />
      )}

      {view === 'game' && currentLevel && (
        <GameBoard
          key={currentLevel.id}
          level={currentLevel}
          isLastLevel={isLastLevel}
          initialTime={totalTime}
          onComplete={handleLevelComplete}
          onBack={handleBackToHome}
        />
      )}

      {view === 'complete' && (
        <GameComplete
          totalTime={totalTime}
          levelsCompletedLegit={levelsCompletedLegit}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}

export default Index