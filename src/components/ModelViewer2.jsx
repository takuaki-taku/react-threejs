import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'; // THREEをインポート
import '../ModelViwer.css';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow> {/* positionを追加 */}
      <planeGeometry args={[700, 700, 32, 32]} />
      <meshStandardMaterial color={0x555555} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Model({ url, scale = [1, 1, 1], position = [0, 0, 0] }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const mesh = useRef();

  useEffect(() => {
    if (gltf) {
      gltf.scene.scale.set(...scale);
      gltf.scene.position.set(...position); // 位置を設定
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.geometry.computeBoundingBox(); // カリングのために必要
        }
      });
    }
  }, [gltf, scale, position]); // scaleとpositionを依存配列に追加

  return gltf ? <primitive object={gltf.scene} ref={mesh} dispose={null} /> : null;
}

const ModelViewer2 = () => {
  const cameraPosition = [200, 80, 200];
  const lookAtPosition = [0, 0, 0];

  // 各モデルのスケールと位置を調整
  const delorianScale = [2,2,2]; 
  const delorianPosition = [-100, 0, 0]; 

  const subaruScale = [0.6, 0.6, 0.6]; 
  const subaruPosition = [100, -30, 0];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1>THE DELORIAN & SUBARU</h1>
      <Canvas shadows camera={{ position: cameraPosition, fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[0, 150, 0]} // ライトの位置（真上）
          angle={3} // ライトの広がり
          penumbra={5} // ライトの境界のぼかし
          intensity={500000} // ライトの強度
          castShadow
          shadow-mapSize-width={1024} // 影の解像度
          shadow-mapSize-height={1024} // 影の解像度
          shadow-bias={-0.0001}
          target-position={[0,0,0]} //ライトの照射先
        />
        <Suspense fallback={null}>
          <Model url="delorian_88mph/optimized_scene.gltf" scale={delorianScale} position={delorianPosition} />
        </Suspense>
        <Suspense fallback={null}>
          <Model url="subaru_impreza/optimized_scene.gltf" scale={subaruScale} position={subaruPosition} />
        </Suspense>
        <Ground /> {/* Groundコンポーネントを追加 */}
        <OrbitControls target={lookAtPosition} /> {/* lookAtPositionを使用 */}
      </Canvas>
    </div>
  );
};

export default ModelViewer2;