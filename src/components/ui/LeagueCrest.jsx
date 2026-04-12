import { useState, useMemo } from 'react'
import { getLeagueCrestUrl } from '../../lib/leagueCrestFetcher'

// League crest component that displays official league logos with fallbacks
function LeagueCrest({ league, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8 sm:h-10 sm:w-10',
    lg: 'h-12 w-12 sm:h-16 sm:w-16'
  }

  const fallbackClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 sm:h-10 sm:w-10 text-xs',
    lg: 'h-12 w-12 sm:h-16 sm:w-16 text-sm'
  }

  // Get crest URL for the league
  const crestUrl = useMemo(() => {
    return getLeagueCrestUrl(league)
  }, [league])

  // If we have a crest URL and no error, try to load the image
  if (crestUrl && !imageError) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Actual crest image */}
        <img
          src={crestUrl}
          alt={`${league} crest`}
          className={`${sizeClasses[size]} object-contain ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    )
  }

  // Fallback: colored badge with league abbreviation
  const getLeagueAbbreviation = (leagueName) => {
    const abbreviations = {
      'Premier League': 'PL',
      'La Liga': 'LL',
      'Serie A': 'SA',
      'Bundesliga': 'BL',
      'Ligue 1': 'L1',
      'Champions League': 'CL',
      'Europa League': 'EL',
      'MLS': 'MLS',
      'Championship': 'CH',
      'Serie B': 'SB',
      'Ligue 2': 'L2',
      'Eredivisie': 'ED',
      'Primeira Liga': 'PL',
      'La Liga EA Sports': 'LL',
      'Scottish Premiership': 'SP',
    }
    
    if (abbreviations[leagueName]) {
      return abbreviations[leagueName]
    }
    
    // Generate abbreviation from first letters
    return leagueName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3)
  }

  return (
    <div className={`flex ${fallbackClasses[size]} shrink-0 items-center justify-center rounded-lg border border-brand-400/40 bg-brand-500/15 font-semibold text-brand-300 ${className}`}>
      {getLeagueAbbreviation(league)}
    </div>
  )
}

export default LeagueCrest
