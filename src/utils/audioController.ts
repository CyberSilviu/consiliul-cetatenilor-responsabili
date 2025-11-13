/**
 * Audio Controller for Game
 * Handles background music and sound effects using Howler.js
 */

import { Howl } from 'howler';

interface AudioController {
  bgMusic: Howl | null;
  sfx: Map<string, Howl>;
  isMuted: boolean;
  volume: number;
  sfxVolumes: Map<string, number>; // Individual volumes for each SFX
  bgMusicVolume: number; // Background music volume
}

const controller: AudioController = {
  bgMusic: null,
  sfx: new Map(),
  isMuted: false,
  volume: 0.5, // 50% default volume for SFX (master)
  sfxVolumes: new Map(),
  bgMusicVolume: 0.15, // 15% default volume for background music
};

/**
 * Initialize background music
 */
export const initBackgroundMusic = (audioPath: string): void => {
  try {
    controller.bgMusic = new Howl({
      src: [audioPath],
      loop: true,
      volume: controller.bgMusicVolume,
      mute: controller.isMuted,
      html5: false, // Use Web Audio API for seamless looping (better than HTML5)
      preload: true, // Preload for seamless playback
    });

    console.log('✅ Background music initialized:', audioPath);
  } catch (error) {
    console.error('❌ Failed to initialize background music:', error);
  }
};

/**
 * Load a sound effect
 */
export const loadSFX = (key: string, audioPath: string): void => {
  try {
    // Set default individual volume to 0.5 if not already set
    if (!controller.sfxVolumes.has(key)) {
      controller.sfxVolumes.set(key, 0.5);
    }

    const sfx = new Howl({
      src: [audioPath],
      volume: controller.sfxVolumes.get(key) || 0.5,
      mute: controller.isMuted,
    });

    controller.sfx.set(key, sfx);
    console.log(`✅ SFX loaded: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to load SFX ${key}:`, error);
  }
};

/**
 * Play background music
 */
export const playBackgroundMusic = (): void => {
  if (controller.bgMusic && !controller.bgMusic.playing()) {
    controller.bgMusic.play();
    console.log('▶️ Background music playing');
  }
};

/**
 * Pause background music
 */
export const pauseBackgroundMusic = (): void => {
  if (controller.bgMusic) {
    controller.bgMusic.pause();
    console.log('⏸️ Background music paused');
  }
};

/**
 * Stop background music
 */
export const stopBackgroundMusic = (): void => {
  if (controller.bgMusic) {
    controller.bgMusic.stop();
    console.log('⏹️ Background music stopped');
  }
};

/**
 * Speed up background music (for last 10 seconds)
 */
export const speedUpBackgroundMusic = (rate: number = 1.2): void => {
  if (controller.bgMusic) {
    controller.bgMusic.rate(rate);
    console.log(`⏩ Background music rate: ${rate}x`);
  }
};

/**
 * Reset background music rate to normal
 */
export const resetBackgroundMusicSpeed = (): void => {
  if (controller.bgMusic) {
    controller.bgMusic.rate(1.0);
    console.log('↩️ Background music rate reset to 1.0x');
  }
};

/**
 * Play a sound effect
 */
export const playSFX = (key: string): void => {
  const sfx = controller.sfx.get(key);
  if (sfx) {
    sfx.play();
  } else {
    console.warn(`⚠️ SFX not found: ${key}`);
  }
};

/**
 * Stop a sound effect
 */
export const stopSFX = (key: string): void => {
  const sfx = controller.sfx.get(key);
  if (sfx) {
    sfx.stop();
    console.log(`⏹️ SFX stopped: ${key}`);
  } else {
    console.warn(`⚠️ SFX not found: ${key}`);
  }
};

/**
 * Set master volume (0.0 to 1.0)
 */
