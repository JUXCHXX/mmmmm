import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  FileText, Download, Eye, Search, FolderOpen, CheckCircle, Clock,
  Printer, PenTool, Building2, Users, Shield, X, Upload, Plus,
  File, FileImage, FileText as FileDoc, FileSpreadsheet, FileIcon,
  CloudUpload, Image, Trash2, Share2, FileCheck, AlertCircle, Sparkles,
  FileArchive, FileAudio, FileVideo, GripVertical, Home, BarChart3, Zap, User, HardDrive
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ElementType; color: string; gradientFrom: string; gradientTo: string }> = {
  minutes: { label: 'Actas', icon: FileText, color: 'blue', gradientFrom: 'from-blue-500/20', gradientTo: 'to-blue-500/5' },
  regulations: { label: 'Reglamentos', icon: Shield, color: 'violet', gradientFrom: 'from-violet-500/20', gradientTo: 'to-violet-500/5' },
  contracts: { label: 'Contratos', icon: PenTool, color: 'emerald', gradientFrom: 'from-emerald-500/20', gradientTo: 'to-emerald-500/5' },
  financial: { label: 'Financiero', icon: BarChart3, color: 'amber', gradientFrom: 'from-amber-500/20', gradientTo: 'to-amber-500/5' },
  legal: { label: 'Legal', icon: Shield, color: 'rose', gradientFrom: 'from-rose-500/20', gradientTo: 'to-rose-500/5' },
  suppliers: { label: 'Proveedores', icon: Users, color: 'cyan', gradientFrom: 'from-cyan-500/20', gradientTo: 'to-cyan-500/5' },
  residents: { label: 'Residentes', icon: Users, color: 'purple', gradientFrom: 'from-purple-500/20', gradientTo: 'to-purple-500/5' },
  administration: { label: 'Administración', icon: Building2, color: 'orange', gradientFrom: 'from-orange-500/20', gradientTo: 'to-orange-500/5' },
};

// Helper function to get file icon based on type
const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="w-8 h-8 text-red-400" />;
    case 'doc':
    case 'docx':
      return <FileDoc className="w-8 h-8 text-blue-400" />;
    case 'xlsx':
      return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
    case 'image':
      return <FileImage className="w-8 h-8 text-purple-400" />;
    case 'zip':
    case 'rar':
      return <FileArchive className="w-8 h-8 text-amber-400" />;
    case 'audio':
      return <FileAudio className="w-8 h-8 text-pink-400" />;
    case 'video':
      return <FileVideo className="w-8 h-8 text-cyan-400" />;
    default:
      return <FileIcon className="w-8 h-8 text-gray-400" />;
  }
};

