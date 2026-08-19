import { Customer } from './api';

export function exportCustomersToCSV(customers: Customer[], filename: string = 'customers.csv') {
  if (!customers.length) return;

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Deal Value', 'Account Owner', 'Created Date', 'Last Contact Date', 'Notes'];
  
  const csvContent = [
    headers.join(','),
    ...customers.map(c => {
      return [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email.replace(/"/g, '""')}"`,
        `"${c.phone.replace(/"/g, '""')}"`,
        `"${c.company.replace(/"/g, '""')}"`,
        c.status,
        '"$45,000"', // Mocked
        '"Sarah Chen"', // Mocked
        '"Jan 10, 2022"', // Mocked
        `"${new Date(c.lastContactDate).toISOString()}"`,
        `"${(c.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
