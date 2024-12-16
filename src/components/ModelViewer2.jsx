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
        gltf.scene.scale.set(1, 1, 1);

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

const ModelViewer2 = () => {
  const cameraPosition = [200, 80, 100];
  const lookAtPosition = [0, 0, 0];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1>THE DELORIAN</h1>
      <Canvas shadows={true} camera={{ fov: 75, near: 0.1, far: 1000 }}>{/* Canvasのcamera propsを使用 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} castShadow />{/* 光源の強度を調整 */}
        <Camera position={cameraPosition} lookAt={lookAtPosition}/>
        <Suspense fallback={null}>
          <Model url="delorian_88mph/scene.gltf" />
        </Suspense>
        <OrbitControls target={[-10,-2, 0]} />
      </Canvas>
    </div>
  );
};

export default ModelViewer2;