import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import Sidebar from '../components/layout/Sidebar';
import { useAuthStore } from '../store/useAuthStore';

vi.mock('../store/useAuthStore');

const mockAuth = useAuthStore as unknown as Mock;

const setRole = (roleId: string | null) => {
  mockAuth.mockImplementation((selector) => selector({ user: roleId ? { roleId } : null }));
};

const openSection = (title: string) => {
  fireEvent.click(screen.getByTitle(title));
};

describe('Sidebar role filtering', () => {
  afterEach(() => vi.resetAllMocks());

  it('shows super admin module labels across sections', () => {
    setRole('super_admin');
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Dashboard Corporativo/i)).toBeInTheDocument();
    expect(screen.getByText(/^Conjuntos$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Residentes$/i)).toBeInTheDocument();

    openSection('INTELIGENCIA');
    expect(screen.getByText(/IA Copiloto PH/i)).toBeInTheDocument();
    expect(screen.getByText(/Anal.tica/i)).toBeInTheDocument();

    openSection('ADMINISTRACION');
    expect(screen.getByText(/Configuracion Global/i)).toBeInTheDocument();
    expect(screen.getByText(/Soporte Global/i)).toBeInTheDocument();
  });

  it('shows admin menu with local management labels', () => {
    setRole('admin');
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Dashboard del Conjunto/i)).toBeInTheDocument();
    expect(screen.getByText(/^Conjuntos$/i)).toBeInTheDocument();

    openSection('INTELIGENCIA');
    expect(screen.getByText(/^IA Copiloto$/i)).toBeInTheDocument();

    openSection('ADMINISTRACION');
    expect(screen.getByText(/Configuracion del Conjunto/i)).toBeInTheDocument();
    expect(screen.getByText(/Centro de Ayuda/i)).toBeInTheDocument();
  });

  it('hides settings for consejo but keeps readable modules', () => {
    setRole('consejo');
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/^Dashboard$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Conjuntos$/i)).toBeInTheDocument();

    openSection('INTELIGENCIA');
    expect(screen.getByText(/^IA Copiloto$/i)).toBeInTheDocument();

    expect(screen.queryByText(/Configuracion/i)).toBeNull();
  });
});
