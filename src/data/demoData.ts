// Demo Data for BUNTY - Conjunto Residencial Los Pinos
// Realistic Colombian residential complex data

export interface Unit {
  id: string;
  tower: string;
  floor: number;
  number: string;
  ownerId: string;
  ownerName: string;
  currentTenantId?: string;
  currentTenantName?: string;
  status: 'occupied' | 'vacant' | 'rented';
  area: number;
  type: 'apartment' | 'parking' | 'storage';
  coefficient: number;
}

export interface Resident {
  id: string;
  name: string;
  role: 'owner' | 'tenant';
  email: string;
  phone: string;
  unitId: string;
  since: string;
  documentId: string;
}

export interface Payment {
  id: string;
  unitId: string;
  month: string;
  concept: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
}

export interface CommonArea {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  image: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  unitId: string;
  residentName: string;
  areaId: string;
  areaName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  guests: number;
}

export interface PQRS {
  id: string;
  unitId: string;
  residentName: string;
  type: 'petition' | 'complaint' | 'request' | 'suggestion';
  title: string;
  description: string;
  date: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  documentId: string;
  visitingUnit: string;
  checkInTime: string;
  checkOutTime?: string;
  purpose: string;
  vehicle?: string;
  licensePlate?: string;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  taxId: string;
  rating: number;
  active: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: 'regulation' | 'assembly_act' | 'policy' | 'notice';
  uploadDate: string;
  url: string;
  size: string;
}

// ============== UNITS & RESIDENTS DATA ==============

