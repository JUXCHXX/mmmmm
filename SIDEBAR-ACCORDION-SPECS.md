# 🎭 Sidebar Acordeón - Rediseño Completo BUNTY

## 📋 Cambios Principales

El sidebar ha sido **completamente rediseñado** como un acordeón colapsable con 5 secciones principales, reemplazando la estructura anterior.

### De → A
- ❌ Estructura plana con 5 grupos estáticos
- ✅ **Acordeón interactivo** con secciones expandibles/colapsables

---

## 🎨 SISTEMA VISUAL

### Colores
```
Fondo Sidebar:        #0F2E24    (verde muy oscuro)
Texto Primario:       rgba(255,255,255,0.75)    (14px)
Texto Activo:         #FFFFFF    (blanco puro)
Texto Hover:          #FFFFFF    (con transición)

Item Activo BG:       rgba(255,255,255,0.12)
Item Hover BG:        rgba(255,255,255,0.08)
Section Expanded BG:  rgba(255,255,255,0.12)

Subítems Texto:       rgba(255,255,255,0.6)
Subítems Hover:       rgba(255,255,255,0.8) → #FFFFFF
Logout Hover BG:      rgba(255,100,100,0.2)
```

### Dimensiones
```
Ancho Desktop:        240px (expandido) / 64px (colapsado)
Altura Total:         100vh (full screen)
Border Radius:        8px (todas las secciones)
Padding Sections:     12px
Gap Entre Items:      8px (sections), 4px (subitems)
```

### Tipografía
```
Logo:                 14px, bold, letter-spacing 1px
Section Label:        14px, 500 weight, max-width 140px
Subítem Label:        13px, normal weight
```

---

## 🎭 LAS 5 SECCIONES PRINCIPALES

### 1️⃣ PLATAFORMA (LayoutGrid)
```
├─ Dashboard Corporativo  (LayoutDashboard)
└─ Residentes            (Users)
```

### 2️⃣ OPERACIÓN (Settings2)
```
├─ Comunicaciones        (MessageSquare)
├─ Pagos y Cartera      (CreditCard)
├─ Contabilidad          (FileText/Calculator)
├─ Reservas              (CalendarDays)
├─ PQRS                  (ClipboardList)
├─ Mantenimiento         (Wrench)
└─ Seguridad             (ShieldCheck)
```

### 3️⃣ DOCUMENTOS (FolderOpen)
```
├─ Documentos            (FileStack)
└─ Marketplace           (ShoppingBag)
```

### 4️⃣ INTELIGENCIA (BrainCircuit)
```
├─ IA Copiloto PH        (Bot)
└─ Analítica             (BarChart3)
```

### 5️⃣ ADMINISTRACIÓN (UserCog)
```
├─ Configuración Global  (Settings)
└─ Soporte Global        (HeadsetHelp)
```

---

## 🎬 COMPORTAMIENTO & INTERACCIONES

### Estado Inicial
- **Sección abierta por defecto:** PLATAFORMA
- **Las demás:** Colapsadas

### Hacer Clic en Sección
```
1. Si está cerrada → Abre (max-height: 0 → 500px)
2. Si está abierta → Cierra (max-height: 500px → 0)
3. Las demás secciones se cierran automáticamente
   (acordeón EXCLUSIVO)
```

### Chevron (›)
- **Cerrado (0°):** Pointing right →
- **Abierto (90°):** Pointing down ↓
- **Transición:** 200ms ease

### Item Activo
- **Permanece resaltado** aunque la sección esté colapsada
- **Background:** rgba(255,255,255,0.15)
- **Color:** white, font-weight: 500

### Subítems Interior
- **Border-left:** 1px rgba(255,255,255,0.1)
- **Padding-left:** 12px (respecto al borde)
- **Margin-left:** 10px (para que el borde esté alineado)
- **Transición collapse:** max-height 0.25s ease-in-out

---

## 💻 ESTRUCTURA HTML/REACT

### Componente
```tsx
// src/components/layout/Sidebar.tsx

// Estado
const [collapsed, setCollapsed] = useState(false);
const [expandedSection, setExpandedSection] = useState<string | null>('plataforma');

// Toggle sección (acordeón exclusivo)
const toggleSection = (sectionId: string) => {
  setExpandedSection(expandedSection === sectionId ? null : sectionId);
};

// Render
<motion.aside
  animate={{ width: collapsed ? 64 : 240 }}
  transition={{ duration: 0.3 }}
  className="bg-[#0F2E24] border-r border-white/10"
>
  {/* Header con logo */}

  {/* 5 Secciones con accordion */}
  {SIDEBAR_SECTIONS.map((section) => (
    <div key={section.id}>
      <motion.button
        onClick={() => toggleSection(section.id)}
        className={isExpanded ? 'bg-white/12' : ''}
      >
        <SectionIcon className="w-5 h-5" />
        {!collapsed && <span>{section.label}</span>}
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Subítems */}
      <AnimatePresence>
        {isExpanded && !collapsed && (
          <motion.div
            animate={{ maxHeight: 500 }}
            exit={{ maxHeight: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Subitems rendering */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}

  {/* Logout button */}
</motion.aside>
```

---

## 🎨 VARIANTES DE ESTADOS

