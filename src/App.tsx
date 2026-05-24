import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import PropertiesPage from "./pages/modules/PropertiesPage";
import ResidentsPage from "./pages/modules/ResidentsPage";
import CommunicationsPage from "./pages/modules/CommunicationsPage";
import PaymentsPage from "./pages/modules/PaymentsPage";
import AccountingPage from "./pages/modules/AccountingPage";
import ReservationsPage from "./pages/modules/ReservationsPage";
import PQRSPage from "./pages/modules/PQRSPage";
import MaintenancePage from "./pages/modules/MaintenancePage";
import SecurityPage from "./pages/modules/SecurityPage";
import SecurityControlPage from "./pages/modules/SecurityControlPage";
import AdminSecurityPage from "./pages/modules/AdminSecurityPage";
import DocumentsPage from "./pages/modules/DocumentsPage";
import MarketplacePage from "./pages/modules/MarketplacePage";
import AICopilotPage from "./pages/modules/AICopilotPage";
import AnalyticsPage from "./pages/modules/AnalyticsPage";
import SettingsPage from "./pages/modules/SettingsPage";
import SupportPage from "./pages/modules/SupportPage";
import CommonAreasPage from "./pages/modules/CommonAreasPage";

const queryClient = new QueryClient();

// Simple Role Switcher - Ctrl+M keyboard listener
const RoleSwitcher = () => {
  const switchRole = useAuthStore((s) => s.switchRole);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        const roles = ['super_admin', 'admin', 'consejo', 'propietario', 'arrendatario', 'porteria', 'proveedor'];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        switchRole(randomRole as any);
        console.log(`Ctrl+M -> Cambiado a: ${randomRole}`);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [switchRole]);

  return null; // Invisible component
};

const AppContent = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <RoleSwitcher /> {/* Ctrl+M magic */}
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/dashboard" element={<Navigate to="/inicio" replace />} />
        <Route path="/propiedades" element={<PropertiesPage />} />
        <Route path="/residentes" element={<ResidentsPage />} />
        <Route path="/comunicaciones" element={<CommunicationsPage />} />
        <Route path="/pagos" element={<PaymentsPage />} />
        <Route path="/contabilidad" element={<AccountingPage />} />
        <Route path="/reservas" element={<ReservationsPage />} />
        <Route path="/pqrs" element={<PQRSPage />} />
        <Route path="/mantenimiento" element={<MaintenancePage />} />
        <Route path="/seguridad" element={<SecurityPage />} />
        <Route path="/seguridad-control" element={<SecurityControlPage />} />
        <Route path="/config-seguridad" element={<AdminSecurityPage />} />
        <Route path="/auditoria-seguridad" element={<AdminSecurityPage />} />
        <Route path="/documentos" element={<DocumentsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/ia-copiloto" element={<AICopilotPage />} />
        <Route path="/analitica" element={<AnalyticsPage />} />
        <Route path="/configuracion" element={<SettingsPage />} />
        <Route path="/soporte" element={<SupportPage />} />
        <Route path="/zonas-comunes" element={<CommonAreasPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
