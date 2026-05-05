import React from 'react';
import { render, screen } from '@testing-library/react';
import AICopilotPage from '../pages/modules/AICopilotPage';
import { useAuthStore } from '../store/useAuthStore';
import { vi } from 'vitest';

vi.mock('../store/useAuthStore');
const mockAuth = useAuthStore as unknown as vi.Mock;

describe('AICopilotPage role-specific content', () => {
  beforeAll(() => {
    // vitest/jsdom doesn't include ResizeObserver; recharts uses it
    (global as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  afterEach(() => vi.resetAllMocks());

  it('shows role-specific content for consejo role', () => {
    mockAuth.mockImplementation(selector => selector({ user: { roleId: 'consejo', id: 'some' } }));
    const { container } = render(<AICopilotPage />);
    expect(screen.getByText('Reportes Inteligentes')).toBeInTheDocument();
    expect(screen.getByText(/Solo Lectura/i)).toBeInTheDocument();
    // Just check that the component renders without crashing
    expect(container).toBeInTheDocument();
  });
});
