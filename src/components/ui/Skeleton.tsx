import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  type?: 'card' | 'text' | 'table' | 'chart';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type = 'text', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton-${type}`} />
      ))}
    </>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex-col gap-6">
      <div className="flex gap-6" style={{ marginBottom: '24px' }}>
        <Skeleton type="card" />
        <Skeleton type="card" />
        <Skeleton type="card" />
        <Skeleton type="card" />
      </div>
      <div className="flex gap-6">
        <div style={{ flex: 2 }}>
          <Skeleton type="chart" />
        </div>
        <div style={{ flex: 1 }}>
          <Skeleton type="chart" />
        </div>
      </div>
      <div style={{ marginTop: '24px' }}>
        <Skeleton type="table" />
      </div>
    </div>
  );
};
