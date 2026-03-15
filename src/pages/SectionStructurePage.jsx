import React, { useEffect, useState } from 'react';

const structureStyles = `
    @keyframes tdFloatLeft {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-8px) scale(1); }
    }
    @keyframes tdFloatCenter {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-12px) scale(1); }
    }
    @keyframes tdFloatRight {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-10px) scale(1); }
    }
    @keyframes tdSignalNoise {
        0% { transform: translate3d(0, 0, 0); opacity: 0.18; }
        20% { transform: translate3d(-1px, 1px, 0); opacity: 0.26; }
        40% { transform: translate3d(1px, -1px, 0); opacity: 0.14; }
        60% { transform: translate3d(-1px, 0px, 0); opacity: 0.22; }
        80% { transform: translate3d(1px, 1px, 0); opacity: 0.16; }
        100% { transform: translate3d(0, 0, 0); opacity: 0.2; }
    }
    @keyframes tdSignalShift {
        0%, 100% { transform: translateX(0); opacity: 0.35; }
        25% { transform: translateX(-2px); opacity: 0.45; }
        50% { transform: translateX(2px); opacity: 0.3; }
        75% { transform: translateX(-1px); opacity: 0.42; }
    }
    @keyframes tdSignalFlicker {
        0%, 100% { opacity: 0.15; }
        10% { opacity: 0.3; }
        22% { opacity: 0.12; }
        36% { opacity: 0.28; }
        58% { opacity: 0.18; }
        79% { opacity: 0.34; }
    }
    @keyframes tdScanVerticalA {
        0% { transform: translateX(-18%); opacity: 0.06; }
        50% { opacity: 0.2; }
        100% { transform: translateX(118%); opacity: 0.08; }
    }
    @keyframes tdScanVerticalB {
        0% { transform: translateX(118%); opacity: 0.05; }
        45% { opacity: 0.16; }
        100% { transform: translateX(-18%); opacity: 0.07; }
    }
    .td-floating-left { animation: tdFloatLeft 4.5s ease-in-out infinite; }
    .td-floating-center { animation: tdFloatCenter 5.2s ease-in-out infinite; }
    .td-floating-right { animation: tdFloatRight 4.8s ease-in-out infinite; }
    .td-signal-noise { animation: tdSignalNoise 180ms steps(3, end) infinite; }
    .td-signal-shift { animation: tdSignalShift 240ms steps(2, end) infinite; }
    .td-signal-flicker { animation: tdSignalFlicker 1.35s steps(6, end) infinite; }
    .td-scan-vertical-a { animation: tdScanVerticalA 2.6s linear infinite; }
    .td-scan-vertical-b { animation: tdScanVerticalB 3.4s linear infinite; }
    /* Global custom scrollbar styling - Apply to all scrollable elements */
    *::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    *::-webkit-scrollbar-track {
        background: rgba(0, 229, 229, 0.08);
        border-radius: 5px;
    }
    *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(0, 229, 229, 0.9) 0%, rgba(0, 200, 200, 0.7) 100%);
        border-radius: 5px;
        border: 2px solid rgba(0, 229, 229, 0.3);
        box-shadow: 0 0 10px rgba(0, 229, 229, 0.8), inset 0 0 6px rgba(0, 229, 229, 0.5);
    }
    *::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(0, 229, 229, 1) 0%, rgba(0, 200, 200, 0.9) 100%);
        box-shadow: 0 0 15px rgba(0, 229, 229, 1), inset 0 0 8px rgba(0, 229, 229, 0.7);
    }
    *::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, rgba(0, 229, 229, 1) 0%, rgba(0, 200, 200, 1) 100%);
        box-shadow: 0 0 20px rgba(0, 229, 229, 1), inset 0 0 10px rgba(0, 229, 229, 0.9);
    }
    /* Firefox scrollbar */
    * {
        scrollbar-color: rgba(0, 229, 229, 0.7) rgba(0, 229, 229, 0.1);
        scrollbar-width: thin;
    }
`;

