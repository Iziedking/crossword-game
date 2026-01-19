interface HeaderProps {
  onHomeClick?: () => void
}

export function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={onHomeClick}
          >
            <img 
              src="/billions-logo.png" 
              alt="Billions" 
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-semibold text-gray-900">
              Billions Crossword
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}