export const units: Unit[] = [
  // Tower A
  { id: 'apt-a-101', tower: 'A', floor: 1, number: '101', ownerId: 'own-01', ownerName: 'Carlos Mendoza', currentTenantId: 'tenant-01', currentTenantName: 'Juan Pérez', status: 'rented', area: 85, type: 'apartment', coefficient: 0.0850 },
  { id: 'apt-a-102', tower: 'A', floor: 1, number: '102', ownerId: 'own-02', ownerName: 'María López', status: 'occupied', area: 85, type: 'apartment', coefficient: 0.0850 },
  { id: 'apt-a-201', tower: 'A', floor: 2, number: '201', ownerId: 'own-03', ownerName: 'Roberto García', currentTenantId: 'tenant-02', currentTenantName: 'Andrés Rodríguez', status: 'rented', area: 90, type: 'apartment', coefficient: 0.0900 },
  { id: 'apt-a-202', tower: 'A', floor: 2, number: '202', ownerId: 'own-04', ownerName: 'Sofía Ruiz', status: 'vacant', area: 90, type: 'apartment', coefficient: 0.0900 },
  { id: 'apt-a-301', tower: 'A', floor: 3, number: '301', ownerId: 'own-05', ownerName: 'Andrés Martínez', status: 'occupied', area: 95, type: 'apartment', coefficient: 0.0950 },
  { id: 'apt-a-302', tower: 'A', floor: 3, number: '302', ownerId: 'own-06', ownerName: 'Isabela Castro', currentTenantId: 'tenant-03', currentTenantName: 'Felipe Sánchez', status: 'rented', area: 95, type: 'apartment', coefficient: 0.0950 },
  { id: 'apt-a-401', tower: 'A', floor: 4, number: '401', ownerId: 'own-07', ownerName: 'Diego Moreno', status: 'occupied', area: 100, type: 'apartment', coefficient: 0.1000 },
  { id: 'apt-a-402', tower: 'A', floor: 4, number: '402', ownerId: 'own-08', ownerName: 'Valentina Silva', status: 'occupied', area: 100, type: 'apartment', coefficient: 0.1000 },

  // Tower B
  { id: 'apt-b-101', tower: 'B', floor: 1, number: '101', ownerId: 'own-01', ownerName: 'Carlos Mendoza', status: 'occupied', area: 85, type: 'apartment', coefficient: 0.0850 },
  { id: 'apt-b-102', tower: 'B', floor: 1, number: '102', ownerId: 'own-02', ownerName: 'María López', currentTenantId: 'tenant-04', currentTenantName: 'Sandra López', status: 'rented', area: 85, type: 'apartment', coefficient: 0.0850 },
  { id: 'apt-b-201', tower: 'B', floor: 2, number: '201', ownerId: 'own-09', ownerName: 'Javier Ríos', currentTenantId: 'tenant-05', currentTenantName: 'Cristina Vargas', status: 'rented', area: 90, type: 'apartment', coefficient: 0.0900 },
  { id: 'apt-b-202', tower: 'B', floor: 2, number: '202', ownerId: 'own-10', ownerName: 'Lorena Díaz', status: 'occupied', area: 90, type: 'apartment', coefficient: 0.0900 },
  { id: 'apt-b-301', tower: 'B', floor: 3, number: '301', ownerId: 'own-03', ownerName: 'Roberto García', status: 'occupied', area: 95, type: 'apartment', coefficient: 0.0950 },
  { id: 'apt-b-302', tower: 'B', floor: 3, number: '302', ownerId: 'own-11', ownerName: 'Paola Acosta', currentTenantId: 'tenant-06', currentTenantName: 'Mauricio Flores', status: 'rented', area: 95, type: 'apartment', coefficient: 0.0950 },
  { id: 'apt-b-401', tower: 'B', floor: 4, number: '401', ownerId: 'own-04', ownerName: 'Sofía Ruiz', status: 'occupied', area: 100, type: 'apartment', coefficient: 0.1000 },
  { id: 'apt-b-402', tower: 'B', floor: 4, number: '402', ownerId: 'own-12', ownerName: 'Guillermo Torres', currentTenantId: 'tenant-07', currentTenantName: 'Natalia Gutiérrez', status: 'rented', area: 100, type: 'apartment', coefficient: 0.1000 },

  // Tower C
  { id: 'apt-c-101', tower: 'C', floor: 1, number: '101', ownerId: 'own-05', ownerName: 'Andrés Martínez', status: 'occupied', area: 85, type: 'apartment', coefficient: 0.0850 },
  { id: 'apt-c-102', tower: 'C', floor: 1, number: '102', ownerId: 'own-06', ownerName: 'Isabela Castro', currentTenantId: 'tenant-08', currentTenantName: 'Ricardo Herrera', status: 'rented', area: 85, type: 'apartment', coefficient: 0.0850 },
  { id: 'apt-c-201', tower: 'C', floor: 2, number: '201', ownerId: 'own-07', ownerName: 'Diego Moreno', currentTenantId: 'tenant-09', currentTenantName: 'Catalina Morales', status: 'rented', area: 90, type: 'apartment', coefficient: 0.0900 },
  { id: 'apt-c-202', tower: 'C', floor: 2, number: '202', ownerId: 'own-08', ownerName: 'Valentina Silva', status: 'occupied', area: 90, type: 'apartment', coefficient: 0.0900 },
  { id: 'apt-c-301', tower: 'C', floor: 3, number: '301', ownerId: 'own-09', ownerName: 'Javier Ríos', status: 'vacant', area: 95, type: 'apartment', coefficient: 0.0950 },
  { id: 'apt-c-302', tower: 'C', floor: 3, number: '302', ownerId: 'own-10', ownerName: 'Lorena Díaz', currentTenantId: 'tenant-10', currentTenantName: 'Esteban Peña', status: 'rented', area: 95, type: 'apartment', coefficient: 0.0950 },
  { id: 'apt-c-401', tower: 'C', floor: 4, number: '401', ownerId: 'own-11', ownerName: 'Paola Acosta', status: 'occupied', area: 100, type: 'apartment', coefficient: 0.1000 },
  { id: 'apt-c-402', tower: 'C', floor: 4, number: '402', ownerId: 'own-12', ownerName: 'Guillermo Torres', status: 'occupied', area: 100, type: 'apartment', coefficient: 0.1000 },
];

