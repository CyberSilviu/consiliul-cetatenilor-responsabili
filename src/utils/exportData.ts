import { getGameResults, getTotemId, getStorageStats } from './storage';

/**
 * Export all game results as JSON file
 */
export const exportGameResults = (): void => {
  try {
    const results = getGameResults();
    const totemId = getTotemId();
    const stats = getStorageStats();
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const data = {
      totemId,
      exportDate: new Date().toISOString(),
      statistics: stats,
      results,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `director-game-totem-${totemId}-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Exported ${results.length} game results from Totem ${totemId}`);
  } catch (error) {
    console.error('Error exporting game results:', error);
    alert('Eroare la export. Verifică consola pentru detalii.');
  }
};

/**
 * Export game results as CSV file
 */
export const exportGameResultsCSV = (): void => {
  try {
    const results = getGameResults();
    const totemId = getTotemId();
    const timestamp = new Date().toISOString().split('T')[0];

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

    // CSV Rows - calculate score for each result
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
        `"${r.playerName}"`, // Quote in case of commas in name
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
    const a = document.createElement('a');
    a.href = url;
    a.download = `director-game-totem-${totemId}-${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Exported ${results.length} game results as CSV from Totem ${totemId}`);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Eroare la export CSV. Verifică consola pentru detalii.');
  }
};

/**
 * Setup admin keyboard shortcuts
 */
export const setupAdminShortcuts = (
  onExport?: () => void,
  onReset?: () => void,
  onDebug?: () => void,
  onMute?: () => void
): (() => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Use toUpperCase to handle both cases
    const key = e.key.toUpperCase();

    // Ctrl+Shift+E - Export JSON
    if (e.ctrlKey && e.shiftKey && key === 'E') {
      e.preventDefault();
      if (onExport) onExport();
      else exportGameResults();
      console.log('✅ Export JSON triggered');
    }

    // Ctrl+Shift+C - Export CSV
    if (e.ctrlKey && e.shiftKey && key === 'C') {
      e.preventDefault();
      exportGameResultsCSV();
      const stats = getStorageStats();
      alert(`CSV exportat cu succes!\n\n${stats.totalGames} jocuri salvate`);
      console.log('✅ Export CSV triggered');
    }

    // Ctrl+Shift+R - Reset
    if (e.ctrlKey && e.shiftKey && key === 'R') {
      e.preventDefault();
      if (onReset) onReset();
      console.log('✅ Reset triggered');
    }

    // Ctrl+Shift+D - Debug
    if (e.ctrlKey && e.shiftKey && key === 'D') {
      e.preventDefault();
      if (onDebug) onDebug();
      console.log('✅ Debug triggered');
    }

    // Ctrl+Shift+M - Mute
    if (e.ctrlKey && e.shiftKey && key === 'M') {
      e.preventDefault();
      if (onMute) onMute();
      console.log('✅ Mute triggered');
    }

    // Ctrl+Shift+H - Help (show all shortcuts)
    if (e.ctrlKey && e.shiftKey && key === 'H') {
      e.preventDefault();
      const stats = getStorageStats();
      alert(
        `🔐 COMENZI ADMIN\n\n` +
        `Ctrl+Shift+E - Export JSON\n` +
        `Ctrl+Shift+C - Export CSV\n` +
        `Ctrl+Shift+R - Reset toate datele\n` +
        `Ctrl+Shift+D - Debug info în consolă\n` +
        `Ctrl+Shift+M - Mute/Unmute audio\n` +
        `Ctrl+Shift+H - Ajutor (acest mesaj)\n\n` +
        `📊 STATISTICI:\n` +
        `Total jocuri: ${stats.totalGames}\n` +
        `Victorii: ${stats.wonGames}\n` +
        `Time-out: ${stats.timeoutGames}\n` +
        `Totem ID: ${getTotemId()}`
      );
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};