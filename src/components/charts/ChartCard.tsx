import React from 'react';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, action }) => {
  return (
    <div className="chart-card animate-slide-up">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {action && <div className="chart-action">{action}</div>}
      </div>
      <div className="chart-body">
        {children}
      </div>
    </div>
  );
};
