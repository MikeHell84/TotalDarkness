import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FLARE_ELEMENTS = [
    { t: 0.0, scale: 1.35, brightness: 0.42, color: 0xffffff },
    { t: 0.2, scale: 1.0, brightness: 0.28, color: 0xfdb813 },
    { t: 0.38, scale: 0.8, brightness: 0.22, color: 0xffb347 },
    { t: 0.58, scale: 0.65, brightness: 0.18, color: 0xff8c42 },
    { t: 0.78, scale: 0.95, brightness: 0.16, color: 0xffffff },
    { t: 0.95, scale: 0.55, brightness: 0.14, color: 0xffff99 }
];

export function LensFlare({ sunPosition, opacity = 1 }) {
    const groupRef = useRef();
    const { camera, size, scene } = useThree();
    const meshesRef = useRef([]);
    const raycasterRef = useRef(new THREE.Raycaster());

    const hasPlanetOccluder = (object3d) => {
        let current = object3d;
        while (current) {
            if (current.userData?.ignoreLensOcclusion) return false;
            if (current.userData?.isLensOccluder && current.userData?.planetId !== 'sol') return true;
            current = current.parent;
        }
        return false;
    };

    useEffect(() => {
        if (!groupRef.current) return;

        meshesRef.current.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        meshesRef.current = [];

        FLARE_ELEMENTS.forEach((element, idx) => {
            const geometry = new THREE.SphereGeometry(1, 20, 20);
            const material = new THREE.MeshBasicMaterial({
                transparent: true,
                depthWrite: false,
                depthTest: false,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                color: new THREE.Color(element.color),
                opacity: element.brightness,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { element, index: idx };
            groupRef.current.add(mesh);
            meshesRef.current.push(mesh);
        });

        return () => {
            meshesRef.current.forEach(mesh => {
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            });
        };
    }, []);

    useFrame((state) => {
        if (!groupRef.current || !sunPosition || meshesRef.current.length === 0) return;

        const sunWorldPos = new THREE.Vector3(sunPosition.x, sunPosition.y, sunPosition.z);
        const cameraWorldPos = camera.position.clone();

        const sunDir = new THREE.Vector3().subVectors(sunWorldPos, cameraWorldPos);
        const sunDistance = sunDir.length();
        if (sunDistance < 0.001 || sunDistance > 800) {
            meshesRef.current.forEach(mesh => { mesh.visible = false; });
            return;
        }
        sunDir.normalize();

        const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const angleToSun = Math.acos(Math.max(-1, Math.min(1, cameraDirection.dot(sunDir))));
        const maxAngle = Math.PI * 0.62;
        const isInViewport = angleToSun < maxAngle;
        const visibility = Math.max(0, 1 - angleToSun / maxAngle) * opacity;

        if (!isInViewport || visibility < 0.03) {
            meshesRef.current.forEach(mesh => mesh.visible = false);
            return;
        }

        // Planetary occlusion: if a planet is between camera and sun, flare should disappear
        raycasterRef.current.set(cameraWorldPos, sunDir);
        const intersections = raycasterRef.current.intersectObjects(scene.children, true);
        const hasOcclusion = intersections.some((hit) => {
            if (hit.distance <= 0.001 || hit.distance >= sunDistance - 0.05) return false;
            return hasPlanetOccluder(hit.object);
        });

        if (hasOcclusion) {
            meshesRef.current.forEach(mesh => { mesh.visible = false; });
            return;
        }

        const sunScreenPos = sunWorldPos.clone();
        sunScreenPos.project(camera);
        if (sunScreenPos.z > 1.2 || sunScreenPos.z < -1.2) {
            meshesRef.current.forEach(mesh => { mesh.visible = false; });
            return;
        }

        const centerNdc = new THREE.Vector2(0, 0);
        const sunNdc = new THREE.Vector2(sunScreenPos.x, sunScreenPos.y);
        const lineToCenter = centerNdc.clone().sub(sunNdc);
        const hasLine = lineToCenter.lengthSq() > 1e-6;
        const lineDir = hasLine ? lineToCenter.normalize() : new THREE.Vector2(0, 0);

        const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

        const depth = sunDistance * 0.74;
        const planeCenter = cameraWorldPos.clone().addScaledVector(camForward, depth);
        const fov = THREE.MathUtils.degToRad(camera.fov || 60);
        const halfHeight = Math.tan(fov * 0.5) * depth;
        const aspect = size.width / Math.max(size.height, 1);
        const halfWidth = halfHeight * aspect;
        const baseRadius = Math.max(0.12, depth * 0.028);

        meshesRef.current.forEach((mesh, idx) => {
            const element = FLARE_ELEMENTS[idx];

            const tOffset = (element.t - 0.5) * 2.0;
            const flareNdc = sunNdc.clone().addScaledVector(lineDir, tOffset * 1.25);

            const worldPos = new THREE.Vector3()
                .copy(planeCenter)
                .addScaledVector(camRight, flareNdc.x * halfWidth)
                .addScaledVector(camUp, flareNdc.y * halfHeight);

            mesh.position.copy(worldPos);
            mesh.quaternion.identity();

            const pulse = 1 + Math.sin(state.clock.elapsedTime * (1.1 + idx * 0.18) + idx * 0.7) * 0.06;
            const radius = baseRadius * element.scale * pulse;
            mesh.scale.set(radius, radius, radius);

            const distanceFade = 1 - Math.min(1, Math.abs(tOffset) * 0.42);
            mesh.material.opacity = element.brightness * visibility * distanceFade;
            mesh.visible = true;
        });
    });

    return <group ref={groupRef} />;
}