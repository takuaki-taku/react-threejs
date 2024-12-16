import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  const mesh = useRef();

  useEffect(() => {
    if (gltf) {
        // モデルのスケールを調整 (必要に応じて数値を変更)
        gltf.scene.scale.set(0.9, 0.9, 0.9);

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
    }
  }, [gltf]);

  return gltf ? <primitive object={gltf.scene} ref={mesh} dispose={null}/> : null;
}

function Camera({position, lookAt}) {
    const { camera } = useThree();
    useEffect(() => {
        camera.position.set(...position);
        camera.lookAt(...lookAt);
    }, []);
    useFrame(() => camera.updateProjectionMatrix())
    return null;
}

const ModelViewer = () => {
  const cameraPosition = [2, 1, 5];
  const lookAtPosition = [0, 0, 0];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1>THE MILLENNIUM FALCON</h1>
      <Canvas shadows={true} camera={{ fov: 75, near: 0.1, far: 1000 }}>{/* Canvasのcamera propsを使用 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} castShadow />{/* 光源の強度を調整 */}
        <Camera position={cameraPosition} lookAt={lookAtPosition}/>
        <Suspense fallback={null}>
          <Model url="millennium_falcon/scene.gltf" />
        </Suspense>
        <OrbitControls target={[-1,-1, 0]} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;