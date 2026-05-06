export {
  type FeatureDefinition,
  type FeatureId,
  type FeaturePreset,
  MODULE_CODES,
} from '@/types/features';

export {
  ALL_FEATURES,
  FEATURE_BY_ID,
  FEATURE_CATALOG,
  FEATURES_BY_MODULE,
} from '@/constants/featureCatalog';

export {
  FEATURE_ACCESS_MATRIX,
  FEATURE_TO_MODULE,
  getFeatureAccess,
  getFeaturesForRole,
  hasFeatureAccess,
} from '@/constants/featureAccessMatrix';

export {
  analyzeRoleByModule,
  auditFeatureAccess,
  compareRoleAccess,
  complianceCheck,
  exportMatrixAsCSV,
  generateRoleAccessReport,
  getFeaturesByAccessLevel,
  getMatrixStatistics,
} from '@/utils/featureAccess';

export { useRoleAccess } from '@/hooks/useRoleAccess';
