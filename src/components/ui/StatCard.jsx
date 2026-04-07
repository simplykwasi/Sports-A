// Small KPI card for dashboard and overview metrics.
function StatCard({ label, value, helper }) {
  return (
    <article className="stat-card">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
      {helper ? <p className="mt-2 text-sm text-slate-300">{helper}</p> : null}
    </article>
  )
}

export default StatCard
