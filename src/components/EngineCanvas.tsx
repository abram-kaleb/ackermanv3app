// src/components/EngineCanvas.tsx

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, OrthographicCamera } from '@react-three/drei';
import EngineModel from './EngineModel';

export default function EngineCanvas() {
    const isMobile = window.innerWidth <= 932;

    return (
        <Canvas
            shadows
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            style={{ background: 'transparent' }}
            dpr={[1, 2]}
        >
            <OrthographicCamera
                makeDefault
                zoom={isMobile ? 250 : 550}
                position={[20, 20, -50]}
                near={0.1}
                far={1000}
            />

            <Suspense fallback={null}>
                <Stage
                    preset="rembrandt"
                    intensity={1}
                    adjustCamera={false}
                >
                    <EngineModel />
                </Stage>

                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2}
                    makeDefault
                    touchAction="none"
                />
            </Suspense>

            <ambientLight intensity={0.5} />
            <pointLight position={[20, 20, 20]} intensity={1.5} color="#4fd1c5" />
            <spotLight
                position={[-20, 20, -20]}
                intensity={0.8}
                color="#ffffff"
                angle={0.15}
                penumbra={1}
            />
        </Canvas>
    );
}