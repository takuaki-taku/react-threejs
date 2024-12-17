import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import '../ModelViwer.css';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshStandardMaterial color={0x555555} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Model({ url, setProgress }) { // setProgressをpropsとして受け取る
  const gltf = useLoader(
    GLTFLoader,
    url,
    (loader) => {
      loader.setMeshoptDecoder(MeshoptDecoder);
    },
    (xhr) => {
      setProgress(xhr.loaded / xhr.total * 100); // 進捗を更新
    },
    (error) => {
      console.error("Model loading error:", error);
      setProgress(-1); // エラー発生を通知
    }
  );
  const mesh = useRef();

  useEffect(() => {
    if (gltf) {
      gltf.scene.scale.set(0.9, 0.9, 0.9);
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.geometry.computeBoundingBox();
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
  const [progress, setProgress] = useState(0); // 進捗state

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1>THE MILLENNIUM FALCON</h1>
      <div id="progress-container" style={{ display: progress === 100 ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>{/* Flexboxで中央寄せ */}
        <div id="progress" style={{display: progress === -1 ? 'block' : 'block', color: progress === -1 ? 'red' : 'white'}}>{progress === -1 ? 'Loading Error' : `Loading... ${progress.toFixed(0)}%`}</div>
        {progress !== -1 && <div id="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'blue', height: '10px', marginTop: "10px" }}></div>}
      </div>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }} style={{ display: progress === 100 ? 'block' : 'none' }}> {/* ローディング完了後にCanvasを表示 */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={500}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
          target-position={[0,0,0]}
        />
        <Camera position={cameraPosition} lookAt={lookAtPosition} />
        <Suspense fallback={null}>
          <Model url="millennium_falcon/optimized_scene.gltf" setProgress={setProgress} /> {/* setProgressを渡す */}
        </Suspense>
        <Ground />
        <OrbitControls target={[-1, -1, 0]} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;