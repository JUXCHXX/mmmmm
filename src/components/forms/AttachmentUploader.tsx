import { useState, useRef } from 'react';
import { Upload, X, Image, FileText, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string; // Base64 o URL
  size: number;
}

export interface AttachmentUploaderProps {
  onAttachmentAdd: (attachment: Attachment) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  currentAttachments?: Attachment[];
}

export const AttachmentUploader = ({
  onAttachmentAdd,
  maxFiles = 5,
  maxSizeMB = 10,
  currentAttachments = []
}: AttachmentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    if (currentAttachments.length + files.length > maxFiles) {
      toast({
        title: 'Límite de archivos',
        description: `Máximo ${maxFiles} archivos permitidos`,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tamaño
      if (file.size > maxSizeBytes) {
        toast({
          title: 'Archivo demasiado grande',
          description: `${file.name} supera el límite de ${maxSizeMB}MB`,
          variant: 'destructive'
        });
        continue;
      }

      // Validar tipo
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) {
        toast({
          title: 'Tipo de archivo no permitido',
          description: 'Solo se permiten imágenes y PDFs',
          variant: 'destructive'
        });
        continue;
      }

      // Leer archivo como Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const attachment: Attachment = {
          id: `${Date.now()}-${i}`,
          name: file.name,
          type: isImage ? 'image' : 'pdf',
          url: base64,
          size: file.size
        };
        onAttachmentAdd(attachment);
      };
      reader.readAsDataURL(file);
    }

    setIsLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 bg-muted/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-primary">
            <Loader className="w-6 h-6 animate-spin" />
            <span>Cargando archivo...</span>
          </div>
        ) : (
          <div>
            <Upload className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="font-semibold text-foreground mb-1">Arrastra y suelta aquí</p>
            <p className="text-sm text-muted-foreground">
              o haz clic para seleccionar imágenes o PDFs ({maxSizeMB}MB máx)
            </p>
          </div>
        )}
      </div>

      {/* Adjuntos Actuales */}
      {currentAttachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            Adjuntos ({currentAttachments.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {currentAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="p-2 rounded bg-background">
                  {attachment.type === 'image' ? (
                    <Image className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => {
                    // El padre debe manejar la eliminación
                  }}
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