export const residents: Resident[] = [
  // Owners
  { id: 'own-01', name: 'Carlos Mendoza', role: 'owner', email: 'carlos@email.com', phone: '3001234567', unitId: 'apt-a-101', since: '2020-03-15', documentId: '1012345678' },
  { id: 'own-02', name: 'María López', role: 'owner', email: 'maria@email.com', phone: '3001234568', unitId: 'apt-a-102', since: '2021-06-20', documentId: '1023456789' },
  { id: 'own-03', name: 'Roberto García', role: 'owner', email: 'roberto@email.com', phone: '3001234569', unitId: 'apt-a-201', since: '2019-01-10', documentId: '1034567890' },
  { id: 'own-04', name: 'Sofía Ruiz', role: 'owner', email: 'sofia@email.com', phone: '3001234570', unitId: 'apt-a-202', since: '2022-09-05', documentId: '1045678901' },
  { id: 'own-05', name: 'Andrés Martínez', role: 'owner', email: 'andres@email.com', phone: '3001234571', unitId: 'apt-a-301', since: '2020-11-12', documentId: '1056789012' },
  { id: 'own-06', name: 'Isabela Castro', role: 'owner', email: 'isabela@email.com', phone: '3001234572', unitId: 'apt-a-302', since: '2021-04-08', documentId: '1067890123' },
  { id: 'own-07', name: 'Diego Moreno', role: 'owner', email: 'diego@email.com', phone: '3001234573', unitId: 'apt-a-401', since: '2023-02-14', documentId: '1078901234' },
  { id: 'own-08', name: 'Valentina Silva', role: 'owner', email: 'valentina@email.com', phone: '3001234574', unitId: 'apt-a-402', since: '2019-07-22', documentId: '1089012345' },
  { id: 'own-09', name: 'Javier Ríos', role: 'owner', email: 'javier@email.com', phone: '3001234575', unitId: 'apt-b-201', since: '2020-05-30', documentId: '1090123456' },
  { id: 'own-10', name: 'Lorena Díaz', role: 'owner', email: 'lorena@email.com', phone: '3001234576', unitId: 'apt-b-202', since: '2021-10-18', documentId: '1101234567' },
  { id: 'own-11', name: 'Paola Acosta', role: 'owner', email: 'paola@email.com', phone: '3001234577', unitId: 'apt-b-302', since: '2022-01-25', documentId: '1112345678' },
  { id: 'own-12', name: 'Guillermo Torres', role: 'owner', email: 'guillermo@email.com', phone: '3001234578', unitId: 'apt-b-402', since: '2020-08-09', documentId: '1123456789' },

  // Tenants
  { id: 'tenant-01', name: 'Juan Pérez', role: 'tenant', email: 'juan.p@email.com', phone: '3109876543', unitId: 'apt-a-101', since: '2023-02-01', documentId: '1234567890' },
  { id: 'tenant-02', name: 'Andrés Rodríguez', role: 'tenant', email: 'andres.r@email.com', phone: '3109876544', unitId: 'apt-a-201', since: '2023-03-15', documentId: '1245678901' },
  { id: 'tenant-03', name: 'Felipe Sánchez', role: 'tenant', email: 'felipe@email.com', phone: '3109876545', unitId: 'apt-a-302', since: '2023-04-10', documentId: '1256789012' },
  { id: 'tenant-04', name: 'Sandra López', role: 'tenant', email: 'sandra@email.com', phone: '3109876546', unitId: 'apt-b-102', since: '2023-01-20', documentId: '1267890123' },
  { id: 'tenant-05', name: 'Cristina Vargas', role: 'tenant', email: 'cristina@email.com', phone: '3109876547', unitId: 'apt-b-201', since: '2023-05-08', documentId: '1278901234' },
  { id: 'tenant-06', name: 'Mauricio Flores', role: 'tenant', email: 'mauricio@email.com', phone: '3109876548', unitId: 'apt-b-302', since: '2023-06-12', documentId: '1289012345' },
  { id: 'tenant-07', name: 'Natalia Gutiérrez', role: 'tenant', email: 'natalia@email.com', phone: '3109876549', unitId: 'apt-b-402', since: '2023-02-28', documentId: '1290123456' },
  { id: 'tenant-08', name: 'Ricardo Herrera', role: 'tenant', email: 'ricardo@email.com', phone: '3109876550', unitId: 'apt-c-102', since: '2023-03-05', documentId: '1301234567' },
  { id: 'tenant-09', name: 'Catalina Morales', role: 'tenant', email: 'catalina@email.com', phone: '3109876551', unitId: 'apt-c-201', since: '2023-04-22', documentId: '1312345678' },
  { id: 'tenant-10', name: 'Esteban Peña', role: 'tenant', email: 'esteban@email.com', phone: '3109876552', unitId: 'apt-c-302', since: '2023-07-01', documentId: '1323456789' },
  { id: 'tenant-11', name: 'Valeria Gómez', role: 'tenant', email: 'valeria@email.com', phone: '3109876553', unitId: 'apt-a-102', since: '2024-01-15', documentId: '1334567890' },
  { id: 'tenant-12', name: 'Marco Ramírez', role: 'tenant', email: 'marco@email.com', phone: '3109876554', unitId: 'apt-b-101', since: '2024-02-01', documentId: '1345678901' },
  { id: 'tenant-13', name: 'Lucia Navarro', role: 'tenant', email: 'lucia@email.com', phone: '3109876555', unitId: 'apt-c-101', since: '2024-01-20', documentId: '1356789012' },
  { id: 'tenant-14', name: 'Sergio Yañez', role: 'tenant', email: 'sergio@email.com', phone: '3109876556', unitId: 'apt-a-201', since: '2024-03-10', documentId: '1367890123' },
  { id: 'tenant-15', name: 'Patricia Cabrera', role: 'tenant', email: 'patricia@email.com', phone: '3109876557', unitId: 'apt-b-302', since: '2024-02-15', documentId: '1378901234' },
  { id: 'tenant-16', name: 'Alejandro Vega', role: 'tenant', email: 'alejandro@email.com', phone: '3109876558', unitId: 'apt-c-201', since: '2024-03-01', documentId: '1389012345' },
  { id: 'tenant-17', name: 'Daniela Oviedo', role: 'tenant', email: 'daniela@email.com', phone: '3109876559', unitId: 'apt-a-301', since: '2024-01-25', documentId: '1390123456' },
  { id: 'tenant-18', name: 'Miguel Parra', role: 'tenant', email: 'miguel@email.com', phone: '3109876560', unitId: 'apt-b-201', since: '2024-02-20', documentId: '1401234567' },
  { id: 'tenant-19', name: 'Regina Solano', role: 'tenant', email: 'regina@email.com', phone: '3109876561', unitId: 'apt-c-301', since: '2024-03-15', documentId: '1412345678' },
  { id: 'tenant-20', name: 'Fabio Cortés', role: 'tenant', email: 'fabio@email.com', phone: '3109876562', unitId: 'apt-c-401', since: '2024-04-01', documentId: '1423456789' },
];

