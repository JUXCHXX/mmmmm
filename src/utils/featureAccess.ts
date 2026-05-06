/**
 * Feature Access Control Utilities
 * Helper functions for working with the 213-function access matrix
 * v4.0 - 2026-04-23
 */

import type { FeatureId } from '@/types/features';
import type { RoleId, AccessLevel } from '@/types/roles';
import { FEATURE_ACCESS_MATRIX, FEATURE_TO_MODULE, getFeaturesForRole } from '@/constants/featureAccessMatrix';
import { FEATURES_BY_MODULE } from '@/constants/featureCatalog';

/**
 * Generate a feature access report for a specific role
 */
export function generateRoleAccessReport(roleId: RoleId) {
  const features = getFeaturesForRole(roleId);

  const byLevel: Record<AccessLevel, FeatureId[]> = {
    FULL_ACCESS: [],
    LIMITED: [],
    READ_ONLY: [],
    OWN_DATA_ONLY: [],
    NONE: [],
  };

  features.forEach((featureId) => {
    const level = FEATURE_ACCESS_MATRIX[featureId]?.[roleId] ?? 'NONE';
    byLevel[level].push(featureId);
  });

  return {
    roleId,
    totalFeatures: features.length,
    byLevel,
  };
}

/**
 * Generate a cross-module analysis for a specific role
 */
export function analyzeRoleByModule(roleId: RoleId) {
  const result: Record<string, { total: number; accessible: number; percentage: number }> = {};

  Object.entries(FEATURES_BY_MODULE).forEach(([module, featureIds]) => {
    const accessible = featureIds.filter(
      (fId) => FEATURE_ACCESS_MATRIX[fId]?.[roleId] !== 'NONE'
    ).length;

    result[module] = {
      total: featureIds.length,
      accessible,
      percentage: Math.round((accessible / featureIds.length) * 100),
    };
  });

  return result;
}

/**
 * Find all features that changed access level for a specific role
 */
export function compareRoleAccess(roleId: RoleId, previousMatrix: Record<FeatureId, Record<RoleId, AccessLevel>>) {
  const changes: Array<{
    featureId: FeatureId;
    module: string;
    previousLevel: AccessLevel;
    currentLevel: AccessLevel;
    changed: boolean;
  }> = [];

  Object.entries(FEATURE_ACCESS_MATRIX).forEach(([featureId, accesses]) => {
    const current = accesses[roleId] ?? 'NONE';
    const previous = previousMatrix[featureId as FeatureId]?.[roleId] ?? 'NONE';

    if (current !== previous) {
      changes.push({
        featureId: featureId as FeatureId,
        module: FEATURE_TO_MODULE[featureId as FeatureId],
        previousLevel: previous,
        currentLevel: current,
        changed: true,
      });
    }
  });

  return changes;
}

/**
 * Get all features by access level for a role
 */
export function getFeaturesByAccessLevel(roleId: RoleId, accessLevel: AccessLevel) {
  return Object.entries(FEATURE_ACCESS_MATRIX)
    .filter(([, accesses]) => accesses[roleId] === accessLevel)
    .map(([featureId]) => featureId as FeatureId);
}

/**
 * Audit: Find features with restricted access patterns
 */
export function auditFeatureAccess() {
  const audit = {
    publicFeatures: [] as FeatureId[],
    highlyRestrictedFeatures: [] as FeatureId[],
    inconsistentAccess: [] as Array<{ featureId: FeatureId; pattern: string }>,
  };

  Object.entries(FEATURE_ACCESS_MATRIX).forEach(([featureId, accesses]) => {
    const levels = Object.values(accesses);
    const nonNone = levels.filter((l) => l !== 'NONE').length;
    const allRoles = levels.length;

    // Features accessible to all roles
    if (nonNone === allRoles) {
      audit.publicFeatures.push(featureId as FeatureId);
    }

    // Features accessible to 1-2 roles only
    if (nonNone <= 2) {
      audit.highlyRestrictedFeatures.push(featureId as FeatureId);
    }

    // Inconsistent access patterns (mix of all levels)
    if (
      levels.includes('FULL_ACCESS') &&
      levels.includes('READ_ONLY') &&
      levels.includes('LIMITED') &&
      levels.includes('NONE')
    ) {
      audit.inconsistentAccess.push({
        featureId: featureId as FeatureId,
        pattern: `${accesses.super_admin}-${accesses.admin}-${accesses.consejo}-${accesses.propietario}-${accesses.arrendatario}-${accesses.porteria}-${accesses.proveedor}`,
      });
    }
  });

  return audit;
}

