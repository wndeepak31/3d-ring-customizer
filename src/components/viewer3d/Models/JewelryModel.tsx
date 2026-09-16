import React, { useEffect } from 'react';
import { createPortal } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useConfiguratorStore } from '@/store/configuratorStore';
import * as THREE from 'three';
import { DiamondMaterial } from '../Materials/DiamondMaterial';
import { MetalMaterial } from '../Materials/MetalMaterial';

// A mapping for the dynamic filename based on state
// In a real scenario, this logic maps the store's state to exact available combinations.
const getModelPath = (gemShape: string, gemSize: number) => {
  // Mocking the model string generation based on example:
  // R00001_shank-3_head-0_gemshape-0_gemsize-2_orientation-0.glb
  
  const shapeMap: Record<string, number> = {
    'round': 0, 'princess': 1, 'cushion': 2, 'oval': 3, 'pear': 4, 'emerald': 5
  };
  
  const sizeMap: Record<number, number> = {
    0.5: 0, 1.0: 1, 1.5: 2, 2.0: 3
  };

  const shapeId = shapeMap[gemShape] ?? 0;
  // Fallback to size 2 if not found
  const sizeId = sizeMap[gemSize] ?? 2; 

  return `/models/R00001_shank-3_head-0_gemshape-${shapeId}_gemsize-${sizeId}_orientation-0.glb`;
};

const isCenterGemStr = (str: string) => {
  const s = str.toLowerCase();
  if (!s.includes('gem')) return false;
  if (s.includes('02') || s.includes('03') || s.includes('side') || s.includes('pave') || s.includes('accent') || s.includes('halo')) return false;
  const normalized = s.replace(/[-_\s]/g, '');
  return /gem0?1/.test(normalized) || normalized === 'gem' || normalized === 'centergem';
};

const getGemstoneProps = (type: string) => {
  switch (type) {
    case 'ruby':
      return { color: '#FF3377', transmission: 0.95, ior: 1.77, thickness: 1.0, roughness: 0.02, metalness: 0.0, clearcoat: 1.0, envMapIntensity: 1.0, label: 'Ruby' };
    case 'emerald':
      return { color: '#33FF88', transmission: 0.95, ior: 1.58, thickness: 1.0, roughness: 0.02, metalness: 0.0, clearcoat: 1.0, envMapIntensity: 1.0, label: 'Emerald' };
    case 'sapphire':
      return { color: '#3385FF', transmission: 0.95, ior: 1.77, thickness: 1.0, roughness: 0.02, metalness: 0.0, clearcoat: 1.0, envMapIntensity: 1.0, label: 'Sapphire' };
    case 'diamond':
    default:
      return { color: '#FFFFFF', transmission: 1.0, ior: 2.42, thickness: 1.0, roughness: 0.0, metalness: 0.0, clearcoat: 1.0, envMapIntensity: 3.0, label: 'Diamond' };
  }
};

export function JewelryModel({ glbUrl }: { glbUrl?: string }) {
  const gemShape = useConfiguratorStore((state) => state.gemShape);
  const gemSize = useConfiguratorStore((state) => state.gemSize);
  
  const fallbackModelPath = getModelPath(gemShape, gemSize);
  const modelPath = glbUrl || fallbackModelPath;
  
  const { scene } = useGLTF(modelPath, '/draco-gltf/');
  
  const metalType = useConfiguratorStore((state) => state.metal);
  const gemstoneType = useConfiguratorStore((state) => state.gemstone);
  
  const getMetalColor = (type: string) => {
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

  const metalMaterial = React.useMemo(() => new THREE.MeshPhysicalMaterial({
    color: getMetalColor(metalType),
    metalness: 1.0,
    roughness: 0.04,
    envMapIntensity: 1.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  }), [metalType]);

  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = mesh.name.toLowerCase();
        const parentName = (mesh.parent?.name || "").toLowerCase();
        
        const isGem = meshName.includes("gem") || parentName.includes("gem");
        const isMetal = meshName.includes("metal") || parentName.includes("metal");
        const isCenter = isCenterGemStr(meshName) || isCenterGemStr(parentName);
        
        if (isGem) {
          if (isCenter) {
            const props = getGemstoneProps(gemstoneType);
            console.log(`[CENTER STONE] ${mesh.name} -> ${props.label}`);
          } else {
            console.log(`[SIDE STONE] ${mesh.name} -> Diamond`);
          }
          mesh.geometry.computeBoundingBox();
        }
        
        if (isMetal) {
          mesh.material = metalMaterial;
          console.log(`[Metal] ${mesh.name} -> ${getMetalColor(metalType)}`);
        }

        // Hide specifically the Blender cube/plane that is stuck in the middle
        if (meshName.includes("cube") || parentName.includes("cube") || meshName.includes("plane") || parentName.includes("plane")) {
          mesh.visible = false;
        }
      }
    });
    
    return clone;
  }, [scene, metalMaterial, gemstoneType]);

  const { centerGemMeshes, sideGemMeshes } = React.useMemo(() => {
    const centerList: THREE.Mesh[] = [];
    const sideList: THREE.Mesh[] = [];
    clonedScene.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const meshName = c.name.toLowerCase();
        const parentName = (c.parent?.name || "").toLowerCase();
        const isGem = meshName.includes("gem") || parentName.includes("gem");
        const isCenter = isCenterGemStr(meshName) || isCenterGemStr(parentName);
        
        if (isGem) {
          if (isCenter) centerList.push(c as THREE.Mesh);
          else sideList.push(c as THREE.Mesh);
        }
      }
    });
    return { centerGemMeshes: centerList, sideGemMeshes: sideList };
  }, [clonedScene]);

  const centerGemProps = getGemstoneProps(gemstoneType);

  // Log the diamond material type after React renders the Portal
  useEffect(() => {
    const timer = setTimeout(() => {
      sideGemMeshes.forEach(mesh => {
        console.log(mesh.name, Array.isArray(mesh.material) ? "MaterialArray" : mesh.material.type);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [sideGemMeshes]);

  return (
    <group dispose={null}>
      <primitive object={clonedScene} />
      {centerGemMeshes.map((mesh) => (
        <React.Fragment key={mesh.uuid}>
          {createPortal(<DiamondMaterial color={centerGemProps.color} ior={centerGemProps.ior} />, mesh)}
        </React.Fragment>
      ))}
      {sideGemMeshes.map((mesh) => (
        <React.Fragment key={mesh.uuid}>
          {createPortal(<DiamondMaterial />, mesh)}
        </React.Fragment>
      ))}
    </group>
  );
}

// Preload a default model so the initial load is faster
useGLTF.preload('/models/R00001_shank-3_head-0_gemshape-0_gemsize-2_orientation-0.glb');
