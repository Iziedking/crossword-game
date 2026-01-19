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
  const [gaveUp, setGaveUp] = useState(false)

  const handleSelectLevel = useCallback((levelIndex: number) => {
    setCurrentLevelIndex(levelIndex)
    setView('game')
    setGaveUp(false)
  }, [])

  const handleLevelComplete = useCallback((time: number, didGiveUp: boolean) => {
    const currentLevel = levels[currentLevelIndex]
    
    // Update total time
    setTotalTime(prev => prev + time)
    
    // Mark level as completed
    setCompletedLevelIds(prev => 
      prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]
    )
    
    // Track if user gave up at any point
    if (didGiveUp) {
      setGaveUp(true)
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
    setGaveUp(false)
    setView('home')
  }, [])

  const handleBackToHome = useCallback(() => {
    setView('home')
  }, [])

  const handleGaveUp = useCallback(() => {
    setGaveUp(true)
  }, [])

  const currentLevel = levels[currentLevelIndex]

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
          onComplete={handleLevelComplete}
          onBack={handleBackToHome}
          onGaveUp={handleGaveUp}
        />
      )}

      {view === 'complete' && (
        <GameComplete
          totalTime={totalTime}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}

export default Index