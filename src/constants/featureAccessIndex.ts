/**
 * Feature Access Control System Exports
 * Integración de 213 funciones en matriz de control de acceso
 * v4.0 - 2026-04-23
 *
 * Archivos incluidos:
 * - src/types/features.ts - Definición de 213 FeatureIds
 * - src/constants/featureAccessMatrix.ts - Matriz 213×7 de accesos
 * - src/utils/featureAccess.ts - Utilidades de auditoría y análisis
 */

export {
  type FeatureId,
  type Feature,
  FEATURES_BY_MODULE,
  MODULE_CODES,
} from '@/types/features';

export {
  FEATURE_ACCESS_MATRIX,
  getFeatureAccess,
  hasFeatureAccess,
  getFeaturesForRole,
  FEATURE_TO_MODULE,
} from '@/constants/featureAccessMatrix';

export {
  generateRoleAccessReport,
  analyzeRoleByModule,
  compareRoleAccess,
  getFeaturesByAccessLevel,
  auditFeatureAccess,
  complianceCheck,
  exportMatrixAsCSV,
  getMatrixStatistics,
} from '@/utils/featureAccess';

export { useRoleAccess } from '@/hooks/useRoleAccess';
