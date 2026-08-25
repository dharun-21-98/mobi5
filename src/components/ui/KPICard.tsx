import React from 'react';
import './KPICard.css';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage change
  trendLabel?: string;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendLabel, icon }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="kpi-card animate-slide-up">
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        {icon && <div className="kpi-icon-wrapper">{icon}</div>}
      </div>
      <div className="kpi-body">
        <div className="kpi-value">{value}</div>
        {trend !== undefined && (
          <div className={`kpi-trend ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
            {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : <Minus size={16} />}
            <span>{Math.abs(trend)}%</span>
            {trendLabel && <span className="kpi-trend-label">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
