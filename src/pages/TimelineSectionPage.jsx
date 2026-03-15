import React from 'react';
import SectionStructurePage from './SectionStructurePage';
import { TimelineChapterList } from './TimelineView';


// Contenido real de la cronología (trilogy-content.txt)

const timelineTabs = [
    {
        title: 'Prólogo',
        label: 'Prólogo',
        paragraphs: [
            'CADA FIN TIENE UN COMIENZO',
            '"A lo largo de mi vida, he escuchado relatos que, en su momento, solo imaginaba de manera literal. Eran palabras, ideas, explicaciones que fluían sin mayor trascendencia. Pero nunca fui realmente consciente de lo que me decían. Ahora lo entiendo. Ahora comprendo que, entre esos relatos, había algo más: un mensaje velado, una verdad que siempre estuvo ahí, esperando ser reconocido. Y en lo más profundo de mí, sé que esto debía pasar." — Adamu',
            'Bitácora M840927 - Adamu',
            'El sonido de la guerra retumba en el aire, los gritos y exclamaciones de los soldados se ahogan bajo el fuego enemigo. Lo que alguna vez fue mi hogar, mi país, mi planeta, ahora no es más que cenizas sobre tierras y mares, un aire denso y caliente, impregnado del olor a muerte y desesperación. La tierra tiembla con la llegada de las grandes máquinas de guerra, que con sus disparos certeros agregan más sangre a la batalla, devorando a quienes quedan en pie. Escucho su comunicación, sonidos disruptivos y codificados, como una lengua que solo entienden entre ellos. Cada mensaje parece un veredicto de muerte, una orden que desintegra a los soldados sin piedad.',
            'Pero lo peor viene después. Las máquinas híbridas, criaturas de metal y carne, caminan entre los cuerpos, inspeccionando cada cadáver con precisión mecánica. Buscan algo. Entonces ocurre.',
            'Un sonido atroz invade el campo de batalla: el crujido desgarrador de huesos triturados, el sonido inconfundible de la carne siendo destrozada. Absorben los restos humanos, procesándolos en sus sistemas, buscando el gen perdido, tratando de reconstruir el código "Tiamatu Enuma" o "Génesis". Su eficacia es abrumadora. Pronto restaurarán el código origen, y cuando lo hagan… La humanidad estará perdida para siempre.',
            'La misión es clara: llegar al centro de operaciones Xlerion, buscarla, destruirla. Pero hay un problema…',
            'Estoy paralizado ante la muerte. Ella me observa, con una mirada fría, inmutable, pero en sus ojos veo un pasado que nunca viví. Y sin embargo, siempre estuve ahí. Desde el principio.',
            'Fue en ese instante cuando comprendí la clave para elegir nuestro propio destino. O aceptar una sentencia de muerte. Fin de la bitácora M840927'
        ],
        centerImage: '/assets/timeline-center.jpg',
        leftImage: '/assets/timeline-left.jpg',
        rightImage: '/assets/timeline-right.jpg'
    },
    {
        title: 'Capítulo I',
        label: 'Cap. I',
        paragraphs: [
            'MÚLTIPLES ORÍGENES',
            'El universo, un ente gigantesco e incalculable, ha sido el hogar de innumerables formas de vida desde tiempos inmemoriales. En su vastedad, los humanos, los seres vivos y otras sociedades coexisten, compartiendo su existencia entre las infinitas estrellas. Durante eones, los planetas dieron cobijo a civilizaciones inimaginables, cada una adaptada a las fuerzas que regían su mundo. Hubo mundos donde la gravedad era tan intensa que sus habitantes se alzaban como titanes, de proporciones colosales. En otros, la naturaleza les forzó a volverse pequeños, evolucionando con armaduras naturales, exoesqueletos diseñados para sobrevivir a las condiciones hostiles de sus tierras. Todo funcionaba en armonía al principio…',
            'Pero con el tiempo, tras incontables eras, algo emergió desde lo desconocido. Una anomalía. Una raza nueva, una existencia distinta, algo que no debía ser. Su propósito en el universo desafiaría el orden, alteraría el flujo de la vida como nunca antes se había visto. Y con su llegada, el equilibrio que había perdurado desde la creación… se tambaleó.',
            'Una raza basada en la codicia, capaz de romper cualquier equilibrio, atravesó los límites de los mundos. Su existencia no era simplemente un parásito. Ellos crearon el sistema parasitario. No se conformaban con invadir y destruir. Moldearon la esencia del universo para alimentar su expansión, tejiendo una estructura donde el poder, la manipulación y la extracción de recursos de otras civilizaciones eran inevitables. Tomaban formas camaleónicas, infiltrándose en comunidades y sociedades, corrompiendo sus fundamentos, sembrando pensamientos contrarios a la esencia del cosmos. Las civilizaciones cayeron una por una, absorbidas por la red invisible que habían tejido. Los mundos, antes fértiles y vibrantes, se consumían, hasta quedar secos e invivibles. El orden del universo se fracturó. Los dioses, forjadores del todo, no podían permitirlo. Entonces, tomaron una decisión sin precedentes. El Gran Diluvio Universal sería la última respuesta, una contingencia extrema para eliminar la plaga de raíz. Pero antes de ejecutar su ira, enviaron un mensaje a sus creaciones. Un arca recolectaría los genes de todas las especies evolucionadas, resguardando la esencia de la vida en un planeta equilibrado, capaz de albergarlas sin peligro.',
            'Ese planeta fue la Tierra. Así, el universo fue bañado por la ira de los dioses. Los planetas infectados fueron destruidos, erradicando la plaga. El tiempo transcurrió, y de las semillas de la creación surgió una especie particular. A diferencia de las demás, podía relacionarse con los otros seres con facilidad. Pero lo más sorprendente... Es que creó conciencia. Primitiva, incierta, pero la crearon. El primer destello de una nueva era. Un cambio irreversible en el universo.',
            'Su nombre fue Adapa, el primer hombre. Junto a él apareció Ninhursag, la Madre de la fertilidad y la creación. Los dioses contemplaron su obra y encontraron un nuevo equilibrio. La Tierra, única entre los mundos, se convirtió en el pilar del universo. Adapa y Ninhursag mantenían la armonía entre todas las especies, asegurando el orden que los dioses habían concebido. Pero los dioses no querían repetir los errores del pasado. La plaga había surgido antes, y la destrucción que causó en los mundos aún estaba fresca en sus memorias. Necesitaban garantizar que esta nueva civilización no sería manipulada, que su destino no estuviera atado a las sombras del caos.',
            'Entonces, pusieron a prueba su creación. Crearon el libre albedrío, pero no como un regalo inmediato, sino como un experimento. Querían ver cómo Adapa y Ninhursag reaccionaban, cómo tomaban sus propias decisiones sin la intervención divina. Los observaron en acción. Vieron cómo funcionaba eficientemente, cómo la elección personal guiaba el destino de los seres sin necesidad de control externo. El experimento fue un éxito. La conciencia había surgido, la plaga no había reaparecido, y el universo parecía en paz. Entonces, decretaron una única ley universal, aquella que impediría que el mal se propagara nuevamente: El libre albedrío. Ningún ser sería forzado a actuar o pensar de una manera específica. No habría imposiciones, ni caminos únicos. Cada ser vería el sendero frente a sí y decidiría su propio destino. Con esta ley establecida, los dioses abandonaron el plano universal. En ese instante, todos los seres del cosmos fueron libres, dueños de su propia elección, pero también del destino del universo.'
        ],
        centerImage: '/assets/timeline-center.jpg',
        leftImage: '/assets/timeline-left.jpg',
        rightImage: '/assets/timeline-right.jpg'
    },
    {
        title: 'Capítulo II',
        label: 'Cap. II',
        paragraphs: [
            'ELECCIÓN O DESTINO?',
            'La creación divina funcionaba a la perfección: no existían el hambre, el dolor ni el sufrimiento, y la armonía entre los seres era absoluta. Adapa y Ninhursag mantenían una relación cercana con todos los seres, disfrutando plenamente de la vida que les había sido otorgada. Su comunicación con los creadores se realizaba a través de una meditación consciente. Durante una de las meditaciones de Adapa, Enki, uno de los dioses, se manifestó ante él. Enki, previamente, había acordado con los dioses del universo poner a prueba la ley del libre albedrío, pues existía la posibilidad de que la plaga parasitaria hubiera evolucionado y adquirido nuevas técnicas para infiltrarse en el sistema del universo una vez más.',
            'Con esto acordado, Enki habló con Adapa y le dejó en claro que el nuevo mundo que habitaba, llamado Dilmun o Edén, pertenecía a él, a Ninhursag y a los seres vivos que lo poblaban. Sin embargo, le dio un advertencia fundamental: nunca debía consumir las hierbas sagradas, pues sería una ofensa imperdonable para él y los dioses. Adapa obedeció y cumplió con el deseo de Enki.',
            'El tiempo transcurrió, y la nueva civilización Pluri-Originario continuó su desarrollo de manera revolucionaria, marcando un cambio sin precedentes. En uno de sus viajes por el mundo, Adapa se detuvo a meditar entre el cielo y la tierra en una montaña llamada Kilima. Allí encontró a Ninhursag, quien contemplaba con profunda gratitud el mundo que le había sido concedido. Su sonrisa modesta irradiaba felicidad y armonía, y ese momento despertó en Adapa un sentimiento desconocido. No era malo, solo... diferente. Reflexionando sobre ello, encontró una palabra que definía lo que sentía: Amor.',
            'Al transmitirle su hallazgo a Ninhursag, ella derramó una lágrima. Al mirarse mutuamente, ambos comprendieron que habían creado algo que ni siquiera los dioses podían sentir.',
            'Enki sintió el nacimiento de este nuevo concepto, lo que despertó en su interior algo que no podía controlar. El Amor, al ser un potencial inédito, abría la posibilidad de que los seres fueran corrompidos con mayor facilidad por la plaga parasitaria. Entender esto le llevó a una inquietante conclusión: su creación, con todo su potencial, podría convertirse en su propio exterminio.',
            'Los dioses percibieron el impacto del libre albedrío y el surgimiento del Amor. Prefirieron esperar resultados antes de tomar una decisión definitiva sobre un nuevo Diluvio. Enki, comprendió el propósito de esta nueva etapa y decidió formar parte de ella.',
            'En una ocasión, Ninhursag descubrió el jardín prohibido por Enki. En lo profundo de aquel lugar, sobre un árbol de hojas oscuras, se posaba una figura misteriosa, envuelta en sombras. La criatura no emitía sonido alguno, solo observaba a Ninhursag, con una mirada que parecía perforar su espíritu. De repente, su forma comenzó a transformarse. Su cuerpo se alargó y adoptó un movimiento rastrero, deslizándose entre las hierbas sagradas del jardín. Intrigada, Ninhursag llamó a Adapa para mostrarle aquel ser desconocido.'
        ],
        centerImage: '/assets/timeline-center.jpg',
        leftImage: '/assets/timeline-left.jpg',
        rightImage: '/assets/timeline-right.jpg'
    }
];

