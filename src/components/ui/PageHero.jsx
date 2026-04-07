function PageHero({ eyebrow, title, description, actions }) {
  return (
    <section className="glass-panel overflow-hidden p-6 md:p-8">
      <div className="section-shell">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
            {eyebrow}
          </p>
          <h2 className="page-title">{title}</h2>
          <p className="page-subtitle">{description}</p>
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export default PageHero
