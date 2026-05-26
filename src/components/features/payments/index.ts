export { AdminPaymentsView } from './AdminPaymentsView';
export { TenantPaymentsView } from './TenantPaymentsView';
export { PaymentFeatureAction } from './PaymentFeatureActions';
import { registerFeatureAction } from '@/actions/featureActions';
import { PaymentFeatureAction } from './PaymentFeatureActions';

const PAYMENT_FEATURE_IDS = [
  'm04_auto_payment_reconciliation',
  'm04_multichannel_collection',
  'm04_payment_agreements',
  'm04_payment_promises',
  'm04_blocking_by_mora',
  'm04_collection_history',
  'm04_aging_portfolio',
  'm04_progressive_mora_notification',
  'm04_refinancing_simulator',
  'm04_campaign_collection',
  'm04_partial_payments',
  'm04_credit_debit_notes',
  'm04_bank_integration',
  'm04_daily_collection_board',
  'm04_predictive_mora_alerts',
] as const;

export function registerPaymentActions() {
  PAYMENT_FEATURE_IDS.forEach((featureId) => {
    registerFeatureAction(featureId, PaymentFeatureAction);
  });
}
