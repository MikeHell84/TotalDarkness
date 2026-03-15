import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function SiteNav({ onNavReady, variant = 'full', onLogoClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [empresaOpen, setEmpresaOpen] = useState(false);
    const [recursosOpen, setRecursosOpen] = useState(false);
    const [herramientasOpen, setHerramientasOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [servicesDesktopOpen, setServicesDesktopOpen] = useState(false);
    const servicesCloseTimer = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { lang, setLang, t } = useLanguage();

    // Helper: return a readable fallback when translation key is missing
    const safeT = (key, fallback) => {
        try {
            const v = t(key);
            if (!v || v === key) return fallback;
            return v;
        } catch (e) {
            return fallback;
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const navTo = (id) => {
        // Debugging helpers to verify clicks reach this handler
        try {
            console.log('[SiteNav] navTo called:', id);
            document.title = `nav:${id}`;
        } catch (e) {
            // ignore
        }
        setMobileMenuOpen(false);
        const safeScrollTo = (top, attempt = 0) => {
            const native = (window.__XLERION_ORIG_SCROLL_TO) ? window.__XLERION_ORIG_SCROLL_TO : window.scrollTo;
            if (window.__XLERION_BLOCK_SCROLL && attempt < 8) {
                // Retry after a short delay while the target page controls scroll
                setTimeout(() => safeScrollTo(top, attempt + 1), 300);
                return;
            }
            try {
                native({ top, behavior: 'smooth' });
            } catch (e) {
                try { native(0, top); } catch (e2) { /* ignore */ }
            }
        };

        if (window.location.pathname !== '/') {
            navigate('/');
            // Give React Router time to render the home route before querying DOM
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) safeScrollTo(el.offsetTop - 80);
            }, 300);
        } else {
            const el = document.getElementById(id);
            if (el) safeScrollTo(el.offsetTop - 80);
        }
    };

    useEffect(() => {
        if (typeof onNavReady === 'function') onNavReady(navTo);
    }, [onNavReady]);

    const navVisualClass = variant === 'logo-only'
        ? 'bg-transparent border-transparent'
        : `${scrolled ? 'bg-black/80' : 'bg-black/50'} backdrop-blur-sm border-b border-[#00e9fa]/30`;

    const navStyle = variant === 'logo-only'
        ? undefined
        : { boxShadow: '0 1px 10px rgba(0, 233, 250, 0.3)' };

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 h-14 ${navVisualClass}`} style={navStyle}>
                <div className="w-full h-14 px-4 md:px-8 flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3 cursor-pointer relative z-50"
                        onClick={(e) => {
                            if (variant === 'logo-only') {
                                e.preventDefault();
                                if (typeof onLogoClick === 'function') onLogoClick();
                                return;
                            }
                            if (typeof onLogoClick === 'function') {
                                const shouldPrevent = onLogoClick() === true;
                                if (shouldPrevent) {
                                    e.preventDefault();
                                }
                            }
                        }}
                    >
                        <img src="/LogoX.svg" alt="Xlerion" className="h-9 md:h-10 object-contain" />
                    </Link>

                    {variant === 'full' && (
                        <div className="hidden lg:flex items-center gap-10 text-[13px] font-work uppercase tracking-[0.2em] font-light">
                            {/* Empresa dropdown consolidated below; removed duplicate */}

                            {/* Reordered nav to match requested sitemap: Servicios, Toolkit, Proyectos, Documentación, Blog, Empresa, Contacto */}
                            <div
                                className="relative group"
                                onMouseEnter={() => { if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null; } setServicesDesktopOpen(true); }}
                                onMouseLeave={() => { if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = setTimeout(() => { setServicesDesktopOpen(false); servicesCloseTimer.current = null; }, 180); }}
                                onFocus={() => { if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null; } setServicesDesktopOpen(true); }}
                                onBlur={() => { if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = setTimeout(() => { setServicesDesktopOpen(false); servicesCloseTimer.current = null; }, 180); }}
                            >
                                <button
                                    onClick={() => setServicesDesktopOpen(v => !v)}
                                    className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors"
                                    aria-haspopup="true"
                                    aria-expanded={servicesDesktopOpen}
                                >
                                    {safeT('nav_services', 'Servicios')}
                                </button>

                                {/* Dropdown: render below the parent button so children are clearly under Services */}
                                <div className={`absolute left-0 top-full mt-0 ${servicesDesktopOpen ? 'block' : 'hidden'} lg:${servicesDesktopOpen ? 'block' : 'hidden'} z-50 transform translate-y-1`}>
                                    <div className="bg-black/85 backdrop-blur-sm rounded-md p-3 border border-[#00e9fa]/20 shadow-[0_10px_30px_rgba(0,0,0,0.45)] min-w-[220px] pointer-events-auto">
                                        <div className="flex flex-col gap-2 text-[13px] font-work uppercase tracking-[0.2em] font-light items-start">
                                            <button onMouseDown={() => { if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null; } setServicesDesktopOpen(false); navTo('servicios'); }} className="inline-flex items-center h-8 px-2 w-full text-left hover:text-[#00e9fa] transition-colors uppercase">{safeT('nav_all_services', 'Ver todos los servicios')}</button>
                                            <button onMouseDown={() => { if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null; } setServicesDesktopOpen(false); navigate('/recursos/publicidad'); }} className="inline-flex items-center h-8 px-2 w-full text-left hover:text-[#00e9fa] transition-colors uppercase">{safeT('nav_publicidad', 'Publicidad')}</button>
                                            <button onMouseDown={() => { if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null; } setServicesDesktopOpen(false); navigate('/cotizacion-servicios'); }} className="inline-flex items-center h-8 px-2 w-full text-left hover:text-[#00e9fa] transition-colors uppercase">{safeT('nav_cotizacion', 'Cotizaciones')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => navTo('toolkit')} className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_toolkit')}</button>

                            <button onClick={() => navTo('proyectos')} className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_projects')}</button>

                            <Link to="/portafolio" className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_portfolio')}</Link>

                            <button onClick={() => navTo('documentacion')} className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_docs')}</button>

                            <button onClick={() => navTo('blog')} className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_blog')}</button>

                            <div className="relative group">
                                <button className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_company')}</button>
                                <div className="absolute left-0 top-0 pt-12 hidden group-hover:block">
                                    <div className="bg-black/85 backdrop-blur-sm rounded-md p-3 border border-[#00e9fa]/20 shadow-[0_10px_30px_rgba(0,0,0,0.45)] min-w-[220px]">
                                        <div className="flex flex-col gap-3 text-[13px] font-work uppercase tracking-[0.2em] font-light items-start">
                                            <button onClick={() => { setMobileMenuOpen(false); navTo('identidad'); }} className="inline-flex items-center h-9 px-3 w-full text-left hover:text-[#00e9fa] transition-colors">{t('nav_identity')}</button>
                                            <button onClick={() => { setMobileMenuOpen(false); navTo('blog'); }} className="inline-flex items-center h-9 px-3 w-full text-left hover:text-[#00e9fa] transition-colors">{t('nav_blog')}</button>
                                            <button onClick={() => { setMobileMenuOpen(false); navTo('filosofia'); }} className="inline-flex items-center h-9 px-3 w-full text-left hover:text-[#00e9fa] transition-colors">{t('nav_philosophy')}</button>
                                            <button onClick={() => { setMobileMenuOpen(false); navTo('fundador'); }} className="inline-flex items-center h-9 px-3 w-full text-left hover:text-[#00e9fa] transition-colors">{t('founder_title')}</button>
                                            <button onClick={() => { setMobileMenuOpen(false); navTo('legal'); }} className="inline-flex items-center h-9 px-3 w-full text-left hover:text-[#00e9fa] transition-colors">{t('nav_legal')}</button>
                                            <button onClick={() => { navigate('/recursos/analiticas'); setMobileMenuOpen(false); }} className="inline-flex items-center h-9 px-3 w-full text-left hover:text-[#00e9fa] transition-colors">{t('nav_analytics') || 'Analíticas'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => navTo('contacto')} className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none hover:text-[#00e9fa] transition-colors">{t('nav_contact')}</button>

                            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                <button onClick={() => setLang('es')} className={`text-xs tracking-[0.25em] ${lang === 'es' ? 'text-[#00e9fa]' : 'text-gray-400'} hover:text-[#00e9fa]`}>{t('lang_es')}</button>
                                <span className="text-gray-600">/</span>
                                <button onClick={() => setLang('en')} className={`text-xs tracking-[0.25em] ${lang === 'en' ? 'text-[#00e9fa]' : 'text-gray-400'} hover:text-[#00e9fa]`}>{t('lang_en')}</button>
                            </div>
                        </div>
                    )}

                    {variant === 'full' && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <span className={`w-6 h-0.5 bg-[#00e9fa] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-[#00e9fa] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-[#00e9fa] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                    )}
                </div>
            </nav>

            {variant === 'full' && (
                <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-md transition-transform duration-500 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full flex flex-col items-center justify-center px-8 pt-20 pb-8 overflow-y-auto">
                        <div className="flex flex-col gap-6 text-center w-full max-w-sm">
                            {/* Mobile menu reordered to match sitemap: Toolkit, Servicios, Proyectos, Documentación, Blog, Empresa (Identidad/Fundador/Legal), Contacto */}
                            <button onClick={() => { setMobileMenuOpen(false); navTo('toolkit'); }} className="text-2xl font-work uppercase tracking-[0.2em] font-light hover:text-[#00e9fa] transition-colors">{t('nav_toolkit')}</button>
                            <div className="border-b border-white/10 pb-6">
                                <button
                                    onClick={() => setServicesOpen(!servicesOpen)}
                                    className="text-2xl font-work uppercase tracking-[0.2em] font-light text-[#00e9fa] mb-4 flex items-center justify-center gap-2 w-full"
                                >
                                    {safeT('nav_services', 'Servicios')}
                                    <span className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {servicesOpen && (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <button onClick={() => { setMobileMenuOpen(false); navTo('servicios'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{safeT('nav_all_services', 'Ver todos los servicios')}</button>
                                        <button onClick={() => { setMobileMenuOpen(false); navigate('/recursos/publicidad'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{safeT('nav_publicidad', 'Publicidad')}</button>
                                        <button onClick={() => { setMobileMenuOpen(false); navigate('/cotizacion-servicios'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{safeT('nav_cotizacion', 'Cotizaciones')}</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => { setMobileMenuOpen(false); navTo('proyectos'); }} className="text-2xl font-work uppercase tracking-[0.2em] font-light hover:text-[#00e9fa] transition-colors">{t('nav_projects')}</button>
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/portafolio'); }} className="text-2xl font-work uppercase tracking-[0.2em] font-light hover:text-[#00e9fa] transition-colors">{t('nav_portfolio')}</button>
                            <button onClick={() => { setMobileMenuOpen(false); navTo('documentacion'); }} className="text-2xl font-work uppercase tracking-[0.2em] font-light hover:text-[#00e9fa] transition-colors">{t('nav_docs')}</button>
                            <button onClick={() => { setMobileMenuOpen(false); navTo('blog'); }} className="text-2xl font-work uppercase tracking-[0.2em] font-light hover:text-[#00e9fa] transition-colors">{t('nav_blog')}</button>

                            <div className="border-b border-white/10 pb-6">
                                <button
                                    onClick={() => setEmpresaOpen(!empresaOpen)}
                                    className="text-2xl font-work uppercase tracking-[0.2em] font-light text-[#00e9fa] mb-4 flex items-center justify-center gap-2 w-full"
                                >
                                    {t('nav_company')}
                                    <span className={`transition-transform duration-300 ${empresaOpen ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {empresaOpen && (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <button onClick={() => { setMobileMenuOpen(false); navTo('identidad'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{t('nav_identity')}</button>
                                        <button onClick={() => { setMobileMenuOpen(false); navTo('fundador'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{t('founder_title')}</button>
                                        <button onClick={() => { setMobileMenuOpen(false); navTo('legal'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{t('nav_legal')}</button>
                                        <button onClick={() => { setMobileMenuOpen(false); navigate('/recursos/analiticas'); }} className="text-lg text-gray-300 hover:text-[#00e9fa] transition-colors uppercase tracking-wider">{t('nav_analytics') || 'Analíticas'}</button>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => { setMobileMenuOpen(false); navTo('contacto'); }} className="text-2xl font-work uppercase tracking-[0.2em] font-light hover:text-[#00e9fa] transition-colors border-t border-white/10 pt-6">{t('nav_contact')}</button>

                            <div className="flex items-center justify-center gap-3 text-lg font-mono uppercase tracking-[0.2em] pt-6">
                                <button onClick={() => { setLang('es'); setMobileMenuOpen(false); }} className={`transition-colors ${lang === 'es' ? 'text-[#00e9fa]' : 'text-gray-400 hover:text-[#00e9fa]'}`}>{t('lang_es')}</button>
                                <span className="text-gray-600">/</span>
                                <button onClick={() => { setLang('en'); setMobileMenuOpen(false); }} className={`transition-colors ${lang === 'en' ? 'text-[#00e9fa]' : 'text-gray-400 hover:text-[#00e9fa]'}`}>{t('lang_en')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
