export type Department = 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Finance';
export type AssetCategory = 'Hardware' | 'Software' | 'Furniture' | 'Facilities';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';
export type TransactionStatus = 'Paid' | 'Pending' | 'Overdue';
export type InsightSeverity = 'Info' | 'Warning' | 'Critical';
export type Domain = 'HR' | 'Asset' | 'Finance';

export interface Employee {
  id: string;
  name: string;
  department: Department;
  role: string;
  status: EmployeeStatus;
  joinDate: string;
  salary: number;
  performanceScore: number;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  value: number;
  location: string;
  status: 'Active' | 'In Maintenance' | 'Retired';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  department: Department;
  vendor: string;
  status: TransactionStatus;
}

export interface Insight {
  id: string;
  domain: Domain;
  severity: InsightSeverity;
  message: string;
  date: string;
}

export interface DashboardData {
  employees: Employee[];
  assets: Asset[];
  transactions: Transaction[];
  insights: Insight[];
}
