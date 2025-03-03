const LoadingSkeleton = ({ type = "card" }) => {
    if (type === "card") {
      return (
        <div className="card animate-fade-in">
          <div className="p-4 space-y-3">
            <div className="skeleton h-6 w-2/3 rounded-md"></div>
            <div className="skeleton h-4 w-full rounded-md"></div>
            <div className="skeleton h-4 w-4/5 rounded-md"></div>
          </div>
        </div>
      )
    }
  
    if (type === "list") {
      return (
        <div className="space-y-4 animate-fade-in">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-6 w-2/3 rounded-md"></div>
              <div className="skeleton h-4 w-full rounded-md"></div>
            </div>
          ))}
        </div>
      )
    }
  
    return null
  }
  
  export default LoadingSkeleton
  
  