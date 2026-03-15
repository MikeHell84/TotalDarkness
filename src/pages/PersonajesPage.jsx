import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

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

if (typeof document !== 'undefined' && !document.getElementById('td-holo-effects-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'td-holo-effects-styles';
    styleSheet.textContent = floatingStyles;
    document.head.appendChild(styleSheet);
}

const CHARACTERS = [
    {
        title: 'Adapa',
        image: '/assets/parallax/universback.jpg',
        leftImage: '/assets/parallax/filosofia-parallax.jpg',
        rightImage: '/assets/parallax/universe360.png',
        subtitleColor: '#00e5e5',
        text: 'Primer hombre y eje del libre albedrío. Su decisión frente a las hierbas sagradas rompe el pacto original y desencadena la caída de Dilmun.',
        leftRune: 'ᚨᛉ',
        rightRune: 'ᛟᚱ'
    },
    {
        title: 'Ninhursag (Ninti)',
        image: '/assets/parallax/documentacion-parallax.jpg',
        leftImage: '/assets/parallax/documentacion-recursos-parallax.jpg',
        rightImage: '/assets/parallax/cronograma-progreso-parallax.jpg',
        subtitleColor: '#00e5e5',
        text: 'Madre de creación y memoria fragmentada. Representa el amor, la continuidad y el sacrificio. Su legado sobrevive en clanes humanos.',
        leftRune: 'ᚦᚾ',
        rightRune: 'ᛇᛈ'
    },
    {
        title: 'Enki',
        image: '/assets/parallax/proyectos-parallax.jpg',
        leftImage: '/assets/parallax/Oficina0010.jpg',
        rightImage: '/assets/parallax/Oficina0013.jpg',
        subtitleColor: '#00e5e5',
        text: 'Dios observador y ejecutor del castigo. Pone a prueba la ley universal, decreta el exilio y marca el inicio del sufrimiento humano.',
        leftRune: 'ᛊᛏ',
        rightRune: 'ᛒᛖ'
    },
    {
        title: 'DumuUl',
        image: '/assets/parallax/fundador-parallax.jpg',
        leftImage: '/assets/parallax/XHunterPoster.png',
        rightImage: '/assets/parallax/XHunterPoster0040.png',
        subtitleColor: '#00e5e5',
        text: 'Portador del código en la era final. Heredero de visiones antiguas, enfrenta la guerra contra XLERION y el ciclo del fin.',
        leftRune: 'ᛗᛚ',
        rightRune: 'ᛜᛞ'
    },
    {
        title: 'XLERION',
        image: '/assets/parallax/soluciones-parallax.jpg',
        leftImage: '/assets/parallax/PortadaDroneX3.png',
        rightImage: '/assets/parallax/servicios-productos-parallax.jpg',
        subtitleColor: '#00e5e5',
        text: 'Entidad nacida de codicia y corrupción. Voluntad oscura que busca reescribir el universo mediante el Proyecto Red Tormenthor.',
        leftRune: 'ᚠᚨ',
        rightRune: 'ᛟᛡ'
    }
];

const RUNIC_GLYPHS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

const CHARACTER_SKILL_MAPS = {
    'Adapa': {
        archetype: 'Balance / Libre Albedrío',
        nodes: [
            { id: 'a0', label: 'Origen', level: 5, x: 14, y: 50, type: 'core' },
            { id: 'a1', label: 'Voluntad', level: 4, x: 34, y: 24, type: 'active' },
            { id: 'a2', label: 'Discernir', level: 3, x: 34, y: 76, type: 'passive' },
            { id: 'a3', label: 'Empatía', level: 4, x: 56, y: 28, type: 'active' },
            { id: 'a4', label: 'Ruptura', level: 5, x: 56, y: 72, type: 'ultimate' },
            { id: 'a5', label: 'Legado', level: 3, x: 80, y: 50, type: 'passive' }
        ],
        links: [['a0', 'a1'], ['a0', 'a2'], ['a1', 'a3'], ['a2', 'a4'], ['a3', 'a5'], ['a4', 'a5']]
    },
    'Ninhursag (Ninti)': {
        archetype: 'Support / Creación',
        nodes: [
            { id: 'n0', label: 'Matriz', level: 5, x: 14, y: 50, type: 'core' },
            { id: 'n1', label: 'Cuidado', level: 4, x: 34, y: 24, type: 'passive' },
            { id: 'n2', label: 'Savia', level: 4, x: 34, y: 76, type: 'active' },
            { id: 'n3', label: 'Memoria', level: 5, x: 56, y: 28, type: 'active' },
            { id: 'n4', label: 'Resurgir', level: 4, x: 56, y: 72, type: 'active' },
            { id: 'n5', label: 'Madre-Raíz', level: 5, x: 80, y: 50, type: 'ultimate' }
        ],
        links: [['n0', 'n1'], ['n0', 'n2'], ['n1', 'n3'], ['n2', 'n4'], ['n3', 'n5'], ['n4', 'n5']]
    },
    'Enki': {
        archetype: 'Control / Juicio',
        nodes: [
            { id: 'e0', label: 'Observador', level: 5, x: 14, y: 50, type: 'core' },
            { id: 'e1', label: 'Prueba', level: 3, x: 34, y: 24, type: 'active' },
            { id: 'e2', label: 'Dogma', level: 5, x: 34, y: 76, type: 'passive' },
            { id: 'e3', label: 'Veredicto', level: 4, x: 56, y: 28, type: 'active' },
            { id: 'e4', label: 'Exilio', level: 5, x: 56, y: 72, type: 'ultimate' },
            { id: 'e5', label: 'Sello', level: 4, x: 80, y: 50, type: 'passive' }
        ],
        links: [['e0', 'e1'], ['e0', 'e2'], ['e1', 'e3'], ['e2', 'e4'], ['e3', 'e5'], ['e4', 'e5']]
    },
    'DumuUl': {
        archetype: 'Táctico / Resistencia',
        nodes: [
            { id: 'd0', label: 'Heredero', level: 4, x: 14, y: 50, type: 'core' },
            { id: 'd1', label: 'Rastreo', level: 4, x: 34, y: 24, type: 'active' },
            { id: 'd2', label: 'Pulso', level: 3, x: 34, y: 76, type: 'passive' },
            { id: 'd3', label: 'Aegis', level: 5, x: 56, y: 28, type: 'active' },
            { id: 'd4', label: 'Cacería', level: 4, x: 56, y: 72, type: 'active' },
            { id: 'd5', label: 'Último Ciclo', level: 5, x: 80, y: 50, type: 'ultimate' }
        ],
        links: [['d0', 'd1'], ['d0', 'd2'], ['d1', 'd3'], ['d2', 'd4'], ['d3', 'd5'], ['d4', 'd5']]
    },
    'XLERION': {
        archetype: 'Corruptor / Dominio',
        nodes: [
            { id: 'x0', label: 'Núcleo', level: 5, x: 14, y: 50, type: 'core' },
            { id: 'x1', label: 'Infección', level: 5, x: 34, y: 24, type: 'active' },
            { id: 'x2', label: 'Mimetismo', level: 4, x: 34, y: 76, type: 'passive' },
            { id: 'x3', label: 'Tormenta', level: 5, x: 56, y: 28, type: 'active' },
            { id: 'x4', label: 'Subyugar', level: 5, x: 56, y: 72, type: 'ultimate' },
            { id: 'x5', label: 'Red Tormenthor', level: 5, x: 80, y: 50, type: 'ultimate' }
        ],
        links: [['x0', 'x1'], ['x0', 'x2'], ['x1', 'x3'], ['x2', 'x4'], ['x3', 'x5'], ['x4', 'x5']]
    }
};

const CHARACTER_TEXT_EN = {
    'Adapa': 'First human and axis of free will. His choice before the sacred herbs breaks the original pact and triggers the fall of Dilmun.',
    'Ninhursag (Ninti)': 'Mother of creation and fragmented memory. She represents love, continuity, and sacrifice. Her legacy survives within human clans.',
    'Enki': 'Observing god and executor of punishment. He tests universal law, decrees exile, and marks the beginning of human suffering.',
    'DumuUl': 'Bearer of the code in the final era. Heir to ancient visions, he faces the war against XLERION and the cycle of the end.',
    'XLERION': 'Entity born from greed and corruption. A dark will seeking to rewrite the universe through the Red Tormenthor Project.'
};

const ARCHETYPE_EN = {
    'Balance / Libre Albedrío': 'Balance / Free Will',
    'Support / Creación': 'Support / Creation',
    'Control / Juicio': 'Control / Judgment',
    'Táctico / Resistencia': 'Tactical / Resilience',
    'Corruptor / Dominio': 'Corruptor / Dominion'
};

const NODE_LABEL_EN = {
    'Origen': 'Origin',
    'Voluntad': 'Will',
    'Discernir': 'Discern',
    'Empatía': 'Empathy',
    'Ruptura': 'Rupture',
    'Legado': 'Legacy',
    'Matriz': 'Matrix',
    'Cuidado': 'Care',
    'Savia': 'Sap',
    'Memoria': 'Memory',
    'Resurgir': 'Resurge',
    'Madre-Raíz': 'Mother-Root',
    'Observador': 'Observer',
    'Prueba': 'Trial',
    'Veredicto': 'Verdict',
    'Exilio': 'Exile',
    'Sello': 'Seal',
    'Heredero': 'Heir',
    'Rastreo': 'Tracking',
    'Pulso': 'Pulse',
    'Cacería': 'Hunt',
    'Último Ciclo': 'Last Cycle',
    'Núcleo': 'Core',
    'Infección': 'Infection',
    'Mimetismo': 'Mimicry',
    'Tormenta': 'Storm',
    'Subyugar': 'Subjugate'
};

function localizeSkillProfile(profile, lang) {
    if (!profile || lang !== 'en') return profile;

    return {
        ...profile,
        archetype: ARCHETYPE_EN[profile.archetype] || profile.archetype,
        nodes: (profile.nodes || []).map((node) => ({
            ...node,
            label: NODE_LABEL_EN[node.label] || node.label
        }))
    };
}

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
        .map((char) => {
            if (char === ' ') return ' ';
            if (char === '/' || char === '-') return char;
            const rand = Math.random();
            if (rand < 0.4) {
                return symbols[Math.floor(Math.random() * symbols.length)];
            }
            if (rand < 0.7) {
                return specialChars[Math.floor(Math.random() * specialChars.length)];
            }
            return RUNIC_GLYPHS[Math.floor(Math.random() * RUNIC_GLYPHS.length)];
        })
        .join('');
}

