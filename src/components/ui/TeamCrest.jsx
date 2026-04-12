import { useState, useMemo } from 'react'
import { getCrestUrl } from '../../lib/crestFetcher'

// Team crest component that displays official team logos with fallbacks
function TeamCrest({ team, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-12 sm:w-12',
    lg: 'h-16 w-16'
  }

  // Intelligently get crest URL - first check explicit crestUrl, then try to fetch
  const crestUrl = useMemo(() => {
    if (team.crestUrl) {
      return team.crestUrl
    }
    // Try to fetch crest for unmapped teams
    return getCrestUrl(team)
  }, [team])

  // If we have a crest URL and no error, try to load the image
  if (crestUrl && !imageError) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Actual crest image */}
        <img
          src={crestUrl}
          alt={`${team.name} crest`}
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

  // Fallback to the original colored circle design
  return (
    <div className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:text-sm ${team.crestColor} ${className}`}>
      {team.shortName}
    </div>
  )
}

export default TeamCrest