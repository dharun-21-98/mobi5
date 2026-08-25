import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { KPICard } from '../components/ui/KPICard';
import { ChartCard } from '../components/charts/ChartCard';
import { DataTable } from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import type { Asset } from '../data/models';
import { Building2, Laptop, Wrench, Package } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

export const Assets: React.FC = () => {
  const { data, loading } = useData();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    if (percent < 0.05) return null; // Don't show label for very small slices
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const metrics = useMemo(() => {
    if (!data) return null;
    const inMaint = data.assets.filter(a => a.status === 'In Maintenance');
    return {
      totalValue: data.assets.reduce((sum, a) => sum + a.value, 0),
      totalAssets: data.assets.length,
      underMaint: inMaint.length,
      locations: new Set(data.assets.map(a => a.location)).size,
    };
  }, [data]);

  const trendData = useMemo(() => {
    return [
      { name: 'Jan', value: 120 },
      { name: 'Feb', value: 135 },
      { name: 'Mar', value: 140 },
      { name: 'Apr', value: 155 },
      { name: 'May', value: 180 },
      { name: 'Jun', value: 210 },
      { name: 'Jul', value: 227 },
    ];
  }, []);

  const maintData = useMemo(() => {
    return [
      { name: 'Jan', cost: 12 },
      { name: 'Feb', cost: 15 },
      { name: 'Mar', cost: 10 },
      { name: 'Apr', cost: 18 },
      { name: 'May', cost: 22 },
      { name: 'Jun', cost: 14 },
      { name: 'Jul', cost: 9 },
    ];
  }, []);

  const categoryData = useMemo(() => {
    if (!data) return [];
    const counts = data.assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).map(cat => ({ name: cat, value: counts[cat] }));
  }, [data]);

  const COLORS = ['var(--palette-accent)', 'var(--palette-mid)', 'var(--palette-dark)', 'var(--warning)'];

  const columns: Column<Asset>[] = [
    { key: 'name', header: 'Asset Name' },
    { key: 'category', header: 'Category' },
    { key: 'location', header: 'Location' },
    { 
      key: 'status', 
      header: 'Status',
      render: (val) => (
        <span style={{ 
          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
          backgroundColor: val === 'Active' ? 'var(--success-light)' : val === 'In Maintenance' ? 'var(--warning-light)' : 'var(--border)',
          color: val === 'Active' ? 'var(--success)' : val === 'In Maintenance' ? 'var(--warning)' : 'var(--text-secondary)'
        }}>
          {val}
        </span>
      )
    },
    { key: 'purchaseDate', header: 'Purchase Date' },
    { key: 'value', header: 'Value', render: (val) => `$${val.toLocaleString()}` }
  ];

  if (loading || !data || !metrics) return <DashboardSkeleton />;

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">Assets & Property Intelligence</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <KPICard title="Total Asset Value" value={`$${(metrics.totalValue / 1000).toFixed(1)}k`} trend={3.2} icon={<Package size={20} />} />
        <KPICard title="Total Assets" value={metrics.totalAssets} icon={<Laptop size={20} />} />
        <KPICard title="In Maintenance" value={metrics.underMaint} trend={-1.2} icon={<Wrench size={20} />} />
        <KPICard title="Locations" value={metrics.locations} icon={<Building2 size={20} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <ChartCard title="Asset Distribution by Category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Asset Value Trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValueAsset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--palette-mid)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--palette-mid)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Area type="monotone" dataKey="value" stroke="var(--palette-mid)" strokeWidth={3} fillOpacity={1} fill="url(#colorValueAsset)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Costs ($k)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={maintData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Line type="monotone" dataKey="cost" stroke="var(--palette-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mb-6">
        <h2 className="h2">Asset Registry</h2>
        <p className="text-sm text-muted mb-4" style={{ marginTop: '4px' }}>Data is pulled from secured endpoint.</p>
        <DataTable data={data.assets} columns={columns} searchable searchKey="name" itemsPerPage={5} maxPages={3} />
      </div>
    </div>
  );
};
