import { useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ARScene = ({ mindARInstance }) => {
  const { setDetectedTrash, clearDetection } = useGameStore();

  useEffect(() => {
    if (!mindARInstance) return;

    const loader = new GLTFLoader();
    const createdObjects = [];
    
    // Variabel Wrapper
    let plasticWrapper = null;
    let organicWrapper = null;
    let paperWrapper = null;
    let b3Wrapper = null;

    const setupModel = (url, scale, anchorIndex, type, onLoaded) => {
      // Pastikan anchor index ada (cegah error jika kartu cuma 3)
      try {
        const anchor = mindARInstance.addAnchor(anchorIndex);
        const wrapper = new THREE.Group();
        anchor.group.add(wrapper);
        createdObjects.push(wrapper);

        loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.scale.set(scale, scale, scale); 
            
            // Auto-Center
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);
            
            wrapper.add(model);
            onLoaded(wrapper);
          },
          undefined,
          (error) => console.error(`Error loading ${type}`, error)
        );

        anchor.onTargetFound = () => setDetectedTrash(type);
        anchor.onTargetLost = () => clearDetection();
      } catch (e) {
        console.warn(`Target index ${anchorIndex} tidak tersedia di targets.mind`);
      }
    };

    // --- MUAT 4 MODEL ---
    // URUTAN KARTU DI TARGETS.MIND HARUS: 1.Plastik, 2.Organik, 3.Kertas, 4.Baterai
    
    setupModel('/models/plastic.glb', 0.05, 0, 'plastic', (w) => plasticWrapper = w);
    setupModel('/models/organic.glb', 0.4, 1, 'organic', (w) => organicWrapper = w);
    setupModel('/models/paper.glb', 4, 2, 'paper', (w) => paperWrapper = w);
    setupModel('/models/battery.glb', 0.01, 3, 'b3', (w) => b3Wrapper = w); // Index 3

    // --- ANIMASI ---
    let animationId;
    const animate = () => {
      if (plasticWrapper) plasticWrapper.rotation.y += 0.01;
      if (organicWrapper) organicWrapper.rotation.y += 0.01;
      if (paperWrapper) paperWrapper.rotation.y += 0.01;
      if (b3Wrapper) b3Wrapper.rotation.y += 0.01;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      createdObjects.forEach((obj) => {
        if (obj.parent) obj.parent.remove(obj);
      });
      createdObjects.length = 0;
    };
  }, [mindARInstance]);

  return null;
};

export default ARScene;