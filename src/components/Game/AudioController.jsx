import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import useGameStore from '../../store/gameStore';

// Import File Suara
import menuBgmSrc from '../../assets/sounds/bgm.mp3';      // Musik Santai (Menu)
import gameBgmSrc from '../../assets/sounds/gameplay.mp3'; // Musik Semangat (Main) - PASTIKAN FILE INI ADA!
import correctSrc from '../../assets/sounds/correct.mp3';
import wrongSrc from '../../assets/sounds/wrong.mp3';
import winSrc from '../../assets/sounds/win.mp3';
import loseSrc from '../../assets/sounds/gameover.mp3';

const AudioController = () => {
  const { gameState, sfxTrigger, clearSfx } = useGameStore();
  
  // Kita butuh 2 player musik terpisah
  const menuMusicRef = useRef(null);
  const gameMusicRef = useRef(null);

  // 1. SETUP MUSIK (Load file saat pertama buka)
  useEffect(() => {
    // Setup Musik Menu
    menuMusicRef.current = new Howl({
      src: [menuBgmSrc],
      loop: true,
      volume: 0.4, 
      html5: true
    });

    // Setup Musik Gameplay
    gameMusicRef.current = new Howl({
      src: [gameBgmSrc],
      loop: true,
      volume: 0.3, // Volume gameplay sedikit lebih kecil agar SFX terdengar
      html5: true
    });

    return () => {
      menuMusicRef.current.unload();
      gameMusicRef.current.unload();
    };
  }, []);

  // 2. LOGIKA GANTI MUSIK BERDASARKAN HALAMAN (STATE)
  useEffect(() => {
    if (!menuMusicRef.current || !gameMusicRef.current) return;

    // --- KONDISI A: Di Halaman Menu (Splash, Tutorial, Edukasi) ---
    if (['splash', 'tutorial', 'education'].includes(gameState)) {
      // Nyalakan Musik Menu (jika belum nyala)
      if (!menuMusicRef.current.playing()) {
        menuMusicRef.current.play();
        menuMusicRef.current.fade(0, 0.4, 1000); // Efek Fade In halus
      }
      // Matikan Musik Game
      gameMusicRef.current.stop();
    } 
    
    // --- KONDISI B: Sedang Main (Playing) ---
    else if (gameState === 'playing') {
      // Matikan Musik Menu
      menuMusicRef.current.stop();
      
      // Nyalakan Musik Game (jika belum nyala)
      if (!gameMusicRef.current.playing()) {
        gameMusicRef.current.play();
        gameMusicRef.current.fade(0, 0.3, 1000); // Efek Fade In
      }
    } 
    
    // --- KONDISI C: Menang / Kalah ---
    else if (gameState === 'won' || gameState === 'gameover') {
      // Matikan kedua musik background
      menuMusicRef.current.stop();
      gameMusicRef.current.stop();

      // Putar Musik Jingle Menang/Kalah
      const winMusic = new Howl({ src: [winSrc], volume: 0.8 });
      const loseMusic = new Howl({ src: [loseSrc], volume: 0.8 });

      if (gameState === 'won') winMusic.play();
      if (gameState === 'gameover') loseMusic.play();
    }

  }, [gameState]);

  // 3. LOGIKA EFEK SUARA (SFX) - Tetap sama
  useEffect(() => {
    if (!sfxTrigger) return;
    if (sfxTrigger === 'correct') new Howl({ src: [correctSrc], volume: 1.0 }).play();
    else if (sfxTrigger === 'wrong') new Howl({ src: [wrongSrc], volume: 1.0 }).play();
    clearSfx();
  }, [sfxTrigger, clearSfx]);

  return null;
};

export default AudioController;