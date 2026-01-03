import React, { useRef } from 'react';
import { useMindAR } from './hooks/useMindAR';
import ARScene from './components/AR/ARScene';
import GameOverlay from './components/UI/GameOverlay';
import AudioController from './components/Game/AudioController'; // <--- Import Ini
import useGameStore from './store/gameStore';

function App() {
  const containerRef = useRef(null);
  const { gameState } = useGameStore();

  // Hanya nyalakan kamera jika gameState 'playing'
  const isGameActive = gameState === 'playing';
  
  const mindARInstance = useMindAR(containerRef, () => console.log("AR Siap!"));

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* 1. Komponen Audio (Tidak terlihat visualnya) */}
      <AudioController /> 

      {/* 2. Layer UI */}
      <GameOverlay />

      {/* 3. Layer AR */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          visibility: isGameActive ? 'visible' : 'hidden' 
        }}
      >
        {mindARInstance && isGameActive && (
          <ARScene mindARInstance={mindARInstance} />
        )}
      </div>

    </div>
  );
}

export default App;