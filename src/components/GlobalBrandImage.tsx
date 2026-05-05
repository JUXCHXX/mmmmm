import { useState } from 'react';
import { useBrandStore } from '@/store/useBrandStore';
import { Upload, X, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface GlobalBrandImageProps {
  /**
   * Modo de visualización
   * 'header' - Encabezado compacto
   * 'hero' - Sección hero grande
   * 'modal' - Para modales y diálogos
   * 'communication' - Para comunicados y PDFs
   */
  mode?: 'header' | 'hero' | 'modal' | 'communication';

  /**
   * Clase personalizada adicional
   */
  className?: string;
}

/**
 * GlobalBrandImage Component
 *
 * Componente global que permite cargar una imagen institucional
 * que se reutiliza en toda la aplicación (headers, modales, PDFs, etc)
 *
 * La imagen se almacena en Zustand y puede activarse/desactivarse globalmente
 */
export const GlobalBrandImage = ({
  mode = 'header',
  className = ''
}: GlobalBrandImageProps) => {
  const { brandImage, enabled, setBrandImage } = useBrandStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen',
        variant: 'destructive'
      });
      return;
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen no debe superar 2MB',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    // Leer archivo como Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      setBrandImage(imageSrc);
      setIsLoading(false);
      toast({
        title: 'Éxito',
        description: 'Logo institucional cargado correctamente'
      });
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Error al cargar la imagen',
        variant: 'destructive'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBrandImage(null);
    toast({
      title: 'Imagen removida',
      description: 'El logo institucional ha sido eliminado'
    });
  };

  if (!enabled) return null;

  // Estilos según el modo
  const styles = {
    header: 'h-12 w-auto max-w-[200px]',
    hero: 'h-24 w-auto max-w-[300px]',
    modal: 'h-16 w-auto max-w-[240px]',
    communication: 'h-20 w-auto max-w-[280px]',
  };

  const containerStyles = {
    header: 'py-2',
    hero: 'py-6',
    modal: 'py-3',
    communication: 'py-4',
  };

  // Modo visualización normal
  if (brandImage && !previewMode) {
    return (
      <div className={`flex items-center justify-center gap-3 ${containerStyles[mode]} ${className}`}>
        <img
          src={brandImage}
          alt="Logo Institucional BUNTY"
          className={`${styles[mode]} object-contain drop-shadow-md`}
        />
      </div>
    );
  }

  // Modo carga (solo en header para admin)
  return (
    <div className={`flex items-center justify-center gap-3 ${containerStyles[mode]} ${className}`}>
      {isLoading ? (
        <div className="flex items-center gap-2 text-primary">
          <Loader className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      ) : (
        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-dashed border-primary/50 hover:border-primary transition-colors">
          <Upload className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">
            Cargar Logo
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-label="Cargar logo institucional"
          />
        </label>
      )}
    </div>
  );
};

/**
 * BrandImageManagement Component
 * Panel de administración para cargar/remover imagen global
 * Use esto en página de configuración o admin
 */
export const BrandImageManagement = () => {
  const { brandImage, setBrandImage } = useBrandStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen no debe superar 2MB',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string;
      setBrandImage(imageSrc);
      setIsLoading(false);
      toast({
        title: 'Éxito',
        description: 'Logo institucional actualizado'
      });
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Error al cargar la imagen',
        variant: 'destructive'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Imagen Institucional Global
        </h3>
        <p className="text-sm text-muted-foreground">
          Cargue el logo o imagen de su institución. Se mostrará en headers, comunicados y PDFs.
        </p>
      </div>

      {/* Preview actual */}
      {brandImage && (
        <div className="mb-6 p-4 bg-background rounded-lg border border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Vista previa</p>
            <button
              onClick={() => setBrandImage(null)}
              className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
              title="Remover imagen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-center py-6 bg-muted/50 rounded border border-border">
            <img
              src={brandImage}
              alt="Logo Institucional"
              className="h-32 w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload area */}
      <label className="flex items-center justify-center gap-4 w-full p-8 border border-dashed border-primary/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
        <div className="flex flex-col items-center">
          <Upload className="w-8 h-8 text-primary mb-2" />
          <span className="text-sm font-medium text-foreground">
            {isLoading ? 'Cargando...' : 'Haz clic para cargar imagen'}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            PNG, JPG o GIF (máx 2MB)
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isLoading}
          className="hidden"
          aria-label="Cargar logo institucional"
        />
      </label>
    </div>
  );
};

export default GlobalBrandImage;
