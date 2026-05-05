import type { Condo } from '@/types/condo';

/**
 * Pure functions for dashboard metrics calculations
 * Extracted for reusability and testability
 */

export const calculateTotalUnits = (condos: Condo[]): number => {
  return condos.reduce((acc, condo) => acc + condo.totalUnits, 0);
};

export const calculateTotalResidents = (condos: Condo[]): number => {
  return condos.reduce((acc, condo) => acc + condo.totalResidents, 0);
};

export const calculateTotalDebt = (condos: Condo[]): number => {
  return condos.reduce((acc, condo) => acc + condo.totalDebt, 0);
};

export const calculateAverageOccupancy = (condos: Condo[]): number => {
  if (condos.length === 0) return 0;
  const totalOccupancy = condos.reduce((acc, condo) => acc + condo.occupancyRate, 0);
  return Math.round(totalOccupancy / condos.length);
};

export const calculateTotalAlerts = (condos: Condo[]): number => {
  return condos.reduce((acc, condo) => acc + condo.alerts, 0);
};

export const calculateMetrics = (condos: Condo[]) => ({
  totalUnits: calculateTotalUnits(condos),
  totalResidents: calculateTotalResidents(condos),
  totalDebt: calculateTotalDebt(condos),
  avgOccupancy: calculateAverageOccupancy(condos),
  totalAlerts: calculateTotalAlerts(condos),
  condoCount: condos.length,
});

export const calculateDebtPercentage = (debt: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((debt / target) * 100);
};

export const calculateUtilizationRate = (used: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO').format(value);
};

export default {
  calculateTotalUnits,
  calculateTotalResidents,
  calculateTotalDebt,
  calculateAverageOccupancy,
  calculateTotalAlerts,
  calculateMetrics,
  calculateDebtPercentage,
  calculateUtilizationRate,
  formatCurrency,
  formatNumber,
};