// ============== PAYMENTS DATA - Last 6 months ==============

export const payments: Payment[] = [
  // November 2024
  { id: 'pay-001', unitId: 'apt-a-101', month: '2024-11', concept: 'Administración', amount: 450000, dueDate: '2024-11-05', paidDate: '2024-11-05', status: 'paid', paidAmount: 450000 },
  { id: 'pay-002', unitId: 'apt-a-101', month: '2024-11', concept: 'Servicios comunes', amount: 120000, dueDate: '2024-11-05', paidDate: '2024-11-05', status: 'paid', paidAmount: 120000 },
  { id: 'pay-003', unitId: 'apt-a-102', month: '2024-11', concept: 'Administración', amount: 450000, dueDate: '2024-11-05', paidDate: '2024-11-06', status: 'paid', paidAmount: 450000 },
  { id: 'pay-004', unitId: 'apt-a-102', month: '2024-11', concept: 'Servicios comunes', amount: 120000, dueDate: '2024-11-05', status: 'overdue', paidAmount: 0 },

  // December 2024
  { id: 'pay-005', unitId: 'apt-a-101', month: '2024-12', concept: 'Administración', amount: 450000, dueDate: '2024-12-05', paidDate: '2024-12-05', status: 'paid', paidAmount: 450000 },
  { id: 'pay-006', unitId: 'apt-a-101', month: '2024-12', concept: 'Servicios comunes', amount: 120000, dueDate: '2024-12-05', paidDate: '2024-12-05', status: 'paid', paidAmount: 120000 },
  { id: 'pay-007', unitId: 'apt-a-102', month: '2024-12', concept: 'Administración', amount: 450000, dueDate: '2024-12-05', status: 'overdue', paidAmount: 0 },
  { id: 'pay-008', unitId: 'apt-a-102', month: '2024-12', concept: 'Servicios comunes', amount: 120000, dueDate: '2024-12-05', status: 'overdue', paidAmount: 0 },

  // January 2025
  { id: 'pay-009', unitId: 'apt-a-101', month: '2025-01', concept: 'Administración', amount: 465000, dueDate: '2025-01-05', paidDate: '2025-01-05', status: 'paid', paidAmount: 465000 },
  { id: 'pay-010', unitId: 'apt-a-102', month: '2025-01', concept: 'Administración', amount: 465000, dueDate: '2025-01-05', status: 'overdue', paidAmount: 0 },
  { id: 'pay-011', unitId: 'apt-a-201', month: '2025-01', concept: 'Administración', amount: 480000, dueDate: '2025-01-05', paidDate: '2025-01-07', status: 'paid', paidAmount: 480000 },
  { id: 'pay-012', unitId: 'apt-b-102', month: '2025-01', concept: 'Administración', amount: 450000, dueDate: '2025-01-05', status: 'overdue', paidAmount: 0 },

  // February 2025
  { id: 'pay-013', unitId: 'apt-a-101', month: '2025-02', concept: 'Administración', amount: 465000, dueDate: '2025-02-05', paidDate: '2025-02-05', status: 'paid', paidAmount: 465000 },
  { id: 'pay-014', unitId: 'apt-a-102', month: '2025-02', concept: 'Administración', amount: 465000, dueDate: '2025-02-05', status: 'pending', paidAmount: 0 },
  { id: 'pay-015', unitId: 'apt-a-201', month: '2025-02', concept: 'Administración', amount: 480000, dueDate: '2025-02-05', paidDate: '2025-02-06', status: 'paid', paidAmount: 480000 },
  { id: 'pay-016', unitId: 'apt-b-102', month: '2025-02', concept: 'Administración', amount: 450000, dueDate: '2025-02-05', status: 'overdue', paidAmount: 0 },

  // March 2025
  { id: 'pay-017', unitId: 'apt-a-101', month: '2025-03', concept: 'Administración', amount: 465000, dueDate: '2025-03-05', paidDate: '2025-03-05', status: 'paid', paidAmount: 465000 },
  { id: 'pay-018', unitId: 'apt-a-102', month: '2025-03', concept: 'Administración', amount: 465000, dueDate: '2025-03-05', status: 'overdue', paidAmount: 0 },
  { id: 'pay-019', unitId: 'apt-a-201', month: '2025-03', concept: 'Administración', amount: 480000, dueDate: '2025-03-05', paidDate: '2025-03-05', status: 'paid', paidAmount: 480000 },
  { id: 'pay-020', unitId: 'apt-b-102', month: '2025-03', concept: 'Administración', amount: 450000, dueDate: '2025-03-05', paidDate: '2025-03-10', status: 'paid', paidAmount: 450000 },
  { id: 'pay-021', unitId: 'apt-c-301', month: '2025-03', concept: 'Administración', amount: 475000, dueDate: '2025-03-05', status: 'overdue', paidAmount: 0 },

  // April 2025
  { id: 'pay-022', unitId: 'apt-a-101', month: '2025-04', concept: 'Administración', amount: 475000, dueDate: '2025-04-05', paidDate: '2025-04-05', status: 'paid', paidAmount: 475000 },
  { id: 'pay-023', unitId: 'apt-a-102', month: '2025-04', concept: 'Administración', amount: 475000, dueDate: '2025-04-05', status: 'pending', paidAmount: 0 },
  { id: 'pay-024', unitId: 'apt-a-201', month: '2025-04', concept: 'Administración', amount: 490000, dueDate: '2025-04-05', paidDate: '2025-04-06', status: 'paid', paidAmount: 490000 },
  { id: 'pay-025', unitId: 'apt-b-102', month: '2025-04', concept: 'Administración', amount: 460000, dueDate: '2025-04-05', paidDate: '2025-04-12', status: 'paid', paidAmount: 460000 },
  { id: 'pay-026', unitId: 'apt-c-301', month: '2025-04', concept: 'Administración', amount: 485000, dueDate: '2025-04-05', status: 'overdue', paidAmount: 0 },

  // May 2025 (Current)
  { id: 'pay-027', unitId: 'apt-a-101', month: '2025-05', concept: 'Administración', amount: 475000, dueDate: '2025-05-05', paidDate: '2025-05-05', status: 'paid', paidAmount: 475000 },
  { id: 'pay-028', unitId: 'apt-a-102', month: '2025-05', concept: 'Administración', amount: 475000, dueDate: '2025-05-05', status: 'pending', paidAmount: 0 },
  { id: 'pay-029', unitId: 'apt-a-201', month: '2025-05', concept: 'Administración', amount: 490000, dueDate: '2025-05-05', paidDate: '2025-05-05', status: 'paid', paidAmount: 490000 },
  { id: 'pay-030', unitId: 'apt-b-102', month: '2025-05', concept: 'Administración', amount: 460000, dueDate: '2025-05-05', status: 'pending', paidAmount: 0 },
  { id: 'pay-031', unitId: 'apt-c-301', month: '2025-05', concept: 'Administración', amount: 485000, dueDate: '2025-05-05', status: 'overdue', paidAmount: 0 },
];