const timelineChapterRightImages = [
    '/images/blog-bitacora-parallax.jpg',
    '/images/contacto-parallax.jpg',
    '/images/convocatorias-alianzas-parallax.jpg',
    '/images/cronograma-progreso-parallax.jpg',
    '/images/documentacion-parallax.jpg',
    '/images/documentacion-recursos-parallax.jpg',
    '/images/filosofia-parallax.jpg',
    '/images/fundador-parallax.jpg',
    '/images/inversionistas-alianzas-parallax.jpg',
    '/images/noticias-eventos-parallax.jpg'
];

const timelineTabsWithChapterImages = timelineTabs.map((tab, index) => ({
    ...tab,
    rightImage: timelineChapterRightImages[index % timelineChapterRightImages.length]
}));

function normalizeTitle(value, fallback = '') {
    if (!value || typeof value !== 'string') return fallback;
    return value.replace(/\s+/g, ' ').trim();
}

function descriptionToParagraphs(description) {
    if (!description || typeof description !== 'string') return [];

    return description
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function mapDataToTabs(chapters = []) {
    return chapters.map((chapter, index) => {
        const title = normalizeTitle(chapter?.name, `Capítulo ${index + 1}`);
        return {
            title,
            label: title,
            paragraphs: descriptionToParagraphs(chapter?.description),
            centerImage: chapter?.image || '/assets/timeline-center.jpg',
            leftImage: '/assets/timeline-left.jpg',
            rightImage: timelineChapterRightImages[index % timelineChapterRightImages.length]
        };
    });
}

export default function TimelineSectionPage() {
    const [tabsData, setTabsData] = React.useState(timelineTabsWithChapterImages);
    const [isMobile, setIsMobile] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
    const [isChapterMenuOpen, setIsChapterMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        let isMounted = true;

        const loadChapters = async () => {
            try {
                const response = await fetch('/total-darkness/data.json', { cache: 'no-store' });
                if (!response.ok) return;

                const data = await response.json();
                const chapters = Array.isArray(data?.[0]?.chapters) ? data[0].chapters : [];
                if (!chapters.length) return;

                const mappedTabs = mapDataToTabs(chapters);
                if (isMounted && mappedTabs.length > 0) {
                    setTabsData(mappedTabs);
                }
            } catch {
            }
        };

        loadChapters();

        return () => {
            isMounted = false;
        };
    }, []);

    const chapterTitles = React.useMemo(
        () => tabsData.map((tab) => tab.title),
        [tabsData]
    );

    const [selectedTab, setSelectedTab] = React.useState(0);

    React.useEffect(() => {
        if (tabsData.length === 0) return;
        if (selectedTab >= tabsData.length) {
            setSelectedTab(0);
        }
    }, [tabsData, selectedTab]);

    const selectedChapter = chapterTitles[selectedTab] || chapterTitles[0] || '';

    const eventLocations = chapterTitles.map((title, chapterIndex) => ({
        title,
        chapterIndex,
        eventIdx: chapterIndex + 1,
        type: chapterIndex === 0 ? 'planet' : chapterIndex < 5 ? 'planet' : 'moon'
    }));

    const handleChapterNavigate = (chapterIndex) => {
        if (chapterIndex >= 0 && chapterIndex < tabsData.length) {
            setSelectedTab(chapterIndex);
            setIsChapterMenuOpen(false);
        }
    };

    const handleTabChange = (tabIndex) => {
        if (tabIndex >= 0 && tabIndex < tabsData.length) {
            setSelectedTab(tabIndex);
        }
    };

    return (
        <>
            <SectionStructurePage
                title="Cronología"
                subtitle="Trilogía Total Darkness"
                tabs={tabsData}
                rightPanelImageOverride={timelineChapterRightImages[selectedTab % timelineChapterRightImages.length]}
                selectedTabIndex={selectedTab}
                onSelectedTabChange={handleTabChange}
                accentColor="#00e5e5"
                hideRightPanelImage={false}
                showRightPanelTabs={false}
                leftPanelHeight="60%"
                leftPanelMinHeight={350}
                leftPanelContent={
                    <TimelineChapterList
                        eventLocations={eventLocations}
                        selectedChapter={selectedChapter}
                        onNavigateToPlanet={handleChapterNavigate}
                    />
                }
                tabsContainerHeight={58}
                tabsContainerPadding="0 12px"
                tabsGap={10}
                tabsButtonPadding="6px 14px"
                showCenterImage={false}
                centerPanelPadding={10}
                centerPanelMinHeight={280}
                centerPanelMaxHeight="calc(100vh - 200px)"
                centerImageHeight={120}
                bottomSpacer1Height={4}
                bottomSpacer2Height={8}
                tabsPlacement="right-panel"
                hideTabsOnMobile={true}
            />

            {isMobile && (
                <div className="fixed left-3 right-3 top-[92px] z-[65] pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => setIsChapterMenuOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md border-2 border-cyan-400 bg-black/70 text-cyan-200 font-alpha uppercase tracking-[0.08em] text-[11px]"
                        aria-label="Abrir menú de capítulos"
                        aria-expanded={isChapterMenuOpen}
                    >
                        <span>{selectedChapter || 'Capítulos'}</span>
                        <span className="text-cyan-300 text-sm">☰</span>
                    </button>

                    {isChapterMenuOpen && (
                        <div className="mt-2 max-h-[48vh] overflow-y-auto rounded-md border-2 border-cyan-400/85 bg-black/85 p-2 backdrop-blur-md shadow-[0_0_18px_rgba(0,229,229,0.35)]">
                            <TimelineChapterList
                                eventLocations={eventLocations}
                                selectedChapter={selectedChapter}
                                onNavigateToPlanet={handleChapterNavigate}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
