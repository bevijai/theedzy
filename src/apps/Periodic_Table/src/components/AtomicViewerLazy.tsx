import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';

interface Props {
  electrons?: number;
  symbol?: string;
}

const AnimatedElectron: React.FC<{ shell: number; idx: number; count: number }> = ({ shell, idx, count }) => {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    const angle = ((idx / count) * Math.PI * 2) + clock.getElapsedTime() * (0.5 + shell * 0.2);
    const radius = 1.2 + shell * 0.8;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.y = Math.sin(angle) * radius;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.18, 32, 32]} />
    <meshStandardMaterial args={[{ color: '#4ECDC4', metalness: 0.3, roughness: 0.4 }]} />
    </mesh>
  );
};

function OrbitControls() {
  const { camera, gl } = useThree();
  const ref = useRef<any>();
  useEffect(() => {
    const controls = new OrbitControlsImpl(camera, gl.domElement);
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    return () => controls.dispose();
  }, [camera, gl]);
  return null;
}

export const AtomicViewerLazy: React.FC<Props> = ({ electrons = 1, symbol }) => {
  // electron shell counts
  const shells = [1, 8, 18];
  let remaining = electrons;
  const shellCounts: number[] = [];
  for (let s = 0; s < shells.length && remaining > 0; s++) {
    const count = Math.min(shells[s], remaining);
    shellCounts.push(count);
    remaining -= count;
  }

  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} />

      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
  <meshStandardMaterial args={[{ color: '#ff6b6b', metalness: 0.6, roughness: 0.3 }]} />
      </mesh>

      {/* Animated Electrons */}
      {shellCounts.map((count, shell) =>
        Array.from({ length: count }).map((_, idx) => (
          <AnimatedElectron key={`e-${shell}-${idx}`} shell={shell} idx={idx} count={count} />
        ))
      )}

      <OrbitControls />
      {/* Overlay label for element symbol */}
      {symbol && (
        <mesh position={[0, -1.6, 0]}>
          <planeGeometry args={[2.6, 0.4]} />
          <meshBasicMaterial args={[{ color: 'black', transparent: true, opacity: 0.5 }]} />
        </mesh>
      )}
    </Canvas>
  );
};

export default AtomicViewerLazy;
