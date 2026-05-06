import type { AccessLevel, RoleId } from './roles';
import type { ModuleId } from './modules';

export type FeatureId = string;

export type FeaturePreset =
  | 'catalog'
  | 'communication'
  | 'finance'
  | 'reservation'
  | 'ticket'
  | 'maintenance'
  | 'security'
  | 'documents'
  | 'marketplace'
  | 'insights'
  | 'ai'
  | 'settings'
  | 'support';

export interface FeatureDefinition {
  id: FeatureId;
  label: string;
  moduleId: ModuleId;
  moduleCode: string;
  description: string;
  preset: FeaturePreset;
  access: Record<RoleId, AccessLevel>;
}

export const MODULE_CODES: Record<ModuleId, string> = {
  properties: 'M01',
  residents: 'M02',
  communications: 'M03',
  payments: 'M04',
  accounting: 'M05',
  reservations: 'M06',
  pqrs: 'M07',
  maintenance: 'M08',
  security: 'M09',
  security_config: 'M09',
  security_control: 'M09',
  documents: 'M10',
  marketplace: 'M11',
  dashboard: 'M12',
  ai_copilot: 'M13',
  analytics: 'M14',
  settings: 'M15',
  support: 'M16',
  knowledge: 'M16',
  audit: 'M15',
};