// ============== COMMON AREAS ==============

export const commonAreas: CommonArea[] = [
  { id: 'area-1', name: 'Salón Social', capacity: 80, hourlyRate: 75000, image: '🏛️', available: true },
  { id: 'area-2', name: 'Cancha Polideportiva', capacity: 20, hourlyRate: 45000, image: '🏀', available: true },
  { id: 'area-3', name: 'Piscina', capacity: 30, hourlyRate: 0, image: '🏊', available: true },
  { id: 'area-4', name: 'Gimnasio', capacity: 15, hourlyRate: 0, image: '💪', available: true },
  { id: 'area-5', name: 'Parque Infantil', capacity: 25, hourlyRate: 0, image: '🎡', available: true },
];

// ============== RESERVATIONS ==============

export const reservations: Reservation[] = [
  { id: 'res-001', unitId: 'apt-a-101', residentName: 'Juan Pérez', areaId: 'area-1', areaName: 'Salón Social', date: '2025-05-25', startTime: '14:00', endTime: '18:00', status: 'confirmed', guests: 15 },
  { id: 'res-002', unitId: 'apt-a-201', residentName: 'Andrés Rodríguez', areaId: 'area-2', areaName: 'Cancha Polideportiva', date: '2025-05-26', startTime: '16:00', endTime: '18:00', status: 'confirmed', guests: 8 },
  { id: 'res-003', unitId: 'apt-b-102', residentName: 'Sandra López', areaId: 'area-3', areaName: 'Piscina', date: '2025-05-27', startTime: '10:00', endTime: '12:00', status: 'pending', guests: 4 },
  { id: 'res-004', unitId: 'apt-c-102', residentName: 'Ricardo Herrera', areaId: 'area-1', areaName: 'Salón Social', date: '2025-05-28', startTime: '19:00', endTime: '23:00', status: 'confirmed', guests: 25 },
  { id: 'res-005', unitId: 'apt-a-302', residentName: 'Felipe Sánchez', areaId: 'area-4', areaName: 'Gimnasio', date: '2025-05-29', startTime: '06:00', endTime: '07:30', status: 'confirmed', guests: 1 },
];

