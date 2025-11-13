import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import { playSFX } from '../../utils/audioController';
import { Clock, Coins, Target, CheckCircle } from 'lucide-react';

interface InstructionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsPopup = ({ isOpen, onClose }: InstructionsPopupProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-3">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-1">
            Instrucțiuni
          </h2>
          <p className="text-white text-lg font-bold">
            Ești primarul orașului Pașcani – un oraș cu aproximativ 35.000 de locuitori, din care 5.000 sunt elevi (4 licee, 1 școală gimnazială și 2 grădinițe).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Left Column: Main Game Description */}
          <div className="bg-gradient-to-br from-[#0e0513]/80 to-[#0e0513]/50 rounded-xl p-4 border-2" style={{ borderColor: '#b5f351ff' }}>
            <div className="space-y-3 text-white text-sm leading-snug">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b5f351ff' }} />
                <p>
                  Ai <span className="font-semibold" style={{ color: '#b5f351ff' }}>2 minute</span> și un buget limitat pe care trebuie să îl aloci pentru a rezolva cât mai multe dintre provocările școlii!
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Target className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b5f351ff' }} />
                <p>
                  Fiecare provocare aparține uneia dintre categoriile: <span className="font-semibold" style={{ color: '#b5f351ff' }}>Dezvoltare durabilă și infrastructură vitală</span>, <span className="font-semibold" style={{ color: '#b5f351ff' }}>Comunitate, educație și cultură</span>, <span className="font-semibold" style={{ color: '#b5f351ff' }}>Calitatea vieții și coeziunea socială</span>.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b5f351ff' }} />
                <p>
                  Fiecare provocare rezolvată crește procentul categoriei din care face parte.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Coins className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#b5f351ff' }} />
                <p>
                  Prioritizează provocările astfel încât toate categoriile să ajungă la <span className="font-semibold" style={{ color: '#b5f351ff' }}>minimum 50%</span> grad de satisfacție.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Finish Button Conditions */}
          <div className="bg-gradient-to-br from-[#b5f351ff]/20 to-[#b5f351ff]/10 rounded-xl p-4 border-2 flex flex-col" style={{ borderColor: '#b5f351ff' }}>
            <p className="text-base text-white leading-snug mb-3 text-center">
              <span className="font-bold text-lg" style={{ color: '#b5f351ff' }}>Pentru a termina jocul, apasă pe butonul Finish.</span>
            </p>
            <p className="text-sm text-white leading-snug mb-2 font-semibold">
              Acesta devine activ cu două condiții:
            </p>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 bg-[#0e0513]/50 rounded-lg p-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#b5f351ff' }} />
                <span className="text-sm text-white">Ai cheltuit 95% din buget.</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0e0513]/50 rounded-lg p-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#b5f351ff' }} />
                <span className="text-sm text-white">Ai adus toate categoriile la minimum 50% grad de satisfacție.</span>
              </div>
            </div>
            <p className="text-base text-white leading-snug mt-3 font-bold text-center" style={{ color: '#b5f351ff' }}>
              Succes!
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => {
            playSFX('select');
            onClose();
          }}
          className="w-full py-4 gradient-bg text-white font-semibold text-lg rounded-xl"
          whileTap={{ scale: 0.97 }}
        >
          Am înțeles!
        </motion.button>
      </div>
    </Modal>
  );
};