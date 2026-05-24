import type { FeatureId } from '@/types/features';
import type { AccessLevel, RoleId } from '@/types/roles';

// Feature Action Handlers - Each function has its own unique action
export interface FeatureActionHandler {
  id: FeatureId;
  execute: (context: FeatureActionContext) => void;
  component?: React.ComponentType<FeatureActionProps>;
}

export interface FeatureActionContext {
  featureId: FeatureId;
  accessLevel: AccessLevel;
  roleId: RoleId;
  title: string;
  moduleCode: string;
}

export interface FeatureActionProps {
  featureId: FeatureId;
  accessLevel: AccessLevel;
  roleId: RoleId;
  title: string;
  moduleCode: string;
  onClose: () => void;
}

// Registry of all 213 feature actions
// This maps each featureId to its handler component
export const FEATURE_ACTIONS: Record<FeatureId, React.ComponentType<FeatureActionProps>> = {};

// Helper function to register actions
export const registerFeatureAction = (
  featureId: FeatureId,
  component: React.ComponentType<FeatureActionProps>
) => {
  FEATURE_ACTIONS[featureId] = component;
};

// Get action component for a feature
export const getFeatureActionComponent = (featureId: FeatureId) => {
  return FEATURE_ACTIONS[featureId];
};
