import { create } from 'zustand';

// ========== CONDOMINIUM CONFIG ==========
export interface CommonArea {
  id: string;
  name: string;
  type: 'pool' | 'gym' | 'lounge' | 'bbq' | 'court' | 'playground' | 'parking' | 'garden';
  capacity: number;
  reservable: boolean;
}

export interface Tower {
  id: string;
  name: string;
  floors: number;
  unitsPerFloor: number;
}

export interface CondominiumConfig {
  id: string;
  name: string;
  nit: string;
  address: string;
  city: string;
  type: 'residential' | 'mixed' | 'commercial';
  totalUnits: number;
  towers: Tower[];
  commonAreas: CommonArea[];
  adminCompany: string;
  adminContact: string;
  foundedDate: string;
  image?: string;
  blocks: number;
  parkingSpots: number;
  storageUnits: number;
  regulationPdf?: string;
  occupancyRate: number;
  totalDebt: number;
  alerts: number;
  totalResidents: number;
}

// ========== PROPERTIES ==========
export interface Property {
  id: string;
  name: string;
  tower: string;
  unit: string;
  floor: number;
  area: number;
  use: 'residential' | 'commercial' | 'parking' | 'storage';
  coefficient: number;
  owner: string;
  ownerId: string;
  tenant?: string;
  tenantId?: string;
  status: 'occupied' | 'vacant' | 'for_sale' | 'for_rent';
  type: 'apartment' | 'house' | 'commercial' | 'parking';
  monthlyFee: number;
  block?: string;
  image?: string; // Foto de la unidad
  condoId?: string; // Conjunto al que pertenece la propiedad
}

// ========== RESIDENTS ==========
export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  vaccinated: boolean;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: 'car' | 'motorcycle' | 'bicycle';
  parkingSpot?: string;
}

export interface OccupancyRecord {
  id: string;
  unit: string;
  residentName: string;
  type: 'owner' | 'tenant';
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  unit: string;
  type: 'owner' | 'tenant' | 'family' | 'admin';
  pets: Pet[];
  vehicles: Vehicle[];
  since: string;
  status: 'active' | 'inactive';
  emergencyContact?: string;
  emergencyPhone?: string;
  block?: string;
  condoId: string;
}

// ========== COMMUNICATIONS ==========
export interface DirectMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  date: string;
  read: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  category: 'official' | 'strategic' | 'general' | 'emergency';
  channel: 'push' | 'email' | 'in_app' | 'all';
  audience: 'all' | 'owners' | 'tenants' | 'tower_a' | 'tower_b' | 'tower_c' | 'council' | 'block_1' | 'debtors';
  author: string;
  authorRole: string;
  date: string;
  comments: number;
  commentList?: Comment[];
  pinned: boolean;
  archived: boolean;
  moderated: boolean;
  aiGenerated?: boolean;
  // Nuevas propiedades para comunicados profesionales
  logoUrl?: string;
  includeSignature?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
}

// ========== PAYMENTS ==========
export interface FeeConfig {
  id: string;
  name: string;
  type: 'ordinary' | 'extraordinary' | 'special_fund';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  description: string;
  active: boolean;
  dueDay: number;
  interestRate: number;
}

export interface Payment {
  id: string;
  unit: string;
  owner: string;
  concept: string;
  feeType: 'ordinary' | 'extraordinary' | 'special_fund' | 'interest';
  amount: number;
  interest: number;
  balance: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'agreement';
  paymentMethod?: 'online' | 'transfer' | 'cash' | 'pse';
  receiptNumber?: string;
}

export interface CollectionAction {
  id: string;
  unit: string;
  owner: string;
  type: 'reminder' | 'letter' | 'agreement' | 'legal';
  date: string;
  description: string;
  aiGenerated: boolean;
  scheduled?: boolean;
  scheduledDate?: string;
}

// ========== ACCOUNTING ==========
export interface AccountingEntry {
  id: string;
  date: string;
  concept: string;
  category: 'income' | 'expense';
  amount: number;
  account: string;
}

// ========== RESERVATIONS ==========
export interface Reservation {
  id: string;
  condoId?: string;
  condoName?: string;
  area: string;
  resident: string;
  unit: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'rejected' | 'cancelled';
}

// ========== PQRS ==========
export interface PQRS {
  id: string;
  ticket: string;
  subject: string;
  category: 'petition' | 'complaint' | 'claim' | 'suggestion';
  status: 'received' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  resident: string;
  unit: string;
  date: string;
  assignedTo?: string;
  description: string;
}

// ========== MAINTENANCE ==========
export interface MaintenanceOrder {
  id: string;
  title: string;
  area: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  reportedDate: string;
  completedDate?: string;
  description: string;
}

// ========== SECURITY ==========
export interface AccessLog {
  id: string;
  type: 'entry' | 'exit';
  person: string;
  document: string;
  destination: string;
  date: string;
  time: string;
  vehicle?: string;
  authorized: boolean;
}

// ========== DOCUMENTS ==========
export interface Document {
  id: string;
  name: string;
  category: 'minutes' | 'regulations' | 'contracts' | 'financial' | 'legal' | 'suppliers' | 'residents' | 'administration';
  uploadDate: string;
  version: number;
  size: string;
  uploadedBy: string;
  signed?: boolean;
  // Nuevos campos para vista previa y detalles
  url?: string;
  fileType?: 'pdf' | 'doc' | 'docx' | 'image' | 'xlsx' | 'other';
  previewUrl?: string;
  description?: string;
}

// ========== MARKETPLACE ==========
export interface MarketplaceService {
  id: string;
  provider: string;
  service: string;
  category: 'cleaning' | 'maintenance' | 'plumbing' | 'electrical' | 'security' | 'gardening' | 'painting' | 'construction';
  rating: number;
  reviews: number;
  price: string;
  available: boolean;
  image?: string;
  // Nuevos campos para galería y detalles
  coverImage?: string;
  gallery?: string[]; // URLs de imágenes adicionales
  description?: string;
  services?: string[]; // Servicios específicos que ofrece
  phone?: string;
  email?: string;
  address?: string;
  schedule?: string; // Horarios disponibles
  badge?: 'recommended' | 'new' | 'popular'; // Badges especiales
  responseTime?: string; // Ej: "2-4 horas"
  yearsExperience?: number;
}

// ========== SUPPORT ==========
export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  date: string;
  category: string;
  description: string;
  requesterId?: string;
}

// ========== PROVIDER ==========
export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // RUT/NIT
  address: string;
  serviceType: 'electrical' | 'plumbing' | 'gardening' | 'cleaning' | 'security' | 'maintenance' | 'construction';
  certifications: string[];
  rating: number;
  totalJobs: number;
  since: string;
  status: 'active' | 'inactive' | 'suspended';
  contractStartDate: string;
  contractEndDate: string;
  insurancePolicy?: string;
  bankAccount?: string;
  bankName?: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  propertyId: string;
  property: string; // Unit/Apto info
  tower: string;
  block: string;
  serviceType: 'electrical' | 'plumbing' | 'gardening' | 'cleaning' | 'security' | 'maintenance' | 'construction';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  providerId: string;
  provider: string;
  description: string;
  observations?: string;
  evidence?: WorkOrderEvidence[];
  adminSignature?: boolean;
  incidentReport?: string;
  materialsUsed?: MaterialUsed[];
  technicianNotes?: string;
}

export interface WorkOrderEvidence {
  id: string;
  type: 'before' | 'after' | 'during';
  imageUrl: string;
  uploadedAt: string;
  description?: string;
}

