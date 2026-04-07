function SectionCard({ title, description, children }) {
  return (
    <section className="glass-panel p-6">
      <div className="mb-5">
        <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default SectionCard
