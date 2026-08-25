import type { DashboardData, Employee, Asset, Transaction, Insight, Department, AssetCategory } from './models';

const generateEmployees = (): Employee[] => {
  const departments: Department[] = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  const employees: Employee[] = [];
  for (let i = 0; i < 85; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const status = Math.random() > 0.1 ? 'Active' : (Math.random() > 0.5 ? 'On Leave' : 'Terminated');
    const joinYear = 2018 + Math.floor(Math.random() * 6);
    const joinMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const joinDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    employees.push({
      id: `EMP-${1000 + i}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      department: dept,
      role: `${dept} Specialist`,
      status,
      joinDate: `${joinYear}-${joinMonth}-${joinDay}`,
      salary: 60000 + Math.floor(Math.random() * 90000),
      performanceScore: 3 + (Math.random() * 2), // 3.0 to 5.0
    });
  }
  return employees;
};

const generateAssets = (): Asset[] => {
  const locations = ['New York HQ', 'London Office', 'Tokyo Branch', 'San Francisco Hub', 'Berlin Hub', 'Singapore Office'];
  const categories: AssetCategory[] = ['Hardware', 'Software', 'Furniture', 'Facilities'];
  
  const assets: Asset[] = [];
  for (let i = 0; i < 120; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const purchaseYear = 2020 + Math.floor(Math.random() * 4);
    const purchaseMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    
    assets.push({
      id: `AST-${5000 + i}`,
      name: `${cat} Item ${i + 1}`,
      category: cat,
      purchaseDate: `${purchaseYear}-${purchaseMonth}-15`,
      value: (cat === 'Software' || cat === 'Hardware') ? 1000 + Math.floor(Math.random() * 4000) : 500 + Math.floor(Math.random() * 1500),
      location: locations[Math.floor(Math.random() * locations.length)],
      status: Math.random() > 0.15 ? 'Active' : (Math.random() > 0.5 ? 'In Maintenance' : 'Retired'),
    });
  }
  return assets;
};

const generateTransactions = (): Transaction[] => {
  const depts: Department[] = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const categories = ['Software Licenses', 'Office Supplies', 'Travel', 'Marketing Ads', 'Consulting'];
  const vendors = ['TechCorp', 'OfficeSuppliesCo', 'GlobalAds', 'CloudHost', 'ConsultPro'];
  
  const tx: Transaction[] = [];
  let currentDate = new Date('2023-01-01');
  const endDate = new Date('2024-03-31');
  
  let idCount = 0;
  while(currentDate <= endDate) {
    // Generate 3-5 tx per day
    const txCount = 3 + Math.floor(Math.random() * 3);
    for(let i = 0; i < txCount; i++) {
      const dept = depts[Math.floor(Math.random() * depts.length)];
      tx.push({
        id: `TXN-${10000 + idCount}`,
        date: currentDate.toISOString().split('T')[0],
        amount: 200 + Math.floor(Math.random() * 4800),
        category: categories[Math.floor(Math.random() * categories.length)],
        department: dept,
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        status: Math.random() > 0.05 ? 'Paid' : (Math.random() > 0.5 ? 'Pending' : 'Overdue'),
      });
      idCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return tx;
};

const insights: Insight[] = [
  { id: 'I-1', domain: 'HR', severity: 'Warning', message: 'Attrition in Engineering rose 12% this quarter.', date: '2024-03-20' },
  { id: 'I-2', domain: 'Asset', severity: 'Info', message: 'Hardware upgrades required in London Office.', date: '2024-03-18' },
  { id: 'I-3', domain: 'Finance', severity: 'Critical', message: 'Marketing vendor spend exceeded budget by 8%.', date: '2024-03-15' },
  { id: 'I-4', domain: 'HR', severity: 'Info', message: 'Hiring funnel efficiency improved by 4 days avg time-to-hire.', date: '2024-03-10' },
  { id: 'I-5', domain: 'Asset', severity: 'Warning', message: 'Tokyo Branch facility utilization dropped below 40%.', date: '2024-03-05' },
];

export const seedData: DashboardData = {
  employees: generateEmployees(),
  assets: generateAssets(),
  transactions: generateTransactions(),
  insights,
};
