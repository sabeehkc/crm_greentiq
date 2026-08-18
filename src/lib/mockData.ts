export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes?: string;
  order: number; // for drag and drop
}

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp',
    status: 'Active',
    lastContactDate: '2026-08-15',
    notes: 'Interested in enterprise plan.',
    order: 0,
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    email: 'bob@smithinc.com',
    phone: '+1 (555) 987-6543',
    company: 'Smith Inc.',
    status: 'Inactive',
    lastContactDate: '2026-07-20',
    notes: 'Paused subscription for the summer.',
    order: 1,
  },
  {
    id: 'c3',
    name: 'Charlie Davis',
    email: 'charlie.davis@designco.com',
    phone: '+1 (555) 222-3333',
    company: 'Design Co',
    status: 'Active',
    lastContactDate: '2026-08-18',
    order: 2,
  },
  {
    id: 'c4',
    name: 'Diana Prince',
    email: 'diana@amazon.com',
    phone: '+1 (555) 444-5555',
    company: 'Themyscira Ltd',
    status: 'Active',
    lastContactDate: '2026-08-01',
    order: 3,
  },
  {
    id: 'c5',
    name: 'Evan Wright',
    email: 'evan@wrightbrothers.com',
    phone: '+1 (555) 666-7777',
    company: 'Flight Systems',
    status: 'Inactive',
    lastContactDate: '2026-06-15',
    order: 4,
  },
  {
  id: 'c6',
  name: 'Fiona Gallagher',
  email: 'fiona.g@southside.com',
  phone: '+1 (555) 888-9999',
  company: 'Southside Goods',
  status: 'Active',
  lastContactDate: '2026-08-17',
  order: 5,
},
{
  id: 'c7',
  name: 'George Brooks',
  email: 'george@brookstech.io',
  phone: '+1 (555) 111-2222',
  company: 'Brooks Tech',
  status: 'Active',
  lastContactDate: '2026-08-15',
  order: 6,
},
{
  id: 'c8',
  name: 'Hannah Abbott',
  email: 'hannah@apothecary.co',
  phone: '+1 (555) 333-4444',
  company: 'Leaky Cauldron',
  status: 'Inactive',
  lastContactDate: '2026-07-20',
  order: 7,
},
{
  id: 'c9',
  name: 'Ian Malcolm',
  email: 'ian.m@chaos.org',
  phone: '+1 (555) 555-6666',
  company: 'TechCorp',
  status: 'Active',
  lastContactDate: '2026-08-12',
  order: 8,
},
{
  id: 'c10',
  name: 'Julia Roberts',
  email: 'julia@hollywood.com',
  phone: '+1 (555) 777-8888',
  company: 'Red Om Films',
  status: 'Inactive',
  lastContactDate: '2026-05-10',
  order: 9,
}
];