function generateMatrixColumn() {
    const chars = ['0', '1', '|0⟩', '|1⟩', '|+⟩', '|-⟩', 'Ψ', 'Φ', '∞', '⊗', '⊕', '∧', '∨', '¬', '∀', '∃', '◈', '◆', '●', '○', '▪', '▫'];
    const length = Math.floor(Math.random() * 12) + 8;
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]);
}

function createInitialStreams(columns) {
    return Array.from({ length: columns }, (_, i) => ({
        id: i,
        left: `${(i / columns) * 100}%`,
        chars: generateMatrixColumn(),
        top: -Math.random() * 100
    }));
}

function MatrixRain({ columns = 15, speed = 50 }) {
    const [streams, setStreams] = useState(() => createInitialStreams(columns));

    useEffect(() => {
        const interval = setInterval(() => {
            setStreams((prev) => prev.map((stream) => {
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
            {streams.map((stream) => (
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

function CharacterSkillMap({ profile, lang = 'es' }) {
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [pinnedNodeId, setPinnedNodeId] = useState(null);
    const nodes = profile?.nodes || [];
    const links = profile?.links || [];
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const activeNodeId = pinnedNodeId || hoveredNodeId;
    const hoveredNode = activeNodeId ? byId[activeNodeId] : null;

    useEffect(() => {
        setPinnedNodeId(null);
        setHoveredNodeId(null);
    }, [profile?.archetype]);

    const getNodeTypeLabel = (type) => {
        if (type === 'ultimate') return 'Ultimate';
        if (type === 'core') return 'Core';
        if (type === 'active') return 'Active';
        return 'Passive';
    };

    const getTooltipPositionStyle = (node) => {
        if (!node) {
            return {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, calc(-100% - 16px))'
            };
        }

        const verticalTransform = node.y <= 28
            ? 'translate(-50%, 16px)'
            : 'translate(-50%, calc(-100% - 16px))';

        if (node.x <= 22) {
            return {
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: node.y <= 28
                    ? 'translate(0%, 16px)'
                    : 'translate(0%, calc(-100% - 16px))'
            };
        }

        if (node.x >= 78) {
            return {
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: node.y <= 28
                    ? 'translate(-100%, 16px)'
                    : 'translate(-100%, calc(-100% - 16px))'
            };
        }

        return {
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: verticalTransform
        };
    };

    const getNodeColor = (type) => {
        if (type === 'ultimate') return '#00f5ff';
        if (type === 'core') return '#00e5e5';
        if (type === 'active') return '#74fbff';
        return '#5dfdfd';
    };

    const uiText = lang === 'en'
        ? { skillMap: 'Skill Map', profile: 'Profile', type: 'Type', level: 'Level' }
        : { skillMap: 'Mapa de habilidades', profile: 'Perfil', type: 'Tipo', level: 'Nivel' };

    return (
        <div style={{ position: 'absolute', inset: 14, zIndex: 6, display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}>
            <div style={{ color: '#00e5e5', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 8, textShadow: '0 0 10px rgba(0,229,229,0.55)' }}>
                {uiText.skillMap} · {profile?.archetype || uiText.profile}
            </div>

            <div
                onClick={() => setPinnedNodeId(null)}
                style={{ position: 'relative', flex: 1, border: '1px solid rgba(0,229,229,0.35)', borderRadius: 10, background: 'rgba(0,0,0,0.18)' }}
            >
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                    {links.map(([fromId, toId], idx) => {
                        const fromNode = byId[fromId];
                        const toNode = byId[toId];
                        if (!fromNode || !toNode) return null;
                        return (
                            <line
                                key={`link-${idx}`}
                                x1={`${fromNode.x}%`}
                                y1={`${fromNode.y}%`}
                                x2={`${toNode.x}%`}
                                y2={`${toNode.y}%`}
                                stroke="rgba(0,229,229,0.55)"
                                strokeWidth="1.5"
                            />
                        );
                    })}
                </svg>

                {nodes.map((node) => (
                    <div
                        key={node.id}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={(event) => {
                            event.stopPropagation();
                            setPinnedNodeId((prev) => (prev === node.id ? null : node.id));
                        }}
                        style={{
                            position: 'absolute',
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                        }}
                    >
                        <div
                            style={{
                                width: node.type === 'ultimate' ? 18 : 14,
                                height: node.type === 'ultimate' ? 18 : 14,
                                borderRadius: '50%',
                                border: `2px solid ${getNodeColor(node.type)}`,
                                background: 'rgba(0,229,229,0.12)',
                                boxShadow: `0 0 10px ${getNodeColor(node.type)}88`
                            }}
                        />
                        <div style={{ color: '#b8f6ff', fontSize: 9, fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap' }}>
                            {node.label}
                        </div>
                        <div style={{ color: '#78fdff', fontSize: 8, fontFamily: 'Orbitron, monospace', opacity: 0.9 }}>
                            LVL {node.level}
                        </div>
                    </div>
                ))}

                {hoveredNode && (
                    <div
                        style={{
                            position: 'absolute',
                            ...getTooltipPositionStyle(hoveredNode),
                            pointerEvents: 'none',
                            zIndex: 30,
                            minWidth: 120,
                            maxWidth: 180,
                            border: '1px solid rgba(0,229,229,0.7)',
                            borderRadius: 8,
                            background: 'rgba(0,0,0,0.78)',
                            boxShadow: '0 0 14px rgba(0,229,229,0.5)',
                            padding: '8px 10px'
                        }}
                    >
                        <div style={{ color: '#00f5ff', fontSize: 10, fontFamily: 'Orbitron, monospace', marginBottom: 4, textTransform: 'uppercase' }}>
                            {hoveredNode.label}
                        </div>
                        <div style={{ color: '#b8f6ff', fontSize: 9, fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.35 }}>
                            {uiText.type}: {getNodeTypeLabel(hoveredNode.type)}
                        </div>
                        <div style={{ color: '#b8f6ff', fontSize: 9, fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.35 }}>
                            {uiText.level}: {hoveredNode.level}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default function PersonajesPage() {
    const { lang } = useLanguage();
    const [index, setIndex] = useState(0);
    const [booting, setBooting] = useState(true);
    const [showRunicSubtitle, setShowRunicSubtitle] = useState(false);
    const [buttonGlitches, setButtonGlitches] = useState({});
    const [pressedCenter, setPressedCenter] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1366));
    const localizedCharacters = React.useMemo(
        () => CHARACTERS.map((character) => ({
            ...character,
            text: lang === 'en' ? (CHARACTER_TEXT_EN[character.title] || character.text) : character.text
        })),
        [lang]
    );

    const section = localizedCharacters[index];
    const baseSkillProfile = CHARACTER_SKILL_MAPS[CHARACTERS[index].title] || CHARACTER_SKILL_MAPS['Adapa'];
    const skillProfile = React.useMemo(
        () => localizeSkillProfile(baseSkillProfile, lang),
        [baseSkillProfile, lang]
    );

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

    useEffect(() => {
        let glitchTimer;
        let restoreTimer;

        const scheduleGlitch = () => {
            const waitMs = 3200 + Math.floor(Math.random() * 3800);
            glitchTimer = setTimeout(() => {
                setShowRunicSubtitle(true);
                const randomBtn = Math.floor(Math.random() * CHARACTERS.length);
                setButtonGlitches((prev) => ({ ...prev, [randomBtn]: true }));

                const visibleMs = 450 + Math.floor(Math.random() * 450);
                restoreTimer = setTimeout(() => {
                    setShowRunicSubtitle(false);
                    setButtonGlitches((prev) => ({ ...prev, [randomBtn]: false }));
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
        setIndex((prev) => (prev === 0 ? CHARACTERS.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setPressedCenter(true);
        setTimeout(() => setPressedCenter(false), 200);
        setIndex((prev) => (prev === CHARACTERS.length - 1 ? 0 : prev + 1));
    };

    return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'transparent', color: 'white', fontFamily: 'Orbitron, monospace', overflow: 'hidden' }}>
            <div style={{ height: isMobile ? 52 : 80, background: 'transparent', color: '#b8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: isMobile ? '0 14px' : '0 40px', fontSize: isMobile ? 14 : 18, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
                {!isMobile && (
                    <div className="floating-left" style={{ width: sidePanelWidth, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, padding: '0 12px' }}>
                        <div style={{ width: '100%', height: '72%', minHeight: 360, border: '2px solid rgba(0,229,229,0.95)', borderRadius: 16, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', opacity: booting ? 0 : 1, transform: booting ? 'scale(0.92) translateY(20px)' : 'scale(1) translateY(0)', boxShadow: booting ? '0 0 40px rgba(0,229,229,0.75), inset 0 0 20px rgba(0,229,229,0.35)' : '0 0 22px rgba(0,229,229,0.35), inset 0 0 12px rgba(0,229,229,0.2)', transition: 'opacity 620ms ease, transform 620ms ease, box-shadow 620ms ease' }}>
                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: booting ? 0.72 : 0.18, transition: 'opacity 620ms ease' }} />
                            <div style={{ position: 'absolute', left: 0, right: 0, height: 62, top: booting ? '-24%' : '130%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,229,229,0) 0%, rgba(0,229,229,0.4) 50%, rgba(0,229,229,0) 100%)', transition: 'top 780ms ease' }} />
                            <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(0,229,229,0.38)', borderRadius: 10, boxShadow: 'inset 0 0 18px rgba(0,229,229,0.2)' }} />
                            <div className="signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                            <div className="signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                            <div className="scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <MatrixRain key={`left-${index}`} columns={12} speed={45} />

                            <div style={{ position: 'absolute', inset: 12, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', pointerEvents: 'auto' }}>
                                {localizedCharacters.map((character, btnIdx) => (
                                    <div
                                        key={`left-${character.title}`}
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
                                            padding: '8px 12px',
                                            fontSize: 13,
                                            fontFamily: 'Orbitron, monospace',
                                            cursor: 'pointer',
                                            transition: index === btnIdx ? 'none' : 'all 300ms ease',
                                            background: index === btnIdx ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
                                            backdropFilter: index === btnIdx ? 'blur(8px)' : 'none',
                                            boxShadow: index === btnIdx ? '0 0 12px rgba(0,229,229,0.5), inset 0 0 8px rgba(0,229,229,0.2)' : 'none',
                                            userSelect: 'none',
                                            overflow: 'hidden',
                                            textTransform: 'uppercase',
                                            lineHeight: 1.2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {index === btnIdx && (
                                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.06) 0px, rgba(0,229,229,0.06) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)', borderRadius: 6 }} />
                                        )}
                                        {index === btnIdx && (
                                            <div style={{ position: 'absolute', inset: 2, border: '1px solid rgba(0,229,229,0.25)', borderRadius: 4, pointerEvents: 'none' }} />
                                        )}
                                        <span style={{ position: 'relative', zIndex: 1 }}>
                                            {buttonGlitches[btnIdx] ? toFailedDecoding(character.title) : character.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="floating-center" style={{ flex: 1, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: isMobile ? 'calc(100% - 16px)' : 'calc(100% - 120px)', maxWidth: 1100, border: '2px solid #00e5e5', borderRadius: 18, padding: isMobile ? 14 : 24, background: 'rgba(0,0,0,0.2)', color: '#b8f6ff', position: 'relative', minHeight: isMobile ? 420 : 520, maxHeight: isMobile ? 'calc(100vh - 170px)' : 'none', backdropFilter: 'blur(8px)', overflow: 'hidden', opacity: booting ? 0 : 1, transform: booting ? 'scale(0.92) translateY(20px)' : (pressedCenter ? 'scale(0.96) translateZ(-20px)' : 'scale(1) translateY(0)'), filter: booting ? 'brightness(1.8) saturate(1.4)' : 'brightness(1) saturate(1)', boxShadow: booting ? '0 0 60px rgba(0,229,229,0.85), inset 0 0 30px rgba(0,229,229,0.35)' : (pressedCenter ? '0 0 15px rgba(0,229,229,0.2), inset 0 0 25px rgba(0,229,229,0.3)' : '0 0 28px rgba(0,229,229,0.35), inset 0 0 16px rgba(0,229,229,0.2)'), transition: pressedCenter ? 'transform 120ms ease-out, box-shadow 120ms ease-out' : 'opacity 620ms ease, transform 200ms ease-out, filter 620ms ease, box-shadow 200ms ease-out' }}>
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: booting ? 0.7 : 0.18, transition: 'opacity 620ms ease' }} />
                        <div style={{ position: 'absolute', left: 0, right: 0, height: 80, top: booting ? '-20%' : '120%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,229,229,0) 0%, rgba(0,229,229,0.42) 50%, rgba(0,229,229,0) 100%)', transition: 'top 760ms ease' }} />
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 18, border: '1px solid rgba(0,229,229,0.35)', boxShadow: 'inset 0 0 24px rgba(0,229,229,0.18)' }} />

                        <div onClick={handlePrev} style={{ position: 'absolute', left: isMobile ? 8 : -60, top: isMobile ? 10 : '50%', transform: isMobile ? 'none' : 'translateY(-50%)', fontSize: isMobile ? 30 : 60, color: '#00e5e5', cursor: 'pointer', userSelect: 'none', lineHeight: 1, zIndex: 20 }}>&#60;</div>
                        <div onClick={handleNext} style={{ position: 'absolute', right: isMobile ? 8 : -60, top: isMobile ? 10 : '50%', transform: isMobile ? 'none' : 'translateY(-50%)', fontSize: isMobile ? 30 : 60, color: '#00e5e5', cursor: 'pointer', userSelect: 'none', lineHeight: 1, zIndex: 20 }}>&#62;</div>

                        {isMobile && (
                            <div style={{ position: 'relative', zIndex: 15, display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, marginTop: 30 }}>
                                {localizedCharacters.map((character, btnIdx) => (
                                    <div
                                        key={`mobile-${character.title}`}
                                        onClick={() => {
                                            setPressedCenter(true);
                                            setTimeout(() => setPressedCenter(false), 200);
                                            setIndex(btnIdx);
                                        }}
                                        style={{
                                            color: index === btnIdx ? '#00e5e5' : '#5dfdfd',
                                            border: `1px solid ${index === btnIdx ? '#00e5e5' : '#5dfdfd'}`,
                                            borderRadius: 999,
                                            padding: '5px 10px',
                                            fontSize: 11,
                                            fontFamily: 'Orbitron, monospace',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            background: index === btnIdx ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.12)'
                                        }}
                                    >
                                        {character.title}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 24, alignItems: 'stretch', minHeight: isMobile ? 0 : 420, overflowY: isMobile ? 'auto' : 'visible', maxHeight: isMobile ? 'calc(100% - 10px)' : 'none', paddingRight: isMobile ? 4 : 0 }}>
                            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ color: section.subtitleColor, fontWeight: 600, fontSize: 16, marginBottom: 12, textAlign: 'left', fontFamily: 'Orbitron, monospace', letterSpacing: 1, textTransform: 'uppercase', textShadow: showRunicSubtitle ? '0 0 10px rgba(0,229,229,0.8)' : 'none', transition: 'text-shadow 160ms ease' }}>
                                    {showRunicSubtitle ? toRunicText(section.title) : section.title}
                                </div>

                                <div style={{ color: '#b8f6ff', fontSize: 13, textAlign: 'left', fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.6 }}>
                                    {section.text}
                                </div>
                            </div>

                            <div style={{ width: isMobile ? '100%' : 220, height: isMobile ? 220 : 'auto', maxWidth: isMobile ? '100%' : '30%', minWidth: isMobile ? 0 : 190, border: '2px solid rgba(0,229,229,0.95)', borderRadius: 18, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 18px rgba(0,229,229,0.45), inset 0 0 10px rgba(0,229,229,0.2)' }}>
                                <img src={section.image} alt={section.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                                <div className="signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                                <div className="signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                                <div className="signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                                <div className="scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                                <div className="scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {!isMobile && (
                    <div className="floating-right" style={{ width: sidePanelWidth, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, padding: '0 12px' }}>
                        <div style={{ width: '100%', height: '72%', minHeight: 360, border: '2px solid rgba(0,229,229,0.95)', borderRadius: 16, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', opacity: booting ? 0 : 1, transform: booting ? 'scale(0.92) translateY(20px)' : 'scale(1) translateY(0)', boxShadow: booting ? '0 0 40px rgba(0,229,229,0.75), inset 0 0 20px rgba(0,229,229,0.35)' : '0 0 22px rgba(0,229,229,0.35), inset 0 0 12px rgba(0,229,229,0.2)', transition: 'opacity 620ms ease, transform 620ms ease, box-shadow 620ms ease' }}>
                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: booting ? 0.72 : 0.18, transition: 'opacity 620ms ease' }} />
                            <div style={{ position: 'absolute', left: 0, right: 0, height: 62, top: booting ? '-24%' : '130%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,229,229,0) 0%, rgba(0,229,229,0.4) 50%, rgba(0,229,229,0) 100%)', transition: 'top 780ms ease' }} />
                            <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(0,229,229,0.38)', borderRadius: 10, boxShadow: 'inset 0 0 18px rgba(0,229,229,0.2)' }} />
                            <CharacterSkillMap key={section.title} profile={skillProfile} lang={lang} />
                            <div className="signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                            <div className="signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                            <div className="scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <MatrixRain key={`right-${index}`} columns={12} speed={55} />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ height: isMobile ? 20 : 80, background: 'transparent', flexShrink: 0 }} />

            <div style={{ height: isMobile ? 16 : 67, background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, fontWeight: 700 }} />

            <div style={{ height: isMobile ? 20 : 76, background: 'transparent', color: '#b8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, fontWeight: 700, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 76, background: 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }} />
            </div>
        </div>
    );
}
