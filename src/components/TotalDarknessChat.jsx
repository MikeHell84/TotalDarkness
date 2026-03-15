import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../services/aiChatService';
import { useLanguage } from '../context/LanguageContext';

/* ── Inject CSS once ─────────────────────────────────────── */
const CHAT_CSS = `
@keyframes tdchat-scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes tdchat-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(0,224,255,0.5), 0 0 24px rgba(0,224,255,0.2); }
  50%       { box-shadow: 0 0 20px rgba(0,224,255,0.8), 0 0 40px rgba(0,224,255,0.35); }
}
@keyframes tdchat-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@keyframes tdchat-fadein {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tdchat-typing {
  0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
  40%         { transform: scale(1.0); opacity: 1; }
}
.tdchat-fab { animation: tdchat-pulse 2.5s ease-in-out infinite; }
.tdchat-msg { animation: tdchat-fadein 0.25s ease-out both; }
.tdchat-dot1 { animation: tdchat-typing 1.2s 0.0s infinite; }
.tdchat-dot2 { animation: tdchat-typing 1.2s 0.2s infinite; }
.tdchat-dot3 { animation: tdchat-typing 1.2s 0.4s infinite; }
.tdchat-cursor { animation: tdchat-blink 1s step-start infinite; }
`;

if (typeof document !== 'undefined' && !document.getElementById('tdchat-styles')) {
    const s = document.createElement('style');
    s.id = 'tdchat-styles';
    s.textContent = CHAT_CSS;
    document.head.appendChild(s);
}

/* ── Constants ───────────────────────────────────────────── */
const ACCENT = '#00e0ff';
const ACCENT_DIM = 'rgba(0,224,255,0.15)';
const BG_PANEL = 'rgba(4,12,20,0.97)';
const BG_USER_MSG = 'rgba(0,224,255,0.12)';
const BG_AI_MSG = 'rgba(255,30,60,0.08)';
const BORDER = '1px solid rgba(0,224,255,0.3)';
const MOBILE_BREAKPOINT = 768;
const FAB_SIZE = 56;
const FAB_TOP_SAFE = 86;
const FAB_BOTTOM_SAFE = 86;
const FAB_Y_STORAGE_KEY = 'td-enki-fab-y-ratio';
const CHAT_UI = {
    es: {
        welcome:
            'Registro iniciado. Soy ENKI, custodio del juicio y la memoria en Total Darkness. Observo el Código TIAMATU ENUMA y las rutas del exilio. Pregúntame sobre personajes, locaciones, capítulos, la Red Tormenthor o cualquier tecnicismo del lore.',
        senderUser: '// USUARIO',
        senderEnki: '// ENKI',
        noKeyTitle: '⚠ ENKI sin conexión',
        noKeyBody: 'Para activar el oráculo, añade tu clave de OpenRouter en',
        noKeyCta: '→ Obtener clave gratuita en openrouter.ai',
        noKeyNote: '(sin tarjeta de crédito)',
        panelSubtitle: 'Oráculo · Total Darkness',
        fabTitle: 'ENKI — Oráculo de Total Darkness',
        inputPlaceholder: 'Pregunta sobre el lore…',
        genericError: 'Error de conexión con el oráculo.',
    },
    en: {
        welcome:
            'Log initialized. I am ENKI, custodian of judgment and memory in Total Darkness. I observe the TIAMATU ENUMA Code and the routes of exile. Ask me about characters, locations, chapters, the Tormenthor Network, or any lore technicality.',
        senderUser: '// USER',
        senderEnki: '// ENKI',
        noKeyTitle: '⚠ ENKI offline',
        noKeyBody: 'To activate the oracle, add your OpenRouter key in',
        noKeyCta: '→ Get a free key at openrouter.ai',
        noKeyNote: '(no credit card required)',
        panelSubtitle: 'Oracle · Total Darkness',
        fabTitle: 'ENKI — Total Darkness Oracle',
        inputPlaceholder: 'Ask about the lore…',
        genericError: 'Connection error with the oracle.',
    },
};

