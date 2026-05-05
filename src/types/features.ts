import type { RoleId, AccessLevel } from './roles';

/**
 * Feature IDs - Todas las 213 funciones nuevas organizadas por módulo
 */
export type FeatureId =
  // M01: Gestión de Propiedades y Unidades
  | 'tree_hierarchy'
  | 'bulk_property_import'
  | 'unit_classification'
  | 'coefficients_config'
  | 'unit_master_file'
  | 'parking_management'
  | 'visual_property_map'
  | 'multi_condo_enterprise'
  | 'unit_assets_relation'
  | 'maintenance_blocking'
  | 'unit_blocking'

  // M02: Gestión de Residentes y Censo
  | 'owner_tenant_authorization'
  | 'resident_history'
  | 'family_nucleus'
  | 'resident_onboarding'
  | 'emergency_contacts'
  | 'special_conditions_registry'
  | 'occupancy_traceability'
  | 'universal_linking'
  | 'packages_correspondence'
  | 'resident_documents'

  // M03: Comunicaciones y Comunidad
  | 'read_receipts'
  | 'communication_analytics'
  | 'library_announcements'
  | 'community_calendar'
  | 'confirmation_reading'
  | 'surveys_polls'
  | 'draft_generation'
  | 'comment_moderation'
  | 'recurring_communications'
  | 'campaign_scheduling'
  | 'reactions_control'
  | 'digital_voting'

  // M04: Pagos, Cartera y Recaudo
  | 'payment_agreements'
  | 'morosity_alerts'
  | 'payment_blocking'
  | 'portfolio_seniority'
  | 'auto_payment_reconciliation'
  | 'integrated_receivables'
  | 'account_statements'
  | 'collection_history'
  | 'bank_integration'
  | 'credit_debit_notes'
  | 'progressive_notifications'
  | 'multilevel_payments'
  | 'partial_payments'
  | 'payment_prediction'
  | 'payment_promises'
  | 'extraordinary_collection'
  | 'multichannel_collection'
  | 'payment_restrictions'
  | 'refinancing_simulator'
  | 'commission_system'
  | 'portfolio_board'
  | 'daily_collection_board'

  // M05: Contabilidad Básica e Integración
  | 'cost_centers'
  | 'assisted_monthly_closing'
  | 'accounting_vouchers'
  | 'reconciliations'
  | 'accounts_payable'
  | 'reference_depreciation'
  | 'accounting_exports'
  | 'closing_signature'
  | 'erp_integration'
  | 'budget_comparison'
  | 'budget_execution'
  | 'accounting_traceability'
  | 'closing_validations'

  // M06: Reservas de Zonas Comunes
  | 'resource_calendar'
  | 'check_in_check_out'
  | 'space_condition_evidence'
  | 'reservation_history'
  | 'waiting_list'
  | 'reservation_deposits'
  | 'non_use_penalties'
  | 'space_policies'

  // M07: Gestión de PQRS y Tickets
  | 'trays_by_responsible'
  | 'suggested_responses'
  | 'convivence_committee_flow'
  | 'complaint_patterns'
  | 'recurrence_indicators'
  | 'root_cause_analysis'
  | 'case_reopening'
  | 'escalation_rules'
  | 'pqrs_summary'
  | 'sla_configuration'
  | 'closure_satisfaction'
  | 'sla_semaphores'
  | 'priority_tickets'
  | 'internal_external_tickets'

  // M08: Gestión de Mantenimiento y Activos
  | 'services_agenda'
  | 'renewal_alerts'
  | 'asset_checklists'
  | 'spare_consumption'
  | 'accumulated_costs'
  | 'before_after_evidence'
  | 'asset_technical_data'
  | 'intervention_history'
  | 'preventive_maintenance'
  | 'work_orders'
  | 'maintenance_productivity'
  | 'serials_warranties'
  | 'maintenance_suggestions'
  | 'asset_location'
  | 'expiration_semaphores'

  // M09: Seguridad y Control de Acceso
  | 'blocked_unit_alerts'
  | 'porteria_bitacora'
  | 'restricted_zone_access'
  | 'delivery_control'
  | 'ingress_evidence'
  | 'contractor_ingress'
  | 'smart_integration'
  | 'blacklists_alerts'
  | 'express_porteria_panel'
  | 'ingress_registry'
  | 'security_incidents'
  | 'security_board'
  | 'security_shifts'
  | 'identity_validation'
  | 'validation_methods'
  | 'frequent_visitors'
  | 'digital_invitations'

  // M10: Gestión Documental
  | 'folders_by_profile'
  | 'document_consultation'
  | 'robust_version_control'
  | 'document_approval_flows'
  | 'resident_documents_mgmt'
  | 'document_ocr'
  | 'document_permissions'
  | 'document_templates'
  | 'institutional_templates'
  | 'document_expiration'
  | 'digital_signature'

  // M11: Marketplace y Servicios
  | 'paid_campaigns'
  | 'provider_comparison'
  | 'marketplace_commercial_dashboard'
  | 'provider_status'
  | 'provider_evaluation'
  | 'leads_management'
  | 'providers_listing'
  | 'segmented_offers'
  | 'verified_reviews'
  | 'quotation_requests'
  | 'service_traceability'
  | 'provider_validation'

  // M12: Panel del Administrador (Dashboard)
  | 'dashboard_by_role'
  | 'pending_tasks_panel'
  | 'action_recommendations'
  | 'daily_summary'
  | 'configurable_widgets'

  // M13: Módulo IA Copiloto PH
  | 'anomaly_analysis'
  | 'administrative_assistant'
  | 'resident_chatbot'
  | 'help_chatbot'
  | 'automatic_classification'
  | 'council_copilot'
  | 'profile_copilot'
  | 'pattern_detection'
  | 'ia_explainability'
  | 'draft_communications'
  | 'predictive_indicators'
  | 'contextual_responses'
  | 'maintenance_suggestions_ia'
  | 'contextual_suggestions'
  | 'auto_translation'

  // M14: Analítica, BI y Reportes
  | 'communications_analytics'
  | 'incidents_analytics'
  | 'occupation_analytics'
  | 'providers_analytics'
  | 'spaces_usage_analytics'
  | 'controlled_anonymity'
  | 'anomalies_analysis'
  | 'aperture_engagement'
  | 'benchmarks_between_condos'
  | 'historical_comparatives'
  | 'report_builder'
  | 'adoption_indicators'
  | 'operational_heatmap'
  | 'maintenance_productivity_analytics'
  | 'performance_ranking'
  | 'risk_ranking'
  | 'scheduled_reports'
  | 'advanced_segmentation'
  | 'financial_board'
  | 'interaction_traceability'

  // M15: Configuración y Parametrización
  | 'module_activation'
  | 'digital_adoption'
  | 'approval_rules'
  | 'branding_by_condo'
  | 'advanced_search'
  | 'semantic_search'
  | 'calendars_holidays'
  | 'categories_subcategories'
  | 'master_catalogs'
  | 'special_hours_config'
  | 'integrations_config'
  | 'max_quotas_user'
  | 'master_states'
  | 'access_delegations'
  | 'feature_flags'
  | 'advanced_filters'
  | 'excel_import'
  | 'metadata_taxonomies'
  | 'multi_language'
  | 'multi_currency'
  | 'approval_levels'
  | 'guided_onboarding'
  | 'visual_personalization'
  | 'preset_templates'
  | 'notification_policies'
  | 'visibility_policies'
  | 'configurable_rules'
  | 'auto_translation_config'

  // M16: Soporte, Ayuda y Centro de Conocimiento
  | 'articles_videos'
  | 'knowledge_by_role'
  | 'contextual_help'
  | 'support_chat_tickets'
  | 'admin_training'
  | 'platform_incidents'
  | 'dynamic_faq'
  | 'support_tracking'
  | 'product_tours'
  | 'short_videos';

