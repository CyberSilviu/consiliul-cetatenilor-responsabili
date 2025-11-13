import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  size = 'md'
}: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-[600px]',
    md: 'max-w-[800px]',
    lg: 'max-w-[900px]',
    xl: 'max-w-[1100px]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Responsive modal container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-4"
              onClick={onClose}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className={`relative backdrop-blur-md rounded-2xl shadow-2xl w-full ${sizeClasses[size]} overflow-hidden`}
                style={{
                  backgroundColor: '#0e0513f5',
                  borderColor: '#b5f351ff',
                  borderWidth: '2px',
                  maxHeight: '85vh'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {showCloseButton && onClose && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
                    style={{ backgroundColor: '#1a1a1a80' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a80'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a80'}
                    aria-label="Close"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                )}

                <div className="p-6 md:p-8 overflow-y-auto text-lg" style={{ maxHeight: '85vh' }}>
                  {children}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};