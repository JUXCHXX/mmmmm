import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Check, Image as ImageIcon } from 'lucide-react';

/**
 * Logo Manager Component
 * Handles brand logos and images throughout the application
 */

interface LogoProps {
  type: 'brand' | 'property' | 'admin' | 'small';
  src?: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

// Default brand colors and gradient for fallback
const BRAND_GRADIENT = 'from-blue-600 to-blue-400';
const BRAND_NAME = 'BUNTY';

export const Logo: React.FC<LogoProps> = ({
  type,
  src,
  alt = BRAND_NAME,
  className = '',
  fallback,
}) => {
  const [imageError, setImageError] = React.useState(!src);

  const sizeMap = {
    brand: { container: 'w-48 h-48', text: 'text-4xl' },
    property: { container: 'w-32 h-32', text: 'text-2xl' },
    admin: { container: 'w-20 h-20', text: 'text-base' },
    small: { container: 'w-14 h-14', text: 'text-sm' },
  };

  const size = sizeMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex items-center justify-center rounded-3xl overflow-hidden
        shadow-xl hover:shadow-2xl transition-shadow duration-200 ${size.container} ${className}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${BRAND_GRADIENT} opacity-90`} />

      {/* Image or fallback */}
      {!imageError && src ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover relative z-10"
        />
      ) : fallback ? (
        <div className="relative z-10 flex items-center justify-center h-full w-full">
          {fallback}
        </div>
      ) : (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`relative z-10 font-black text-white flex items-center justify-center
            ${size.text}`}
        >
          {BRAND_NAME[0]}
        </motion.div>
      )}

      {/* Shine effect */}
      <motion.div
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white to-transparent"
      />
    </motion.div>
  );
};

/**
 * Property Logo Gallery
 * Display multiple property logos in a grid
 */
interface LogoGalleryProps {
  logos: { id: string; src?: string; name: string }[];
  onSelect?: (logoId: string) => void;
  selectedId?: string;
  className?: string;
}

export const LogoGallery: React.FC<LogoGalleryProps> = ({
  logos,
  onSelect,
  selectedId,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {logos.map((logo, index) => (
        <motion.button
          key={logo.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect?.(logo.id)}
          className={`relative p-2 rounded-xl transition-all duration-200
            ${selectedId === logo.id
              ? 'bg-blue-100 border border-blue-500 shadow-lg'
              : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
            }`}
        >
          <Logo
            type="property"
            src={logo.src}
            alt={logo.name}
            className="w-full"
          />
          <p className="text-xs font-semibold text-gray-700 text-center mt-2 truncate">
            {logo.name}
          </p>

          {/* Selection checkmark */}
          {selectedId === logo.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full
                flex items-center justify-center text-white shadow-lg"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.div>
          )}
        </motion.button>
      ))}

      {/* Add new logo button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl border border-dashed border-gray-300
          hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
          flex items-center justify-center aspect-square"
      >
        <div className="flex flex-col items-center gap-1">
          <ImageIcon className="w-6 h-6 text-gray-400" />
          <p className="text-xs font-medium text-gray-500">Agregar</p>
        </div>
      </motion.button>
    </div>
  );
};

/**
 * Brand Bar with Logo
 * Displays brand logo in header sections
 */
interface BrandBarProps {
  showName?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const BrandBar: React.FC<BrandBarProps> = ({
  showName = true,
  size = 'medium',
  className = '',
}) => {
  const sizeConfig = {
    small: { logo: 'w-10 h-10', text: 'text-base' },
    medium: { logo: 'w-16 h-16', text: 'text-xl' },
    large: { logo: 'w-24 h-24', text: 'text-3xl' },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <Logo
        type={size === 'small' ? 'small' : 'admin'}
        className={config.logo}
      />
      {showName && (
        <div>
          <p className={`font-black bg-gradient-to-r ${BRAND_GRADIENT} bg-clip-text
            text-transparent ${config.text}`}>
            {BRAND_NAME}
          </p>
          <p className="text-xs text-gray-500 font-semibold">
            Administración de Condominios
          </p>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Dynamic Property Logo Placeholder
 * Shows property icon with gradient animation
 */
interface PropertyLogoProps {
  propertyName?: string;
  className?: string;
}

export const PropertyLogo: React.FC<PropertyLogoProps> = ({
  propertyName,
  className = '',
}) => {
  const gradients = [
    'from-emerald-600 to-teal-400',
    'from-blue-600 to-cyan-400',
    'from-purple-600 to-pink-400',
    'from-orange-600 to-yellow-400',
    'from-red-600 to-rose-400',
  ];

  // Consistent gradient selection based on property name
  const gradientIndex = propertyName
    ? propertyName.charCodeAt(0) % gradients.length
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg
        bg-gradient-to-br ${gradients[gradientIndex]} flex items-center justify-center ${className}`}
    >
      <Building2 className="w-10 h-10 text-white" />

      {/* Animated background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-20 border-4 border-white border-dashed rounded-xl"
      />
    </motion.div>
  );
};

export default {
  Logo,
  LogoGallery,
  BrandBar,
  PropertyLogo,
};
