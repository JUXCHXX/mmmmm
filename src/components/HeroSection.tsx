import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Heart } from 'lucide-react';
import { memo } from 'react';

export const HeroSection = () => {
  const user = useAuthStore((s) => s.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-[16px] overflow-hidden h-48 sm:h-56 md:h-64 mb-8"
    >
      {/* Background Image - PALETA OFICIAL */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0D4A3E] via-[#0F7A5C] to-[#219EBC] opacity-90"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
            {getGreeting()},
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-semibold">
            {user?.name}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4"
        >
          <p className="text-white/80 text-sm md:text-base max-w-md">
            Bienvenido a BUNTY • Gestión Inteligente de Copropiedades
          </p>
        </motion.div>

        {/* Decorative Hearts */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-4 right-6 text-white/40"
        >
          <Heart className="w-8 h-8 fill-current" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(HeroSection);
