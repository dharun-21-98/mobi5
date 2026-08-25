import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { KPICard } from '../components/ui/KPICard';
import { ChartCard } from '../components/charts/ChartCard';
import { Users, Building2, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Home: React.FC = () => {
  const { data, loading } = useData();

  const metrics = useMemo(() => {
    if (!data) return null;
    return {
      headcount: data.employees.filter(e => e.status === 'Active').length,
      assetValue: data.assets.filter(a => a.status === 'Active').reduce((sum, a) => sum + a.value, 0),
      revenue: data.transactions.filter(t => t.category.includes('Ad') || t.amount > 3000).reduce((sum, t) => sum + t.amount, 0), // rough mock logic
      openAlerts: data.insights.filter(i => i.severity === 'Critical' || i.severity === 'Warning').length
    };
  }, [data]);

  const trendData = useMemo(() => {
    return [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 },
      { name: 'Jul', value: 3490 },
    ];
  }, []);

  if (loading || !data || !metrics) return <DashboardSkeleton />;

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">Executive Overview</h1>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <KPICard 
            title="Total Headcount" 
            value={metrics.headcount} 
            trend={4.2} 
            trendLabel="vs last month"
            icon={<Users size={20} />} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <KPICard 
            title="Total Asset Value" 
            value={`$${(metrics.assetValue / 1000).toFixed(1)}k`} 
            trend={-1.5} 
            trendLabel="vs last month"
            icon={<Building2 size={20} />} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <KPICard 
            title="Monthly Revenue" 
            value={`$${(metrics.revenue / 1000).toFixed(1)}k`} 
            trend={12.4} 
            trendLabel="vs last month"
            icon={<TrendingUp size={20} />} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <KPICard 
            title="Open Alerts" 
            value={metrics.openAlerts} 
            trend={0}
            trendLabel="unchanged"
            icon={<AlertTriangle size={20} />} 
          />
        </div>
      </div>

      {/* Charts & Insights */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '2 1 400px', minWidth: 0 }}>
          <ChartCard title="Overall Growth Trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <ChartCard title="Recent Insights">
            <div className="flex-col" style={{ gap: '16px' }}>
            {data.insights.slice(0, 4).map(insight => (
              <div key={insight.id} className="flex-col" style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    insight.severity === 'Critical' ? 'bg-error-light text-error' :
                    insight.severity === 'Warning' ? 'bg-warning-light text-warning' : 'bg-success-light text-success'
                  }`} style={{ 
                    backgroundColor: insight.severity === 'Critical' ? 'var(--error-light)' : insight.severity === 'Warning' ? 'var(--warning-light)' : 'var(--primary-light)',
                    color: insight.severity === 'Critical' ? 'var(--error)' : insight.severity === 'Warning' ? 'var(--warning)' : 'var(--primary)',
                    borderRadius: '4px'
                  }}>
                    {insight.severity}
                  </span>
                  <span className="text-xs text-muted">{insight.domain}</span>
                </div>
                <p className="text-sm" style={{ marginTop: '12px', lineHeight: '1.6' }}>{insight.message}</p>
              </div>
            ))}
          </div>
        </ChartCard>
        </div>
      </div>
    </div>
  );
};
