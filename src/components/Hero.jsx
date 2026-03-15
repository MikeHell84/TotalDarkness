import React from 'react';

export default function Hero({ title, subtitle, ctaText = 'Explora nuestros servicios', onCta }) {
    return (
        <section className="relative bg-gradient-to-b from-black to-gray-900 text-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    {subtitle}
                </p>
                <button
                    onClick={onCta}
                    className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-all duration-200"
                >
                    {ctaText}
                </button>
            </div>
        </section>
    );
}
import React from 'react';

export default function Hero({ title, subtitle, ctaText = 'Explora nuestros servicios', onCta }) {
    import React from 'react';

    export default function Hero({ title, subtitle, ctaText = 'Explora nuestros servicios', onCta }) {
        return (
            <section className="relative bg-gradient-to-b from-black to-gray-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        {subtitle}
                    </p>
                    <button
                        onClick={onCta}
                        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-all duration-200"
                    >
                        {ctaText}
                        import React from 'react';

                        export default function Hero({title, subtitle, ctaText = 'Explora nuestros servicios', onCta}) {
                        return (
                        <section className="relative bg-gradient-to-b from-black to-gray-900 text-white py-20">
                            <div className="container mx-auto px-6 text-center">
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                                    {title}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                                    {subtitle}
                                </p>
                                <button
                                    onClick={onCta}
                                    className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-all duration-200"
                                >
                                    {ctaText}
                                </button>
                            </div>
                        </section>
                        );
                    }
