import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'; // useLoader はこちらから
import { useLoader } from '@react-three/fiber'; // useLoader はこちらから
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // GLTFLoader は three から
import { OrbitControls } from '@react-three/drei';
import '../ModelViewer.css';

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} />;
}

const ModelViewer2 = () => {
  return (
    <div className="canvas-container">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 5]} />
        <Suspense fallback={null}>
          <Model position={[0, 0, 0]} url="delorian_88mph/scene.gltf" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ModelViewer2;