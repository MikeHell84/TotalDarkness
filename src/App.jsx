import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnalytics } from './hooks/useAnalytics';
import { UniverseScene } from './components/UniverseScene';
import { StarParticles } from './components/StarParticles';
import MundoPage from './pages/MundoPage';
import PersonajesPage from './pages/PersonajesPage';
import SectionStructurePage from './pages/SectionStructurePage';
import TimelineView, { TimelineConnections, TimelineCamera } from './pages/TimelineView';
import TotalDarknessChat from './components/TotalDarknessChat';
import TimelineSectionPage from './pages/TimelineSectionPage';

export default function App() {
  console.log('🌌 TOTAL DARKNESS APP LOADED 🌌');
  useAnalytics('Total Darkness', 'page');
  const [activeSection, setActiveSection] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState(1); // 1: Xlerion logo, 2: PRESENTA, 3: Total Darkness screen
  const [fadeOutPhase1, setFadeOutPhase1] = useState(false);
  const [fadeOutPhase2, setFadeOutPhase2] = useState(false);
  const [showMainLogo, setShowMainLogo] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
  const [starfieldOpacity, setStarfieldOpacity] = useState(0);
  const [planetsOpacity, setPlanetsOpacity] = useState(0);
  const [startCameraFly, setStartCameraFly] = useState(false);
  const [cameraFlyProgress, setCameraFlyProgress] = useState(0);
  const [showWhiteOverlay, setShowWhiteOverlay] = useState(false);
  const [whiteOverlayOpacity, setWhiteOverlayOpacity] = useState(0);
  const [universeEntryBlur, setUniverseEntryBlur] = useState(0);
  const [showTransitionFlyLogo, setShowTransitionFlyLogo] = useState(false);
  const [transitionFlyLogoKey, setTransitionFlyLogoKey] = useState(0);
  const [transitionFlyLogoDirection, setTransitionFlyLogoDirection] = useState('forward');
  const [isPanelPoweringOff, setIsPanelPoweringOff] = useState(false);
  const [isPanelPoweringOn, setIsPanelPoweringOn] = useState(false);
  const [selectedTimelineChapter, setSelectedTimelineChapter] = useState(null);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const LOGO_FLY_TRANSITION_MS = 1500;
  const PANEL_TV_OFF_MS = 300;
  const PANEL_TV_ON_MS = 300;
  const [language, setLanguage] = useState(null);
  const cameraRef = useRef(null);
  const planetsRef = useRef([]);
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const navigationAnimationRef = useRef(null);
  const cameraRotationRef = useRef({ phi: 0, theta: 0, targetPlanet: null, cameraPlanetDistance: 5 });
  const universeCameraSnapshotRef = useRef({
    position: { x: 75, y: 15, z: 50 },
    fov: 75,
    lookAt: { x: 0, y: 0, z: -10 },
    theta: Math.atan2(75, 50),
    phi: Math.atan2(15, Math.sqrt(75 * 75 + 50 * 50))
  });
  const overlayAnimationRef = useRef(null);
  const panelPowerOffTimeoutRef = useRef(null);
  const panelPowerOnRevealTimeoutRef = useRef(null);
  const panelPowerOnDoneTimeoutRef = useRef(null);
  const userHasInteractedRef = useRef(false);
  const dragVelocityRef = useRef({ theta: 0, phi: 0 });

  React.useEffect(() => {
    if (activeSection !== 'cronologia') {
      setTimelineZoom(1);
    }
  }, [activeSection]);

  const triggerPanelPowerOn = React.useCallback(() => {
    if (panelPowerOnRevealTimeoutRef.current) {
      clearTimeout(panelPowerOnRevealTimeoutRef.current);
    }
    if (panelPowerOnDoneTimeoutRef.current) {
      clearTimeout(panelPowerOnDoneTimeoutRef.current);
    }

    setIsPanelPoweringOn(true);
    setShowContent(false);

    panelPowerOnRevealTimeoutRef.current = setTimeout(() => {
      setShowContent(true);
    }, 100);

    panelPowerOnDoneTimeoutRef.current = setTimeout(() => {
      setIsPanelPoweringOn(false);
    }, PANEL_TV_ON_MS + 100);
  }, []);

  const handleTimelineConstellationReady = React.useCallback(() => {
    if (activeSection !== 'cronologia' || isTransitioning || showContent) return;
    triggerPanelPowerOn();
  }, [activeSection, isTransitioning, showContent, triggerPanelPowerOn]);

  const I18N = {
    es: {
      chooseLanguage: 'Language / Idioma',
      english: 'English',
      spanish: 'Español',
      presents: 'PRESENTA',
      storyOfXlerion: 'la Historia de Xlerion',
      pressToContinue: 'Presiona para continuar',
      webglUnsupported: 'Este visor embebido no tiene soporte WebGL completo.',
      webglFallback: 'Puedes navegar el contenido básico aquí o abrir la experiencia 3D en navegador externo.',
      copyrightNotice: `© ${new Date().getFullYear()} Total Darkness. Todos los derechos reservados.`,
      dragToRotate: 'Arrastra para girar • Click para visitar'
    },
    en: {
      chooseLanguage: 'Choose language',
      english: 'English',
      spanish: 'Spanish',
      presents: 'PRESENTS',
      storyOfXlerion: 'The Story of Xlerion',
      pressToContinue: 'Press to continue',
      webglUnsupported: 'This embedded viewer does not fully support WebGL.',
      webglFallback: 'You can browse the basic content here or open the 3D experience in an external browser.',
      copyrightNotice: `© ${new Date().getFullYear()} Total Darkness. All rights reserved.`,
      dragToRotate: 'Drag to rotate • Click to visit'
    }
  };

  const t = (key) => {
    const lang = language || 'es';
    return I18N[lang]?.[key] ?? I18N.es[key] ?? key;
  };

  const sectionLabelById = {
    es: {
      mundo: 'Mundo',
      historia: 'Historia',
      personajes: 'Personajes',
      cronologia: 'Cronología',
      vision: 'Visión'
    },
    en: {
      mundo: 'World',
      historia: 'History',
      personajes: 'Characters',
      cronologia: 'Timeline',
      vision: 'Vision'
    }
  };

  const getSectionLabel = (planet) => {
    const lang = language || 'es';
    return sectionLabelById[lang]?.[planet.id] || planet.name;
  };

  const startMainExperience = React.useCallback(() => {
    if (showWhiteOverlay) return;

    // Mostrar overlay blanco que comienza en opacidad 0
    // El useEffect se encargará de animarlo
    setShowWhiteOverlay(true);
    setWhiteOverlayOpacity(0);

    // Una vez que el overlay esté completamente opaco (después de 4 segundos), cambiar a la escena
    setTimeout(() => {
      setShowIntro(false);
      setStarfieldOpacity(0);
      setPlanetsOpacity(1);
      setStartCameraFly(true);

      // Ahora animar el overlay atenuándose mientras la cámara vuela (4 segundos adicionales)
      const fadeStartTime = Date.now();
      const fadeDuration = 4000;
      const animateFadeOut = () => {
        const elapsed = Date.now() - fadeStartTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        setWhiteOverlayOpacity(1 - progress);
        if (progress < 1) {
          requestAnimationFrame(animateFadeOut);
        } else {
          setShowWhiteOverlay(false);
        }
      };
      animateFadeOut();
    }, 4000);

    // Logo y contenido aparecen después de todo
    setTimeout(() => {
      setShowMainLogo(true);
    }, 8000);

    setTimeout(() => {
      setShowMainContent(true);
    }, 10000);
  }, [showWhiteOverlay]);

  // Effect para animar el overlay blanco
  React.useEffect(() => {
    if (!showWhiteOverlay) return;

    // Limpiar animación anterior si existe
    if (overlayAnimationRef.current) {
      cancelAnimationFrame(overlayAnimationRef.current);
    }

    const startTime = Date.now();
    const duration = 4000; // 4 segundos

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setWhiteOverlayOpacity(progress);

      if (progress < 1) {
        overlayAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    overlayAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (overlayAnimationRef.current) {
        cancelAnimationFrame(overlayAnimationRef.current);
      }
    };
  }, [showWhiteOverlay]);

  React.useEffect(() => {
    if (showIntro || activeSection) {
      setUniverseEntryBlur(0);
      return;
    }

    const startBlur = 10;
    const duration = 1800;
    const startTime = performance.now();
    let frameId = 0;

    setUniverseEntryBlur(startBlur);

    const animateBlur = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setUniverseEntryBlur(startBlur * (1 - eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateBlur);
      }
    };

    frameId = requestAnimationFrame(animateBlur);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [showIntro, activeSection]);

  const timeline = [
    'Prólogo: cada fin tiene un comienzo',
    'Capítulo I: múltiples orígenes y gran diluvio universal',
    'Capítulo II: elección o destino, caída de Dilmun',
    'Capítulo III: XLERION, el despertar',
    'Capítulo IV: una esperanza en la oscuridad',
    'Capítulo VI: matar para vivir (hora cero)',
    'Capítulo VII: la última palabra',
    'Capítulo VIII: alma de fuego',
    'Capítulo IX: la guerra de orgullo',
    'Capítulo X-XI: Tormentor Rojo y Oscuridad Total'
  ];

  // Mapeo de cada capítulo a su planeta en la Constelación Mecatron
  // Distribuye los 10 capítulos entre los 10 planetas secundarios (excluye Sol)
  const timelineChapterToPlanetMap = [
    { chapter: 0, planetId: 'mundo' },      // Prólogo → Mundo
    { chapter: 1, planetId: 'venus' },      // Cap I → Venus
    { chapter: 2, planetId: 'tierra' },     // Cap II → Tierra
    { chapter: 3, planetId: 'marte' },      // Cap III → Marte
    { chapter: 4, planetId: 'personajes' }, // Cap IV → Personajes
    { chapter: 5, planetId: 'jupiter' },    // Cap VI → Júpiter
    { chapter: 6, planetId: 'saturno' },    // Cap VII → Saturno
    { chapter: 7, planetId: 'urano' },      // Cap VIII → Urano
    { chapter: 8, planetId: 'neptuno' },    // Cap IX → Neptuno
    { chapter: 9, planetId: 'mercurio' }    // Cap X-XI → Mercurio
  ];

  // Constelación Mecatron - Estrella de 6 puntas
  // SVG viewBox: 0 0 1956 2201, centro en (978, 1100.5)
  // Escala: 0.04 para convertir SVG a espacio 3D
  // position: [x, y, z] - posición inicial dispersa en el universo
  // mecatronPosition: [x, y, z] - posición en la constelación Mecatron (se activa en Timeline)

  const svgToWorld = (svgX, svgY) => {
    const centerX = 978;
    const centerY = 1100.5;
    const scale = 0.04;
    const worldX = (svgX - centerX) * scale;
    const worldZ = (svgY - centerY) * scale;
    return [worldX, 0, worldZ];
  };

  const planets = [
    // Sol en el centro - siempre fijo
    {
      id: 'sol',
      name: 'Sol',
      color: 0xFDB813,
      position: [0, 0, 0],
      mecatronPosition: [0, 0, 0],
      size: 2.5,
      auraColor: 0xFDB813,
      auraOpacity: 0.4
    },

    // ===== 6 PUNTAS DE LA ESTRELLA (PLANETAS PRINCIPALES) =====

    // PUNTA 1: Superior (cx="977.51" cy="260.14")
    {
      id: 'mundo',
      name: 'Mundo',
      color: 0x00CED1,
      position: [20, 0, 5],
      mecatronPosition: svgToWorld(977.51, 260.14),
      size: 1.0,
      modelPath: '/3DModels/Earth.glb',
      modelScale: 1.0,
      showInMenu: true,
      auraColor: 0x00CED1,
      auraOpacity: 0.3
    },

    // PUNTA 2: Inferior (cx="980.37" cy="1951.11")
    {
      id: 'historia',
      name: 'Historia',
      color: 0x00E5E5,
      position: [-22, 0, 18],
      mecatronPosition: svgToWorld(980.37, 1951.11),
      size: 1.2,
      showInMenu: true,
      auraColor: 0x00E5E5,
      auraOpacity: 0.3
    },

    // PUNTA 3: Derecha Superior (cx="1715" cy="688.69")
    {
      id: 'personajes',
      name: 'Personajes',
      color: 0x5DFDFD,
      position: [25, 0, -22],
      mecatronPosition: svgToWorld(1715, 688.69),
      size: 1.1,
      showInMenu: true,
      auraColor: 0x5DFDFD,
      auraOpacity: 0.3
    },

    // PUNTA 4: Derecha Inferior (cx="1715" cy="1533.56")
    {
      id: 'cronologia',
      name: 'Cronología',
      color: 0x20B2AA,
      position: [-18, 0, -25],
      mecatronPosition: svgToWorld(1715, 1533.56),
      size: 0.9,
      showInMenu: true,
      auraColor: 0x20B2AA,
      auraOpacity: 0.3
    },

    // PUNTA 5: Izquierda Superior (cx="244.13" cy="688.69")
    {
      id: 'vision',
      name: 'Visión',
      color: 0xFFFFFF,
      position: [28, 0, 20],
      mecatronPosition: svgToWorld(244.13, 688.69),
      size: 0.85,
      showInMenu: true,
      auraColor: 0xFFFFFF,
      auraOpacity: 0.3
    },

    // PUNTA 6: Izquierda Inferior (cx="244.13" cy="1533.56")
    {
      id: 'mercurio',
      name: 'Mercurio',
      color: 0x8C7853,
      position: [12, 0, 8],
      mecatronPosition: svgToWorld(244.13, 1533.56),
      size: 0.7,
      auraColor: 0x8C7853,
      auraOpacity: 0.25
    },

    // ===== CÍRCULOS INTERIORES (PLANETAS SECUNDARIOS) =====

    // Centro superior (cx="977.51" cy="688.69")
    {
      id: 'venus',
      name: 'Venus',
      color: 0xFFC649,
      position: [-15, 0, 12],
      mecatronPosition: svgToWorld(977.51, 688.69),
      size: 0.65,
      auraColor: 0xFFC649,
      auraOpacity: 0.3
    },

    // Centro (cx="980.37" cy="1109.44")
    {
      id: 'tierra',
      name: 'Tierra',
      color: 0x4169E1,
      position: [18, 0, -15],
      mecatronPosition: svgToWorld(980.37, 1109.44),
      size: 0.65,
      auraColor: 0x4169E1,
      auraOpacity: 0.3
    },

    // Inferior centro (cx="980.37" cy="1533.56")
    {
      id: 'marte',
      name: 'Marte',
      color: 0xCD5C5C,
      position: [-20, 0, -18],
      mecatronPosition: svgToWorld(980.37, 1533.56),
      size: 0.55,
      auraColor: 0xCD5C5C,
      auraOpacity: 0.3
    },

    // Inferior izquierdo (cx="608.46" cy="1320.24")
    {
      id: 'jupiter',
      name: 'Júpiter',
      color: 0xDAA520,
      position: [32, 0, 15],
      mecatronPosition: svgToWorld(608.46, 1320.24),
      size: 0.9,
      auraColor: 0xFFD700,
      auraOpacity: 0.35
    },

    // Inferior derecho (cx="1344.17" cy="1320.24")
    {
      id: 'saturno',
      name: 'Saturno',
      color: 0xFAD5A5,
      position: [-28, 0, 22],
      mecatronPosition: svgToWorld(1344.17, 1320.24),
      size: 0.85,
      auraColor: 0xFFE4B5,
      auraOpacity: 0.35
    },

    // Superior derecho (cx="1344.17" cy="896.85")
    {
      id: 'urano',
      name: 'Urano',
      color: 0x4FD0E7,
      position: [35, 0, -28],
      mecatronPosition: svgToWorld(1344.17, 896.85),
      size: 0.75,
      auraColor: 0x00FFFF,
      auraOpacity: 0.35
    },

    // Superior izquierdo (cx="608.46" cy="896.85")
    {
      id: 'neptuno',
      name: 'Neptuno',
      color: 0x4169E1,
      position: [-35, 0, -30],
      mecatronPosition: svgToWorld(608.46, 896.85),
      size: 0.75,
      auraColor: 0x1E90FF,
      auraOpacity: 0.35
    }
  ];

  // Helper function to navigate to a planet
  const navigateToPlanet = (planetData) => {
    if (isTransitioning) return;
    if (!cameraRef.current) return;
    if (activeSection === planetData.id) return;
    const isFromUniverseHome = !activeSection;
    const isTimeline = planetData.id === 'cronologia';

    if (panelPowerOnRevealTimeoutRef.current) {
      clearTimeout(panelPowerOnRevealTimeoutRef.current);
    }
    if (panelPowerOnDoneTimeoutRef.current) {
      clearTimeout(panelPowerOnDoneTimeoutRef.current);
    }
    setIsPanelPoweringOn(false);

    // Save current universe camera pose to restore it when returning from a section
    if (!activeSection && !cameraRotationRef.current.targetPlanet) {
      const currentPos = cameraRef.current.position;
      universeCameraSnapshotRef.current = {
        position: { x: currentPos.x, y: currentPos.y, z: currentPos.z },
        fov: cameraRef.current.fov,
        lookAt: { x: 0, y: 0, z: -10 },
        theta: cameraRotationRef.current.theta,
        phi: cameraRotationRef.current.phi
      };
    }

    // Cancel any ongoing animation
    if (navigationAnimationRef.current) {
      cancelAnimationFrame(navigationAnimationRef.current);
    }

    isDraggingRef.current = false;
    dragVelocityRef.current.theta = 0;
    dragVelocityRef.current.phi = 0;

    // Trigger TV-like panel collapse only when switching sections from within a section
    if (activeSection) {
      setIsPanelPoweringOff(true);
    }

    // Ocultar contenido INMEDIATAMENTE
    setShowContent(false);

    const performTransition = () => {
      setIsTransitioning(true);
      setPendingSection(planetData.id);

      if (isFromUniverseHome) {
        setTransitionFlyLogoDirection('forward');
        setTransitionFlyLogoKey((prev) => prev + 1);
        setShowTransitionFlyLogo(true);
      }

      // Special handling for Timeline - camera pulls back to panoramic view
      if (isTimeline) {
        const startX = cameraRef.current.position.x;
        const startY = cameraRef.current.position.y;
        const startZ = cameraRef.current.position.z;
        const startFov = cameraRef.current.fov;

        // Pull back to panoramic view position
        const endX = 0;
        const endY = 40;
        const endZ = 80;
        const endFov = 60;

        const duration = isFromUniverseHome ? LOGO_FLY_TRANSITION_MS : 2500;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          cameraRef.current.position.x = startX + (endX - startX) * easedProgress;
          cameraRef.current.position.y = startY + (endY - startY) * easedProgress;
          cameraRef.current.position.z = startZ + (endZ - startZ) * easedProgress;
          cameraRef.current.fov = startFov + (endFov - startFov) * easedProgress;
          cameraRef.current.updateProjectionMatrix();
          cameraRef.current.lookAt(0, 0, 0);

          if (progress < 1) {
            navigationAnimationRef.current = requestAnimationFrame(animate);
          } else {
            navigationAnimationRef.current = null;
            if (isFromUniverseHome) {
              setShowTransitionFlyLogo(false);
            }

            cameraRotationRef.current.targetPlanet = null;
            setActiveSection(planetData.id);
            setPendingSection(null);
            setIsTransitioning(false);
            setIsPanelPoweringOff(false);
            if (!isTimeline) {
              triggerPanelPowerOn();
            }
          }
        };

        navigationAnimationRef.current = requestAnimationFrame(animate);
        return;
      }

      const planetIndex = planets.findIndex((planet) => planet.id === planetData.id);
      const livePlanetRef = planetIndex >= 0 ? planetsRef.current?.[planetIndex] : null;
      const livePosition = livePlanetRef?.position;

      // Target planet coordinates
      const targetX = livePosition?.x ?? planetData.position[0];
      const targetY = livePosition?.y ?? planetData.position[1];
      const targetZ = livePosition?.z ?? planetData.position[2];

      cameraRotationRef.current.targetPlanet = {
        id: planetData.id,
        position: { x: targetX, y: targetY, z: targetZ },
        size: planetData.size
      };

      // Current camera position
      const startX = cameraRef.current.position.x;
      const startY = cameraRef.current.position.y;
      const startZ = cameraRef.current.position.z;
      const startFov = cameraRef.current.fov;

      // Target position: farther distance for orthographic-like view
      const endX = targetX + 5;
      const endY = targetY + 2.5;
      const endZ = targetZ + 5;
      const endFov = 25; // Narrow FOV for orthographic appearance

      // Build a smooth pre-rotation target from current camera forward vector
      const forwardDir = new THREE.Vector3();
      cameraRef.current.getWorldDirection(forwardDir);
      const forwardDistance = Math.max(
        20,
        Math.sqrt((targetX - startX) ** 2 + (targetY - startY) ** 2 + (targetZ - startZ) ** 2) * 0.55
      );
      const startLook = {
        x: startX + forwardDir.x * forwardDistance,
        y: startY + forwardDir.y * forwardDistance,
        z: startZ + forwardDir.z * forwardDistance
      };

      const rotationPhaseRatio = 0.28; // first phase: rotate toward destination before traveling

      const duration = isFromUniverseHome ? LOGO_FLY_TRANSITION_MS : 3500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let currentX = startX;
        let currentY = startY;
        let currentZ = startZ;
        let currentFov = startFov;
        let lookX = targetX;
        let lookY = targetY;
        let lookZ = targetZ;

        // Phase 1: rotate smoothly toward selected planet without moving yet
        if (progress < rotationPhaseRatio) {
          const rotateProgress = progress / rotationPhaseRatio;
          const easedRotate = 1 - Math.pow(1 - rotateProgress, 3);
          lookX = startLook.x + (targetX - startLook.x) * easedRotate;
          lookY = startLook.y + (targetY - startLook.y) * easedRotate;
          lookZ = startLook.z + (targetZ - startLook.z) * easedRotate;
        } else {
          // Phase 2: once oriented, start traveling toward the planet
          const travelProgress = (progress - rotationPhaseRatio) / (1 - rotationPhaseRatio);
          const easedTravel = travelProgress < 0.5
            ? 2 * travelProgress * travelProgress
            : 1 - Math.pow(-2 * travelProgress + 2, 2) / 2;

          currentX = startX + (endX - startX) * easedTravel;
          currentY = startY + (endY - startY) * easedTravel;
          currentZ = startZ + (endZ - startZ) * easedTravel;
          currentFov = startFov + (endFov - startFov) * easedTravel;
          lookX = targetX;
          lookY = targetY;
          lookZ = targetZ;
        }

        cameraRef.current.position.x = currentX;
        cameraRef.current.position.y = currentY;
        cameraRef.current.position.z = currentZ;
        cameraRef.current.fov = currentFov;
        cameraRef.current.updateProjectionMatrix();
        cameraRef.current.lookAt(lookX, lookY, lookZ);

        if (progress < 1) {
          navigationAnimationRef.current = requestAnimationFrame(animate);
        } else {
          navigationAnimationRef.current = null;
          if (isFromUniverseHome) {
            setShowTransitionFlyLogo(false);
          }
          // Final lookAt to ensure we're looking exactly at target
          cameraRef.current.lookAt(targetX, targetY, targetZ);
          cameraRef.current.fov = endFov;
          cameraRef.current.updateProjectionMatrix();

          setActiveSection(planetData.id);
          setPendingSection(null);
          setIsTransitioning(false);
          setIsPanelPoweringOff(false);

          // Store the final distance for rotation phase
          const finalDistance = Math.sqrt(
            (cameraRef.current.position.x - targetX) ** 2 +
            (cameraRef.current.position.y - targetY) ** 2 +
            (cameraRef.current.position.z - targetZ) ** 2
          );
          cameraRotationRef.current.cameraPlanetDistance = finalDistance;

          if (!isTimeline) {
            triggerPanelPowerOn();
          }

          // Update rotation
          cameraRotationRef.current.theta = 0;
          cameraRotationRef.current.phi = 0.3;
        }
      };

      navigationAnimationRef.current = requestAnimationFrame(animate);
    };

    // If user is leaving one panel to another, wait for TV-off collapse first
    if (activeSection) {
      if (panelPowerOffTimeoutRef.current) {
        clearTimeout(panelPowerOffTimeoutRef.current);
      }
      panelPowerOffTimeoutRef.current = setTimeout(() => {
        performTransition();
      }, PANEL_TV_OFF_MS);
      return;
    }

    // Execute transition immediately
    performTransition();
  };

  const handleTimelineAwarePlanetClick = (planetData) => {
    if (activeSection === 'cronologia' && planetData?.id !== 'cronologia') {
      return;
    }
    setSelectedTimelineChapter(null);
    navigateToPlanet(planetData);
  };

  const handleTimelineNumberNavigation = (chapterIndex) => {
    // Obtener el planeta asociado a este capítulo
    const mapEntry = timelineChapterToPlanetMap.find(m => m.chapter === chapterIndex);
    if (!mapEntry) return;

    const targetPlanet = planets.find(p => p.id === mapEntry.planetId);
    if (!targetPlanet) return;

    // Actualizar capítulo seleccionado
    setSelectedTimelineChapter(timeline[chapterIndex]);

    if (activeSection === 'cronologia') {
      // Buscar el índice del planeta en planetsRef
      const planetIndex = planets.findIndex((planet) => planet.id === targetPlanet.id);
      const livePlanetRef = planetIndex >= 0 ? planetsRef.current?.[planetIndex] : null;
      const livePosition = livePlanetRef?.position;

      const targetX = livePosition?.x ?? targetPlanet.position[0];
      const targetY = livePosition?.y ?? targetPlanet.position[1];
      const targetZ = livePosition?.z ?? targetPlanet.position[2];

      cameraRotationRef.current.targetPlanet = {
        id: targetPlanet.id,
        position: { x: targetX, y: targetY, z: targetZ },
        size: targetPlanet.size
      };
      cameraRotationRef.current.cameraPlanetDistance = Math.max(8, (targetPlanet.size || 1) * 5);
      cameraRotationRef.current.theta = 0;
      cameraRotationRef.current.phi = 0.2;
      userHasInteractedRef.current = true;
      return;
    }

    navigateToPlanet(targetPlanet);
  };

  // Mouse drag controls for orbiting
  const handleMouseDown = (event) => {
    userHasInteractedRef.current = true;
    isDraggingRef.current = false;
    previousMouseRef.current = { x: event.clientX, y: event.clientY };
    dragVelocityRef.current.theta = 0;
    dragVelocityRef.current.phi = 0;
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      isDraggingRef.current = true;

      const deltaX = event.clientX - previousMouseRef.current.x;
      const deltaY = event.clientY - previousMouseRef.current.y;

      previousMouseRef.current = { x: event.clientX, y: event.clientY };

      if (activeSection && cameraRotationRef.current.targetPlanet) {
        const thetaStep = -deltaX * 0.005;
        const phiStep = -deltaY * 0.005;
        cameraRotationRef.current.theta += thetaStep;
        cameraRotationRef.current.phi = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotationRef.current.phi + phiStep));

        dragVelocityRef.current.theta = dragVelocityRef.current.theta * 0.45 + thetaStep * 0.55;
        dragVelocityRef.current.phi = dragVelocityRef.current.phi * 0.45 + phiStep * 0.55;
      } else {
        const thetaStep = -deltaX * 0.003;
        const phiStep = -deltaY * 0.003;
        cameraRotationRef.current.theta += thetaStep;
        cameraRotationRef.current.phi = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotationRef.current.phi + phiStep));

        dragVelocityRef.current.theta = dragVelocityRef.current.theta * 0.45 + thetaStep * 0.55;
        dragVelocityRef.current.phi = dragVelocityRef.current.phi * 0.45 + phiStep * 0.55;
      }
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  // Zoom with mouse wheel
  const handleWheel = (event) => {
    if (!cameraRef.current) return;

    event.preventDefault();
    userHasInteractedRef.current = true;
    const zoomSpeed = 1.5;
    const delta = event.deltaY * zoomSpeed * 0.01;

    // Limit zoom range
    const newZ = cameraRef.current.position.z + delta;
    const minZ = 10;
    const maxZ = 200; if (newZ >= minZ && newZ <= maxZ) {
      cameraRef.current.position.z = newZ;
    }
  };

  // Cleanup effect for event listeners
  React.useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeSection, handleMouseMove]);

  React.useEffect(() => {
    if (!showIntro || !language) return;

    let fadeTimer;
    let phaseTimer;
    let autoContinueTimer;

    if (introPhase === 1) {
      fadeTimer = setTimeout(() => {
        setFadeOutPhase1(true);
      }, 4500);

      phaseTimer = setTimeout(() => {
        setIntroPhase(2);
        setFadeOutPhase1(false);
      }, 5500);
    }

    if (introPhase === 2) {
      fadeTimer = setTimeout(() => {
        setFadeOutPhase2(true);
      }, 4500);

      phaseTimer = setTimeout(() => {
        setIntroPhase(3);
        setFadeOutPhase2(false);
      }, 5500);
    }

    if (introPhase === 3) {
      autoContinueTimer = setTimeout(() => {
        startMainExperience();
      }, 12000);
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(phaseTimer);
      clearTimeout(autoContinueTimer);
    };
  }, [introPhase, showIntro, language, startMainExperience]);

  React.useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      setIsWebGLAvailable(Boolean(gl));
    } catch {
      setIsWebGLAvailable(false);
    }
  }, []);

  const handleBackToUniverse = () => {
    if (panelPowerOnRevealTimeoutRef.current) {
      clearTimeout(panelPowerOnRevealTimeoutRef.current);
    }
    if (panelPowerOnDoneTimeoutRef.current) {
      clearTimeout(panelPowerOnDoneTimeoutRef.current);
    }
    setIsPanelPoweringOn(false);

    const startBackTransition = () => {
      setIsTransitioning(true);
      if (!cameraRef.current) return;

      setTransitionFlyLogoDirection('reverse');
      setTransitionFlyLogoKey((prev) => prev + 1);
      setShowTransitionFlyLogo(true);

      // Calculate zoom-out target: move camera away from current position maintaining direction
      const rotation = cameraRotationRef.current;
      const targetPlanet = rotation?.targetPlanet;

      let targetPos;
      let targetLookAt = { x: 0, y: 0, z: 0 }; // Always look at center of solar system

      if (targetPlanet) {
        const planetIndex = planets.findIndex((planet) => planet.id === targetPlanet.id);
        const livePlanetRef = planetIndex >= 0 ? planetsRef.current?.[planetIndex] : null;
        const livePos = livePlanetRef?.position || targetPlanet.position;
        const radius = rotation.cameraPlanetDistance || (targetPlanet.size * 3);
        const theta = rotation.theta ?? 0;
        const phi = rotation.phi ?? 0;

        // Current position around planet
        const currentPos = {
          x: livePos.x + radius * Math.sin(theta) * Math.cos(phi),
          y: livePos.y + radius * Math.sin(phi),
          z: livePos.z + radius * Math.cos(theta) * Math.cos(phi)
        };

        cameraRef.current.position.set(currentPos.x, currentPos.y, currentPos.z);

        // Calculate zoom-out direction from planet to current camera, then extend it
        const dirX = currentPos.x - livePos.x;
        const dirY = currentPos.y - livePos.y;
        const dirZ = currentPos.z - livePos.z;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

        // Zoom out to a comfortable overview distance
        const zoomOutDistance = 80;
        targetPos = {
          x: livePos.x + (dirX / dirLength) * zoomOutDistance,
          y: livePos.y + (dirY / dirLength) * zoomOutDistance,
          z: livePos.z + (dirZ / dirLength) * zoomOutDistance
        };
      } else {
        // Fallback: zoom out from current position
        const currentPos = cameraRef.current.position;
        const distFromCenter = Math.sqrt(currentPos.x * currentPos.x + currentPos.y * currentPos.y + currentPos.z * currentPos.z);
        const targetDistance = 80;
        const scale = targetDistance / distFromCenter;

        targetPos = {
          x: currentPos.x * scale,
          y: currentPos.y * scale,
          z: currentPos.z * scale
        };
      }

      const start = Date.now();
      const from = {
        x: cameraRef.current.position.x,
        y: cameraRef.current.position.y,
        z: cameraRef.current.position.z
      };
      const fromFov = cameraRef.current.fov;
      const toFov = 75;

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / LOGO_FLY_TRANSITION_MS, 1);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        cameraRef.current.position.x = from.x + (targetPos.x - from.x) * eased;
        cameraRef.current.position.y = from.y + (targetPos.y - from.y) * eased;
        cameraRef.current.position.z = from.z + (targetPos.z - from.z) * eased;
        cameraRef.current.fov = fromFov + (toFov - fromFov) * eased;
        cameraRef.current.updateProjectionMatrix();
        cameraRef.current.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setSelectedTimelineChapter(null);
          setActiveSection(null);
          setIsTransitioning(false);
          setIsPanelPoweringOff(false);

          // Calculate and store new rotation angles based on final camera position
          const finalPos = cameraRef.current.position;
          const distanceFromCenter = Math.sqrt(finalPos.x * finalPos.x + finalPos.z * finalPos.z);
          const newTheta = Math.atan2(finalPos.x, finalPos.z);
          const newPhi = Math.atan2(finalPos.y, distanceFromCenter);

          cameraRotationRef.current = {
            phi: newPhi,
            theta: newTheta,
            targetPlanet: null,
            cameraPlanetDistance: 5
          };
          userHasInteractedRef.current = false;

          // Keep transition logo visible briefly to avoid abrupt disappearance
          setTimeout(() => {
            setShowTransitionFlyLogo(false);
          }, 100);
        }
      };
      animate();
    };

    setIsPanelPoweringOff(true);
    setShowContent(false);

    if (panelPowerOffTimeoutRef.current) {
      clearTimeout(panelPowerOffTimeoutRef.current);
    }
    panelPowerOffTimeoutRef.current = setTimeout(() => {
      startBackTransition();
    }, PANEL_TV_OFF_MS);
  };

  React.useEffect(() => {
    return () => {
      if (panelPowerOffTimeoutRef.current) {
        clearTimeout(panelPowerOffTimeoutRef.current);
      }
      if (panelPowerOnRevealTimeoutRef.current) {
        clearTimeout(panelPowerOnRevealTimeoutRef.current);
      }
      if (panelPowerOnDoneTimeoutRef.current) {
        clearTimeout(panelPowerOnDoneTimeoutRef.current);
      }
    };
  }, []);

  const shouldShowTimelineNavigator =
    !showIntro && showContent && activeSection === 'cronologia';

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* White Overlay for Transition - FIRST ELEMENT FOR HIGHEST VISUAL PRIORITY */}
      {showWhiteOverlay && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none bg-white"
          style={{
            opacity: whiteOverlayOpacity
          }}
        />
      )}

      {/* Intro Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          {!language && (
            <div className="text-center px-6">
              <h2 className="text-cyan-300 text-xl md:text-3xl uppercase tracking-[0.2em] mb-8">{t('chooseLanguage')}</h2>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setLanguage('en')}
                  className="px-6 py-3 border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition-colors uppercase tracking-wider"
                >
                  {t('english')}
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className="px-6 py-3 border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition-colors uppercase tracking-wider"
                >
                  {t('spanish')}
                </button>
              </div>
            </div>
          )}

          {/* Phase 1: Xlerion Logo Only */}
          {language && introPhase === 1 && (
            <div className={`text-center transition-opacity duration-1000 ${fadeOutPhase1 ? 'opacity-0' : 'opacity-100'}`}>
              {/* Dual-layer logo with glow */}
              <div className="relative inline-block">
                <img
                  src="/xlerionGameLogo.svg?v=20260308a"
                  alt="Xlerion"
                  className="h-48 md:h-64 object-contain mx-auto opacity-0 animate-intro-fade-in relative z-10"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'intro-fade-in') {
                      setTimeout(() => {
                        setFadeOutPhase1(true);
                        setTimeout(() => {
                          setIntroPhase(2);
                          setFadeOutPhase1(false);
                        }, 1000);
                      }, 4000);
                    }
                  }}
                />
                {/* Glow layer */}
                <div className="absolute inset-0 animate-logo-glow-opacity"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(0, 229, 229, 0.8)) drop-shadow(0 0 40px rgba(93, 253, 253, 0.5))',
                    opacity: 0,
                    animationDelay: '2s'
                  }}>
                  <img
                    src="/xlerionGameLogo.svg?v=20260308a"
                    alt=""
                    className="h-48 md:h-64 object-contain mx-auto"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: PRESENTA Text */}
          {language && introPhase === 2 && (
            <div className={`text-center transition-opacity duration-1000 ${fadeOutPhase2 ? 'opacity-0' : 'opacity-100'}`}>
              <h1 className="text-cyan-400 text-2xl md:text-3xl uppercase tracking-[0.5em] font-bold"
                style={{
                  opacity: 0,
                  animation: 'presents-glow-fade 6s ease-in-out forwards'
                }}
                onAnimationEnd={(e) => {
                  if (e.animationName === 'presents-glow-fade') {
                    setIntroPhase(3);
                  }
                }}>
                {t('presents')}
              </h1>
            </div>
          )}

          {/* Phase 3: Total Darkness + Text + Button */}
          {language && introPhase === 3 && (
            <div className="text-center">
              {/* Total Darkness Logo with dual-layer glow */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <img
                    src="/logo-total-darkness.svg?v=20260308c"
                    alt="Total Darkness"
                    className="h-48 md:h-64 object-contain mx-auto opacity-0 animate-intro-fade-in relative z-10"
                    style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                  />
                  {/* Glow layer */}
                  <div className="absolute inset-0 animate-logo-glow-opacity"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(0, 229, 229, 0.8)) drop-shadow(0 0 40px rgba(93, 253, 253, 0.5))',
                      opacity: 0,
                      animationDelay: '1.8s'
                    }}>
                    <img
                      src="/logo-total-darkness.svg?v=20260308c"
                      alt=""
                      className="h-48 md:h-64 object-contain mx-auto"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Typewriter Text */}
              <div className="overflow-hidden">
                <p className="text-cyan-400 text-xl md:text-2xl uppercase tracking-[0.3em] opacity-0 animate-intro-fade-in"
                  style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                  {t('storyOfXlerion')}
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={startMainExperience}
                className={`mt-12 text-sm uppercase tracking-wider transition-colors ${showWhiteOverlay ? 'opacity-0 text-zinc-500' : 'opacity-0 animate-intro-fade-in text-zinc-500 hover:text-cyan-400'
                  }`}
                style={{
                  animationDelay: '2.5s',
                  animationFillMode: 'forwards',
                  pointerEvents: showWhiteOverlay ? 'none' : 'auto'
                }}
                disabled={showWhiteOverlay}>
                {t('pressToContinue')}
              </button>
            </div>
          )}
        </div>
      )
      }

      {/* 3D Universe Canvas */}
      {
        isWebGLAvailable ? (
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 4000 }}
            gl={{ antialias: true, alpha: true }}
            style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
            className="cursor-grab active:cursor-grabbing"
          >
            <UniverseScene
              planets={planets}
              onPlanetClick={handleTimelineAwarePlanetClick}
              planetsRef={planetsRef}
              cameraRef={cameraRef}
              isDragging={isDraggingRef}
              dragVelocityRef={dragVelocityRef}
              cameraRotation={cameraRotationRef}
              userHasInteracted={userHasInteractedRef}
              isTransitioning={isTransitioning}
              starfieldOpacity={starfieldOpacity}
              planetsOpacity={planetsOpacity}
              startCameraFly={startCameraFly}
              onFlyProgress={setCameraFlyProgress}
              activeSection={activeSection}
              timeline={timeline}
              timelineZoom={timelineZoom}
              onTimelineConstellationReady={handleTimelineConstellationReady}
            />
          </Canvas>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-black px-6 text-center z-0">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-cyan-300 mb-4">Total Darkness</h1>
              <p className="text-zinc-300 mb-2">{t('webglUnsupported')}</p>
              <p className="text-zinc-400">{t('webglFallback')}</p>
            </div>
          </div>
        )
      }

      {/* Star Particles - appears when intro ends */}
      {
        !showIntro && (
          <StarParticles isVisible={true} animationDelay="0s" />
        )
      }

      {/* Universe entry blur effect */}
      {
        !showIntro && !activeSection && universeEntryBlur > 0.05 && (
          <div
            className="fixed inset-0 pointer-events-none z-[9]"
            style={{
              backdropFilter: `blur(${universeEntryBlur.toFixed(2)}px)`,
              WebkitBackdropFilter: `blur(${universeEntryBlur.toFixed(2)}px)`,
              backgroundColor: `rgba(0, 0, 0, ${(universeEntryBlur / 10) * 0.08})`
            }}
          />
        )
      }

      {/* Camera Fly Fade Overlay */}
      {
        startCameraFly && cameraFlyProgress > 0 && cameraFlyProgress < 1 && (
          <div
            className="fixed inset-0 pointer-events-none z-20"
            style={{
              background: `radial-gradient(circle, transparent ${60 + Math.sin(cameraFlyProgress * Math.PI * 6) * 20}%, rgba(0,0,0,${0.3 + Math.abs(Math.sin(cameraFlyProgress * Math.PI * 6)) * 0.4}) 100%)`,
              transition: 'background 0.3s ease-out'
            }}
          />
        )
      }

      {/* Logo fly-through transition (home -> selected section) */}
      {
        showTransitionFlyLogo && (
          <div className="fixed inset-0 z-[45] pointer-events-none flex flex-col items-center justify-center select-none">
            <div
              key={transitionFlyLogoKey}
              className="relative inline-block"
              style={{
                animationName: 'logo-fly-through',
                animationDuration: `${LOGO_FLY_TRANSITION_MS}ms`,
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
                animationDirection: transitionFlyLogoDirection === 'reverse' ? 'reverse' : 'normal',
                transformOrigin: 'center center'
              }}
              onAnimationEnd={() => {
                // Animation end handler - logo visibility controlled by state transition
              }}
            >
              <img
                src="/logo-total-darkness.svg?v=20260308c"
                alt=""
                aria-hidden="true"
                className="h-40 md:h-56 object-contain mx-auto select-none relative z-10"
                draggable="false"
              />
              <div
                className="absolute inset-0"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(0, 229, 229, 0.8)) drop-shadow(0 0 40px rgba(93, 253, 253, 0.5))',
                  opacity: 0.9
                }}
              >
                <img
                  src="/logo-total-darkness.svg?v=20260308c"
                  alt=""
                  className="h-40 md:h-56 object-contain mx-auto select-none"
                  draggable="false"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        )
      }

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        {!activeSection && !showIntro && !isTransitioning && !pendingSection && !showTransitionFlyLogo && (
          <div className={`fixed inset-0 flex flex-col items-center justify-center select-none transition-opacity duration-1000 ${showMainContent ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className="relative pointer-events-auto">
              <p className={`absolute left-2 top-1 md:-top-6 text-xs uppercase tracking-[0.3em] text-cyan-400 animate-pulse whitespace-nowrap transition-opacity duration-1000 ${showMainLogo ? 'opacity-100' : 'opacity-0'
                }`}>
                {t('storyOfXlerion')}
              </p>
              <div className={`relative inline-block transition-all duration-1000 ${showMainLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                <img
                  src="/logo-total-darkness.svg?v=20260308c"
                  alt="Total Darkness"
                  className="h-40 md:h-56 object-contain mx-auto select-none relative z-10"
                  draggable="false"
                />
                <div className="absolute inset-0 animate-logo-glow-opacity"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(0, 229, 229, 0.8)) drop-shadow(0 0 40px rgba(93, 253, 253, 0.5))',
                    opacity: 0
                  }}>
                  <img
                    src="/logo-total-darkness.svg?v=20260308c"
                    alt=""
                    className="h-40 md:h-56 object-contain mx-auto select-none"
                    draggable="false"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planet Navigation Menu - Always visible (moved outside UI Overlay conditional) */}
        {!showIntro && (
          <div className={`fixed left-1/2 -translate-x-1/2 pointer-events-auto transition-opacity duration-1000 z-40 w-[calc(100%-16px)] md:w-auto bottom-[max(6px,env(safe-area-inset-bottom))] md:bottom-8 ${showMainContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
            {!activeSection && (
              <>
                <p className="text-zinc-400 max-w-2xl mx-auto px-3 md:px-6 text-center mb-1 md:mb-2 text-xs md:text-base">
                  {t('copyrightNotice')}
                </p>
                <p className="text-zinc-500 text-[11px] md:text-sm text-center mb-2 md:mb-3">
                  {t('dragToRotate')}
                </p>
              </>
            )}
            <div className="flex gap-1.5 md:gap-4 justify-start md:justify-center items-center whitespace-nowrap px-2 py-1 rounded-xl bg-black/45 backdrop-blur-md overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
              {planets.filter(p => p.showInMenu).map((planet) => (
                <button
                  key={planet.id}
                  onClick={() => {
                    setSelectedTimelineChapter(null);
                    navigateToPlanet(planet);
                  }}
                  className="flex-shrink-0 snap-start px-2.5 md:px-4 py-1.5 md:py-2 text-[11px] md:text-sm uppercase tracking-[0.08em] md:tracking-wider transition-all hover:scale-105 font-alpha whitespace-nowrap"
                  style={{
                    color: `#${planet.color.toString(16).padStart(6, '0')}`
                  }}
                >
                  {getSectionLabel(planet)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Panels - World/History/Vision/Personajes. Para cronologia, usar TimelineSectionPage */}
        {activeSection === 'cronologia' && showContent && (
          <div className={`fixed inset-0 overflow-y-auto pointer-events-auto origin-center transition-all ease-in duration-300 opacity-100 ${isPanelPoweringOff || (isPanelPoweringOn && !showContent) ? 'scale-y-0' : 'scale-y-100'
            }`}>
            <div className="min-h-screen pb-20 md:pb-0 backdrop-blur-md bg-black/80">
              {/* Solo un logo, no duplicado */}
              <div className="h-[80px] flex items-start px-8 pt-[15px]">
                <button
                  onClick={handleBackToUniverse}
                  disabled={isTransitioning}
                  className="relative z-[60] pointer-events-auto cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                  aria-label="Volver al inicio"
                  title="Volver al inicio"
                >
                  <img
                    src="/logo-total-darkness.svg?v=20260308c"
                    alt="Total Darkness"
                    className="h-[68px] w-auto object-contain drop-shadow-lg relative z-10 pointer-events-none"
                  />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-80px)]">
                <TimelineSectionPage />
              </div>
            </div>
          </div>
        )}
        {activeSection && activeSection !== 'cronologia' && pendingSection !== 'cronologia' && (
          <div
            className={`fixed inset-0 overflow-y-auto pointer-events-auto origin-center transition-all ease-in duration-300 ${showContent ? 'opacity-100' : 'opacity-0'
              } ${isPanelPoweringOff || (isPanelPoweringOn && !showContent) ? 'scale-y-0' : 'scale-y-100'
              }`}
          >
            <div className="min-h-screen pb-20 md:pb-0 backdrop-blur-md bg-black/80">
              <div className="h-[80px] flex items-start px-8 pt-[15px]">
                <button
                  onClick={handleBackToUniverse}
                  disabled={isTransitioning}
                  className="relative z-[60] pointer-events-auto cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                  aria-label="Volver al inicio"
                  title="Volver al inicio"
                >
                  <img
                    src="/logo-total-darkness.svg?v=20260308c"
                    alt="Total Darkness"
                    className="h-[68px] w-auto object-contain drop-shadow-lg relative z-10 pointer-events-none"
                  />
                </button>
              </div>

              {selectedTimelineChapter && (
                <div className="px-8 pb-2">
                  <p className="text-cyan-300 text-sm md:text-base uppercase tracking-[0.12em]">
                    {selectedTimelineChapter}
                  </p>
                </div>
              )}

              {/* 3 Column Layout: Logo | Content | Empty */}
              <div className="grid h-[calc(100%-80px)] grid-cols-1 lg:grid-cols-[220px_1fr_220px] xl:grid-cols-[280px_1fr_280px] gap-0">
                {/* Left Column */}
                <div className="hidden lg:flex pr-2 justify-end" />

                {/* Center Column - Content */}
                <div className="overflow-y-auto h-full flex items-stretch justify-start pt-[50px]">
                  {activeSection === 'historia' && (
                    <SectionStructurePage
                      title="Historia"
                      subtitle="Archivo narrativo"
                      centerImage="/assets/parallax/documentacion-parallax.jpg"
                      leftImage="/assets/parallax/universback.jpg"
                      rightImage="/assets/parallax/universe360.png"
                      tabsPlacement="left-panel"
                      tabsButtonPadding="8px 16px"
                      centerPanelVariant="narrative-dense"
                      centerPanelMinHeight={500}
                      centerPanelMaxHeight="calc(100vh - 180px)"
                      centerPanelPadding={18}
                      centerImageHeight={180}
                      tabs={[
                        {
                          title: 'Premisa',
                          label: 'Premisa',
                          paragraphs: [
                            'Total Darkness presenta una epopeya de ciencia ficción oscura donde la memoria del universo se fragmenta y la verdad se vuelve un campo de batalla.',
                            'La propuesta narrativa parte de una premisa clara: cuanto más poder obtiene la humanidad, más cerca está de repetir la caída original.',
                            'En lugar de separar mito y tecnología, la saga los fusiona como dos lenguajes del mismo trauma colectivo: uno recuerda el origen, el otro acelera la destrucción.'
                          ],
                          metaChips: ['setup', 'misterio cosmológico', 'tono trágico'],
                          beatPoints: [
                            'Se detectan anomalías en archivos ancestrales y redes de vigilancia orbital.',
                            'La investigación revela una verdad prohibida sobre el pacto fundador de Dilmun.',
                            'La humanidad entiende que su ascenso tecnológico podría ser el gatillo de su segunda caída.'
                          ],
                          quote: 'No luchamos por conquistar el futuro; luchamos por merecer memoria en él.',
                          centerImage: '/assets/parallax/documentacion-parallax.jpg',
                          leftImage: '/assets/parallax/universback.jpg',
                          rightImage: '/assets/parallax/cronograma-progreso-parallax.jpg'
                        },
                        {
                          title: 'Mundo y reglas',
                          label: 'Mundo',
                          paragraphs: [
                            'El universo combina ruinas sumerias, tecnología prohibida y territorios deformados por energía cosmológica.',
                            'Sus reglas dramáticas se sostienen en tres ejes: pacto ancestral, libre albedrío y costo espiritual de cada decisión.',
                            'Las zonas vivas del mapa reaccionan a decisiones morales: el entorno no es decorado, es un juez silencioso que registra cada elección.'
                          ],
                          metaChips: ['worldbuilding', 'leyes del mundo', 'riesgo sistémico'],
                          beatPoints: [
                            'La energía cosmológica altera geografía, clima y percepción temporal en regiones críticas.',
                            'Los rituales antiguos funcionan como protocolos de control, no como magia arbitraria.',
                            'Toda ventaja de poder conlleva deuda ética y erosión de identidad.'
                          ],
                          quote: 'Cada regla del mundo fue escrita con sangre, y cada excepción exige otro sacrificio.',
                          centerImage: '/assets/parallax/proyectos-parallax.jpg',
                          leftImage: '/assets/parallax/documentacion-recursos-parallax.jpg',
                          rightImage: '/assets/parallax/Oficina0013.jpg'
                        },
                        {
                          title: 'Personajes y facciones',
                          label: 'Facciones',
                          paragraphs: [
                            'Héroes caídos, entidades antiguas y órdenes tecnocráticas compiten por definir qué significa “salvar” la realidad.',
                            'Cada facción encarna una visión moral distinta, y su choque impulsa alianzas frágiles, traiciones y arcos personales complejos.',
                            'Los protagonistas no solo combaten enemigos externos: disputan su propia identidad frente a memorias implantadas, linajes rotos y promesas imposibles de cumplir.'
                          ],
                          metaChips: ['arcos de personaje', 'facciones', 'choque ideológico'],
                          beatPoints: [
                            'Una alianza táctica surge para frenar una amenaza mayor, pese a agendas incompatibles.',
                            'La traición de un actor clave redefine el mapa político y emocional.',
                            'El grupo central se fractura cuando el precio de la victoria exige una pérdida íntima.'
                          ],
                          quote: 'En Total Darkness, nadie es puro: todos son la suma de lo que juraron y lo que traicionaron.',
                          centerImage: '/assets/parallax/fundador-parallax.jpg',
                          leftImage: '/assets/parallax/proyectos-parallax.jpg',
                          rightImage: '/assets/parallax/servicios-productos-parallax.jpg'
                        },
                        {
                          title: 'Conflicto y apuestas',
                          label: 'Conflicto',
                          paragraphs: [
                            'La caída de Dilmun y el gran diluvio rompen el equilibrio: ahora la guerra no es por territorio, sino por el control del destino humano.',
                            'Las apuestas escalan desde la supervivencia de ciudades hasta la posible extinción de la memoria colectiva del universo.',
                            'La narrativa evita el “bien contra mal” plano: cada bando protege algo legítimo y destruye algo irremplazable al mismo tiempo.'
                          ],
                          metaChips: ['stakes', 'guerra de destino', 'ambigüedad moral'],
                          beatPoints: [
                            'El conflicto local se transforma en crisis civilizatoria cuando caen los nodos de memoria.',
                            'La guerra se expande a planos simbólicos y tecnológicos, colapsando fronteras tradicionales.',
                            'Las decisiones estratégicas comienzan a borrar historia, no solo vidas.'
                          ],
                          quote: 'Perder una ciudad duele; perder la memoria de por qué existía, condena.',
                          centerImage: '/assets/parallax/soluciones-parallax.jpg',
                          leftImage: '/assets/parallax/documentacion-recursos-parallax.jpg',
                          rightImage: '/assets/parallax/universe360.png'
                        },
                        {
                          title: 'Progresión narrativa',
                          label: 'Progresión',
                          paragraphs: [
                            'La historia avanza en ritmo de tres actos: inicio del quiebre, confrontación con múltiples crisis y punto de no retorno.',
                            'Cada etapa abre nuevas preguntas, eleva el costo emocional de los personajes y prepara el terreno para la confrontación final.',
                            'La estructura combina progresión lineal con capas de revelación: lo que parecía contexto se vuelve detonador, y lo que parecía victoria se revela como deuda.'
                          ],
                          metaChips: ['estructura en actos', 'escalada', 'revelaciones'],
                          beatPoints: [
                            'Acto I: detonación del quiebre y establecimiento del objetivo narrativo.',
                            'Acto II: acumulación de crisis, pérdidas tácticas y cambio de paradigma.',
                            'Acto III: convergencia de líneas narrativas en una decisión irreversible.'
                          ],
                          quote: 'Aquí no hay relleno: cada capítulo adelanta conflicto, identidad o precio.',
                          centerImage: '/assets/parallax/documentacion-parallax.jpg',
                          leftImage: '/assets/parallax/universback.jpg',
                          rightImage: '/assets/parallax/cronograma-progreso-parallax.jpg'
                        },
                        {
                          title: 'Clímax y legado',
                          label: 'Clímax',
                          paragraphs: [
                            'El clímax enfrenta humanidad y corrupción cósmica en una decisión irreversible donde ganar también implica perder algo esencial.',
                            'El cierre deja un nuevo orden frágil: hay resolución del conflicto central, pero también semillas narrativas para futuras expansiones.',
                            'El legado no se mide por quién sobrevive, sino por qué verdad logra conservarse cuando todo el sistema exige olvidar.'
                          ],
                          metaChips: ['clímax', 'resolución', 'legado transmedia'],
                          beatPoints: [
                            'Confrontación final entre doctrina de control absoluto y defensa del libre albedrío.',
                            'Sacrificio mayor que redefine la identidad de los sobrevivientes.',
                            'Nuevo statu quo inestable, con rutas abiertas para secuelas y expansión del lore.'
                          ],
                          quote: 'La oscuridad total no es ausencia de luz: es ausencia de memoria.',
                          centerImage: '/assets/parallax/soluciones-parallax.jpg',
                          leftImage: '/assets/parallax/fundador-parallax.jpg',
                          rightImage: '/assets/parallax/servicios-productos-parallax.jpg'
                        }
                      ]}
                    />
                  )}

                  {activeSection === 'personajes' && <PersonajesPage />}

                  {activeSection === 'mundo' && <MundoPage />}

                  {activeSection === 'vision' && (
                    <SectionStructurePage
                      title="Presentación"
                      subtitle="Estructura final"
                      centerImage="/assets/parallax/filosofia-parallax.jpg"
                      leftImage="/assets/parallax/XHunterPoster.png"
                      rightImage="/assets/parallax/XHunterPoster0040.png"
                      accentColor="#ff1e3c"
                      centerPanelVariant="narrative-dense"
                      tabsPlacement="left-panel"
                      tabsButtonPadding="8px 14px"
                      tabs={[
                        {
                          title: 'Hook del juego',
                          label: 'Hook',
                          paragraphs: [
                            'Total Darkness es una epopeya de ciencia ficción oscura donde la memoria del universo se convierte en un campo de guerra.',
                            'La fantasía del jugador es clara: explorar, decidir y sobrevivir a un conflicto donde cada avance tecnológico tiene costo moral.',
                            'Nuestro diferencial: mitología sumeria + distopía futurista + narrativa de alto riesgo con identidad estética propia.'
                          ],
                          metaChips: ['elevator pitch', 'fantasía del jugador', 'usp'],
                          beatPoints: [
                            'Premisa inmediata en menos de 10 segundos.',
                            'Propuesta de valor comprensible para jugador y publisher.',
                            'Identidad temática y visual consistente en toda la experiencia.'
                          ],
                          quote: 'No es solo lore: es una promesa jugable con una tesis narrativa clara.',
                          centerImage: '/assets/parallax/filosofia-parallax.jpg',
                          leftImage: '/assets/parallax/XHunterPoster.png',
                          rightImage: '/assets/parallax/universe360.png'
                        },
                        {
                          title: 'Gameplay y loop',
                          label: 'Gameplay',
                          paragraphs: [
                            'Core loop propuesto: explorar zonas de alto riesgo, recolectar información/recursos, tomar decisiones de impacto y ejecutar confrontaciones estratégicas.',
                            'Cada capítulo combina progresión narrativa con objetivos jugables medibles, evitando que la historia quede desconectada del control del jugador.',
                            'La presentación prioriza claridad de gameplay para facilitar evaluación comercial y comprensión de la propuesta.'
                          ],
                          metaChips: ['core loop', 'claridad jugable', 'retención'],
                          beatPoints: [
                            'Exploración con riesgo sistémico y descubrimiento de datos clave.',
                            'Decisiones con consecuencias en facciones, recursos y narrativa.',
                            'Confrontaciones y resolución de objetivos por capítulo.'
                          ],
                          quote: 'El jugador no solo observa el universo: lo modifica con cada decisión.',
                          centerImage: '/assets/parallax/soluciones-parallax.jpg',
                          leftImage: '/assets/parallax/proyectos-parallax.jpg',
                          rightImage: '/assets/parallax/servicios-productos-parallax.jpg'
                        },
                        {
                          title: 'Features clave',
                          label: 'Features',
                          paragraphs: [
                            'Narrativa ramificada por actos y capítulos con enfoque cinematográfico.',
                            'Dirección de arte holográfica y estética dark sci-fi de alto contraste.',
                            'Navegación inmersiva del universo 3D con transición contextual por secciones.',
                            'Arquitectura escalable para integrar demo, press assets y bloques comerciales sin rehacer UX base.'
                          ],
                          metaChips: ['feature set', 'ux inmersiva', 'escalabilidad'],
                          beatPoints: [
                            'Sistema de capítulos navegables para progresión narrativa.',
                            'Diseño responsive para consumo en móvil y desktop.',
                            'Base preparada para integración de CTA comerciales.'
                          ],
                          quote: 'Cada feature existe para sostener la fantasía central, no para inflar la lista.',
                          centerImage: '/assets/parallax/documentacion-recursos-parallax.jpg',
                          leftImage: '/assets/parallax/Oficina0010.jpg',
                          rightImage: '/assets/parallax/Oficina0013.jpg'
                        },
                        {
                          title: 'Estado del proyecto',
                          label: 'Estado',
                          paragraphs: [
                            'Estado actual: vertical slice de presentación narrativa interactiva con navegación de secciones, cronología y diseño responsive.',
                            'Siguiente fase: consolidar demo jugable con objetivos cerrados de capítulo y métricas de validación.',
                            'Roadmap inmediato: gameplay loop demostrable, polish visual, material de publicación y validación con audiencia temprana.'
                          ],
                          metaChips: ['production status', 'roadmap', 'milestones'],
                          beatPoints: [
                            'Fase 1: presentación interactiva consolidada.',
                            'Fase 2: demo jugable y pruebas controladas.',
                            'Fase 3: distribución, wishlists y prensa especializada.'
                          ],
                          quote: 'La visión ya está encendida; ahora toca convertirla en tracción medible.',
                          centerImage: '/assets/parallax/documentacion-parallax.jpg',
                          leftImage: '/assets/parallax/Oficina0010.jpg',
                          rightImage: '/assets/parallax/Oficina0013.jpg'
                        },
                        {
                          title: 'Plataformas y modelo',
                          label: 'Mercado',
                          paragraphs: [
                            'Plataforma principal objetivo: PC (Steam) como primer mercado para comunidad, validación y escalado.',
                            'Estrategia comercial: lanzamiento por etapas (teaser → wishlist → demo → release) con comunicación narrativa consistente.',
                            'Modelo de negocio inicial: premium con potencial de expansión transmedia y contenido adicional por temporadas narrativas.'
                          ],
                          metaChips: ['pc-first', 'go-to-market', 'modelo premium'],
                          beatPoints: [
                            'Construcción de wishlist como KPI temprano.',
                            'Conversión de comunidad desde contenido narrativo y visual.',
                            'Escalado posterior a nuevas plataformas según tracción.'
                          ],
                          quote: 'No buscamos solo lanzar: buscamos entrar al mercado con posición clara.',
                          centerImage: '/assets/parallax/proyectos-parallax.jpg',
                          leftImage: '/assets/parallax/universback.jpg',
                          rightImage: '/assets/parallax/cronograma-progreso-parallax.jpg'
                        },
                        {
                          title: 'Press kit y CTA',
                          label: 'Press / CTA',
                          paragraphs: [
                            'Entregables recomendados: factsheet, logos oficiales, screenshots en alta, trailer gameplay y contacto directo de prensa.',
                            'CTA principal para jugadores: Wishlist y seguimiento de novedades.',
                            'CTA para negocio/prensa: solicitud de demo, revisión de deck y contacto editorial.'
                          ],
                          metaChips: ['press kit', 'wishlist', 'business contact'],
                          beatPoints: [
                            'Preparar carpeta pública de assets verificables.',
                            'Publicar mensaje comercial unificado para web y tienda.',
                            'Habilitar ruta de contacto rápida para medios y publishers.'
                          ],
                          quote: 'Sin CTA y sin kit de prensa, el interés se pierde antes de convertirse en oportunidad.',
                          ctaButtons: [
                            {
                              label: 'Wishlist en Steam',
                              icon: 'star',
                              href: 'https://store.steampowered.com',
                              primary: true
                            },
                            {
                              label: 'Press Kit',
                              icon: 'box',
                              href: 'mailto:press@totaldarkness.dev?subject=Press%20Kit%20Request%20-%20Total%20Darkness',
                              primary: false
                            },
                            {
                              label: 'Contacto editorial',
                              icon: 'mail',
                              href: 'mailto:contact@totaldarkness.dev?subject=Publisher%20Inquiry%20-%20Total%20Darkness',
                              primary: false
                            }
                          ],
                          centerImage: '/assets/parallax/documentacion-parallax.jpg',
                          leftImage: '/assets/parallax/fundador-parallax.jpg',
                          rightImage: '/assets/parallax/noticias-eventos-parallax.jpg'
                        }
                      ]}
                    />
                  )}
                </div>

                {/* Right Column - Empty */}
                <div></div>
              </div>
            </div>
          </div>
        )}
        {shouldShowTimelineNavigator && (
          <TimelineView
            timeline={timeline}
            isActive={true}
            showHud={activeSection === 'cronologia'}
            showLogo={activeSection !== 'cronologia'}
            selectedChapter={selectedTimelineChapter}
            zoom={timelineZoom}
            onZoomChange={setTimelineZoom}
            onNavigateToPlanet={handleTimelineNumberNavigation}
          />
        )}
      </div>

      {/* ARCHON — AI Chat Oracle (floats over all sections) */}
      <TotalDarknessChat />
    </div >
  );
}