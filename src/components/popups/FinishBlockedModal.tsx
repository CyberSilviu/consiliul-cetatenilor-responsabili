import { Modal } from '../ui/Modal';
import { AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '../../data/types';
import { playSFX } from '../../utils/audioController';

interface FinishBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: number;
  categoryPercentages: Record<string, number>;
  categories: Category[];
  minThreshold: number;
}

export const FinishBlockedModal = ({
  isOpen,
  onClose,
  budget,
  categoryPercentages,
  categories,
  minThreshold,
}: FinishBlockedModalProps) => {
  const budgetTooHigh = budget > 25000;
  const failingCategories = categories.filter(
    (cat) => (categoryPercentages[cat.id] || 0) < minThreshold
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-28 h-28 mx-auto mb-6 rounded-full bg-yellow-900/20 border-4 border-yellow-500 flex items-center justify-center"
          >
            <AlertCircle className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <h2 className="text-5xl font-bold text-yellow-400 mb-4">
            Nu poți finaliza încă!
          </h2>
          <p className="text-2xl text-text-secondary">
            Trebuie să îndeplinești toate condițiile pentru a câștiga jocul
          </p>
        </div>

        {/* Issues list */}
        <div className="space-y-6">
          {/* Budget issue */}
          {budgetTooHigh && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-red-900/20 border-2 border-red-500/30 rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <DollarSign className="w-10 h-10 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold text-red-400 mb-2">
                    Prea mult buget necheltuit
                  </h3>
                  <p className="text-xl text-red-300">
                    Mai ai <strong>{budget.toLocaleString('ro-RO')} EUR</strong> nealocat.
                    Trebuie să cheltuiești <strong>aproape tot bugetul (maxim 5% din buget rămas)</strong>.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category issues */}
          {failingCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: budgetTooHigh ? 0.2 : 0.1 }}
              className="bg-orange-900/20 border-2 border-orange-500/30 rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <TrendingUp className="w-10 h-10 text-orange-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">
                    Categorii sub pragul minim
                  </h3>
                  <div className="space-y-3">
                    {failingCategories.map((cat) => {
                      const percentage = categoryPercentages[cat.id] || 0;
                      const needed = minThreshold - percentage;
                      return (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between text-xl"
                        >
                          <span className="text-white font-semibold">{cat.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-orange-300 font-bold text-2xl">
                              {percentage}%
                            </span>
                            <span className="text-text-secondary text-lg">
                              (lipsă: +{needed}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-lg text-orange-300 mt-4">
                    Toate categoriile trebuie să fie <strong>≥ {minThreshold}%</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Help message */}
        <div className="bg-[#b5f351ff]/10 border-2 border-[#b5f351ff]/30 rounded-lg p-6">
          <p className="text-xl text-white text-center leading-relaxed">
            💡 <strong>Sfat:</strong> Selectează mai multe provocări din categoriile slabe
            sau folosește <strong>UNDO</strong> pentru a-ți reface strategia.
          </p>
        </div>

        {/* Close button */}
        <motion.button
          onClick={() => {
            playSFX('select');
            onClose();
          }}
          className="w-full py-8 gradient-bg text-white font-semibold text-2xl rounded-xl"
          whileTap={{ scale: 0.97 }}
        >
          Am înțeles, continuu jocul
        </motion.button>
      </div>
    </Modal>
  );
};
