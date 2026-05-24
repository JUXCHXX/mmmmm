import { useState } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { getFeatureActionComponent } from '@/actions/featureActions';
import { ensureFeatureActionsRegistered } from '@/actions/registerFeatureActions';
import type { FeatureId } from '@/types/features';
import type { AccessLevel } from '@/types/roles';

interface FeatureActionConfig {
  featureId: FeatureId;
  accessLevel: AccessLevel;
  title: string;
}

interface ModalState {
  isOpen: boolean;
  featureId: FeatureId | null;
  title: string;
  accessLevel: AccessLevel;
  moduleCode: string;
}

export const useFeatureAction = () => {
  const { getFeatureModule } = useRoleAccess();
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    featureId: null,
    title: '',
    accessLevel: 'NONE',
    moduleCode: '',
  });

  const executeAction = (config: FeatureActionConfig) => {
    const { featureId, accessLevel, title } = config;
    const moduleCode = getFeatureModule(featureId);

    ensureFeatureActionsRegistered();

    if (accessLevel === 'NONE' || getFeatureActionComponent(featureId)) {
      setModalState({
        isOpen: true,
        featureId,
        title,
        accessLevel,
        moduleCode,
      });
      return;
    }

    setModalState({
      isOpen: true,
      featureId,
      title,
      accessLevel,
      moduleCode,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    executeAction,
    modalState,
    closeModal,
  };
};

export default useFeatureAction;
