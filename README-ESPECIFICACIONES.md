# 🎨 BUNTY - Especificaciones de Diseño

## Rediseño de Módulos: Perfil + Reservas

---

## 📋 Índice

1. [Módulo 1: Perfil por Rol](#módulo-1-perfil-por-rol)
2. [Módulo 2: Reservas](#módulo-2-reservas)
3. [Sistema de Diseño](#sistema-de-diseño)
4. [Stack Técnico](#stack-técnico)
5. [Guía de Implementación](#guía-de-implementación)

---

## MÓDULO 1: PERFIL POR ROL

### 📐 Especificaciones Técnicas

#### Contenedor Modal Base
```
Ancho:           560px (desktop), 100% (mobile, max 100vw - 32px padding)
Alto Máximo:     90vh
Border Radius:   12px
Sombra:          0 8px 32px rgba(0,0,0,0.12)
Fondo:           #FFFFFF
Estructura:      Flexbox (column)
```

#### Estructura Interna
```
┌─────────────────────────────────────┐
│  Modal Header (sticky top)         │ 24px padding
├─────────────────────────────────────┤
│  Modal Body (scrollable)           │ Flex: 1, overflow-y: auto
│  - Avatar    (72px círculo)        │ 24px padding
│  - Campos    (con ícono izq)       │ gap: 20px between items
│  - Secciones (con divisor)         │
│  - Badges    (solo lectura)        │
│  - Chips     (permisos/mascotas)   │
├─────────────────────────────────────┤
│  Modal Footer (sticky bottom)       │ 16px padding, bg #fafbfc
│  [Cancelar] [Guardar Cambios]      │ gap: 12px
└─────────────────────────────────────┘
```

#### Header
- Ícono de rol (36x36px, círculo verde #1b4a3a)
- Título: "Editar [Rol]" (16px, 600 weight, color #1b4a3a)
- Botón cerrar (X) esquina superior derecha, color #6b7280

#### Campos de Entrada
```
Estructura:
├─ Label           12px uppercase, color #6b7280, font-weight 600
├─ Input Wrapper   posición: relative
│  ├─ Ícono        18x18px, posición absolute left 12px, color #9ca3af
│  └─ Input        width 100%, padding 10px 12px 10px 40px
└─ Estilos:
   - Border:       1px solid #e5e7eb
   - Focus:        border #1b4a3a, box-shadow 0 0 0 3px rgba(27,74,58,0.1)
   - Disabled:     background #f9fafb, color #9ca3af, cursor not-allowed
   - Readonly:     background #f9fafb, cursor default
```

#### Avatar
```
Tamaño:           72x72px
Border Radius:    50%
Border:           3px solid #e5e7eb
Background:       gradient(135deg, #1b4a3a 0%, #2d6a5a 100%)
Font Size:        32px emoji

Botón Editar:
├─ Posición:      absolute bottom: 0, right: 0
├─ Tamaño:        28x28px
├─ Border:        2px solid white
├─ Background:    #1b4a3a
├─ Icon:          14x14px, color white
└─ Hover:         background #0f3429, transform scale(1.05)
```

#### Secciones
```
Divisor:
├─ height:        1px
├─ background:    #f3f4f6
├─ margin:        24px 0

Subtítulo:
├─ font-size:     12px
├─ font-weight:   600
├─ color:         #9ca3af
├─ text-transform: uppercase
├─ letter-spacing: 0.3px
└─ margin-bottom: 16px
```

#### Badges de Estado
```
Badge Success (Al día / Activo):
├─ bg:            #d1f3e9
├─ color:         #065f46
├─ padding:       4px 12px
├─ border-radius: 12px

Badge Warning (Pendiente):
├─ bg:            #fef3c7
├─ color:         #92400e

Badge Error (Mora / Inactivo):
├─ bg:            #fee2e2
├─ color:         #991b1b

Badge Neutral (Neutral):
├─ bg:            #f3f4f6
├─ color:         #6b7280
```

#### Chips
```
Display:         inline-flex, flex-wrap wrap, gap 6px
Padding:         4px 10px
Border Radius:   20px
Font Size:       12px
Background:      #f3f4f6
Color:           #4b5563
Border:          1px solid #e5e7eb
```

#### Botones Footer
```
Estructura:
├─ display:       flex
├─ gap:           12px
├─ justify:       flex-end
├─ padding:       16px 24px
├─ background:    #fafbfc
├─ position:      sticky, bottom: 0
└─ border-top:    1px solid #e5e7eb

Cancelar:
├─ background:    white
├─ color:         #1f2937
├─ border:        1px solid #d1d5db
└─ hover:         background #f9fafb

Guardar Cambios:
├─ background:    #1b4a3a
├─ color:         white
├─ hover:         background #0f3429, shadow 0 4px 12px rgba(...)
```

### 🎭 Campos por Rol

#### 1️⃣ SUPER ADMIN
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ Documento             [Input + CreditCard icon]
├─ Correo electrónico    [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Estado de Acceso
├─ Rol                   [Readonly + Badge "Rol Activo" #d1f3e9]
├─ Permisos Activos      [Chips: Gestión de usuarios, Reportes, Configuración, Auditoría, Facturación]
└─ Fecha de Creación     [Readonly + Calendar icon]
```

#### 2️⃣ ADMINISTRADOR
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ Documento             [Input + CreditCard icon]
├─ Correo                [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Asignación
├─ Unidad asignada       [Readonly + Home icon]
└─ Conjunto/Edificio     [Readonly + Building icon]

Sección 3 - Contacto de Emergencia
├─ Contacto              [Input + User icon]
└─ Teléfono de emergencia [Input + Phone icon]
```

#### 3️⃣ CONSEJO DE ADMINISTRACIÓN
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ Documento             [Input + CreditCard icon]
├─ Correo                [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Unidad
└─ Unidad                [Readonly + Home icon]

Sección 3 - Cargo en el Consejo
├─ Cargo                 [Dropdown: Presidente/Vocal/Tesorero]
├─ Periodo de Gestión (Inicio) [Input date]
└─ Periodo de Gestión (Fin)    [Input date]

Sección 4 - Contacto de Emergencia
├─ Contacto              [Input + User icon]
└─ Teléfono              [Input + Phone icon]
```

#### 4️⃣ PROPIETARIO
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ Documento             [Input + CreditCard icon]
├─ Correo                [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Unidad
└─ Unidad                [Readonly + Home icon]

Sección 3 - Estado de Pago
├─ Estado                [Badge: Al Día #d1f3e9 o En Mora #fee2e2]
├─ Vehículos Registrados [Chips: Toyota Corolla - ABD1234, Honda CR-V - XYZ5678]
└─ Mascotas Registradas  [Chips: Max (Perro), Misi (Gato)]

Sección 4 - Contacto de Emergencia
├─ Contacto              [Input + User icon]
└─ Teléfono              [Input + Phone icon]
```

#### 5️⃣ ARRENDATARIO
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ Documento             [Input + CreditCard icon]
├─ Correo                [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Unidad
└─ Unidad                [Readonly + Home icon]

Sección 3 - Detalles del Contrato
├─ Propietario del Inmueble     [Readonly + User icon]
├─ Fecha Inicio Contrato         [Input date]
└─ Fecha Fin Contrato            [Input date]

Sección 4 - Contacto de Emergencia
├─ Contacto              [Input + User icon]
└─ Teléfono              [Input + Phone icon]
```

#### 6️⃣ SEGURIDAD
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ Documento             [Input + CreditCard icon]
├─ Correo                [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Información Laboral
├─ Turno Asignado            [Readonly + Clock icon]
├─ Empresa de Seguridad      [Input + Building icon]
└─ Número ID Laboral         [Input + CreditCard icon]

Sección 3 - Contacto de Emergencia
├─ Contacto              [Input + User icon]
└─ Teléfono              [Input + Phone icon]
```

#### 7️⃣ PROVEEDOR
```
Sección 1 - Datos Personales
├─ Nombre completo       [Input + User icon]
├─ NIT / RUT            [Input + CreditCard icon]
├─ Correo                [Input + Mail icon]
└─ Teléfono              [Input + Phone icon]

Sección 2 - Datos de la Empresa
├─ Nombre de la Empresa     [Input + Building icon]
├─ Tipo de Servicio         [Dropdown + Truck icon]
├─ Documentos               [File Upload Button]
└─ Calificación Promedio    [Star Rating - readonly]
```

---

## MÓDULO 2: RESERVAS

### 📐 Estructura General

#### Vistas por Rol
```
┌─────────────────────┐
│   TABS NAVEGACIÓN   │ <- Super Admin | Propietario/Arrendatario | Seguridad
├─────────────────────┤
│   VISTA CONTENIDA   │
└─────────────────────┘
```

### 👨‍💼 VISTA SUPER ADMIN / ADMINISTRADOR

#### Estructura de Página
```
┌─────────────────────────────────────────────────┐
│ Gestión de Reservas        [+ Nuevo Espacio]   │ Layout: flex, justify-between
├─────────────────────────────────────────────────┤
│ 4 Métrica Cards (grid auto-fit minmax 240px)   │
├─────────────────────────────────────────────────┤
│ Filtros: [Espacios ▼] [Estado ▼] [Fechas ▼]  │ Flex bar
├─────────────────────────────────────────────────┤
│ 6 Space Cards (grid auto-fill minmax 280px)   │
├─────────────────────────────────────────────────┤
│ Reservas Activas - Tabla                        │
└─────────────────────────────────────────────────┘
```

#### Card de Métrica
```
┌────────────────┐
│ LABEL          │ uppercase, 12px, #6b7280
│ 24             │ 32px, bold, #1b4a3a
│ ↑ 8% vs semana │ 13px, #9ca3af
└────────────────┘
Padding: 20px, Border: 1px #e5e7eb
```

#### Filtros
```
Background:      white
Padding:         16px
Border Radius:   8px
Display:         flex, gap 12px, flex-wrap
Selects:         padding 8px 12px, min-width 140px
```

#### Space Card
```
┌──────────────────┐
│  Imagen (emoji)  │ 160px alto, gradient fondo, emoji 48px
│ [Badge Estado]   │ absolute top-right
├──────────────────┤
│ Nombre           │ 16px, bold, #1b4a3a
│ 👥 80 personas   │ 13px, #6b7280
│ ⏰ 08:00-22:00   │ 13px, #6b7280
├──────────────────┤
│ 📅 Próxima: ...  │ 12px, background #f9fafb, border-left 3px #1b4a3a
├──────────────────┤
│ [Editar][Ver Ag] │ 2 botones flex gap 8px
└──────────────────┘
```

#### Tabla de Reservas
```
Columnas:
├─ Residente       bold #1b4a3a
├─ Unidad
├─ Espacio
├─ Fecha y Hora
├─ Estado          badge (Pendiente, Confirmada, Cancelada)
└─ Acciones        [✓ Aprobar] [✕ Rechazar] [Ver] [✕ Cancelar]

Hover:             background #f9fafb
```

### 🏠 VISTA PROPIETARIO/ARRENDATARIO

#### Layout
```
main-content (flex: 1)           sidebar (350px)
├─ Título                        ├─ Info Card (Unidad, Residente, Estado)
├─ Espacios Grid                 │
├─ Formulario de Reserva         ├─ Mis Reservas
│  ├─ Espacio seleccionado       │  ├─ Reservation Item
│  ├─ Fecha (date picker)        │  └─ Reservation Item
│  ├─ Hora (time slots)          │
│  ├─ # Personas                 └─
│  ├─ Motivo (textarea)
│  ├─ Checkbox reglamento
│  └─ [Solicitar Reserva]
```

#### Space Card (Mini)
```
┌──────────────────────┐
│   Imagen (emoji)     │ 120px alto
├──────────────────────┤
│ Salón Comunal        │ 14px, bold, #1b4a3a
│ 👥 Hasta 80 pers.    │ 12px, #6b7280
│ ⏰ 08:00-22:00       │ 11px, #9ca3af
└──────────────────────┘

Border:              2px solid #e5e7eb
Selected:            border #1b4a3a, box-shadow 0 0 0 3px rgba(27,74,58,0.1)
Hover:               border #1b4a3a, shadow elevando
```

#### Formulario
```
Espacio Seleccionado     [Input readonly]
Fecha                    [Input date]
Hora                     [Time slots grid 3 cols, gap 8px]
# Personas               [Input number]
Motivo                   [Textarea min-height 80px]
[✓] Acepto reglamento    [Checkbox + label]
[Solicitar Reserva]      [Button primary full-width]
```

#### Time Slots
```
Padding:             8px 12px
Border:              1px solid #e5e7eb
Border Radius:       6px
Cursor:              pointer
Font Size:           13px, bold, #1b4a3a
Background:          white

States:
├─ Default:          border #e5e7eb, bg white
├─ Hover:            border #1b4a3a, bg #f9fafb
├─ Selected:         bg #1b4a3a, color white, border #1b4a3a
└─ Disabled:         bg #f3f4f6, color #d1d5db, border #e5e7eb
```

#### Mis Reservas (Sidebar)
```
┌─────────────────────────────────────┐
│ Salón Comunal                       │
│ 15 Abr, 14:00 - 17:00              │ Pendiente
│                          [Cancelar] │
├─────────────────────────────────────┤
│ BBQ                                 │
│ 20 Abr, 17:00 - 21:00              │ Confirmada
│                          [Cancelar] │
└─────────────────────────────────────┘

Item Padding:        14px
Item Border:         1px #e5e7eb
Item Border Radius:  8px
Item Hover:          bg #f9fafb
```

### 🛡️ VISTA SEGURIDAD

#### Estructura
```
┌─────────────────────────────────────────┐
│ Control de Acceso - Reservas del Día    │
│ Hoy: 14 Abr 2026 | Turno: Tarde        │ subtitle
├─────────────────────────────────────────┤
│ Checklist Items (lista)                 │
└─────────────────────────────────────────┘
```

#### Checklist Item
```
┌──────────────────────────────────────────────────────────┐
│ 👥 Juan Pérez García                                     │
│ 🏠 Unidad: Apt. 301                                      │
│ 🎪 Espacio: Salón Comunal                                │
│ ⏰ Hora: 14:00 - 17:00                                   │
│                              [✓ Ingresó] [✕ No se presentó] │
└──────────────────────────────────────────────────────────┘

Padding:             16px
Border Bottom:       1px #f3f4f6
Hover:               background #f9fafb
Checked:             background #d1f3e9, opacity 0.6

Checked Buttons:     opacity 0.5, cursor default
```

---

## SISTEMA DE DISEÑO

### 🎨 Paleta de Colores

#### Primario
- Verde Oscuro: `#1b4a3a` (headers, botones, accents)
- Verde Oscuro Hover: `#0f3429` (estados hover)

#### Neutrales
- Blanco: `#ffffff`
- Gris Muy Claro: `#f9fafb`
- Gris Claro: `#e5e7eb` (bordes)
- Gris Texto Secundario: `#6b7280` (labels)
- Gris Texto: `#4b5563`
- Gris Oscuro: `#1f2937` (texto principal)

#### Semánticos
- Success: bg `#d1f3e9`, text `#065f46`
- Warning: bg `#fef3c7`, text `#92400e`
- Error: bg `#fee2e2`, text `#991b1b`
- Info: bg `#dbeafe`, text `#1e40af`

### ✍️ Tipografía

```
Font Family:  Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

H1:           28px, 700, line-height 1.2
H2:           24px, 700, line-height 1.3
H3:           18px, 700, line-height 1.4
Body:         14px, 400, line-height 1.6
Label:        12px, 600, uppercase, letter-spacing 0.3px
Caption:      12px, 500, line-height 1.5
```

### 📏 Sistema de Espaciado

```
4px   -> xs (micro-spacing)
8px   -> sm (spacing between icons & text)
12px  -> md (badges, item spacing)
16px  -> lg (input padding, section spacing)
20px  -> xl (card padding, headers)
24px  -> 2xl (modal padding, main spacing)
```

### 📐 Border Radius

```
6px   -> inputs, buttons
10px  -> cards
12px  -> modales
50%   -> avatar circular
```

### 💫 Sombras

```
Sutil:   0 1px 3px rgba(0,0,0,0.05)
Medio:   0 4px 12px rgba(27,74,58,0.3)
Alto:    0 8px 32px rgba(0,0,0,0.12)
```

---

## STACK TÉCNICO

### Recomendado

```
Frontend Framework:
├─ React 18+ (o framework moderno)
├─ TypeScript
└─ Tailwind CSS o CSS Modules

Componentes:
├─ React Hook Form (forms)
├─ Radix UI Dialog (modales)
├─ Lucide React (íconos)
└─ React Calendar / React DatePicker

UI/UX:
├─ Framer Motion (animaciones)
└─ react-hot-toast (notificaciones)

Testing:
├─ Jest
├─ React Testing Library
└─ Cypress (E2E)

Dev Tools:
├─ Storybook (component showcase)
├─ ESLint + Prettier
└─ Vitest
```

### Estructura de Carpetas

```
src/
├─ components/
│  ├─ Profile/
│  │  ├─ ProfileModal.tsx
│  │  ├─ ProfileModal.module.css
│  │  ├─ variants/
│  │  │  ├─ SuperAdminProfile.tsx
│  │  │  ├─ AdministratorProfile.tsx
│  │  │  └─ ... (otros roles)
│  │  └─ ProfileModal.test.tsx
│  │
│  ├─ Reservations/
│  │  ├─ ReservationsView.tsx
│  │  ├─ ReservationsView.module.css
│  │  ├─ SuperAdminView/
│  │  ├─ ResidentView/
│  │  ├─ SecurityView/
│  │  └─ components/
│  │     ├─ SpaceCard.tsx
│  │     ├─ ReservationTable.tsx
│  │     ├─ BookingForm.tsx
│  │     └─ ...
│  │
│  └─ UI/
│     ├─ Modal.tsx
│     ├─ Badge.tsx
│     ├─ Button.tsx
│     ├─ Input.tsx
│     ├─ Card.tsx
│     └─ ...
│
├─ styles/
│  ├─ global.css
│  ├─ variables.css (colores, espaciado, etc.)
│  └─ animations.css
│
├─ hooks/
│  ├─ useProfile.ts
│  ├─ useReservations.ts
│  └─ ...
│
├─ types/
│  ├─ profile.ts
│  ├─ reservations.ts
│  └─ common.ts
│
└─ pages/
   ├─ ProfileSettingsPage.tsx
   └─ ReservationsPage.tsx
```

---

## GUÍA DE IMPLEMENTACIÓN

### Fases de Desarrollo

#### Fase 1: Setup Base
- [ ] Configurar proyecto (React + TypeScript)
- [ ] Instalar dependencias (Tailwind, Lucide, etc.)
- [ ] Crear paleta de colores como variables CSS
- [ ] Configurar Storybook

#### Fase 2: Componentes Base
- [ ] Modal reutilizable
- [ ] Input con ícono
- [ ] Badge component
- [ ] Card base
- [ ] Button variants
- [ ] Tabla base

#### Fase 3: Módulo Perfil
- [ ] ProfileModal wrapper
- [ ] 7 variantes por rol
- [ ] Avatar upload
- [ ] Validación de formularios
- [ ] Tests unitarios

#### Fase 4: Módulo Reservas
- [ ] SuperAdminView (datos + UI)
- [ ] ResidentView (formulario)
- [ ] SecurityView (checklist)
- [ ] API integration
- [ ] Tests de integración

#### Fase 5: Pulido
- [ ] Responsive testing
- [ ] A11y audit
- [ ] Performance optimization
- [ ] Documentación
- [ ] Deploy

### Checkpoints Visuales

```
✓ Color accuracy (#1b4a3a en botones, badges, etc.)
✓ Espaciado consistente (4px scale)
✓ Tipografía correcta (weights, sizes)
✓ Focus states visibles (inputs, buttons)
✓ Hover states suaves
✓ Animaciones (entrances, transitions)
✓ Responsive correcta (desktop, tablet, mobile)
✓ Accessibility (ARIA, contrast, keyboard nav)
```

### Performance Targets

```
LCP:  < 2.5s
FID:  < 100ms
CLS:  < 0.1
TTI:  < 3.8s
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Desktop:  1400px+ (full layout)
Tablet:   768px - 1023px (ajustes grid)
Mobile:   < 768px (1 col, fullscreen modales)

Reglas CSS:
@media (max-width: 1024px) {
  .two-column { grid-template-columns: 1fr; }
  .spaces-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .modal { width: calc(100vw - 32px); }
  .sidebar { display: none; /* or below main */ }
  .table { font-size: 12px; }
}
```

---

## 🔄 ESTADOS E INTERACCIONES

### Focus States
```
Inputs destacados con:
- Border color cambio a #1b4a3a
- Box-shadow 3px rgba
- Outline: none
```

### Hover States
```
Botones:        background más oscuro
Cards:          elevación (shadow increase)
Rows:           background ligero (#f9fafb)
Links:          underline + color cambio
```

### Loading States
```
Botones deshabilitados durante submit
Spinner o skeleton loaders en áreas de contenido
Toast notifications para feedback
```

### Error States
```
Inputs con error:   border #991b1b, error message below
Toast rojo:         #fee2e2 fondo, #991b1b texto
Validation:         en tiempo real, debounced
```

---

## 🎯 ENTREGABLES

```
✅ 1-perfil-modales-7-roles.html
   - Grid comparativo de todos los modales
   - Previsualizaciones interactivas

✅ 2-modulo-reservas-completo.html
   - Vistas Super Admin, Propietario, Seguridad
   - Tabs interactivas
   - Diseño totalmente funcional

✅ 3-design-system-guia-componentes.html
   - Paleta de colores
   - Tipografía
   - Componentes reutilizables
   - Ejemplos de uso

✅ 4-ESPECIFICACIONES.md (este archivo)
   - Guía técnica completa
   - Stack recomendado
   - Checklist de implementación
```

---

## 📞 NOTAS DE IMPLEMENTACIÓN

### Consideraciones de Seguridad
- Validar todos los inputs en servidor
- Sanitizar datos antes de mostrar
- Usar HTTPS siempre
- CSRF tokens en formularios
- Rate limiting en APIs

### Consideraciones de Accesibilidad
- ARIA labels en botones/inputs
- Contraste mínimo 4.5:1 para texto
- Navegación con teclado (Tab)
- Focus visible (no outline: none)
- Estructura semántica HTML

### Consideraciones de Performance
- Code splitting por vistas
- Lazy loading de modales
- Optimización de imágenes
- Caché de datos
- Virtual scrolling para listas largas

---

**Versión:** 1.0
**Última Actualización:** Abril 2026
**Autor:** Senior UI/UX Designer - Bunty Team
**Estado:** Listo para Desarrollo ✅
