import type { AccessLevel, RoleId } from '@/types/roles';
import type { FeatureId } from '@/types/features';
import { ALL_FEATURES } from '@/constants/featureCatalog';

const ACCESS_ORDER: Record<AccessLevel, number> = {
  NONE: 0,
  OWN_DATA_ONLY: 1,
  READ_ONLY: 2,
  LIMITED: 3,
  FULL_ACCESS: 4,
};

export const FEATURE_ACCESS_MATRIX = Object.fromEntries(
  ALL_FEATURES.map((feature) => [feature.id, feature.access]),
) as Record<FeatureId, Record<RoleId, AccessLevel>>;

export const FEATURE_TO_MODULE = Object.fromEntries(
  ALL_FEATURES.map((feature) => [feature.id, feature.moduleCode]),
) as Record<FeatureId, string>;

export function getFeatureAccess(featureId: FeatureId, roleId: RoleId): AccessLevel {
  return FEATURE_ACCESS_MATRIX[featureId]?.[roleId] ?? 'NONE';
}

export function hasFeatureAccess(
  featureId: FeatureId,
  roleId: RoleId,
  minimumLevel: AccessLevel = 'LIMITED',
): boolean {
  const currentLevel = getFeatureAccess(featureId, roleId);
  return ACCESS_ORDER[currentLevel] >= ACCESS_ORDER[minimumLevel];
}

export function getFeaturesForRole(roleId: RoleId): FeatureId[] {
  return ALL_FEATURES
    .filter((feature) => feature.access[roleId] !== 'NONE')
    .map((feature) => feature.id);
}
