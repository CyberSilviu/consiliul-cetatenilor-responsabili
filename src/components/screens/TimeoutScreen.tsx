import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, TrendingUp, RefreshCw, Award } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { saveGameResult, getTotemId, getScorePercentile } from '../../utils/storage';
import { calculateScore } from '../../utils/gameLogic';
import { GAME_DURATION, categories, challenges } from '../../data/gameData';
import { playSFX } from '../../utils/audioController';

export const TimeoutScreen = () => {
  const {
    playerName,
    playerRole,
    budget,
    timeRemaining,
    selectedChallenges,
    categoryPercentages,
    phoneCallAnswered,
    resetGame,
  } = useGameStore();

  const [showDetails, setShowDetails] = useState(false);
  const [percentileData, setPercentileData] = useState<{ percentile: number; sampleSize: number } | null>(null);

  const timeUsed = GAME_DURATION - timeRemaining;
  const score = calculateScore(timeUsed, categoryPercentages, 'timeout');

  // Prevent duplicate saves (React StrictMode runs effects twice in dev)
  const hasSaved = useRef(false);

  useEffect(() => {
    // Play timeout sound
    playSFX('timeout');

    // Only save once
    if (!hasSaved.current) {
      hasSaved.current = true;

      // Calculate percentile before saving
      const currentPercentileData = getScorePercentile(score);
      setPercentileData(currentPercentileData);

      // Save game result
      const result = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        playerName,
        playerRole,
        result: 'timeout' as const,
        finalBudget: budget,
        timeUsed,
        categoryPercentages,
        selectedChallenges: selectedChallenges.map((id) => {
          const challenge = challenges.find((c) => c.id === id);
          return {
            id,
            name: challenge?.name || '',
            cost: challenge?.cost || 0,
            category: challenge?.category || '',
          };
        }),
        phoneCallAnswered,
        totemId: getTotemId(),
      };

      saveGameResult(result);
      console.log('✅ Game result saved (timeout)');
    }

    // Show details after 1 second
    const detailsTimer = setTimeout(() => {
      setShowDetails(true);
    }, 1000);

    // Auto-reset after 30 seconds of inactivity
    const resetTimer = setTimeout(() => {
      resetGame();
    }, 30000);

    return () => {
      clearTimeout(detailsTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  const avgPercentage =
    Object.values(categoryPercentages).reduce((sum, p) => sum + p, 0) /
    categories.length;

  return (
    <>
      <AnimatePresence mode="wait">
        {!showDetails ? (
          // Initial: Just the title, large and centered higher on screen
          <motion.div
            key="title-only"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <Clock className="w-32 h-32 text-red-400 mx-auto mb-4" />
              <h1 className="text-6xl font-bold text-red-400">
                TIMPUL A EXPIRAT
              </h1>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="h-screen flex items-center justify-center p-6">
        {/* Logo - fixed to screen top-right */}
      <div className="absolute top-6 left-6 z-20">
        <img
          src="/assets/images/logo.svg"
          alt="Logo"
          className="h-40 w-auto"
        />
      </div>
        {showDetails && (
          // After 1 second: Title shrinks and details appear
          <motion.div
            key="full-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl space-y-6"
          >
            {/* Clock Icon + Title (smaller) */}
            <div className="text-center">
              <Clock className="w-20 h-20 text-red-400 mx-auto mb-3" />
              <h1 className="text-4xl font-bold text-red-400 mb-3">
                TIMPUL A EXPIRAT
              </h1>
              <p className="text-lg text-white">
                Felicitări pentru încercare! Ai simțit presiunea timpului și a bugetului exact ca un primar.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0e0513]/80 rounded-lg p-6 border-2" style={{ borderColor: '#b5f351ff' }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6" style={{ color: '#b5f351ff' }} />
                  <span className="text-text-secondary text-lg">Progres</span>
                </div>
                <p className="text-4xl font-bold" style={{ color: '#b5f351ff' }}>
                  {Math.round(avgPercentage)}%
                </p>
              </div>

              <div className="bg-[#0e0513]/80 rounded-lg p-6 border-2" style={{ borderColor: '#b5f351ff' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-6 h-6" style={{ color: '#b5f351ff' }} />
                  <span className="text-text-secondary text-lg">Scor</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold" style={{ color: '#b5f351ff' }}>{score}</p>
                  {percentileData !== null && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="flex flex-col items-end gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-400" />
                        <span className="text-lg font-semibold text-yellow-400">
                          Top {100 - percentileData.percentile}%
                        </span>
                      </div>
                      <span className="text-sm text-text-secondary">
                        din {percentileData.sampleSize} jucători
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Results */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Rezultate categorii:</h3>
              {categories.map((category) => {
                const percentage = categoryPercentages[category.id] || 0;
                const reached = percentage >= 50;

                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 bg-[#0e0513]/50"
                    style={{ borderColor: reached ? '#b5f351ff' : '#666' }}
                  >
                    <span className="text-white text-lg">{category.name}</span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: reached ? '#b5f351ff' : '#ef4444' }}
                    >
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reset Button */}
            <motion.button
              onClick={() => {
                playSFX('select');
                resetGame();
              }}
              className="w-full py-5 gradient-bg text-white font-semibold text-xl rounded-xl flex items-center justify-center gap-3"
              whileTap={{ scale: 0.97 }}
            >
              <RefreshCw className="w-6 h-6" />
              ÎNCEARCĂ DIN NOU
            </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
};