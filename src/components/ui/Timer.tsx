import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/gameLogic';

interface TimerProps {
  timeRemaining: number;
}

export const Timer = ({ timeRemaining }: TimerProps) => {
  const isUrgent = timeRemaining <= 10;
  const isWarning = timeRemaining > 10 && timeRemaining <= 30;

  return (
    <motion.div
      animate={{
        scale: isUrgent ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        repeat: isUrgent ? Infinity : 0,
      }}
      className={`
        relative flex flex-col items-center gap-2 px-8 py-4 rounded-lg w-full border-2
        ${
          isUrgent
            ? 'bg-red-900/50 border-red-500'
            : isWarning
              ? 'bg-yellow-900/50 border-yellow-500'
              : 'bg-slate-800/50 border-purple-500/30'
        }
      `}
    >
      {isUrgent && (
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-red-500/20 rounded-lg"
        />
      )}

      <div className="flex items-center gap-2 z-10">
        <Clock
          className={`w-6 h-6 ${isUrgent ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-purple-400'}`}
        />
        <p className="text-lg text-text-secondary tracking-wide font-semibold uppercase">Timp Rămas</p>
      </div>

      <motion.p
        key={timeRemaining}
        initial={{ scale: 1.1 }}
        animate={
          isUrgent
            ? {
                scale: 1,
                // Flash white/red at ~2Hz (0.5s duration = 2 flashes per second)
                color: ['#ffffff', '#E53935', '#ffffff'],
              }
            : { scale: 1 }
        }
        transition={
          isUrgent
            ? {
                color: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'linear',
                },
              }
            : {}
        }
        className={`
          text-4xl font-bold font-mono z-10
          ${!isUrgent && (isWarning ? 'text-yellow-400' : 'text-white')}
        `}
      >
        {formatTime(timeRemaining)}
      </motion.p>

      {isUrgent && (
        <motion.div
          animate={{
            opacity: [1, 0],
            scale: [1, 1.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="absolute inset-0 border-2 border-red-500 rounded-lg"
        />
      )}
    </motion.div>
  );
};