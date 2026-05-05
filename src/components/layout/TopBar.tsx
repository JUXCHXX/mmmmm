import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { UserProfileModal } from '@/components/modals/UserProfileModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ACTIVE_CONDO_NAME, BUNTY_LOGO_SRC, BUNTY_SLOGAN, getUserInitials } from '@/constants/branding';

export const TopBar = () => {
  const user = useAuthStore((s) => s.user);
  const condos = useAppStore((s) => s.condos);
  const selectedCondoId = useAppStore((s) => s.selectedCondoId);
  const condoConfig = useAppStore((s) => s.condoConfig);
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  const activeCondoName =
    condos.find((condo) => condo.id === selectedCondoId)?.name ||
    user.condoName ||
    condoConfig?.name ||
    ACTIVE_CONDO_NAME;

  const userInitials = getUserInitials(user.name, user.avatar);

  return (
    <>
      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-gradient-to-r from-[#0D2654] to-[#1A3F8F] shadow-[0_8px_24px_rgba(13,38,84,0.22)]">
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/92 p-1 shadow-[0_8px_18px_rgba(0,0,0,0.16)] sm:h-14 sm:w-14">
              <img src={BUNTY_LOGO_SRC} alt="Logo Bunty" className="h-full w-full object-contain" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="text-lg font-bold leading-none text-white">Bunty</p>
              <p className="truncate text-[11px] uppercase tracking-[0.18em] text-white/75">
                {BUNTY_SLOGAN}
              </p>
            </div>

            <div className="min-w-0 rounded-full border border-white/16 bg-white/12 px-3 py-1.5 backdrop-blur-sm">
              <p className="truncate text-xs font-semibold text-white">{activeCondoName || ACTIVE_CONDO_NAME}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-2 py-1.5 text-white transition-colors hover:bg-white/14"
            title="Abrir perfil"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/72">
                {user.roleId.replace('_', ' ')}
              </p>
            </div>

            <Avatar className="h-10 w-10 border border-white/20 shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
              <AvatarFallback className="bg-[#2DC89A] text-sm font-bold text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </>
  );
};

export default TopBar;
