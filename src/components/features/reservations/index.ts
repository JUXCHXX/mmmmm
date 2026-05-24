import { registerFeatureAction } from '@/actions/featureActions';
import { ReservationFeatureAction } from './ReservationFeatureActions';

export const registerReservationActions = () => {
  registerFeatureAction('m06_space_policies', ReservationFeatureAction);
  registerFeatureAction('m06_user_quota_limits', ReservationFeatureAction);
  registerFeatureAction('m06_visual_calendar', ReservationFeatureAction);
  registerFeatureAction('m06_mora_restrictions', ReservationFeatureAction);
  registerFeatureAction('m06_payments_and_deposits', ReservationFeatureAction);
  registerFeatureAction('m06_non_use_penalties', ReservationFeatureAction);
  registerFeatureAction('m06_waiting_list', ReservationFeatureAction);
  registerFeatureAction('m06_rules_based_approval', ReservationFeatureAction);
  registerFeatureAction('m06_special_hours', ReservationFeatureAction);
  registerFeatureAction('m06_maintenance_blocks', ReservationFeatureAction);
  registerFeatureAction('m06_check_in_out', ReservationFeatureAction);
  registerFeatureAction('m06_space_condition_evidence', ReservationFeatureAction);
  registerFeatureAction('m06_reservation_history', ReservationFeatureAction);
  registerFeatureAction('m06_space_usage_analytics', ReservationFeatureAction);
};
