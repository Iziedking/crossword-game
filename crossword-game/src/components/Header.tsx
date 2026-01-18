interface HeaderProps {
  showLeaderboardButton?: boolean
  onLeaderboardClick?: () => void
  onHomeClick?: () => void
}

export function Header({
  showLeaderboardButton,
  onLeaderboardClick,
  onHomeClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="text-2xl sm:text-3xl">🧩</div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
              Crossword Game
            </h1>
          </div>
          
          {showLeaderboardButton && onLeaderboardClick && (
            <button
              onClick={onLeaderboardClick}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              <span className="mr-1.5 sm:mr-2">🏆</span>
              <span className="hidden sm:inline">Leaderboard</span>
              <span className="sm:hidden">Rank</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}