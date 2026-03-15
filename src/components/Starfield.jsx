import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function Starfield({ opacity = 1 }) {
    const starsRef = useRef(null);

    const { starsGeometry, starSizes } = useMemo(() => {
        const positions = [];
        const sizes = [];

        for (let i = 0; i < 5000; i++) {
            positions.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
            // Random sizes with varying intensities
            sizes.push(Math.random() * 2 + 0.5);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        return { starsGeometry: geometry, starSizes: sizes };
    }, []);

    // Animate star twinkling
    useFrame((state) => {
        if (starsRef.current) {
            const time = state.clock.elapsedTime;
            const sizes = starsRef.current.geometry.attributes.size.array;

            for (let i = 0; i < sizes.length; i++) {
                // Each star twinkles at different rate/phase
                const twinkle = Math.sin(time * (0.5 + Math.random() * 0.3) + i * 0.1) * 0.3 + 0.7;
                sizes[i] = starSizes[i] * twinkle;
            }

            starsRef.current.geometry.attributes.size.needsUpdate = true;
        }
    });

    return (
        <points ref={starsRef} geometry={starsGeometry}>
            <pointsMaterial
                color={0xffffff}
                size={1.5}
                sizeAttenuation={true}
                transparent
                opacity={opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
