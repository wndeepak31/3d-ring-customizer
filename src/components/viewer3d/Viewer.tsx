'use client';
import React, { Suspense, Component, ReactNode, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress, Bounds, Center, Bvh } from '@react-three/drei';
import { JewelryModel } from './Models/JewelryModel';
import * as THREE from 'three';

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">
          Loading Model...
        </div>
      </div>
    </Html>
  );
}

class ModelErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Viewer({ glbUrl }: { glbUrl?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full relative cursor-move" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          // toneMappingExposure: 0.95,
          toneMappingExposure: 0.75,
        }}
      >
        <color attach="background" args={['#f8f8f8']} />

        <Suspense fallback={<Loader />}>
          {/* Fill lights to brighten the metal and diamond */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={0.7} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#f0f8ff" />

          {/* Custom HDRI Environment */}
          <Environment files="/environments/env_metal_001.hdr" environmentIntensity={0.7} />

          <ModelErrorBoundary fallback={
            <Html center>
              <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap text-center border border-red-200">
                <p>Model not found.</p>
                <p className="text-xs mt-1 text-red-500">Please add GLB files to public/models/</p>
              </div>
            </Html>
          }>
            <Bounds fit clip observe margin={1.25}>
              <Center>
                <Bvh firstHitOnly>
                  <JewelryModel glbUrl={glbUrl} />
                </Bvh>
              </Center>
            </Bounds>
          </ModelErrorBoundary>
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={15}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          autoRotate
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
