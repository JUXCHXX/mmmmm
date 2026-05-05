import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../components/layout/Sidebar';
import { useAuthStore } from '../store/useAuthStore';
import { ROLES } from '../types/roles';
import { vi, describe, it, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../store/useAuthStore');

const mockAuth = useAuthStore as unknown as Mock;

const setRole = (roleId: string | null) => {
  mockAuth.mockImplementation(selector => selector({ user: roleId ? { roleId } : null }));
};

describe('Sidebar role filtering', () => {
  afterEach(() => vi.resetAllMocks());

  it('shows super admin menu', () => {
    setRole('super_admin');
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText(/Dashboard Corporativo/i)).toBeInTheDocument();
    expect(screen.getByText(/IA Copiloto PH/i)).toBeInTheDocument();
    expect(screen.getByText(/Conjuntos/i)).toBeInTheDocument();
    expect(screen.getByText(/Configuración Global/i)).toBeInTheDocument();
    expect(screen.getByText(/Soporte Global/i)).toBeInTheDocument();
    expect(screen.getByText(/Centro de Conocimiento/i)).toBeInTheDocument();
    expect(screen.getByText(/Auditoría y Logs/i)).toBeInTheDocument();
  });

  it('shows admin menu without global items', () => {
    setRole('admin');
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText(/Dashboard del Conjunto/i)).toBeInTheDocument();
    expect(screen.getByText(/IA Copiloto/i)).toBeInTheDocument();
    expect(screen.queryByText(/Conjuntos/i)).toBeNull();
    expect(screen.queryByText(/Configuración Global/i)).toBeNull();
    expect(screen.getByText(/Configuración del Conjunto/i)).toBeInTheDocument();
    expect(screen.getByText(/Centro de Ayuda/i)).toBeInTheDocument();
    expect(screen.queryByText(/Centro de Conocimiento/i)).toBeNull();
    expect(screen.queryByText(/Auditoría y Logs/i)).toBeNull();
  });

  it('shows council executive menu', () => {
    setRole('consejo');
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByText(/Dashboard Ejecutivo/i)).toBeInTheDocument();
    expect(screen.getByText(/IA – Reportes Inteligentes/i)).toBeInTheDocument();
    expect(screen.getByText(/Finanzas \(solo lectura\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Actas y Documentos/i)).toBeInTheDocument();
    expect(screen.getByText(/PQRS \(consulta\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Centro de Ayuda/i)).toBeInTheDocument();
    expect(screen.queryByText(/Configuración/i)).toBeNull();
  });
});
