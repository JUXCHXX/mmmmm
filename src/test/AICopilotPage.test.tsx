import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AICopilotPage from '../pages/modules/AICopilotPage';
import { useAuthStore } from '../store/useAuthStore';

vi.mock('../store/useAuthStore');

const mockAuth = useAuthStore as unknown as vi.Mock;

describe('AICopilotPage role-specific content', () => {
  beforeAll(() => {
    (global as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => vi.resetAllMocks());

  it('shows role-specific content for consejo role', () => {
    mockAuth.mockImplementation((selector) => selector({ user: { roleId: 'consejo', id: 'some' } }));

    const { container } = render(<AICopilotPage />);

    expect(screen.getByText('Reportes Inteligentes')).toBeInTheDocument();
    expect(screen.getByText(/Visualizaci.n y reportes sin capacidad de acci.n/i)).toBeInTheDocument();
    expect(screen.getByText(/^Reportes$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Visualizaci.n$/i)).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
});
