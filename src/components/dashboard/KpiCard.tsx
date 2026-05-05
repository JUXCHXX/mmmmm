import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  delay?: number;
}

const KpiCard = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  trend,
  delay = 0,
}: KpiCardProps) => {
  const [count, setCount] = useState<number | string>(0);

  useEffect(() => {
    if (typeof value === 'string') {
      setCount(value);
      return;
    }

    const duration = 1200;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;

    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        current += stepValue;

        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="surface-card surface-card-hover p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-label font-semibold uppercase tracking-wider text-[#52627A]">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F7FB] text-[#0D2654]">
          {icon}
        </div>
      </div>

      <p className="mt-2 text-[28px] font-bold text-[#0D2654]">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>

      {trend && (
        <p className={`mt-3 text-xs font-semibold ${trend.positive ? 'text-[#15825F]' : 'text-[#B91C1C]'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}% vs mes anterior
        </p>
      )}
    </motion.div>
  );
};

export default memo(KpiCard);
