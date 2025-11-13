import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

interface VirtualKeyboardProps {
  isOpen: boolean;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const ROMANIAN_SPECIAL = ['Ă', 'Â', 'Î', 'Ș', 'Ț'];

export const VirtualKeyboard = ({
  isOpen,
  initialValue = '',
  onConfirm,
  onClose,
}: VirtualKeyboardProps) => {
  const [inputValue, setInputValue] = useState(initialValue);

  // Reset input value when keyboard opens
  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleKeyPress = (key: string) => {
    setInputValue((prev) => prev + key);
  };

  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    onConfirm(inputValue);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Keyboard Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="max-w-6xl w-full mx-auto space-y-6">
              {/* Input Display Box */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl p-6 shadow-2xl"
                style={{
                  backgroundColor: '#0e0513',
                  borderColor: '#b5f351ff',
                  borderWidth: '2px',
                }}
              >
                <label className="block text-lg font-medium mb-3 text-text-secondary">
                  Nume Complet
                </label>
                <div
                  className="w-full px-6 py-5 rounded-xl text-white text-2xl min-h-[60px] flex items-center"
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#b5f351ff',
                    borderWidth: '2px',
                  }}
                >
                  {inputValue || (
                    <span className="text-gray-500">ex: Maria Popescu</span>
                  )}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                </div>
              </motion.div>

              {/* Keyboard */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl p-6 shadow-2xl"
                style={{
                  backgroundColor: '#0e0513',
                  borderColor: '#b5f351ff',
                  borderWidth: '2px',
                }}
              >
                {/* Main QWERTY rows */}
                <div className="space-y-3">
                  {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-center gap-2"
                      style={{
                        paddingLeft: rowIndex === 1 ? '1.5rem' : rowIndex === 2 ? '3rem' : '0',
                      }}
                    >
                      {row.map((key) => (
                        <motion.button
                          key={key}
                          onClick={() => handleKeyPress(key)}
                          className="flex-1 py-6 px-6 rounded-lg text-white font-semibold text-2xl touch-manipulation relative overflow-hidden"
                          style={{
                            backgroundColor: '#1a1a1a',
                            borderColor: '#b5f351ff',
                            borderWidth: '1px',
                            maxWidth: '120px',
                            minHeight: '70px',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{
                            scale: 0.9,
                            backgroundColor: '#b5f351ff',
                            transition: { duration: 0.1 }
                          }}
                        >
                          {key}
                        </motion.button>
                      ))}
                    </div>
                  ))}

                  {/* Romanian special characters row */}
                  <div className="flex justify-center gap-2">
                    {ROMANIAN_SPECIAL.map((key) => (
                      <motion.button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        className="py-6 px-8 rounded-lg text-white font-semibold text-2xl touch-manipulation"
                        style={{
                          backgroundColor: '#1a1a1a',
                          borderColor: '#b5f351ff',
                          borderWidth: '1px',
                          minHeight: '70px',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{
                          scale: 0.9,
                          backgroundColor: '#b5f351ff',
                          transition: { duration: 0.1 }
                        }}
                      >
                        {key}
                      </motion.button>
                    ))}
                  </div>

                  {/* Bottom row: Space, Backspace, Confirm */}
                  <div className="flex justify-center gap-2 pt-2">
                    {/* Space bar */}
                    <motion.button
                      onClick={() => handleKeyPress(' ')}
                      className="py-6 px-8 rounded-lg text-white font-semibold text-2xl touch-manipulation"
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderColor: '#b5f351ff',
                        borderWidth: '1px',
                        flex: '3',
                        maxWidth: '500px',
                        minHeight: '70px',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{
                        scale: 0.95,
                        backgroundColor: '#b5f351ff',
                        transition: { duration: 0.1 }
                      }}
                    >
                      SPAȚIU
                    </motion.button>

                    {/* Backspace */}
                    <motion.button
                      onClick={handleBackspace}
                      className="py-6 px-8 rounded-lg text-white font-semibold text-2xl flex items-center justify-center gap-3 touch-manipulation"
                      style={{
                        backgroundColor: '#ef4444',
                        borderColor: '#dc2626',
                        borderWidth: '1px',
                        flex: '1',
                        minWidth: '150px',
                        minHeight: '70px',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{
                        scale: 0.9,
                        backgroundColor: '#b91c1c',
                        transition: { duration: 0.1 }
                      }}
                    >
                      <Delete className="w-7 h-7" />
                      ȘTERGE
                    </motion.button>

                    {/* Confirm */}
                    <motion.button
                      onClick={handleConfirm}
                      className="py-6 px-8 rounded-lg text-white font-semibold text-2xl flex items-center justify-center gap-3 touch-manipulation"
                      style={{
                        backgroundColor: '#b5f351ff',
                        borderColor: '#95ce3bff',
                        borderWidth: '1px',
                        flex: '1',
                        minWidth: '180px',
                        minHeight: '70px',
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(74, 250, 51, 0.66)' }}
                      whileTap={{
                        scale: 0.9,
                        backgroundColor: '#95ce3bff',
                        transition: { duration: 0.1 }
                      }}
                    >
                      <Check className="w-7 h-7" />
                      GATA
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
