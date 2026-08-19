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
    phone: '+91 98765 43211',
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
    phone: '+91 98765 43212',
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
    phone: '+91 98765 43213',
    company: 'Design Co',
    status: 'Active',
    lastContactDate: '2026-08-18',
    order: 2,
  },
  {
    id: 'c4',
    name: 'Diana Prince',
    email: 'diana@amazon.com',
    phone: '+91 98765 43214',
    company: 'Themyscira Ltd',
    status: 'Active',
    lastContactDate: '2026-08-01',
    order: 3,
  },
  {
    id: 'c5',
    name: 'Evan Wright',
    email: 'evan@wrightbrothers.com',
    phone: '+91 98765 43215',
    company: 'Flight Systems',
    status: 'Inactive',
    lastContactDate: '2026-06-15',
    notes: "Vehemens tonsor reiciendis antiquus.",
    order: 4,
  },
  {
  id: 'c6',
  name: 'Fiona Gallagher',
  email: 'fiona.g@southside.com',
  phone: '+91 98765 43216',
  company: 'Southside Goods',
  status: 'Active',
  lastContactDate: '2026-08-17',
  order: 5,
},
{
  id: 'c7',
  name: 'George Brooks',
  email: 'george@brookstech.io',
  phone: '+91 98765 43217',
  company: 'Brooks Tech',
  status: 'Active',
  lastContactDate: '2026-08-15',
  order: 6,
},
{
  id: 'c8',
  name: 'Hannah Abbott',
  email: 'hannah@apothecary.co',
  phone: '+91 98765 43218',
  company: 'Leaky Cauldron',
  status: 'Inactive',
  lastContactDate: '2026-07-20',
  notes: "Doloremque tergum advoco usus vallum perferendis occaecati.",
  order: 7,
},
{
  id: 'c9',
  name: 'Ian Malcolm',
  email: 'ian.m@chaos.org',
  phone: '+91 98765 43219',
  company: 'TechCorp',
  status: 'Active',
  lastContactDate: '2026-08-12',
  order: 8,
},
{
  id: 'c10',
  name: 'Julia Roberts',
  email: 'julia@hollywood.com',
  phone: '+91 98765 43220',
  company: 'Red Om Films',
  status: 'Inactive',
  lastContactDate: '2026-05-10',
  order: 9,
}
];
