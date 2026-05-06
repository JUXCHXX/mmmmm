import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SupportPage from '../pages/modules/SupportPage';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { vi } from 'vitest';

vi.mock('../store/useAuthStore');
vi.mock('../store/useAppStore');

const mockAuth = useAuthStore as unknown as vi.Mock;
const mockApp = useAppStore as unknown as vi.Mock;

describe('SupportPage behaviour', () => {
  beforeEach(() => {
    mockApp.mockReturnValue({
      supportTickets: [
        { id: 'ST1', subject: 'Prueba', status: 'open', priority: 'low', date: '2026-02-01', category: 'Acceso', description: 'desc' },
      ],
      addSupportTicket: vi.fn(),
    });
  });

  afterEach(() => vi.resetAllMocks());

  it('renders existing ticket regardless of role', () => {
    mockAuth.mockReturnValue({ user: { roleId: 'consejo', id: 'foo' } });
    render(<SupportPage />);
    expect(screen.getByText(/Prueba/i)).toBeInTheDocument();
  });

  it('opens creation form and calls store when creating', () => {
    const add = vi.fn();
    mockApp.mockReturnValue({ supportTickets: [], addSupportTicket: add });
    mockAuth.mockImplementation((selector) => selector({ user: { roleId: 'admin', id: 'bar' } }));
    render(<SupportPage />);

    fireEvent.click(screen.getByRole('button', { name: /Nuevo Ticket/i }));
    expect(screen.getByText(/Crear Ticket/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Error al pagar con PSE/i), {
      target: { value: 'Test subject' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Proporciona toda la informaci/i), {
      target: { value: 'Test desc' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Crear Ticket/i }));
    expect(add).toHaveBeenCalled();
  });
});
