import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { KPICard } from '../components/ui/KPICard';
import { ChartCard } from '../components/charts/ChartCard';
import { DataTable } from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import type { Employee } from '../data/models';
import { Users, UserMinus, Clock, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const HR: React.FC = () => {
  const { data, loading } = useData();

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

  const metrics = useMemo(() => {
    if (!data) return null;
    const active = data.employees.filter(e => e.status === 'Active');
    const term = data.employees.filter(e => e.status === 'Terminated');
    return {
      headcount: active.length,
      attrition: Math.round((term.length / data.employees.length) * 100),
      openPositions: 12, // mock static
      avgTenure: 3.2, // mock static
    };
  }, [data]);

  const deptData = useMemo(() => {
    if (!data) return [];
    const counts = data.employees.reduce((acc, emp) => {
      if (emp.status === 'Active') {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).map(dept => ({ name: dept, value: counts[dept] }));
  }, [data]);

  const statusData = useMemo(() => {
    if (!data) return [];
    const counts = data.employees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).map(status => ({ name: status, value: counts[status] }));
  }, [data]);

  const columns: Column<Employee>[] = [
    { key: 'name', header: 'Employee Name' },
    { key: 'department', header: 'Department' },
    { key: 'role', header: 'Role' },
    { 
      key: 'status', 
      header: 'Status',
      render: (val) => (
        <span style={{ 
          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
          backgroundColor: val === 'Active' ? 'var(--success-light)' : val === 'Terminated' ? 'var(--error-light)' : 'var(--warning-light)',
          color: val === 'Active' ? 'var(--success)' : val === 'Terminated' ? 'var(--error)' : 'var(--warning)'
        }}>
          {val}
        </span>
      )
    },
    { key: 'joinDate', header: 'Join Date' },
    { key: 'salary', header: 'Salary', render: (val) => `$${val.toLocaleString()}` }
  ];

  if (loading || !data || !metrics) return <DashboardSkeleton />;

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">HR Intelligence</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <KPICard title="Total Headcount" value={metrics.headcount} trend={2.1} icon={<Users size={20} />} />
        <KPICard title="Attrition Rate" value={`${metrics.attrition}%`} trend={-1.5} icon={<UserMinus size={20} />} />
        <KPICard title="Open Positions" value={metrics.openPositions} icon={<Briefcase size={20} />} />
        <KPICard title="Avg. Tenure" value={`${metrics.avgTenure} yrs`} icon={<Clock size={20} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '24px', marginBottom: '40px' }}>
        <ChartCard title="Headcount by Department">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 13 }} width={100} />
              <Tooltip cursor={{ fill: 'var(--bg-primary)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Employee Status Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={statusData} 
                innerRadius={60} 
                outerRadius={100} 
                paddingAngle={5} 
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {statusData.map((entry, index) => {
                  const colors = ['var(--success)', 'var(--warning)', 'var(--error)'];
                  const colorMap: Record<string, string> = { 'Active': 'var(--success)', 'On Leave': 'var(--warning)', 'Terminated': 'var(--error)' };
                  return <Cell key={`cell-${index}`} fill={colorMap[entry.name] || colors[index % colors.length]} />;
                })}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mb-6">
        <h2 className="h2">Employee Directory</h2>
        <p className="text-sm text-muted mb-4" style={{ marginTop: '4px' }}>Data is pulled from secured endpoint.</p>
        <DataTable data={data.employees} columns={columns} searchable searchKey="name" itemsPerPage={5} maxPages={3} />
      </div>
    </div>
  );
};
