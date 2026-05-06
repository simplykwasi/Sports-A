/**
 * Loading skeleton components for improved UX during data fetching
 */

export function SkeletonLine({ className = '' }) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <SkeletonLine className="h-5 w-1/2" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <SkeletonLine className="h-8 flex-1" />
        <SkeletonLine className="h-8 flex-1" />
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b">
      <td className="p-3"><SkeletonLine /></td>
      <td className="p-3"><SkeletonLine /></td>
      <td className="p-3"><SkeletonLine /></td>
      <td className="p-3"><SkeletonLine /></td>
    </tr>
  );
}

export function SkeletonMatchCard() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex justify-between items-center">
        <SkeletonLine className="h-5 w-1/3" />
        <SkeletonLine className="h-6 w-16" />
      </div>
      <SkeletonLine className="h-8 w-full" />
      <div className="flex gap-2">
        <SkeletonLine className="h-8 flex-1" />
        <SkeletonLine className="h-8 flex-1" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ columns = 3, count = 6 }) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function DataTableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3"><SkeletonLine /></th>
            <th className="p-3"><SkeletonLine /></th>
            <th className="p-3"><SkeletonLine /></th>
            <th className="p-3"><SkeletonLine /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
