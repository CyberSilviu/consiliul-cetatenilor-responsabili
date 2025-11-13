import { challenges, categories, WIN_THRESHOLD } from '../data/gameData';
import type { Challenge } from '../data/types';

/**
 * Calculate category percentages based on selected challenges
 */
export const calculateCategoryPercentages = (
  selectedChallengeIds: string[]
): Record<string, number> => {
  const percentages: Record<string, number> = {};

  // Initialize all categories to 0
  categories.forEach((cat) => {
    percentages[cat.id] = 0;
  });

  // Sum up contributions for each category
  selectedChallengeIds.forEach((challengeId) => {
    const challenge = challenges.find((ch) => ch.id === challengeId);
    if (challenge) {
      percentages[challenge.category] += challenge.contribution;
    }
  });

  // Cap at 100%
  Object.keys(percentages).forEach((key) => {
    if (percentages[key] > 100) {
      percentages[key] = 100;
    }
  });

  return percentages;
};

/**
 * Calculate total cost of selected challenges
 */
export const calculateTotalCost = (selectedChallengeIds: string[]): number => {
  return selectedChallengeIds.reduce((total, challengeId) => {
    const challenge = challenges.find((ch) => ch.id === challengeId);
    return total + (challenge?.cost || 0);
  }, 0);
};

/**
 * Check if all win conditions are met
 *
 * BALANCED SYSTEM:
 * - Budget remaining must be ≤25,000 EUR (5% tolerance)
 * - All 3 categories must reach ≥50% satisfaction
 * - Requires strategic selection of 9-12 challenges total (3-4 per category)
 */
export const checkWinConditions = (
  budget: number,
  categoryPercentages: Record<string, number>
): boolean => {
  // Budget remaining must be ≤25,000 EUR (5% of total budget)
  // This allows strategic play while still requiring good budget management
  if (budget > 25000) {
    return false;
  }

  // All categories must be >= 50%
  return categories.every((cat) => {
    return (categoryPercentages[cat.id] || 0) >= WIN_THRESHOLD;
  });
};

/**
 * Check if a challenge can be selected (enough budget)
 */
export const canSelectChallenge = (
  challenge: Challenge,
  currentBudget: number
): boolean => {
  return currentBudget >= challenge.cost;
};

/**
 * Get status color based on percentage
 */
export const getStatusColor = (percentage: number): string => {
  if (percentage < 30) return '#EF4444'; // red
  if (percentage < 50) return '#F97316'; // orange
  return '#10B981'; // green
};

/**
 * Format budget for display
 */
export const formatBudget = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format time for timer display (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate final score (for leaderboard)
 * Maximum score: 1000 points
 */
export const calculateScore = (
  timeUsed: number,
  categoryPercentages: Record<string, number>,
  result: 'won' | 'timeout'
): number => {
  if (result === 'timeout') {
    // Partial score based on category percentages only
    const avgPercentage =
      Object.values(categoryPercentages).reduce((sum, p) => sum + p, 0) /
      categories.length;
    return Math.round((avgPercentage / 100) * 500); // 0-500 points
  }

  // Full score for win: time bonus (500 max) + category completion (500 max)
  const timeBonus = Math.min(120 - timeUsed, 120); // 0-120 seconds saved
  const timeBonusScore = (timeBonus / 120) * 500; // 0-500 points

  const avgPercentage =
    Object.values(categoryPercentages).reduce((sum, p) => sum + p, 0) /
    categories.length;
  const categoryScore = (avgPercentage / 100) * 500; // 0-500 points

  return Math.round(timeBonusScore + categoryScore); // max 1000 points
};