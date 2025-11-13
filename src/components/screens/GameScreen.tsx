import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Undo, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CategoryBar } from '../ui/CategoryBar';
import { BudgetDisplay } from '../ui/BudgetDisplay';
import { Timer } from '../ui/Timer';
import { ChallengeCard } from '../ui/ChallengeCard';
import { PhoneCallPopup } from '../popups/PhoneCallPopup';
import { FinishBlockedModal } from '../popups/FinishBlockedModal';
import { categories, challenges, PHONE_CALL_1_TIME, PHONE_CALL_2_TIME, WIN_THRESHOLD } from '../../data/gameData';
import { canSelectChallenge, checkWinConditions } from '../../utils/gameLogic';
import { playBackgroundMusic, stopBackgroundMusic, speedUpBackgroundMusic, resetBackgroundMusicSpeed, playSFX } from '../../utils/audioController';
import type { Category, Challenge } from '../../data/types';
import ScrollToTopButton from '../ui/ScrollToTopButton'; // Asigură-te că acest fișier există!

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const GameScreen = () => {
  const {
    budget,
    timeRemaining,
    selectedChallenges,
    categoryPercentages,
    phoneCallShown,
    phoneCall2Shown,
    history,
    selectChallenge,
    undo,
    finishGame,
    tick,
    showPhoneCall,
    answerPhoneCall,
  } = useGameStore();

  const [showPhoneCallPopup, setShowPhoneCallPopup] = useState(false);
  const [currentPhoneCall, setCurrentPhoneCall] = useState<1 | 2>(1);
  const [showFinishBlockedModal, setShowFinishBlockedModal] = useState(false);

  // Shuffle challenges once when component mounts
  const shuffledChallenges = useMemo(() => shuffleArray(challenges), []);

  // Audio speedup threshold - when music speeds up (default 30s)
  const speedupThreshold = 30;

  // Start background music when game screen mounts
  useEffect(() => {
    playBackgroundMusic();
    return () => {
      stopBackgroundMusic();
      resetBackgroundMusicSpeed();
    };
  }, []);

  // Speed up music when timer gets low
  useEffect(() => {
    if (timeRemaining === speedupThreshold) {
      speedUpBackgroundMusic(1.2);
    }
  }, [timeRemaining, speedupThreshold]);

  // Timer tick
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, tick]);

  // Phone call 1 trigger (at 30 seconds remaining = 1:30 elapsed)
  useEffect(() => {
    if (
      timeRemaining === PHONE_CALL_1_TIME &&
      !phoneCallShown &&
      !showPhoneCallPopup
    ) {
      playSFX('phone');
      showPhoneCall(1);
      setCurrentPhoneCall(1);
      setShowPhoneCallPopup(true);
    }
  }, [timeRemaining, phoneCallShown, showPhoneCall, showPhoneCallPopup]);

  // Phone call 2 trigger (at 45 seconds remaining = 0:45 elapsed, only if first call was NOT answered)
  useEffect(() => {
    const phoneCallAnswered = useGameStore.getState().phoneCallAnswered;
    if (
      timeRemaining === PHONE_CALL_2_TIME &&
      phoneCallShown &&
      !phoneCallAnswered &&
      !phoneCall2Shown &&
      !showPhoneCallPopup
    ) {
      playSFX('phone');
      showPhoneCall(2);
      setCurrentPhoneCall(2);
      setShowPhoneCallPopup(true);
    }
  }, [timeRemaining, phoneCallShown, phoneCall2Shown, showPhoneCall, showPhoneCallPopup]);

  const handlePhoneCallAnswer = (answer: boolean) => {
    const penalty = currentPhoneCall === 1 ? 10 : 15;
    answerPhoneCall(answer, penalty);
    setShowPhoneCallPopup(false);
  };

  const handleFinishAttempt = () => {
    if (canFinish) {
      playSFX('finish');
      finishGame();
    } else {
      playSFX('invalid');
      // Show blocking modal with detailed reasons
      setShowFinishBlockedModal(true);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      playSFX('undo');
      undo();
    }
  };

  const canFinish = checkWinConditions(budget, categoryPercentages);

  return (
    // Container Principal: flex-col pe mobil, flex-row pe desktop. 
    // Scroll permis pe mobil, fixat pe desktop (scroll-ul va fi pe componentele interne).
    <div className="min-h-screen flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden overflow-auto">
      
      {/* Logo - Poziționare Responsivă */}
      <div 
        className="
          w-full text-center mt-6 mb-6 
          lg:absolute lg:top-6 lg:left-6 lg:z-8 lg:w-auto 
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

      {/* Left Sidebar: Categories, Budget, Timer, Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        // Sidebar: w-full pe mobil, lățime fixă pe desktop. Border jos pe mobil, border dreapta pe desktop.
        className="
            flex-none 
            w-full lg:w-[420px] 
            bg-slate-900/98 backdrop-blur-lg 
            border-b-2 lg:border-r-2 border-purple-500/30 
            p-6 flex flex-col
        "
      >
        {/* Scroll pe y doar pentru sidebar pe desktop (dacă conținutul e prea lung) */}
        <div className="flex-1 space-y-6 lg:overflow-y-auto"> 
          {/* Categories */}
          <div className="space-y-4">
            {categories.map((category: Category) => (
              <CategoryBar
                key={category.id}
                category={category}
                percentage={categoryPercentages[category.id] || 0}
              />
            ))}
          </div>

          {/* Budget Display */}
          <div className="pt-2">
            <BudgetDisplay budget={budget} />
          </div>

          {/* Timer */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-center">
              <Timer timeRemaining={timeRemaining} />
            </div>

            {/* Hint message */}
            {!canFinish && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
                <p className="text-xs text-yellow-400 font-medium leading-tight text-center">
                  {budget > 25000
                    ? '⚠️ Cheltuiește 95% din buget și atinge 50% în toate categoriile'
                    : '⚠️ Atinge 50% în toate categoriile'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-none space-y-3 pt-6 border-t border-slate-700/50">
          <motion.button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="w-full py-4 px-4 bg-slate-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-3 text-lg border-2 border-slate-600"
            whileTap={history.length > 0 ? { scale: 0.97 } : {}}
          >
            <Undo className="w-6 h-6" />
            UNDO
          </motion.button>

          <motion.button
            onClick={handleFinishAttempt}
            className={`
              w-full py-4 px-4 font-semibold rounded-xl flex items-center justify-center gap-3 text-lg border-2
              ${
                canFinish
                  ? 'gradient-bg text-white border-purple-500'
                  : 'bg-slate-800 text-slate-600 cursor-pointer border-slate-600'
              }
            `}
            whileTap={{ scale: 0.97 }}
          >
            <CheckCircle2 className="w-6 h-6" />
            FINISH
          </motion.button>
        </div>
      </motion.div>

      {/* Right Content Area: Challenges Grid (Devine sub sidebar pe mobil) */}
      {/* Scroll permis pe y doar pentru acest container pe desktop */}
      <div className="flex-1 p-6 lg:overflow-y-auto"> 
        {/* Grid: 1 coloană pe mobil, 2 coloane pe desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-fit">
          {shuffledChallenges.map((challenge: Challenge) => {
            const isSelected = selectedChallenges.includes(challenge.id);
            const isDisabled =
              !isSelected && !canSelectChallenge(challenge, budget);

            return (
              <div key={challenge.id}>
                <ChallengeCard
                  challenge={challenge}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onSelect={() => {
                    if (!isSelected && !isDisabled) {
                      playSFX('select');
                      selectChallenge(challenge.id);
                    } else if (isDisabled) {
                      playSFX('invalid');
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Popups */}
      <PhoneCallPopup
        isOpen={showPhoneCallPopup}
        onAnswer={handlePhoneCallAnswer}
        penalty={currentPhoneCall === 1 ? 10 : 15}
        callNumber={currentPhoneCall}
      />

      <FinishBlockedModal
        isOpen={showFinishBlockedModal}
        onClose={() => setShowFinishBlockedModal(false)}
        budget={budget}
        categoryPercentages={categoryPercentages}
        categories={categories}
        minThreshold={WIN_THRESHOLD}
      />

      {/* Buton Scroll to Top (Vizibil doar când se derulează) */}
      <ScrollToTopButton /> 
    </div>
  );
};