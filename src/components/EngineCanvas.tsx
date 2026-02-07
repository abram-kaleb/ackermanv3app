// src/components/EngineCanvas.tsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import EngineModel from './EngineModel';

export default function EngineCanvas() {
    return (
        <Canvas
            shadows
            camera={{ position: [4, 1, 4], fov: 10 }}
            style={{ background: 'white' }}
        >
            <Suspense fallback={null}>
                <Stage environment="city" intensity={0.6} adjustCamera={false}>
                    <EngineModel />
                </Stage>

                <OrbitControls
                    enableZoom={true}
                    makeDefault
                />
            </Suspense>
        </Canvas>
    );
}