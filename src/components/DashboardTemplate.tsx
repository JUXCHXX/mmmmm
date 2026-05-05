import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import QuickActions from '@/components/QuickActions';

/**
 * Reusable Dashboard Template
 * Provides consistent structure and animations across different dashboards
 */

interface DashboardTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showHero?: boolean;
  showQuickActions?: boolean;
  className?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  subtitle,
  children,
  showHero = true,
  showQuickActions = true,
  className = '',
}) => {
  return (
    <div className={className}>
      {/* Hero Section */}
      {showHero && <HeroSection />}

      {/* Quick Actions */}
      {showQuickActions && <QuickActions />}

      {/* Title Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </motion.div>

      {/* Content */}
      {children}
    </div>
  );
};

DashboardTemplate.displayName = 'DashboardTemplate';

export default DashboardTemplate;
