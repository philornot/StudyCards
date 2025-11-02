import './SkeletonLoader.css';

export const SkeletonText = ({ width = '100%' }) => (
  <div className="skeleton skeleton-text" style={{ width }} />
);

export const SkeletonTitle = () => (
  <div className="skeleton skeleton-title" />
);

export const SkeletonCard = () => (
  <div className="skeleton skeleton-card" />
);

export const SkeletonGrid = ({ count = 3 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);