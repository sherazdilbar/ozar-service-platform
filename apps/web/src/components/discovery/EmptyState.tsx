interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="card p-12 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your filters or search in a different area
      </p>
      <button onClick={onClearFilters} className="btn-primary">
        Clear All Filters
      </button>
    </div>
  );
}
