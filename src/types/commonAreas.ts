/**
 * Types for Common Areas (Zonas Comunes) Module
 * Sistema de gestión de espacios comunes del conjunto
 */

export interface CommonArea {
  id: string;
  name: string;
  description?: string;
  image: string;              // URL o base64
  status: 'active' | 'maintenance' | 'unavailable';
  capacity: number;           // Número máximo de personas
  rules: string[];            // Reglamentación
  amenities?: string[];       // Servicios/amenidades
  bookingEnabled: boolean;    // ¿Se pueden hacer reservas?
  history: AreaBooking[];
  createdAt: string;
  updatedAt: string;
}

export interface AreaBooking {
  id: string;
  areaId: string;
  resident: string;
  residentId?: string;
  unit: string;
  date: string;               // YYYY-MM-DD
  timeSlot: string;           // HH:MM - HH:MM
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface CommonAreaFilter {
  status?: CommonArea['status'];
  capacity?: number;          // Mínima capacidad
  bookingEnabled?: boolean;
  search?: string;            // Búsqueda por nombre
}

export interface CommonAreaStats {
  total: number;
  active: number;
  maintenance: number;
  unavailable:number;
  bookingsToday: number;
  averageCapacity: number;
}

export const AREA_STATUS_MAP: Record<CommonArea['status'], { label: string; class: string; color: string }> = {
  active: {
    label: 'Activa',
    class: 'bg-emerald-500/20 text-emerald-400',
    color: 'success'
  },
  maintenance: {
    label: 'Mantenimiento',
    class: 'bg-amber-500/20 text-amber-400',
    color: 'warning'
  },
  unavailable: {
    label: 'No disponible',
    class: 'bg-red-500/20 text-red-400',
    color: 'error'
  }
};

export const BOOKING_STATUS_MAP: Record<AreaBooking['status'], { label: string; class: string; color: string }> = {
  pending: {
    label: 'Pendiente',
    class: 'bg-blue-500/20 text-blue-400',
    color: 'info'
  },
  confirmed: {
    label: 'Confirmada',
    class: 'bg-emerald-500/20 text-emerald-400',
    color: 'success'
  },
  completed: {
    label: 'Completada',
    class: 'bg-gray-500/20 text-gray-400',
    color: 'muted'
  },
  cancelled: {
    label: 'Cancelada',
    class: 'bg-red-500/20 text-red-400',
    color: 'error'
  }
};

// Ejemplos de zonas comunes típicas
export const COMMON_AREA_EXAMPLES = [
  {
    name: 'Sala de Juntas',
    capacity: 20,
    amenities: ['Proyector', 'Pizarra', 'Aire acondicionado']
  },
  {
    name: 'Gimnasio',
    capacity: 15,
    amenities: ['Máquinas cardiovasculares', 'Pesas', 'Espejos']
  },
  {
    name: 'Piscina',
    capacity: 30,
    amenities: ['Vestuarios', 'Duchas', 'Sombrillas']
  },
  {
    name: 'Zona de Juegos (Niños)',
    capacity: 20,
    amenities: ['Columpios', 'Resbaladilla', 'Arenero']
  },
  {
    name: 'Salón Social',
    capacity: 50,
    amenities: ['Mesas', 'Sillas', 'Cocina', 'TV']
  },
  {
    name: 'Cancha Deportiva',
    capacity: 40,
    amenities: ['Canchas de fútbol', 'Canchas de tenis', 'Iluminación']
  },
  {
    name: 'Parque',
    capacity: 100,
    amenities: ['Árboles de sombra', 'Bancas', 'Áreas verdes']
  },
  {
    name: 'Zona de Mascotas',
    capacity: 15,
    amenities: ['Área cerrada', 'Agua potable', 'Bancas']
  }
];
