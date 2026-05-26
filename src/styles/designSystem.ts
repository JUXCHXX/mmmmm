/**
 * BUNTY Design System - Extraído de CommunicationsPage
 * Este es el estándar visual único para TODA la aplicación
 * Todos los módulos DEBEN cumplir estas reglas
 */

export const DESIGN_SYSTEM = {
  // ==================== TIPOGRAFÍA ====================
  typography: {
    // Título principal del módulo
    heading1: 'text-2xl md:text-3xl font-bold text-foreground',
    // Subtítulo descriptivo
    heading2: 'text-lg font-bold text-foreground',
    heading3: 'text-base font-bold text-foreground',
    // Cuerpo principal
    body: 'text-sm text-foreground',
    // Texto secundario (fechas, metadatos)
    bodySm: 'text-sm text-muted-foreground',
    // Etiquetas
    label: 'text-xs font-bold text-foreground',
    labelSm: 'text-xs text-muted-foreground',
  },

  // ==================== COLORES ====================
  colors: {
    // Fondos
    background: 'bg-white',
    backgroundSecondary: 'bg-gray-50',
    // Cards
    card: 'bg-white',
    cardBorder: 'border border-black/8',
    // Badges y etiquetas - VERSIÓN PASTEL (NO saturada)
    badgeBlue: 'bg-blue-100 text-blue-800',
    badgeGreen: 'bg-green-100 text-green-800',
    badgeYellow: 'bg-yellow-100 text-yellow-800',
    badgeRed: 'bg-red-100 text-red-800',
    badgeViolet: 'bg-violet-100 text-violet-800',
    badgeEmerald: 'bg-emerald-100 text-emerald-800',
    // Botón primario
    btnPrimary: 'btn-premium',
    // Texto
    foreground: 'text-foreground',
    textMuted: 'text-muted-foreground',
  },

  // ==================== ESPACIADO ====================
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    // Gaps
    gapXs: 'gap-2',
    gapSm: 'gap-3',
    gapMd: 'gap-4',
    gapLg: 'gap-6',
  },

  // ==================== BORDES Y RADIOS ====================
  borders: {
    radiusSm: 'rounded-lg',
    radiusMd: 'rounded-xl',
    radiusLg: 'rounded-2xl',
    // Sombras
    shadowSm: 'shadow-sm',
    shadowMd: 'shadow-md',
    shadowLg: 'shadow-lg',
  },

  // ==================== COMPONENTES COMUNES ====================
  components: {
    // Header del módulo
    moduleHeader: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6',
    moduleTitle: 'text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3',
    moduleSubtitle: 'text-sm text-muted-foreground mt-1',

    // Button principal
    btnNew: 'btn-premium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2',

    // Tabs
    tabActive: 'px-4 py-2 rounded-xl text-sm font-medium bg-primary/20 text-primary transition-colors',
    tabInactive: 'px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',

    // Search bar
    searchBar: 'w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors',

    // Card
    card: 'bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md transition-shadow p-6',

    // Input
    input: 'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all',

    // Select
    select: 'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',

    // Badge
    badge: 'px-3 py-1 rounded-full text-xs font-bold',

    // Avatar
    avatar: 'w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-white font-bold text-sm',
  },
};

/**
 * REGLAS VISUALES INVIOLABLES
 *
 * ❌ PROHIBIDO:
 * 1. blur-*, backdrop-blur-*, filter blur aplicado sobre texto o contenido
 * 2. bg-gradient-*, from-*, to-* en cards de stats/resumen
 * 3. opacity-50, opacity-30, opacity-25 que oculte datos reales
 * 4. Componentes "DemoOverlay", "BlurredContent", "PrivacyMask"
 * 5. Colores saturados en cards (bg-green-400, bg-red-400) - usar versiones claras (bg-green-50, bg-red-50)
 *
 * ✅ PERMITIDO:
 * 1. Animaciones de Framer Motion (opacity, y, scale) en transiciones
 * 2. Badges en versión PASTEL (bg-[color]-100 text-[color]-800)
 * 3. Bordes de color sutil (border border-[color]/20)
 * 4. Fondos muy claros (bg-[color]-50)
 * 5. Text-muted-foreground para metadata (NO oculta datos)
 *
 * ESTRUCTURA DE TODO MÓDULO:
 * 1. Header: Icon + Título Grande + Subtítulo (conteo)
 * 2. Botón "+ Nuevo" arriba a la derecha
 * 3. Tabs/Navegación si hay subvistas
 * 4. Search + Filtros si hay listados
 * 5. Cards blancas, limpias, con jerarquía tipográfica clara
 * 6. Cero blur, cero opacidad reducida, CERO datos censurados
 */

export const cleanCardClasses = (withBorder = true) => {
  const baseClasses = 'bg-white rounded-xl p-6 transition-all hover:shadow-md shadow-sm';
  return withBorder ? `${baseClasses} border border-black/8` : baseClasses;
};

export const cleanBadgeClasses = (variant: 'blue' | 'green' | 'yellow' | 'red' | 'violet' | 'emerald' = 'blue') => {
  const variants = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    violet: 'bg-violet-100 text-violet-800',
    emerald: 'bg-emerald-100 text-emerald-800',
  };
  return `px-3 py-1 rounded-full text-xs font-bold ${variants[variant]}`;
};

export const cleanInputClasses = () => {
  return 'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all';
};