function getBottomBlockedSpace() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return 0;

    const candidates = [
        ...document.querySelectorAll('nav, footer, [role="navigation"], [data-bottom-nav], [class*="bottom-nav"], [class*="timeline"], [class*="navigator"], [class*="hud"]'),
    ];

    let blocked = 0;
    for (const element of candidates) {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
        if (style.position !== 'fixed' && style.position !== 'sticky') continue;

        const rect = element.getBoundingClientRect();
        if (rect.height < 28) continue;
        if (rect.bottom < window.innerHeight - 2) continue;
        if (rect.top < window.innerHeight * 0.45) continue;

        blocked = Math.max(blocked, window.innerHeight - rect.top);
    }

    return Math.min(blocked, Math.floor(window.innerHeight * 0.4));
}

function clampFabY(value, blockedBottom = 0) {
    if (typeof window === 'undefined') return value;
    const min = FAB_TOP_SAFE;
    const max = Math.max(min, window.innerHeight - blockedBottom - FAB_BOTTOM_SAFE);
    return Math.max(min, Math.min(max, value));
}

/* ── Typing indicator ────────────────────────────────────── */
function TypingDots() {
    const dot = {
        display: 'inline-block',
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: ACCENT,
        margin: '0 2px',
    };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '4px 2px' }}>
            <span className="tdchat-dot1" style={dot} />
            <span className="tdchat-dot2" style={dot} />
            <span className="tdchat-dot3" style={dot} />
        </span>
    );
}

/* ── Single message bubble ───────────────────────────────── */
function MessageBubble({ msg, labels }) {
    const isUser = msg.role === 'user';
    return (
        <div
            className="tdchat-msg"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                marginBottom: 10,
            }}
        >
            <span
                style={{
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isUser ? ACCENT : '#ff4f6d',
                    marginBottom: 3,
                    opacity: 0.7,
                }}
            >
                {isUser ? labels.senderUser : labels.senderEnki}
            </span>
            <div
                style={{
                    maxWidth: '88%',
                    padding: '8px 12px',
                    borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: isUser ? BG_USER_MSG : BG_AI_MSG,
                    border: isUser
                        ? '1px solid rgba(0,224,255,0.25)'
                        : '1px solid rgba(255,30,60,0.2)',
                    color: '#e0f4ff',
                    fontSize: 13,
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    wordBreak: 'break-word',
                }}
            >
                {msg.content}
            </div>
        </div>
    );
}

/* ── No API key notice ───────────────────────────────────── */
function NoKeyNotice({ labels }) {
    return (
        <div
            style={{
                margin: '12px 0',
                padding: '12px 14px',
                background: 'rgba(255,200,0,0.07)',
                border: '1px solid rgba(255,200,0,0.3)',
                borderRadius: 8,
                color: '#ffd060',
                fontSize: 12,
                lineHeight: 1.6,
                fontFamily: 'monospace',
            }}
        >
            <strong>{labels.noKeyTitle}</strong>
            <br />
            {labels.noKeyBody} <code>Vercel Environment Variables</code>:
            <br />
            <code>OPENROUTER_API_KEY=sk-or-v1-...</code>
            <br />
            <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: ACCENT, textDecoration: 'underline' }}
            >
                {labels.noKeyCta}
            </a>
            &nbsp;{labels.noKeyNote}
        </div>
    );
}