// ============== PQRS ==============

export const pqrs: PQRS[] = [
  { id: 'pqrs-001', unitId: 'apt-a-101', residentName: 'Juan Pérez', type: 'complaint', title: 'Tubería dañada en baño', description: 'Detectamos una filtración desde hace 3 días', date: '2025-05-20', status: 'in_progress', priority: 'high', assignedTo: 'Mantenimiento' },
  { id: 'pqrs-002', unitId: 'apt-a-201', residentName: 'Andrés Rodríguez', type: 'request', title: 'Reparación de puerta del ascensor', description: 'La puerta hace ruido y no cierra bien', date: '2025-05-18', status: 'open', priority: 'medium' },
  { id: 'pqrs-003', unitId: 'apt-b-102', residentName: 'Sandra López', type: 'petition', title: 'Instalación de cámara en pasillo', description: 'Solicito mejora de seguridad en el pasillo A-3', date: '2025-05-17', status: 'closed', priority: 'low' },
  { id: 'pqrs-004', unitId: 'apt-c-102', residentName: 'Ricardo Herrera', type: 'complaint', title: 'Ruido en horas de la noche', description: 'Quejas por música fuerte en apto C-402', date: '2025-05-15', status: 'in_progress', priority: 'high', assignedTo: 'Seguridad' },
  { id: 'pqrs-005', unitId: 'apt-a-302', residentName: 'Felipe Sánchez', type: 'suggestion', title: 'Crear zona de juegos para mascotas', description: 'Propongo crear un área dedicada para perros', date: '2025-05-14', status: 'open', priority: 'low' },
  { id: 'pqrs-006', unitId: 'apt-b-201', residentName: 'Cristina Vargas', type: 'complaint', title: 'Falta de luz en estacionamiento', description: 'Varias lámparas están apagadas en sótano 2', date: '2025-05-13', status: 'in_progress', priority: 'high', assignedTo: 'Mantenimiento' },
  { id: 'pqrs-007', unitId: 'apt-c-201', residentName: 'Catalina Morales', type: 'request', title: 'Servicio de limpieza adicional', description: 'Solicitar limpieza extra en áreas comunes', date: '2025-05-12', status: 'closed', priority: 'medium' },
  { id: 'pqrs-008', unitId: 'apt-a-101', residentName: 'Juan Pérez', type: 'complaint', title: 'Invasión de mascotas en áreas comunes', description: 'Encuentro mascotas sin supervisión en piscina', date: '2025-05-11', status: 'open', priority: 'medium' },
  { id: 'pqrs-009', unitId: 'apt-b-302', residentName: 'Mauricio Flores', type: 'petition', title: 'Horario especial para Gym', description: 'Ampliar horario del gimnasio hasta las 22:00', date: '2025-05-10', status: 'closed', priority: 'low' },
  { id: 'pqrs-010', unitId: 'apt-c-302', residentName: 'Esteban Peña', type: 'complaint', title: 'Goteras en apartamento', description: 'Lluvia filtra por el techo en la sala', date: '2025-05-09', status: 'in_progress', priority: 'high', assignedTo: 'Mantenimiento' },
  { id: 'pqrs-011', unitId: 'apt-a-402', residentName: 'Valentina Silva', type: 'request', title: 'Cambio de vidrios en balcón', description: 'Solicito mantenimiento preventivo de vidrios', date: '2025-05-08', status: 'open', priority: 'low' },
  { id: 'pqrs-012', unitId: 'apt-b-401', residentName: 'Natalia Gutiérrez', type: 'suggestion', title: 'Aplicación móvil para reservas', description: 'Facilitar reservas de áreas por app', date: '2025-05-07', status: 'closed', priority: 'low' },
  { id: 'pqrs-013', unitId: 'apt-c-401', residentName: 'Fabio Cortés', type: 'complaint', title: 'Plagas en escaleras', description: 'Detectamos insectos en escaleras A-B', date: '2025-05-06', status: 'in_progress', priority: 'high', assignedTo: 'Servicios Generales' },
  { id: 'pqrs-014', unitId: 'apt-a-301', residentName: 'Andrés Martínez', type: 'petition', title: 'Mejorar señalización de salidas', description: 'Solicitar señalización clara de emergencia', date: '2025-05-05', status: 'open', priority: 'medium' },
  { id: 'pqrs-015', unitId: 'apt-b-302', residentName: 'Mauricio Flores', type: 'complaint', title: 'Daño en cerradura puerta principal', description: 'La cerradura no funciona adecuadamente', date: '2025-05-04', status: 'closed', priority: 'medium' },
];