export interface MaterialUsed {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProviderInvoice {
  id: string;
  invoiceNumber: string;
  providerId: string;
  provider: string;
  workOrderId?: string;
  concept: string;
  amount: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'draft' | 'pending' | 'in_review' | 'approved' | 'paid' | 'rejected';
  description?: string;
  paymentMethod?: 'transfer' | 'check' | 'cash' | 'online';
  receiptNumber?: string;
}

export interface ProviderPayment {
  id: string;
  providerId: string;
  provider: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  method: 'transfer' | 'check' | 'cash' | 'online';
  reference: string;
}

export interface ProviderCreditNote {
  id: string;
  creditNoteNumber: string;
  providerId: string;
  provider: string;
  invoiceId?: string;
  reason: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'applied';
}

export interface ProviderEvaluation {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  providerId: string;
  provider: string;
  date: string;
  timeRating: number; // 1-5
  qualityRating: number; // 1-5
  complianceRating: number; // 1-5
  communicationRating: number; // 1-5
  overallRating: number; // 1-5
  comments?: string;
  evaluator: string; // Admin name
}

export interface ProviderSchedule {
  id: string;
  providerId: string;
  date: string;
  timeSlot: string;
  serviceType: string;
  property: string;
  workOrderId?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

// ========== MULTI-CONDO DATA ==========
const MOCK_CONDOS: CondominiumConfig[] = [
  {
    id: 'CONDO1', name: 'Torres del Parque Residencial', nit: '900.123.456-7', address: 'Calle 85 #15-30', city: 'Bogotá D.C.', type: 'mixed', totalUnits: 120, blocks: 3,
    parkingSpots: 80, storageUnits: 40, occupancyRate: 92, totalDebt: 18500000, alerts: 3, totalResidents: 12,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    towers: [
      { id: 'T1', name: 'Torre A', floors: 12, unitsPerFloor: 4 },
      { id: 'T2', name: 'Torre B', floors: 10, unitsPerFloor: 4 },
      { id: 'T3', name: 'Torre C', floors: 3, unitsPerFloor: 2 },
    ],
    commonAreas: [
      { id: 'CA1', name: 'Piscina', type: 'pool', capacity: 40, reservable: true },
      { id: 'CA2', name: 'Gimnasio', type: 'gym', capacity: 20, reservable: false },
      { id: 'CA3', name: 'Salón Comunal', type: 'lounge', capacity: 80, reservable: true },
      { id: 'CA4', name: 'BBQ Zone', type: 'bbq', capacity: 30, reservable: true },
      { id: 'CA5', name: 'Cancha de Tenis', type: 'court', capacity: 4, reservable: true },
      { id: 'CA6', name: 'Parque Infantil', type: 'playground', capacity: 15, reservable: false },
      { id: 'CA7', name: 'Jardín Central', type: 'garden', capacity: 50, reservable: false },
    ],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 601 555 0000', foundedDate: '2015-03-20',
  },
  {
    id: 'CONDO2', name: 'Parque Central Luxury', nit: '900.234.567-8', address: 'Av. 7ª #120-45', city: 'Bogotá D.C.', type: 'residential', totalUnits: 200, blocks: 5,
    parkingSpots: 150, storageUnits: 60, occupancyRate: 88, totalDebt: 32000000, alerts: 5, totalResidents: 8,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    towers: [
      { id: 'T4', name: 'Torre Norte', floors: 20, unitsPerFloor: 4 },
      { id: 'T5', name: 'Torre Sur', floors: 20, unitsPerFloor: 4 },
      { id: 'T6', name: 'Torre Este', floors: 15, unitsPerFloor: 4 },
      { id: 'T7', name: 'Torre Oeste', floors: 15, unitsPerFloor: 4 },
      { id: 'T8', name: 'Torre Central', floors: 10, unitsPerFloor: 6 },
    ],
    commonAreas: [
      { id: 'CA8', name: 'Piscina Olímpica', type: 'pool', capacity: 60, reservable: true },
      { id: 'CA9', name: 'Spa & Gimnasio', type: 'gym', capacity: 40, reservable: false },
      { id: 'CA10', name: 'Salón de Eventos', type: 'lounge', capacity: 120, reservable: true },
    ],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 601 555 1111', foundedDate: '2018-06-15',
  },
  {
    id: 'CONDO3', name: 'Hacienda Santa María', nit: '900.345.678-9', address: 'Km 5 Vía Chía', city: 'Chía', type: 'residential', totalUnits: 85, blocks: 2,
    parkingSpots: 85, storageUnits: 30, occupancyRate: 95, totalDebt: 8200000, alerts: 1, totalResidents: 9,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
    towers: [
      { id: 'T9', name: 'Bloque Roble', floors: 6, unitsPerFloor: 6 },
      { id: 'T10', name: 'Bloque Cedro', floors: 6, unitsPerFloor: 8 },
    ],
    commonAreas: [
      { id: 'CA11', name: 'Zona Húmeda', type: 'pool', capacity: 30, reservable: true },
      { id: 'CA12', name: 'Parque Central', type: 'garden', capacity: 100, reservable: false },
    ],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 601 555 2222', foundedDate: '2012-01-10',
  },
  {
    id: 'CONDO4', name: 'Bosques de Arrayán', nit: '900.456.789-0', address: 'Cra 15 #180-22', city: 'Bogotá D.C.', type: 'residential', totalUnits: 150, blocks: 4,
    parkingSpots: 120, storageUnits: 50, occupancyRate: 90, totalDebt: 22000000, alerts: 4, totalResidents: 7,
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=400&h=300&fit=crop',
    towers: [{ id: 'T11', name: 'Torre 1', floors: 15, unitsPerFloor: 4 }, { id: 'T12', name: 'Torre 2', floors: 15, unitsPerFloor: 4 }, { id: 'T13', name: 'Torre 3', floors: 12, unitsPerFloor: 4 }, { id: 'T14', name: 'Torre 4', floors: 10, unitsPerFloor: 3 }],
    commonAreas: [{ id: 'CA13', name: 'Piscina', type: 'pool', capacity: 50, reservable: true }, { id: 'CA14', name: 'Gimnasio', type: 'gym', capacity: 25, reservable: false }],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 601 555 3333', foundedDate: '2019-09-01',
  },
  {
    id: 'CONDO5', name: 'Centro Empresarial Platino', nit: '900.567.890-1', address: 'Calle 100 #8-49', city: 'Bogotá D.C.', type: 'commercial', totalUnits: 60, blocks: 1,
    parkingSpots: 200, storageUnits: 10, occupancyRate: 78, totalDebt: 45000000, alerts: 6, totalResidents: 6,
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=300&fit=crop',
    towers: [{ id: 'T15', name: 'Torre Platino', floors: 25, unitsPerFloor: 3 }],
    commonAreas: [{ id: 'CA15', name: 'Auditorio', type: 'lounge', capacity: 200, reservable: true }],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 601 555 4444', foundedDate: '2020-03-15',
  },
  {
    id: 'CONDO6', name: 'Villa del Sol', nit: '900.678.901-2', address: 'Cra 7 #45-12', city: 'Medellín', type: 'residential', totalUnits: 95, blocks: 3,
    parkingSpots: 70, storageUnits: 35, occupancyRate: 97, totalDebt: 5200000, alerts: 0, totalResidents: 7,
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=300&fit=crop',
    towers: [{ id: 'T16', name: 'Torre Girasol', floors: 10, unitsPerFloor: 4 }, { id: 'T17', name: 'Torre Margarita', floors: 10, unitsPerFloor: 4 }, { id: 'T18', name: 'Torre Orquídea', floors: 8, unitsPerFloor: 3 }],
    commonAreas: [{ id: 'CA16', name: 'Piscina', type: 'pool', capacity: 35, reservable: true }, { id: 'CA17', name: 'Zona BBQ', type: 'bbq', capacity: 25, reservable: true }],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 604 555 5555', foundedDate: '2016-07-20',
  },
  {
    id: 'CONDO7', name: 'Terrazas del Country', nit: '900.789.012-3', address: 'Calle 30 #50-80', city: 'Cali', type: 'mixed', totalUnits: 110, blocks: 3,
    parkingSpots: 90, storageUnits: 45, occupancyRate: 85, totalDebt: 28000000, alerts: 7, totalResidents: 6,
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400&h=300&fit=crop',
    towers: [{ id: 'T19', name: 'Torre A', floors: 12, unitsPerFloor: 4 }, { id: 'T20', name: 'Torre B', floors: 12, unitsPerFloor: 4 }, { id: 'T21', name: 'Local Comercial', floors: 2, unitsPerFloor: 5 }],
    commonAreas: [{ id: 'CA18', name: 'Club House', type: 'lounge', capacity: 100, reservable: true }],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 602 555 6666', foundedDate: '2017-11-05',
  },
  {
    id: 'CONDO8', name: 'Portal de la Sabana', nit: '900.890.123-4', address: 'Cra 9 #70-15', city: 'Bogotá D.C.', type: 'residential', totalUnits: 180, blocks: 6,
    parkingSpots: 140, storageUnits: 55, occupancyRate: 91, totalDebt: 19800000, alerts: 2, totalResidents: 7,
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=300&fit=crop',
    towers: [{ id: 'T22', name: 'Bloque 1', floors: 8, unitsPerFloor: 4 }, { id: 'T23', name: 'Bloque 2', floors: 8, unitsPerFloor: 4 }, { id: 'T24', name: 'Bloque 3', floors: 8, unitsPerFloor: 4 }, { id: 'T25', name: 'Bloque 4', floors: 8, unitsPerFloor: 4 }, { id: 'T26', name: 'Bloque 5', floors: 8, unitsPerFloor: 3 }, { id: 'T27', name: 'Bloque 6', floors: 8, unitsPerFloor: 3 }],
    commonAreas: [{ id: 'CA19', name: 'Piscina', type: 'pool', capacity: 50, reservable: true }, { id: 'CA20', name: 'Gimnasio', type: 'gym', capacity: 30, reservable: false }, { id: 'CA21', name: 'Cancha Múltiple', type: 'court', capacity: 20, reservable: true }],
    adminCompany: 'Administraciones Bunty S.A.S', adminContact: '+57 601 555 7777', foundedDate: '2014-05-12',
  },
];

// ========== MOCK DATA (first condo) ==========
const MOCK_CONDO_CONFIG = MOCK_CONDOS[0];

const MOCK_PROPERTIES: Property[] = [
  { id: 'P1', name: 'Torres del Parque', tower: 'Torre A', unit: '101', floor: 1, area: 85, use: 'residential', coefficient: 1.2, owner: 'Ana García', ownerId: 'R1', status: 'occupied', type: 'apartment', monthlyFee: 850000, block: 'Bloque 1', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P2', name: 'Torres del Parque', tower: 'Torre A', unit: '102', floor: 1, area: 72, use: 'residential', coefficient: 1.0, owner: 'Carlos Ruiz', ownerId: 'R2', status: 'occupied', type: 'apartment', monthlyFee: 720000, block: 'Bloque 1', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P3', name: 'Torres del Parque', tower: 'Torre A', unit: '201', floor: 2, area: 95, use: 'residential', coefficient: 1.4, owner: 'María Fernández', ownerId: 'R3', status: 'occupied', type: 'apartment', monthlyFee: 950000, block: 'Bloque 1', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P4', name: 'Torres del Parque', tower: 'Torre B', unit: '301', floor: 3, area: 110, use: 'residential', coefficient: 1.6, owner: 'Roberto Díaz', ownerId: 'R7', tenant: 'Sandra López', tenantId: 'R5', status: 'for_sale', type: 'apartment', monthlyFee: 1100000, block: 'Bloque 2', image: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P5', name: 'Torres del Parque', tower: 'Torre B', unit: '102', floor: 1, area: 68, use: 'residential', coefficient: 0.9, owner: 'Laura Sánchez', ownerId: 'R8', status: 'vacant', type: 'apartment', monthlyFee: 680000, block: 'Bloque 2', image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P6', name: 'Torres del Parque', tower: 'Torre A', unit: '203', floor: 2, area: 78, use: 'residential', coefficient: 1.1, owner: 'Diana Castillo', ownerId: 'R9', tenant: 'Luis Torres', tenantId: 'R4', status: 'occupied', type: 'apartment', monthlyFee: 780000, block: 'Bloque 1', image: 'https://images.unsplash.com/photo-1455849318169-c6c9727f51c7?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P7', name: 'Torres del Parque', tower: 'Torre C', unit: 'LC-01', floor: 1, area: 120, use: 'commercial', coefficient: 2.0, owner: 'Inversiones JM', ownerId: 'R6', status: 'occupied', type: 'commercial', monthlyFee: 2000000, block: 'Bloque 3', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P8', name: 'Torres del Parque', tower: 'Torre A', unit: 'P-15', floor: -1, area: 12, use: 'parking', coefficient: 0.3, owner: 'Ana García', ownerId: 'R1', status: 'occupied', type: 'parking', monthlyFee: 150000, block: 'Bloque 1', image: 'https://images.unsplash.com/photo-1578654377249-e339ec3b83d8?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P9', name: 'Torres del Parque', tower: 'Torre B', unit: '201', floor: 2, area: 88, use: 'residential', coefficient: 1.3, owner: 'Fernando Gómez', ownerId: 'R10', status: 'for_rent', type: 'apartment', monthlyFee: 880000, block: 'Bloque 2', image: 'https://images.unsplash.com/photo-1512314889357-e0ffe6e566cb?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P10', name: 'Torres del Parque', tower: 'Torre A', unit: '302', floor: 3, area: 92, use: 'residential', coefficient: 1.35, owner: 'Patricia Mora', ownerId: 'R11', tenant: 'Camilo Restrepo', tenantId: 'R12', status: 'occupied', type: 'apartment', monthlyFee: 920000, block: 'Bloque 1', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  // Admin's 3 additional properties
  { id: 'P11', name: 'Torres del Parque', tower: 'Torre B', unit: '302', floor: 3, area: 105, use: 'residential', coefficient: 1.5, owner: 'Gabriel Torres', ownerId: 'R13', status: 'occupied', type: 'apartment', monthlyFee: 1050000, block: 'Bloque 2', image: 'https://images.unsplash.com/photo-1530268729831-4ca59a4a8da0?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P12', name: 'Torres del Parque', tower: 'Torre C', unit: '101', floor: 1, area: 80, use: 'residential', coefficient: 1.1, owner: 'Alejandra Ruiz', ownerId: 'R14', status: 'vacant', type: 'apartment', monthlyFee: 800000, block: 'Bloque 3', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', condoId: 'CONDO1' },
  { id: 'P13', name: 'Torres del Parque', tower: 'Torre C', unit: '102', floor: 1, area: 75, use: 'residential', coefficient: 1.0, owner: 'Martín López', ownerId: 'R15', status: 'for_rent', type: 'apartment', monthlyFee: 750000, block: 'Bloque 3', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', condoId: 'CONDO1' },
];

const MOCK_RESIDENTS: Resident[] = [
  // CONDO1: Torres del Parque (12 residents)
  { id: 'R1', name: 'Ana García', email: 'ana@email.com', phone: '+57 310 555 1234', document: 'CC 52.345.678', unit: '101', type: 'owner', pets: [{ id: 'PET1', name: 'Luna', type: 'dog', breed: 'Golden Retriever', vaccinated: true }], vehicles: [{ id: 'V1', plate: 'ABC-123', brand: 'Mazda', model: 'CX-5 2023', color: 'Blanco', type: 'car', parkingSpot: 'P-15' }], since: '2020-03-15', status: 'active', emergencyContact: 'Jorge García', emergencyPhone: '+57 310 555 9999', block: 'Bloque 1', condoId: 'CONDO1' },
  { id: 'R2', name: 'Carlos Ruiz', email: 'carlos@email.com', phone: '+57 311 555 5678', document: 'CC 80.123.456', unit: '102', type: 'owner', pets: [], vehicles: [{ id: 'V2', plate: 'DEF-456', brand: 'Chevrolet', model: 'Tracker 2024', color: 'Gris', type: 'car', parkingSpot: 'P-22' }, { id: 'V3', plate: 'GHI-789', brand: 'BMW', model: 'R1250GS', color: 'Negro', type: 'motorcycle' }], since: '2019-06-01', status: 'active', block: 'Bloque 1', condoId: 'CONDO1' },
  { id: 'R3', name: 'María Fernández', email: 'maria@email.com', phone: '+57 312 555 9012', document: 'CC 39.876.543', unit: '201', type: 'owner', pets: [{ id: 'PET2', name: 'Michi', type: 'cat', breed: 'Persa', vaccinated: true }, { id: 'PET3', name: 'Toby', type: 'dog', breed: 'Poodle', vaccinated: true }], vehicles: [{ id: 'V4', plate: 'JKL-012', brand: 'Renault', model: 'Duster 2022', color: 'Rojo', type: 'car' }], since: '2021-01-10', status: 'active', block: 'Bloque 1', condoId: 'CONDO1' },
  { id: 'R4', name: 'Luis Torres', email: 'luis@email.com', phone: '+57 313 555 3456', document: 'CC 1.098.765.432', unit: '203', type: 'tenant', pets: [], vehicles: [], since: '2023-02-01', status: 'active', block: 'Bloque 1', condoId: 'CONDO1' },
  { id: 'R5', name: 'Sandra López', email: 'sandra@email.com', phone: '+57 314 555 7890', document: 'CC 52.111.222', unit: '301', type: 'tenant', pets: [{ id: 'PET4', name: 'Rocky', type: 'dog', breed: 'Bulldog Francés', vaccinated: false }], vehicles: [{ id: 'V5', plate: 'MNO-345', brand: 'Kia', model: 'Picanto 2021', color: 'Azul', type: 'car' }], since: '2022-08-15', status: 'active', block: 'Bloque 2', condoId: 'CONDO1' },
  { id: 'R6', name: 'Pedro Ramírez', email: 'pedro@email.com', phone: '+57 315 555 2345', document: 'NIT 900.555.666-1', unit: 'LC-01', type: 'owner', pets: [], vehicles: [{ id: 'V6', plate: 'PQR-678', brand: 'Toyota', model: 'Hilux 2024', color: 'Plateado', type: 'car' }], since: '2018-11-20', status: 'active', block: 'Bloque 3', condoId: 'CONDO1' },
  { id: 'R7', name: 'Roberto Díaz', email: 'roberto@email.com', phone: '+57 316 555 1111', document: 'CC 79.333.444', unit: '301', type: 'owner', pets: [], vehicles: [], since: '2017-05-10', status: 'active', block: 'Bloque 2', condoId: 'CONDO1' },
  { id: 'R8', name: 'Laura Sánchez', email: 'laura@email.com', phone: '+57 317 555 2222', document: 'CC 52.444.555', unit: '102-B', type: 'owner', pets: [], vehicles: [], since: '2020-09-01', status: 'active', block: 'Bloque 2', condoId: 'CONDO1' },
  { id: 'R9', name: 'Diana Castillo', email: 'diana@email.com', phone: '+57 318 555 3333', document: 'CC 39.555.666', unit: '203', type: 'owner', pets: [], vehicles: [], since: '2019-04-15', status: 'active', block: 'Bloque 1', condoId: 'CONDO1' },
  { id: 'R10', name: 'Fernando Gómez', email: 'fernando@email.com', phone: '+57 319 555 4444', document: 'CC 80.666.777', unit: '201-B', type: 'owner', pets: [{ id: 'PET5', name: 'Max', type: 'dog', breed: 'Labrador', vaccinated: true }], vehicles: [{ id: 'V7', plate: 'STU-901', brand: 'Hyundai', model: 'Tucson 2023', color: 'Negro', type: 'car' }], since: '2021-07-20', status: 'active', block: 'Bloque 2', condoId: 'CONDO1' },
  { id: 'R11', name: 'Camila Herrera', email: 'camila@email.com', phone: '+57 320 555 5555', document: 'CC 1.023.456.789', unit: '101', type: 'family', pets: [], vehicles: [], since: '2020-03-15', status: 'active', block: 'Bloque 1', condoId: 'CONDO1' },
  { id: 'R12', name: 'Gustavo Valencia', email: 'gustavo@email.com', phone: '+57 321 555 6666', document: 'CC 71.234.567', unit: '102', type: 'owner', pets: [{ id: 'PET6', name: 'Simba', type: 'dog', breed: 'Pastor Alemán', vaccinated: true }], vehicles: [], since: '2022-01-10', status: 'active', block: 'Bloque 1', condoId: 'CONDO1' },

  // CONDO2: Parque Central (8 residents)
  { id: 'R13', name: 'Juliana Moreno', email: 'juliana@email.com', phone: '+57 322 666 1111', document: 'CC 43.567.890', unit: '501', type: 'owner', pets: [], vehicles: [{ id: 'V8', plate: 'VWX-234', brand: 'Nissan', model: 'Sentra 2023', color: 'Plata', type: 'car' }], since: '2021-05-12', status: 'active', block: 'Bloque A', condoId: 'CONDO2' },
  { id: 'R14', name: 'Andrés Martínez', email: 'andres@email.com', phone: '+57 323 666 2222', document: 'CC 88.234.567', unit: '502', type: 'owner', pets: [{ id: 'PET7', name: 'Pelusa', type: 'cat', breed: 'Angora', vaccinated: true }], vehicles: [{ id: 'V9', plate: 'YZA-567', brand: 'Ford', model: 'Focus 2022', color: 'Rojo', type: 'car' }], since: '2020-08-20', status: 'active', block: 'Bloque A', condoId: 'CONDO2' },
  { id: 'R15', name: 'Patricia Soto', email: 'patricia@email.com', phone: '+57 324 666 3333', document: 'CC 56.789.234', unit: '503', type: 'tenant', pets: [], vehicles: [], since: '2023-09-01', status: 'active', block: 'Bloque A', condoId: 'CONDO2' },
  { id: 'R16', name: 'Marcelo González', email: 'marcelo@email.com', phone: '+57 325 666 4444', document: 'CC 77.456.789', unit: '601', type: 'owner', pets: [], vehicles: [{ id: 'V10', plate: 'BCD-890', brand: 'Chevrolet', model: 'Spark 2024', color: 'Blanco', type: 'car' }], since: '2019-12-01', status: 'active', block: 'Bloque B', condoId: 'CONDO2' },
  { id: 'R17', name: 'Verónica Bravo', email: 'veronica@email.com', phone: '+57 326 666 5555', document: 'CC 49.876.543', unit: '602', type: 'owner', pets: [{ id: 'PET8', name: 'Canela', type: 'dog', breed: 'Cocker Spaniel', vaccinated: true }], vehicles: [], since: '2021-03-15', status: 'active', block: 'Bloque B', condoId: 'CONDO2' },
  { id: 'R18', name: 'Sergio Campos', email: 'sergio@email.com', phone: '+57 327 666 6666', document: 'CC 92.345.678', unit: '603', type: 'tenant', pets: [{ id: 'PET9', name: 'Fluffy', type: 'cat', breed: 'Siamés', vaccinated: true }], vehicles: [{ id: 'V11', plate: 'EFG-123', brand: 'Toyota', model: 'Yaris 2023', color: 'Azul', type: 'car' }], since: '2022-11-05', status: 'active', block: 'Bloque B', condoId: 'CONDO2' },
  { id: 'R19', name: 'Claudia Mendoza', email: 'claudia@email.com', phone: '+57 328 666 7777', document: 'CC 34.567.890', unit: '701', type: 'owner', pets: [], vehicles: [], since: '2020-06-10', status: 'active', block: 'Bloque C', condoId: 'CONDO2' },
  { id: 'R20', name: 'Esteban Romero', email: 'esteban@email.com', phone: '+57 329 666 8888', document: 'CC 61.234.567', unit: '702', type: 'owner', pets: [{ id: 'PET10', name: 'Rex', type: 'dog', breed: 'Boxer', vaccinated: false }], vehicles: [{ id: 'V12', plate: 'HIJ-456', brand: 'Hyundai', model: 'Elantra 2022', color: 'Negro', type: 'car' }], since: '2021-09-20', status: 'inactive', block: 'Bloque C', condoId: 'CONDO2' },

  // CONDO3: Residencias Altos de la Flora (9 residents)
  { id: 'R21', name: 'Alejandra Peña', email: 'alejandra@email.com', phone: '+57 330 777 1111', document: 'CC 55.456.789', unit: '1001', type: 'owner', pets: [], vehicles: [{ id: 'V13', plate: 'KLM-789', brand: 'Susuki', model: 'Swift 2023', color: 'Verde', type: 'car' }], since: '2022-02-14', status: 'active', block: 'Bloque I', condoId: 'CONDO3' },
  { id: 'R22', name: 'Fabián Salazar', email: 'fabian@email.com', phone: '+57 331 777 2222', document: 'CC 68.456.789', unit: '1002', type: 'owner', pets: [{ id: 'PET11', name: 'Brusco', type: 'dog', breed: 'Doberman', vaccinated: true }], vehicles: [{ id: 'V14', plate: 'NOP-012', brand: 'Volkswagen', model: 'Golf 2024', color: 'Gris', type: 'car' }], since: '2020-10-05', status: 'active', block: 'Bloque I', condoId: 'CONDO3' },
  { id: 'R23', name: 'Isabela Ruiz', email: 'isabela@email.com', phone: '+57 332 777 3333', document: 'CC 29.567.890', unit: '1101', type: 'tenant', pets: [], vehicles: [], since: '2023-04-01', status: 'active', block: 'Bloque I', condoId: 'CONDO3' },
  { id: 'R24', name: 'Héctor Jaramillo', email: 'hector@email.com', phone: '+57 333 777 4444', document: 'CC 73.567.890', unit: '1102', type: 'owner', pets: [], vehicles: [{ id: 'V15', plate: 'QRS-345', brand: 'BMW', model: 'X3 2023', color: 'Blanco', type: 'car' }], since: '2021-07-22', status: 'active', block: 'Bloque I', condoId: 'CONDO3' },
  { id: 'R25', name: 'Roxana Cabrera', email: 'roxana@email.com', phone: '+57 334 777 5555', document: 'CC 46.789.012', unit: '1201', type: 'owner', pets: [{ id: 'PET12', name: 'Princesa', type: 'dog', breed: 'Shih Tzu', vaccinated: true }], vehicles: [], since: '2019-01-30', status: 'active', block: 'Bloque J', condoId: 'CONDO3' },
  { id: 'R26', name: 'Damián López', email: 'damian@email.com', phone: '+57 335 777 6666', document: 'CC 87.678.901', unit: '1202', type: 'tenant', pets: [{ id: 'PET13', name: 'Whiskers', type: 'cat', breed: 'Gato Común', vaccinated: false }], vehicles: [{ id: 'V16', plate: 'TUV-678', brand: 'Mazda', model: 'CX-3 2022', color: 'Rojo', type: 'car' }], since: '2022-08-12', status: 'active', block: 'Bloque J', condoId: 'CONDO3' },
  { id: 'R27', name: 'Catalina Vega', email: 'catalina@email.com', phone: '+57 336 777 7777', document: 'CC 35.789.012', unit: '1203', type: 'owner', pets: [], vehicles: [], since: '2021-04-18', status: 'active', block: 'Bloque J', condoId: 'CONDO3' },
  { id: 'R28', name: 'Nicolás Acosta', email: 'nicolas@email.com', phone: '+57 337 777 8888', document: 'CC 66.890.123', unit: '1301', type: 'owner', pets: [{ id: 'PET14', name: 'Dexter', type: 'dog', breed: 'Husky', vaccinated: true }], vehicles: [{ id: 'V17', plate: 'WXY-901', brand: 'Audi', model: 'A4 2024', color: 'Negro', type: 'car' }], since: '2020-05-25', status: 'active', block: 'Bloque K', condoId: 'CONDO3' },
  { id: 'R29', name: 'Fernanda Silva', email: 'fernanda@email.com', phone: '+57 338 777 9999', document: 'CC 52.001.234', unit: '1302', type: 'family', pets: [], vehicles: [], since: '2022-09-10', status: 'active', block: 'Bloque K', condoId: 'CONDO3' },

  // CONDO4: Garden Hills (7 residents)
  { id: 'R30', name: 'Javier Montero', email: 'javier@email.com', phone: '+57 339 888 1111', document: 'CC 71.012.345', unit: '2001', type: 'owner', pets: [], vehicles: [{ id: 'V18', plate: 'ZAB-234', brand: 'Honda', model: 'Civic 2023', color: 'Plata', type: 'car' }], since: '2021-12-03', status: 'active', block: 'Sector 1', condoId: 'CONDO4' },
  { id: 'R31', name: 'Adriana Flores', email: 'adriana@email.com', phone: '+57 340 888 2222', document: 'CC 48.012.345', unit: '2002', type: 'owner', pets: [{ id: 'PET15', name: 'Spot', type: 'dog', breed: 'Dálmata', vaccinated: true }], vehicles: [], since: '2020-03-09', status: 'active', block: 'Sector 1', condoId: 'CONDO4' },
  { id: 'R32', name: 'Rodrigo Castro', email: 'rodrigo@email.com', phone: '+57 341 888 3333', document: 'CC 84.123.456', unit: '2101', type: 'tenant', pets: [], vehicles: [{ id: 'V19', plate: 'CDE-567', brand: 'Kia', model: 'Sportage 2024', color: 'Azul', type: 'car' }], since: '2023-06-15', status: 'active', block: 'Sector 2', condoId: 'CONDO4' },
  { id: 'R33', name: 'Mónica Guerrero', email: 'monica@email.com', phone: '+57 342 888 4444', document: 'CC 37.234.567', unit: '2102', type: 'owner', pets: [{ id: 'PET16', name: 'Tigre', type: 'cat', breed: 'Gato Bengal', vaccinated: true }], vehicles: [{ id: 'V20', plate: 'FGH-890', brand: 'Jeep', model: 'Renegade 2023', color: 'Verde', type: 'car' }], since: '2019-11-16', status: 'active', block: 'Sector 2', condoId: 'CONDO4' },
  { id: 'R34', name: 'Felipe Rojas', email: 'felipe@email.com', phone: '+57 343 888 5555', document: 'CC 59.345.678', unit: '2103', type: 'owner', pets: [], vehicles: [], since: '2021-08-22', status: 'active', block: 'Sector 2', condoId: 'CONDO4' },
  { id: 'R35', name: 'Luciana Pereira', email: 'luciana@email.com', phone: '+57 344 888 6666', document: 'CC 62.456.789', unit: '2201', type: 'owner', pets: [{ id: 'PET17', name: 'Bella', type: 'dog', breed: 'Golden Doodle', vaccinated: true }], vehicles: [{ id: 'V21', plate: 'IJK-123', brand: 'Lexus', model: 'NX 2023', color: 'Gris', type: 'car' }], since: '2020-09-11', status: 'active', block: 'Sector 3', condoId: 'CONDO4' },
  { id: 'R36', name: 'Camilo Reyes', email: 'camilo@email.com', phone: '+57 345 888 7777', document: 'CC 91.567.890', unit: '2202', type: 'owner', pets: [], vehicles: [], since: '2022-02-28', status: 'inactive', block: 'Sector 3', condoId: 'CONDO4' },

  // CONDO5: Elite Downtown (6 residents)
  { id: 'R37', name: 'Valentina Torres', email: 'valentina@email.com', phone: '+57 346 999 1111', document: 'CC 44.678.901', unit: '3001', type: 'owner', pets: [], vehicles: [{ id: 'V22', plate: 'LMN-456', brand: 'Mercedes', model: 'C-Class 2024', color: 'Negro', type: 'car' }], since: '2020-01-17', status: 'active', block: 'Downtown', condoId: 'CONDO5' },
  { id: 'R38', name: 'Osvaldo Núñez', email: 'osvaldo@email.com', phone: '+57 347 999 2222', document: 'CC 75.789.012', unit: '3002', type: 'tenant', pets: [{ id: 'PET18', name: 'Félix', type: 'cat', breed: 'Tabby', vaccinated: true }], vehicles: [], since: '2023-01-10', status: 'active', block: 'Downtown', condoId: 'CONDO5' },
  { id: 'R39', name: 'Leticia Domínguez', email: 'leticia@email.com', phone: '+57 348 999 3333', document: 'CC 58.890.123', unit: '3101', type: 'owner', pets: [{ id: 'PET19', name: 'Napoleon', type: 'dog', breed: 'Schnauzer', vaccinated: true }], vehicles: [{ id: 'V23', plate: 'OPQ-789', brand: 'BMW', model: 'M440i 2023', color: 'Blanco', type: 'car' }], since: '2019-07-24', status: 'active', block: 'Downtown', condoId: 'CONDO5' },
  { id: 'R40', name: 'Álvaro Castells', email: 'alvaro@email.com', phone: '+57 349 999 4444', document: 'CC 81.901.234', unit: '3102', type: 'owner', pets: [], vehicles: [{ id: 'V24', plate: 'RST-012', brand: 'Porsche', model: '911 2024', color: 'Rojo', type: 'car' }], since: '2021-04-11', status: 'active', block: 'Downtown', condoId: 'CONDO5' },
  { id: 'R41', name: 'Graciela Mejía', email: 'graciela@email.com', phone: '+57 350 999 5555', document: 'CC 26.012.345', unit: '3201', type: 'owner', pets: [{ id: 'PET20', name: 'Simón', type: 'dog', breed: 'Pug', vaccinated: false }], vehicles: [], since: '2020-12-01', status: 'active', block: 'Downtown', condoId: 'CONDO5' },
  { id: 'R42', name: 'Raúl Espinoza', email: 'raul@email.com', phone: '+57 351 999 6666', document: 'CC 73.123.456', unit: '3202', type: 'owner', pets: [], vehicles: [{ id: 'V25', plate: 'UVW-345', brand: 'Tesla', model: 'Model S 2024', color: 'Plateado', type: 'car' }], since: '2022-05-19', status: 'active', block: 'Downtown', condoId: 'CONDO5' },

  // CONDO6: Valle Verde (7 residents)
  { id: 'R43', name: 'Beatriz Zamora', email: 'beatriz@email.com', phone: '+57 352 100 1111', document: 'CC 63.234.567', unit: '4001', type: 'owner', pets: [], vehicles: [{ id: 'V26', plate: 'XYZ-678', brand: 'Volkswagen', model: 'Passat 2023', color: 'Gris', type: 'car' }], since: '2021-06-08', status: 'active', block: 'Norte', condoId: 'CONDO6' },
  { id: 'R44', name: 'Tiberio González', email: 'tiberio@email.com', phone: '+57 353 100 2222', document: 'CC 89.345.678', unit: '4002', type: 'owner', pets: [{ id: 'PET21', name: 'Perla', type: 'dog', breed: 'Pastora Alemana', vaccinated: true }], vehicles: [], since: '2020-02-14', status: 'active', block: 'Norte', condoId: 'CONDO6' },
  { id: 'R45', name: 'Soledad Barrera', email: 'soledad@email.com', phone: '+57 354 100 3333', document: 'CC 41.456.789', unit: '4101', type: 'tenant', pets: [], vehicles: [{ id: 'V27', plate: 'ABC-901', brand: 'Renault', model: 'Megane 2023', color: 'Azul', type: 'car' }], since: '2023-03-05', status: 'active', block: 'Centro', condoId: 'CONDO6' },
  { id: 'R46', name: 'Emilio Corrales', email: 'emilio@email.com', phone: '+57 355 100 4444', document: 'CC 72.567.890', unit: '4102', type: 'owner', pets: [{ id: 'PET22', name: 'Trufa', type: 'cat', breed: 'Ragdoll', vaccinated: true }], vehicles: [{ id: 'V28', plate: 'DEF-234', brand: 'Peugeot', model: '3008 2024', color: 'Negro', type: 'car' }], since: '2019-09-26', status: 'active', block: 'Centro', condoId: 'CONDO6' },
  { id: 'R47', name: 'Elisa Mendes', email: 'elisa@email.com', phone: '+57 356 100 5555', document: 'CC 45.678.901', unit: '4201', type: 'owner', pets: [], vehicles: [], since: '2021-10-12', status: 'active', block: 'Sur', condoId: 'CONDO6' },
  { id: 'R48', name: 'Claudio Henríquez', email: 'claudio@email.com', phone: '+57 357 100 6666', document: 'CC 64.789.012', unit: '4202', type: 'owner', pets: [{ id: 'PET23', name: 'Atena', type: 'dog', breed: 'Akita', vaccinated: true }], vehicles: [{ id: 'V29', plate: 'GHI-567', brand: 'Citroën', model: 'C3 2023', color: 'Rojo', type: 'car' }], since: '2020-07-20', status: 'active', block: 'Sur', condoId: 'CONDO6' },
  { id: 'R49', name: 'Milagros Rodríguez', email: 'milagros@email.com', phone: '+57 358 100 7777', document: 'CC 57.890.123', unit: '4203', type: 'tenant', pets: [], vehicles: [], since: '2022-12-01', status: 'inactive', block: 'Sur', condoId: 'CONDO6' },

  // CONDO7: Marina Bay Towers (6 residents)
  { id: 'R50', name: 'Saúl Ornelas', email: 'saul@email.com', phone: '+57 359 200 1111', document: 'CC 74.901.234', unit: '5001', type: 'owner', pets: [], vehicles: [{ id: 'V30', plate: 'JKL-890', brand: 'Chevrolet', model: 'Malibu 2024', color: 'Plata', type: 'car' }], since: '2021-02-18', status: 'active', block: 'Marina', condoId: 'CONDO7' },
  { id: 'R51', name: 'Delfina Vargas', email: 'delfina@email.com', phone: '+57 360 200 2222', document: 'CC 33.012.345', unit: '5002', type: 'owner', pets: [{ id: 'PET24', name: 'Océano', type: 'dog', breed: 'Labrador Negro', vaccinated: true }], vehicles: [], since: '2020-04-22', status: 'active', block: 'Marina', condoId: 'CONDO7' },
  { id: 'R52', name: 'Quincy Palma', email: 'quincy@email.com', phone: '+57 361 200 3333', document: 'CC 69.123.456', unit: '5101', type: 'tenant', pets: [], vehicles: [{ id: 'V31', plate: 'MNO-123', brand: 'Nissan', model: 'Altima 2023', color: 'Gris', type: 'car' }], since: '2023-05-10', status: 'active', block: 'Bay', condoId: 'CONDO7' },
  { id: 'R53', name: 'Óscar Lira', email: 'oscar@email.com', phone: '+57 362 200 4444', document: 'CC 85.234.567', unit: '5102', type: 'owner', pets: [{ id: 'PET25', name: 'Marina', type: 'cat', breed: 'Sphynx', vaccinated: true }], vehicles: [{ id: 'V32', plate: 'PQR-456', brand: 'Subaru', model: 'Outback 2024', color: 'Azul', type: 'car' }], since: '2019-08-30', status: 'active', block: 'Bay', condoId: 'CONDO7' },
  { id: 'R54', name: 'Norma Ugarte', email: 'norma@email.com', phone: '+57 363 200 5555', document: 'CC 52.345.678', unit: '5201', type: 'owner', pets: [], vehicles: [], since: '2021-11-14', status: 'active', block: 'Towers', condoId: 'CONDO7' },
  { id: 'R55', name: 'Plutarco Méndez', email: 'plutarco@email.com', phone: '+57 364 200 6666', document: 'CC 79.456.789', unit: '5202', type: 'owner', pets: [{ id: 'PET26', name: 'Neptuno', type: 'dog', breed: 'Samoyedo', vaccinated: false }], vehicles: [{ id: 'V33', plate: 'STU-789', brand: 'Volvo', model: 'XC90 2023', color: 'Negro', type: 'car' }], since: '2020-06-03', status: 'active', block: 'Towers', condoId: 'CONDO7' },

  // CONDO8: Skyline Towers (7 residents)
  { id: 'R56', name: 'Nora Bustamante', email: 'nora@email.com', phone: '+57 365 300 1111', document: 'CC 40.567.890', unit: '6001', type: 'owner', pets: [], vehicles: [{ id: 'V34', plate: 'VWX-012', brand: 'Fiat', model: '500X 2024', color: 'Rojo', type: 'car' }], since: '2021-09-20', status: 'active', block: 'Penthouse', condoId: 'CONDO8' },
  { id: 'R57', name: 'Maximiliano Soria', email: 'maxi@email.com', phone: '+57 366 300 2222', document: 'CC 83.678.901', unit: '6002', type: 'owner', pets: [{ id: 'PET27', name: 'Cosmos', type: 'dog', breed: 'Dalmata', vaccinated: true }], vehicles: [], since: '2020-05-07', status: 'active', block: 'Penthouse', condoId: 'CONDO8' },
  { id: 'R58', name: 'Lilia Palet', email: 'lilia@email.com', phone: '+57 367 300 3333', document: 'CC 65.789.012', unit: '6101', type: 'tenant', pets: [], vehicles: [{ id: 'V35', plate: 'YZA-345', brand: 'Opel', model: 'Astra 2023', color: 'Blanco', type: 'car' }], since: '2023-02-14', status: 'active', block: 'Sky', condoId: 'CONDO8' },
  { id: 'R59', name: 'Klaudio Roa', email: 'klaudio@email.com', phone: '+57 368 300 4444', document: 'CC 77.890.123', unit: '6102', type: 'owner', pets: [{ id: 'PET28', name: 'Star', type: 'cat', breed: 'Maine Coon', vaccinated: true }], vehicles: [{ id: 'V36', plate: 'BCD-678', brand: 'MG', model: 'ZS EV 2024', color: 'Gris', type: 'car' }], since: '2019-10-11', status: 'active', block: 'Sky', condoId: 'CONDO8' },
  { id: 'R60', name: 'Jana Salinas', email: 'jana@email.com', phone: '+57 369 300 5555', document: 'CC 38.901.234', unit: '6201', type: 'owner', pets: [], vehicles: [], since: '2021-01-25', status: 'active', block: 'Line', condoId: 'CONDO8' },
  { id: 'R61', name: 'Leocadio Blanca', email: 'leocadio@email.com', phone: '+57 370 300 6666', document: 'CC 50.012.345', unit: '6202', type: 'owner', pets: [{ id: 'PET29', name: 'Nimbus', type: 'dog', breed: 'Pointer Inglés', vaccinated: true }], vehicles: [{ id: 'V37', plate: 'EFG-901', brand: 'Li Auto', model: 'ONE 2024', color: 'Negro', type: 'car' }], since: '2020-08-17', status: 'active', block: 'Line', condoId: 'CONDO8' },
  { id: 'R62', name: 'Melitina Aguilar', email: 'melitina@email.com', phone: '+57 371 300 7777', document: 'CC 61.123.456', unit: '6203', type: 'tenant', pets: [], vehicles: [], since: '2022-10-03', status: 'inactive', block: 'Line', condoId: 'CONDO8' },
];

const MOCK_OCCUPANCY_HISTORY: OccupancyRecord[] = [
  { id: 'OH1', unit: '301', residentName: 'Juan Méndez', type: 'tenant', startDate: '2019-01-15', endDate: '2022-07-31', active: false },
  { id: 'OH2', unit: '301', residentName: 'Sandra López', type: 'tenant', startDate: '2022-08-15', endDate: undefined, active: true },
  { id: 'OH3', unit: '203', residentName: 'Camila Herrera', type: 'tenant', startDate: '2020-03-01', endDate: '2022-12-31', active: false },
  { id: 'OH4', unit: '203', residentName: 'Luis Torres', type: 'tenant', startDate: '2023-02-01', endDate: undefined, active: true },
  { id: 'OH5', unit: '102', residentName: 'Andrés Parra', type: 'owner', startDate: '2015-03-20', endDate: '2019-06-01', active: false },
];

const MOCK_DIRECT_MESSAGES: DirectMessage[] = [
  { id: 'DM1', from: 'Administración', to: 'Ana García', content: 'Buenos días Ana, le confirmamos que su solicitud de parqueadero adicional está siendo procesada.', date: '2026-02-08 09:30', read: true },
  { id: 'DM2', from: 'Ana García', to: 'Administración', content: 'Muchas gracias por la confirmación. ¿Cuánto tiempo tomará el proceso?', date: '2026-02-08 10:15', read: true },
  { id: 'DM3', from: 'Administración', to: 'Ana García', content: 'Estimamos entre 5 a 7 días hábiles para la asignación.', date: '2026-02-08 10:45', read: false },
  { id: 'DM4', from: 'Carlos Ruiz', to: 'Administración', content: 'Buenas tardes, quisiera reportar una fuga de agua en el parqueadero, cerca del puesto P-22.', date: '2026-02-07 15:20', read: true },
  { id: 'DM5', from: 'Administración', to: 'Carlos Ruiz', content: 'Gracias por el reporte Carlos. Ya enviamos al equipo de mantenimiento a verificar.', date: '2026-02-07 16:00', read: true },
];

const MOCK_COMMUNICATIONS: Communication[] = [
  { id: 'C1', title: 'Asamblea General Extraordinaria', content: 'Se convoca a todos los propietarios a la asamblea extraordinaria que se realizará el próximo 15 de marzo a las 7:00 PM en el salón comunal. Temas a tratar: presupuesto 2026, elección de nuevos miembros del consejo y aprobación de obras en fachada.', category: 'official', channel: 'all', audience: 'owners', author: 'Administración', authorRole: 'admin', date: '2026-02-05', comments: 12, commentList: [{ id: 'CMT1', author: 'Ana García', content: '¿Se puede asistir virtualmente?', date: '2026-02-05 18:30' }, { id: 'CMT2', author: 'Administración', content: 'Sí, enviaremos el link por email.', date: '2026-02-05 19:00' }], pinned: true, archived: false, moderated: true },
  { id: 'C2', title: 'Mantenimiento Preventivo Ascensores', content: 'Se informa que el día 10 de marzo se realizará mantenimiento preventivo a todos los ascensores del conjunto. El servicio estará fuera de operación de 8:00 AM a 2:00 PM. Disculpe las molestias.', category: 'official', channel: 'push', audience: 'all', author: 'Administración', authorRole: 'admin', date: '2026-02-03', comments: 5, pinned: false, archived: false, moderated: true },
  { id: 'C3', title: 'Informe Financiero Q4 2025', content: 'El consejo de administración presenta el informe financiero del último trimestre. Los ingresos superaron las proyecciones en un 8% y la morosidad disminuyó al 15%. Se adjunta informe detallado.', category: 'strategic', channel: 'email', audience: 'council', author: 'Consejo de Administración', authorRole: 'consejo', date: '2026-01-28', comments: 8, pinned: true, archived: false, moderated: true },
  { id: 'C4', title: 'Nuevo Horario de Piscina', content: 'A partir del 1 de marzo, el horario de la piscina será de 6:00 AM a 9:00 PM. Se recuerda que es obligatorio el uso de gorro y ducha previa. Niños menores de 10 años deben estar acompañados por un adulto.', category: 'general', channel: 'in_app', audience: 'all', author: 'Administración', authorRole: 'admin', date: '2026-02-01', comments: 15, pinned: false, archived: false, moderated: true },
  { id: 'C5', title: 'Corte de Agua Programado', content: 'La empresa de acueducto ha programado un corte de agua para el jueves 8 de marzo de 6:00 AM a 12:00 PM. Se recomienda almacenar agua con anticipación.', category: 'emergency', channel: 'all', audience: 'all', author: 'Administración', authorRole: 'admin', date: '2026-02-06', comments: 20, pinned: true, archived: false, moderated: true },
  { id: 'C6', title: 'Jornada de Vacunación Mascotas', content: 'Este sábado 12 de marzo se realizará jornada gratuita de vacunación para mascotas en el parque infantil de 9:00 AM a 1:00 PM. Traer carné de vacunación.', category: 'general', channel: 'push', audience: 'all', author: 'Comité de Convivencia', authorRole: 'consejo', date: '2026-02-07', comments: 8, pinned: false, archived: false, moderated: true, aiGenerated: true },
  { id: 'C7', title: 'Actualización Reglamento de Parqueaderos', content: 'Se informa que el nuevo reglamento de parqueaderos entra en vigencia el 1 de abril. Los principales cambios incluyen la prohibición de almacenar objetos y la asignación de puestos rotativos para visitantes.', category: 'official', channel: 'email', audience: 'owners', author: 'Administración', authorRole: 'admin', date: '2026-02-04', comments: 22, pinned: false, archived: true, moderated: true },
];

const MOCK_FEE_CONFIGS: FeeConfig[] = [
  { id: 'FC1', name: 'Cuota Ordinaria de Administración', type: 'ordinary', amount: 0, frequency: 'monthly', description: 'Cuota mensual calculada según coeficiente de propiedad', active: true, dueDay: 15, interestRate: 2.0 },
  { id: 'FC2', name: 'Cuota Extraordinaria – Fachada', type: 'extraordinary', amount: 150000, frequency: 'quarterly', description: 'Cuota para financiación de pintura de fachada aprobada en asamblea', active: true, dueDay: 30, interestRate: 1.5 },
  { id: 'FC3', name: 'Fondo de Imprevistos', type: 'special_fund', amount: 30000, frequency: 'monthly', description: 'Fondo obligatorio para atender emergencias del conjunto', active: true, dueDay: 15, interestRate: 0 },
  { id: 'FC4', name: 'Cuota Extraordinaria – Ascensores', type: 'extraordinary', amount: 250000, frequency: 'one_time', description: 'Cuota única para modernización de ascensores Torre A', active: false, dueDay: 30, interestRate: 2.0 },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'PAY1', unit: '101', owner: 'Ana García', concept: 'Cuota Admon Feb 2026', feeType: 'ordinary', amount: 250000, interest: 0, balance: 0, dueDate: '2026-02-15', paidDate: '2026-02-10', status: 'paid', paymentMethod: 'pse', receiptNumber: 'REC-2026-0045' },
  { id: 'PAY2', unit: '101', owner: 'Ana García', concept: 'Cuota Admon Mar 2026', feeType: 'ordinary', amount: 250000, interest: 0, balance: 250000, dueDate: '2026-03-15', status: 'pending' },
  { id: 'PAY3', unit: '102', owner: 'Carlos Ruiz', concept: 'Cuota Admon Feb 2026', feeType: 'ordinary', amount: 220000, interest: 8800, balance: 228800, dueDate: '2026-02-15', status: 'overdue' },
  { id: 'PAY4', unit: '201', owner: 'María Fernández', concept: 'Cuota Admon Feb 2026', feeType: 'ordinary', amount: 280000, interest: 0, balance: 0, dueDate: '2026-02-15', paidDate: '2026-02-14', status: 'paid', paymentMethod: 'transfer', receiptNumber: 'REC-2026-0052' },
  { id: 'PAY5', unit: '203', owner: 'Luis Torres', concept: 'Cuota Admon Ene 2026', feeType: 'ordinary', amount: 240000, interest: 14400, balance: 254400, dueDate: '2026-01-15', status: 'overdue' },
  { id: 'PAY6', unit: '203', owner: 'Luis Torres', concept: 'Cuota Admon Feb 2026', feeType: 'ordinary', amount: 240000, interest: 4800, balance: 244800, dueDate: '2026-02-15', status: 'overdue' },
  { id: 'PAY7', unit: '301', owner: 'Roberto Díaz', concept: 'Cuota Admon Feb 2026', feeType: 'ordinary', amount: 320000, interest: 0, balance: 320000, dueDate: '2026-02-15', status: 'agreement' },
  { id: 'PAY8', unit: 'LC-01', owner: 'Pedro Ramírez', concept: 'Cuota Admon Feb 2026', feeType: 'ordinary', amount: 580000, interest: 0, balance: 0, dueDate: '2026-02-15', paidDate: '2026-02-05', status: 'paid', paymentMethod: 'online', receiptNumber: 'REC-2026-0038' },
  { id: 'PAY9', unit: '101', owner: 'Ana García', concept: 'Fondo Imprevistos Feb', feeType: 'special_fund', amount: 30000, interest: 0, balance: 0, dueDate: '2026-02-15', paidDate: '2026-02-10', status: 'paid', paymentMethod: 'pse' },
  { id: 'PAY10', unit: '102', owner: 'Carlos Ruiz', concept: 'Cuota Ext. Fachada Q1', feeType: 'extraordinary', amount: 150000, interest: 0, balance: 150000, dueDate: '2026-03-31', status: 'pending' },
  { id: 'PAY11', unit: '201', owner: 'María Fernández', concept: 'Fondo Imprevistos Feb', feeType: 'special_fund', amount: 30000, interest: 0, balance: 0, dueDate: '2026-02-15', paidDate: '2026-02-14', status: 'paid', paymentMethod: 'transfer' },
  { id: 'PAY12', unit: '301', owner: 'Roberto Díaz', concept: 'Cuota Ext. Fachada Q1', feeType: 'extraordinary', amount: 150000, interest: 6000, balance: 156000, dueDate: '2026-01-31', status: 'overdue' },
];

const MOCK_COLLECTION_ACTIONS: CollectionAction[] = [
  { id: 'COL1', unit: '102', owner: 'Carlos Ruiz', type: 'reminder', date: '2026-02-16', description: 'Recordatorio automático de pago vencido enviado por email y push.', aiGenerated: true },
  { id: 'COL2', unit: '203', owner: 'Luis Torres', type: 'letter', date: '2026-02-01', description: 'Carta de cobro generada por IA: se notifica saldo pendiente de 2 cuotas vencidas por valor de $1.622.400 incluyendo intereses.', aiGenerated: true },
  { id: 'COL3', unit: '301', owner: 'Roberto Díaz', type: 'agreement', date: '2026-02-10', description: 'Acuerdo de pago firmado: 3 cuotas mensuales de $540.000 iniciando marzo 2026.', aiGenerated: false },
  { id: 'COL4', unit: '203', owner: 'Luis Torres', type: 'reminder', date: '2026-02-18', description: 'Segundo recordatorio automático. Se sugiere plan de pago en 2 cuotas.', aiGenerated: true },
  { id: 'COL5', unit: '301', owner: 'Roberto Díaz', type: 'reminder', date: '2026-01-20', description: 'Recordatorio previo al vencimiento de cuota extraordinaria fachada.', aiGenerated: true },
];

const MOCK_ACCOUNTING: AccountingEntry[] = [
  { id: 'A1', date: '2026-02-01', concept: 'Recaudo cuotas administración', category: 'income', amount: 15200000, account: 'Cuotas Ordinarias' },
  { id: 'A2', date: '2026-02-03', concept: 'Pago nómina personal', category: 'expense', amount: 4500000, account: 'Gastos de Personal' },
  { id: 'A3', date: '2026-02-05', concept: 'Servicio de vigilancia', category: 'expense', amount: 3200000, account: 'Seguridad' },
  { id: 'A4', date: '2026-02-05', concept: 'Cuota extraordinaria parqueadero', category: 'income', amount: 2800000, account: 'Cuotas Extraordinarias' },
  { id: 'A5', date: '2026-02-07', concept: 'Servicios públicos', category: 'expense', amount: 2100000, account: 'Servicios' },
  { id: 'A6', date: '2026-02-08', concept: 'Mantenimiento ascensores', category: 'expense', amount: 1800000, account: 'Mantenimiento' },
  { id: 'A7', date: '2026-02-10', concept: 'Arriendo local comercial', category: 'income', amount: 3500000, account: 'Otros Ingresos' },
  { id: 'A8', date: '2026-02-12', concept: 'Insumos de aseo', category: 'expense', amount: 450000, account: 'Gastos Generales' },
];

const MOCK_RESERVATIONS: Reservation[] = [
  { id: 'RES1', area: 'Salón Comunal', resident: 'Ana García', unit: '101', date: '2026-02-15', timeSlot: '14:00 - 18:00', status: 'confirmed' },
  { id: 'RES2', area: 'BBQ Zone', resident: 'Carlos Ruiz', unit: '102', date: '2026-02-16', timeSlot: '10:00 - 14:00', status: 'pending' },
  { id: 'RES3', area: 'Cancha de Tenis', resident: 'María Fernández', unit: '201', date: '2026-02-14', timeSlot: '07:00 - 09:00', status: 'confirmed' },
  { id: 'RES4', area: 'Salón Comunal', resident: 'Luis Torres', unit: '203', date: '2026-02-20', timeSlot: '18:00 - 22:00', status: 'rejected' },
  { id: 'RES5', area: 'Piscina (Evento)', resident: 'Sandra López', unit: '301', date: '2026-02-22', timeSlot: '10:00 - 16:00', status: 'pending' },
  { id: 'RES6', area: 'Gimnasio (Clase)', resident: 'Pedro Ramírez', unit: 'LC-01', date: '2026-02-18', timeSlot: '06:00 - 07:00', status: 'confirmed' },
];

const MOCK_PQRS: PQRS[] = [
  { id: 'PQ1', ticket: 'PQRS-2026-001', subject: 'Filtración de agua en techo', category: 'complaint', status: 'in_progress', priority: 'high', resident: 'Ana García', unit: '101', date: '2026-01-28', assignedTo: 'ServiFix S.A.S', description: 'Se presenta filtración de agua en el techo del baño principal desde hace una semana.' },
  { id: 'PQ2', ticket: 'PQRS-2026-002', subject: 'Ruido excesivo vecino piso superior', category: 'complaint', status: 'received', priority: 'medium', resident: 'Carlos Ruiz', unit: '102', date: '2026-02-01', description: 'Se reporta ruido excesivo proveniente del apartamento 202 en horarios nocturnos.' },
  { id: 'PQ3', ticket: 'PQRS-2026-003', subject: 'Solicitud instalación cargador EV', category: 'petition', status: 'escalated', priority: 'low', resident: 'María Fernández', unit: '201', date: '2026-02-03', description: 'Solicito autorización para instalar un cargador de vehículo eléctrico en mi parqueadero.' },
  { id: 'PQ4', ticket: 'PQRS-2026-004', subject: 'Cobro indebido cuota extraordinaria', category: 'claim', status: 'resolved', priority: 'high', resident: 'Luis Torres', unit: '203', date: '2026-01-15', assignedTo: 'Administración', description: 'Me fue cobrada una cuota extraordinaria que ya había sido pagada.' },
  { id: 'PQ5', ticket: 'PQRS-2026-005', subject: 'Mejorar iluminación parqueadero', category: 'suggestion', status: 'closed', priority: 'medium', resident: 'Pedro Ramírez', unit: 'LC-01', date: '2026-01-10', description: 'Sugiero mejorar la iluminación del parqueadero del sótano 2, especialmente en la zona norte.' },
  { id: 'PQ6', ticket: 'PQRS-2026-006', subject: 'Ascensor Torre B fuera de servicio', category: 'complaint', status: 'in_progress', priority: 'urgent', resident: 'Sandra López', unit: '301', date: '2026-02-06', assignedTo: 'Ascensores del Valle', description: 'El ascensor de la Torre B lleva 3 días fuera de servicio, afectando a adultos mayores.' },
];

const MOCK_MAINTENANCE: MaintenanceOrder[] = [
  { id: 'M1', title: 'Reparación bomba de agua', area: 'Cuarto de bombas', status: 'in_progress', priority: 'high', assignedTo: 'ServiFix S.A.S', reportedDate: '2026-02-01', description: 'Bomba principal presenta fallo intermitente.' },
  { id: 'M2', title: 'Pintura fachada Torre A', area: 'Fachada Torre A', status: 'assigned', priority: 'medium', assignedTo: 'Pinturas Express', reportedDate: '2026-01-20', description: 'Pintura deteriorada en pisos 3-5 por humedad.' },
  { id: 'M3', title: 'Cambio luminarias parqueadero', area: 'Parqueadero Sótano 1', status: 'completed', priority: 'low', assignedTo: 'ElectroServ', reportedDate: '2026-01-10', completedDate: '2026-01-25', description: 'Reemplazo de 15 luminarias LED.' },
  { id: 'M4', title: 'Fumigación áreas comunes', area: 'Áreas comunes', status: 'pending', priority: 'medium', assignedTo: 'Sin asignar', reportedDate: '2026-02-05', description: 'Fumigación trimestral programada.' },
  { id: 'M5', title: 'Reparación portón vehicular', area: 'Acceso vehicular', status: 'in_progress', priority: 'high', assignedTo: 'Portones S.A', reportedDate: '2026-02-04', description: 'Motor del portón presenta falla, se queda abierto.' },
];

const MOCK_ACCESS_LOGS: AccessLog[] = [
  { id: 'AL1', type: 'entry', person: 'Juan Pérez', document: 'CC 1234567', destination: 'Apto 201', date: '2026-02-08', time: '08:30', authorized: true },
  { id: 'AL2', type: 'entry', person: 'Domicilio Rappi', document: 'N/A', destination: 'Apto 102', date: '2026-02-08', time: '09:15', authorized: true },
  { id: 'AL3', type: 'exit', person: 'Juan Pérez', document: 'CC 1234567', destination: 'Salida', date: '2026-02-08', time: '10:00', authorized: true },
  { id: 'AL4', type: 'entry', person: 'Técnico Gas Natural', document: 'CC 9876543', destination: 'Apto 301', date: '2026-02-08', time: '10:30', vehicle: 'ABC-123', authorized: true },
  { id: 'AL5', type: 'entry', person: 'María Rodríguez', document: 'CC 5555555', destination: 'LC-01', date: '2026-02-08', time: '11:00', authorized: true },
  { id: 'AL6', type: 'entry', person: 'Desconocido', document: 'Sin documento', destination: 'No indicó', date: '2026-02-08', time: '11:30', authorized: false },
  { id: 'AL7', type: 'exit', person: 'Técnico Gas Natural', document: 'CC 9876543', destination: 'Salida', date: '2026-02-08', time: '12:15', vehicle: 'ABC-123', authorized: true },
  { id: 'AL8', type: 'entry', person: 'Paquete Servientrega', document: 'Guía #789456', destination: 'Apto 101', date: '2026-02-08', time: '14:00', authorized: true },
];

const MOCK_DOCUMENTS: Document[] = [
  { id: 'D1', name: 'Acta Asamblea General 2025', category: 'minutes', uploadDate: '2026-01-15', version: 2, size: '2.4 MB', uploadedBy: 'Administración' },
  { id: 'D2', name: 'Reglamento de Propiedad Horizontal', category: 'regulations', uploadDate: '2025-06-01', version: 3, size: '5.1 MB', uploadedBy: 'Consejo' },
  { id: 'D3', name: 'Contrato Vigilancia 2026', category: 'contracts', uploadDate: '2025-12-20', version: 1, size: '1.8 MB', uploadedBy: 'Administración' },
  { id: 'D4', name: 'Balance General Diciembre 2025', category: 'financial', uploadDate: '2026-01-10', version: 1, size: '890 KB', uploadedBy: 'Contador' },
  { id: 'D5', name: 'Manual de Convivencia', category: 'regulations', uploadDate: '2025-03-15', version: 4, size: '3.2 MB', uploadedBy: 'Consejo' },
  { id: 'D6', name: 'Póliza de Seguros 2026', category: 'legal', uploadDate: '2026-01-05', version: 1, size: '4.5 MB', uploadedBy: 'Administración' },
];

const MOCK_MARKETPLACE: MarketplaceService[] = [
  {
    id: 'MK1',
    provider: 'ServiFix S.A.S',
    service: 'Reparaciones Generales',
    category: 'maintenance',
    rating: 4.8,
    reviews: 45,
    price: 'Desde $80.000/hora',
    available: true,
    badge: 'recommended',
    coverImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695c952952?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552820728-6bf6f09ef3fc?w=500&h=300&fit=crop',
    ],
    description: 'ServiFix es una empresa especializada en reparaciones generales con más de 8 años de experiencia. Ofrecemos servicios profesionales de mantenimiento y reparación para todo tipo de viviendas.',
    services: ['Reparación de tuberías', 'Arreglo de cerraduras', 'Reparación de electrodomésticos', 'Mantenimiento preventivo'],
    phone: '+57 300 555 1111',
    email: 'contacto@servifix.com',
    address: 'Calle 85 #15-30, Bogotá',
    schedule: 'Lun-Sab: 7:00 AM - 6:00 PM',
    responseTime: '2-4 horas',
    yearsExperience: 8,
  },
  {
    id: 'MK2',
    provider: 'LimpioYa!',
    service: 'Limpieza Profesional',
    category: 'cleaning',
    rating: 4.5,
    reviews: 120,
    price: 'Desde $120.000/sesión',
    available: true,
    badge: 'popular',
    coverImage: 'https://images.unsplash.com/photo-1563453392-3fba3eae1d6f?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1563453392-3fba3eae1d6f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1527857050563-430c63602acc?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1628840042765-356cda07f050?w=500&h=300&fit=crop',
    ],
    description: 'LimpioYa! es el servicio de limpieza profesional de confianza con más de 5 años sirviendo a comunidades residenciales. Nuestro equipo utiliza productos ecológicos certificados.',
    services: ['Limpieza general', 'Limpieza profunda', 'Desinfección', 'Limpieza de vidrios', 'Pisos y alfombras'],
    phone: '+57 301 555 2222',
    email: 'info@limpioya.com',
    address: 'Av. 7ª #120-45, Bogotá',
    schedule: 'Lun-Dom: 8:00 AM - 8:00 PM',
    responseTime: '1-2 horas',
    yearsExperience: 5,
  },
  {
    id: 'MK3',
    provider: 'PlomerMax',
    service: 'Plomería Especializada',
    category: 'plumbing',
    rating: 4.7,
    reviews: 67,
    price: 'Desde $100.000/visita',
    available: true,
    badge: 'recommended',
    coverImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1607472220166-41e44e1d519b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1654581293253-501e2e3e82e9?w=500&h=300&fit=crop',
    ],
    description: 'Plomería de alta calidad con certificación profesional. Reparamos y mantenemos sistemas hidráulicos complejos con garantía en todos nuestros trabajos.',
    services: ['Reparación de fugas', 'Instalación de tuberías', 'Destapadores de canales', 'Cambio de llaves', 'Reparación de grifos'],
    phone: '+57 302 555 3333',
    email: 'soporte@plomermax.com',
    address: 'Km 5 Vía Chía, Chía',
    schedule: 'Lun-Sab: 6:00 AM - 8:00 PM',
    responseTime: '1-3 horas',
    yearsExperience: 10,
  },
  {
    id: 'MK4',
    provider: 'ElectroServ',
    service: 'Instalaciones Eléctricas',
    category: 'electrical',
    rating: 4.9,
    reviews: 34,
    price: 'Desde $90.000/hora',
    available: false,
    badge: 'new',
    coverImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581092161562-40038fbbb237?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=500&h=300&fit=crop',
    ],
    description: 'Empresa de electricidad licenciada e insured. Realizamos instalaciones, reparaciones y mantenimiento de sistemas eléctricos con estándares internacionales de seguridad.',
    services: ['Reparación de circuitos', 'Instalación de puntos', 'Cambio de tableros', 'Revisión de acometidas', 'Mantenimiento preventivo'],
    phone: '+57 303 555 4444',
    email: 'contacto@electroserv.com',
    address: 'Cra 15 #180-22, Bogotá',
    schedule: 'Lun-Vie: 7:00 AM - 5:00 PM',
    responseTime: '3-6 horas',
    yearsExperience: 12,
  },
  {
    id: 'MK5',
    provider: 'Jardines Verdes',
    service: 'Mantenimiento de Jardines',
    category: 'gardening',
    rating: 4.3,
    reviews: 28,
    price: 'Desde $150.000/mes',
    available: true,
    coverImage: 'https://images.unsplash.com/photo-1590821990519-c90900dbab4d?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1590821990519-c90900dbab4d?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464226184612-280ebc17f399?w=500&h=300&fit=crop',
    ],
    description: 'Especialistas en transformación de espacios verdes. Contamos con diseñadores paisajistas y jardineros certificados para embellecer tus áreas comunes.',
    services: ['Diseño paisajístico', 'Poda y mantenimiento', 'Siembra de plantas', 'Control de plagas', 'Riego automático'],
    phone: '+57 304 555 5555',
    email: 'info@jardinverdes.com',
    address: 'Calle 100 #8-49, Bogotá',
    schedule: 'Lun-Vie: 8:00 AM - 6:00 PM',
    responseTime: '24 horas',
    yearsExperience: 7,
  },
  {
    id: 'MK6',
    provider: 'SegurTotal',
    service: 'Cámaras y Seguridad',
    category: 'security',
    rating: 4.6,
    reviews: 15,
    price: 'Desde $500.000',
    available: true,
    coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1516536775068-ec3b9971cd63?w=500&h=300&fit=crop',
    ],
    description: 'Sistema integral de seguridad con tecnología de punta. Ofrecemos instalación, monitoreo 24/7 y soporte técnico para proteger tu comunidad.',
    services: ['Cámaras CCTV', 'Control de acceso', 'Cerco eléctrico', 'Monitoreo remoto', 'Videoportero inteligente'],
    phone: '+57 305 555 6666',
    email: 'ventas@segurtotal.com',
    address: 'Cr 7 #45-12, Medellín',
    schedule: 'Lun-Vie: 9:00 AM - 5:00 PM',
    responseTime: 'Consultar',
    yearsExperience: 9,
  },
  {
    id: 'MK7',
    provider: 'PintureART',
    service: 'Servicios de Pintura',
    category: 'painting',
    rating: 4.4,
    reviews: 52,
    price: 'Desde $150.000/m²',
    available: true,
    badge: 'popular',
    coverImage: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1561545608-d4c4dd89e6f7?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1602768859875-8f46a441f529?w=500&h=300&fit=crop',
    ],
    description: 'Equipo profesional de pintores con experiencia en todo tipo de trabajos: fachadas, interiores, decoración especial. Usamos pintura de marcas certificadas.',
    services: ['Pintura de fachadas', 'Pintura interior', 'Efectos decorativos', 'Impermeabilización', 'Restauración'],
    phone: '+57 306 555 7777',
    email: 'presupuesto@pintureart.com',
    address: 'Cra 9 #70-15, Bogotá',
    schedule: 'Lun-Sab: 7:00 AM - 6:00 PM',
    responseTime: '2-3 horas',
    yearsExperience: 6,
  },
];

