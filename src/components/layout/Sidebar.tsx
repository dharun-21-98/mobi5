import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, TrendingUp, Lightbulb, Hexagon } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/hr', label: 'HR Intelligence', icon: Users },
    { to: '/assets', label: 'Assets & Property', icon: Building2 },
    { to: '/finance', label: 'Finance Metrics', icon: TrendingUp },
    { to: '/insights', label: 'Insights & Reports', icon: Lightbulb },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Hexagon size={28} color="var(--primary)" />
        <span className="logo-text">Mobi5</span>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            onClick={closeSidebar}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
