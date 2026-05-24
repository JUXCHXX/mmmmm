import { registerFeatureAction } from '@/actions/featureActions';
import { PaymentFeatureAction } from './PaymentFeatureActions';

export const registerPaymentActions = () => {
  registerFeatureAction('m04_auto_payment_reconciliation', PaymentFeatureAction);
  registerFeatureAction('m04_multichannel_collection', PaymentFeatureAction);
  registerFeatureAction('m04_payment_agreements', PaymentFeatureAction);
  registerFeatureAction('m04_payment_promises', PaymentFeatureAction);
  registerFeatureAction('m04_blocking_by_mora', PaymentFeatureAction);
  registerFeatureAction('m04_collection_history', PaymentFeatureAction);
  registerFeatureAction('m04_aging_portfolio', PaymentFeatureAction);
  registerFeatureAction('m04_progressive_mora_notification', PaymentFeatureAction);
  registerFeatureAction('m04_refinancing_simulator', PaymentFeatureAction);
  registerFeatureAction('m04_campaign_collection', PaymentFeatureAction);
  registerFeatureAction('m04_partial_payments', PaymentFeatureAction);
  registerFeatureAction('m04_credit_debit_notes', PaymentFeatureAction);
  registerFeatureAction('m04_bank_integration', PaymentFeatureAction);
  registerFeatureAction('m04_daily_collection_board', PaymentFeatureAction);
  registerFeatureAction('m04_predictive_mora_alerts', PaymentFeatureAction);
};