// Helper function to get color based on file type
const getFileTypeColor = (fileType?: string) => {
  switch (fileType) {
    case 'pdf':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'doc':
    case 'docx':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'xlsx':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'image':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'zip':
    case 'rar':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const DocumentsPage = () => {
  const { documents } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.roleId === 'super_admin';
  const isArrendatario = user?.roleId === 'arrendatario';
  const isPropietario = user?.roleId === 'propietario';
  const isOwner = isArrendatario || isPropietario;
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Documents specifically for tenant/owner (contracts, legal docs direct to them)
  const personalDocuments = documents.filter(d => 
    d.category === 'contracts' || d.category === 'legal'
  );
  
  // Other documents (read-only for tenants/owners)
  const generalDocuments = documents.filter(d => 
    d.category !== 'contracts' && d.category !== 'legal'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: documents.length,
    regulations: documents.filter(d => d.category === 'regulations').length,
    signed: documents.filter(d => d.signed).length,
    pending: documents.filter(d => !d.signed).length,
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Simulate upload progress
    setUploadedFile(file);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext || 'other';
  };

  return (
    <div className="space-y-8">
      {/* Header Mejorado */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
              <FolderOpen className="h-10 w-10 text-primary" />
              Gestión Documental
            </h1>
            {isSuperAdmin && (
              <p className="text-sm text-primary font-semibold mt-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Vista de Super Administrador
              </p>
            )}
            {isOwner && (
              <p className="text-sm text-cyan-400 font-semibold mt-2 flex items-center gap-2">
                {isArrendatario ? <User className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                {isArrendatario ? 'Arrendatario' : 'Propietario'} - Mis Documentos
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Organiza, descarga y comparte todos tus documentos importantes
            </p>
          </div>
          {isSuperAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/30 to-primary/20 hover:from-primary/40 hover:to-primary/30 text-primary font-bold transition-all shadow-lg hover:shadow-xl border border-primary/30"
            >
              <Plus className="w-5 h-5" />
              Nuevo Documento
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* KPI Cards Mejoradas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FolderOpen, label: 'Total Documentos', value: stats.total, color: 'blue' },
          { icon: Shield, label: 'Reglamentos', value: stats.regulations, color: 'violet' },
          { icon: FileCheck, label: 'Firmados', value: stats.signed, color: 'emerald' },
          { icon: Clock, label: 'Pendiente Firma', value: stats.pending, color: 'amber' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-2xl border border-${stat.color}-500/20 hover:border-${stat.color}-500/40 hover:shadow-lg hover:shadow-${stat.color}-500/10 transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500/30 to-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">+0%</span>
            </div>
            <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Personal Documents Section for Owners/Tenants - Can sign these */}
      {isOwner && personalDocuments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-foreground">Documentos Legales Personales</h2>
            <span className="text-xs text-muted-foreground">(Contratos y documentos legales directos a ti - Puedes firmar)</span>
          </div>
          <div className="space-y-3">
            {personalDocuments.map((d, i) => (
              <motion.div 
                key={d.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }} 
                className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500"
                onClick={() => setSelectedDoc(d)}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  {getFileIcon(d.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{d.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_LABELS[d.category]?.class || 'bg-gray-500/20 text-gray-400'}`}>
                      {CATEGORY_LABELS[d.category]?.label || d.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getFileTypeColor(d.fileType)}`}>
                      {d.fileType?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {d.signed ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Firmado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400 px-2 py-1 rounded-lg bg-amber-500/20">
                      <Clock className="w-3 h-3" />
                      Pendiente
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); setSelectedDoc(d); }} className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toast({ title: 'Descarga iniciada', description: `${d.name}` }); }} className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search & Filter Section Mejorada */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar documentos por nombre, categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] hover:border-primary/30 focus:border-primary/50 text-foreground placeholder-muted-foreground focus:outline-none transition-all shadow-lg"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] hover:border-primary/30 focus:border-primary/50 text-foreground text-sm focus:outline-none transition-all shadow-lg"
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </motion.div>

      {/* Documentos Grid Mejorado */}
      <div className="space-y-4">
        {filteredDocuments.length > 0 && (
          <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-primary" />
            {filteredDocuments.length} Documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
          </h2>
        )}

        {filteredDocuments.map((d, i) => {
          const categoryInfo = CATEGORY_LABELS[d.category];
          const CategoryIcon = categoryInfo?.icon || File;
          const getColorClasses = (color: string) => {
            const colorMap: Record<string, { bg: string; text: string; border: string; borderL: string }> = {
              blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', borderL: 'border-l-blue-500/60' },
              violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', borderL: 'border-l-violet-500/60' },
              emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', borderL: 'border-l-emerald-500/60' },
              amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', borderL: 'border-l-amber-500/60' },
              rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', borderL: 'border-l-rose-500/60' },
              cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', borderL: 'border-l-cyan-500/60' },
              purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', borderL: 'border-l-purple-500/60' },
              orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', borderL: 'border-l-orange-500/60' },
            };
            return colorMap[color] || { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', borderL: 'border-l-gray-500/60' };
          };

          const colors = categoryInfo ? getColorClasses(categoryInfo.color) : getColorClasses('orange');

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-l-4 hover:shadow-xl transition-all cursor-pointer ${colors.border} ${colors.borderL}`}
              onClick={() => setSelectedDoc(d)}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className={`w-16 h-16 rounded-2xl ${categoryInfo?.gradientFrom ?? 'from-gray-500/20'} ${categoryInfo?.gradientTo ?? 'to-gray-500/5'} bg-gradient-to-br flex items-center justify-center shrink-0 flex-col ${colors.border} border`}>
                <CategoryIcon className="h-6 w-6 text-white" />
                <span className="text-xs font-bold text-muted-foreground mt-1">{d.fileType?.toUpperCase() || 'FILE'}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-lg truncate mb-2">{d.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${colors.bg} ${colors.text} ${colors.border}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <CategoryIcon className="h-3.5 w-3.5" />
                      {categoryInfo?.label || d.category}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-[rgba(255,255,255,0.04)] px-2 py-1 rounded-full">
                    <FileText className="h-3 w-3" />
                    v{d.version}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-[rgba(255,255,255,0.04)] px-2 py-1 rounded-full">
                    <HardDrive className="h-3 w-3" />
                    {d.size}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:flex-col">
                {d.signed ? (
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/20 font-bold border border-emerald-500/30"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Firmado
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1.5 text-xs text-amber-400 px-3 py-1.5 rounded-full bg-amber-500/20 font-bold border border-amber-500/30"
                  >
                    <Clock className="w-4 h-4" />
                    Pendiente
                  </motion.span>
                )}
                <div className="flex items-center gap-1 sm:flex-row sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); setSelectedDoc(d); }}
                    className="p-2.5 rounded-xl hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); toast({ title: 'Descarga iniciada', description: `${d.name}` }); }}
                    className="p-2.5 rounded-xl hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-white rounded-xl border border-black/8 shadow-sm-static rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-lg font-semibold text-foreground mb-1">No se encontraron documentos</p>
          <p className="text-sm text-muted-foreground">Intenta con otros filtros de busqueda</p>
        </motion.div>
      )}

      {/* Modal de Vista Previa del Documento */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#0D4A3E]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con icono profesional */}
              <div className="h-1.5 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />
              <div className="p-5 border-b bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white shadow-lg">
                      {getFileIcon(selectedDoc.fileType)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {selectedDoc.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_LABELS[selectedDoc.category]?.class || 'bg-gray-500/20 text-gray-400'}`}>
                          {CATEGORY_LABELS[selectedDoc.category]?.label || selectedDoc.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getFileTypeColor(selectedDoc.fileType)}`}>
                          {selectedDoc.fileType?.toUpperCase() || 'FILE'}
                        </span>
                        <span className="text-xs text-muted-foreground">Version {selectedDoc.version}</span>
                        <span className="text-xs text-muted-foreground">{selectedDoc.size}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDoc(null)} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-5 overflow-y-auto max-h-[50vh]">
                {/* Vista previa del documento */}
                <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-6 mb-6 border border-dashed border-[#0D4A3E]/30">
                  {selectedDoc.previewUrl ? (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden bg-black/20">
                        <img 
                          src={selectedDoc.previewUrl} 
                          alt={selectedDoc.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Vista previa del documento</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F7A5C]/20 to-[#0D4A3E]/20 flex items-center justify-center mx-auto mb-4 border border-[#0F7A5C]/30">
                        {getFileIcon(selectedDoc.fileType)}
                      </div>
                      <p className="text-lg font-semibold text-foreground mb-1">{selectedDoc.name}</p>
                      <p className="text-sm text-muted-foreground">Vista previa no disponible</p>
                    </div>
                  )}
                </div>

                {/* Descripcion del documento */}
                {selectedDoc.description && (
                  <div className="mb-4 p-4 rounded-xl bg-blue-500/5 border border-blue">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5-500/20 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Descripcion</p>
                        <p className="text-sm text-muted-foreground mt-1">{selectedDoc.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informacion del documento */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Fecha de carga
                    </p>
                    <p className="font-semibold text-foreground">{selectedDoc.uploadDate}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Subido por
                    </p>
                    <p className="font-semibold text-foreground">{selectedDoc.uploadedBy}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <File className="w-3 h-3" />
                      Tamano
                    </p>
                    <p className="font-semibold text-foreground">{selectedDoc.size}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      {selectedDoc.signed ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      Estado
                    </p>
                    <p className={`font-semibold ${selectedDoc.signed ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedDoc.signed ? 'Firmado' : 'Pendiente de firma'}
                    </p>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Opciones para Residentes
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Como super administrador, puedes compartir este documento con los residentes del conjunto.
                    </p>
                    <button className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Compartir con Residentes
                    </button>
                  </div>
                )}
              </div>

              {/* Footer con acciones */}
              <div className="p-4 border-t bg-background flex gap-3">
                <button onClick={() => { toast({ title: 'Imprimiendo', description: 'Documento enviado a impresion' }); }} className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] text-foreground font-semibold hover:bg-[rgba(255,255,255,0.10)] transition-colors flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                {/* Only show Sign button for: SuperAdmin, or personal documents (contracts/legal) for owners/tenants */}
                {!selectedDoc.signed && (isSuperAdmin || (!isArrendatario && !isPropietario) || (selectedDoc.category === 'contracts' || selectedDoc.category === 'legal')) ? (
                  <button onClick={() => { toast({ title: 'Firmando', description: 'Firma registrada exitosamente' }); }} className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D4A3E] text-white font-semibold hover:bg-[#0D4A3E]/90 transition-colors flex items-center justify-center gap-2">
                    <PenTool className="w-4 h-4" />
                    Firmar
                  </button>
                ) : (
                  <button onClick={() => { toast({ title: 'Descarga iniciada', description: selectedDoc.name }); }} className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D4A3E] text-white font-semibold hover:bg-[#0D4A3E]/90 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para agregar documento */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowAddModal(false); setUploadedFile(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-[#0D4A3E]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header profesional */}
              <div className="h-1.5 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />
              <div className="p-5 border-b bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white shadow-lg">
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#0F7A5C]" />
                        Subir Nuevo Documento
                      </h2>
                      <p className="text-xs text-muted-foreground">Completa los detalles del documento</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowAddModal(false); setUploadedFile(null); }} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F7A5C]" />
                    Nombre del documento
                  </label>
                  <input type="text" placeholder="Ej: Acta de reunion Octubre 2024" className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#0F7A5C]" />
                    Categoria
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                    <option value="">Seleccionar categoria</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0F7A5C]" />
                    Version
                  </label>
                  <input type="text" placeholder="Ej: 1.0" className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
                </div>

                {/* Zona de carga de archivos mejorada */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#0F7A5C]" />
                    Archivo
                  </label>
                  {!uploadedFile ? (
                    <div 
                      className={`border border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDragging 
                          ? 'border-[#0F7A5C] bg-[#0D4A3E]/10' 
                          : 'border-[#0D4A3E]/30 hover:border-[#0F7A5C]/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.gif"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                      <div className="w-16 h-16 rounded-2xl bg-[#0D4A3E]/10 flex items-center justify-center mx-auto mb-4">
                        <CloudUpload className="w-8 h-8 text-[#0F7A5C]" />
                      </div>
                      <p className="text-sm text-foreground font-medium mb-1">Arrastra y suelta el archivo aqui</p>
                      <p className="text-xs text-muted-foreground">o haz clic para seleccionar</p>
                      <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX, XLSX hasta 10MB</p>
                    </div>
                  ) : (
                    <div className="border border-[#0F7A5C]/30 rounded-xl p-4 bg-[#0D4A3E]/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0D4A3E]/20 flex items-center justify-center">
                          {getFileIcon(getFileExtension(uploadedFile.name) as 'pdf' | 'doc' | 'docx' | 'xlsx' | 'image' | 'other')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          {uploadProgress < 100 && (
                            <div className="mt-2 h-1.5 bg-[#0D4A3E]/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#0D4A3E] transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={handleRemoveFile}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {uploadProgress === 100 && (
                        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Archivo cargado exitosamente
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F7A5C]" />
                    Descripcion (opcional)
                  </label>
                  <textarea rows={3} placeholder="Agrega una descripcion del documento..." className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 resize-none"></textarea>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <input type="checkbox" id="shareResidents" className="w-4 h-4 rounded" />
                  <label htmlFor="shareResidents" className="text-sm text-foreground">Compartir automaticamente con los residentes</label>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-5 py-4 border-t border-[#0D4A3E]/10 flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowAddModal(false); setUploadedFile(null); }}
                  className="flex-1 px-5 py-2.5 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { toast({ title: 'Documento subido', description: 'El documento se ha cargado exitosamente' }); setShowAddModal(false); setUploadedFile(null); }}
                  className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:from-[#0F7A5C] hover:to-[#0D4A3E] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Subir Documento
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsPage;
