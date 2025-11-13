import type { GameResult } from '../data/types';

const STORAGE_KEY = 'director-game-results';
const TOTEM_ID_KEY = 'director-game-totem-id';

/**
 * Save a game result to localStorage
 */
export const saveGameResult = (result: GameResult): void => {
  try {
    const existing = getGameResults();
    existing.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};

/**
 * Get all game results from localStorage
 */
export const getGameResults = (): GameResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading game results:', error);
    return [];
  }
};

/**
 * Clear all game results from localStorage
 */
export const clearGameResults = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game results:', error);
  }
};

/**
 * Get totem ID (1-4)
 * Returns null if not set (should be set via Admin Panel)
 */
export const getTotemId = (): string => {
  try {
    const id = localStorage.getItem(TOTEM_ID_KEY);
    if (!id) {
      // Return default '0' to indicate not set
      // Admin should set this via Admin Panel
      return '0';
    }
    return id;
  } catch (error) {
    console.error('Error getting totem ID:', error);
    return '0';
  }
};

/**
 * Set totem ID
 */
export const setTotemId = (id: string): void => {
  try {
    localStorage.setItem(TOTEM_ID_KEY, id);
  } catch (error) {
    console.error('Error setting totem ID:', error);
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = (): {
  totalGames: number;
  wonGames: number;
  timeoutGames: number;
} => {
  const results = getGameResults();
  return {
    totalGames: results.length,
    wonGames: results.filter((r) => r.result === 'won').length,
    timeoutGames: results.filter((r) => r.result === 'timeout').length,
  };
};

/**
 * Calculate what percentile a score is in compared to all previous games
 * Returns null if no previous games, or an object with percentile and sample size
 */
export const getScorePercentile = (score: number): { percentile: number; sampleSize: number } | null => {
  try {
    const results = getGameResults();

    // Need at least 1 previous game for percentile
    if (results.length < 1) {
      return null;
    }

    // Calculate scores for all previous games
    const scores = results.map((r) => {
      const timeUsed = r.timeUsed;
      const avgPercentage =
        Object.values(r.categoryPercentages).reduce((sum, p) => sum + p, 0) /
        Object.keys(r.categoryPercentages).length;

      if (r.result === 'timeout') {
        return Math.round((avgPercentage / 100) * 500);
      }

      const timeBonus = Math.min(120 - timeUsed, 120);
      const timeBonusScore = (timeBonus / 120) * 500;
      const categoryScore = (avgPercentage / 100) * 500;
      return Math.round(timeBonusScore + categoryScore);
    });

    // Count how many scores are lower than current score
    const lowerScores = scores.filter((s) => s < score).length;

    // Calculate percentile (what % of players this score beat)
    const percentile = Math.round((lowerScores / scores.length) * 100);

    return {
      percentile,
      sampleSize: results.length,
    };
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return null;
  }
};

/**
 * Export all game results as JSON file
 * Hidden admin function - call from browser console
 */
export const exportGameResults = (): void => {
  try {
    const results = getGameResults();
    const stats = getStorageStats();
    const totemId = localStorage.getItem(TOTEM_ID_KEY) || 'unknown';

    const exportData = {
      totemId,
      exportDate: new Date().toISOString(),
      statistics: stats,
      results: results,
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `director-game-totem-${totemId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`✅ Exported ${results.length} game results from Totem ${totemId}`);
  } catch (error) {
    console.error('❌ Failed to export game results:', error);
  }
};

/**
 * Export game results as CSV file
 * Hidden admin function - call from browser console
 */
export const exportGameResultsCSV = (): void => {
  try {
    const results = getGameResults();
    const totemId = localStorage.getItem(TOTEM_ID_KEY) || 'unknown';

    // CSV Header
    const headers = [
      'ID',
      'Timestamp',
      'Player Name',
      'Player Role',
      'Result',
      'Score',
      'Time Used (s)',
      'Final Budget',
      'Dezvoltare durabilă și infrastructură vitală %',
      'Comunitate, educație și cultură %',
      'Calitatea vieții și coeziunea socială %',
      'Phone Call Answered',
      'Totem ID',
      'Selected Challenges Count',
    ];

    // CSV Rows
    const rows = results.map((r) => {
      const timeUsed = r.timeUsed;
      const avgPercentage =
        Object.values(r.categoryPercentages).reduce((sum, p) => sum + p, 0) /
        Object.keys(r.categoryPercentages).length;

      let score = 0;
      if (r.result === 'timeout') {
        score = Math.round((avgPercentage / 100) * 500);
      } else {
        const timeBonus = Math.min(120 - timeUsed, 120);
        const timeBonusScore = (timeBonus / 120) * 500;
        const categoryScore = (avgPercentage / 100) * 500;
        score = Math.round(timeBonusScore + categoryScore);
      }

      return [
        r.id,
        r.timestamp,
        `"${r.playerName}"`, // Quote name in case it has commas
        `"${r.playerRole}"`,
        r.result,
        score,
        r.timeUsed,
        r.finalBudget,
        r.categoryPercentages.ddiv || 0,
        r.categoryPercentages.cec || 0,
        r.categoryPercentages.cvcs || 0,
        r.phoneCallAnswered ? 'Yes' : 'No',
        r.totemId,
        r.selectedChallenges.length,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `director-game-totem-${totemId}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`✅ Exported ${results.length} game results as CSV from Totem ${totemId}`);
  } catch (error) {
    console.error('❌ Failed to export CSV:', error);
  }
};