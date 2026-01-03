import { useEffect, useState, useRef } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';

export const useMindAR = (containerRef, onReady) => {
  const [mindARInstance, setMindARInstance] = useState(null);
  const isStarted = useRef(false); // Penanda agar tidak start 2x

  useEffect(() => {
    if (!containerRef.current || isStarted.current) return;

    console.log("Inisialisasi MindAR...");
    isStarted.current = true; 

    // Setup Engine
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: '/targets.mind',
      filterMinCF: 0.0001,
      filterBeta: 0.001,
    });

    const { renderer, scene, camera } = mindarThree;
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    setMindARInstance(mindarThree);

    const startAR = async () => {
      try {
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
        if (onReady) onReady();
      } catch (error) {
        console.error("Gagal memulai AR:", error);
      }
    };

    startAR();

    // Cleanup Function (Lebih Aman)
    return () => {
      console.log("Membersihkan AR...");
      renderer.setAnimationLoop(null);
      try {
        // Cek dulu apakah mindARThree benar-benar ada dan punya fungsi stop
        if (mindarThree) {
           mindarThree.stop(); 
        }
      } catch (e) {
        console.warn("Peringatan saat stop AR (bisa diabaikan):", e);
      }
      isStarted.current = false;
    };
  }, [containerRef]);

  return mindARInstance;
};