const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'ST1', subject: 'No puedo acceder a mi estado de cuenta', status: 'resolved', priority: 'medium', date: '2026-02-01', category: 'Acceso', description: 'Al intentar ver mi estado de cuenta aparece error.', requesterId: 'U1' },
  { id: 'ST2', subject: 'Error al hacer reserva del salón', status: 'open', priority: 'high', date: '2026-02-06', category: 'Reservas', description: 'El sistema no permite seleccionar fecha para reservar el salón comunal.', requesterId: 'U2' },
  { id: 'ST3', subject: 'Actualizar datos de contacto', status: 'in_progress', priority: 'low', date: '2026-02-04', category: 'Perfil', description: 'Necesito actualizar mi número de teléfono en el sistema.', requesterId: 'U3' },
];

// ========== PROVIDER MOCK DATA ==========
const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'PROV1',
    name: 'ServiFix S.A.S',
    email: 'contacto@servifix.com',
    phone: '+57 300 555 1111',
    document: '900.123.456-7',
    address: 'Calle 85 #15-30, Bogotá',
    serviceType: 'maintenance',
    certifications: ['ISO 9001', 'Certificación de Seguridad', 'Licencia de Construcción'],
    rating: 4.8,
    totalJobs: 156,
    since: '2022-01-15',
    status: 'active',
    contractStartDate: '2022-01-01',
    contractEndDate: '2026-12-31',
    insurancePolicy: 'Póliza #SEG-2026-001',
    bankAccount: '****4567',
    bankName: 'Bancolombia',
  },
];

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO1',
    orderNumber: 'ORD-2026-001',
    propertyId: 'P1',
    property: 'Apto 101',
    tower: 'Torre A',
    block: 'Bloque 1',
    serviceType: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    assignedDate: '2026-02-05',
    dueDate: '2026-02-08',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    description: 'Reparación de fuga de agua en baño principal',
    observations: 'Se identificó fuga en unión de tuberías',
    evidence: [
      { id: 'EV1', type: 'before', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop', uploadedAt: '2026-02-05 10:30', description: 'Foto antes de reparación' },
      { id: 'EV2', type: 'during', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop', uploadedAt: '2026-02-05 11:45', description: 'Durante el trabajo' },
    ],
    adminSignature: false,
    materialsUsed: [
      { id: 'MAT1', name: 'Tubo PVC 2"', quantity: 2, unitPrice: 25000, totalPrice: 50000 },
      { id: 'MAT2', name: 'Codo PVC 2"', quantity: 4, unitPrice: 3500, totalPrice: 14000 },
    ],
    technicianNotes: 'Trabajo en progreso, se requiere segunda visita',
  },
  {
    id: 'WO2',
    orderNumber: 'ORD-2026-002',
    propertyId: 'P3',
    property: 'Apto 201',
    tower: 'Torre A',
    block: 'Bloque 1',
    serviceType: 'electrical',
    priority: 'medium',
    status: 'pending',
    assignedDate: '2026-02-06',
    dueDate: '2026-02-10',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    description: 'Instalación de tomacorriente en cocina',
  },
  {
    id: 'WO3',
    orderNumber: 'ORD-2026-003',
    propertyId: 'P2',
    property: 'Apto 102',
    tower: 'Torre A',
    block: 'Bloque 1',
    serviceType: 'maintenance',
    priority: 'low',
    status: 'completed',
    assignedDate: '2026-01-28',
    dueDate: '2026-02-01',
    completedDate: '2026-01-30',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    description: 'Mantenimiento preventivo de extintores',
    observations: 'Se realizó revisión completa de extintores',
    evidence: [
      { id: 'EV3', type: 'before', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', uploadedAt: '2026-01-28 09:00', description: 'Extintores antes del mantenimiento' },
      { id: 'EV4', type: 'after', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', uploadedAt: '2026-01-30 14:00', description: 'Extintores con etiqueta de servicio' },
    ],
    adminSignature: true,
    materialsUsed: [
      { id: 'MAT3', name: 'Etiqueta de servicio', quantity: 3, unitPrice: 5000, totalPrice: 15000 },
    ],
    technicianNotes: 'Todos los extintores en buen estado',
  },
  {
    id: 'WO4',
    orderNumber: 'ORD-2026-004',
    propertyId: 'P7',
    property: 'LC-01',
    tower: 'Torre C',
    block: 'Bloque 3',
    serviceType: 'electrical',
    priority: 'urgent',
    status: 'in_review',
    assignedDate: '2026-02-03',
    dueDate: '2026-02-05',
    completedDate: '2026-02-04',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    description: 'Reparación de cortocircuito en tablero eléctrico',
    observations: 'Se reemplazó breaker dañado',
    evidence: [
      { id: 'EV5', type: 'before', imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop', uploadedAt: '2026-02-03 16:00', description: 'Tablero con problema' },
      { id: 'EV6', type: 'after', imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=300&fit=crop', uploadedAt: '2026-02-04 11:00', description: 'Tablero reparado' },
    ],
    adminSignature: true,
    materialsUsed: [
      { id: 'MAT4', name: 'Breaker 30A', quantity: 1, unitPrice: 45000, totalPrice: 45000 },
      { id: 'MAT5', name: 'Cable #12', quantity: 3, unitPrice: 12000, totalPrice: 36000 },
    ],
    technicianNotes: 'Trabajo completado, esperando aprobación',
  },
  {
    id: 'WO5',
    orderNumber: 'ORD-2026-005',
    propertyId: 'P4',
    property: 'Apto 301',
    tower: 'Torre B',
    block: 'Bloque 2',
    serviceType: 'plumbing',
    priority: 'high',
    status: 'pending',
    assignedDate: '2026-02-07',
    dueDate: '2026-02-09',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    description: 'Desatoro de lavamanos y lavaplatos',
  },
  {
    id: 'WO6',
    orderNumber: 'ORD-2025-089',
    propertyId: 'P6',
    property: 'Apto 203',
    tower: 'Torre A',
    block: 'Bloque 1',
    serviceType: 'maintenance',
    priority: 'medium',
    status: 'completed',
    assignedDate: '2025-12-15',
    dueDate: '2025-12-20',
    completedDate: '2025-12-18',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    description: 'Revision y limpieza de canales',
    adminSignature: true,
    technicianNotes: 'Canales limpiados y en buen estado',
  },
];

const MOCK_PROVIDER_INVOICES: ProviderInvoice[] = [
  {
    id: 'INV1',
    invoiceNumber: 'FAC-2026-001',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    workOrderId: 'WO3',
    concept: 'Mantenimiento preventivo extintores - Apto 101',
    amount: 150000,
    tax: 28500,
    total: 178500,
    issueDate: '2026-01-30',
    dueDate: '2026-02-15',
    status: 'paid',
    paidDate: '2026-02-10',
    paymentMethod: 'transfer',
    receiptNumber: 'REC-PAY-2026-001',
  },
  {
    id: 'INV2',
    invoiceNumber: 'FAC-2026-002',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    workOrderId: 'WO4',
    concept: 'Reparación tablero eléctrico - Local LC-01',
    amount: 280000,
    tax: 53200,
    total: 333200,
    issueDate: '2026-02-04',
    dueDate: '2026-02-20',
    status: 'approved',
  },
  {
    id: 'INV3',
    invoiceNumber: 'FAC-2026-003',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    workOrderId: 'WO1',
    concept: 'Reparación fuga baño - Apto 101 (Parcial)',
    amount: 120000,
    tax: 22800,
    total: 142800,
    issueDate: '2026-02-05',
    dueDate: '2026-02-25',
    status: 'pending',
    description: 'Primera parte del trabajo completado',
  },
  {
    id: 'INV4',
    invoiceNumber: 'FAC-2025-045',
    providerId: 'PROV1',
    provider: 'ServiFix S.A.S',
    workOrderId: 'WO6',
    concept: 'Mantenimiento canales - Apto 203',
    amount: 200000,
    tax: 38000,
    total: 238000,
    issueDate: '2025-12-18',
    dueDate: '2026-01-05',
    status: 'paid',
    paidDate: '2025-12-28',
    paymentMethod: 'transfer',
    receiptNumber: 'REC-PAY-2025-045',
  },
];

const MOCK_PROVIDER_PAYMENTS: ProviderPayment[] = [
  { id: 'PAYPROV1', providerId: 'PROV1', provider: 'ServiFix S.A.S', invoiceId: 'INV1', invoiceNumber: 'FAC-2026-001', amount: 178500, date: '2026-02-10', method: 'transfer', reference: 'TRF-2026-001' },
  { id: 'PAYPROV2', providerId: 'PROV1', provider: 'ServiFix S.A.S', invoiceId: 'INV4', invoiceNumber: 'FAC-2025-045', amount: 238000, date: '2025-12-28', method: 'transfer', reference: 'TRF-2025-089' },
];

const MOCK_PROVIDER_CREDIT_NOTES: ProviderCreditNote[] = [
  { id: 'CNC1', creditNoteNumber: 'NC-2026-001', providerId: 'PROV1', provider: 'ServiFix S.A.S', invoiceId: 'INV1', reason: 'Descuento por pronto pago', amount: 15000, date: '2026-02-08', status: 'approved' },
];

const MOCK_PROVIDER_EVALUATIONS: ProviderEvaluation[] = [
  { id: 'EVL1', workOrderId: 'WO3', workOrderNumber: 'ORD-2026-003', providerId: 'PROV1', provider: 'ServiFix S.A.S', date: '2026-01-31', timeRating: 5, qualityRating: 5, complianceRating: 5, communicationRating: 4, overallRating: 4.75, comments: 'Excelente trabajo, puntuales y profesionales', evaluator: 'Administración' },
  { id: 'EVL2', workOrderId: 'WO4', workOrderNumber: 'ORD-2026-004', providerId: 'PROV1', provider: 'ServiFix S.A.S', date: '2026-02-05', timeRating: 4, qualityRating: 5, complianceRating: 5, communicationRating: 5, overallRating: 4.75, comments: 'Muy buen servicio, respuesta rápida', evaluator: 'Administración' },
  { id: 'EVL3', workOrderId: 'WO6', workOrderNumber: 'ORD-2025-089', providerId: 'PROV1', provider: 'ServiFix S.A.S', date: '2025-12-19', timeRating: 5, qualityRating: 4, complianceRating: 5, communicationRating: 4, overallRating: 4.5, comments: 'Buen trabajo en general', evaluator: 'Administración' },
];

const MOCK_PROVIDER_SCHEDULES: ProviderSchedule[] = [
  { id: 'SCH1', providerId: 'PROV1', date: '2026-02-08', timeSlot: '09:00 - 11:00', serviceType: 'plumbing', property: 'Apto 101', workOrderId: 'WO1', status: 'confirmed', notes: 'Segunda visita - Terminación de reparación' },
  { id: 'SCH2', providerId: 'PROV1', date: '2026-02-09', timeSlot: '14:00 - 16:00', serviceType: 'plumbing', property: 'Apto 301', workOrderId: 'WO5', status: 'pending', notes: 'Desatoro de lavamanos' },
  { id: 'SCH3', providerId: 'PROV1', date: '2026-02-10', timeSlot: '10:00 - 12:00', serviceType: 'electrical', property: 'Apto 201', workOrderId: 'WO2', status: 'pending', notes: 'Instalación de tomacorriente' },
  { id: 'SCH4', providerId: 'PROV1', date: '2026-02-12', timeSlot: '09:00 - 13:00', serviceType: 'maintenance', property: 'Áreas Comunes', status: 'confirmed', notes: 'Mantenimiento trimestral zonas comunes' },
  { id: 'SCH5', providerId: 'PROV1', date: '2026-02-15', timeSlot: '10:00 - 12:00', serviceType: 'electrical', property: 'Parqueadero', status: 'pending', notes: 'Revisión iluminación sótano' },
];

// ========== STORE ==========
interface AppState {
  // Multi-condo
  condos: CondominiumConfig[];
  selectedCondoId: string | null;
  selectCondo: (id: string) => void;
  exitCondo: () => void;
  // Current condo
  condoConfig: CondominiumConfig;
  updateCondoConfig: (data: Partial<CondominiumConfig>) => void;
  properties: Property[];
  residents: Resident[];
  occupancyHistory: OccupancyRecord[];
  communications: Communication[];
  directMessages: DirectMessage[];
  feeConfigs: FeeConfig[];
  payments: Payment[];
  collectionActions: CollectionAction[];
  accounting: AccountingEntry[];
  reservations: Reservation[];
  pqrs: PQRS[];
  maintenance: MaintenanceOrder[];
  accessLogs: AccessLog[];
  documents: Document[];
  marketplace: MarketplaceService[];
  supportTickets: SupportTicket[];
  // Provider
  providers: Provider[];
  workOrders: WorkOrder[];
  providerInvoices: ProviderInvoice[];
  providerPayments: ProviderPayment[];
  providerCreditNotes: ProviderCreditNote[];
  providerEvaluations: ProviderEvaluation[];
  providerSchedules: ProviderSchedule[];
  // Actions
  addProperty: (p: Property) => void;
  updateProperty: (id: string, data: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addResident: (r: Resident) => void;
  updateResident: (id: string, data: Partial<Resident>) => void;
  deleteResident: (id: string) => void;
  addCommunication: (c: Communication) => void;
  updateCommunication: (id: string, data: Partial<Communication>) => void;
  deleteCommunication: (id: string) => void;
  addDirectMessage: (m: DirectMessage) => void;
  addFeeConfig: (fc: FeeConfig) => void;
  updateFeeConfig: (id: string, data: Partial<FeeConfig>) => void;
  deleteFeeConfig: (id: string) => void;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;
  addReservation: (r: Reservation) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  addPQRS: (p: PQRS) => void;
  updatePQRSStatus: (id: string, status: PQRS['status']) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceOrder['status']) => void;
  addAccessLog: (log: AccessLog) => void;
  addSupportTicket: (t: SupportTicket) => void;
  addCollectionAction: (a: CollectionAction) => void;
  addOccupancyRecord: (r: OccupancyRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  condos: MOCK_CONDOS,
  selectedCondoId: null,
  selectCondo: (id) => set({ selectedCondoId: id }),
  exitCondo: () => set({ selectedCondoId: null }),
  condoConfig: MOCK_CONDO_CONFIG,
  updateCondoConfig: (data) => set((s) => ({ condoConfig: { ...s.condoConfig, ...data } })),
  properties: MOCK_PROPERTIES,
  residents: MOCK_RESIDENTS,
  occupancyHistory: MOCK_OCCUPANCY_HISTORY,
  communications: MOCK_COMMUNICATIONS,
  directMessages: MOCK_DIRECT_MESSAGES,
  feeConfigs: MOCK_FEE_CONFIGS,
  payments: MOCK_PAYMENTS,
  collectionActions: MOCK_COLLECTION_ACTIONS,
  accounting: MOCK_ACCOUNTING,
  reservations: MOCK_RESERVATIONS,
  pqrs: MOCK_PQRS,
  maintenance: MOCK_MAINTENANCE,
  accessLogs: MOCK_ACCESS_LOGS,
  documents: MOCK_DOCUMENTS,
  marketplace: MOCK_MARKETPLACE,
  supportTickets: MOCK_SUPPORT_TICKETS,
  // Provider
  providers: MOCK_PROVIDERS,
  workOrders: MOCK_WORK_ORDERS,
  providerInvoices: MOCK_PROVIDER_INVOICES,
  providerPayments: MOCK_PROVIDER_PAYMENTS,
  providerCreditNotes: MOCK_PROVIDER_CREDIT_NOTES,
  providerEvaluations: MOCK_PROVIDER_EVALUATIONS,
  providerSchedules: MOCK_PROVIDER_SCHEDULES,

  addProperty: (p) => set((s) => ({ properties: [...s.properties, p] })),
  updateProperty: (id, data) => set((s) => ({ properties: s.properties.map(p => p.id === id ? { ...p, ...data } : p) })),
  deleteProperty: (id) => set((s) => ({ properties: s.properties.filter(p => p.id !== id) })),
  addResident: (r) => set((s) => ({ residents: [...s.residents, r] })),
  updateResident: (id, data) => set((s) => ({ residents: s.residents.map(r => r.id === id ? { ...r, ...data } : r) })),
  deleteResident: (id) => set((s) => ({ residents: s.residents.filter(r => r.id !== id) })),
  addCommunication: (c) => set((s) => ({ communications: [c, ...s.communications] })),
  updateCommunication: (id, data) => set((s) => ({ communications: s.communications.map(c => c.id === id ? { ...c, ...data } : c) })),
  deleteCommunication: (id) => set((s) => ({ communications: s.communications.filter(c => c.id !== id) })),
  addDirectMessage: (m) => set((s) => ({ directMessages: [...s.directMessages, m] })),
  addFeeConfig: (fc) => set((s) => ({ feeConfigs: [...s.feeConfigs, fc] })),
  updateFeeConfig: (id, data) => set((s) => ({ feeConfigs: s.feeConfigs.map(fc => fc.id === id ? { ...fc, ...data } : fc) })),
  deleteFeeConfig: (id) => set((s) => ({ feeConfigs: s.feeConfigs.filter(fc => fc.id !== id) })),
  updatePaymentStatus: (id, status) => set((s) => ({
    payments: s.payments.map(p => p.id === id ? { ...p, status, paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : p.paidDate, balance: status === 'paid' ? 0 : p.balance } : p),
  })),
  addReservation: (r) => set((s) => ({ reservations: [...s.reservations, r] })),
  updateReservationStatus: (id, status) => set((s) => ({
    reservations: s.reservations.map(r => r.id === id ? { ...r, status } : r),
  })),
  addPQRS: (p) => set((s) => ({ pqrs: [...s.pqrs, p] })),
  updatePQRSStatus: (id, status) => set((s) => ({
    pqrs: s.pqrs.map(p => p.id === id ? { ...p, status } : p),
  })),
  updateMaintenanceStatus: (id, status) => set((s) => ({
    maintenance: s.maintenance.map(m => m.id === id ? { ...m, status, completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : m.completedDate } : m),
  })),
  addAccessLog: (log) => set((s) => ({ accessLogs: [log, ...s.accessLogs] })),
  addSupportTicket: (t) => set((s) => ({ supportTickets: [...s.supportTickets, t] })),
  addCollectionAction: (a) => set((s) => ({ collectionActions: [...s.collectionActions, a] })),
  addOccupancyRecord: (r) => set((s) => ({ occupancyHistory: [...s.occupancyHistory, r] })),
  // Provider actions
  updateWorkOrderStatus: (id, status) => set((s) => ({
    workOrders: s.workOrders.map(wo => wo.id === id ? { ...wo, status, completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : wo.completedDate } : wo),
  })),
  addWorkOrderEvidence: (workOrderId, evidence) => set((s) => ({
    workOrders: s.workOrders.map(wo => wo.id === workOrderId ? { ...wo, evidence: [...(wo.evidence || []), evidence] } : wo),
  })),
  updateProviderInvoiceStatus: (id, status, paidDate) => set((s) => ({
    providerInvoices: s.providerInvoices.map(inv => inv.id === id ? { ...inv, status, paidDate: status === 'paid' ? paidDate || new Date().toISOString().split('T')[0] : inv.paidDate } : inv),
  })),
}));
