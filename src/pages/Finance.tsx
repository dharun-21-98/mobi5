import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { KPICard } from '../components/ui/KPICard';
import { ChartCard } from '../components/charts/ChartCard';
import { DataTable } from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import type { Transaction } from '../data/models';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  AreaChart, Area
} from 'recharts';

export const Finance: React.FC = () => {
  const { data, loading } = useData();

  const metrics = useMemo(() => {
    if (!data) return null;
    const rev = data.transactions.filter(t => t.amount > 3000).reduce((sum, t) => sum + t.amount, 0);
    const exp = data.transactions.filter(t => t.amount <= 3000).reduce((sum, t) => sum + t.amount, 0);
    return {
      revenue: rev,
      expenses: exp,
      margin: ((rev - exp) / rev) * 100,
      outstanding: data.transactions.filter(t => t.status === 'Pending' || t.status === 'Overdue').reduce((sum, t) => sum + t.amount, 0)
    };
  }, [data]);

  const trendData = useMemo(() => [
    { name: 'Q1', revenue: 45000, expenses: 32000 },
    { name: 'Q2', revenue: 52000, expenses: 35000 },
    { name: 'Q3', revenue: 48000, expenses: 38000 },
    { name: 'Q4', revenue: 61000, expenses: 40000 },
  ], []);

  const expenseData = useMemo(() => [
    { name: 'Marketing', value: 45000 },
    { name: 'R&D', value: 65000 },
    { name: 'Operations', value: 35000 },
    { name: 'Sales', value: 25000 },
  ], []);

  const regionData = useMemo(() => [
    { name: 'NA', revenue: 120000 },
    { name: 'EMEA', revenue: 85000 },
    { name: 'APAC', revenue: 95000 },
    { name: 'LATAM', revenue: 30000 },
  ], []);

  const marginData = useMemo(() => [
    { month: 'Jan', margin: 12 },
    { month: 'Feb', margin: 15 },
    { month: 'Mar', margin: 14 },
    { month: 'Apr', margin: 18 },
    { month: 'May', margin: 22 },
  ], []);

  const cashflowData = useMemo(() => [
    { month: 'Jan', in: 45000, out: 30000 },
    { month: 'Feb', in: 52000, out: 35000 },
    { month: 'Mar', in: 48000, out: 38000 },
    { month: 'Apr', in: 61000, out: 40000 },
    { month: 'May', in: 59000, out: 42000 },
  ], []);

  const COLORS = ['var(--palette-accent)', 'var(--palette-mid)', 'var(--palette-dark)', 'var(--warning)'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const columns: Column<Transaction>[] = [
    { key: 'id', header: 'Transaction ID' },
    { key: 'date', header: 'Date' },
    { key: 'vendor', header: 'Vendor' },
    { key: 'category', header: 'Category' },
    { key: 'department', header: 'Department' },
    { 
      key: 'status', 
      header: 'Status',
      render: (val) => (
        <span style={{ 
          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
          backgroundColor: val === 'Paid' ? 'var(--success-light)' : val === 'Overdue' ? 'var(--error-light)' : 'var(--warning-light)',
          color: val === 'Paid' ? 'var(--success)' : val === 'Overdue' ? 'var(--error)' : 'var(--warning)'
        }}>
          {val}
        </span>
      )
    },
    { key: 'amount', header: 'Amount', render: (val) => `$${val.toLocaleString()}` }
  ];

  if (loading || !data || !metrics) return <DashboardSkeleton />;

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">Finance Metrics</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <KPICard title="Total Revenue" value={`$${(metrics.revenue / 1000).toFixed(1)}k`} trend={8.4} icon={<DollarSign size={20} />} />
        <KPICard title="Total Expenses" value={`$${(metrics.expenses / 1000).toFixed(1)}k`} trend={2.1} icon={<ArrowDownRight size={20} />} />
        <KPICard title="Net Margin" value={`${metrics.margin.toFixed(1)}%`} trend={5.2} icon={<ArrowUpRight size={20} />} />
        <KPICard title="Outstanding" value={`$${(metrics.outstanding / 1000).toFixed(1)}k`} icon={<CreditCard size={20} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <ChartCard title="Revenue vs Expenses (Spider)">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={trendData} margin={{ top: 20, right: 30, left: 30, bottom: 60 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--text-muted)' }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '30px', position: 'relative', top: '15px' }} />
              <Radar name="Revenue" dataKey="revenue" stroke="var(--palette-accent)" fill="var(--palette-accent)" fillOpacity={0.5} />
              <Radar name="Expenses" dataKey="expenses" stroke="var(--palette-mid)" fill="var(--palette-mid)" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" labelLine={false} label={renderCustomizedLabel}>
                {expenseData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Region">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'var(--bg-primary)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="revenue" fill="var(--palette-dark)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Profit Margin Trend (%)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marginData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Line type="monotone" dataKey="margin" stroke="var(--palette-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cash Flow (In vs Out)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashflowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--palette-mid)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--palette-mid)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
              <Area type="monotone" dataKey="in" name="Cash In" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
              <Area type="monotone" dataKey="out" name="Cash Out" stroke="var(--palette-mid)" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mb-6">
        <h2 className="h2">Transactions</h2>
        <p className="text-sm text-muted mb-4" style={{ marginTop: '4px' }}>Data pulled from secure endpoint.</p>
        <DataTable data={data.transactions} columns={columns} searchable searchKey="vendor" itemsPerPage={5} maxPages={3} />
      </div>
    </div>
  );
};
