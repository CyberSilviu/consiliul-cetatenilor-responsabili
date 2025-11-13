import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from './store/gameStore';
import { StartScreen } from './components/screens/StartScreen';
import { GameScreen } from './components/screens/GameScreen';
import { WonScreen } from './components/screens/WonScreen';
import { TimeoutScreen } from './components/screens/TimeoutScreen';
import { AdminPanel } from './components/ui/AdminPanel';
import { setupAdminShortcuts, exportGameResults } from './utils/exportData';
import { clearGameResults, getStorageStats } from './utils/storage';
import { initAudio, toggleMute } from './utils/audioController';

// Breakpoint comun pentru mobil (Tailwind md: este 768px)
const MOBILE_BREAKPOINT = 768; 

function App() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  // NOU: Starea pentru a urmări dacă suntem pe mobil
  const [isMobile, setIsMobile] = useState(false);

  // Funcție useCallback pentru a verifica lățimea ecranului
  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  // Initialize audio system on app mount
  useEffect(() => {
    initAudio();
  }, []);

  // NOU: Efect pentru a verifica și a urmări redimensionarea ecranului
  useEffect(() => {
    // Verifică imediat la montare
    checkIsMobile(); 
    
    // Adaugă listener pentru redimensionare
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup: Elimină listener-ul la demontare
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [checkIsMobile]); // Rulează o singură dată la montare

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

  // NOU: Alege imaginea de fundal bazată pe starea isMobile
  const backgroundImageUrl = isMobile 
    ? 'url(/assets/images/background2.png)' 
    : 'url(/assets/images/background1.png)';

  return (
    <div
      className="min-h-screen bg-no-repeat"
      style={{
        // MODIFICARE: Folosește imaginea dinamică
        backgroundImage: backgroundImageUrl,
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