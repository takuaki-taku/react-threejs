import './App.css';
import { Canvas, useFrame } from "@react-three/fiber" ;
import { useRef, useState } from "react" ;
import { config, useSpring, animated } from "@react-spring/three"; 


function Box(props) {
  const ref = useRef();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => (ref.current.rotation.x += 0.01));

  const { scale } = useSpring({
    scale: clicked ? 2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      {...props} 
      ref={ref}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={scale}
      >
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </animated.mesh> 
  );
}

function App() {
  return (
  <>
    <div id="canvas-container">
      <Canvas camera={{ position: [0, 0, 5] }}>
          <Box position={[-1.6, 0, 0]}/>
          <Box position={[1.6, 0, 0]}/>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.5} />
          <pointLight position={[-10, -10, -10]} />
      </Canvas>
    </div>
    <h1>Threejs Fiber</h1>
    <a href="">もっと見る</a>
  </>
  );
}

export default App;
