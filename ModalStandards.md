# Modal Design Standards

## FloatingModalUnified - Diseño Único Profesional

**Uso obligatorio para todos los modals flotantes.**

```
<FloatingModalUnified
  isOpen={isOpen}
  onClose={onClose}
  title="Título del Modal"
  icon={<Icon className="w-5 h-5" />}
  size="lg" // sm | md | lg | xl
  footer={
    <div className="flex gap-3">
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button>Guardar</Button>
    </div>
  }
>
  Contenido scrollable
</FloatingModalUnified>
```

### Características Consistentes:
- **Header Gradient**: from-[#023047] via-[#0F7A5C] to-[#023047]
- **Icon Circle**: w-10 h-10 gradient from-[#023047] to-[#0F7A5C]
- **Close Button**: X icon con hover rotate 90°
- **Content**: Scrollable, p-4 md:p-8 space-y-6
- **Footer**: Optional, gradient background
- **Animation**: spring damping 20 stiffness 300
- **Backdrop**: bg-black/40 backdrop-blur-sm

### Sizes:
| Size | Class | Uso |
|------|-------|-----|
| sm | max-w-sm | Formularios simples |
| md | max-w-2xl | Detalles, edición |
| lg | max-w-4xl | **Default** - Contenido rico |
| xl | max-w-5xl | Reportes, tablas |

## ❌ Prohibido:
- Modals anidados
- Diseños custom inconsistentes
- Backdrops diferentes (/50 vs /40)
- Sizes arbitrarios
- Headers sin gradient

## Usuarios convertidos:
- ReservationsPage ✅
- ResidentsPage ✅
- UserProfileModal (refactor pending) ⏳

**Mantener FloatingModalUnified como single source of truth.**

