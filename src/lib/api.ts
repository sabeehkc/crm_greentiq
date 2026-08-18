export type { Customer, CustomerStatus } from './mockData';
import { Customer, mockCustomers } from './mockData';

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep data in memory during the session
let customersData = [...mockCustomers];

export const fetchCustomers = async (): Promise<Customer[]> => {
  await delay(800);
  return [...customersData].sort((a, b) => a.order - b.order);
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'order'>): Promise<Customer> => {
  await delay(600);
  const newCustomer: Customer = {
    ...customer,
    id: `c${Date.now()}`,
    order: customersData.length,
  };
  customersData.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
  await delay(600);
  const index = customersData.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  
  customersData[index] = { ...customersData[index], ...updates };
  return customersData[index];
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await delay(600);
  customersData = customersData.filter(c => c.id !== id);
};

export const reorderCustomers = async (orderedIds: string[]): Promise<Customer[]> => {
  await delay(400);
  // Update order based on the new array of IDs
  customersData = customersData.map(c => {
    const newOrder = orderedIds.indexOf(c.id);
    return { ...c, order: newOrder !== -1 ? newOrder : c.order };
  });
  return [...customersData].sort((a, b) => a.order - b.order);
};