export interface Feature {
  id: FeatureId;
  label: string;
  module: string; // M01, M02, etc
  description: string;
}

export const FEATURES_BY_MODULE: Record<string, FeatureId[]> = {
  M01: [
    'tree_hierarchy',
    'bulk_property_import',
    'unit_classification',
    'coefficients_config',
    'unit_master_file',
    'parking_management',
    'visual_property_map',
    'multi_condo_enterprise',
    'unit_assets_relation',
    'maintenance_blocking',
    'unit_blocking',
  ],
  M02: [
    'owner_tenant_authorization',
    'resident_history',
    'family_nucleus',
    'resident_onboarding',
    'emergency_contacts',
    'special_conditions_registry',
    'occupancy_traceability',
    'universal_linking',
    'packages_correspondence',
    'resident_documents',
  ],
  M03: [
    'read_receipts',
    'communication_analytics',
    'library_announcements',
    'community_calendar',
    'confirmation_reading',
    'surveys_polls',
    'draft_generation',
    'comment_moderation',
    'recurring_communications',
    'campaign_scheduling',
    'reactions_control',
    'digital_voting',
  ],
  M04: [
    'payment_agreements',
    'morosity_alerts',
    'payment_blocking',
    'portfolio_seniority',
    'auto_payment_reconciliation',
    'integrated_receivables',
    'account_statements',
    'collection_history',
    'bank_integration',
    'credit_debit_notes',
    'progressive_notifications',
    'multilevel_payments',
    'partial_payments',
    'payment_prediction',
    'payment_promises',
    'extraordinary_collection',
    'multichannel_collection',
    'payment_restrictions',
    'refinancing_simulator',
    'commission_system',
    'portfolio_board',
    'daily_collection_board',
  ],
  M05: [
    'cost_centers',
    'assisted_monthly_closing',
    'accounting_vouchers',
    'reconciliations',
    'accounts_payable',
    'reference_depreciation',
    'accounting_exports',
    'closing_signature',
    'erp_integration',
    'budget_comparison',
    'budget_execution',
    'accounting_traceability',
    'closing_validations',
  ],
  M06: [
    'resource_calendar',
    'check_in_check_out',
    'space_condition_evidence',
    'reservation_history',
    'waiting_list',
    'reservation_deposits',
    'non_use_penalties',
    'space_policies',
  ],
  M07: [
    'trays_by_responsible',
    'suggested_responses',
    'convivence_committee_flow',
    'complaint_patterns',
    'recurrence_indicators',
    'root_cause_analysis',
    'case_reopening',
    'escalation_rules',
    'pqrs_summary',
    'sla_configuration',
    'closure_satisfaction',
    'sla_semaphores',
    'priority_tickets',
    'internal_external_tickets',
  ],
  M08: [
    'services_agenda',
    'renewal_alerts',
    'asset_checklists',
    'spare_consumption',
    'accumulated_costs',
    'before_after_evidence',
    'asset_technical_data',
    'intervention_history',
    'preventive_maintenance',
    'work_orders',
    'maintenance_productivity',
    'serials_warranties',
    'maintenance_suggestions',
    'asset_location',
    'expiration_semaphores',
  ],
  M09: [
    'blocked_unit_alerts',
    'porteria_bitacora',
    'restricted_zone_access',
    'delivery_control',
    'ingress_evidence',
    'contractor_ingress',
    'smart_integration',
    'blacklists_alerts',
    'express_porteria_panel',
    'ingress_registry',
    'security_incidents',
    'security_board',
    'security_shifts',
    'identity_validation',
    'validation_methods',
    'frequent_visitors',
    'digital_invitations',
  ],
  M10: [
    'folders_by_profile',
    'document_consultation',
    'robust_version_control',
    'document_approval_flows',
    'resident_documents_mgmt',
    'document_ocr',
    'document_permissions',
    'document_templates',
    'institutional_templates',
    'document_expiration',
    'digital_signature',
  ],
  M11: [
    'paid_campaigns',
    'provider_comparison',
    'marketplace_commercial_dashboard',
    'provider_status',
    'provider_evaluation',
    'leads_management',
    'providers_listing',
    'segmented_offers',
    'verified_reviews',
    'quotation_requests',
    'service_traceability',
    'provider_validation',
  ],
  M12: [
    'dashboard_by_role',
    'pending_tasks_panel',
    'action_recommendations',
    'daily_summary',
    'configurable_widgets',
  ],
  M13: [
    'anomaly_analysis',
    'administrative_assistant',
    'resident_chatbot',
    'help_chatbot',
    'automatic_classification',
    'council_copilot',
    'profile_copilot',
    'pattern_detection',
    'ia_explainability',
    'draft_communications',
    'predictive_indicators',
    'contextual_responses',
    'maintenance_suggestions_ia',
    'contextual_suggestions',
    'auto_translation',
  ],
  M14: [
    'communications_analytics',
    'incidents_analytics',
    'occupation_analytics',
    'providers_analytics',
    'spaces_usage_analytics',
    'controlled_anonymity',
    'anomalies_analysis',
    'aperture_engagement',
    'benchmarks_between_condos',
    'historical_comparatives',
    'report_builder',
    'adoption_indicators',
    'operational_heatmap',
    'maintenance_productivity_analytics',
    'performance_ranking',
    'risk_ranking',
    'scheduled_reports',
    'advanced_segmentation',
    'financial_board',
    'interaction_traceability',
  ],
  M15: [
    'module_activation',
    'digital_adoption',
    'approval_rules',
    'branding_by_condo',
    'advanced_search',
    'semantic_search',
    'calendars_holidays',
    'categories_subcategories',
    'master_catalogs',
    'special_hours_config',
    'integrations_config',
    'max_quotas_user',
    'master_states',
    'access_delegations',
    'feature_flags',
    'advanced_filters',
    'excel_import',
    'metadata_taxonomies',
    'multi_language',
    'multi_currency',
    'approval_levels',
    'guided_onboarding',
    'visual_personalization',
    'preset_templates',
    'notification_policies',
    'visibility_policies',
    'configurable_rules',
    'auto_translation_config',
  ],
  M16: [
    'articles_videos',
    'knowledge_by_role',
    'contextual_help',
    'support_chat_tickets',
    'admin_training',
    'platform_incidents',
    'dynamic_faq',
    'support_tracking',
    'product_tours',
    'short_videos',
  ],
};

/**
 * Map de módulos a su código M0X
 */
export const MODULE_CODES: Record<string, string> = {
  properties: 'M01',
  residents: 'M02',
  communications: 'M03',
  payments: 'M04',
  accounting: 'M05',
  reservations: 'M06',
  pqrs: 'M07',
  maintenance: 'M08',
  security: 'M09',
  documents: 'M10',
  marketplace: 'M11',
  dashboard: 'M12',
  ai_copilot: 'M13',
  analytics: 'M14',
  settings: 'M15',
  support: 'M16',
};
