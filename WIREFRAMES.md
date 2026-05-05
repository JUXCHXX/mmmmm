# 🎨 Wireframes & Design Guide - BUNTY Sistema Cromático Premium

## 📋 Índice
1. [Paleta Cromática](#paleta-cromática)
2. [Layout General](#layout-general)
3. [Componentes Principales](#componentes-principales)
4. [Módulos Específicos](#módulos-específicos)
5. [Estado de Diseño](#estado-de-diseño)

---

## 🎨 Paleta Cromática

### Colores Primarios
```
Azul Oscuro Profundo:       HSL(217 91% 30%)  → Headers, Sidebar
Azul Medio Corporativo:     HSL(217 91% 50%)  → Botones, Papas Principales
Azul Celeste:               HSL(199 89% 48%)  → Acentos, Detalles
```

### Colores Secundarios
```
Verde Celeste Elegante:     HSL(162 72% 45%)  → Éxito, Positivo
Teal Pastel:                HSL(162 72% 75%)  → Fondos Secundarios
Verde Azulado Suave:        HSL(170 60% 70%)  → Hover, Microinteracciones
```

### Colores Neutros
```
Blanco Puro:                HSL(0 0% 100%)    → Fondo Principal
Blanco Humo:                HSL(220 14% 96%)  → Fondos Alternos
Gris Azulado Suave:         HSL(220 13% 91%)  → Separadores, Bordes
Gris Oscuro:                HSL(220 13% 25%)  → Texto Principal
```

### Gradientes Predefinidos
```
Header Gradient:     linear-gradient(135deg, azul-oscuro → azul-celeste)
Button Gradient:     linear-gradient(135deg, azul-corporativo → azul-celeste)
Success Gradient:    linear-gradient(135deg, verde-celeste → teal-pastel)
```

---

## 📐 Layout General

### Desktop (> 1024px)
```
┌─────────────────────────────────────────┐
│  BUNTY │  Navegación Global              │
├─────┬───────────────────────────────────┤
│     │                                   │
│ SID │  AREA PRINCIPAL DE CONTENIDOS    │
│ EBA │  Breadcrumb / Titulo              │
│ R   │  Contenido del módulo             │
│     │                                   │
│  A  │                                   │
│  Z  │                                   │
│  U  │                                   │
│  L  │                                   │
│     │                                   │
│  O  │                                   │
│  S  │                                   │
│  C  │                                   │
│  U  │                                   │
│  R  │                                   │
│  O  │                                   │
│     │                                   │
│ (72 │ [260px]                           │
│ px  │                                   │
│ col)│                                   │
└─────┴───────────────────────────────────┘
```

**Measurements:**
- Sidebar Expandido: 260px
- Sidebar Colapsado: 72px
- Main Content: calc(100% - 260px)
- Padding: 8px - 32px según breakpoint

### Mobile (< 640px)
```
┌─────────────────────────────┐
│  ≡  BUNTY                   │
├─────────────────────────────┤
│                             │
│  AREA PRINCIPAL             │
│  (Full Width)               │
│                             │
│  Contenido del módulo       │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ [Nav Inferior]              │
│ 🏠 📊 💬 ⚙️  ❓              │
└─────────────────────────────┘
```

**Features:**
- Sidebar oculto (drawer modal)
- Bottom Navigation: 5 items principales
- Full width content area
- Padding: 12px-16px

### Tablet (640px - 1024px)
```
┌──────────────────────────────┐
│ ≡  BUNTY  │ Navegación       │
├──────┬────────────────────────┤
│ SID  │  AREA PRINCIPAL        │
│ BAR  │                        │
│ (72) │  Contenido             │
│      │                        │
│      │                        │
│      │                        │
└──────┴────────────────────────┘
```

---

## 🎯 Componentes Principales

### 1. Sidebar (Navegación)
**Estado: Expandido**
- Fondo: `bg-gradient-to-b from-azul-oscuro to-sidebar`
- Logo BUNTY en header con gradiente
- Avatar de usuario clickeable
- Items de navegación con hover states
- Botón logout en footer

**Estado: Colapsado**
- Ancho: 72px
- Solo iconos visibles
- Tooltip en hover
- Mismas funcionalidades

**Colores:**
- Fondo: HSL(217 91% 30%)
- Texto: HSL(0 0% 95%)
- Active: gradient(primary → accent) con sombra azulada
- Hover: HSL(162 72% 45%) con 30%

### 2. Botones

**Variante Default (PRIMARY)**
```
Normal:  bg-gradient-to-r from-primary to-accent shadow-md-blue
Hover:   Sombra aumenta a lg-blue, brightness(0.95)
Active:  scale(0.98), shadow-lg-blue
Focus:   ring-2 ring-primary ring-offset-2
```

**Variante Secondary**
```
Fondo:   gradient(verde-celeste → verde-azulado)
Sombra:  shadow-md-blue
Hover:   shadow-lg-blue
```

**Variante Outline**
```
Border:  2px border-primary
Bg:      bg-background hover:bg-primary/5
```

**Variante Premium**
```
Gradient: from-primary via-accent to-secondary
Sombra:   shadow-lg-blue → shadow-xl-blue
Hover:    transform scale(1.05)
```

**Tamaños:**
- Small (sm): h-9, px-3, text-xs, rounded-md
- Default: h-10, px-4, text-sm, rounded-lg
- Large (lg): h-12, px-6, text-base, rounded-lg
- Icon: h-10 w-10, rounded-lg

### 3. Cards

**Base Card**
```
Fondo:    rgba(255, 255, 255, 0.75)
Backdrop: blur(12px)
Border:   1px solid rgba(37, 99, 235, 0.1)
Sombra:   shadow-md-blue
Hover:    shadow-lg-blue, translateY(-4px)
Rounded:  rounded-lg
```

**Glass Card (Variante especial)**
```
Mismo que base pero más translúcido
```

### 4. KPI Card (Dashboard)

**Diseño:**
```
┌─────────────────────────┐
│ LABEL      [GRADIENT]   │
│            [ICON]       │
│                         │
│ 12,345                  │
│ ↑ 12% vs mes anterior    │
└─────────────────────────┘
```

**Estilos:**
- Título: UPPERCASE, tracking-wider, text-muted-foreground
- Ícono: gradient background, shadow-md-blue
- Número: gradient text (primary → accent), text-transparent bg-clip-text
- Trend: color-success o color-destructive

---

## 📦 Módulos Específicos

### 1. Censo de Zonas Comunes

**Página Layout:**
```
[Header con Título + Botón Agregar]

[Stats Cards: Total | Activas | Mantenimiento]

[Search Bar + Filtros por Estado]

[Grid 3 columnas (desktop) / 2 (tablet) / 1 (mobile)]
  ┌──────────────────┐
  │  IMAGEN          │
  │  [Status Badge]  │
  ├──────────────────┤
  │ Nombre Zona      │
  │ Descripción...   │
  │                  │
  │ Capacidad: 40    │
  │ Amenities...     │
  │                  │
  │ [Ver Detalles]   │
  └──────────────────┘

[Modal Detalle - Desplazable]
  [Imagen Grande]
  [Nombre + Status]
  [Capacidad | Reservas | Historial]
  [Amenidades con badges]
  [Reglamentación (bullets)]
  [Botones: Editar | Eliminar | Cerrar]
```

**Colores por Status:**
- Activa: bg-emerald-500/20 text-emerald-400
- Mantenimiento: bg-amber-500/20 text-amber-400
- No disponible: bg-red-500/20 text-red-400

### 2. Comunicaciones Mejorado

**Formulario Creación:**
```
┌─────────────────────────────────┐
│ Título: [Input]                 │
│                                 │
│ Contenido:                      │
│ [TextArea - 4 líneas]           │
│                                 │
│ Categoría: [Select]             │
│ Canal: [Select]                 │
│ Audiencia: [Select]             │
│                                 │
│ ─── ADJUNTOS ───                │
│ [Drag & Drop Zone]              │
│ [Imagen | PDF]                  │
│                                 │
│ [x] Incluir Logo                │
│ ✓ Firma de Admin: Mostrada      │
│                                 │
│ [Vista Previa PDF] [Guardar]    │
└─────────────────────────────────┘
```

**Grid de Comunicaciones:**
```
┌───────────────────────────────┐
│ [Badge Categoria]              │
│ Título Comunicado              │
│                                │
│ Descripción/Excerpt...         │
│                                │
│ [Admin] • 2026-02-17 • 5 💬    │
│                                │
│ [🔖 Pined] [Archive] [Delete]  │
└───────────────────────────────┘
```

**PDF Generado:**
```
┌────────────────────────────┐
│       BUNTY LOGO           │
│  [Logo Institucional]      │
├────────────────────────────┤
│                            │
│ Categoría | Audiencia      │
│ Autor | Fecha              │
│                            │
│ Título Comunicado          │
│                            │
│ Contenido del comunicado   │
│ con formato profesional    │
│                            │
│ Firma Digital del Admin    │
│                            │
│ Generado: 17/02/2026       │
└────────────────────────────┘
```

### 3. GlobalBrandImage

**Ubicaciones:**
1. **Sidebar Header** - Logo pequeño (h-12)
2. **Dashboard Hero** - Logo grande (h-24)
3. **Modales** - Logo mediano (h-16)
4. **PDFs** - Logo institucional (h-20)

**Modos:**
- `header`: Compacto, sin texto
- `hero`: Grande, permitiendo máximo 300px
- `modal`: Mediano, 240px
- `communication`: Con espacio para firma

### 4. AddressWithMaps

**Vista Expandida:**
```
┌──────────────────────────────────┐
│ Ubicación                        │
│ Calle 85 #15-30, Bogotá D.C.    │
│                                  │
│ [🗺️ Google Maps] [🧭 Waze]       │
└──────────────────────────────────┘
```

**Vista Compacta:**
```
[🗺️] [🧭]
```

---

## 📊 Estado de Diseño

### ✅ Completado
- [x] Sistema de Design Tokens
- [x] Variables CSS HSL
- [x] Tailwind Colors Extendidos
- [x] Sidebar Refactorizado
- [x] Botones Premium
- [x] Cards Actualizadas
- [x] KPI Cards Mejorados
- [x] GlobalBrandImage
- [x] CommonAreasPage
- [x] AttachmentUploader
- [x] PDF Generator
- [x] AddressWithMaps

### ⏳ En Progreso
- [ ] Comunicaciones Mejorado (Integración completa)
- [ ] Wireframes Definitivos PDF

### 📋 Notas para Desarrolladores

**Convenciones de Estilos:**
1. Usar `shadow-md-blue` para sombras base
2. `shadow-lg-blue` para hover
3. `shadow-xl-blue` para estados premium
4. Transiciones: `transition-all duration-200` (estándar)
5. Rounded: `rounded-lg` (base), `rounded-xl` (especial)

**Responsive:**
- Mobile first approach
- Breakepoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)
- Padding: xs(4) sm(8) md(16) lg(24) xl(32)

**Performance:**
- Lazy load imágenes
- Usar `motion.` para animaciones Framer Motion
- Glass cards con backdrop-filter solo en componentes necesarios

**Accesibilidad:**
- Contraste mínimo WCAG AA
- Focus states siempre visibles
- Atributos aria-label en iconos
- Titles en botones colapsados

---

## 🎯 Próximos Pasos

1. **Implementar CommunicationsPage completa** con attachments
2. **Testing responsivo** en todos los breakpoints
3. **Optimizar performance** de PDFs
4. **Crear documentación** de componentes
5. **User testing** en navegación y módulos

---

**Última Actualización:** 17 de Febrero de 2026
**Versión:** 1.0 - Sistema Cromático Premium BUNTY