### Desktop (240px)
```
├─ Header (Logo + Toggle)
├─ Secciones (completas, visibles)
├─ Subitems (en acordeón)
└─ Footer (Logout completo)
```

### Mobile/Colapsed (64px)
```
├─ Header (solo Toggle)
├─ Secciones (solo ícono, no label)
├─ Subitems (NO visibles nunca en mode colapsado)
└─ Footer (solo ícono Logout)
```

### Item Activo
```
Background:      rgba(255,255,255,0.15)
Color:           #FFFFFF
Font Weight:     500
Border Radius:   8px
```

### Hover en Sección/Item
```
Background:      rgba(255,255,255,0.08)
Color:           #FFFFFF (gradual)
Transition:      0.2s ease
```

---

## 📱 RESPONSIVE

### Desktop (1200px+)
- Display: flex, fixed position
- Width: 240px (full) o 64px (collapsed)
- Layout: Vertical, left sidebar
- ml offset en main: lg:ml-72

### Tablet/Mobile (<1200px)
- Transform a horizontal bottom nav (opcional)
- o collapse a solo-icon version
- Ajustar según UX design

---

## 🔄 ANIMACIONES

### Transiciones
```
Sidebar width:           0.3s cubic-bezier(0.3, 0, 0.4, 1)
Chevron rotate:          0.2s ease
Max-height subitems:     0.25s ease-in-out
Text opacity (collapsed):fadeOut 0.2s

Hover effects:
├─ Background:          0.15s ease
├─ Color:               0.15s ease
└─ Icon scale:          optional 1.05 on hover
```

### AnimatePresence (React)
```
Subitems:
  initial={{ opacity: 0, maxHeight: 0 }}
  animate={{ opacity: 1, maxHeight: 500 }}
  exit={{ opacity: 0, maxHeight: 0 }}
  transition={{ duration: 0.25, ease: 'easeInOut' }}
```

---

## ⚙️ CONFIGURACIÓN LUCIDE ICONS

### Tamaños
```
Sección Principal:    20px (LayoutGrid, Settings2, etc.)
Subítem:              16px (MessageSquare, CreditCard, etc.)
Chevron Right:        16px
Logo Icon:            20px (Building2)
Logout Icon:          20px
```

### Opacidades
```
Sección Principal:    opacity 100%
Subítem Default:      opacity 70%
Subítem Hover/Active: opacity 100%
Chevron:              opacity 50%
```

---

## 🎯 IMPLEMENTACIÓN CHECKLIST

```
✅ Importar nuevos íconos: LayoutGrid, Settings2, FolderOpen, BrainCircuit, UserCog, ChevronRight
✅ Definir SIDEBAR_SECTIONS array (5 secciones)
✅ Crear estado expandedSection (string | null)
✅ Función toggleSection (acordeón exclusivo)
✅ Renderizar secciones con motion.button colapsables
✅ AnimatePresence para subitems
✅ Transiciones suaves (max-height, rotate)
✅ Actualizar Sidebar.tsx completamente
✅ Color fondo a #0F2E24
✅ Ajustar ml-offset en AppLayout (lg:ml-72 → check width)
✅ Logo con ícono + "BUNTY" text
✅ Logout button en footer
✅ Responsive: 240px desktop, 64px collapsed
✅ Ocultar texto/labels cuando collapsed
✅ Tooltip en items colapsados
```

---

## 📊 COMPARATIVA CON ANTERIOR

| Característica | Anterior | Nuevo |
|---|---|---|
| **Estructura** | Plana, 5 grupos visibles | Acordeón, colapsable |
| **Interacción** | Clic = navegar solo | Clic sección = expandir/contraer |
| **Visual** | Gradiente azul-verde | Verde oscuro #0F2E24 |
| **Subítems** | Siempre visibles | Mostrar solo si expandido |
| **Ancho** | 72px / 280px | 64px / 240px |
| **Animaciones** | Básicas | Avanzadas (rotate, max-height) |
| **Estado Inicial** | Todos grupos | PLATAFORMA abierto |

---

## 🚀 NOTAS TÉCNICAS

### Dependencias Requeridas
- `framer-motion` (AnimatePresence, motion)
- `lucide-react` (todos los íconos)
- `react-router-dom` (NavLink)

### Tailwind/CSS
```css
/* Si usas Tailwind */
bg-[#0F2E24]
text-white/75
text-white/60
rgba(255,255,255,0.12)

/* Transiciones */
transition-all duration-250
transition-colors duration-150
```

### Performance
- ✅ AnimatePresence solo renderiza si visible
- ✅ Memoización opcional para SIDEBAR_SECTIONS
- ✅ useCallback para toggleSection si es necesario
- ✅ Lazy loading de módulos futuros

---

## 📝 EJEMPLO DE USO

```tsx
<Sidebar />
// Automáticamente:
// 1. PLATAFORMA abierto
// 2. Detecta ruta actual y lo resalta
// 3. Permite expandir/contraer otras secciones
// 4. Mantiene item activo visible siempre
```

---

**Estado:** ✅ Implementado
**Archivo:** src/components/layout/Sidebar.tsx
**Demo:** 4-sidebar-accordion-demo.html
**Versión:** 1.0
**Última actualización:** Abril 2026
