import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const GAS_GIANT_IDS = new Set(['jupiter', 'saturno', 'urano', 'neptuno']);

function hashStringToSeed(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function createSeededRandom(seed) {
    let current = seed >>> 0;
    return () => {
        current = (Math.imul(current, 1664525) + 1013904223) >>> 0;
        return current / 4294967296;
    };
}

function createReliefTexture(planetId) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const random = createSeededRandom(hashStringToSeed(`relief-${planetId}`));
    const imageData = ctx.createImageData(size, size);
    const pixels = imageData.data;
    const isGasGiant = GAS_GIANT_IDS.has(planetId);

    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            const index = (y * size + x) * 4;
            const latitude = y / (size - 1);
            const lonWave = Math.sin((x / size) * Math.PI * (isGasGiant ? 18 : 9));
            const latWave = Math.cos(latitude * Math.PI * (isGasGiant ? 28 : 14));
            const largeNoise = (random() - 0.5) * (isGasGiant ? 24 : 62);
            const fineNoise = (random() - 0.5) * (isGasGiant ? 10 : 20);

            let elevation = 128 + lonWave * 26 + latWave * 18 + largeNoise + fineNoise;
            if (isGasGiant) {
                elevation += Math.sin(latitude * Math.PI * 70) * 16;
            }

            const value = Math.max(0, Math.min(255, Math.round(elevation)));
            pixels[index] = value;
            pixels[index + 1] = value;
            pixels[index + 2] = value;
            pixels[index + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
}

const AURA_VERTEX_SHADER = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const AURA_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uPower;
uniform float uIntensity;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), uPower);
    float alpha = clamp(fresnel * uIntensity * uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(uColor, alpha);
}
`;

const SOLAR_CORONA_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uPower;
uniform float uIntensity;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), uPower);
    float softEdge = smoothstep(0.0, 1.0, fresnel);
    float alpha = clamp(softEdge * uIntensity * uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(uColor, alpha);
}
`;

const MOON_IDS = new Set([
    'luna', 'fobos', 'deimos',
    'io', 'europa', 'ganimedes', 'calisto',
    'titan', 'rea', 'japeto',
    'miranda', 'ariel', 'titania',
    'triton', 'nereida'
]);

