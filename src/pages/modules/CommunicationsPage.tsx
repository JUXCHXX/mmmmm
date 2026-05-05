import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type Communication, type DirectMessage } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getAccessLevel, canCreate, canDelete } from '@/types/modules';
import { MessageSquare, Pin, MessageCircle, Search, Send, Bot, Mail, Bell, Smartphone, Plus, Sparkles, X, Archive, Trash2, Edit2, PinOff, CheckCircle, FileText, Globe, CheckCircle2, FileDown, Image as ImageIcon, Signature, Download, Users, Eye, Music, Video, File, Type, Tag, Megaphone, Paperclip, Phone, Video as VideoIcon, MoreVertical, Circle, ArrowLeft, User, Home, Shield, Check, CheckCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingContainer } from '@/components/FloatingContainer';
import { FloatingModalUnified } from '@/components/FloatingModalUnified';
import { generateCommunicationPDF } from '@/utils/pdfGenerator';

const CATEGORY_STYLES: Record<string, { label: string; class: string }> = {
  official: { label: 'Oficial', class: 'bg-blue-500/20 text-blue-400' },
  strategic: { label: 'Estratégico', class: 'bg-violet-500/20 text-violet-400' },
  general: { label: 'General', class: 'bg-emerald-500/20 text-emerald-400' },
  emergency: { label: 'Emergencia', class: 'bg-red-500/20 text-red-400' },
};

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  push: Smartphone, email: Mail, in_app: Bell, all: Send,
};

const AUDIENCE_LABELS: Record<string, string> = {
  all: 'Todos', owners: 'Propietarios', tenants: 'Arrendatarios', tower_a: 'Torre A', tower_b: 'Torre B', tower_c: 'Torre C', council: 'Consejo', block_1: 'Bloque 1', debtors: 'Morosos',
};

interface ChatContact {
  id: string;
  name: string;
  role: string;
  unit?: string;
  phone?: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread: number;
  online?: boolean;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  owner: Home,
  tenant: User,
  family: Users,
  admin: Shield,
};

const TYPE_LABELS: Record<string, string> = {
  owner: 'Propietario',
  tenant: 'Arrendatario',
  family: 'Familia',
  admin: 'Administración',
};

type MessagesTab = 'chats' | 'directory';

