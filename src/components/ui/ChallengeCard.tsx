import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import type { Challenge } from '../../data/types';
import { formatBudget } from '../../utils/gameLogic';
import { getCategoryById } from '../../data/gameData';

interface ChallengeCardProps {
  challenge: Challenge;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export const ChallengeCard = ({
  challenge,
  isSelected,
  isDisabled,
  onSelect,
}: ChallengeCardProps) => {
  const category = getCategoryById(challenge.category);

  return (
    <motion.button
      onClick={onSelect}
      disabled={isSelected || isDisabled}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isSelected ? 0.75 : 1,
        y: 0,
      }}
      whileTap={!isSelected && !isDisabled ? { scale: 0.98 } : {}}
      className={`
        relative w-full text-left p-6 rounded-xl border-3 transition-all flex flex-col
        ${
          isSelected
            ? 'bg-slate-900/50 border-green-500'
            : isDisabled
              ? 'bg-slate-900/30 border-slate-700 cursor-not-allowed'
              : 'bg-slate-800/80 border-slate-700 cursor-pointer active:border-purple-500'
        }
      `}
      style={{ borderWidth: '3px', minHeight: '220px' }}
    >
      {/* Selection indicator */}
      <div className="absolute top-6 right-6">
        {isSelected ? (
          <CheckCircle className="w-10 h-10 text-green-400" />
        ) : isDisabled ? (
          <Lock className="w-10 h-10 text-slate-600" />
        ) : (
          <Circle className="w-10 h-10 text-slate-600" />
        )}
      </div>

      {/* Category indicator */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: category?.color }}
        />
        <span className="text-base text-text-secondary font-medium">
          {category?.name}
        </span>
      </div>

      {/* Challenge name */}
      <h3 className="font-semibold text-2xl mb-3 pr-12">{challenge.name}</h3>

      {/* Description */}
      <p className="text-lg text-text-secondary mb-4 line-clamp-2">
        {challenge.description}
      </p>

      {/* Cost */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base text-text-secondary">Cost:</span>
          <span
            className={`font-bold text-2xl ${
              isDisabled && !isSelected ? 'text-red-400' : 'text-purple-400'
            }`}
          >
            {formatBudget(challenge.cost)}
          </span>
        </div>

        {isDisabled && !isSelected && (
          <span className="text-base text-red-400 font-semibold">
            Fonduri insuficiente
          </span>
        )}
      </div>

      {/* Inline tooltip for insufficient funds */}
      {isDisabled && !isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 -mb-1"
        >
          <div className="bg-red-900/20 border-2 border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-red-400 text-2xl">⚠️</span>
            <p className="text-base text-red-300">
              Nu ai suficiente fonduri pentru această provocare. Selectează altele mai mici sau anulează ultimele selecții.
            </p>
          </div>
        </motion.div>
      )}

      {/* Strike-through effect for selected */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-full h-0.5 bg-green-500/50" />
        </motion.div>
      )}
    </motion.button>
  );
};