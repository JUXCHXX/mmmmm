/**
 * EJEMPLOS DE INTEGRACIÓN - Sistema de Control de Acceso por Funciones
 * Casos de uso reales en componentes BUNTY
 * v4.0 - 2026-04-23
 */

// ============================================
// 1. COMPONENTE: Gestor de Pagos con Control de Función
// ============================================

import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useState } from 'react';

export function PaymentAgreementsPage() {
  const { canAccessFeature, canPerformFeatureAction, getFeatureAccessLevel } = useRoleAccess();
  const [agreements, setAgreements] = useState([]);

  // Verificar acceso base a la función
  if (!canAccessFeature('payment_agreements')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p>No tienes acceso a esta función.</p>
      </div>
    );
  }

  // Verificar si puede crear acuerdos
  const canCreate = canPerformFeatureAction('payment_agreements', 'create');

  // Verificar si puede editar
  const canEdit = canPerformFeatureAction('payment_agreements', 'edit');

  // Obtener nivel para UI dinámico
  const accessLevel = getFeatureAccessLevel('payment_agreements');

  return (
    <div>
      <h1>Acuerdos de Pago</h1>

      {canCreate && (
        <button className="btn btn-primary" onClick={() => createNewAgreement()}>
          + Nuevo Acuerdo
        </button>
      )}

      {accessLevel === 'READ_ONLY' && (
        <div className="alert alert-info">Solo puedes ver acuerdos, no puedes modificar.</div>
      )}

      <table>
        {agreements.map((agreement) => (
          <tr key={agreement.id}>
            <td>{agreement.name}</td>
            <td>{agreement.amount}</td>
            {canEdit && (
              <td>
                <button onClick={() => editAgreement(agreement.id)}>Editar</button>
              </td>
            )}
          </tr>
        ))}
      </table>
    </div>
  );
}

// ============================================
// 2. COMPONENTE: Dashboard del Portero con Funciones Especializadas
// ============================================

export function PorteriaDashboard() {
  const { canAccessFeature, getAccessibleFeatures } = useRoleAccess();

  // Portería (P6) tiene funciones muy específicas
  const securityFeatures = [
    'porteria_bitacora',
    'ingress_registry',
    'security_board',
    'express_porteria_panel',
    'blocked_unit_alerts',
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {securityFeatures.map((feature) => (
        canAccessFeature(feature) && (
          <FeatureCard key={feature} featureId={feature} />
        )
      ))}
    </div>
  );
}

// ============================================
// 3. COMPONENTE: Control de Elementos UI Dinámico
// ============================================

export function ResidentProfile() {
  const { canAccessFeature, getFeatureAccessLevel } = useRoleAccess();

  // Residentes (P4) solo pueden editar datos propios
  const ownsDataLevel = getFeatureAccessLevel('resident_onboarding') === 'OWN_DATA_ONLY';

  return (
    <div>
      <h2>Mi Perfil</h2>

      <input
        type="text"
        value="Juan Pérez"
        disabled={!canAccessFeature('resident_onboarding', 'LIMITED')}
      />

      {canAccessFeature('resident_documents') && (
        <section>
          <h3>Mis Documentos</h3>
          <DocumentUploader />
        </section>
      )}

      {canAccessFeature('emergency_contacts') && (
        <section>
          <h3>Contactos de Emergencia</h3>
          <EmergencyContactsForm />
        </section>
      )}
    </div>
  );
}

// ============================================
// 4. COMPONENTE: Sistema de Permisos Multi-Nivel
// ============================================

export function AdminPanelWithFeatureAccess() {
  const { canPerformFeatureAction, getFeatureAccessLevel, user } = useRoleAccess();

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Usuario: {user?.name} ({user?.roleId})</p>

      {canPerformFeatureAction('payment_agreements', 'create') && (
        <section className="admin-section">
          <h2>Gestión de Pagos</h2>
          <PaymentPanel />
        </section>
      )}

      {canPerformFeatureAction('staff_management', 'delete') ? (
        <section className="admin-section">
          <h2>Gestión de Personal</h2>
          <div className="alert alert-warning">
            Tienes acceso completo incluyendo eliminación
          </div>
          <StaffManagement mode="full" />
        </section>
      ) : canPerformFeatureAction('staff_management', 'view') ? (
        <section className="admin-section">
          <h2>Personal (Solo Lectura)</h2>
          <StaffManagement mode="readonly" />
        </section>
      ) : null}
    </div>
  );
}

// ============================================
// 5. COMPONENTE: Guardia de Ruta basada en Función
// ============================================

import { Navigate } from 'react-router-dom';

