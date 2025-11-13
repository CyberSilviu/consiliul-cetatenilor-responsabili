import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Category } from '../../data/types';
import { getStatusColor } from '../../utils/gameLogic';

interface CategoryBarProps {
  category: Category;
  percentage: number;
}

export const CategoryBar = ({ category, percentage }: CategoryBarProps) => {
  const statusColor = getStatusColor(percentage);
  const previousPercentage = useRef(percentage);
  const [justCrossed50, setJustCrossed50] = useState(false);

  // Detect when crossing 50% threshold
  useEffect(() => {
    const prev = previousPercentage.current;
    const current = percentage;

    // Check if we just crossed 50% from below
    if (prev < 50 && current >= 50) {
      setJustCrossed50(true);
      // Reset after animation completes
      setTimeout(() => setJustCrossed50(false), 600);
    }

    previousPercentage.current = current;
  }, [percentage]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xl text-white">{category.name}</span>
        <motion.span
          key={percentage}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{
            scale: justCrossed50 ? [1, 1.3, 1] : 1,
            opacity: 1
          }}
          transition={{
            scale: {
              duration: 0.3,
              times: [0, 0.5, 1],
              ease: 'easeOut',
            },
          }}
          className="font-bold text-3xl"
          style={{ color: statusColor }}
        >
          {percentage}%
        </motion.span>
      </div>

      <div className="relative h-6 bg-slate-800 rounded-full overflow-visible border-2 border-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${percentage}%`,
            boxShadow: justCrossed50
              ? [
                  `0 0 12px ${statusColor}50`,
                  `0 0 24px ${statusColor}`,
                  `0 0 12px ${statusColor}50`,
                ]
              : `0 0 12px ${statusColor}50`,
          }}
          transition={{
            width: { duration: 0.5, ease: 'easeOut' },
            boxShadow: { duration: 0.6, times: [0, 0.5, 1] },
          }}
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
          style={{
            backgroundColor: statusColor,
          }}
        />

        {/* Category icon that follows the percentage */}
        {percentage > 0 && (
          <motion.img
            src={`/assets/images/categories/${category.id}.png`}
            alt={category.name}
            initial={{ left: 0 }}
            animate={{ left: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              top: '50%',
              width: '72px',
              height: '72px',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              zIndex: 10,
            }}
          />
        )}

        {/* Threshold marker at 50% */}
        <div className="absolute inset-0 flex items-center">
          <div
            className="absolute h-full w-1 bg-white/50"
            style={{ left: '50%' }}
          />
        </div>
      </div>
    </div>
  );
};