// ============== VISITORS TODAY ==============

export const visitors: Visitor[] = [
  { id: 'vis-001', name: 'Carlos Martínez', phone: '3001234567', documentId: '1234567890', visitingUnit: 'apt-a-101', checkInTime: '09:30', checkOutTime: '11:45', purpose: 'Entrega de paquete', vehicle: 'Auto', licensePlate: 'ABC123' },
  { id: 'vis-002', name: 'Laura García', phone: '3109876543', documentId: '1234567891', visitingUnit: 'apt-a-201', checkInTime: '10:15', checkOutTime: '12:30', purpose: 'Visita familiar', vehicle: 'Auto', licensePlate: 'XYZ789' },
  { id: 'vis-003', name: 'Técnico TelecOm', phone: '3211234567', documentId: '1234567892', visitingUnit: 'apt-b-102', checkInTime: '11:00', checkOutTime: '13:00', purpose: 'Instalación de cable', vehicle: 'Furgoneta', licensePlate: 'TEL001' },
  { id: 'vis-004', name: 'Plomero Juan', phone: '3119876543', documentId: '1234567893', visitingUnit: 'apt-c-102', checkInTime: '13:30', checkOutTime: undefined, purpose: 'Mantenimiento', vehicle: 'Furgoneta', licensePlate: 'MAN001' },
  { id: 'vis-005', name: 'Sofía Rodríguez', phone: '3001111111', documentId: '1234567894', visitingUnit: 'apt-a-301', checkInTime: '14:00', checkOutTime: undefined, purpose: 'Visita social', vehicle: undefined, licensePlate: undefined },
  { id: 'vis-006', name: 'Repartidor Amazon', phone: '3212222222', documentId: '1234567895', visitingUnit: 'apt-b-201', checkInTime: '14:30', checkOutTime: '14:45', purpose: 'Entrega de compra', vehicle: 'Bicicleta', licensePlate: 'AMZN123' },
  { id: 'vis-007', name: 'Dr. Pérez', phone: '3013333333', documentId: '1234567896', visitingUnit: 'apt-c-201', checkInTime: '15:00', checkOutTime: undefined, purpose: 'Consulta médica', vehicle: undefined, licensePlate: undefined },
  { id: 'vis-008', name: 'Empresa de Limpieza', phone: '3214444444', documentId: '1234567897', visitingUnit: 'Áreas comunes', checkInTime: '08:00', checkOutTime: '16:30', purpose: 'Limpieza general', vehicle: 'Furgoneta', licensePlate: 'LIM001' },
];

