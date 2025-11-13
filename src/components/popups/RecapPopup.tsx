import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import { Clock, Target, Coins } from 'lucide-react';
import { playSFX } from '../../utils/audioController';

interface RecapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const RecapPopup = ({
  isOpen,
  onClose,
  onStartGame,
}: RecapPopupProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} size="lg">
      <div className="space-y-8 text-center">
        {/* Title */}
        <div>
          <h2 className="text-5xl font-bold mb-4 text-white">
            Start Joc
          </h2>
          <p className="text-white text-xl leading-relaxed">
            Ai la dispoziție <span className="font-semibold">2 minute</span> pentru a cheltui <span className="font-semibold">minim 95% din buget</span> și alege provocările astfel încât gradul de satisfacție să atingă <span className="font-semibold">min. 50%</span>. Succes!
          </p>
        </div>

        {/* Win Conditions - Simple Icons */}
        <div className="flex items-center justify-center gap-12">
          {/* Time Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-orange-500" />
            </div>
            <span className="text-base text-white font-semibold text-center">
              2 minute
            </span>
          </div>

          {/* Budget Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <Coins className="w-10 h-10 text-green-500" />
            </div>
            <span className="text-base text-white font-semibold text-center">
              95% buget<br />cheltuit
            </span>
          </div>

          {/* Target Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Target className="w-10 h-10 text-blue-500" />
            </div>
            <span className="text-base text-white font-semibold text-center">
              min. 50%
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-6">
          <motion.button
            onClick={() => {
              playSFX('select');
              onClose();
            }}
            className="flex-1 py-6 text-white font-semibold text-xl rounded-xl"
            style={{ backgroundColor: '#1a1a1a' }}
            whileTap={{ scale: 0.97, backgroundColor: '#2a2a2a' }}
          >
            Înapoi
          </motion.button>
          <motion.button
            onClick={() => {
              playSFX('select');
              onStartGame();
            }}
            className="flex-1 py-6 gradient-bg text-white font-semibold text-xl rounded-xl"
            whileTap={{ scale: 0.97 }}
          >
            START JOC
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};