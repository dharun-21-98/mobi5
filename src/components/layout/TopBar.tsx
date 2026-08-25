import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import './TopBar.css';

interface TopBarProps {
  toggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
      </div>
      
      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar">JD</div>
          <span className="user-name">Jane Doe</span>
        </div>
      </div>
    </header>
  );
};
