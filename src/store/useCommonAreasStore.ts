import { create } from 'zustand';
import { CommonArea, AreaBooking } from '@/types/commonAreas';

export interface CommonAreasStore {
  // State
  commonAreas: CommonArea[];
  selectedAreaId: string | null;

  // Actions
  addCommonArea: (area: CommonArea) => void;
  updateCommonArea: (id: string, area: Partial<CommonArea>) => void;
  deleteCommonArea: (id: string) => void;
  selectCommonArea: (id: string | null) => void;
  getCommonAreaById: (id: string) => CommonArea | undefined;

  // Bookings
  addBooking: (areaId: string, booking: AreaBooking) => void;
  updateBooking: (areaId: string, bookingId: string, status: AreaBooking['status']) => void;
  getBookingsByArea: (areaId: string) => AreaBooking[];
}

// Mock data
const MOCK_COMMON_AREAS: CommonArea[] = [
  {
    id: 'CA1',
    name: 'Piscina Olímpica',
    description: 'Piscina climatizada de uso compartido',
    image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=400&h=300&fit=crop',
    status: 'active',
    capacity: 40,
    rules: [
      'Obligatorio el uso de gorro de baño',
      'Ducha previa obligatoria',
      'Horario: 6:00 AM - 9:00 PM',
      'Menores de 10 años requieren supervisor',
      'Se prohíbe vidrio y objetos punzocortantes'
    ],
    amenities: ['Vestuarios', 'Duchas', 'Sombrillas', 'Servicios'],
    bookingEnabled: false,
    history: [],
    createdAt: '2024-01-15',
    updatedAt: '2026-02-17'
  },
  {
    id: 'CA2',
    name: 'Gimnasio Full Equipado',
    description: 'Equipamiento moderno para fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    status: 'active',
    capacity: 25,
    rules: [
      'Obligatorio desinfectar equipos después de usar',
      'No se permite fumar ni consumir alimentos',
      'Horario: 5:00 AM - 10:00 PM',
      'Máximo 2 horas consecutivas por usuario'
    ],
    amenities: ['Máquinas cardiovasculares', 'Pesas', 'Espejos', 'Aire acondicionado'],
    bookingEnabled: false,
    history: [],
    createdAt: '2024-01-15',
    updatedAt: '2026-02-17'
  },
  {
    id: 'CA3',
    name: 'Salón Social y Conferencias',
    description: 'Espacio multiusos para eventos y reuniones',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    status: 'active',
    capacity: 80,
    rules: [
      'Debe realizar reserva previa',
      'Horario: 8:00 AM - 10:00 PM',
      'Máximo 4 horas por evento',
      'Responsable debe dejar el espacio limpio',
      'Se prohíbe eventos después de las 22:00'
    ],
    amenities: ['Mesas', 'Sillas', 'Proyector', 'Pizarra blanca', 'Cocina'],
    bookingEnabled: true,
    history: [],
    createdAt: '2024-01-15',
    updatedAt: '2026-02-17'
  },
  {
    id: 'CA4',
    name: 'Cancha de Tenis',
    description: 'Cancha profesional de tenis con iluminación',
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=400&h=300&fit=crop',
    status: 'active',
    capacity: 8,
    rules: [
      'Debe realizar reserva previa',
      'Horario: 6:00 AM - 8:00 PM',
      'Máximo 1.5 horas por reserva',
      'Se debe utilizar calzado deportivo',
      'Prohibido jugar con pelotas de color naranja intenso'
    ],
    amenities: ['Iluminación nocturna', 'Bancas', 'Zona de descanso'],
    bookingEnabled: true,
    history: [],
    createdAt: '2024-01-15',
    updatedAt: '2026-02-17'
  },
  {
    id: 'CA5',
    name: 'Parque Infantil',
    description: 'Área de juegos para niños menores de 12 años',
    image: 'https://images.unsplash.com/photo-1552272496-92b954094f46?w=400&h=300&fit=crop',
    status: 'active',
    capacity: 30,
    rules: [
      'Niños menores de 8 años requieren supervisor',
      'Prohibido jugar con objetos punzocortantes',
      'Se prohíbe consumir vidrio o articulos peligrosos',
      'Horario: 8:00 AM - 6:00 PM',
      'Supervisor responsable de seguridad'
    ],
    amenities: ['Columpios', 'Resbaladilla', 'Arenero', 'Zona de sombra'],
    bookingEnabled: false,
    history: [],
    createdAt: '2024-01-15',
    updatedAt: '2026-02-17'
  },
  {
    id: 'CA6',
    name: 'Zona de Mascotas',
    description: 'Área cerrada y segura para pasear mascotas',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop',
    status: 'active',
    capacity: 15,
    rules: [
      'Mascotas deben estar vacunadas',
      'Obligatorio recoger residuos',
      'Se prohíben mascotas agresivas',
      'Horario: 8:00 AM - 6:00 PM',
      'Máximo 3 mascotas por persona'
    ],
    amenities: ['Agua potable', 'Bancas', 'Bolsas para residuos'],
    bookingEnabled: false,
    history: [],
    createdAt: '2024-01-15',
    updatedAt: '2026-02-17'
  }
];

export const useCommonAreasStore = create<CommonAreasStore>((set, get) => ({
  commonAreas: MOCK_COMMON_AREAS,
  selectedAreaId: null,

  addCommonArea: (area) =>
    set((state) => ({
      commonAreas: [...state.commonAreas, area]
    })),

  updateCommonArea: (id, updates) =>
    set((state) => ({
      commonAreas: state.commonAreas.map((area) =>
        area.id === id ? { ...area, ...updates, updatedAt: new Date().toISOString() } : area
      )
    })),

  deleteCommonArea: (id) =>
    set((state) => ({
      commonAreas: state.commonAreas.filter((area) => area.id !== id),
      selectedAreaId: state.selectedAreaId === id ? null : state.selectedAreaId
    })),

  selectCommonArea: (id) =>
    set(() => ({
      selectedAreaId: id
    })),

  getCommonAreaById: (id) => {
    const { commonAreas } = get();
    return commonAreas.find((area) => area.id === id);
  },

  addBooking: (areaId, booking) =>
    set((state) => ({
      commonAreas: state.commonAreas.map((area) =>
        area.id === areaId
          ? { ...area, history: [...area.history, booking] }
          : area
      )
    })),

  updateBooking: (areaId, bookingId, status) =>
    set((state) => ({
      commonAreas: state.commonAreas.map((area) =>
        area.id === areaId
          ? {
              ...area,
              history: area.history.map((booking) =>
                booking.id === bookingId ? { ...booking, status } : booking
              )
            }
          : area
      )
    })),

  getBookingsByArea: (areaId) => {
    const { commonAreas } = get();
    const area = commonAreas.find((a) => a.id === areaId);
    return area?.history || [];
  }
}));

export default useCommonAreasStore;
