import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DashboardData } from '../data/models';
import { seedData } from '../data/seed';

interface DataContextType {
  data: DashboardData | null;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay for realistic skeleton loading
    const timer = setTimeout(() => {
      setData(seedData);
      setLoading(false);
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