// ============== PROVIDERS ==============

export const providers: Provider[] = [
  { id: 'prov-001', name: 'Servicios Generales Los Pinos', category: 'Limpieza', email: 'admin@sglp.com', phone: '3005555555', taxId: '900123456-1', rating: 4.8, active: true },
  { id: 'prov-002', name: 'TecniGas Colombia', category: 'Instalaciones', email: 'info@tenigas.com', phone: '3006666666', taxId: '800234567-2', rating: 4.5, active: true },
  { id: 'prov-003', name: 'Mantenimiento JM', category: 'Mantenimiento', email: 'contacto@mantjm.com', phone: '3007777777', taxId: '710345678-3', rating: 4.3, active: true },
  { id: 'prov-004', name: 'Seguridad 24hrs', category: 'Vigilancia', email: 'operaciones@seg24.com', phone: '3008888888', taxId: '860456789-4', rating: 4.9, active: true },
  { id: 'prov-005', name: 'Plomería Express', category: 'Plomería', email: 'soporte@plomex.com', phone: '3009999999', taxId: '920567890-5', rating: 4.2, active: true },
  { id: 'prov-006', name: 'Electricidad & Cia', category: 'Electricidad', email: 'ventas@elecci.com', phone: '3010101010', taxId: '810678901-6', rating: 4.6, active: true },
];

// ============== DOCUMENTS ==============

export const documents: Document[] = [
  { id: 'doc-001', title: 'Reglamento General del Conjunto Residencial Los Pinos', type: 'regulation', uploadDate: '2024-01-15', url: '/docs/reglamento.pdf', size: '2.4 MB' },
  { id: 'doc-002', title: 'Acta Asamblea General 2025', type: 'assembly_act', uploadDate: '2025-04-20', url: '/docs/acta-asamblea-2025.pdf', size: '1.8 MB' },
  { id: 'doc-003', title: 'Acta Asamblea General 2024', type: 'assembly_act', uploadDate: '2024-04-15', url: '/docs/acta-asamblea-2024.pdf', size: '1.6 MB' },
  { id: 'doc-004', title: 'Política de Convivencia', type: 'policy', uploadDate: '2024-06-10', url: '/docs/politica-convivencia.pdf', size: '0.9 MB' },
  { id: 'doc-005', title: 'Notificación de Mantenimiento Anual', type: 'notice', uploadDate: '2025-05-01', url: '/docs/notificacion-mantenimiento.pdf', size: '0.7 MB' },
  { id: 'doc-006', title: 'Manual de Seguridad y Emergencias', type: 'regulation', uploadDate: '2023-12-01', url: '/docs/manual-seguridad.pdf', size: '3.2 MB' },
  { id: 'doc-007', title: 'Estado Financiero Conjunto 2024', type: 'policy', uploadDate: '2025-03-15', url: '/docs/estado-financiero-2024.pdf', size: '2.1 MB' },
];

// Helper functions

export function getUnitById(unitId: string): Unit | undefined {
  return units.find(u => u.id === unitId);
}

export function getResidentById(residentId: string): Resident | undefined {
  return residents.find(r => r.id === residentId);
}

export function getPaymentsByUnit(unitId: string): Payment[] {
  return payments.filter(p => p.unitId === unitId).sort((a, b) => b.month.localeCompare(a.month));
}

export function getOverduePayments(): Payment[] {
  return payments.filter(p => p.status === 'overdue');
}

export function getPQRSByUnit(unitId: string): PQRS[] {
  return pqrs.filter(p => p.unitId === unitId);
}

export function getReservationsByUnit(unitId: string): Reservation[] {
  return reservations.filter(r => r.unitId === unitId);
}

export function getCommonAreaById(areaId: string): CommonArea | undefined {
  return commonAreas.find(a => a.id === areaId);
}

export function getOpenPQRS(): PQRS[] {
  return pqrs.filter(p => p.status !== 'closed');
}

export function getTotalDefaulters(): number {
  const defaultingUnits = new Set(payments.filter(p => p.status === 'overdue').map(p => p.unitId));
  return defaultingUnits.size;
}

export function getTotalPortfolioValue(): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

export function getCollectionRate(): number {
  const totalInvoiced = payments.length * 570000; // Avg amount per invoice
  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  return (totalCollected / totalInvoiced) * 100;
}
