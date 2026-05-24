import { registerFeatureAction } from '@/actions/featureActions';
import { SecurityFeatureAction } from './SecurityFeatureActions';

export const registerSecurityActions = () => {
  registerFeatureAction('m09_digital_guard_log', SecurityFeatureAction);
  registerFeatureAction('m09_security_shifts', SecurityFeatureAction);
  registerFeatureAction('m09_packages_mail', SecurityFeatureAction);
  registerFeatureAction('m09_delivery_control', SecurityFeatureAction);
  registerFeatureAction('m09_frequent_visitors', SecurityFeatureAction);
  registerFeatureAction('m09_blacklists_alerts', SecurityFeatureAction);
  registerFeatureAction('m09_unit_blocks', SecurityFeatureAction);
  registerFeatureAction('m09_validation_methods', SecurityFeatureAction);
  registerFeatureAction('m09_real_time_alerts', SecurityFeatureAction);
  registerFeatureAction('m09_contractor_windows', SecurityFeatureAction);
  registerFeatureAction('m09_restricted_areas_access', SecurityFeatureAction);
  registerFeatureAction('m09_hardware_integration', SecurityFeatureAction);
  registerFeatureAction('m09_express_gate_panel', SecurityFeatureAction);
  registerFeatureAction('m09_ingress_evidence', SecurityFeatureAction);
  registerFeatureAction('m09_security_incident_tracking', SecurityFeatureAction);
};
