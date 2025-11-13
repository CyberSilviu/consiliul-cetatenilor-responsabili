import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Bug, Volume2, VolumeX, HelpCircle, X, Monitor, RotateCcw, PlayCircle, Gamepad2, Trophy, Clock } from 'lucide-react';
import { exportGameResults, exportGameResultsCSV } from '../../utils/exportData';
import { clearGameResults, getStorageStats, setTotemId } from '../../utils/storage';
import { toggleMute, getAllSFXKeys, getSFXVolume, setSFXVolume, playSFX, getBackgroundMusicVolume, setBackgroundMusicVolume } from '../../utils/audioController';
import { useGameStore } from '../../store/gameStore';

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTotemId, setCurrentTotemId] = useState<string | null>(null);
  const [sfxVolumes, setSfxVolumes] = useState<Record<string, number>>({});
  const [bgMusicVolume, setBgMusicVolume] = useState(0.15);

  // Get screen navigation functions from game store
  const { goToStartScreen, goToGameScreen, goToWonScreen, goToTimeoutScreen } = useGameStore();

  // Load totem ID and SFX volumes on mount
  useEffect(() => {
    const savedId = localStorage.getItem('director-game-totem-id');
    setCurrentTotemId(savedId);

    // Initialize SFX volumes from audioController
    const keys = getAllSFXKeys();
    const volumes: Record<string, number> = {};
    keys.forEach(key => {
      volumes[key] = getSFXVolume(key);
    });
    setSfxVolumes(volumes);

    // Initialize background music volume
    setBgMusicVolume(getBackgroundMusicVolume());
  }, [isOpen]);

  // Keyboard shortcut to open/close admin panel: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        console.log('🔐 Admin Panel toggled');
      }

      // ESC to close panel
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleExportJSON = () => {
    exportGameResults();
    alert('JSON exportat cu succes! Verifică folder-ul Downloads.');
  };

  const handleExportCSV = () => {
    exportGameResultsCSV();
    const stats = getStorageStats();
    alert(`CSV exportat cu succes!\n\n${stats.totalGames} jocuri salvate`);
  };

  const handleReset = () => {
    const stats = getStorageStats();

    // FIRST CONFIRMATION
    const firstConfirm = confirm(
      `⚠️ AVERTISMENT - Această acțiune este IREVERSIBILĂ!\n\n` +
      `Ștergi toate datele?\n` +
      `• ${stats.totalGames} jocuri salvate\n` +
      `• ${stats.wonGames} victorii\n` +
      `• ${stats.timeoutGames} time-out\n\n` +
      `Apasă OK pentru a continua sau Cancel pentru a anula.`
    );

    if (!firstConfirm) {
      alert('Anulat. Datele sunt în siguranță.');
      return;
    }

    // SECOND CONFIRMATION - Type verification
    const verification = prompt(
      `⚠️ CONFIRMARE FINALĂ\n\n` +
      `Pentru a șterge toate datele (${stats.totalGames} jocuri), ` +
      `tastează exact: DELETE\n\n` +
      `(majuscule importante)`
    );

    if (verification === 'DELETE') {
      clearGameResults();
      alert('✅ Toate datele au fost șterse!\n\nPanoul admin se va închide.');
      setIsOpen(false);
    } else {
      alert('❌ Verificare eșuată. Datele NU au fost șterse.\n\nTrebuia să tastezi exact: DELETE');
    }
  };

  const handleDebug = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Storage Stats:', getStorageStats());
    const stats = getStorageStats();
    alert(
      `🐛 DEBUG INFO\n\n` +
      `Informațiile detaliate au fost afișate în consolă (F12).\n\n` +
      `Statistici rapide:\n` +
      `• Total jocuri: ${stats.totalGames}\n` +
      `• Victorii: ${stats.wonGames}\n` +
      `• Time-out: ${stats.timeoutGames}`
    );
  };

  const handleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    alert(muted ? '🔇 Audio oprit (muted)' : '🔊 Audio pornit (unmuted)');
  };

  const handleSetTotemId = (id: string) => {
    if (currentTotemId) {
      alert('❌ Totem ID deja setat!\n\nFolosește butonul "Reset Totem ID" pentru a schimba.');
      return;
    }

    const confirm1 = window.confirm(
      `Setezi acest totem ca: TOTEM ${id}\n\n` +
      `⚠️ Odată setat, ID-ul va fi locked și va fi folosit pentru toate jocurile.\n\n` +
      `Continui?`
    );

    if (confirm1) {
      setTotemId(id);
      setCurrentTotemId(id);
      alert(`✅ Totem ID setat cu succes!\n\nTotem ${id} - LOCKED`);
    }
  };

  const handleResetTotemId = () => {
    if (!currentTotemId) {
      alert('Nu există Totem ID setat.');
      return;
    }

    const confirm1 = window.confirm(
      `⚠️ AVERTISMENT!\n\n` +
      `Vrei să resetezi Totem ID-ul?\n` +
      `ID curent: Totem ${currentTotemId}\n\n` +
      `Această acțiune va permite setarea unui ID nou.\n\n` +
      `Continui?`
    );

    if (!confirm1) {
      alert('Anulat. Totem ID rămâne neschimbat.');
      return;
    }

    const confirm2 = window.prompt(
      `⚠️ CONFIRMARE FINALĂ\n\n` +
      `Pentru a reseta Totem ID (${currentTotemId}), tastează exact: RESET\n\n` +
      `(majuscule importante)`
    );

    if (confirm2 === 'RESET') {
      localStorage.removeItem('director-game-totem-id');
      setCurrentTotemId(null);
      alert('✅ Totem ID resetat!\n\nPoți seta un ID nou acum.');
    } else {
      alert('❌ Verificare eșuată. Totem ID NU a fost resetat.\n\nTrebuia să tastezi exact: RESET');
    }
  };

  const handleVolumeChange = (key: string, volume: number) => {
    setSFXVolume(key, volume);
    setSfxVolumes(prev => ({ ...prev, [key]: volume }));
  };

  const handleBgMusicVolumeChange = (volume: number) => {
    setBackgroundMusicVolume(volume);
    setBgMusicVolume(volume);
  };

  const handleTestSFX = (key: string) => {
    playSFX(key);
  };

  const handleHelp = () => {
    const stats = getStorageStats();
    alert(
      `🔐 PANOUL ADMIN\n\n` +
      `ACCES ASCUNS - Doar pentru administratori!\n\n` +
      `Deschide/Închide Panel: Ctrl+Shift+A\n` +
      `Sau apasă ESC pentru a închide.\n\n` +
      `───────────────────────────\n` +
      `Funcții disponibile:\n` +
      `• Set Totem ID - Setează ID-ul totemului (1-4)\n` +
      `• Demo Mode - Navighează la orice ecran pentru prezentare\n` +
      `• SFX Volume - Controlează volumul fiecărui sunet\n` +
      `• Export JSON - Toate datele (programatic)\n` +
      `• Export CSV - Pentru Excel/analiză\n` +
      `• Reset Date - Șterge tot (DUBLU confirmat!)\n` +
      `• Debug - Info detaliate în consolă\n` +
      `• Mute/Unmute - Control audio\n\n` +
      `Scurtături tastatură rapide:\n` +
      `• Ctrl+Shift+A - Toggle Admin Panel\n` +
      `• Ctrl+Shift+E - Export JSON rapid\n` +
      `• Ctrl+Shift+C - Export CSV rapid\n` +
      `• Ctrl+Shift+R - Reset (cu confirmare)\n` +
      `• Ctrl+Shift+D - Debug info\n` +
      `• Ctrl+Shift+M - Mute/Unmute\n` +
      `• Ctrl+Shift+H - Ajutor\n\n` +
      `───────────────────────────\n` +
      `📊 STATISTICI LIVE:\n` +
      `Total jocuri: ${stats.totalGames}\n` +
      `Victorii: ${stats.wonGames}\n` +
      `Time-out: ${stats.timeoutGames}\n` +
      `Win rate: ${stats.totalGames > 0 ? Math.round((stats.wonGames / stats.totalGames) * 100) : 0}%`
    );
  };

  return (
    <>
      {/* Admin Panel - No visible button, keyboard-only access */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-96 z-50 p-6 overflow-y-auto"
              style={{
                backgroundColor: '#0e0513',
                borderLeft: '2px solid #b5f351ff',
              }}
            >
              <div className="space-y-6">
                {/* Header with close button */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      🔐 Admin Panel
                    </h2>
                    <p className="text-sm text-gray-400">
                      Acces restricționat - Admini only
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Totem ID Section */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Totem ID
                  </h3>

                  {currentTotemId ? (
                    <div className="space-y-3">
                      <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">ID curent:</span>
                          <span className="text-2xl font-bold text-green-400">TOTEM {currentTotemId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span>LOCKED</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleResetTotemId}
                        className="w-full py-2 px-3 rounded-lg text-white font-semibold text-xs flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: '#dc2626',
                          borderColor: '#b91c1c',
                          borderWidth: '1px',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Totem ID
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-yellow-400 mb-3">⚠️ Selectează ID-ul acestui totem (1-4)</p>
                      <div className="grid grid-cols-4 gap-2">
                        {['1', '2', '3', '4'].map((id) => (
                          <motion.button
                            key={id}
                            onClick={() => handleSetTotemId(id)}
                            className="py-3 px-4 rounded-lg text-white font-bold text-lg"
                            style={{
                              backgroundColor: '#1a1a1a',
                              borderColor: '#b5f351ff',
                              borderWidth: '2px',
                            }}
                            whileHover={{ scale: 1.05, backgroundColor: '#b5f351ff' }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {id}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Volume Controls */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Control Volum
                  </h3>

                  {/* Background Music */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-700">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-400 font-semibold">🎵 Muzică Fundal</span>
                        <span className="text-white font-semibold w-10 text-right">
                          {Math.round(bgMusicVolume * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(bgMusicVolume * 100)}
                        onChange={(e) => handleBgMusicVolumeChange(parseInt(e.target.value) / 100)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* SFX */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 font-semibold mb-2">EFECTE SONORE</p>
                    {Object.keys(sfxVolumes).map((key) => {
                      const volume = sfxVolumes[key] || 0.5;
                      const displayName = key.charAt(0).toUpperCase() + key.slice(1);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{displayName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold w-10 text-right">
                                {Math.round(volume * 100)}%
                              </span>
                              <motion.button
                                onClick={() => handleTestSFX(key)}
                                className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-white"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Test
                              </motion.button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round(volume * 100)}
                            onChange={(e) => handleVolumeChange(key, parseInt(e.target.value) / 100)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">📊 Statistici</h3>
                  {(() => {
                    const stats = getStorageStats();
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Total jocuri:</span>
                          <span className="font-bold">{stats.totalGames}</span>
                        </div>
                        <div className="flex justify-between text-green-400">
                          <span>Victorii:</span>
                          <span className="font-bold">{stats.wonGames}</span>
                        </div>
                        <div className="flex justify-between text-red-400">
                          <span>Time-out:</span>
                          <span className="font-bold">{stats.timeoutGames}</span>
                        </div>
                        {stats.totalGames > 0 && (
                          <div className="flex justify-between text-blue-400">
                            <span>Win rate:</span>
                            <span className="font-bold">
                              {Math.round((stats.wonGames / stats.totalGames) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Demo Mode - Screen Navigation */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    Demo Mode - Navigare Ecrane
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Pentru prezentări - navighează direct la orice ecran din joc cu date demo.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => {
                        goToStartScreen();
                        setIsOpen(false);
                        alert('📍 Navigat la ecranul Start');
                      }}
                      className="py-3 px-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderColor: '#b5f351ff',
                        borderWidth: '1px',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlayCircle className="w-4 h-4" />
                      Start
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        goToGameScreen();
                        setIsOpen(false);
                        alert('📍 Navigat la ecranul Joc (demo cu 6 selecții)');
                      }}
                      className="py-3 px-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderColor: '#b5f351ff',
                        borderWidth: '1px',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Joc
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        goToWonScreen();
                        setIsOpen(false);
                        alert('📍 Navigat la ecranul Victorie (demo win)');
                      }}
                      className="py-3 px-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderColor: '#b5f351ff',
                        borderWidth: '1px',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trophy className="w-4 h-4" />
                      Victorie
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        goToTimeoutScreen();
                        setIsOpen(false);
                        alert('📍 Navigat la ecranul Timeout (demo timeout)');
                      }}
                      className="py-3 px-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderColor: '#b5f351ff',
                        borderWidth: '1px',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Clock className="w-4 h-4" />
                      Timeout
                    </motion.button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-3">⚡ Acțiuni</h3>

                  {/* Export JSON */}
                  <motion.button
                    onClick={handleExportJSON}
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#b5f351ff',
                      borderWidth: '1px',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div>Export JSON</div>
                      <div className="text-xs text-gray-400">Ctrl+Shift+E</div>
                    </div>
                  </motion.button>

                  {/* Export CSV */}
                  <motion.button
                    onClick={handleExportCSV}
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#b5f351ff',
                      borderWidth: '1px',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div>Export CSV</div>
                      <div className="text-xs text-gray-400">Ctrl+Shift+C</div>
                    </div>
                  </motion.button>

                  {/* Debug */}
                  <motion.button
                    onClick={handleDebug}
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#b5f351ff',
                      borderWidth: '1px',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bug className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div>Debug Info</div>
                      <div className="text-xs text-gray-400">Ctrl+Shift+D</div>
                    </div>
                  </motion.button>

                  {/* Mute */}
                  <motion.button
                    onClick={handleMute}
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#b5f351ff',
                      borderWidth: '1px',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                    <div className="flex-1 text-left">
                      <div>{isMuted ? 'Unmute' : 'Mute'} Audio</div>
                      <div className="text-xs text-gray-400">Ctrl+Shift+M</div>
                    </div>
                  </motion.button>

                  {/* Help */}
                  <motion.button
                    onClick={handleHelp}
                    className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#b5f351ff',
                      borderWidth: '1px',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HelpCircle className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div>Ajutor</div>
                      <div className="text-xs text-gray-400">Ctrl+Shift+H</div>
                    </div>
                  </motion.button>

                  {/* Separator */}
                  <div className="border-t border-gray-700 my-4"></div>

                  {/* Reset - Danger zone */}
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    <p className="text-xs text-red-300 mb-2 font-semibold">
                      ⚠️ ZONA PERICULOASĂ
                    </p>
                    <motion.button
                      onClick={handleReset}
                      className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm flex items-center gap-3"
                      style={{
                        backgroundColor: '#ef4444',
                        borderColor: '#dc2626',
                        borderWidth: '1px',
                      }}
                      whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div>Reset Toate Datele</div>
                        <div className="text-xs text-red-200">Dublă confirmare! Ctrl+Shift+R</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-800">
                  <p className="font-semibold text-gray-400">Admin Panel v2.0</p>
                  <p>Ctrl+Shift+A - Toggle Panel</p>
                  <p>Ctrl+Shift+H - Ajutor complet</p>
                  <p className="mt-2 text-yellow-600">⚠️ Acces restricționat</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
