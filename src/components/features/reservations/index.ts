export { AdminReservationsView } from './AdminReservationsView';
export { TenantReservationsView } from './TenantReservationsView';
export { ReservationFeatureAction } from './ReservationFeatureActions';
import { registerFeatureAction } from '@/actions/featureActions';
import { ReservationFeatureAction } from './ReservationFeatureActions';

const RESERVATION_FEATURE_IDS = [
  'm06_space_policies',
  'm06_user_quota_limits',
  'm06_visual_calendar',
  'm06_mora_restrictions',
  'm06_payments_and_deposits',
  'm06_non_use_penalties',
  'm06_waiting_list',
  'm06_rules_based_approval',
  'm06_special_hours',
  'm06_maintenance_blocks',
  'm06_check_in_out',
  'm06_space_condition_evidence',
  'm06_reservation_history',
  'm06_space_usage_analytics',
] as const;

export function registerReservationActions() {
  RESERVATION_FEATURE_IDS.forEach((featureId) => {
    registerFeatureAction(featureId, ReservationFeatureAction);
  });
}