export function Planet({ data, onClick, planetRef, opacity = 1, shadowsEnabled = true }) {
    const meshRef = useRef();
    const modelRef = useRef();
    const ringRef = useRef();
    const coronaRef = useRef();
    const coronaMidRef = useRef();
    const coronaOuterRef = useRef();
    const coronaFarRef = useRef();
    const coronaBloomRef = useRef();
    const auraInnerRef = useRef();
    const auraOuterRef = useRef();
    const [modelScene, setModelScene] = useState(null);
    const isSun = data.id === 'sol';
    const isMoon = MOON_IDS.has(data.id);
    const isGasGiant = GAS_GIANT_IDS.has(data.id);
    const renderSize = isMoon ? Math.max(data.size, 0.24) : data.size;
    const hasPlanetAura = !isSun && !!data.auraColor;
    const auraOpacityMultiplier = data.modelPath ? 0.42 : 0.72;
    const reliefTexture = React.useMemo(() => {
        if (isSun || data.modelPath) return null;
        return createReliefTexture(data.id);
    }, [data.id, data.modelPath, isSun]);

    useEffect(() => {
        return () => {
            if (reliefTexture) {
                reliefTexture.dispose();
            }
        };
    }, [reliefTexture]);

    useEffect(() => {
        if (!data.modelPath) {
            setModelScene(null);
            return;
        }

        let isCancelled = false;
        const loader = new GLTFLoader();

        loader.load(
            data.modelPath,
            (gltf) => {
                if (isCancelled) return;

                const sceneClone = gltf.scene.clone(true);
                sceneClone.traverse((node) => {
                    if (node.isMesh && node.material) {
                        node.userData = {
                            ...(node.userData || {}),
                            isLensOccluder: !isSun,
                            planetId: data.id
                        };

                        const materials = Array.isArray(node.material) ? node.material : [node.material];
                        materials.forEach((material) => {
                            if (material.isMeshBasicMaterial) {
                                const replacement = new THREE.MeshStandardMaterial({
                                    color: material.color ? material.color.clone() : new THREE.Color(data.color || 0xffffff),
                                    map: material.map || null,
                                    transparent: material.transparent,
                                    opacity: material.opacity,
                                    roughness: 0.68,
                                    metalness: 0.12
                                });
                                replacement.needsUpdate = true;
                                node.material = replacement;
                                material = replacement;
                            }

                            const isMappedMaterial = !!material.map;
                            if (material.map) {
                                material.map.colorSpace = THREE.SRGBColorSpace;
                            } else if (material.color && data.color) {
                                material.color = new THREE.Color(data.color);
                            }

                            if ('emissive' in material && data.color) {
                                material.emissive = isMappedMaterial
                                    ? new THREE.Color(0x111111)
                                    : (isSun ? new THREE.Color(data.color) : new THREE.Color(0x040404));
                            }
                            if ('emissiveIntensity' in material) {
                                material.emissiveIntensity = isSun ? 2.0 : (isMappedMaterial ? 0.01 : 0.02);
                            }
                            if ('roughness' in material) {
                                material.roughness = isSun ? 0.28 : (isMappedMaterial ? 0.76 : 0.58);
                            }
                            if ('metalness' in material) {
                                material.metalness = isSun ? 0.1 : (isMappedMaterial ? 0.1 : 0.16);
                            }
                            if ('envMapIntensity' in material) {
                                material.envMapIntensity = isSun ? 1.0 : (isMappedMaterial ? 0.35 : 0.5);
                            }

                            if (opacity < 1) {
                                material.transparent = true;
                                material.opacity = opacity;
                            } else {
                                material.transparent = false;
                                material.opacity = 1;
                            }

                            material.needsUpdate = true;
                        });

                        // Enable shadows for GLTF models
                        node.castShadow = shadowsEnabled;
                        node.receiveShadow = shadowsEnabled;
                    }
                });

                setModelScene(sceneClone);
            },
            undefined,
            () => {
                if (!isCancelled) {
                    setModelScene(null);
                }
            }
        );

        return () => {
            isCancelled = true;
        };
    }, [data.modelPath, data.color, opacity, isSun, shadowsEnabled, data.id]);

    useFrame((state, delta) => {
        const rotatingObject = modelRef.current || meshRef.current;
        if (rotatingObject) {
            rotatingObject.rotation.y += delta * 0.5;
            rotatingObject.rotation.x += delta * 0.2;
        }

        // Sun corona pulsation effect
        if (isSun && coronaRef.current && coronaMidRef.current && coronaOuterRef.current && coronaFarRef.current && coronaBloomRef.current) {
            const t = state.clock.elapsedTime;
            const innerPulse = 1.07 + Math.sin(t * 1.9) * 0.03;
            const midPulse = 1.15 + Math.sin(t * 1.45 + 0.45) * 0.04;
            const outerPulse = 1.24 + Math.sin(t * 1.25 + 0.8) * 0.045;
            const farPulse = 1.32 + Math.sin(t * 1.05 + 1.2) * 0.055;
            const bloomPulse = 1.42 + Math.sin(t * 0.85 + 1.8) * 0.06;
            coronaRef.current.scale.set(innerPulse, innerPulse, innerPulse);
            coronaMidRef.current.scale.set(midPulse, midPulse, midPulse);
            coronaOuterRef.current.scale.set(outerPulse, outerPulse, outerPulse);
            coronaFarRef.current.scale.set(farPulse, farPulse, farPulse);
            coronaBloomRef.current.scale.set(bloomPulse, bloomPulse, bloomPulse);
        }

        if (hasPlanetAura && auraInnerRef.current && auraOuterRef.current) {
            const innerPulse = 1.08 + Math.sin(state.clock.elapsedTime * 1.4) * 0.02;
            const outerPulse = 1.16 + Math.sin(state.clock.elapsedTime * 1.1 + 0.8) * 0.025;
            auraInnerRef.current.scale.set(innerPulse, innerPulse, innerPulse);
            auraOuterRef.current.scale.set(outerPulse, outerPulse, outerPulse);
        }
    });

    return (
        <group ref={planetRef} position={data.position}>
            {modelScene ? (
                <primitive
                    ref={modelRef}
                    object={modelScene}
                    scale={data.modelScale ?? data.size}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(data);
                    }}
                    userData={{ id: data.id, name: data.name }}
                />
            ) : (
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(data);
                    }}
                    userData={{ id: data.id, name: data.name, isLensOccluder: !isSun, planetId: data.id }}
                    castShadow={shadowsEnabled}
                    receiveShadow={shadowsEnabled}
                >
                    <sphereGeometry args={[renderSize, 32, 32]} />
                    <meshStandardMaterial
                        color={data.color}
                        emissive={isSun ? data.color : 0x050505}
                        emissiveIntensity={isSun ? 2.0 : (isMoon ? 0.07 : 0.01)}
                        roughness={isSun ? 0.3 : (isMoon ? 0.68 : (isGasGiant ? 0.88 : 0.74))}
                        metalness={isSun ? 0.1 : 0.05}
                        bumpMap={reliefTexture}
                        bumpScale={isMoon ? 0.11 : (isGasGiant ? 0.035 : 0.07)}
                        transparent
                        opacity={opacity}
                    />
                </mesh>
            )}

            {/* Rings only for Saturn */}
            {data.id === 'saturno' && (
                <mesh ref={ringRef} rotation-x={Math.PI / 2}>
                    <ringGeometry args={[renderSize * 1.3, renderSize * 1.75, 128]} />
                    <meshBasicMaterial
                        color={0xDDBB8A}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.42 * opacity}
                    />
                </mesh>
            )}

            {/* Planetary Aura (atmosphere/ozone layer effect) */}
            {data.auraColor && (
                <>
                    <mesh ref={auraInnerRef} scale={1.08}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(data.auraColor) },
                                uOpacity: { value: (data.auraOpacity || 0.3) * opacity * auraOpacityMultiplier },
                                uPower: { value: 2.8 },
                                uIntensity: { value: 0.62 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={AURA_FRAGMENT_SHADER}
                        />
                    </mesh>
                    <mesh ref={auraOuterRef} scale={1.16}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(data.auraColor) },
                                uOpacity: { value: (data.auraOpacity || 0.3) * opacity * auraOpacityMultiplier * 0.72 },
                                uPower: { value: 3.6 },
                                uIntensity: { value: 0.38 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={AURA_FRAGMENT_SHADER}
                        />
                    </mesh>
                </>
            )}

            {/* Sun corona glow effect */}
            {isSun && (
                <>
                    <mesh ref={coronaRef} scale={1.07}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(0xFDB813) },
                                uOpacity: { value: 0.34 * opacity },
                                uPower: { value: 2.0 },
                                uIntensity: { value: 0.95 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={SOLAR_CORONA_FRAGMENT_SHADER}
                        />
                    </mesh>

                    <mesh ref={coronaMidRef} scale={1.15}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(0xFFA500) },
                                uOpacity: { value: 0.24 * opacity },
                                uPower: { value: 2.6 },
                                uIntensity: { value: 0.82 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={SOLAR_CORONA_FRAGMENT_SHADER}
                        />
                    </mesh>

                    <mesh ref={coronaOuterRef} scale={1.24}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(0xFFB347) },
                                uOpacity: { value: 0.16 * opacity },
                                uPower: { value: 3.1 },
                                uIntensity: { value: 0.68 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={SOLAR_CORONA_FRAGMENT_SHADER}
                        />
                    </mesh>

                    <mesh ref={coronaFarRef} scale={1.32}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(0xFFD27A) },
                                uOpacity: { value: 0.1 * opacity },
                                uPower: { value: 3.7 },
                                uIntensity: { value: 0.58 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={SOLAR_CORONA_FRAGMENT_SHADER}
                        />
                    </mesh>

                    <mesh ref={coronaBloomRef} scale={1.42}>
                        <sphereGeometry args={[renderSize, 32, 32]} />
                        <shaderMaterial
                            transparent
                            depthWrite={false}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            uniforms={{
                                uColor: { value: new THREE.Color(0xFFE6A8) },
                                uOpacity: { value: 0.055 * opacity },
                                uPower: { value: 4.2 },
                                uIntensity: { value: 0.42 }
                            }}
                            vertexShader={AURA_VERTEX_SHADER}
                            fragmentShader={SOLAR_CORONA_FRAGMENT_SHADER}
                        />
                    </mesh>
                </>
            )}
        </group>
    );
}