const CommunicationsPage = () => {
  const { communications, directMessages, addCommunication, updateCommunication, deleteCommunication, addDirectMessage, residents } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'feed' | 'messages' | 'ai'>('feed');
  const [messagesSubTab, setMessagesSubTab] = useState<MessagesTab>('chats');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingComm, setEditingComm] = useState<Communication | null>(null);
  const [selectedComm, setSelectedComm] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [viewingComm, setViewingComm] = useState<Communication | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [commentFiles, setCommentFiles] = useState<File[]>([]);

  // Chat states
  const [selectedChat, setSelectedChat] = useState<ChatContact | null>(null);
  const [chatMessages, setChatMessages] = useState<DirectMessage[]>([]);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Communication['category']>('general');
  const [formChannel, setFormChannel] = useState<Communication['channel']>('all');
  const [formAudience, setFormAudience] = useState<Communication['audience']>('all');
  const [formExportPDF, setFormExportPDF] = useState(false);
  const [formAddLogo, setFormAddLogo] = useState(false);
  const [formAddSignature, setFormAddSignature] = useState(false);

  const roleId = user?.roleId ?? 'propietario';
  const accessLevel = getAccessLevel('communications', roleId);
  const canPublish = canCreate('communications', roleId);
  const canRemove = canDelete('communications', roleId);
  
  // Check if user has full access (admin or super_admin)
  const hasFullAccess = roleId === 'admin' || roleId === 'super_admin';

  // Get contacts for directory
  const getContacts = (): ChatContact[] => {
    const contacts: ChatContact[] = [];
    
    // Add administration as a contact
    if (hasFullAccess) {
      contacts.push({
        id: 'admin',
        name: 'Administración',
        role: 'admin',
        lastMessage: 'Contacta con la administración',
        unread: 0,
        online: true,
      });
    }

    // Filter residents by condo if admin
    const filteredResidents = hasFullAccess 
      ? residents.filter(r => r.condoId === 'CONDO1') // For demo, use CONDO1
      : residents.filter(r => r.id === user?.id);

    filteredResidents.forEach(r => {
      // Find last message with this contact
      const contactMessages = directMessages.filter(m => 
        (hasFullAccess && m.from === r.name) || 
        (!hasFullAccess && m.to === r.name)
      );
      const lastMsg = contactMessages[contactMessages.length - 1];
      
      contacts.push({
        id: r.id,
        name: r.name,
        role: r.type,
        unit: r.unit,
        phone: r.phone,
        lastMessage: lastMsg?.content || 'Sin mensajes',
        lastMessageTime: lastMsg?.date,
        unread: contactMessages.filter(m => !m.read).length,
        online: Math.random() > 0.5, // Mock online status
      });
    });

    // Sort by most recent message
    return contacts.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
  };

  const contacts = getContacts();

  // Filter for directory search
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.unit?.toLowerCase().includes(search.toLowerCase())
  );

  // Filter for chat
  const chatContacts = filteredContacts.filter(c => c.lastMessage && c.lastMessage !== 'Sin mensajes');

  // Handle selecting a chat
  const handleSelectChat = (contact: ChatContact) => {
    setSelectedChat(contact);
    
    // Get messages for this contact
    if (contact.role === 'admin') {
      setChatMessages(directMessages);
    } else {
      const contactMsgs = directMessages.filter(m => 
        m.from === contact.name || m.to === contact.name
      );
      setChatMessages(contactMsgs);
    }
  };

  // Send message in chat
  const handleSendChatMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const newMessage: DirectMessage = {
      id: `DM${Date.now()}`,
      from: hasFullAccess ? 'Administración' : (user?.name || 'Usuario'),
      to: selectedChat.name,
      content: messageInput,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
    };
    
    addDirectMessage(newMessage);
    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filtered = communications.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesArchive = showArchived ? c.archived : !c.archived;
    return matchesSearch && matchesCategory && matchesArchive;
  });

  const openCreateModal = () => {
    setEditingComm(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('general');
    setFormChannel('all');
    setFormAudience('all');
    setFormExportPDF(false);
    setFormAddLogo(false);
    setFormAddSignature(false);
    setAttachedFiles([]);
    setShowModal(true);
  };

  const openEditModal = (c: Communication) => {
    setEditingComm(c);
    setFormTitle(c.title);
    setFormContent(c.content);
    setFormCategory(c.category);
    setFormChannel(c.channel);
    setFormAudience(c.audience);
    setFormExportPDF(false);
    setFormAddLogo(false);
    setFormAddSignature(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast({ title: 'Error', description: 'Título y contenido son obligatorios', variant: 'destructive' });
      return;
    }

    let successMessage = 'Comunicado publicado exitosamente';
    const features = [];
    if (formExportPDF) features.push('PDF generado');
    if (formAddLogo) features.push('Logo añadido');
    if (formAddSignature) features.push('Firma electrónica aplicada');
    if (attachedFiles.length > 0) features.push(`${attachedFiles.length} archivo(s) adjunto(s)`);
    if (features.length > 0) {
      successMessage += ` • ${features.join(' • ')}`;
    }

    if (editingComm) {
      updateCommunication(editingComm.id, { title: formTitle, content: formContent, category: formCategory, channel: formChannel, audience: formAudience });
      toast({ title: 'Actualizado', description: 'Comunicado actualizado exitosamente', variant: 'default' });
    } else {
      const newComm = {
        id: `C${Date.now()}`,
        title: formTitle,
        content: formContent,
        category: formCategory,
        channel: formChannel,
        audience: formAudience,
        author: user?.name ?? 'Administración',
        authorRole: roleId,
        date: new Date().toISOString().split('T')[0],
        comments: 0,
        pinned: false,
        archived: false,
        moderated: true,
        aiGenerated: !!aiResult,
        logoUrl: formAddLogo ? '/logo.png' : undefined,
        includeSignature: formAddSignature,
        attachments: attachedFiles.map(f => {const attachmentType: 'image' | 'audio' | 'video' | 'document' = f.type.startsWith('image') ? 'image' : f.type.startsWith('video') ? 'video' : f.type.startsWith('audio') ? 'audio' : 'document'; return { id: `att_${Date.now()}_${Math.random().toString(36).substr(2,9)}`, filename : f.name, type: attachmentType, url: URL.createObjectURL(f), size: f.size, uploadedAt: new Date().toISOString() };})
      };

      addCommunication(newComm);

      if (formExportPDF) {
        try {
          await generateCommunicationPDF({
            title: formTitle,
            content: formContent,
            category: formCategory,
            audience: formAudience,
            author: user?.name ?? 'Administración',
            date: newComm.date,
            brandImage: formAddLogo ? '/logo.png' : undefined,
            adminSignature: formAddSignature ? user?.email ?? 'admin@bunty.com' : undefined,
          });
        } catch (error) {
          console.error('Error generando PDF:', error);
          toast({ title: 'Aviso', description: 'Comunicado publicado pero hubo error al generar PDF', variant: 'default' });
        }
      }

      toast({ title: 'Publicado', description: successMessage, variant: 'default' });
    }
    setShowModal(false);
    setAiResult('');
    setAttachedFiles([]);
  };

  const handleAiAction = (action: string) => {
    let result = '';
    if (action === 'draft') {
      result = 'Estimados residentes,\n\nNos permitimos informar que a partir del próximo lunes se realizarán trabajos de mantenimiento en las áreas comunes del conjunto. El horario será de 8:00 AM a 5:00 PM.\n\nAgradecemos su comprensión.\n\nAtentamente,\nAdministración Torres del Parque';
    } else if (action === 'summarize') {
      result = 'Resumen: Se han publicado 7 comunicados este mes. Temas principales: mantenimiento de ascensores (urgente), asamblea extraordinaria programada para marzo, nuevo horario de piscina y corte de agua programado. 3 comunicados están fijados como prioritarios.';
    } else if (action === 'translate') {
      result = 'Dear residents,\n\nWe would like to inform you that starting next Monday, maintenance work will be carried out in the common areas of the complex. The schedule will be from 8:00 AM to 5:00 PM.\n\nThank you for your understanding.\n\nSincerely,\nTorres del Parque Administration';
    } else if (action === 'correct') {
      result = 'Corrección ortográfica completada. Se corrigieron 3 errores:\n- "mantenimeinto" → "mantenimiento"\n- "acensores" → "ascensores"\n- "horaro" → "horario"';
    }
    setAiResult(result);
    toast({ title: 'IA Copiloto', description: action === 'draft' ? 'Borrador generado' : action === 'summarize' ? 'Resumen generado' : action === 'translate' ? 'Traducción completada' : 'Corrección completada', variant: 'default' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    addDirectMessage({
      id: `DM${Date.now()}`,
      from: user?.name ?? 'Usuario',
      to: 'Administración',
      content: messageInput,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
    });
    setMessageInput('');
    toast({ title: 'Enviado', description: 'Mensaje enviado exitosamente', variant: 'default' });
  };

  const handleAddComment = (commId: string) => {
    if (!commentInput.trim() && commentFiles.length === 0) return;
    const comm = communications.find(c => c.id === commId);
    if (!comm) return;
    const newComment = {
      id: `CMT${Date.now()}`,
      author: user?.name ?? 'Usuario',
      content: commentInput,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      attachments: commentFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
    };
    updateCommunication(commId, {
      comments: comm.comments + 1,
      commentList: [...(comm.commentList || []), newComment],
    });
    setCommentInput('');
    setCommentFiles([]);
    toast({ title: 'Comentario', description: 'Comentario agregado con éxito', variant: 'default' });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, isComment: boolean = false) => {
    const files = Array.from(e.target.files || []);
    if (isComment) {
      setCommentFiles([...commentFiles, ...files]);
    } else {
      setAttachedFiles([...attachedFiles, ...files]);
    }
  };

  const removeAttachedFile = (index: number, isComment: boolean = false) => {
    if (isComment) {
      setCommentFiles(commentFiles.filter((_, i) => i !== index));
    } else {
      setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    }
  };

  const handleDownloadPDF = async (comm: Communication) => {
    try {
      await generateCommunicationPDF({
        title: comm.title,
        content: comm.content,
        category: comm.category,
        audience: comm.audience,
        author: comm.author,
        date: comm.date,
        brandImage: comm.logoUrl || '/logo.png',
        adminSignature: comm.includeSignature ? comm.author : undefined,
      });
      toast({ title: 'Descargado', description: `PDF de "${comm.title}" descargado exitosamente`, variant: 'default' });
    } catch (error) {
      console.error('Error descargando PDF:', error);
      toast({ title: 'Error', description: 'No se pudo descargar el PDF', variant: 'destructive' });
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="icon-responsive-lg text-primary" /> Comunicaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{communications.filter(c => !c.archived).length} comunicados • {directMessages.length} mensajes directos</p>
        </div>
        {canPublish && (
          <button className="btn-premium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2" onClick={openCreateModal}>
            <Plus className="w-4 h-4" /> Nuevo Comunicado
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Bell className="w-4 h-4 inline mr-2" />Muro
        </button>
        <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Send className="w-4 h-4 inline mr-2" />Mensajes
        </button>
        {(accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED') && (
          <button onClick={() => setActiveTab('ai')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Bot className="w-4 h-4 inline mr-2" />IA Asistente
          </button>
        )}
      </div>

      {/* Messages Tab - WhatsApp Style */}
      {activeTab === 'messages' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static overflow-hidden" style={{ height: '600px' }}>
          {/* Sub-tabs for messages */}
          <div className="flex border-b border-[rgba(255,255,255,0.1)]">
            <button 
              onClick={() => { setMessagesSubTab('chats'); setSelectedChat(null); }} 
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${messagesSubTab === 'chats' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />Chats
            </button>
            <button 
              onClick={() => setMessagesSubTab('directory')} 
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${messagesSubTab === 'directory' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users className="w-4 h-4 inline mr-2" />Directorio
            </button>
          </div>

          <div className="flex h-[calc(100%-49px)]">
            {/* Chat List / Directory List */}
            <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-[rgba(255,255,255,0.1)] flex flex-col`}>
              {/* Search */}
              <div className="p-3 border-b border-[rgba(255,255,255,0.1)]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder={messagesSubTab === 'chats' ? "Buscar chats..." : "Buscar contactos..."} 
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" 
                  />
                </div>
              </div>

              {/* Contact List */}
              <div className="flex-1 overflow-y-auto">
                {messagesSubTab === 'chats' ? (
                  chatContacts.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                      <p className="text-sm text-muted-foreground">No hay conversaciones</p>
                      <p className="text-xs text-muted-foreground mt-1">Inicia una desde el directorio</p>
                    </div>
                  ) : (
                    chatContacts.map(contact => (
                      <button
                        key={contact.id}
                        onClick={() => handleSelectChat(contact)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors ${selectedChat?.id === contact.id ? 'bg-[rgba(255,255,255,0.1)]' : ''}`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            {contact.role === 'admin' ? (
                              <Shield className="w-6 h-6 text-primary" />
                            ) : (
                              <User className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-[#1a1a2e]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground truncate">{contact.name}</p>
                            {contact.lastMessageTime && (
                              <span className="text-xs text-muted-foreground">{contact.lastMessageTime.slice(0, 16)}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                            {contact.unread > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-primary rounded-full text-xs text-white">{contact.unread}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )
                ) : (
                  // Directory view
                  filteredContacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => handleSelectChat(contact)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          {contact.role === 'admin' ? (
                            <Shield className="w-6 h-6 text-primary" />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-[#1a1a2e]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-foreground truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {TYPE_LABELS[contact.role] || contact.role}
                          {contact.unit && ` • Unidad ${contact.unit}`}
                        </p>
                        {contact.phone && (
                          <p className="text-xs text-muted-foreground">{contact.phone}</p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedChat ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b border-[rgba(255,255,255,0.1)] flex items-center gap-3">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {selectedChat.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#1a1a2e]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{selectedChat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.online ? 'En línea' : TYPE_LABELS[selectedChat.role] || selectedChat.role}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg text-muted-foreground hover:text-foreground">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-3 opacity-30" />
                        <p className="text-muted-foreground">Sin mensajes aún</p>
                        <p className="text-xs text-muted-foreground mt-1">Envía un mensaje para comenzar la conversación</p>
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => {
                      const isMine = hasFullAccess ? msg.from === 'Administración' : msg.from === user?.name;
                      const showAvatar = idx === 0 || chatMessages[idx - 1].from !== msg.from;
                      
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] ${isMine ? 'order-2' : 'order-1'}`}>
                            <div className={`px-4 py-2 rounded-2xl ${
                              isMine 
                                ? 'bg-primary text-white rounded-br-md' 
                                : 'bg-[rgba(255,255,255,0.1)] text-foreground rounded-bl-md'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px] text-muted-foreground">{msg.date.slice(0, 16)}</span>
                              {isMine && (
                                msg.read ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-muted-foreground" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg text-muted-foreground hover:text-foreground">
                      <Plus className="w-5 h-5" />
                    </button>
                    <input 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Escribe un mensaje..." 
                      className="flex-1 h-10 px-4 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <button 
                      onClick={handleSendChatMessage}
                      disabled={!messageInput.trim()}
                      className="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // No chat selected - show placeholder
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium text-foreground">WhatsApp Bunty</p>
                  <p className="text-sm text-muted-foreground mt-1">Selecciona un chat para comenzar a messaging</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'ai' ? (
        <div className="space-y-6">
          {/* Encabezado IA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Asistente IA Profesional</h3>
                <p className="text-sm text-muted-foreground mt-1">Herramientas potenciadas por inteligencia artificial para optimizar tus comunicaciones</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de herramientas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Herramientas IA
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'draft', icon: FileText, title: 'Redactar Comunicado', desc: 'Genera un borrador profesional', color: 'from-blue-500 to-blue-600' },
                  { action: 'summarize', icon: FileText, title: 'Resumir Comunicados', desc: 'Resume los comunicados', color: 'from-emerald-500 to-green-600' },
                  { action: 'translate', icon: Globe, title: 'Traducir Comunicado', desc: 'Traduce a inglés', color: 'from-amber-500 to-orange-500' },
                  { action: 'correct', icon: CheckCircle, title: 'Corrección Ortográfica', desc: 'Revisa errores de ortografía', color: 'from-rose-500 to-pink-500' },
                ].map((tool) => (
                  <motion.button
                    key={tool.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAiAction(tool.action)}
                    className={`w-full p-4 rounded-xl bg-gradient-to-br ${tool.color} bg-opacity-10 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] transition-all text-left group`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{tool.title}</p>
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Panel de resultado */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                Resultado IA
              </h3>
              {aiResult ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] max-h-96 overflow-y-auto">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{aiResult}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResult);
                        toast({ title: 'Copiado', description: 'Resultado copiado al portapapeles', variant: 'default' });
                      }}
                      className="flex-1 px-4 h-11 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] text-foreground font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      Copiar
                    </button>
                    {canPublish && (
                      <button
                        onClick={() => {
                          setFormContent(aiResult);
                          openCreateModal();
                        }}
                        className="flex-1 px-4 h-11 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Usar como Comunicado
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-10 h-10 text-violet-400 opacity-50" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">Selecciona una herramienta</p>
                  <p className="text-sm text-muted-foreground">Elige una opción a la izquierda para generar contenido con IA</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Información adicional */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl border border-[rgba(255,255,255,0.1)]">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-violet-400" />
              Acerca de nuestro Asistente IA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Rápido', desc: 'Genera contenido en segundos', icon: Sparkles },
                { title: 'Profesional', desc: 'Redacción de calidad empresarial', icon: FileText },
                { title: 'Multiidioma', desc: 'Traduce a múltiples lenguajes', icon: Globe },
              ].map((feature, i) => (
                <div key={i} className="p-4 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
                  <p className="font-bold text-foreground mb-1 inline-flex items-center gap-2">
                    <feature.icon className="h-4 w-4 text-violet-400" />
                    {feature.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar comunicados..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="h-10 px-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground focus:outline-none focus:border-primary">
              <option value="all">Todas las categorías</option>
              <option value="official">Oficial</option>
              <option value="strategic">Estratégico</option>
              <option value="general">General</option>
              <option value="emergency">Emergencia</option>
            </select>
            <button onClick={() => setShowArchived(!showArchived)} className={`h-10 px-4 rounded-xl text-sm font-medium transition-colors ${showArchived ? 'bg-primary/20 text-primary' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground'} border border-[rgba(255,255,255,0.10)]`}>
              <Archive className="w-4 h-4 inline mr-1" />{showArchived ? 'Archivados' : 'Activos'}
            </button>
          </motion.div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 bg-white rounded-xl border border-black/8 shadow-sm-static p-8 rounded-xl">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold text-foreground">No hay comunicados</p>
                <p className="text-sm text-muted-foreground mt-2">{showArchived ? 'Archivados' : 'Activos'}</p>
              </motion.div>
            )}
            {filtered.map((c, i) => {
              const ChannelIcon = CHANNEL_ICONS[c.channel] || Send;
              const isExpanded = selectedComm === c.id;
              const authorInitials = c.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md border border-[rgba(255,255,255,0.1)] hover:border-primary/50 transition-all">
                  {/* Header con autor e info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
                        <h4 className="font-bold text-foreground text-base">{c.author}</h4>
                        <span className="text-xs text-muted-foreground">{c.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Publicación oficializada</p>
                    </div>
                  </div>

                  {/* Badges de categoría y canal */}
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    {c.pinned && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Fijado
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_STYLES[c.category].class}`}>
                      {CATEGORY_STYLES[c.category].label}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[rgba(255,255,255,0.08)] text-foreground flex items-center gap-1">
                      <ChannelIcon className="w-3 h-3" />
                      {c.channel === 'all' ? 'Todos' : c.channel.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[rgba(255,255,255,0.08)] text-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {AUDIENCE_LABELS[c.audience] || c.audience}
                      </span>
                    </span>
                    {c.aiGenerated && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> IA
                      </span>
                    )}
                  </div>

                  {/* Título y contenido */}
                  <div className="mb-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                    <h3 className="text-lg font-bold text-foreground mb-3">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{c.content.substring(0, 200)}...</p>
                  </div>

                  {/* Metadatos de firma y archivos */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                      c.includeSignature
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20 opacity-50'
                    }`}>
                      <Signature className="w-4 h-4" /> Firmado
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                      c.attachments && c.attachments.length > 0
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20 opacity-50'
                    }`}>
                      <FileText className="w-4 h-4" /> PDF ({c.attachments?.length || 0})
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)] flex-wrap">
                    <button onClick={() => setSelectedComm(isExpanded ? null : c.id)} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)]">
                      <MessageCircle className="w-4 h-4" /> {c.comments} comentarios
                    </button>
                    <button onClick={() => setViewingComm(c)} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-[#0F7A5C] transition-colors" title="Ver comunicación completa">
                      <Eye className="w-4 h-4" />
                    </button>
                    {canPublish && (
                      <>
                        <button onClick={() => handleDownloadPDF(c)} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-green-400 transition-colors" title="Descargar PDF">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateCommunication(c.id, { pinned: !c.pinned })} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-amber-400 transition-colors" title={c.pinned ? 'Desfijar' : 'Fijar'}>
                          {c.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </button>
                        <button onClick={() => updateCommunication(c.id, { archived: !c.archived })} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground transition-colors" title={c.archived ? 'Restaurar' : 'Archivar'}>
                          <Archive className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(c)} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-primary transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {canRemove && (
                      <button onClick={() => { deleteCommunication(c.id); toast({ title: 'Eliminado', variant: 'default' }); }} className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sección de comentarios expandida */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                            Comentarios ({c.commentList?.length || 0})
                          </div>
                          {(c.commentList || []).map(cmt => (
                            <div key={cmt.id} className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <span className="font-bold text-sm text-foreground">{cmt.author}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{cmt.date}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{cmt.content}</p>
                              {cmt.attachments && cmt.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {cmt.attachments.map((att, idx) => (
                                    <span key={idx} className="text-xs bg-[rgba(255,255,255,0.08)] text-muted-foreground px-2 py-1 rounded flex items-center gap-1">
                                      <FileDown className="w-3 h-3" /> {att.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {(c.commentList || []).length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">Sin comentarios aún</p>
                          )}
                          <div className="mt-4 p-4 bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.08)]">
                            <textarea
                              value={commentInput}
                              onChange={e => setCommentInput(e.target.value)}
                              placeholder="Agregar un comentario..."
                              className="w-full h-20 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                              onClick={() => handleAddComment(c.id)}
                              className="w-full mt-2 px-4 h-10 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                              <Send className="w-4 h-4" />Enviar Comentario
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Create/Edit Modal - Nuevo Diseño Profesional */}
      <FloatingContainer
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingComm ? 'Editar Comunicado' : 'Nuevo Comunicado'}
        icon={<Send className="w-5 h-5" />}
        size="md"
      >
        <div className="space-y-5 p-1">
          {/* Campo: Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input 
              value={formTitle} 
              onChange={e => setFormTitle(e.target.value)} 
              placeholder="REUNIÓN" 
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" 
            />
          </div>

          {/* Campo: Contenido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Contenido <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={formContent} 
              onChange={e => setFormContent(e.target.value)} 
              placeholder="Escribe el contenido del comunicado..." 
              rows={6} 
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none" 
            />
          </div>

          {/* Adjuntos Multimedia - Dropzone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Archivos Adjuntos</label>
            <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer">
              <input 
                type="file" 
                multiple 
                onChange={(e) => handleFileInputChange(e, false)} 
                className="hidden" 
                id="comm_attach_new" 
              />
              <label htmlFor="comm_attach_new" className="cursor-pointer">
                <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Seleccionar archivos (Imagen, Audio, Video, PDF)</p>
              </label>
            </div>
            {attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => removeAttachedFile(index, false)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fila de Selectores: Categoría / Canal / Audiencia */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select 
                value={formCategory} 
                onChange={e => setFormCategory(e.target.value as 'official' | 'strategic' | 'general' | 'emergency')} 
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              >
                <option value="official">Oficial</option>
                <option value="strategic">Estratégico</option>
                <option value="general">General</option>
                <option value="emergency">Emergencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Canal</label>
              <select 
                value={formChannel} 
                onChange={e => setFormChannel(e.target.value as 'push' | 'email' | 'in_app' | 'all')} 
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              >
                <option value="all">Todos</option>
                <option value="push">Push</option>
                <option value="email">Email</option>
                <option value="in_app">In-App</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Audiencia</label>
              <select 
                value={formAudience} 
                onChange={e => setFormAudience(e.target.value as 'all' | 'owners' | 'tenants' | 'tower_a' | 'tower_b' | 'council' | 'debtors')} 
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              >
                <option value="all">Todos</option>
                <option value="owners">Propietarios</option>
                <option value="tenants">Arrendatarios</option>
                <option value="tower_a">Torre A</option>
                <option value="tower_b">Torre B</option>
                <option value="council">Consejo</option>
              </select>
            </div>
          </div>

          {/* Opciones de Comunicado Profesional */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              Opciones de Comunicado Profesional
            </h4>
            <div className="space-y-4">
              {/* Exportar a PDF */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-white hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">
                <input 
                  type="checkbox" 
                  checked={formExportPDF} 
                  onChange={(e) => setFormExportPDF(e.target.checked)}
                  className="w-5 h-5 rounded text-green-600 mt-0.5" 
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-800 block">Exportar a PDF</span>
                  <span className="text-xs text-gray-500">Generar documento PDF del comunicado</span>
                </div>
              </label>

              {/* Incluir Logo del Conjunto */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-white hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">
                <input 
                  type="checkbox" 
                  checked={formAddLogo} 
                  onChange={(e) => setFormAddLogo(e.target.checked)}
                  className="w-5 h-5 rounded text-green-600 mt-0.5" 
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-800 block">Incluir Logo del Conjunto</span>
                  <span className="text-xs text-gray-500">Añadir branding institucional al documento</span>
                </div>
              </label>

              {/* Firma Electrónica */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-white hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">
                <input 
                  type="checkbox" 
                  checked={formAddSignature} 
                  onChange={(e) => setFormAddSignature(e.target.checked)}
                  className="w-5 h-5 rounded text-green-600 mt-0.5" 
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-800 block">Firma Electrónica</span>
                  <span className="text-xs text-gray-500">Aplicar firma digital al comunicado</span>
                </div>
              </label>
            </div>
          </div>

          {/* Botonera Inferior */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setShowModal(false)} 
              className="flex-1 px-5 py-3.5 rounded-2xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave} 
              className="flex-1 px-5 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
            >
              {editingComm ? 'Guardar Cambios' : 'Publicar'}
            </button>
          </div>
        </div>
      </FloatingContainer>

      {/* View Communication Modal */}
      <FloatingModalUnified
        isOpen={viewingComm !== null}
        onClose={() => setViewingComm(null)}
        title={viewingComm?.title || 'Comunicación'}
        size="lg"
      >
        {viewingComm && (
          <div className="space-y-4">
            <div className="space-y-2 pb-3 border-b border-[rgba(255,255,255,0.10)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${CATEGORY_STYLES[viewingComm.category].class}`}>{CATEGORY_STYLES[viewingComm.category].label}</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-[rgba(255,255,255,0.06)] text-muted-foreground">{viewingComm.channel === 'all' ? 'Todos' : viewingComm.channel.toUpperCase()}</span>
                </div>
                <span className="text-xs text-muted-foreground">{viewingComm.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{AUDIENCE_LABELS[viewingComm.audience] || viewingComm.audience}</span>
                <span className="text-xs text-muted-foreground">{viewingComm.author}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingComm.content}</p>
            <div className="flex gap-2 pt-3 border-t border-[rgba(255,255,255,0.10)]">
              <button onClick={() => handleDownloadPDF(viewingComm)} className="flex-1 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Descargar PDF
              </button>
              <button onClick={() => setViewingComm(null)} className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </FloatingModalUnified>
    </div>
  );
};

export default CommunicationsPage;
