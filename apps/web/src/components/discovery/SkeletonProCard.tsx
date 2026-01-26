export default function SkeletonProCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="flex">
        <div className="w-[150px] h-[180px] bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1 p-4">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="flex gap-4 mb-3">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
            <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
