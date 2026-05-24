import { registerPaymentActions } from '@/components/features/payments';
import { registerPQRSActions } from '@/components/features/pqrs';
import { registerReservationActions } from '@/components/features/reservations';
import { registerSecurityActions } from '@/components/features/security';

let featureActionsReady = false;

export const ensureFeatureActionsRegistered = () => {
  if (featureActionsReady) {
    return;
  }

  registerReservationActions();
  registerSecurityActions();
  registerPaymentActions();
  registerPQRSActions();

  featureActionsReady = true;
};
