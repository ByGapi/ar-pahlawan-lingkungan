import React from 'react';
import useGameStore from '../../store/gameStore';
import { 
  FaPlay, FaRedo, FaBookOpen, FaQuestionCircle, 
  FaArrowLeft, FaLeaf, FaWineBottle, FaBoxOpen,
  FaBatteryFull, FaSkullCrossbones 
} from 'react-icons/fa'; 

const GameOverlay = () => {
  const { score, lives, gameState, startGame, resetGame, checkAnswer, isTrashDetected, setGameState } = useGameStore();

  // --- SPLASH SCREEN ---
  if (gameState === 'splash') {
    return (
      <div style={styles.fullscreenOverlay}>
        <div style={styles.cardGlass}>
          <h1 style={styles.gameTitle}>🌱 Pahlawan<br/>Lingkungan</h1>
          <button style={styles.bigButton} onClick={startGame}>
            <FaPlay style={{ marginRight: '10px' }} /> MULAI MAIN
          </button>
          <div style={styles.menuGrid}>
            <button style={styles.menuBtnBlue} onClick={() => setGameState('tutorial')}>
              <FaQuestionCircle size={24} /><span>Cara Main</span>
            </button>
            <button style={styles.menuBtnGreen} onClick={() => setGameState('education')}>
              <FaBookOpen size={24} /><span>Belajar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TUTORIAL ---
  if (gameState === 'tutorial') {
    return (
      <div style={styles.fullscreenOverlay}>
        <div style={{...styles.cardGlass, maxWidth: '500px'}}>
          <h2 style={styles.sectionTitle}>🎮 Cara Main</h2>
          <div style={styles.tutorialStep}><div style={styles.stepNumber}>1</div><p>Scan Kartu Sampah.</p></div>
          <div style={styles.tutorialStep}><div style={styles.stepNumber}>2</div><p>Lihat benda apa yang muncul.</p></div>
          <div style={styles.tutorialStep}><div style={styles.stepNumber}>3</div><p>Tekan tombol yang sesuai!</p></div>
          <button style={styles.backButton} onClick={() => setGameState('splash')}><FaArrowLeft /> Kembali</button>
        </div>
      </div>
    );
  }

  // --- EDUKASI (MATERI UPDATE) ---
  if (gameState === 'education') {
    return (
      <div style={styles.fullscreenOverlay}>
        <div style={{...styles.cardGlass, maxWidth: '600px'}}>
          <h2 style={styles.sectionTitle}>📚 Kamus Sampah</h2>
          
          {/* Organik */}
          <div style={{...styles.infoCard, borderColor: '#2ecc71'}}>
            <FaLeaf size={30} color="#2ecc71" />
            <h3 style={{color: '#27ae60'}}>1. Organik (Hijau)</h3>
            <p>Sisa makanan & daun. Bisa jadi pupuk kompos.</p>
          </div>

          {/* Anorganik (KUNING) - WARNA TEKS DIUBAH DISINI */}
          <div style={{...styles.infoCard, borderColor: '#f1c40f'}}>
            <div style={{display:'flex', gap:'10px'}}>
              <FaWineBottle size={30} color="#f1c40f" />
              <FaBoxOpen size={30} color="#f1c40f" />
            </div>
            {/* Ubah warna color di baris bawah ini jadi #f1c40f */}
            <h3 style={{color: '#f1c40f'}}>2. Anorganik (Kuning)</h3>
            <p>Plastik, Kaleng, Kertas & Kardus. Sulit terurai, ayo daur ulang!</p>
          </div>

          {/* B3 */}
          <div style={{...styles.infoCard, borderColor: '#e74c3c'}}>
            <FaBatteryFull size={30} color="#e74c3c" />
            <h3 style={{color: '#c0392b'}}>3. B3 (Merah)</h3>
            <p>Baterai & zat kimia. Berbahaya, jangan buang sembarangan!</p>
          </div>

          <button style={styles.backButton} onClick={() => setGameState('splash')}><FaArrowLeft /> Paham!</button>
        </div>
      </div>
    );
  }

  // --- GAME OVER / WON ---
  if (gameState === 'gameover' || gameState === 'won') {
    const isWon = gameState === 'won';
    return (
      <div style={{...styles.fullscreenOverlay, background: isWon ? 'rgba(46, 204, 113, 0.95)' : 'rgba(231, 76, 60, 0.95)'}}>
        <div style={styles.cardGlass}>
          <div style={{ fontSize: '80px', marginBottom: '10px' }}>{isWon ? '🏆' : '👾'}</div>
          <h1 style={styles.gameTitle}>{isWon ? 'MENANG!' : 'KALAH...'}</h1>
          <div style={styles.scoreBoard}><p>Skor Kamu</p><h2>{score}</h2></div>
          <button style={styles.bigButton} onClick={resetGame}><FaRedo style={{ marginRight: '10px' }} /> MAIN LAGI</button>
        </div>
      </div>
    );
  }

  // --- HUD PLAYING ---
  return (
    <div style={styles.hudContainer}>
      <div style={styles.topBar}>
        <div style={styles.statBubble}>⭐ {score}</div>
        <div style={styles.statBubble}>❤️ {lives}</div>
      </div>

      {!isTrashDetected && <div style={styles.scanHint}>🔍 Cari Kartu...</div>}

      <div style={{
        ...styles.controlPanel,
        transform: isTrashDetected ? 'translateY(0)' : 'translateY(150px)',
        opacity: isTrashDetected ? 1 : 0
      }}>
        <p style={styles.instructionText}>Masuk tong sampah mana?</p>
        <div style={styles.buttonGrid}>
          
          {/* ORGANIK */}
          <button style={{...styles.actionBtn, background: '#2ecc71'}} onClick={() => checkAnswer('organic')}>
            <FaLeaf size={24} /> <span>Organik</span>
          </button>
          
          {/* ANORGANIK (KUNING) */}
          <button style={{...styles.actionBtn, background: '#f1c40f', color:'#5d4037'}} onClick={() => checkAnswer('anorganic')}>
            <FaWineBottle size={24} /> <span>Anorganik</span>
          </button>
          
          {/* B3 (MERAH) */}
          <button style={{...styles.actionBtn, background: '#e74c3c', color:'white'}} onClick={() => checkAnswer('b3')}>
            <FaBatteryFull size={24} /> <span>B3 (Bahaya)</span>
          </button>

        </div>
      </div>
    </div>
  );
};

// --- STYLES (Disingkat) ---
const styles = {
  fullscreenOverlay: { position: 'absolute', inset: 0, zIndex: 50, background: 'linear-gradient(135deg, #00b09b, #96c93d)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' },
  cardGlass: { background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '90vh', overflowY: 'auto' },
  gameTitle: { fontSize: '2.5rem', color: '#2c3e50', margin: '0 0 20px 0' },
  sectionTitle: { fontSize: '1.8rem', color: '#2c3e50', marginBottom: '20px' },
  bigButton: { background: '#ff6b6b', color: 'white', border: 'none', padding: '15px 40px', fontSize: '1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 0 #c0392b', marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  menuGrid: { display: 'flex', gap: '10px', width: '100%' },
  menuBtnBlue: { flex: 1, background: '#3498db', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 0 #2980b9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  menuBtnGreen: { flex: 1, background: '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 0 #27ae60', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  backButton: { background: '#95a5a6', color: 'white', border: 'none', marginTop: '20px', padding: '10px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
  tutorialStep: { background: '#ecf0f1', padding: '15px', borderRadius: '15px', marginBottom: '10px', width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left' },
  stepNumber: { background: '#e67e22', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px', flexShrink: 0 },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' },
  infoCard: { border: '3px solid #ccc', borderRadius: '15px', padding: '15px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white', marginBottom: '10px', width: '100%' },
  hudContainer: { position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  topBar: { padding: '20px', display: 'flex', justifyContent: 'space-between' },
  statBubble: { background: 'white', padding: '10px 20px', borderRadius: '50px', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' },
  scanHint: { alignSelf: 'center', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '15px 30px', borderRadius: '50px', backdropFilter: 'blur(5px)', fontSize: '1.2rem' },
  controlPanel: { background: 'white', padding: '20px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', textAlign: 'center', pointerEvents: 'auto', transition: 'all 0.3s' },
  instructionText: { margin: '0 0 15px 0', color: '#7f8c8d', fontWeight: 'bold' },
  buttonGrid: { display: 'flex', justifyContent: 'center', gap: '15px' },
  actionBtn: { flex: 1, border: 'none', borderRadius: '20px', padding: '15px 10px', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' },
  scoreBoard: { background: '#ecf0f1', padding: '15px', borderRadius: '15px', width: '100%', marginBottom: '20px', textAlign: 'center' }
};

export default GameOverlay;