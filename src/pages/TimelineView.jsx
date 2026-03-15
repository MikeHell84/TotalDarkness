import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

/**
 * TimelineView Component
 * Renders a panoramic view of all planets with:
 * - Timeline events as numbered buttons in a row
 * - Click to navigate to planet
 * - Bright blue glowing lines connecting planets
 * - Logo at top left
 * - Scroll zoom support
 */

// Component to render 3D connecting lines between planets with progressive laser animation
export function TimelineConnections({ planets, planetsRef, isActive, onLaserProgress }) {
    const linesRef = useRef(null);
    const { scene } = useThree();
    const [laserProgress, setLaserProgress] = useState(0);
    const animationStartedRef = useRef(false);

    // Define Mecatron star connection pattern based on SVG geometry
    // This creates the hexagonal star shape by connecting the 6 outer points
    // in a specific order that draws the star properly
    const getMecatronConnections = (planetsById) => {
        // Map of planet IDs to their positions for easy lookup
        const getPos = (id) => planetsById[id]?.position;

        // Define all connections that form the Mecatron star pattern
        // This follows the hexagonal star geometry:
        // 1. Outer hexagon (6 main points)
        // 2. Inner triangles connecting star points
        // 3. Center connections to core planets
        const connections = [
            // OUTER HEXAGON - 6 main points in clockwise order
            ['mundo', 'personajes'],      // Top to Right-Top
            ['personajes', 'cronologia'], // Right-Top to Right-Bottom
            ['cronologia', 'historia'],   // Right-Bottom to Bottom
            ['historia', 'mercurio'],     // Bottom to Left-Bottom
            ['mercurio', 'vision'],       // Left-Bottom to Left-Top
            ['vision', 'mundo'],          // Left-Top to Top (closes hexagon)

            // STAR PATTERN - Cross connections that form the 6-pointed star
            ['mundo', 'cronologia'],      // Top to Right-Bottom
            ['personajes', 'historia'],   // Right-Top to Bottom
            ['cronologia', 'mercurio'],   // Right-Bottom to Left-Bottom
            ['historia', 'vision'],       // Bottom to Left-Top
            ['mercurio', 'personajes'],   // Left-Bottom to Right-Top
            ['vision', 'cronologia'],     // Left-Top to Right-Bottom

            // INNER TRIANGLES - Connect to center planets
            ['mundo', 'venus'],           // Top to center-top
            ['venus', 'personajes'],      // center-top to Right-Top
            ['personajes', 'urano'],      // Right-Top to upper-right
            ['urano', 'tierra'],          // upper-right to center
            ['tierra', 'saturno'],        // center to lower-right
            ['saturno', 'cronologia'],    // lower-right to Right-Bottom
            ['cronologia', 'marte'],      // Right-Bottom to lower-center
            ['marte', 'historia'],        // lower-center to Bottom
            ['historia', 'jupiter'],      // Bottom to lower-left
            ['jupiter', 'mercurio'],      // lower-left to Left-Bottom
            ['mercurio', 'neptuno'],      // Left-Bottom to upper-left
            ['neptuno', 'vision'],        // upper-left to Left-Top
            ['vision', 'venus'],          // Left-Top to center-top (closes inner ring)

            // CENTER CONNECTIONS - Connect core planets
            ['venus', 'tierra'],          // center-top to center
            ['tierra', 'marte'],          // center to lower-center
            ['urano', 'saturno'],         // upper-right to lower-right
            ['jupiter', 'neptuno'],       // lower-left to upper-left
        ];

        return connections
            .map(([fromId, toId]) => ({
                from: getPos(fromId),
                to: getPos(toId),
                fromId,
                toId
            }))
            .filter(conn => conn.from && conn.to); // Only include valid connections
    };

    // Start laser animation after planets have moved to position (3 seconds delay)
    useEffect(() => {
        if (!isActive || animationStartedRef.current) return;

        animationStartedRef.current = true;
        const startDelay = 3000; // Wait for planets to position
        const animationDuration = 3000; // 3 seconds for laser to complete (slower for complex pattern)

        const timer = setTimeout(() => {
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                setLaserProgress(progress);

                // Notify parent of progress
                if (onLaserProgress) {
                    onLaserProgress(progress);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }, startDelay);

        return () => {
            clearTimeout(timer);
            animationStartedRef.current = false;
            setLaserProgress(0);
            if (onLaserProgress) {
                onLaserProgress(0);
            }
        };
    }, [isActive, onLaserProgress]);

    useEffect(() => {
        if (!isActive || !planetsRef?.current || laserProgress === 0) return;

        // Clear previous lines if any
        if (linesRef.current) {
            scene.remove(linesRef.current);
            linesRef.current.geometry.dispose();
            linesRef.current.material.dispose();
        }

        // Create planet lookup map by ID
        const planetsById = {};
        planets.forEach((planet, idx) => {
            const obj = planetsRef.current?.[idx];
            if (obj && planet.id !== 'sol') { // Exclude Sol from connections
                planetsById[planet.id] = {
                    id: planet.id,
                    position: obj.position
                };
            }
        });

        // Get all Mecatron star connections
        const allConnections = getMecatronConnections(planetsById);
        const totalConnections = allConnections.length;
        const connectionsToShow = Math.floor(totalConnections * laserProgress);

        // Create geometry for visible connections
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const indices = [];

        // Draw connections progressively
        for (let i = 0; i < connectionsToShow; i++) {
            const conn = allConnections[i];
            const startIdx = positions.length / 3;

            positions.push(
                conn.from.x, conn.from.y, conn.from.z,
                conn.to.x, conn.to.y, conn.to.z
            );
            indices.push(startIdx, startIdx + 1);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

        // Cyan glowing laser material
        const material = new THREE.LineBasicMaterial({
            color: 0x00e5e5, // Bright cyan
            linewidth: 3,
            fog: false,
            transparent: true,
            opacity: 0.9
        });

        const lines = new THREE.LineSegments(geometry, material);
        linesRef.current = lines;
        scene.add(lines);

        return () => {
            if (linesRef.current) {
                scene.remove(linesRef.current);
                geometry.dispose();
                material.dispose();
            }
        };
    }, [isActive, planets, planetsRef, scene, laserProgress]);

    return null;
}

// 3D Mecatron Plane - Shows the SVG as a double-sided plane in 3D space
export function MecatronPlane({ showPlane, laserProgress }) {
    const planeRef = useRef(null);
    const { scene, gl } = useThree();
    const [opacity, setOpacity] = useState(0);
    const textureLoader = new THREE.TextureLoader();

    useEffect(() => {
        if (showPlane && laserProgress >= 1) {
            // Fade in after laser completes
            const timer = setTimeout(() => {
                setOpacity(1);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setOpacity(0);
        }
    }, [showPlane, laserProgress]);

    useEffect(() => {
        if (!showPlane || laserProgress < 1) {
            if (planeRef.current) {
                scene.remove(planeRef.current);
                planeRef.current.geometry.dispose();
                planeRef.current.material.dispose();
                planeRef.current = null;
            }
            return;
        }

        // Create plane geometry (matching the constellation size)
        const geometry = new THREE.PlaneGeometry(70, 70);

        // Load SVG as texture with high quality settings
        const texture = textureLoader.load('/assets/mecatron.svg', (tex) => {
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.minFilter = THREE.LinearMipmapLinearFilter; // High quality filtering
            tex.magFilter = THREE.LinearFilter;
            tex.anisotropy = gl.capabilities.getMaxAnisotropy(); // Maximum anisotropic filtering
            tex.generateMipmaps = true; // Generate mipmaps for better quality at distance
            tex.needsUpdate = true;
        });

        // Create material with double-sided rendering
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: opacity * 0.35,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0, 0);
        plane.rotation.x = -Math.PI / 2; // Rotate 90 degrees to lay flat (horizontal)

        planeRef.current = plane;
        scene.add(plane);

        return () => {
            if (planeRef.current) {
                scene.remove(planeRef.current);
                geometry.dispose();
                material.dispose();
                texture.dispose();
            }
        };
    }, [showPlane, scene, textureLoader, laserProgress]);

    // Update opacity smoothly
    useEffect(() => {
        if (planeRef.current && planeRef.current.material) {
            planeRef.current.material.opacity = opacity * 0.35;
            planeRef.current.material.needsUpdate = true;
        }
    }, [opacity]);

    return null;
}

// HTML Overlay for timeline events with zoom support
export function TimelineEventsOverlay({ timeline, onNavigateToPlanet, showHud = true, showLogo = true, selectedChapter = null, zoom = 1, onZoomChange }) {
    const containerRef = useRef(null);

    // Handle scroll zoom
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            if (!onZoomChange) return;
            onZoomChange((prev) => {
                const nextZoom = prev + (e.deltaY > 0 ? -0.12 : 0.12);
                return Math.max(0.6, Math.min(nextZoom, 2.2));
            });
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [onZoomChange]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none select-none overflow-hidden"
            style={{ userSelect: 'none' }}
        >
            {showHud && showLogo && (
                <div className="absolute top-8 left-8 z-50 pointer-events-auto">
                    <img
                        src="/logo-total-darkness.svg?v=20260309"
                        alt="Total Darkness"
                        className="h-16 w-auto object-contain drop-shadow-lg"
                    />
                </div>
            )}

        </div>
    );
}

// Individual timeline number button
function TimelineNumberButton({ event, onNavigate, isSelected = false, isMobile = false }) {
    const containerRef = useRef(null);

    return (
        <button
            ref={containerRef}
            onClick={onNavigate}
            className={`group pointer-events-auto cursor-pointer transition-all ${isSelected ? 'opacity-100' : 'opacity-85 hover:opacity-100'}`}
            title={`${event.title}`}
            style={{
                position: 'relative',
                border: `2px solid ${isSelected ? '#00e5e5' : '#5dfdfd'}`,
                borderRadius: 6,
                padding: isMobile ? '8px 6px' : '10px 8px',
                maxWidth: '100%',
                background: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
                backdropFilter: isSelected ? 'blur(8px)' : 'none',
                boxShadow: isSelected ? '0 0 12px rgba(0, 229, 229, 0.53), inset 0 0 8px rgba(0, 229, 229, 0.2)' : 'none',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '6px' : '10px',
                color: isSelected ? '#00e5e5' : '#5dfdfd',
            }}
        >
            {/* Number Circle */}
            <span
                style={{
                    position: 'relative',
                    zIndex: 2,
                    flexShrink: 0,
                    width: isMobile ? '26px' : '32px',
                    height: isMobile ? '26px' : '32px',
                    borderRadius: '50%',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '10px' : '12px',
                    display: 'grid',
                    placeItems: 'center',
                    transition: 'all 300ms ease',
                    background: isSelected ? 'rgba(0, 229, 229, 0.28)' : 'rgba(0, 0, 0, 0.2)',
                    border: `2px solid ${isSelected ? '#00e5e5' : '#5dfdfd'}`,
                    color: '#b8f6ff',
                    boxShadow: isSelected ? '0 0 10px rgba(0, 229, 229, 0.8)' : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
                }}
            >
                {event.eventIdx}
            </span>

            {/* Chapter Title */}
            <span
                style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'left',
                    fontSize: isMobile ? '10px' : '11px',
                    lineHeight: 1.3,
                    flex: 1,
                    minWidth: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 1 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: isSelected ? '#00e5e5' : '#5dfdfd',
                    transition: 'all 200ms ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'Orbitron, monospace',
                }}
                className="group-hover:text-cyan-100"
            >
                {event.title}
            </span>
        </button>
    );
}

