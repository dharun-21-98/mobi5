import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import './DataTable.css';

export interface Column<T> {
  key: Extract<keyof T, string>;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKey?: Extract<keyof T, string>;
  itemsPerPage?: number;
  maxPages?: number;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchable = false,
  searchKey,
  itemsPerPage,
  maxPages
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: Extract<keyof T, string>; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: Extract<keyof T, string>) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  let processedData = [...data];

  if (searchable && searchKey && searchTerm) {
    processedData = processedData.filter(item => {
      const val = item[searchKey];
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
    // Reset to page 1 on search
    if (currentPage !== 1) setCurrentPage(1);
  }

  if (sortConfig) {
    processedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination Logic
  let totalPages = 1;
  let paginatedData = processedData;
  
  if (itemsPerPage) {
    totalPages = Math.ceil(processedData.length / itemsPerPage);
    if (maxPages && totalPages > maxPages) {
      totalPages = maxPages;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);
  }

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} className="table-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false ? handleSort(col.key) : undefined}
                  className={col.sortable !== false ? 'sortable' : ''}
                >
                  <div className="th-content">
                    {col.header}
                    {col.sortable !== false && sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-state">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {itemsPerPage && totalPages > 1 && (
        <div className="table-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <span className="text-sm text-muted">Page {currentPage} of {totalPages}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)', background: currentPage === 1 ? 'transparent' : 'var(--bg-primary)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)', background: currentPage === totalPages ? 'transparent' : 'var(--bg-primary)', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
