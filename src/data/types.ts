// ============================================
// CORE GAME TYPES
// ============================================

/**
 * Category of challenges (Antreprenoriat, Egalitate, Inovare)
 */
export interface Category {
  id: string;
  name: string;
  color: string; // Hex color code
}

/**
 * Individual challenge that can be selected by the player
 */
export interface Challenge {
  id: string; // Unique identifier (a1, a2, i1, e1, etc.)
  name: string; // Display name
  description: string; // Detailed description
  cost: number; // Cost in EUR
  category: string; // Category ID (antreprenoriat, egalitate, inovare)
  contribution: number; // Percentage points added to category
}

/**
 * Selected challenge with additional metadata
 */
export interface SelectedChallenge {
  id: string;
  name: string;
  cost: number;
  category: string;
  contribution: number;
  timestamp?: number; // When it was selected
}

// ============================================
// GAME STATE TYPES
// ============================================

/**
 * Main game state managed by Zustand
 */
export interface GameState {
  // Player information
  playerName: string;
  playerRole: string;

  // Game status
  gameStatus: 'start' | 'playing' | 'won' | 'timeout';

  // Game state
  budget: number;
  timeRemaining: number;
  selectedChallenges: string[]; // Array of challenge IDs

  // Category progress (percentage per category)
  categoryPercentages: Record<string, number>;

  // Phone call state
  phoneCallShown: boolean;
  phoneCallAnswered: boolean;
  phoneCall2Shown: boolean;

  // History for undo functionality
  history: GameStateSnapshot[];
}

/**
 * Snapshot of game state for undo functionality
 */
export interface GameStateSnapshot {
  budget: number;
  selectedChallenges: string[];
  categoryPercentages: Record<string, number>;
}

// ============================================
// RESULT & STORAGE TYPES
// ============================================

/**
 * Simplified challenge info for game results
 */
export interface SavedChallenge {
  id: string;
  name: string;
  cost: number;
  category: string;
}

/**
 * Game result saved to localStorage
 */
export interface GameResult {
  id: string; // Unique identifier (UUID)
  timestamp: string; // ISO timestamp
  playerName: string;
  playerRole: string;
  result: 'won' | 'timeout';
  timeUsed: number; // Seconds used (120 - timeRemaining)
  finalBudget: number; // Budget remaining at end
  categoryPercentages: Record<string, number>;
  selectedChallenges: SavedChallenge[]; // Array of challenge objects with essential info
  phoneCallAnswered: boolean;
  totemId: string; // Totem ID (1-4)
}

// ============================================
// CONFIG TYPES
// ============================================

/**
 * Totem configuration for multi-kiosk setup
 */
export interface TotemConfig {
  id: string; // Totem identifier (1-4)
  name?: string; // Optional display name
  location?: string; // Optional physical location
}

/**
 * Audio configuration
 */
export interface AudioConfig {
  backgroundMusic: string;
  acceleratedMusic: string;
  volume: number;
  muted: boolean;
}
