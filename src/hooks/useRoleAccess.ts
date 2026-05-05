import { useAuthStore } from '@/store/useAuthStore';
import type { RoleId } from '@/types/roles';
import type { FeatureId } from '@/types/features';
import type { AccessLevel } from '@/types/roles';
import {
  getFeatureAccess,
  hasFeatureAccess,
  getFeaturesForRole,
  FEATURE_TO_MODULE,
} from '@/constants/featureAccessMatrix';

interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canExport: boolean;
  canApprove: boolean;
  canManageCondo: boolean;
  canManageUsers: boolean;
}

/**
 * Enhanced hook for centralized role-based access control
 * Integrates 213 functions across 16 modules with fine-grained permissions
 * v4.0 - 2026-04-23
 */
export const useRoleAccess = () => {
  const user = useAuthStore((s) => s.user);

  const permissions: Record<RoleId, RolePermissions> = {
    super_admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canExport: true,
      canApprove: true,
      canManageCondo: true,
      canManageUsers: true,
    },
    admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canExport: true,
      canApprove: true,
      canManageCondo: true,
      canManageUsers: false,
    },
    consejo: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      canExport: true,
      canApprove: true,
      canManageCondo: false,
      canManageUsers: false,
    },
    propietario: {
      canCreate: false,
      canEdit: true,
      canDelete: false,
      canView: true,
      canExport: false,
      canApprove: false,
      canManageCondo: false,
      canManageUsers: false,
    },
    arrendatario: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      canExport: false,
      canApprove: false,
      canManageCondo: false,
      canManageUsers: false,
    },
    porteria: {
      canCreate: true,
      canEdit: false,
      canDelete: false,
      canView: true,
      canExport: false,
      canApprove: false,
      canManageCondo: false,
      canManageUsers: false,
    },
    proveedor: {
      canCreate: false,
      canEdit: true,
      canDelete: false,
      canView: true,
      canExport: false,
      canApprove: false,
      canManageCondo: false,
      canManageUsers: false,
    },
  };

  const rolePermissions = user ? permissions[user.roleId] : null;

  return {
    user,
    rolePermissions,
    hasPermission: (permission: keyof RolePermissions) => rolePermissions?.[permission] ?? false,
    isSuperAdmin: user?.roleId === 'super_admin',
    isAdmin: user?.roleId === 'admin' || user?.roleId === 'super_admin',
    canManageContent: rolePermissions?.canCreate || false,

    /**
     * NEW: Check access to specific features (213 functions integrated)
     * @param featureId - Feature ID from the matrix
     * @param minimumLevel - Minimum access level required (default: 'LIMITED')
     * @returns boolean - Whether user has access
     */
    canAccessFeature: (featureId: FeatureId, minimumLevel: AccessLevel = 'LIMITED') => {
      if (!user) return false;
      return hasFeatureAccess(featureId, user.roleId, minimumLevel);
    },

    /**
     * NEW: Get access level for a specific feature
     * @param featureId - Feature ID
     * @returns AccessLevel - FULL_ACCESS, LIMITED, READ_ONLY, OWN_DATA_ONLY, or NONE
     */
    getFeatureAccessLevel: (featureId: FeatureId): AccessLevel => {
      if (!user) return 'NONE';
      return getFeatureAccess(featureId, user.roleId);
    },

    /**
     * NEW: Get all accessible features for current user's role
     * @returns FeatureId[] - Array of accessible feature IDs
     */
    getAccessibleFeatures: (): FeatureId[] => {
      if (!user) return [];
      return getFeaturesForRole(user.roleId);
    },

    /**
     * NEW: Get module code for a feature
     * @param featureId - Feature ID
     * @returns string - Module code (M01-M16)
     */
    getFeatureModule: (featureId: FeatureId): string => {
      return FEATURE_TO_MODULE[featureId] ?? 'UNKNOWN';
    },

    /**
     * NEW: Check if user can perform specific action on a feature
     * @param featureId - Feature ID
     * @param action - Action type (create, edit, delete, view)
     * @returns boolean - Whether action is allowed
     */
    canPerformFeatureAction: (
      featureId: FeatureId,
      action: 'create' | 'edit' | 'delete' | 'view' = 'view'
    ): boolean => {
      if (!user) return false;
      const accessLevel = getFeatureAccess(featureId, user.roleId);

      if (accessLevel === 'NONE') return false;
      if (accessLevel === 'FULL_ACCESS') return true;
      if (action === 'view') return accessLevel !== 'NONE';
      if (action === 'delete') return accessLevel === 'FULL_ACCESS';
      if (action === 'create' || action === 'edit') {
        return accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED' || accessLevel === 'OWN_DATA_ONLY';
      }
      return false;
    },
  };
};

export default useRoleAccess;
