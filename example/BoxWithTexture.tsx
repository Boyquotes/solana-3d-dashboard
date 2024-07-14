// BoxWithTexture.js
import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const BoxWithTexture = ({ url }) => {
  const texture = useLoader(THREE.TextureLoader, url);

  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default BoxWithTexture;
