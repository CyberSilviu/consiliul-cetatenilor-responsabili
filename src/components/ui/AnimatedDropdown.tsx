import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface AnimatedDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
}

export const AnimatedDropdown = ({
  value,
  onChange,
  options,
  placeholder = 'Selectează...',
  label,
}: AnimatedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-lg font-medium mb-3 text-text-secondary">
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 rounded-xl text-left flex items-center justify-between transition-all"
        style={{
          backgroundColor: '#0e0513',
          borderColor: isOpen ? '#b5f351ff' : '#b5f351ff',
          borderWidth: '2px',
        }}
        whileTap={{ scale: 0.99 }}
      >
        <span className={`text-xl font-medium ${value ? 'text-white' : 'text-text-secondary'}`}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-7 h-7" style={{ color: '#b5f351ff' }} />
        </motion.div>
      </motion.button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-y-auto"
            style={{
              backgroundColor: '#0e0513',
              borderColor: '#b5f351ff',
              borderWidth: '2px',
              maxHeight: '300px',
            }}
          >
            {options.map((option, index) => (
              <motion.button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-6 py-5 text-left flex items-center justify-between border-b"
                style={{
                  backgroundColor: value === option ? '#b5f351ff30' : '#0e0513',
                  borderBottomColor: index === options.length - 1 ? 'transparent' : '#b5f351ff30',
                  borderBottomWidth: '2px',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl font-medium text-white">{option}</span>
                {value === option && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-7 h-7" style={{ color: '#b5f351ff' }} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