if (typeof document !== 'undefined' && !document.getElementById('td-section-structure-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'td-section-structure-styles';
    styleSheet.textContent = structureStyles;
    document.head.appendChild(styleSheet);
}

function generateMatrixColumn() {
    const chars = ['0', '1', '|0⟩', '|1⟩', '|+⟩', '|-⟩', 'Ψ', 'Φ', '∞', '⊗', '⊕', '∧', '∨', '¬', '∀', '∃', '◈', '◆', '●', '○'];
    const length = Math.floor(Math.random() * 12) + 8;
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]);
}

function createInitialStreams(columns) {
    return Array.from({ length: columns }, (_, index) => ({
        id: index,
        left: `${(index / columns) * 100}%`,
        chars: generateMatrixColumn(),
        top: -Math.random() * 100
    }));
}

function MatrixRain({ columns = 12, speed = 50, color = '#00e5e5' }) {
    const [streams, setStreams] = useState(() => createInitialStreams(columns));

    useEffect(() => {
        const interval = setInterval(() => {
            setStreams((prev) => prev.map((stream) => {
                const nextTop = stream.top >= 100 ? -50 : stream.top + 0.5;
                return {
                    ...stream,
                    top: nextTop,
                    chars: nextTop <= -45 ? generateMatrixColumn() : stream.chars
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
                        color,
                        textShadow: `0 0 8px ${color}`,
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

function HoloImagePanel({ image, alt, color = '#00e5e5', matrixKey, panelHeight = '72%', panelMinHeight = 360, panelWidth = 354, showImage = true, children }) {
    return (
        <div className="td-floating-left" style={{ width: panelWidth, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, padding: '0 12px' }}>
            <div style={{ width: '100%', height: panelHeight, minHeight: panelMinHeight, border: `2px solid ${color}`, borderRadius: 16, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', boxShadow: `0 0 22px ${color}55, inset 0 0 12px ${color}33`, display: 'flex', flexDirection: 'column', padding: children ? 12 : 0 }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: 0.18 }} />
                <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(0,229,229,0.38)', borderRadius: 10, boxShadow: 'inset 0 0 18px rgba(0,229,229,0.2)' }} />
                <div className="td-signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                <div className="td-signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                <div className="td-signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                <div className="td-scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                <div className="td-scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                <MatrixRain key={matrixKey} columns={12} speed={55} color={color} />
                {children ? (
                    <div style={{ position: 'relative', zIndex: 20, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
                        {children}
                    </div>
                ) : (
                    <>
                        {showImage && image && (
                            <img src={image} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function SectionStructurePage({
    title,
    subtitle,
    paragraphs = [],
    leftImage,
    centerImage,
    rightImage,
    rightPanelImageOverride = null,
    tabs = [],
    accentColor = '#00e5e5',
    emptyLabel = 'Contenido en desarrollo',
    leftPanelHeight = '72%',
    leftPanelMinHeight = 360,
    leftPanelContent = null,
    hideRightPanelImage = false,
    tabsContainerHeight = 80,
    tabsContainerPadding = '0 24px',
    tabsGap = 24,
    tabsButtonPadding = '8px 28px',
    bottomSpacer1Height = 67,
    bottomSpacer2Height = 76,
    centerPanelMinHeight = 340,
    centerPanelMaxHeight = 'calc(100vh - 230px)',
    centerImageHeight = 220,
    showCenterImage = true,
    centerPanelPadding = 24,
    centerPanelVariant = 'default',
    tabsPlacement = 'bottom',
    showRightPanelTabs = true,
    hideTabsOnMobile = false,
    selectedTabIndex = null,
    onSelectedTabChange = null
}) {
    const [internalSelectedTab, setInternalSelectedTab] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1366));

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isTablet = viewportWidth < 1320;
    const isMobile = viewportWidth < 1024;
    const effectiveTabsPlacement = isMobile && (tabsPlacement === 'left-panel' || tabsPlacement === 'right-panel')
        ? 'bottom'
        : tabsPlacement;
    const sidePanelWidth = isTablet ? 276 : 354;
    const topBarHeight = isMobile ? 52 : 80;
    const computedCenterPadding = isMobile ? 14 : centerPanelPadding;
    const computedCenterMinHeight = isMobile ? Math.min(centerPanelMinHeight, 420) : centerPanelMinHeight;
    const computedCenterMaxHeight = isMobile ? 'calc(100vh - 165px)' : centerPanelMaxHeight;
    const computedBottomSpacer1Height = isMobile ? 18 : bottomSpacer1Height;
    const computedBottomSpacer2Height = isMobile ? 24 : bottomSpacer2Height;

    const selectedTab = selectedTabIndex ?? internalSelectedTab;
    const setSelectedTab = (index) => {
        if (typeof onSelectedTabChange === 'function') {
            onSelectedTabChange(index);
        }

        if (selectedTabIndex === null || selectedTabIndex === undefined) {
            setInternalSelectedTab(index);
        }
    };

    const activeTab = tabs[selectedTab] || null;
    const contentTitle = activeTab?.title || title;
    const contentParagraphs = activeTab?.paragraphs || paragraphs;
    const contentImage = activeTab?.centerImage || centerImage;
    const leftPanelImage = activeTab?.leftImage || leftImage;
    const rightPanelImage = rightPanelImageOverride || activeTab?.rightImage || rightImage;
    const contentMetaChips = activeTab?.metaChips || [];
    const contentBeatPoints = activeTab?.beatPoints || [];
    const contentQuote = activeTab?.quote || '';
    const contentCtaButtons = activeTab?.ctaButtons || [];

    return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'transparent', color: 'white', fontFamily: 'Orbitron, monospace', overflow: 'hidden' }}>
            <div style={{ height: topBarHeight, background: 'transparent', color: '#b8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: isMobile ? '0 14px' : '0 40px', fontSize: isMobile ? 14 : 18, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
                {!isMobile && (
                    <HoloImagePanel
                        image={leftPanelImage}
                        alt={`${contentTitle} panel izquierdo`}
                        color={accentColor}
                        matrixKey={`left-${selectedTab}`}
                        panelHeight={isTablet ? '68%' : leftPanelHeight}
                        panelMinHeight={isTablet ? 300 : leftPanelMinHeight}
                        panelWidth={sidePanelWidth}
                        showImage={false}
                    >
                        {effectiveTabsPlacement === 'left-panel' ? (
                            <div style={{ position: 'absolute', inset: 10, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, pointerEvents: 'auto' }}>
                                {tabs.map((tab, index) => (
                                    <div
                                        key={`left-tab-${tab.title}`}
                                        onClick={() => setSelectedTab(index)}
                                        style={{
                                            position: 'relative',
                                            width: '88%',
                                            alignSelf: 'center',
                                            color: selectedTab === index ? accentColor : '#5dfdfd',
                                            border: `2px solid ${selectedTab === index ? accentColor : '#5dfdfd'}`,
                                            borderRadius: 6,
                                            padding: tabsButtonPadding,
                                            fontSize: 14,
                                            fontFamily: 'Orbitron, monospace',
                                            cursor: 'pointer',
                                            transition: 'all 300ms ease',
                                            background: selectedTab === index ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
                                            backdropFilter: selectedTab === index ? 'blur(8px)' : 'none',
                                            boxShadow: selectedTab === index ? `0 0 12px ${accentColor}88, inset 0 0 8px ${accentColor}33` : 'none',
                                            userSelect: 'none',
                                            overflow: 'hidden',
                                            textTransform: 'uppercase',
                                            lineHeight: 1.1,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <span style={{ position: 'relative', zIndex: 1 }}>{tab.label || tab.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : leftPanelContent}
                    </HoloImagePanel>
                )}

                <div className="td-floating-center" style={{ flex: 1, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: isMobile ? 'calc(100% - 16px)' : 'calc(100% - 120px)', maxWidth: 1100, border: `2px solid ${accentColor}`, borderRadius: 18, padding: computedCenterPadding, background: 'rgba(0,0,0,0.2)', color: '#b8f6ff', position: 'relative', minHeight: computedCenterMinHeight, maxHeight: computedCenterMaxHeight, backdropFilter: 'blur(8px)', overflow: 'hidden', boxShadow: `0 0 28px ${accentColor}55, inset 0 0 16px ${accentColor}33`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: 0.18 }} />
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 18, border: '1px solid rgba(0,229,229,0.35)', boxShadow: 'inset 0 0 24px rgba(0,229,229,0.18)' }} />

                        {showCenterImage && centerPanelVariant !== 'narrative-dense' && (
                            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 18, height: centerImageHeight, margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 32, fontFamily: 'Orbitron, monospace', letterSpacing: 2, backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={contentImage} alt={contentTitle} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                                <div className="td-signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                                <div className="td-signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                                <div className="td-signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                                <div className="td-scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                                <div className="td-scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            </div>
                        )}

                        {centerPanelVariant === 'narrative-dense' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: contentImage ? (isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(220px, 34%)') : 'minmax(0, 1fr)', gap: 12, alignItems: 'stretch' }}>
                                    <div style={{ border: `1px solid ${accentColor}66`, borderRadius: 10, background: 'linear-gradient(180deg, rgba(0,229,229,0.08) 0%, rgba(0,0,0,0.16) 100%)', padding: '12px 14px', boxShadow: `inset 0 0 12px ${accentColor}22`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                                        <div>
                                            <div style={{ color: '#d7fcff', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Orbitron, monospace', marginBottom: 5, opacity: 0.9 }}>
                                                {subtitle || title}
                                            </div>
                                            <div style={{ color: accentColor, fontSize: 20, letterSpacing: 1.1, textTransform: 'uppercase', fontFamily: 'Orbitron, monospace', fontWeight: 700, lineHeight: 1.15 }}>
                                                {contentTitle}
                                            </div>
                                        </div>

                                        {contentMetaChips.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {contentMetaChips.map((chip, index) => (
                                                    <span
                                                        key={`chip-${index}`}
                                                        style={{
                                                            border: `1px solid ${accentColor}88`,
                                                            color: '#c5fbff',
                                                            background: 'rgba(0,0,0,0.28)',
                                                            borderRadius: 999,
                                                            padding: '4px 10px',
                                                            fontSize: 11,
                                                            letterSpacing: 0.8,
                                                            fontFamily: 'Orbitron, monospace',
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        {chip}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {contentImage && (
                                        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${accentColor}66`, minHeight: 132, background: 'rgba(0,0,0,0.25)' }}>
                                            <img src={contentImage} alt={contentTitle} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                                            <div className="td-signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                                            <div className="td-signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ color: '#b8f6ff', fontSize: 13, textAlign: 'left', fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.72, display: 'grid', gap: 10 }}>
                                    {contentParagraphs.length > 0 ? contentParagraphs.map((paragraph, index) => (
                                        <p key={index} style={{ margin: 0, padding: '10px 12px', borderLeft: `2px solid ${accentColor}aa`, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>
                                            {paragraph}
                                        </p>
                                    )) : <p style={{ margin: 0 }}>{emptyLabel}</p>}
                                </div>

                                {contentBeatPoints.length > 0 && (
                                    <div style={{ border: `1px solid ${accentColor}55`, borderRadius: 10, background: 'rgba(0,0,0,0.2)', padding: '10px 12px' }}>
                                        <div style={{ color: accentColor, fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.1, fontFamily: 'Orbitron, monospace' }}>
                                            Hitos narrativos
                                        </div>
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            {contentBeatPoints.map((beat, index) => (
                                                <div key={`beat-${index}`} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                    <span style={{ color: accentColor, fontSize: 11, fontFamily: 'Orbitron, monospace', minWidth: 22 }}>{`0${index + 1}`}</span>
                                                    <span style={{ color: '#bff8ff', fontSize: 12.5, fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.5 }}>{beat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {contentQuote && (
                                    <div style={{ borderTop: `1px dashed ${accentColor}88`, paddingTop: 10, color: '#d3fbff', fontStyle: 'italic', fontSize: 12.5, lineHeight: 1.6 }}>
                                        {`"${contentQuote}"`}
                                    </div>
                                )}

                                {contentCtaButtons.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: contentQuote ? 10 : 0 }}>
                                        {contentCtaButtons.map((btn, i) => (
                                            <a
                                                key={`cta-${i}`}
                                                href={btn.href || '#'}
                                                target={btn.href?.startsWith('http') ? '_blank' : undefined}
                                                rel={btn.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                onClick={btn.onClick}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 7,
                                                    padding: '9px 18px',
                                                    border: `2px solid ${btn.primary ? accentColor : accentColor + '88'}`,
                                                    borderRadius: 8,
                                                    background: btn.primary ? `${accentColor}22` : 'rgba(0,0,0,0.25)',
                                                    color: btn.primary ? accentColor : '#b8f6ff',
                                                    fontFamily: 'Orbitron, monospace',
                                                    fontSize: 11,
                                                    letterSpacing: 1.2,
                                                    textTransform: 'uppercase',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: btn.primary ? `0 0 14px ${accentColor}55` : 'none',
                                                    transition: 'all 200ms ease',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {btn.icon === 'star' && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#00e0ff" stroke="none" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px #00e0ffcc)' }}>
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                )}
                                                {btn.icon === 'box' && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px #00e0ffcc)' }}>
                                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                                    </svg>
                                                )}
                                                {btn.icon === 'mail' && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px #00e0ffcc)' }}>
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <polyline points="22,6 12,13 2,6" />
                                                    </svg>
                                                )}
                                                {btn.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div style={{ color: accentColor, fontWeight: 600, fontSize: 16, marginBottom: 12, textAlign: 'left', fontFamily: 'Orbitron, monospace', letterSpacing: 1, textTransform: 'uppercase', flexShrink: 0 }}>
                                    {subtitle || contentTitle}
                                </div>

                                <div style={{ color: '#b8f6ff', fontSize: 13, textAlign: 'left', fontFamily: 'Work Sans, Inter, sans-serif', lineHeight: 1.6, display: 'grid', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
                                    {contentParagraphs.length > 0 ? contentParagraphs.map((paragraph, index) => (
                                        <p key={index} style={{ margin: 0 }}>{paragraph}</p>
                                    )) : <p style={{ margin: 0 }}>{emptyLabel}</p>}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {!isMobile && (
                    <div className="td-floating-right" style={{ width: sidePanelWidth, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, padding: '0 12px' }}>
                        <div style={{ width: '100%', height: '72%', minHeight: 360, border: `2px solid ${accentColor}`, borderRadius: 16, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden', boxShadow: `0 0 22px ${accentColor}55, inset 0 0 12px ${accentColor}33` }}>
                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(to bottom, rgba(0,229,229,0.08) 0px, rgba(0,229,229,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)', opacity: 0.18 }} />
                            <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(0,229,229,0.38)', borderRadius: 10, boxShadow: 'inset 0 0 18px rgba(0,229,229,0.2)' }} />
                            {!hideRightPanelImage && rightPanelImage && (
                                <img src={rightPanelImage} alt={`${contentTitle} panel derecho`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'contrast(1.12) saturate(0.85) brightness(0.88)' }} />
                            )}
                            <div className="td-signal-noise" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, rgba(255,255,255,0.04) 2px, rgba(0,0,0,0) 4px)' }} />
                            <div className="td-signal-shift" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(255,0,120,0.08) 0%, rgba(0,229,229,0.12) 48%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="td-signal-flicker" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, rgba(0,229,229,0.2) 0%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.5) 100%)' }} />
                            <div className="td-scan-vertical-a" style={{ position: 'absolute', top: 0, bottom: 0, left: '-12%', width: '14%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,229,229,0.08) 45%, rgba(255,255,255,0.3) 50%, rgba(0,229,229,0.08) 55%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <div className="td-scan-vertical-b" style={{ position: 'absolute', top: 0, bottom: 0, left: '-10%', width: '9%', zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,0,150,0.12) 50%, rgba(0,0,0,0) 100%)', mixBlendMode: 'screen' }} />
                            <MatrixRain key={`right-${selectedTab}`} columns={12} speed={55} color={accentColor} />

                            {effectiveTabsPlacement === 'right-panel' && showRightPanelTabs && (
                                <div style={{ position: 'absolute', inset: 10, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, pointerEvents: 'auto' }}>
                                    {tabs.map((tab, index) => (
                                        <div
                                            key={`right-tab-${tab.title}`}
                                            onClick={() => setSelectedTab(index)}
                                            style={{
                                                position: 'relative',
                                                width: '88%',
                                                alignSelf: 'center',
                                                color: selectedTab === index ? accentColor : '#5dfdfd',
                                                border: `2px solid ${selectedTab === index ? accentColor : '#5dfdfd'}`,
                                                borderRadius: 6,
                                                padding: tabsButtonPadding,
                                                fontSize: 14,
                                                fontFamily: 'Orbitron, monospace',
                                                cursor: 'pointer',
                                                transition: 'all 300ms ease',
                                                background: selectedTab === index ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
                                                backdropFilter: selectedTab === index ? 'blur(8px)' : 'none',
                                                boxShadow: selectedTab === index ? `0 0 12px ${accentColor}88, inset 0 0 8px ${accentColor}33` : 'none',
                                                userSelect: 'none',
                                                overflow: 'hidden',
                                                textTransform: 'uppercase',
                                                lineHeight: 1.1
                                            }}
                                        >
                                            <span style={{ position: 'relative', zIndex: 1 }}>{tab.label || tab.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {effectiveTabsPlacement !== 'right-panel' && effectiveTabsPlacement !== 'left-panel' && !(isMobile && hideTabsOnMobile) && (
                <div style={{ height: isMobile ? 'auto' : tabsContainerHeight, minHeight: isMobile ? 56 : 'auto', background: 'transparent', display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center', alignItems: 'center', gap: isMobile ? 10 : tabsGap, flexShrink: 0, padding: isMobile ? '8px 10px' : tabsContainerPadding, flexWrap: 'wrap' }}>
                    {tabs.map((tab, index) => (
                        <div
                            key={tab.title}
                            onClick={() => setSelectedTab(index)}
                            style={{
                                position: 'relative',
                                color: selectedTab === index ? accentColor : '#5dfdfd',
                                border: `2px solid ${selectedTab === index ? accentColor : '#5dfdfd'}`,
                                borderRadius: 6,
                                padding: tabsButtonPadding,
                                fontSize: isMobile ? 12 : 16,
                                fontFamily: 'Orbitron, monospace',
                                cursor: 'pointer',
                                transition: 'all 300ms ease',
                                background: selectedTab === index ? 'rgba(0,0,0,0.2)' : 'transparent',
                                backdropFilter: selectedTab === index ? 'blur(8px)' : 'none',
                                boxShadow: selectedTab === index ? `0 0 12px ${accentColor}88, inset 0 0 8px ${accentColor}33` : 'none',
                                userSelect: 'none',
                                overflow: 'hidden',
                                textTransform: 'uppercase'
                            }}
                        >
                            <span style={{ position: 'relative', zIndex: 1 }}>{tab.label || tab.title}</span>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ height: computedBottomSpacer1Height, background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, fontWeight: 700 }} />

            <div style={{ height: computedBottomSpacer2Height, background: 'transparent', color: '#b8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, letterSpacing: 2, fontFamily: 'Orbitron, monospace', flexShrink: 0, fontWeight: 700, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 76, background: 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }} />
            </div>
        </div>
    );
}