export function FeatureProtectedRoute({ featureId, children, minimumLevel = 'LIMITED' }) {
  const { canAccessFeature } = useRoleAccess();

  if (!canAccessFeature(featureId, minimumLevel)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

// Uso:
// <Route
//   path="/payment-agreements"
//   element={
//     <FeatureProtectedRoute featureId="payment_agreements" minimumLevel="FULL_ACCESS">
//       <PaymentAgreementsPage />
//     </FeatureProtectedRoute>
//   }
// />

// ============================================
// 6. HOOK PERSONALIZADO: Feature Access Context
// ============================================

import { createContext, useContext } from 'react';

const FeatureAccessContext = createContext(null);

export function FeatureAccessProvider({ children }) {
  const roleAccess = useRoleAccess();

  return (
    <FeatureAccessContext.Provider value={roleAccess}>
      {children}
    </FeatureAccessContext.Provider>
  );
}

export function useFeatureAccess() {
  return useContext(FeatureAccessContext);
}

// ============================================
// 7. COMPONENTE: Monitor de Cumplimiento de Reglas
// ============================================

import { complianceCheck, getMatrixStatistics } from '@/utils/featureAccess';
import { useEffect, useState } from 'react';

export function ComplianceMonitor() {
  const [compliance, setCompliance] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Ejecutar check de cumplimiento
    const check = complianceCheck();
    setCompliance(check);

    // Obtener estadísticas
    const statistics = getMatrixStatistics();
    setStats(statistics);
  }, []);

  if (!compliance || !stats) return <div>Cargando...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3>Validación de Reglas de Negocio</h3>

      {compliance.passed ? (
        <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">
          ✅ Todas las reglas cumplidas ({compliance.totalIssues} issues)
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
          ❌ {compliance.totalIssues} problemas detectados
          {compliance.issues.map((issue) => (
            <div key={`${issue.featureId}-${issue.roleId}`} className="text-sm mt-2">
              • {issue.issue}: {issue.featureId} para {issue.roleId}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h4>Estadísticas de la Matriz</h4>
        <ul>
          <li>Total de funciones: {stats.totalFeatures}</li>
          <li>Total de módulos: {stats.totalModules}</li>
          <li>Celdas de matriz: {stats.totalCells}</li>
          <li>
            Distribución:
            <ul className="ml-4 text-sm">
              <li>FULL_ACCESS: {stats.distribution.FULL_ACCESS.count} ({stats.distribution.FULL_ACCESS.percentage}%)</li>
              <li>LIMITED: {stats.distribution.LIMITED.count} ({stats.distribution.LIMITED.percentage}%)</li>
              <li>READ_ONLY: {stats.distribution.READ_ONLY.count} ({stats.distribution.READ_ONLY.percentage}%)</li>
              <li>NONE: {stats.distribution.NONE.count} ({stats.distribution.NONE.percentage}%)</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// 8. COMPONENTE: Renderizado Condicional Múltiple
// ============================================

export function FeatureConditionalRender() {
  const { canAccessFeature, getFeatureAccessLevel } = useRoleAccess();

  const adminFeatures = [
    'budget_execution',
    'accounting_traceability',
    'cost_centers',
    'erp_integration',
  ];

  return (
    <div className="space-y-4">
      <h2>Funciones Disponibles</h2>

      <div className="grid grid-cols-2 gap-4">
        {adminFeatures.map((feature) => {
          const level = getFeatureAccessLevel(feature);

          return (
            <div
              key={feature}
              className={`p-4 rounded border ${
                level === 'FULL_ACCESS'
                  ? 'bg-green-50 border-green-300'
                  : level === 'READ_ONLY'
                    ? 'bg-blue-50 border-blue-300'
                    : level === 'LIMITED'
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-gray-50 border-gray-300'
              }`}
            >
              <h3>{feature}</h3>
              <p className="text-sm">Acceso: {level}</p>

              {level !== 'NONE' && (
                <button className="mt-2 btn btn-sm" onClick={() => openFeature(feature)}>
                  Abrir
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 9. SETUP: Inicializar en App.tsx
// ============================================

import { FeatureAccessProvider } from '@/context/FeatureAccess';

export function App() {
  return (
    <FeatureAccessProvider>
      <YourAppContent />
    </FeatureAccessProvider>
  );
}

// ============================================
// 10. TESTING: Ejemplo de Test
// ============================================

import { renderHook } from '@testing-library/react';
import { useRoleAccess } from '@/hooks/useRoleAccess';

describe('useRoleAccess - Feature Access', () => {
  it('should allow super_admin to access all features', () => {
    // Mock auth store
    const { result } = renderHook(() => useRoleAccess(), {
      wrapper: ({ children }) => (
        <AuthProvider user={{ roleId: 'super_admin' }}>
          {children}
        </AuthProvider>
      ),
    });

    expect(result.current.canAccessFeature('payment_agreements')).toBe(true);
    expect(result.current.getFeatureAccessLevel('payment_agreements')).toBe('FULL_ACCESS');
  });

  it('should restrict propietario to own data only', () => {
    const { result } = renderHook(() => useRoleAccess(), {
      wrapper: ({ children }) => (
        <AuthProvider user={{ roleId: 'propietario' }}>
          {children}
        </AuthProvider>
      ),
    });

    expect(result.current.canPerformFeatureAction('payment_agreements', 'create')).toBe(true);
    expect(result.current.canPerformFeatureAction('portfolio_board', 'view')).toBe(false);
  });
});
