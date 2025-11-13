import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, TrendingUp, RefreshCw, Award } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { saveGameResult, getTotemId, getScorePercentile } from '../../utils/storage';
import { calculateScore, formatTime } from '../../utils/gameLogic';
import { GAME_DURATION, categories, challenges } from '../../data/gameData';
import { playSFX } from '../../utils/audioController';
import confetti from 'canvas-confetti';

export const WonScreen = () => {
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

  const timeUsed = GAME_DURATION - timeRemaining;
  const score = calculateScore(timeUsed, categoryPercentages, 'won');
  const [percentileData, setPercentileData] = useState<{ percentile: number; sampleSize: number } | null>(null);

  // Prevent duplicate saves (React StrictMode runs effects twice in dev)
  const hasSaved = useRef(false);

  useEffect(() => {
    // Play win sound
    playSFX('win');

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
        result: 'won' as const,
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
      console.log('✅ Game result saved (won)');
    }

    // Trigger confetti - optimized celebratory effect
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const interval = 38; // Fire every 38ms (~65 bursts total)

    let lastTime = 0;
    const frame = (currentTime: number) => {
      // Throttle for performance while maintaining visual richness
      if (currentTime - lastTime >= interval) {
        lastTime = currentTime;

        // Full visual impact with performance optimization
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#b5f351ff', '#ffffff'],
          ticks: 150,            // Longer particle lifetime
          gravity: 1.1,          // Slightly faster fall
          scalar: 1.0,           // Full-size particles
          drift: 0,              // No drift for better performance
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#b5f351ff', '#ffffff'],
          ticks: 150,
          gravity: 1.1,
          scalar: 1.0,
          drift: 0,
        });
      }

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);

    // Auto-reset after 30 seconds of inactivity
    const resetTimer = setTimeout(() => {
      resetGame();
    }, 30000);

    return () => clearTimeout(resetTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 overflow-auto 
                    lg:h-screen lg:items-center lg:justify-center">
      {/* Container Principal: Scroll permis pe mobil, centrat doar pe desktop. */}
      
      {/* Logo - Stă sus pe mobil, este absolut poziționat pe desktop */}
      <div 
        className="
          w-full text-center pt-6 pb-6 
          lg:absolute lg:top-6 lg:left-6 lg:z-20 lg:w-auto lg:p-0 
        "
      >
        <img
          src="/assets/images/logo.svg"
          alt="Logo"
          className="
            h-40 w-auto mx-auto 
            lg:h-60 lg:mx-0
          "
        />
      </div>
      
      {/* Div-ul de conținut principal - Nu mai este centrat forțat pe verticală pe mobil */}
      <div className="w-full max-w-5xl space-y-6">
        {/* Trophy Icon */}
        <div className="flex justify-center">
          <Trophy className="w-24 h-24" style={{ color: '#b5f351ff' }} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold gradient-text mb-3">
            FELICITĂRI!
          </h1>
          <p className="text-xl text-white">
            Ai reușit să gestionezi bugetul ca un adevărat lider de oraş!
          </p>
        </div>

        {/* Stats */}
        {/* Grila devine 1 coloană pe mobil, 2 pe desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0e0513]/80 rounded-lg p-6 border-2" style={{ borderColor: '#b5f351ff' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-6 h-6" style={{ color: '#b5f351ff' }} />
              <span className="text-text-secondary text-lg">Timp</span>
            </div>
            <p className="text-4xl font-bold" style={{ color: '#b5f351ff' }}>
              {formatTime(timeUsed)}
            </p>
          </div>

          <div className="bg-[#0e0513]/80 rounded-lg p-6 border-2" style={{ borderColor: '#b5f351ff' }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6" style={{ color: '#b5f351ff' }} />
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
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-lg border-2 bg-[#0e0513]/50"
              style={{ borderColor: '#b5f351ff' }}
            >
              <span className="text-white text-lg">{category.name}</span>
              <span className="text-3xl font-bold" style={{ color: '#b5f351ff' }}>
                {categoryPercentages[category.id] || 0}%
              </span>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="bg-[#b5f351ff]/10 rounded-lg p-4 border-2" style={{ borderColor: '#b5f351ff' }}>
          <p className="text-center text-base text-white leading-relaxed">
            Pentru primari, provocările nu se opresc după 2 minute. Ele sunt zilnice, cu bugete limitate și decizii grele. Privește viitorul educației în ochi și le vei vedea transformate.
          </p>
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
          JOACĂ DIN NOU
        </motion.button>
      </div>
    </div>
  );
};