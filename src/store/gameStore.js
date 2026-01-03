import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  score: 0,
  lives: 3,
  gameState: 'splash', 
  currentTrash: null, 
  isTrashDetected: false,
  sfxTrigger: null,

  setGameState: (newState) => set({ gameState: newState }),
  startGame: () => set({ gameState: 'playing', score: 0, lives: 3, currentTrash: null, isTrashDetected: false }),

  setDetectedTrash: (trashType) => {
    // trashType bisa: 'plastic', 'organic', 'paper', 'b3'
    if (get().currentTrash !== trashType) {
      set({ currentTrash: trashType, isTrashDetected: true });
    }
  },

  clearDetection: () => {
    if (get().isTrashDetected) {
      set({ isTrashDetected: false, currentTrash: null });
    }
  },

  clearSfx: () => set({ sfxTrigger: null }),

  // --- LOGIKA CEK JAWABAN YANG DIPERBARUI ---
  checkAnswer: (selectedBin) => {
    const { currentTrash, score, lives, isTrashDetected } = get();
    
    if (!isTrashDetected || !currentTrash) return;

    let isCorrect = false;

    // 1. TONG ORGANIK (Hanya terima Organik)
    if (selectedBin === 'organic' && currentTrash === 'organic') {
      isCorrect = true;
    }
    // 2. TONG ANORGANIK (Terima Plastik DAN Kertas)
    else if (selectedBin === 'anorganic' && (currentTrash === 'plastic' || currentTrash === 'paper')) {
      isCorrect = true;
    }
    // 3. TONG B3 (Hanya terima Baterai/B3)
    else if (selectedBin === 'b3' && currentTrash === 'b3') {
      isCorrect = true;
    }

    if (isCorrect) {
      const newScore = score + 10;
      set({ 
        score: newScore, 
        sfxTrigger: 'correct',
        gameState: newScore >= 100 ? 'won' : 'playing'
      });
    } else {
      const newLives = lives - 1;
      set({ 
        lives: newLives, 
        sfxTrigger: 'wrong',
        gameState: newLives <= 0 ? 'gameover' : 'playing' 
      });
    }
  },

  resetGame: () => set({ gameState: 'splash', score: 0, lives: 3 }),
}));

export default useGameStore;