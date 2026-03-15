import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function Starfield({ opacity = 1, isMobile = false }) {
    const starsRef = useRef(null);

    const { starsGeometry, starSizes, twinkleSpeeds, twinklePhases } = useMemo(() => {
        const positions = [];
        const sizes = [];
        const speeds = [];
        const phases = [];
        const starCount = isMobile ? 1800 : 5000;

        for (let i = 0; i < starCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
            // Random sizes with varying intensities
            sizes.push(Math.random() * 2 + 0.5);
            speeds.push(0.5 + Math.random() * 0.3);
            phases.push(Math.random() * Math.PI * 2);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        return {
            starsGeometry: geometry,
            starSizes: sizes,
            twinkleSpeeds: speeds,
            twinklePhases: phases
        };
    }, [isMobile]);

    // Animate star twinkling
    useFrame((state) => {
        if (starsRef.current) {
            const time = state.clock.elapsedTime;
            const sizes = starsRef.current.geometry.attributes.size.array;

            for (let i = 0; i < sizes.length; i++) {
                // Each star twinkles at different rate/phase
                const twinkle = Math.sin(time * twinkleSpeeds[i] + twinklePhases[i]) * 0.3 + 0.7;
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
