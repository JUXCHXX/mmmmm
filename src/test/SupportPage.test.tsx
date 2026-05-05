import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    // useAppStore is called without selector in SupportPage, so just return object
    mockApp.mockReturnValue({ supportTickets: [
      { id: 'ST1', subject: 'Prueba', status: 'open', priority: 'low', date: '2026-02-01', category: 'Acceso', description: 'desc' }
    ], addSupportTicket: vi.fn() });
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
    mockAuth.mockImplementation(selector => selector({ user: { roleId: 'admin', id: 'bar' } }));
    render(<SupportPage />);
    const newBtn = screen.getByRole('button', { name: /Nuevo Ticket/i });
    fireEvent.click(newBtn);
    expect(screen.getByText(/Crear Ticket/i)).toBeInTheDocument();

    const subjectInput = screen.getByLabelText(/Asunto/i);
    fireEvent.change(subjectInput, { target: { value: 'Test subject' } });
    const descInput = screen.getByLabelText(/Descripción/i);
    fireEvent.change(descInput, { target: { value: 'Test desc' } });

    const sendBtn = screen.getByRole('button', { name: /Crear Ticket/i });
    fireEvent.click(sendBtn);
    expect(add).toHaveBeenCalled();
  });
});
