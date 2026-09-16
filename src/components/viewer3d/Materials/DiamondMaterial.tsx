import React from 'react';
import { MeshRefractionMaterial, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';

export function DiamondMaterial({ color = 'white', ior = 2.42 }: { color?: string | THREE.Color, ior?: number }) {
  const envMap = useEnvironment({ files: '/environments/env_metal_001.hdr' });

  return (
    <MeshRefractionMaterial
      envMap={envMap}
      bounces={5}
      ior={ior}
      fresnel={0.3}
      aberrationStrength={0.015}
      color={new THREE.Color(color)}
      fastChroma={false}
      toneMapped={true}
    />
  );
}
