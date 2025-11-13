import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, HelpCircle, AlertCircle } from 'lucide-react';
import { InstructionsPopup } from '../popups/InstructionsPopup';
import { RecapPopup } from '../popups/RecapPopup';
import { AnimatedDropdown } from '../ui/AnimatedDropdown';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/gameStore';
import { playSFX } from '../../utils/audioController';

const ROLE_OPTIONS = [
  'Primar',
  'Antreprenor',
  'Angajat',
  'Tânar 18-30 ani',
  'Elev',
  'Pensionar',
  'ONG',
  'Altul',
];

export const StartScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  const { setPlayerInfo, startGame } = useGameStore();

  const handleStartClick = () => {
    if (!playerName.trim() || !playerRole.trim()) {
      setShowValidationError(true);
      return;
    }

    setPlayerInfo(playerName.trim(), playerRole.trim());
    setShowRecap(true);
  };

  const handleStartGame = () => {
    setShowRecap(false);
    startGame();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Logo - fixed to screen top-right */}
      <div className="absolute top-6 left-6 z-20">
        <img
          src="/assets/images/logo.svg"
          alt="Logo"
          className="h-40 w-auto"
        />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: '#b5f351ff' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: '#b5f351ff' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-6"
          >
            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
              Primarul oraşului tău
              <br />
              <span className="inline-block mt-3">pentru 2 minute</span>
            </h1>
            <p className="text-text-secondary text-xl">
              Simte pe pielea ta provocările unui primar!
            </p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl space-y-6"
            style={{ backgroundColor: '#0e0513dd', borderColor: '#bbff00ff', borderWidth: '2px' }}
          >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium mb-3 text-text-secondary"
              >
                Nume Complet *
              </label>
              <input
                id="name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ex: Maria Popescu"
                autoComplete="off"
                className="w-full px-6 py-5 rounded-xl text-white text-xl focus:outline-none transition-colors focus:ring-2 focus:ring-cyan-500"
                style={{
                  backgroundColor: '#0e0513',
                  borderColor: '#b5f351ff',
                  borderWidth: '2px'
                }}
              />
            </div>

            <AnimatedDropdown
              value={playerRole}
              onChange={setPlayerRole}
              options={ROLE_OPTIONS}
              placeholder="Selectează domeniul"
              label="Domeniu *"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => {
                playSFX('select');
                setShowInstructions(true);
              }}
              className="py-4 px-6 text-white font-semibold rounded-xl flex items-center justify-center gap-3 text-lg"
              style={{ backgroundColor: '#1a1a1a' }}
              whileTap={{ scale: 0.97, backgroundColor: '#2a2a2a' }}
            >
              <HelpCircle className="w-6 h-6" />
              Instrucțiuni
            </motion.button>

            <motion.button
              onClick={() => {
                playSFX('select');
                handleStartClick();
              }}
              className="py-4 px-6 gradient-bg text-white font-semibold rounded-xl flex items-center justify-center gap-3 text-lg"
              whileTap={{ scale: 0.97 }}
            >
              <Play className="w-6 h-6" />
              START JOC
            </motion.button>
          </div>
        </motion.div>

        </div>
      </div>

      {/* Popups */}
      <InstructionsPopup
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      <RecapPopup
        isOpen={showRecap}
        onClose={() => setShowRecap(false)}
        onStartGame={handleStartGame}
      />

      {/* Validation Error Modal */}
      <Modal
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        size="sm"
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Atenție!
            </h2>
            <p className="text-xl text-white">
              Te rugăm să completezi numele și domeniul!
            </p>
          </div>

          <motion.button
            onClick={() => {
              playSFX('select');
              setShowValidationError(false);
            }}
            className="w-full py-6 gradient-bg text-white font-semibold text-xl rounded-xl"
            whileTap={{ scale: 0.97 }}
          >
            Am înțeles
          </motion.button>
        </div>
      </Modal>
    </div>
  );
};