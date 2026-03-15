import { useEffect } from 'react';

/**
 * Modern scroll animation hook using Intersection Observer
 * Applies smooth fade-in and slide-up animations to sections as they enter viewport
 * 
 * Features:
 * - Respects prefers-reduced-motion
 * - Staggered children animations
 * - Configurable thresholds and delays
 * - Clean observer management
 */
export default function useScrollAnimation({
    enabled = true,
    selector = 'section',
    threshold = 0.15,
    rootMargin = '0px 0px -100px 0px'
} = {}) {
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return;

        // Respect users who prefer reduced motion
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            // Skip animations but ensure visibility
            const sections = document.querySelectorAll(selector);
            sections.forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'none';
            });
            return;
        }

        const observerOptions = {
            threshold,
            rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const section = entry.target;

                // Add animation class to section
                section.classList.add('xl-animate-in');

                // Find and animate child elements with stagger
                const animatableChildren = section.querySelectorAll('.xl-card, .grid > *, .space-y-6 > *, .space-y-8 > *, .space-y-12 > *');

                if (animatableChildren.length > 0) {
                    animatableChildren.forEach((child, index) => {
                        // Add staggered delay
                        child.style.transitionDelay = `${index * 100}ms`;
                        child.classList.add('xl-child-animate-in');
                    });
                }

                // Unobserve after animation triggers
                observer.unobserve(section);
            });
        }, observerOptions);

        // Observe all matching sections
        const sections = document.querySelectorAll(selector);
        sections.forEach((section, index) => {
            // Skip hero section (#home) - it should be visible immediately
            if (section.id === 'home' || index === 0) {
                section.style.opacity = '1';
                section.style.transform = 'none';
                return;
            }

            // Set initial state for other sections
            section.classList.add('xl-animate-pending');
            observer.observe(section);
        });

        // Cleanup
        return () => observer.disconnect();
    }, [enabled, selector, threshold, rootMargin]);
}
