import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface FinancialDashboardProps {
  monthlyPayments: { month: string; amount: number; collected: number }[];
  occupancyData: { tower: string; occupied: number; vacant: number }[];
  paymentStatus: { status: string; count: number };
  totalDebt: number;
  totalCollected: number;
  averageOccupancy: number;
}

const COLORS = ['#0F7A5C', '#023047', '#8ECAE6', '#FB8500', '#219EBC'];

export const FinancialDashboard = ({
  monthlyPayments,
  occupancyData,
  paymentStatus,
  totalDebt,
  totalCollected,
  averageOccupancy,
}: FinancialDashboardProps) => {
  const paymentStatusData = [
    { name: 'Al día', value: paymentStatus.count * 0.75, color: '#0F7A5C' },
    { name: 'Con retraso', value: paymentStatus.count * 0.2, color: '#FB8500' },
    { name: 'Vencido', value: paymentStatus.count * 0.05, color: '#EF4444' },
  ];

  const collectionRate = ((totalCollected / (totalCollected + totalDebt)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#0D4A3E] uppercase">Recaudado</h4>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">${totalCollected.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2">+12% vs mes anterior</p>
        </motion.div>

        {/* Total Debt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#0D4A3E] uppercase">Cartera</h4>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700">${totalDebt.toLocaleString()}</p>
          <p className="text-xs text-red-600 mt-2">-8% vs mes anterior</p>
        </motion.div>

        {/* Collection Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#0D4A3E] uppercase">Tasa Recaudación</h4>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{collectionRate}%</p>
          <p className="text-xs text-blue-600 mt-2">De meta del 95%</p>
        </motion.div>

        {/* Average Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#0D4A3E] uppercase">Ocupación Promedio</h4>
            <PieChartIcon className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">{averageOccupancy}%</p>
          <p className="text-xs text-purple-600 mt-2">Del total de unidades</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payments Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#0F7A5C]" />
            <h3 className="text-lg font-bold text-[#0D4A3E]">Recaudación Mensual</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPayments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #0F7A5C',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'rgba(15, 122, 92, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="collected" fill="#0F7A5C" name="Recaudado" radius={[8, 8, 0, 0]} />
              <Bar dataKey="amount" fill="#8ECAE6" name="Esperado" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-[#0D4A3E]" />
            <h3 className="text-lg font-bold text-[#0D4A3E]">Estado de Pagos</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} unidades`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Occupancy by Tower */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#219EBC]" />
            <h3 className="text-lg font-bold text-[#0D4A3E]">Ocupación por Torre</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupancyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="tower" type="category" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #219EBC',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="occupied" fill="#0F7A5C" name="Ocupadas" radius={[0, 8, 8, 0]} />
              <Bar dataKey="vacant" fill="#D1D5DB" name="Desocupadas" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 rounded-xl p-6 border border-[#0F7A5C]/20"
      >
        <h3 className="text-lg font-bold text-[#0D4A3E] mb-4">Análisis de Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-bold text-[#0F7A5C] uppercase mb-2">Tasa de Crecimiento</p>
            <p className="text-2xl font-bold text-[#0D4A3E]">+8.5%</p>
            <p className="text-xs text-[#0D4A3E]/60">Respecto al mes anterior</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F7A5C] uppercase mb-2">Unidades Nuevas</p>
            <p className="text-2xl font-bold text-[#0D4A3E]">+3</p>
            <p className="text-xs text-[#0D4A3E]/60">Ocupadas este mes</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F7A5C] uppercase mb-2">Incobrables Reducidos</p>
            <p className="text-2xl font-bold text-[#0D4A3E]">-12%</p>
            <p className="text-xs text-[#0D4A3E]/60">En relación con el trimestre</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialDashboard;
