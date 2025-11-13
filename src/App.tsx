import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { StartScreen } from './components/screens/StartScreen';
import { GameScreen } from './components/screens/GameScreen';
import { WonScreen } from './components/screens/WonScreen';
import { TimeoutScreen } from './components/screens/TimeoutScreen';
import { AdminPanel } from './components/ui/AdminPanel';
import { setupAdminShortcuts, exportGameResults } from './utils/exportData';
import { clearGameResults, getStorageStats } from './utils/storage';
import { initAudio, toggleMute } from './utils/audioController';

function App() {
  const gameStatus = useGameStore((state) => state.gameStatus);

  // Initialize audio system on app mount
  useEffect(() => {
    initAudio();
  }, []);

  // Setup admin keyboard shortcuts
  useEffect(() => {
    const cleanup = setupAdminShortcuts(
      // Ctrl+Shift+E - Export data
      () => {
        exportGameResults();
        alert('Datele au fost exportate cu succes!');
      },
      // Ctrl+Shift+R - Reset data
      () => {
        const stats = getStorageStats();
        const confirmed = confirm(
          `Ștergi toate datele? (${stats.totalGames} jocuri salvate)\n\nAceastă acțiune este ireversibilă!`
        );
        if (confirmed) {
          clearGameResults();
          alert('Toate datele au fost șterse!');
        }
      },
      // Ctrl+Shift+D - Debug
      () => {
        console.log('=== DEBUG MODE ===');
        console.log('Game State:', useGameStore.getState());
        console.log('Storage Stats:', getStorageStats());
        alert('Informațiile de debug au fost afișate în consolă (F12)');
      },
      // Ctrl+Shift+M - Mute/Unmute audio
      () => {
        const isMuted = toggleMute();
        alert(isMuted ? 'Audio oprit (muted)' : 'Audio pornit (unmuted)');
      }
    );

    return cleanup;
  }, []);

  // Render appropriate screen based on game status
  const renderScreen = () => {
    switch (gameStatus) {
      case 'start':
        return <StartScreen />;
      case 'playing':
        return <GameScreen />;
      case 'won':
        return <WonScreen />;
      case 'timeout':
        return <TimeoutScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div
      className="min-h-screen bg-no-repeat"
      style={{
        backgroundImage: 'url(/assets/images/background1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0e0513', // Fallback color
      }}
    >
      {renderScreen()}
      <AdminPanel />
    </div>
  );
}

export default App;
