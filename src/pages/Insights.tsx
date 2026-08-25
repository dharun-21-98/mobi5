import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { AlertCircle, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Insight } from '../data/models';

export const Insights: React.FC = () => {
  const { data, loading } = useData();

  const groupedInsights = useMemo(() => {
    if (!data) return { critical: [], warning: [], info: [] };
    return {
      critical: data.insights.filter(i => i.severity === 'Critical'),
      warning: data.insights.filter(i => i.severity === 'Warning'),
      info: data.insights.filter(i => i.severity === 'Info'),
    };
  }, [data]);

  const renderCard = (insight: Insight) => (
    <div key={insight.id} className="animate-slide-up" style={{ 
      padding: '24px', 
      background: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-md)', 
      border: '1px solid var(--border)',
      borderTop: `4px solid ${insight.severity === 'Critical' ? 'var(--error)' : insight.severity === 'Warning' ? 'var(--warning)' : 'var(--primary)'}`,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '24px'
    }}>
      <div className="flex justify-between items-start">
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          color: insight.severity === 'Critical' ? 'var(--error)' : insight.severity === 'Warning' ? 'var(--warning)' : 'var(--primary)'
        }}>
          {insight.domain}
        </span>
        <span className="text-muted" style={{ fontSize: '12px' }}>{insight.date}</span>
      </div>
      
      <p className="text-primary font-medium" style={{ fontSize: '14px', lineHeight: '1.5' }}>
        {insight.message}
      </p>
      
      <div className="mt-1 flex items-center">
        <button style={{ 
          color: 'var(--text-secondary)', 
          fontWeight: 600, 
          fontSize: '13px',
          padding: '0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          View Report <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">Insights & Reports</h1>
      </div>

      <p className="text-secondary mb-8" style={{ fontSize: '16px' }}>
        Auto-generated system insights and anomalies. Categorized by priority for quick triage.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
        gap: '40px',
        alignItems: 'start',
        marginBottom: '40px'
      }}>
        {/* Critical Column */}
        <div style={{ background: 'var(--error-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="flex items-center gap-2 mb-6" style={{ color: 'var(--error)', fontSize: '18px', fontWeight: 700 }}>
            <AlertCircle size={20} /> Critical Actions
            <span style={{ marginLeft: 'auto', background: 'var(--error)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
              {groupedInsights.critical.length}
            </span>
          </h2>
          <div>
            {groupedInsights.critical.length > 0 ? (
              groupedInsights.critical.map(renderCard)
            ) : (
              <p className="text-sm text-muted">No critical issues detected.</p>
            )}
          </div>
        </div>

        {/* Warning Column */}
        <div style={{ background: 'var(--warning-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="flex items-center gap-2 mb-6" style={{ color: 'var(--warning)', fontSize: '18px', fontWeight: 700 }}>
            <AlertTriangle size={20} /> Warnings
            <span style={{ marginLeft: 'auto', background: 'var(--warning)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
              {groupedInsights.warning.length}
            </span>
          </h2>
          <div>
            {groupedInsights.warning.length > 0 ? (
              groupedInsights.warning.map(renderCard)
            ) : (
              <p className="text-sm text-muted">No warnings at this time.</p>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div style={{ background: 'var(--primary-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)', fontSize: '18px', fontWeight: 700 }}>
            <Info size={20} /> General Insights
            <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
              {groupedInsights.info.length}
            </span>
          </h2>
          <div>
            {groupedInsights.info.length > 0 ? (
              groupedInsights.info.map(renderCard)
            ) : (
              <p className="text-sm text-muted">No general insights available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
