import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Inyectar estilos de animación de flotación y hologramas
const floatingStyles = `
    @keyframes floatLeft {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-8px) scale(1); }
    }
    @keyframes floatCenter {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-12px) scale(1); }
    }
    @keyframes floatRight {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-10px) scale(1); }
    }
    @keyframes buttonGlitch {
        0%, 100% { 
            text-shadow: 2px 2px 0px rgba(0,229,229,0.4), -2px -2px 0px rgba(255,0,150,0.3);
            transform: translate(0, 0);
        }
        20% { 
            text-shadow: -2px 2px 0px rgba(0,229,229,0.6), 2px -2px 0px rgba(255,0,150,0.4);
            transform: translate(-1px, 1px);
        }
        40% { 
            text-shadow: 2px -2px 0px rgba(0,229,229,0.5), -2px 2px 0px rgba(255,0,150,0.35);
            transform: translate(1px, -1px);
        }
        60% { 
            text-shadow: -2px -2px 0px rgba(0,229,229,0.45), 2px 2px 0px rgba(255,0,150,0.3);
            transform: translate(-0.5px, 0.5px);
        }
        80% { 
            text-shadow: 1px 2px 0px rgba(0,229,229,0.55), -1px -2px 0px rgba(255,0,150,0.4);
            transform: translate(0.5px, -0.5px);
        }
    }
    @keyframes buttonHolo {
        0%, 100% { 
            box-shadow: 0 0 12px rgba(0,229,229,0.5), inset 0 0 8px rgba(0,229,229,0.2);
        }
        50% { 
            box-shadow: 0 0 20px rgba(0,229,229,0.7), 0 0 30px rgba(255,0,150,0.3), inset 0 0 12px rgba(0,229,229,0.3);
        }
    }
    @keyframes signalNoise {
        0% { transform: translate3d(0, 0, 0); opacity: 0.18; }
        20% { transform: translate3d(-1px, 1px, 0); opacity: 0.26; }
        40% { transform: translate3d(1px, -1px, 0); opacity: 0.14; }
        60% { transform: translate3d(-1px, 0px, 0); opacity: 0.22; }
        80% { transform: translate3d(1px, 1px, 0); opacity: 0.16; }
        100% { transform: translate3d(0, 0, 0); opacity: 0.2; }
    }
    @keyframes signalShift {
        0%, 100% { transform: translateX(0); opacity: 0.35; }
        25% { transform: translateX(-2px); opacity: 0.45; }
        50% { transform: translateX(2px); opacity: 0.3; }
        75% { transform: translateX(-1px); opacity: 0.42; }
    }
    @keyframes signalFlicker {
        0%, 100% { opacity: 0.15; }
        10% { opacity: 0.3; }
        22% { opacity: 0.12; }
        36% { opacity: 0.28; }
        58% { opacity: 0.18; }
        79% { opacity: 0.34; }
    }
    @keyframes scanVerticalA {
        0% { transform: translateX(-18%); opacity: 0.06; }
        50% { opacity: 0.2; }
        100% { transform: translateX(118%); opacity: 0.08; }
    }
    @keyframes scanVerticalB {
        0% { transform: translateX(118%); opacity: 0.05; }
        45% { opacity: 0.16; }
        100% { transform: translateX(-18%); opacity: 0.07; }
    }
    .floating-left { animation: floatLeft 4.5s ease-in-out infinite; }
    .floating-center { animation: floatCenter 5.2s ease-in-out infinite; }
    .floating-right { animation: floatRight 4.8s ease-in-out infinite; }
    .button-glitching { animation: buttonGlitch 180ms steps(4, end) infinite, buttonHolo 2.5s ease-in-out infinite; }
    .signal-noise { animation: signalNoise 180ms steps(3, end) infinite; }
    .signal-shift { animation: signalShift 240ms steps(2, end) infinite; }
    .signal-flicker { animation: signalFlicker 1.35s steps(6, end) infinite; }
    .scan-vertical-a { animation: scanVerticalA 2.6s linear infinite; }
    .scan-vertical-b { animation: scanVerticalB 3.4s linear infinite; }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = floatingStyles;
document.head.appendChild(styleSheet);

const SECTIONS_BY_LANG = {
    es: [
        {
            title: 'Dilmun / Edén',
            image: '/assets/parallax/filosofia-parallax.jpg',
            leftImage: '/assets/parallax/universback.jpg',
            rightImage: '/assets/parallax/universe360.png',
            subtitleColor: '#00e5e5',
            text: 'Un origen de equilibrio entre mundos y especies. Aquí nace la decisión humana, y con ella, la posibilidad de alterar el destino del universo.',
            leftRune: 'ᚨᛉ',
            rightRune: 'ᛟᚱ'
        },
        {
            title: 'Código TIAMATU ENUMA',
            image: '/assets/parallax/documentacion-parallax.jpg',
            leftImage: '/assets/parallax/documentacion-recursos-parallax.jpg',
            rightImage: '/assets/parallax/cronograma-progreso-parallax.jpg',
            subtitleColor: '#00e5e5',
            text: 'Núcleo simbólico y tecnológico que define memoria, linaje y posibilidad de reconstrucción del universo. Es el conocimiento ancestral que conecta todos los tiempos.',
            leftRune: 'ᚦᚾ',
            rightRune: 'ᛇᛈ'
        },
        {
            title: 'Proyecto Red Tormenthor',
            image: '/assets/parallax/proyectos-parallax.jpg',
            leftImage: '/assets/parallax/Oficina0010.jpg',
            rightImage: '/assets/parallax/Oficina0013.jpg',
            subtitleColor: '#00e5e5',
            text: 'Sistema central del conflicto final: arma, arquitectura de control y punto de no retorno para la saga. Representa el intento de XLERION de reescribir la existencia misma.',
            leftRune: 'ᛊᛏ',
            rightRune: 'ᛒᛖ'
        },
        {
            title: 'Los Anunnaki',
            image: '/assets/parallax/fundador-parallax.jpg',
            leftImage: '/assets/parallax/XHunterPoster.png',
            rightImage: '/assets/parallax/XHunterPoster0040.png',
            subtitleColor: '#00e5e5',
            text: 'Seres cósmicos que crearon y manipularon a la humanidad. Su legado de control genético y conflictos fraternales marca el destino del mundo.',
            leftRune: 'ᛗᛚ',
            rightRune: 'ᛜᛞ'
        },
        {
            title: 'Ultima - El Nexo Final',
            image: '/assets/parallax/soluciones-parallax.jpg',
            leftImage: '/assets/parallax/PortadaDroneX3.png',
            rightImage: '/assets/parallax/servicios-productos-parallax.jpg',
            subtitleColor: '#00e5e5',
            text: 'Dimensión cósmica donde convergen todos los mundos. Punto de confluencia donde pasado, presente y futuro colapsan en una singularidad. El lugar donde toda la verdad se revela.',
            leftRune: 'ᚠᚨ',
            rightRune: 'ᛟᛡ'
        }
    ],
    en: [
        {
            title: 'Dilmun / Eden',
            image: '/assets/parallax/filosofia-parallax.jpg',
            leftImage: '/assets/parallax/universback.jpg',
            rightImage: '/assets/parallax/universe360.png',
            subtitleColor: '#00e5e5',
            text: 'An origin point of balance between worlds and species. Here, human choice is born—and with it, the power to alter the fate of the universe.',
            leftRune: 'ᚨᛉ',
            rightRune: 'ᛟᚱ'
        },
        {
            title: 'TIAMATU ENUMA Code',
            image: '/assets/parallax/documentacion-parallax.jpg',
            leftImage: '/assets/parallax/documentacion-recursos-parallax.jpg',
            rightImage: '/assets/parallax/cronograma-progreso-parallax.jpg',
            subtitleColor: '#00e5e5',
            text: 'A symbolic-technological core that defines memory, lineage, and the possibility of rebuilding the universe. It is ancestral knowledge connecting all timelines.',
            leftRune: 'ᚦᚾ',
            rightRune: 'ᛇᛈ'
        },
        {
            title: 'Tormenthor Network Project',
            image: '/assets/parallax/proyectos-parallax.jpg',
            leftImage: '/assets/parallax/Oficina0010.jpg',
            rightImage: '/assets/parallax/Oficina0013.jpg',
            subtitleColor: '#00e5e5',
            text: 'The central system of the final conflict: weapon, control architecture, and point of no return for the saga. It represents XLERION’s attempt to rewrite existence itself.',
            leftRune: 'ᛊᛏ',
            rightRune: 'ᛒᛖ'
        },
        {
            title: 'The Anunnaki',
            image: '/assets/parallax/fundador-parallax.jpg',
            leftImage: '/assets/parallax/XHunterPoster.png',
            rightImage: '/assets/parallax/XHunterPoster0040.png',
            subtitleColor: '#00e5e5',
            text: 'Cosmic beings who created and manipulated humanity. Their legacy of genetic control and fraternal conflict shapes the destiny of the world.',
            leftRune: 'ᛗᛚ',
            rightRune: 'ᛜᛞ'
        },
        {
            title: 'Ultima - The Final Nexus',
            image: '/assets/parallax/soluciones-parallax.jpg',
            leftImage: '/assets/parallax/PortadaDroneX3.png',
            rightImage: '/assets/parallax/servicios-productos-parallax.jpg',
            subtitleColor: '#00e5e5',
            text: 'A cosmic dimension where all worlds converge. A convergence point where past, present, and future collapse into singularity—the place where all truth is revealed.',
            leftRune: 'ᚠᚨ',
            rightRune: 'ᛟᛡ'
        }
    ]
};

const RUNIC_GLYPHS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

function toRunicText(text) {
    return text
        .split('')
        .map((char) => {
            if (char === ' ' || char === '/' || char === '-') {
                return char;
            }
            return RUNIC_GLYPHS[Math.floor(Math.random() * RUNIC_GLYPHS.length)];
        })
        .join('');
}

function toFailedDecoding(text) {
    const symbols = ['▯', '◆', '◈', '▪', '▫', '●', '○', '◈', '◊', '☒', '☐', '■', '□', '∆', '∇', '≈', '≡', '≠', '¤', '§'];
    const specialChars = ['Ω', 'Ψ', 'Φ', 'Ξ', 'Σ', '∑', '∏', '∫', '√', '∞', '←', '→', '↔', '↑', '↓'];

    return text
        .split('')
        .map((char, idx) => {
            if (char === ' ') return ' ';
            if (char === '/' || char === '-') return char;
            const rand = Math.random();
            if (rand < 0.4) {
                return symbols[Math.floor(Math.random() * symbols.length)];
            } else if (rand < 0.7) {
                return specialChars[Math.floor(Math.random() * specialChars.length)];
            } else {
                return RUNIC_GLYPHS[Math.floor(Math.random() * RUNIC_GLYPHS.length)];
            }
        })
        .join('');
}

// Generador de código matricial para paneles laterales
function generateMatrixColumn() {
    const chars = ['0', '1', '|0⟩', '|1⟩', '|+⟩', '|-⟩', 'Ψ', 'Φ', '∞', '⊗', '⊕', '∧', '∨', '¬', '∀', '∃', '◈', '◆', '●', '○', '▪', '▫'];
    const length = Math.floor(Math.random() * 12) + 8;
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]);
}

function MatrixRain({ columns = 15, speed = 50 }) {
    const [streams, setStreams] = useState([]);

    useEffect(() => {
        const initialStreams = Array.from({ length: columns }, (_, i) => ({
            id: i,
            left: `${(i / columns) * 100}%`,
            chars: generateMatrixColumn(),
            top: -Math.random() * 100,
            delay: Math.random() * 2000
        }));
        setStreams(initialStreams);
    }, [columns]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStreams(prev => prev.map(stream => {
                const newTop = stream.top >= 100 ? -50 : stream.top + 0.5;
                return {
                    ...stream,
                    top: newTop,
                    chars: newTop <= -45 ? generateMatrixColumn() : stream.chars
                };
            }));
        }, speed);

        return () => clearInterval(interval);
    }, [speed]);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 10, pointerEvents: 'none' }}>
            {streams.map(stream => (
                <div
                    key={stream.id}
                    style={{
                        position: 'absolute',
                        left: stream.left,
                        top: `${stream.top}%`,
                        display: 'flex',
                        flexDirection: 'column',
                        pointerEvents: 'none',
                        fontSize: 9,
                        fontFamily: 'monospace',
                        color: '#00e5e5',
                        textShadow: '0 0 8px rgba(0,229,229,0.8)',
                        opacity: 0.7,
                        transition: 'top 50ms linear',
                        lineHeight: 1.2
                    }}
                >
                    {stream.chars.map((char, idx) => (
                        <span key={idx} style={{ opacity: 1 - (idx / stream.chars.length) * 0.7, pointerEvents: 'none' }}>
                            {char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function MundoPage() {
    const { lang } = useLanguage();
    const sections = SECTIONS_BY_LANG[lang] || SECTIONS_BY_LANG.es;
    const sectionMenuLabels = lang === 'en'
        ? ['dilmun / eden', 'earth', 'earth x', 'x-corp', 'ultima']
        : ['dilmun / eden', 'Tierra', 'Tierra X', 'X-corp', 'Ultima'];

    const [index, setIndex] = useState(0);
    const [booting, setBooting] = useState(true);
    const [showRunicSubtitle, setShowRunicSubtitle] = useState(false);
    const [buttonGlitches, setButtonGlitches] = useState({});
    const [matrixKey, setMatrixKey] = useState(0);
    const [pressedCenter, setPressedCenter] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1366));
    const section = sections[index];

    const isTablet = viewportWidth < 1320;
    const isMobile = viewportWidth < 1024;
    const sidePanelWidth = isTablet ? 276 : 354;

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 900);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reiniciar efecto de matriz al cambiar de sección
    useEffect(() => {
        setMatrixKey(prev => prev + 1);
    }, [index]);

    useEffect(() => {
        let glitchTimer;
        let restoreTimer;

        const scheduleGlitch = () => {
            const waitMs = 3200 + Math.floor(Math.random() * 3800);
            glitchTimer = setTimeout(() => {
                setShowRunicSubtitle(true);

                // Activar glitch en botón aleatorio
                const randomBtn = Math.floor(Math.random() * 5);
                setButtonGlitches(prev => ({ ...prev, [randomBtn]: true }));

                const visibleMs = 450 + Math.floor(Math.random() * 450);
                restoreTimer = setTimeout(() => {
                    setShowRunicSubtitle(false);
                    setButtonGlitches(prev => ({ ...prev, [randomBtn]: false }));
                    scheduleGlitch();
                }, visibleMs);
            }, waitMs);
        };

        scheduleGlitch();

        return () => {
            clearTimeout(glitchTimer);
            clearTimeout(restoreTimer);
        };
    }, []);

    const handlePrev = () => {
        setPressedCenter(true);
        setTimeout(() => setPressedCenter(false), 200);
        setIndex((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
    };
    const handleNext = () => {
        setPressedCenter(true);
        setTimeout(() => setPressedCenter(false), 200);
        setIndex((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
    };

    return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'transparent', color: 'white', fontFamily: 'Orbitron, monospace', overflow: 'hidden' }}>
            {/* DIV SUPERIOR - 80 PX */}
            <div style={{ height: isMobile ? 52 : 80, background: 'transparent', color: '#b8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: isMobile ? '0 14px' : '0 40px', fontSize: isMobile ? 14 : 18, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0 }}>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
                {/* DIV IZQUIERDO - 354 PX */}
                {!isMobile && (
                    <div className="floating-left" style={{ width: sidePanelWidth, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, padding: '0 12px' }}>
                        <div style={{ width: '100%', height: '72%', minHeight: 360, border: '2px solid rgba(0,229,229,0.95)', borderRadius: 16, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', opacity: booting ? 0 : 1, transform: booting ? 'scale(0.92) translateY(20px)' : 'scale(1) translateY(0)', boxShadow: booting ? '0 0 40px rgba(0,229,229,0.75), inset 0 0 20px rgba(0,229,229,0.35)' : '0 0 22px rgba(0,229,229,0.35), inset 0 0 12px rgba(0,229,229,0.2)', transition: 'opacity 620ms ease, transform 620ms ease, box-shadow 620ms ease' }}>
                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: booting ? 0.72 : 0.18, transition: 'opacity 620ms ease' }} />
                            <div style={{ position: 'absolute', left: 0, right: 0, height: 62, top: booting ? '-24%' : '130%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,229,229,0) 0%, rgba(0,229,229,0.4) 50%, rgba(0,229,229,0) 100%)', transition: 'top 780ms ease' }} />
                            <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(0,229,229,0.38)', borderRadius: 10, boxShadow: 'inset 0 0 18px rgba(0,229,229,0.2)' }} />
                            <img src={section.leftImage} alt="Panel Izquierdo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                            <div className="signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                            <div className="signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                            <div className="scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <MatrixRain key={`left-${matrixKey}`} columns={12} speed={45} />
                        </div>
                    </div>
                )}

                {/* DIV CENTRAL - FLEX */}
                <div className="floating-center" style={{ flex: 1, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', position: 'relative', overflow: 'hidden' }}>
                    {/* Recuadro central con contenido */}
                    <div style={{ width: isMobile ? 'calc(100% - 16px)' : 'calc(100% - 120px)', maxWidth: 1100, border: '2px solid #00e5e5', borderRadius: 18, padding: isMobile ? 14 : 24, background: 'rgba(0,0,0,0.2)', color: '#b8f6ff', position: 'relative', minHeight: isMobile ? 380 : 400, maxHeight: isMobile ? 'calc(100vh - 170px)' : 'none', backdropFilter: 'blur(8px)', overflow: 'hidden', opacity: booting ? 0 : 1, transform: booting ? 'scale(0.92) translateY(20px)' : (pressedCenter ? 'scale(0.96) translateZ(-20px)' : 'scale(1) translateY(0)'), filter: booting ? 'brightness(1.8) saturate(1.4)' : 'brightness(1) saturate(1)', boxShadow: booting ? '0 0 60px rgba(0,229,229,0.85), inset 0 0 30px rgba(0,229,229,0.35)' : (pressedCenter ? '0 0 15px rgba(0,229,229,0.2), inset 0 0 25px rgba(0,229,229,0.3)' : '0 0 28px rgba(0,229,229,0.35), inset 0 0 16px rgba(0,229,229,0.2)'), transition: pressedCenter ? 'transform 120ms ease-out, box-shadow 120ms ease-out' : 'opacity 620ms ease, transform 200ms ease-out, filter 620ms ease, box-shadow 200ms ease-out' }}>
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: booting ? 0.7 : 0.18, transition: 'opacity 620ms ease' }} />
                        <div style={{ position: 'absolute', left: 0, right: 0, height: 80, top: booting ? '-20%' : '120%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,229,229,0) 0%, rgba(0,229,229,0.42) 50%, rgba(0,229,229,0) 100%)', transition: 'top 760ms ease' }} />
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 18, border: '1px solid rgba(0,229,229,0.35)', boxShadow: 'inset 0 0 24px rgba(0,229,229,0.18)' }} />

                        {/* Flecha Izquierda */}
                        <div onClick={handlePrev} style={{ position: 'absolute', left: isMobile ? 8 : -60, top: isMobile ? 10 : '50%', transform: isMobile ? 'none' : 'translateY(-50%)', fontSize: isMobile ? 30 : 60, color: '#00e5e5', cursor: 'pointer', userSelect: 'none', lineHeight: 1, zIndex: 20 }}>&#60;</div>

                        {/* Flecha Derecha */}
                        <div onClick={handleNext} style={{ position: 'absolute', right: isMobile ? 8 : -60, top: isMobile ? 10 : '50%', transform: isMobile ? 'none' : 'translateY(-50%)', fontSize: isMobile ? 30 : 60, color: '#00e5e5', cursor: 'pointer', userSelect: 'none', lineHeight: 1, zIndex: 20 }}>&#62;</div>

                        {/* Área de imagen */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 18, height: isMobile ? 150 : 220, margin: isMobile ? '26px auto 14px auto' : '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5e5', fontSize: 32, fontFamily: 'Orbitron, monospace', letterSpacing: 2, backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' }}>
                            <img src={section.image} alt={section.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                            <div className="signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                            <div className="signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                            <div className="scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                        </div>

                        {/* Título de la sección */}
                        <div style={{ color: section.subtitleColor, fontWeight: 600, fontSize: 16, marginBottom: 12, textAlign: 'left', fontFamily: 'Orbitron, monospace', letterSpacing: 1, textTransform: 'uppercase', textShadow: showRunicSubtitle ? '0 0 10px rgba(0,229,229,0.8)' : 'none', transition: 'text-shadow 160ms ease' }}>
                            {showRunicSubtitle ? toRunicText(section.title) : section.title}
                        </div>

                        {/* Texto descriptivo */}
                        <div style={{ color: '#b8f6ff', fontSize: 13, textAlign: 'left', fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.6 }}>
                            {section.text}
                        </div>
                    </div>
                </div>

                {/* DIV DERECHO - 354 PX */}
                {!isMobile && (
                    <div className="floating-right" style={{ width: sidePanelWidth, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, padding: '0 12px' }}>
                        <div style={{ width: '100%', height: '72%', minHeight: 360, border: '2px solid rgba(0,229,229,0.95)', borderRadius: 16, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', opacity: booting ? 0 : 1, transform: booting ? 'scale(0.92) translateY(20px)' : 'scale(1) translateY(0)', boxShadow: booting ? '0 0 40px rgba(0,229,229,0.75), inset 0 0 20px rgba(0,229,229,0.35)' : '0 0 22px rgba(0,229,229,0.35), inset 0 0 12px rgba(0,229,229,0.2)', transition: 'opacity 620ms ease, transform 620ms ease, box-shadow 620ms ease' }}>
                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: booting ? 0.72 : 0.18, transition: 'opacity 620ms ease' }} />
                            <div style={{ position: 'absolute', left: 0, right: 0, height: 62, top: booting ? '-24%' : '130%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,229,229,0) 0%, rgba(0,229,229,0.4) 50%, rgba(0,229,229,0) 100%)', transition: 'top 780ms ease' }} />
                            <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(0,229,229,0.38)', borderRadius: 10, boxShadow: 'inset 0 0 18px rgba(0,229,229,0.2)' }} />
                            <img src={section.rightImage} alt="Panel Derecho" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                            <div className="signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                            <div className="signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                            <div className="scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <MatrixRain key={`right-${matrixKey}`} columns={12} speed={55} />
                        </div>
                    </div>
                )}
            </div>

            {/* MENU PLANETAS - 80 PX (verde oscuro en imagen) */}
            <div style={{ minHeight: isMobile ? 58 : 80, height: 'auto', background: 'transparent', display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center', alignItems: 'center', gap: isMobile ? 8 : 24, flexShrink: 0, flexWrap: 'wrap', padding: isMobile ? '8px 10px' : '0 12px' }}>
                {sectionMenuLabels.map((text, btnIdx) => (
                    <div
                        key={btnIdx}
                        onClick={() => {
                            setPressedCenter(true);
                            setTimeout(() => setPressedCenter(false), 200);
                            setIndex(btnIdx);
                        }}
                        className={buttonGlitches[btnIdx] ? 'button-glitching' : ''}
                        style={{
                            position: 'relative',
                            color: index === btnIdx ? '#00e5e5' : '#5dfdfd',
                            border: `2px solid ${index === btnIdx ? '#00e5e5' : '#5dfdfd'}`,
                            borderRadius: 6,
                            padding: isMobile ? '6px 10px' : '8px 28px',
                            fontSize: isMobile ? 12 : 16,
                            fontFamily: 'Orbitron, monospace',
                            cursor: 'pointer',
                            transition: index === btnIdx ? 'none' : 'all 300ms ease',
                            background: index === btnIdx ? 'rgba(0,0,0,0.2)' : 'transparent',
                            backdropFilter: index === btnIdx ? 'blur(8px)' : 'none',
                            boxShadow: index === btnIdx ? '0 0 12px rgba(0,229,229,0.5), inset 0 0 8px rgba(0,229,229,0.2)' : 'none',
                            userSelect: 'none',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Scanlines interior */}
                        {index === btnIdx && (
                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.06) 0px, rgba(0,229,229,0.06) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)', borderRadius: 6 }} />
                        )}
                        {/* Borde interior sutil */}
                        {index === btnIdx && (
                            <div style={{ position: 'absolute', inset: 2, border: '1px solid rgba(0,229,229,0.25)', borderRadius: 4, pointerEvents: 'none' }} />
                        )}
                        <span style={{ position: 'relative', zIndex: 1 }}>
                            {buttonGlitches[btnIdx] ? toFailedDecoding(text) : text}
                        </span>
                    </div>
                ))}
            </div>

            {/* DIV SUB INFERIOR - 67 PX (verde brillante en imagen) */}
            <div style={{ height: isMobile ? 16 : 67, background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, fontWeight: 700 }}>
            </div>

            {/* DIV INFERIOR - 76 PX (verde medio en imagen) */}
            <div style={{ height: isMobile ? 20 : 76, background: 'transparent', color: '#b8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, fontWeight: 700, position: 'relative' }}>
                {/* Indicador izquierdo - 76 PX */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 76, background: 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                </div>
                {/* Indicador derecho - 80 PX */}
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                </div>
            </div>
        </div>
    );
}
