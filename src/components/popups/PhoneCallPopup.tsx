import { Modal } from '../ui/Modal';
import { Phone, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSFX, stopSFX } from '../../utils/audioController';

interface PhoneCallPopupProps {
  isOpen: boolean;
  onAnswer: (answer: boolean) => void;
  penalty: number;
  callNumber: 1 | 2;
}

export const PhoneCallPopup = ({
  isOpen,
  onAnswer,
  penalty,
  callNumber,
}: PhoneCallPopupProps) => {
  const handleAnswer = (answer: boolean) => {
    // Stop the ringing sound
    stopSFX('phone');
    // Immediately close and deduct time (no blocking)
    onAnswer(answer);
  };

  const getMessage = () => {
    if (callNumber === 1) {
      return 'A sunat şeful de partid! Trebuie să răspunzi?';
    }
    return 'Şeful de partid sună din nou! De data asta TREBUIE să răspunzi...';
  };

  return (
    <Modal isOpen={isOpen} showCloseButton={false} size="sm">
      <div className="space-y-4 text-center">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Phone className="w-16 h-16 mx-auto text-red-400" />
          </motion.div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            ☎️ TELEFON!
          </h2>
          <p className="text-sm text-white">{getMessage()}</p>
        </div>

        <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-500/30">
          <p className="text-xs text-yellow-200">
            {callNumber === 1 ? (
              <>⚠️ Dacă răspunzi, pierzi <strong>{penalty} secunde</strong> din timp!</>
            ) : (
              <>⚠️ Acest apel e urgent! Vei pierde <strong>{penalty} secunde</strong>!</>
            )}
          </p>
        </div>

        <div className={callNumber === 1 ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1'}>
          {callNumber === 1 && (
            <motion.button
              onClick={() => {
                playSFX('select');
                handleAnswer(false);
              }}
              className="py-5 text-white font-semibold text-lg rounded-lg flex items-center justify-center gap-3"
              style={{ backgroundColor: '#1a1a1a' }}
              whileTap={{ scale: 0.97 }}
            >
              <PhoneOff className="w-6 h-6" />
              Nu răspund
            </motion.button>
          )}
          <motion.button
            onClick={() => {
              playSFX('select');
              handleAnswer(true);
            }}
            className="py-5 bg-red-600 text-white font-semibold text-lg rounded-lg flex items-center justify-center gap-3"
            whileTap={{ scale: 0.97 }}
          >
            <Phone className="w-6 h-6" />
            Răspund (-{penalty}s)
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};