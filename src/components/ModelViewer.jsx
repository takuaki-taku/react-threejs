import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls, Loader } from '@react-three/drei';
import * as THREE from 'three'; // THREEをインポート
import '../ModelViwer.css';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow> {/* positionを追加 */}
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshStandardMaterial color={0x555555} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const mesh = useRef();

  useEffect(() => {
    if (gltf) {
      gltf.scene.scale.set(0.9, 0.9, 0.9);
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.geometry.computeBoundingBox(); // カリングのために追加
        }
      });
    }
  }, [gltf]);

  return gltf ? <primitive object={gltf.scene} ref={mesh} dispose={null} /> : null;
}

function Camera({ position, lookAt }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...lookAt);
  }, [position, lookAt]);
  useFrame(() => camera.updateProjectionMatrix());
  return null;
}


const ModelViewer = () => {
  const cameraPosition = [2, 2, 7];
  const lookAtPosition = [0, 0, 0];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1>THE MILLENNIUM FALCON</h1>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[0, 10, 0]} // ライトの位置（真上）
          angle={0.5} // ライトの広がり
          penumbra={0.5} // ライトの境界のぼかし
          intensity={500} // ライトの強度
          castShadow
          shadow-mapSize-width={1024} // 影の解像度
          shadow-mapSize-height={1024} // 影の解像度
          shadow-bias={-0.0001}
          target-position={[0,0,0]} //ライトの照射先
        />
        <Camera position={cameraPosition} lookAt={lookAtPosition} />
        <Suspense fallback={null}>
          <Model url="millennium_falcon/optimized_scene.gltf" />
        </Suspense>
        
        <Ground /> {/* Groundコンポーネントを追加 */}
        <OrbitControls target={[-1, -1, 0]} />
      </Canvas>
      <Loader />
    </div>
  );
};

export default ModelViewer;