// Exported component for timeline chapter list
export function TimelineChapterList({ eventLocations, selectedChapter, onNavigateToPlanet }) {
    const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col gap-2 md:gap-3" style={{ width: '100%' }}>
            {eventLocations.map((event) => (
                <TimelineNumberButton
                    key={`chapter-${event.chapterIndex}`}
                    event={event}
                    isMobile={isMobile}
                    isSelected={selectedChapter === event.title}
                    onNavigate={() => onNavigateToPlanet(event.chapterIndex)}
                />
            ))}
        </div>
    );
}
// Assign chapters to planets and their moons

// Camera controller for panoramic view
export function TimelineCamera({ isActive, cameraRef, cameraRotationRef, planets, zoom = 1 }) {
    const { camera } = useThree();
    const animationRef = useRef(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!isActive) {
            hasInitializedRef.current = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            return;
        }

        if (!cameraRef?.current) return;

        // Si hay un targetPlanet, animar la cámara hacia ese planeta
        const targetPlanet = cameraRotationRef?.current?.targetPlanet;
        if (targetPlanet) {
            // Cancelar cualquier animación previa antes de iniciar una nueva
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            const { x, y, z } = targetPlanet.position;
            const cameraDistance = cameraRotationRef.current.cameraPlanetDistance || 20;
            // Posición objetivo: detrás del planeta, ajustando el zoom
            const zoomFactor = 1 / zoom;
            const targetPos = {
                x: x + cameraDistance * 0.7 * zoomFactor,
                y: y + cameraDistance * 0.4 * zoomFactor,
                z: z + cameraDistance * 0.8 * zoomFactor
            };
            // Siempre tomar la posición actual de la cámara como inicio
            const getCurrentCameraPos = () => ({
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z
            });
            let startPos = getCurrentCameraPos();
            let lastStartTime = Date.now();
            const duration = 1600;
            hasInitializedRef.current = true;
            const animate = () => {
                // Si el usuario selecciona otro capítulo, reiniciar el viaje desde la posición actual
                if (startPos == null || lastStartTime == null) {
                    startPos = getCurrentCameraPos();
                    lastStartTime = Date.now();
                }
                const elapsed = Date.now() - lastStartTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                camera.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
                camera.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
                camera.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
                camera.fov = 75;
                camera.updateProjectionMatrix();
                camera.lookAt(x, y, z);
                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    animationRef.current = null;
                }
            };
            animate();
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }

        // Si no hay targetPlanet, vista panorámica de todos los planetas
        // ...existing code...
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        planets.forEach((planet) => {
            const basePosition = planet.mecatronPosition || planet.position;
            minX = Math.min(minX, basePosition[0] - planet.size);
            maxX = Math.max(maxX, basePosition[0] + planet.size);
            minY = Math.min(minY, basePosition[1] - planet.size);
            maxY = Math.max(maxY, basePosition[1] + planet.size);
            minZ = Math.min(minZ, basePosition[2] - planet.size);
            maxZ = Math.max(maxZ, basePosition[2] + planet.size);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        const width = maxX - minX;
        const height = maxY - minY;
        const depth = maxZ - minZ;
        const maxDim = Math.max(width, height, depth);

        const distance = (maxDim / 2) / Math.tan((camera.fov / 2) * (Math.PI / 180));
        const padding = distance * 0.5;
        const zoomFactor = 1 / zoom;

        const targetPos = {
            x: centerX + (distance + padding) * 0.7 * zoomFactor,
            y: centerY + (distance + padding) * 0.4 * zoomFactor,
            z: centerZ + (distance + padding) * 0.8 * zoomFactor
        };

        const startPos = {
            x: cameraRef.current.position.x,
            y: cameraRef.current.position.y,
            z: cameraRef.current.position.z
        };

        const duration = hasInitializedRef.current ? 250 : 2000;
        const startTime = Date.now();
        hasInitializedRef.current = true;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            camera.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
            camera.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
            camera.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
            camera.fov = 75; // Standard FOV for good visibility
            camera.updateProjectionMatrix();
            camera.lookAt(centerX, centerY, centerZ);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animate();

        // Update camera rotation ref for consistency
        if (cameraRotationRef?.current) {
            const dx = targetPos.x - centerX;
            const dy = targetPos.y - centerY;
            const dz = targetPos.z - centerZ;
            const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

            cameraRotationRef.current.theta = Math.atan2(dx, dz);
            cameraRotationRef.current.phi = Math.atan2(dy, horizontalDistance || 0.0001);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, planets, camera, cameraRef, cameraRotationRef, zoom]);

    return null;
}

/**
 * TimelineView - Main Component
 * Orchestrates panoramic timeline visualization
 */
export default function TimelineView({
    timeline,
    isActive,
    onNavigateToPlanet,
    showHud = true,
    showLogo = true,
    selectedChapter = null,
    zoom = 1,
    onZoomChange
}) {
    return (
        <div className="fixed inset-0 pointer-events-none">
            {/* HTML overlay for timeline events */}
            {isActive && (
                <TimelineEventsOverlay
                    timeline={timeline}
                    onNavigateToPlanet={onNavigateToPlanet}
                    showHud={showHud}
                    showLogo={showLogo}
                    selectedChapter={selectedChapter}
                    zoom={zoom}
                    onZoomChange={onZoomChange}
                />
            )}
        </div>
    );
}

// TimelineConnections, TimelineCamera, and MecatronPlane are exported as named exports above