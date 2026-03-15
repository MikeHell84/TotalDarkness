import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Planet } from './Planet';
import { Starfield } from './Starfield';
import { LensFlare } from './LensFlare';
import { useOrbitalPositions } from '../hooks/useOrbitalPositions';
import { TimelineConnections, TimelineCamera, MecatronPlane } from '../pages/TimelineView';
import universeBackground from '../../assets/parallax/universe360.png';

export function UniverseScene({
    planets,
    onPlanetClick,
    planetsRef,
    cameraRef,
    isDragging,
    dragVelocityRef,
    cameraRotation,
    userHasInteracted,
    isTransitioning = false,
    starfieldOpacity = 1,
    planetsOpacity = 1,
    startCameraFly = false,
    onFlyProgress,
    activeSection = null,
    timeline = [],
    timelineZoom = 1,
    onTimelineConstellationReady
}) {
    const planetRefs = useRef([]);
    const orbitingPlanets = useRef({});
    const getOrbitalPosition = useOrbitalPositions(planets);
    const backgroundSphereRef = useRef(null);
    const sunLightRef = useRef(null);
    const sunPositionRef = useRef({ x: 0, y: 0, z: -10 });

    // Mecatron constellation animation state
    const mecatronAnimationRef = useRef({
        isAnimating: false,
        startTime: 0,
        duration: 3000, // 3 seconds animation
        startPositions: [],
        isInMecatronMode: false,
        hasNotifiedReady: false
    });

    // Laser progress for Mecatron plane
    const [laserProgress, setLaserProgress] = React.useState(0); const universeTexture = useLoader(THREE.TextureLoader, universeBackground);

    React.useEffect(() => {
        if (
            activeSection === 'cronologia' &&
            laserProgress >= 1 &&
            !mecatronAnimationRef.current.isAnimating &&
            !mecatronAnimationRef.current.hasNotifiedReady
        ) {
            mecatronAnimationRef.current.hasNotifiedReady = true;
            onTimelineConstellationReady?.();
        }
    }, [activeSection, laserProgress, onTimelineConstellationReady]);

    useEffect(() => {
        universeTexture.colorSpace = THREE.SRGBColorSpace;
        universeTexture.wrapS = THREE.ClampToEdgeWrapping;
        universeTexture.wrapT = THREE.ClampToEdgeWrapping;
        universeTexture.repeat.set(1, 1);
        universeTexture.offset.set(0, 0);
        universeTexture.needsUpdate = true;
    }, [universeTexture]);

    const cameraFlyRef = useRef({
        isFlying: false,
        startTime: 0,
        duration: 6000, // 6 seconds pullback
        startPos: { x: 0, y: 0, z: -10 },
        endPos: { x: 75, y: 15, z: 50 }
    });
    const userControlsEnabled = useRef(false);

    // Sync planetsRef with internal refs
    React.useEffect(() => {
        if (planetsRef) {
            planetsRef.current = planetRefs.current;
        }
    }, [planetsRef]);

    // Trigger Mecatron constellation animation when entering cronologia
    React.useEffect(() => {
        if (activeSection === 'cronologia' && !mecatronAnimationRef.current.isInMecatronMode) {
            // Start animation to Mecatron positions
            mecatronAnimationRef.current.isAnimating = true;
            mecatronAnimationRef.current.startTime = Date.now();
            mecatronAnimationRef.current.isInMecatronMode = true;
            mecatronAnimationRef.current.hasNotifiedReady = false;

            // Capture current positions as start positions
            mecatronAnimationRef.current.startPositions = planets.map((planet, index) => {
                const ref = planetRefs.current[index];
                if (ref && ref.position) {
                    return { x: ref.position.x, y: ref.position.y, z: ref.position.z };
                }
                return { x: planet.position[0], y: planet.position[1], z: planet.position[2] };
            });
        } else if (activeSection !== 'cronologia' && mecatronAnimationRef.current.isInMecatronMode) {
            // Leaving cronologia - return to original positions
            mecatronAnimationRef.current.isAnimating = true;
            mecatronAnimationRef.current.startTime = Date.now();
            mecatronAnimationRef.current.isInMecatronMode = false;
            mecatronAnimationRef.current.hasNotifiedReady = false;

            // Capture current Mecatron positions as start positions
            mecatronAnimationRef.current.startPositions = planets.map((planet, index) => {
                const ref = planetRefs.current[index];
                if (ref && ref.position) {
                    return { x: ref.position.x, y: ref.position.y, z: ref.position.z };
                }
                return planet.mecatronPosition
                    ? { x: planet.mecatronPosition[0], y: planet.mecatronPosition[1], z: planet.mecatronPosition[2] }
                    : { x: planet.position[0], y: planet.position[1], z: planet.position[2] };
            });
        }
    }, [activeSection, planets]);

    // Initialize camera fly - simple pullback from center
    React.useEffect(() => {
        if (startCameraFly && !cameraFlyRef.current.isFlying) {
            cameraFlyRef.current.isFlying = true;
            cameraFlyRef.current.startTime = Date.now();
            cameraFlyRef.current.startPos = { x: 0, y: 0, z: 3 }; // Cerca del sol
            userControlsEnabled.current = false;
        }
    }, [startCameraFly]);

    // Camera animation (both drag and fly-through)
    useFrame(({ camera }) => {
        if (cameraRef) {
            cameraRef.current = camera;
        }

        if (backgroundSphereRef.current) {
            const targetRotY = camera.position.x * 0.0002;
            const targetRotX = camera.position.y * 0.00012;
            backgroundSphereRef.current.rotation.y += (targetRotY - backgroundSphereRef.current.rotation.y) * 0.015;
            backgroundSphereRef.current.rotation.x += (targetRotX - backgroundSphereRef.current.rotation.x) * 0.015;
        }

        // Update orbital positions in real time
        const now = Date.now();
        let sunPosition = { x: 0, y: 0, z: -10 };

        // Handle Mecatron constellation animation
        if (mecatronAnimationRef.current.isAnimating) {
            const elapsed = Date.now() - mecatronAnimationRef.current.startTime;
            const progress = Math.min(elapsed / mecatronAnimationRef.current.duration, 1);
            const easeProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            planets.forEach((planet, index) => {
                if (!planetRefs.current[index]) return;

                const startPos = mecatronAnimationRef.current.startPositions[index];
                if (!startPos) return;

                let targetPos;
                if (mecatronAnimationRef.current.isInMecatronMode) {
                    // Animating TO Mecatron positions
                    targetPos = planet.mecatronPosition
                        ? { x: planet.mecatronPosition[0], y: planet.mecatronPosition[1], z: planet.mecatronPosition[2] }
                        : { x: planet.position[0], y: planet.position[1], z: planet.position[2] };
                } else {
                    // Animating FROM Mecatron back to original
                    targetPos = { x: planet.position[0], y: planet.position[1], z: planet.position[2] };
                }

                planetRefs.current[index].position.x = startPos.x + (targetPos.x - startPos.x) * easeProgress;
                planetRefs.current[index].position.y = startPos.y + (targetPos.y - startPos.y) * easeProgress;
                planetRefs.current[index].position.z = startPos.z + (targetPos.z - startPos.z) * easeProgress;

                // Update orbital tracking
                orbitingPlanets.current[planet.id] = {
                    x: planetRefs.current[index].position.x,
                    y: planetRefs.current[index].position.y,
                    z: planetRefs.current[index].position.z
                };

                // Track sun for lighting
                if (planet.id === 'sol') {
                    sunPosition = orbitingPlanets.current[planet.id];
                    sunPositionRef.current = sunPosition;
                }
            });

            if (progress >= 1) {
                mecatronAnimationRef.current.isAnimating = false;
            }
        } else {
            // Normal orbital/static positioning when not animating
            planets.forEach((planet, index) => {
                // If in Mecatron mode and not animating, use Mecatron positions
                if (mecatronAnimationRef.current.isInMecatronMode && planet.mecatronPosition) {
                    if (planetRefs.current[index]) {
                        planetRefs.current[index].position.x = planet.mecatronPosition[0];
                        planetRefs.current[index].position.y = planet.mecatronPosition[1];
                        planetRefs.current[index].position.z = planet.mecatronPosition[2];

                        orbitingPlanets.current[planet.id] = {
                            x: planet.mecatronPosition[0],
                            y: planet.mecatronPosition[1],
                            z: planet.mecatronPosition[2]
                        };

                        if (planet.id === 'sol') {
                            sunPosition = orbitingPlanets.current[planet.id];
                            sunPositionRef.current = sunPosition;
                        }
                    }
                } else {
                    // Normal behavior - use orbital positions or static positions
                    const newPos = getOrbitalPosition(planet, now);
                    if (newPos && planetRefs.current[index]) {
                        planetRefs.current[index].position.x = newPos.x;
                        planetRefs.current[index].position.y = newPos.y;
                        planetRefs.current[index].position.z = newPos.z;

                        // Track sun position for lighting and lens flares
                        if (planet.id === 'sol') {
                            sunPosition = newPos;
                            sunPositionRef.current = sunPosition;
                        }

                        // Store updated position for interactions
                        orbitingPlanets.current[planet.id] = newPos;
                    } else if (planetRefs.current[index] && planet.position) {
                        // Si no hay posición calculada, usar la posición estática
                        planetRefs.current[index].position.x = planet.position[0];
                        planetRefs.current[index].position.y = planet.position[1];
                        planetRefs.current[index].position.z = planet.position[2];
                        orbitingPlanets.current[planet.id] = {
                            x: planet.position[0],
                            y: planet.position[1],
                            z: planet.position[2]
                        };
                    }
                }
            });
        }

        // Update sun light position and shadows
        if (sunLightRef.current) {
            const targetLightPos = new THREE.Vector3(
                sunPosition.x + 16,
                sunPosition.y + 8,
                sunPosition.z + 6
            );
            sunLightRef.current.position.lerp(targetLightPos, 0.08);
        }

        // Handle simple pullback animation
        if (cameraFlyRef.current.isFlying) {
            const elapsed = Date.now() - cameraFlyRef.current.startTime;
            const progress = Math.min(elapsed / cameraFlyRef.current.duration, 1);

            // Report progress to parent for fade effects
            if (onFlyProgress) {
                onFlyProgress(progress);
            }

            // Smooth ease-out cubic for gentle deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const start = cameraFlyRef.current.startPos;
            const end = cameraFlyRef.current.endPos;

            // Linear interpolation with easing
            camera.position.x = start.x + (end.x - start.x) * easeProgress;
            camera.position.y = start.y + (end.y - start.y) * easeProgress;
            camera.position.z = start.z + (end.z - start.z) * easeProgress;

            // Always look at center (sun)
            camera.lookAt(0, 0, -10);

            if (progress >= 1) {
                cameraFlyRef.current.isFlying = false;
                const rotation = cameraRotation?.current;
                if (rotation) {
                    const dx = camera.position.x;
                    const dy = camera.position.y;
                    const dz = camera.position.z;
                    const horizontal = Math.sqrt(dx * dx + dz * dz);
                    rotation.theta = Math.atan2(dx, dz);
                    rotation.phi = Math.atan2(dy, horizontal);
                    rotation.targetPlanet = null;
                }
                userControlsEnabled.current = true;
            }
            return;
        }

        if (isTransitioning) return;

        const rotation = cameraRotation?.current;
        if (!userControlsEnabled.current || !rotation) return;

        const autoOrbitEnabled = !userHasInteracted?.current && !rotation.targetPlanet;
        if (autoOrbitEnabled) {
            rotation.theta += 0.0004;
            rotation.phi = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.phi));

            const radius = Math.sqrt(
                camera.position.x * camera.position.x +
                camera.position.y * camera.position.y +
                camera.position.z * camera.position.z
            );
            camera.position.x = radius * Math.sin(rotation.theta) * Math.cos(rotation.phi);
            camera.position.y = radius * Math.sin(rotation.phi);
            camera.position.z = radius * Math.cos(rotation.theta) * Math.cos(rotation.phi);
            camera.lookAt(0, 0, 0);
            return;
        }

        // Handle drag rotation and inertial continuation
        const dragVelocity = dragVelocityRef?.current;
        const hasInertia = !!dragVelocity && (Math.abs(dragVelocity.theta) > 0.00001 || Math.abs(dragVelocity.phi) > 0.00001);
        const targetPlanet = rotation.targetPlanet;

        if (!isDragging?.current && hasInertia) {
            rotation.theta += dragVelocity.theta;
            rotation.phi = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.phi + dragVelocity.phi));

            dragVelocity.theta *= 0.93;
            dragVelocity.phi *= 0.93;

            if (Math.abs(dragVelocity.theta) < 0.00001) dragVelocity.theta = 0;
            if (Math.abs(dragVelocity.phi) < 0.00001) dragVelocity.phi = 0;
        }

        if (!isDragging?.current && !hasInertia && !targetPlanet) return;

        if (!targetPlanet) {
            // Universe view
            const radius = 100;
            camera.position.x = radius * Math.sin(rotation.theta) * Math.cos(rotation.phi);
            camera.position.y = radius * Math.sin(rotation.phi);
            camera.position.z = radius * Math.cos(rotation.theta) * Math.cos(rotation.phi);
            camera.lookAt(0, 0, 0);
        } else {
            // Planet view - use stored distance from transition
            const currentPos = orbitingPlanets.current[targetPlanet.id] || targetPlanet.position;
            const radius = rotation.cameraPlanetDistance || (targetPlanet.size * 3);
            camera.position.x = currentPos.x + radius * Math.sin(rotation.theta) * Math.cos(rotation.phi);
            camera.position.y = currentPos.y + radius * Math.sin(rotation.phi);
            camera.position.z = currentPos.z + radius * Math.cos(rotation.theta) * Math.cos(rotation.phi);
            camera.lookAt(currentPos.x, currentPos.y, currentPos.z);
        }
    });

    return (
        <>
            <fogExp2 attach="fog" args={[0x000000, 0.0005]} />

            <mesh ref={backgroundSphereRef} rotation={[0, Math.PI, 0]} userData={{ ignoreLensOcclusion: true }}>
                <sphereGeometry args={[900, 96, 96]} />
                <meshBasicMaterial
                    map={universeTexture}
                    side={THREE.BackSide}
                    transparent
                    opacity={0.55}
                    depthWrite={false}
                />
            </mesh>

            <ambientLight intensity={0.12} color="#dbe8ff" />

            {/* Sun as physical point emitter with shadows */}
            <pointLight
                ref={sunLightRef}
                position={[16, 8, -4]}
                intensity={4.2}
                color="#FDB813"
                castShadow
                distance={2000}
                decay={1.75}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={1400}
                shadow-bias={-0.00015}
                shadow-normalBias={0.03}
            />

            <Starfield opacity={starfieldOpacity} />

            {/* Lens flare effect from the sun */}
            <LensFlare sunPosition={sunPositionRef.current} opacity={planetsOpacity} />

            {planets.map((planet, index) => (
                <Planet
                    key={planet.id}
                    data={planet}
                    onClick={onPlanetClick}
                    planetRef={(el) => (planetRefs.current[index] = el)}
                    opacity={planetsOpacity}
                />
            ))}

            {/* Timeline 3D elements - visible when cronologia section is active */}
            {activeSection === 'cronologia' && (
                <>
                    <TimelineCamera
                        isActive={true}
                        cameraRef={cameraRef}
                        cameraRotationRef={cameraRotation}
                        planets={planets}
                        planetsRef={planetsRef}
                        zoom={timelineZoom}
                    />
                    <TimelineConnections
                        planets={planets}
                        planetsRef={planetsRef}
                        isActive={true}
                        onLaserProgress={setLaserProgress}
                    />
                    <MecatronPlane
                        showPlane={true}
                        laserProgress={laserProgress}
                    />
                </>
            )}
        </>
    );
}
