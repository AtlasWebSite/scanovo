export function LoadingSkeleton() {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <span />
          <strong />
          <small />
        </div>
      ))}
    </div>
  );
}