/**
 * Compliance check: Verify that rules are being respected
 */
export function complianceCheck() {
  const issues: Array<{
    issue: string;
    featureId: FeatureId;
    roleId: RoleId;
    currentLevel: AccessLevel;
    expectedLevel: AccessLevel;
  }> = [];

  // Rule 1: P1 should have FULL_ACCESS to all operational functions
  Object.entries(FEATURE_ACCESS_MATRIX).forEach(([featureId, accesses]) => {
    if (!featureId.includes('voting')) {
      // Exclude voting special case
      if (accesses.super_admin !== 'FULL_ACCESS' && accesses.super_admin !== 'NONE') {
        issues.push({
          issue: 'P1 should have FULL_ACCESS or NONE only',
          featureId: featureId as FeatureId,
          roleId: 'super_admin',
          currentLevel: accesses.super_admin,
          expectedLevel: 'FULL_ACCESS',
        });
      }
    }
  });

  // Rule 3: P3 should never have FULL_ACCESS to financial features
  const financialFeatures = (FEATURES_BY_MODULE.M04 ?? []).concat(FEATURES_BY_MODULE.M05 ?? []);
  Object.entries(FEATURE_ACCESS_MATRIX).forEach(([featureId, accesses]) => {
    if (financialFeatures.includes(featureId) && accesses.consejo === 'FULL_ACCESS') {
      issues.push({
        issue: 'P3 should not have FULL_ACCESS to financial features',
        featureId: featureId as FeatureId,
        roleId: 'consejo',
        currentLevel: accesses.consejo,
        expectedLevel: 'READ_ONLY',
      });
    }
  });

  return {
    passed: issues.length === 0,
    totalIssues: issues.length,
    issues,
  };
}

/**
 * Export feature access matrix as CSV for external analysis
 */
export function exportMatrixAsCSV(): string {
  const headers = ['Feature ID', 'Module', 'Super Admin', 'Admin', 'Consejo', 'Propietario', 'Arrendatario', 'Porteria', 'Proveedor'];
  const rows: string[][] = [];

  Object.entries(FEATURE_ACCESS_MATRIX).forEach(([featureId, accesses]) => {
    rows.push([
      featureId,
      FEATURE_TO_MODULE[featureId as FeatureId],
      accesses.super_admin,
      accesses.admin,
      accesses.consejo,
      accesses.propietario,
      accesses.arrendatario,
      accesses.porteria,
      accesses.proveedor,
    ]);
  });

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

/**
 * Generate statistics about feature distribution
 */
export function getMatrixStatistics() {
  let totalCells = 0;
  let fullAccessCount = 0;
  let limitedCount = 0;
  let readOnlyCount = 0;
  let ownDataCount = 0;
  let noneCount = 0;

  Object.values(FEATURE_ACCESS_MATRIX).forEach((accesses) => {
    Object.values(accesses).forEach((level) => {
      totalCells++;
      switch (level) {
        case 'FULL_ACCESS':
          fullAccessCount++;
          break;
        case 'LIMITED':
          limitedCount++;
          break;
        case 'READ_ONLY':
          readOnlyCount++;
          break;
        case 'OWN_DATA_ONLY':
          ownDataCount++;
          break;
        case 'NONE':
          noneCount++;
          break;
      }
    });
  });

  return {
    totalCells,
    distribution: {
      FULL_ACCESS: { count: fullAccessCount, percentage: ((fullAccessCount / totalCells) * 100).toFixed(2) },
      LIMITED: { count: limitedCount, percentage: ((limitedCount / totalCells) * 100).toFixed(2) },
      READ_ONLY: { count: readOnlyCount, percentage: ((readOnlyCount / totalCells) * 100).toFixed(2) },
      OWN_DATA_ONLY: { count: ownDataCount, percentage: ((ownDataCount / totalCells) * 100).toFixed(2) },
      NONE: { count: noneCount, percentage: ((noneCount / totalCells) * 100).toFixed(2) },
    },
    totalFeatures: Object.keys(FEATURE_ACCESS_MATRIX).length,
    totalModules: Object.keys(FEATURES_BY_MODULE).length,
  };
}
