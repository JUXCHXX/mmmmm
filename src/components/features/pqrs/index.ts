import { registerFeatureAction } from '@/actions/featureActions';
import { PQRSFeatureAction } from './PQRSFeatureActions';

export const registerPQRSActions = () => {
  registerFeatureAction('m07_trays_by_responsible', PQRSFeatureAction);
  registerFeatureAction('m07_configurable_slas', PQRSFeatureAction);
  registerFeatureAction('m07_due_dates_semaphores', PQRSFeatureAction);
  registerFeatureAction('m07_escalation_rules', PQRSFeatureAction);
  registerFeatureAction('m07_auto_classification', PQRSFeatureAction);
  registerFeatureAction('m07_suggested_responses', PQRSFeatureAction);
  registerFeatureAction('m07_post_close_satisfaction', PQRSFeatureAction);
  registerFeatureAction('m07_case_reopening', PQRSFeatureAction);
  registerFeatureAction('m07_full_traceability', PQRSFeatureAction);
  registerFeatureAction('m07_internal_external_tickets', PQRSFeatureAction);
  registerFeatureAction('m07_linking_to_entities', PQRSFeatureAction);
  registerFeatureAction('m07_recurrence_indicators', PQRSFeatureAction);
  registerFeatureAction('m07_committee_parallel_flow', PQRSFeatureAction);
  registerFeatureAction('m07_controlled_anonymity', PQRSFeatureAction);
};
