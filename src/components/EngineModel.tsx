// src/components/EngineModel.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function EngineModel() {
    const { scene } = useGLTF(`${import.meta.env.BASE_URL}engine.glb`);
    const modelRef = useRef<THREE.Group>(null);

    useFrame((_state, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={1.5}
            position={[0, 0, 0]}
        />
    );
}