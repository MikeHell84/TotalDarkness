// Datos orbitales del sistema solar (semi-ejes en UA, periodos en días terrestres)
// Los periodos están multiplicados por 10 para un movimiento más lento y visible
const ORBITAL_DATA = {
    // Planetas reales del sistema solar (con órbitas)
    mercurio: { semiMajorAxis: 0.387, period: 87.97 * 10, inclination: 7.0 },
    venus: { semiMajorAxis: 0.723, period: 224.70 * 10, inclination: 3.4 },
    tierra: { semiMajorAxis: 1.0, period: 365.25 * 10, inclination: 0.0 },
    marte: { semiMajorAxis: 1.524, period: 686.98 * 10, inclination: 1.9 },
    jupiter: { semiMajorAxis: 5.203, period: 4332.89 * 10, inclination: 1.3 },
    saturno: { semiMajorAxis: 9.537, period: 10759.22 * 10, inclination: 2.5 },
    urano: { semiMajorAxis: 19.191, period: 30688.5 * 10, inclination: 0.8 },
    neptuno: { semiMajorAxis: 30.069, period: 60182.0 * 10, inclination: 1.8 }
    // Los planetas de la saga (mundo, historia, personajes, cronologia, vision) usan posiciones estáticas
};

// Perfil "modo museo": más separación visual entre órbitas y movimiento más contemplativo.
const AU_DISTANCE_EXPONENT = 0.60;
const AU_DISTANCE_SCALE = 95;
const PLANET_TIME_DILATION = 2.2;
const MOON_TIME_DILATION = 2.8;
const MOON_DISTANCE_MULTIPLIER = 0.68;

const auToSceneUnits = (semiMajorAxis) => Math.pow(semiMajorAxis, AU_DISTANCE_EXPONENT) * AU_DISTANCE_SCALE;

// Datos de lunas y sus órbitas
const MOON_DATA = {
    luna: { parentId: 'tierra', semiMajorAxis: 0.0026, period: 27.32, inclination: 5.1, phase: 0.2 },
    fobos: { parentId: 'marte', semiMajorAxis: 0.0000627, period: 0.3183, inclination: 1.1, phase: 1.1 },
    deimos: { parentId: 'marte', semiMajorAxis: 0.000156, period: 1.263, inclination: 1.8, phase: 2.4 },
    io: { parentId: 'jupiter', semiMajorAxis: 0.00282, period: 1.769, inclination: 0.04, phase: 0.1 },
    europa: { parentId: 'jupiter', semiMajorAxis: 0.00449, period: 3.551, inclination: 0.47, phase: 1.3 },
    ganimedes: { parentId: 'jupiter', semiMajorAxis: 0.00715, period: 7.155, inclination: 0.2, phase: 2.1 },
    calisto: { parentId: 'jupiter', semiMajorAxis: 0.01259, period: 16.689, inclination: 0.28, phase: 2.9 },
    titan: { parentId: 'saturno', semiMajorAxis: 0.00817, period: 15.945, inclination: 0.35, phase: 0.7 },
    rea: { parentId: 'saturno', semiMajorAxis: 0.00353, period: 4.518, inclination: 0.35, phase: 1.9 },
    japeto: { parentId: 'saturno', semiMajorAxis: 0.0236, period: 79.33, inclination: 15.5, phase: 2.6 },
    miranda: { parentId: 'urano', semiMajorAxis: 0.00493, period: 1.413, inclination: 4.2, phase: 0.8 },
    ariel: { parentId: 'urano', semiMajorAxis: 0.00759, period: 2.52, inclination: 0.3, phase: 1.6 },
    titania: { parentId: 'urano', semiMajorAxis: 0.0117, period: 8.706, inclination: 0.1, phase: 2.5 },
    triton: { parentId: 'neptuno', semiMajorAxis: 0.00237, period: 5.877, inclination: 156.9, phase: 0.9 },
    nereida: { parentId: 'neptuno', semiMajorAxis: 0.0572, period: 360.13, inclination: 7.2, phase: 2.2 }
};

export function useOrbitalPositions(planets) {
    const getOrbitalPosition = (planetData, currentTime) => {
        const planetKey = planetData.id;
        const moonData = MOON_DATA[planetKey];

        // Si es una luna, calcular su posición alrededor del planeta padre
        if (moonData) {
            const parentPlanet = planets.find(p => p.id === moonData.parentId);
            if (!parentPlanet) return null;

            const parentData = ORBITAL_DATA[moonData.parentId];
            if (!parentData) return null;

            // Obtener posición del planeta padre
            const parentPos = getOrbitalPosition(parentPlanet, currentTime);
            if (!parentPos) return parentPos;

            // Calcular órbita 3D real alrededor del padre
            const moonAngle = (currentTime / (moonData.period * 24 * 3600 * 1000 * MOON_TIME_DILATION)) * Math.PI * 2 + (moonData.phase || 0);
            const parentRadius = parentPlanet.size || 0.5;
            const rawMoonDistance = auToSceneUnits(moonData.semiMajorAxis) * MOON_DISTANCE_MULTIPLIER;
            const moonDistanceUnits = Math.max(rawMoonDistance, parentRadius * 3.35);
            const moonInclination = (moonData.inclination || 0) * Math.PI / 180;

            const localX = Math.cos(moonAngle) * moonDistanceUnits;
            const localZ = Math.sin(moonAngle) * moonDistanceUnits;

            return {
                x: parentPos.x + localX,
                y: parentPos.y + localZ * Math.sin(moonInclination),
                z: parentPos.z + localZ * Math.cos(moonInclination)
            };
        }

        // Para planetas
        const data = ORBITAL_DATA[planetKey];
        if (!data) {
            // Usar posición estática si no hay datos (planetas de la saga)
            if (planetData.position && Array.isArray(planetData.position)) {
                return {
                    x: planetData.position[0],
                    y: planetData.position[1],
                    z: planetData.position[2]
                };
            }
            return null;
        }

        // Calcular ángulo orbital en radianes
        const orbitalAngle = (currentTime / (data.period * 24 * 3600 * 1000 * PLANET_TIME_DILATION)) * Math.PI * 2;

        // Distancia orbital en unidades (escala no lineal comprimida)
        const distanceUnits = auToSceneUnits(data.semiMajorAxis);
        const inclination = data.inclination * Math.PI / 180;

        // Órbita circular en XZ con inclinación orbital
        const localX = Math.cos(orbitalAngle) * distanceUnits;
        const localZ = Math.sin(orbitalAngle) * distanceUnits;

        const x = localX;
        const y = localZ * Math.sin(inclination);
        const z = -10 + localZ * Math.cos(inclination);

        return { x, y, z };
    };

    return getOrbitalPosition;
}