export const setVolume = (volume: number): void => {
  controller.volume = Math.max(0, Math.min(1, volume));

  // Apply to background music
  if (controller.bgMusic) {
    controller.bgMusic.volume(controller.volume);
  }

  // Apply to all SFX
  controller.sfx.forEach((sfx) => {
    sfx.volume(controller.volume);
  });

  console.log(`🔊 Volume set to ${Math.round(controller.volume * 100)}%`);
};

/**
 * Get current volume
 */
export const getVolume = (): number => {
  return controller.volume;
};

/**
 * Mute all audio
 */
export const muteAudio = (): void => {
  controller.isMuted = true;

  if (controller.bgMusic) {
    controller.bgMusic.mute(true);
  }

  controller.sfx.forEach((sfx) => {
    sfx.mute(true);
  });

  console.log('🔇 Audio muted');
};

/**
 * Unmute all audio
 */
export const unmuteAudio = (): void => {
  controller.isMuted = false;

  if (controller.bgMusic) {
    controller.bgMusic.mute(false);
  }

  controller.sfx.forEach((sfx) => {
    sfx.mute(false);
  });

  console.log('🔊 Audio unmuted');
};

/**
 * Toggle mute
 */
export const toggleMute = (): boolean => {
  if (controller.isMuted) {
    unmuteAudio();
  } else {
    muteAudio();
  }
  return controller.isMuted;
};

/**
 * Check if audio is muted
 */
export const isMuted = (): boolean => {
  return controller.isMuted;
};

/**
 * Set volume for a specific SFX (0.0 to 1.0)
 */
export const setSFXVolume = (key: string, volume: number): void => {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  controller.sfxVolumes.set(key, clampedVolume);

  const sfx = controller.sfx.get(key);
  if (sfx) {
    sfx.volume(clampedVolume);
    console.log(`🔊 SFX "${key}" volume set to ${Math.round(clampedVolume * 100)}%`);
  }
};

/**
 * Get volume for a specific SFX
 */
export const getSFXVolume = (key: string): number => {
  return controller.sfxVolumes.get(key) || 0.5;
};

/**
 * Get all SFX keys (for UI controls)
 */
export const getAllSFXKeys = (): string[] => {
  return Array.from(controller.sfx.keys());
};

/**
 * Set background music volume (0.0 to 1.0)
 */
export const setBackgroundMusicVolume = (volume: number): void => {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  controller.bgMusicVolume = clampedVolume;

  if (controller.bgMusic) {
    controller.bgMusic.volume(clampedVolume);
    console.log(`🎵 Background music volume set to ${Math.round(clampedVolume * 100)}%`);
  }
};

/**
 * Get background music volume
 */
export const getBackgroundMusicVolume = (): number => {
  return controller.bgMusicVolume;
};

/**
 * Cleanup all audio resources
 */
export const cleanupAudio = (): void => {
  if (controller.bgMusic) {
    controller.bgMusic.unload();
    controller.bgMusic = null;
  }

  controller.sfx.forEach((sfx) => {
    sfx.unload();
  });
  controller.sfx.clear();

  console.log('🧹 Audio resources cleaned up');
};

/**
 * Initialize all audio assets
 * Call this once at app start
 */
export const initAudio = (): void => {
  // Check if audio files exist before loading
  const bgMusicPath = '/assets/audio/background_music.mp3';

  // Try to initialize background music
  // If file doesn't exist, it will fail gracefully
  initBackgroundMusic(bgMusicPath);

  // Load SFX (optional - will fail gracefully if files don't exist)
  const sfxPaths = {
    select: '/assets/audio/sfx_select.mp3',
    undo: '/assets/audio/sfx_undo.mp3',
    invalid: '/assets/audio/sfx_invalid.mp3',
    finish: '/assets/audio/sfx_finish.mp3',
    phone: '/assets/audio/sfx_phone_ring.mp3',
    win: '/assets/audio/sfx_win.mp3',
    timeout: '/assets/audio/sfx_timeout.mp3',
  };

  Object.entries(sfxPaths).forEach(([key, path]) => {
    loadSFX(key, path);
  });

  console.log('🎵 Audio system initialized');
};
