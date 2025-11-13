import { create } from 'zustand';
import type { GameState, GameStateSnapshot } from '../data/types';
import {
  INITIAL_BUDGET,
  GAME_DURATION,
  challenges,
  categories,
} from '../data/gameData';
import {
  calculateCategoryPercentages,
  checkWinConditions,
} from '../utils/gameLogic';

interface GameStore extends GameState {
  // Actions
  setPlayerInfo: (name: string, role: string) => void;
  startGame: () => void;
  selectChallenge: (challengeId: string) => void;
  undo: () => void;
  finishGame: () => void;
  tick: () => void;
  showPhoneCall: (callNumber: 1 | 2) => void;
  answerPhoneCall: (answer: boolean, penalty: number) => void;
  resetGame: () => void;
  // Admin demo mode actions
  goToStartScreen: () => void;
  goToGameScreen: () => void;
  goToWonScreen: () => void;
  goToTimeoutScreen: () => void;
}

// Create initial state factory function
const createInitialState = (): GameState => ({
  playerName: '',
  playerRole: '',
  gameStatus: 'start',
  budget: INITIAL_BUDGET,
  timeRemaining: GAME_DURATION,
  selectedChallenges: [],
  categoryPercentages: categories.reduce(
    (acc, cat) => {
      acc[cat.id] = 0;
      return acc;
    },
    {} as Record<string, number>
  ),
  phoneCallShown: false,
  phoneCallAnswered: false,
  phoneCall2Shown: false,
  history: [],
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  setPlayerInfo: (name, role) => {
    set({ playerName: name, playerRole: role });
  },

  startGame: () => {
    set({
      gameStatus: 'playing',
      budget: INITIAL_BUDGET,
      timeRemaining: GAME_DURATION,
      selectedChallenges: [],
      categoryPercentages: categories.reduce(
        (acc, cat) => {
          acc[cat.id] = 0;
          return acc;
        },
        {} as Record<string, number>
      ),
      phoneCallShown: false,
      phoneCallAnswered: false,
      phoneCall2Shown: false,
      history: [],
    });
  },

  selectChallenge: (challengeId) => {
    const state = get();

    // Don't allow selection if already selected
    if (state.selectedChallenges.includes(challengeId)) {
      return;
    }

    const challenge = challenges.find((ch) => ch.id === challengeId);
    if (!challenge) return;

    // Check if enough budget
    if (state.budget < challenge.cost) {
      return;
    }

    // Save current state to history for undo (keep all history)
    const snapshot: GameStateSnapshot = {
      budget: state.budget,
      selectedChallenges: [...state.selectedChallenges],
      categoryPercentages: { ...state.categoryPercentages },
    };

    // Update state
    const newSelectedChallenges = [...state.selectedChallenges, challengeId];
    const newBudget = state.budget - challenge.cost;
    const newPercentages = calculateCategoryPercentages(newSelectedChallenges);

    set({
      selectedChallenges: newSelectedChallenges,
      budget: newBudget,
      categoryPercentages: newPercentages,
      // Store all snapshots for unlimited undo
      history: [...state.history, snapshot],
    });
  },

  undo: () => {
    const state = get();
    if (state.history.length === 0) return;

    // Get the last snapshot and remove it from history
    const lastSnapshot = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    set({
      budget: lastSnapshot.budget,
      selectedChallenges: lastSnapshot.selectedChallenges,
      categoryPercentages: lastSnapshot.categoryPercentages,
      // Remove the last snapshot from history
      history: newHistory,
    });
  },

  finishGame: () => {
    const state = get();

    // Check win conditions (validation now handled in UI with modal)
    if (checkWinConditions(state.budget, state.categoryPercentages)) {
      set({ gameStatus: 'won' });
    }
    // If conditions not met, UI will show blocking modal with detailed reasons
  },

  tick: () => {
    const state = get();

    if (state.gameStatus !== 'playing') return;

    const newTime = state.timeRemaining - 1;

    if (newTime <= 0) {
      // Time expired - check if win conditions are met
      if (checkWinConditions(state.budget, state.categoryPercentages)) {
        set({ timeRemaining: 0, gameStatus: 'won' });
      } else {
        set({ timeRemaining: 0, gameStatus: 'timeout' });
      }
    } else {
      set({ timeRemaining: newTime });
    }
  },

  showPhoneCall: (callNumber) => {
    if (callNumber === 1) {
      set({ phoneCallShown: true });
    } else {
      set({ phoneCall2Shown: true });
    }
  },

  answerPhoneCall: (answer, penalty) => {
    const state = get();

    if (answer) {
      // Player answered - deduct time immediately
      const newTime = Math.max(0, state.timeRemaining - penalty);
      set({
        phoneCallAnswered: true,
        timeRemaining: newTime,
      });

      // Check if time expired after phone call penalty
      if (newTime <= 0) {
        // Check if win conditions are met despite timeout
        if (checkWinConditions(state.budget, state.categoryPercentages)) {
          set({ gameStatus: 'won' });
        } else {
          set({ gameStatus: 'timeout' });
        }
      }
    } else {
      // Player didn't answer first call
      set({ phoneCallAnswered: false });
    }
  },

  resetGame: () => {
    set(createInitialState());
  },

  // Admin demo mode actions - for presentation purposes
  goToStartScreen: () => {
    set(createInitialState());
  },

  goToGameScreen: () => {
    // Set up a demo game in progress with some selections
    const demoSelections = ['a2', 'a4', 'i1', 'i2', 'e4', 'e6']; // 6 high-value items
    const demoPercentages = calculateCategoryPercentages(demoSelections);
    const demoCost = demoSelections.reduce((sum, id) => {
      const challenge = challenges.find(ch => ch.id === id);
      return sum + (challenge?.cost || 0);
    }, 0);

    set({
      playerName: 'Demo User',
      playerRole: 'Admin',
      gameStatus: 'playing',
      budget: INITIAL_BUDGET - demoCost,
      timeRemaining: 60, // 1 minute remaining for demo
      selectedChallenges: demoSelections,
      categoryPercentages: demoPercentages,
      phoneCallShown: false,
      phoneCallAnswered: false,
      phoneCall2Shown: false,
      history: [],
    });
  },

  goToWonScreen: () => {
    // Set up a winning game state
    const winningSelections = ['a2', 'a3', 'a4', 'i1', 'i2', 'i5', 'e4', 'e5', 'e6']; // 9 items for win
    const winningPercentages = calculateCategoryPercentages(winningSelections);
    const winningCost = winningSelections.reduce((sum, id) => {
      const challenge = challenges.find(ch => ch.id === id);
      return sum + (challenge?.cost || 0);
    }, 0);

    set({
      playerName: 'Demo Winner',
      playerRole: 'Admin',
      gameStatus: 'won',
      budget: INITIAL_BUDGET - winningCost,
      timeRemaining: 45, // Finished with 45 seconds left
      selectedChallenges: winningSelections,
      categoryPercentages: winningPercentages,
      phoneCallShown: true,
      phoneCallAnswered: false,
      phoneCall2Shown: false,
      history: [],
    });
  },

  goToTimeoutScreen: () => {
    // Set up a timeout game state with partial progress
    const timeoutSelections = ['a1', 'a5', 'i3', 'i8', 'e1', 'e7']; // 6 medium items
    const timeoutPercentages = calculateCategoryPercentages(timeoutSelections);
    const timeoutCost = timeoutSelections.reduce((sum, id) => {
      const challenge = challenges.find(ch => ch.id === id);
      return sum + (challenge?.cost || 0);
    }, 0);

    set({
      playerName: 'Demo Timeout',
      playerRole: 'Admin',
      gameStatus: 'timeout',
      budget: INITIAL_BUDGET - timeoutCost,
      timeRemaining: 0, // Time expired
      selectedChallenges: timeoutSelections,
      categoryPercentages: timeoutPercentages,
      phoneCallShown: true,
      phoneCallAnswered: true,
      phoneCall2Shown: false,
      history: [],
    });
  },
}));