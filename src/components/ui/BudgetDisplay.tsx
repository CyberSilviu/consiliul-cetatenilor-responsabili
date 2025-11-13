import { motion } from 'framer-motion';
import { Euro } from 'lucide-react';
import { formatBudget } from '../../utils/gameLogic';
import { INITIAL_BUDGET } from '../../data/gameData';

interface BudgetDisplayProps {
  budget: number;
}

export const BudgetDisplay = ({ budget }: BudgetDisplayProps) => {
  const percentage = (budget / INITIAL_BUDGET) * 100;
  const isLow = percentage < 20;
  const isMedium = percentage >= 20 && percentage < 50;

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: isLow ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        repeat: isLow ? Infinity : 0,
        repeatDelay: 0.5,
      }}
      className={`
        relative flex flex-col items-center gap-2 px-6 py-4 rounded-lg w-full border-2
        ${isLow ? 'bg-red-900/50 border-red-500' : isMedium ? 'bg-yellow-900/50 border-yellow-500' : 'bg-slate-800/50 border-purple-500/30'}
      `}
    >
      <div className="flex items-center gap-2">
        <Euro
          className={`w-6 h-6 ${isLow ? 'text-red-400' : isMedium ? 'text-yellow-400' : 'text-purple-400'}`}
        />
        <p className="text-lg text-text-secondary uppercase tracking-wide font-semibold">Buget Disponibil</p>
      </div>

      <motion.div
        key={budget}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.3 }}
      >
        <p
          className={`
            text-3xl font-bold
            ${isLow ? 'text-red-400' : isMedium ? 'text-yellow-400' : 'text-white'}
          `}
        >
          {formatBudget(budget)}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full rounded-full ${
            isLow
              ? 'bg-red-500'
              : isMedium
                ? 'bg-yellow-500'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
        />
      </div>

      {budget === 0 && (
        <p className="text-sm text-green-400 font-semibold">
          ✓ Buget Complet Cheltuit
        </p>
      )}
    </motion.div>
  );
};