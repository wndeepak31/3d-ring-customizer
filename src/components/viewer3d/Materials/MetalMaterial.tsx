import React from 'react';
import { useConfiguratorStore, MetalType } from '@/store/configuratorStore';

const getMetalColor = (type: MetalType) => {
  switch (type) {
    case '14W': return '#D8D8D8';
    case '14Y': return '#c6a86c';
    case '14R': return '#e1b7a1';
    case '18W': return '#E0E0E0';
    case '18Y': return '#c6a86c';
    case '18R': return '#e1b7a1';
    default: return '#D8D8D8';
  }
};

export function MetalMaterial() {
  const metalType = useConfiguratorStore((state) => state.metal);
  
  return (
    <meshPhysicalMaterial
      color={getMetalColor(metalType)}
      metalness={1}
      roughness={0.04}
      envMapIntensity={3.5}
      clearcoat={1.0}
      clearcoatRoughness={0.02}
    />
  );
}
