// Reusable Sports A brand mark and wordmark.
function BrandLogo({
  size = 'md',
  showWordmark = true,
  stacked = false,
  className = '',
  wordmarkClassName = '',
  titleClassName = '',
  subtitleClassName = '',
}) {
  const sizeClasses = {
    sm: 'h-10 w-10 text-base',
    md: 'h-12 w-12 text-lg',
    lg: 'h-20 w-20 text-2xl',
  }

  const containerClass = stacked
    ? 'flex flex-col items-center gap-3'
    : 'flex items-center gap-3'

  return (
    <div className={[containerClass, className].join(' ').trim()}>
      {/* Reusable Sports A logo mark for header, sidebar, and auth screens. */}
      <div
        className={[
          'flex shrink-0 items-center justify-center rounded-2xl border border-brand-300/20 bg-brand-400/10 font-display font-bold text-brand-300 shadow-lg shadow-brand-500/10',
          sizeClasses[size],
        ].join(' ')}
      >
        <span className="tracking-[-0.08em]">SA</span>
      </div>

      {showWordmark ? (
        <div className={[stacked ? 'text-center' : 'min-w-0', wordmarkClassName].join(' ').trim()}>
          <p className={['font-display text-2xl font-bold text-white', titleClassName].join(' ').trim()}>
            Sports A
          </p>
          <p className={['text-sm text-slate-300', subtitleClassName].join(' ').trim()}>
            Betting analytics platform
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default BrandLogo