/* ── Main Chat Component ─────────────────────────────────── */
export default function TotalDarknessChat() {
    const { lang } = useLanguage();
    const labels = CHAT_UI[lang] || CHAT_UI.es;
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'assistant', content: labels.welcome }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false));
    const [bottomBlockedSpace, setBottomBlockedSpace] = useState(() => (typeof window !== 'undefined' ? getBottomBlockedSpace() : 0));
    const [fabY, setFabY] = useState(() => {
        if (typeof window === 'undefined') return 340;
        const storedRatio = Number(window.localStorage.getItem(FAB_Y_STORAGE_KEY));
        if (Number.isFinite(storedRatio) && storedRatio > 0.05 && storedRatio < 0.95) {
            return Math.round(storedRatio * window.innerHeight);
        }
        return Math.round(window.innerHeight * 0.58);
    });
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const dragRef = useRef({
        active: false,
        startY: 0,
        startFabY: 0,
        moved: false,
    });

    useEffect(() => {
        setMessages((prev) => {
            if (prev.length === 1 && prev[0]?.role === 'assistant') {
                return [{ role: 'assistant', content: labels.welcome }];
            }
            return prev;
        });
    }, [labels.welcome]);

    /* Auto-scroll to bottom */
    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, open]);

    /* Focus input when panel opens */
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 150);
    }, [open]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const refreshLayout = () => {
            const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
            const blocked = getBottomBlockedSpace();
            setIsMobile(mobile);
            setBottomBlockedSpace(blocked);
            setFabY((prev) => clampFabY(prev, mobile ? blocked : 0));
        };

        refreshLayout();
        window.addEventListener('resize', refreshLayout, { passive: true });
        window.addEventListener('scroll', refreshLayout, { passive: true });
        const intervalId = window.setInterval(refreshLayout, 1200);

        return () => {
            window.removeEventListener('resize', refreshLayout);
            window.removeEventListener('scroll', refreshLayout);
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (!isMobile || typeof window === 'undefined') return;
        const ratio = Math.max(0, Math.min(1, fabY / window.innerHeight));
        window.localStorage.setItem(FAB_Y_STORAGE_KEY, String(ratio));
    }, [isMobile, fabY]);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg = { role: 'user', content: text };
        const history = [...messages, userMsg];
        setMessages(history);
        setInput('');
        setError(null);
        setLoading(true);

        try {
            // Only pass user/assistant messages (not the welcome if it's the first)
            const apiHistory = history.filter((m) => m.role !== 'system');
            const reply = await sendChatMessage(apiHistory, lang);
            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        } catch (err) {
            if (err.message === 'NO_API_KEY') {
                setError('no_key');
            } else {
                setError(err.message || labels.genericError);
            }
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, labels.genericError, lang]);

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleFabPointerDown = useCallback((e) => {
        if (!isMobile) return;
        const clientY = e.clientY ?? 0;
        dragRef.current = {
            active: true,
            startY: clientY,
            startFabY: fabY,
            moved: false,
        };
        if (e.currentTarget?.setPointerCapture && e.pointerId !== undefined) {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    }, [isMobile, fabY]);

    const handleFabPointerMove = useCallback((e) => {
        if (!isMobile || !dragRef.current.active) return;
        const clientY = e.clientY ?? 0;
        const delta = clientY - dragRef.current.startY;
        if (Math.abs(delta) > 6) {
            dragRef.current.moved = true;
        }
        setFabY(clampFabY(dragRef.current.startFabY + delta, bottomBlockedSpace));
        e.preventDefault();
    }, [isMobile, bottomBlockedSpace]);

    const handleFabPointerUp = useCallback((e) => {
        if (!isMobile || !dragRef.current.active) return;
        const moved = dragRef.current.moved;
        dragRef.current.active = false;
        if (e.currentTarget?.releasePointerCapture && e.pointerId !== undefined) {
            try {
                e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
                // noop
            }
        }
        if (!moved) {
            setOpen((v) => !v);
        }
    }, [isMobile]);

    const fabStyle = isMobile
        ? {
            position: 'fixed',
            top: fabY,
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 9999,
            width: 52,
            height: 74,
            borderRadius: '14px 0 0 14px',
            background: 'rgba(4,12,20,0.96)',
            border: `2px solid ${ACCENT}`,
            borderRight: 'none',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            touchAction: 'none',
            boxShadow: '0 0 20px rgba(0,224,255,0.35)',
        }
        : {
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: '50%',
            background: 'rgba(4,12,20,0.95)',
            border: `2px solid ${ACCENT}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            transition: 'transform 0.2s',
        };

    const panelStyle = isMobile
        ? {
            position: 'fixed',
            left: 8,
            right: 8,
            bottom: Math.max(8, bottomBlockedSpace + 8),
            zIndex: 9998,
            height: `min(76vh, calc(100vh - ${Math.max(20, bottomBlockedSpace + 20)}px))`,
            background: BG_PANEL,
            border: BORDER,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(0,224,255,0.15), 0 0 80px rgba(0,0,0,0.65)',
        }
        : {
            position: 'fixed',
            bottom: 96,
            right: 24,
            zIndex: 9998,
            width: 'min(380px, calc(100vw - 48px))',
            height: 'min(520px, calc(100vh - 140px))',
            background: BG_PANEL,
            border: BORDER,
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(0,224,255,0.15), 0 0 80px rgba(0,0,0,0.6)',
        };

    /* ── FAB button ────────────────────────────────────────── */
    const fab = (
        <button
            className="tdchat-fab"
            onClick={() => {
                if (!isMobile) setOpen((v) => !v);
            }}
            onPointerDown={handleFabPointerDown}
            onPointerMove={handleFabPointerMove}
            onPointerUp={handleFabPointerUp}
            title={labels.fabTitle}
            style={fabStyle}
            onMouseEnter={(e) => {
                if (!isMobile) e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                if (!isMobile) e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {/* Runic AI icon */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="11" stroke={ACCENT} strokeWidth="1.5" opacity="0.6" />
                <text x="13" y="18" textAnchor="middle" fontSize="14" fill={ACCENT} fontFamily="monospace">
                    ᚨ
                </text>
            </svg>
            {open && (
                <span
                    style={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#ff1e3c',
                        border: '2px solid #000',
                    }}
                />
            )}
        </button>
    );

    /* ── Chat Panel ────────────────────────────────────────── */
    const panel = open && (
        <div style={panelStyle}>
            {/* Header */}
            <div
                style={{
                    padding: '12px 16px',
                    borderBottom: BORDER,
                    background: ACCENT_DIM,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>ᚨ</span>
                    <div>
                        <div
                            style={{
                                color: ACCENT,
                                fontSize: 13,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                            }}
                        >
                            ENKI
                        </div>
                        <div style={{ color: 'rgba(0,224,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}>
                            {labels.panelSubtitle}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(0,224,255,0.6)',
                        cursor: 'pointer',
                        fontSize: 18,
                        lineHeight: 1,
                        padding: '2px 6px',
                    }}
                >
                    ×
                </button>
            </div>

            {/* Messages area */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '14px 14px 4px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0,224,255,0.2) transparent',
                }}
            >
                {error === 'no_key' && <NoKeyNotice labels={labels} />}

                {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} labels={labels} />
                ))}

                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div
                            style={{
                                padding: '8px 14px',
                                borderRadius: '12px 12px 12px 2px',
                                background: BG_AI_MSG,
                                border: '1px solid rgba(255,30,60,0.2)',
                            }}
                        >
                            <TypingDots />
                        </div>
                    </div>
                )}

                {error && error !== 'no_key' && (
                    <div
                        className="tdchat-msg"
                        style={{
                            color: '#ff4f6d',
                            fontSize: 12,
                            fontFamily: 'monospace',
                            padding: '6px 10px',
                            border: '1px solid rgba(255,79,109,0.3)',
                            borderRadius: 6,
                            marginBottom: 8,
                        }}
                    >
                        ⚠ {error}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div
                style={{
                    padding: '10px 12px',
                    borderTop: BORDER,
                    background: ACCENT_DIM,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-end',
                    flexShrink: 0,
                }}
            >
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={labels.inputPlaceholder}
                    disabled={loading}
                    rows={1}
                    style={{
                        flex: 1,
                        background: 'rgba(0,224,255,0.05)',
                        border: '1px solid rgba(0,224,255,0.25)',
                        borderRadius: 8,
                        color: '#e0f4ff',
                        fontSize: 13,
                        fontFamily: 'monospace',
                        padding: '8px 10px',
                        resize: 'none',
                        outline: 'none',
                        minHeight: 36,
                        maxHeight: 100,
                        overflowY: 'auto',
                        lineHeight: 1.5,
                        opacity: 1,
                    }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                    }}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    style={{
                        background: loading || !input.trim() ? 'rgba(0,224,255,0.1)' : ACCENT_DIM,
                        border: `1px solid ${loading || !input.trim() ? 'rgba(0,224,255,0.2)' : ACCENT}`,
                        borderRadius: 8,
                        color: loading || !input.trim() ? 'rgba(0,224,255,0.3)' : ACCENT,
                        cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                        padding: '8px 14px',
                        fontSize: 13,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: 'all 0.15s',
                        height: 36,
                    }}
                >
                    {loading ? '…' : '↑'}
                </button>
            </div>

            {/* Scanline decoration */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,224,255,0.015) 2px, rgba(0,224,255,0.015) 4px)',
                    borderRadius: 14,
                }}
            />
        </div>
    );

    return (
        <>
            {panel}
            {fab}
        </>
    );
}
