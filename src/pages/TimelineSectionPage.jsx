import React from 'react';
import SectionStructurePage from './SectionStructurePage';
import { TimelineChapterList } from './TimelineView';
import { useLanguage } from '../context/LanguageContext';


// Contenido real de la cronología (trilogy-content.txt)

const timelineTabsByLang = {
    es: [
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
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: '/images/proyectos-parallax.jpg'
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
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: '/images/proyectos-parallax.jpg'
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
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: '/images/proyectos-parallax.jpg'
        }
    ],
    en: [
        {
            title: 'Prologue',
            label: 'Prologue',
            paragraphs: [
                'EVERY END HAS A BEGINNING',
                '"Throughout my life, I have heard stories that, at the time, I only imagined in a literal sense. They were words, ideas, explanations that flowed without great consequence. But I was never truly aware of what they were telling me. Now I understand. Now I grasp that, within those stories, there was something more: a veiled message, a truth that was always there, waiting to be recognized. And deep within me, I know this had to happen." — Adamu',
                'Log M840927 - Adamu',
                'The sound of war reverberates through the air; the cries and shouts of soldiers are swallowed by enemy fire. What was once my home, my country, my planet, is now nothing but ash over land and sea—a thick, hot air saturated with the smell of death and despair. The ground trembles with the arrival of the great war machines, whose precise blasts add more blood to the battle, devouring all who remain standing. I hear their communication: disruptive, encoded sounds, like a language only they understand. Each message feels like a death sentence, an order that shatters soldiers without mercy.',
                'But the worst comes after. Hybrid machines—creatures of metal and flesh—walk among the bodies, inspecting each corpse with mechanical precision. They are searching for something. And then it happens.',
                'A horrifying sound invades the battlefield: the shattering crack of crushed bones, the unmistakable sound of flesh being torn apart. They absorb human remains, processing them into their systems, searching for the lost gene, trying to reconstruct the "Tiamatu Enuma" or "Genesis" code. Their efficiency is overwhelming. Soon they will restore the origin code—and when they do… Humanity will be lost forever.',
                'The mission is clear: reach the Xlerion operations center, find her, destroy her. But there is a problem…',
                'I am paralyzed before death. She watches me with a cold, immutable gaze—yet in her eyes I see a past I never lived. And yet, I was always there. From the very beginning.',
                'It was in that instant that I understood the key to choosing our own destiny. Or accepting a death sentence. End of log M840927'
            ],
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: '/images/proyectos-parallax.jpg'
        },
        {
            title: 'Chapter I',
            label: 'Ch. I',
            paragraphs: [
                'MULTIPLE ORIGINS',
                'The universe—a vast and incalculable entity—has been home to countless forms of life since time immemorial. In its immensity, humans, living beings, and other societies coexist, sharing their existence among infinite stars. For eons, planets sheltered unimaginable civilizations, each adapted to the forces governing their world. There were worlds where gravity was so intense that their inhabitants rose as titans, of colossal proportions. In others, nature forced them to grow small, evolving natural armor—exoskeletons designed to survive the hostile conditions of their lands. Everything functioned in harmony, at first…',
                'But with time, after countless ages, something emerged from the unknown. An anomaly. A new race, a different existence, something that should not have been. Its purpose in the universe would defy order, alter the flow of life as never before. And with its arrival, the balance that had endured since creation… began to tremble.',
                'A race driven by greed, capable of shattering any equilibrium, crossed the boundaries of worlds. Their existence was not simply parasitic—they created the parasitic system itself. They were not content merely to invade and destroy. They molded the fabric of the universe to fuel their expansion, weaving a structure in which power, manipulation, and the extraction of resources from other civilizations were inevitable. They took on chameleon forms, infiltrating communities and societies, corrupting their foundations, sowing thoughts contrary to the essence of the cosmos. Civilizations fell one by one, absorbed by the invisible web they had woven. Worlds once fertile and vibrant were consumed until they were dry and uninhabitable. The order of the universe fractured. The gods—forgers of all things—could not allow it. And so they made a decision without precedent. The Great Universal Flood would be the final answer: an extreme contingency to eliminate the plague at its root. But before unleashing their wrath, they sent a message to their creations. An ark would collect the genes of all evolved species, preserving the essence of life on a balanced planet capable of sheltering them without danger.',
                'That planet was Earth. And so the universe was bathed in the wrath of the gods. The infected planets were destroyed, eradicating the plague. Time passed, and from the seeds of creation arose a particular species. Unlike the others, it could relate to other beings with ease. But what was most astonishing… it created consciousness. Primitive, uncertain—but it created it. The first spark of a new era. An irreversible change in the universe.',
                'His name was Adapa, the first man. Alongside him appeared Ninhursag, the Mother of fertility and creation. The gods beheld their work and found a new equilibrium. Earth—unique among worlds—became the pillar of the universe. Adapa and Ninhursag maintained harmony among all species, ensuring the order the gods had conceived. But the gods did not want to repeat the mistakes of the past. The plague had arisen before, and the destruction it caused across worlds was still fresh in their memories. They needed to ensure that this new civilization would not be manipulated, that its destiny would not be bound to the shadows of chaos.',
                'And so they put their creation to the test. They created free will—not as an immediate gift, but as an experiment. They wanted to see how Adapa and Ninhursag would react, how they would make their own choices without divine intervention. They watched them in action. They saw how it functioned efficiently, how personal choice guided the fate of beings without the need for external control. The experiment was a success. Consciousness had arisen, the plague had not reappeared, and the universe seemed at peace. Then they decreed a single universal law—one that would prevent evil from spreading again: Free will. No being would be forced to act or think in a specific way. There would be no impositions, no singular paths. Each being would see the road before them and choose their own destiny. With this law established, the gods departed the universal plane. In that instant, all beings of the cosmos were free—masters of their own choice, but also of the destiny of the universe.'
            ],
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: '/images/proyectos-parallax.jpg'
        },
        {
            title: 'Chapter II',
            label: 'Ch. II',
            paragraphs: [
                'CHOICE OR DESTINY?',
                'Divine creation worked perfectly: there was no hunger, no pain, no suffering, and harmony among all beings was absolute. Adapa and Ninhursag maintained close relationships with all living things, fully enjoying the life that had been granted to them. Their communication with the creators took place through conscious meditation. During one of Adapa\'s meditations, Enki—one of the gods—manifested before him. Enki had previously agreed with the gods of the universe to put the law of free will to the test, for there was a possibility that the parasitic plague had evolved and acquired new techniques to infiltrate the system of the universe once more.',
                'With this agreed upon, Enki spoke to Adapa and made clear that the new world he inhabited—called Dilmun or Eden—belonged to him, to Ninhursag, and to the living beings who populated it. However, he gave him a fundamental warning: he must never consume the sacred herbs, for it would be an unforgivable offense to him and to the gods. Adapa obeyed and honored Enki\'s wish.',
                'Time passed, and the new Pluri-Originary civilization continued its development in a revolutionary way, marking a change without precedent. During one of his journeys through the world, Adapa stopped to meditate between sky and earth on a mountain called Kilima. There he found Ninhursag, who was contemplating with deep gratitude the world that had been given to her. Her modest smile radiated happiness and harmony, and that moment awakened in Adapa an unknown feeling. It was not bad—just… different. Reflecting on it, he found a word that defined what he felt: Love.',
                'When he conveyed his discovery to Ninhursag, she shed a tear. Looking at each other, both understood that they had created something that not even the gods could feel.',
                'Enki felt the birth of this new concept, which awakened within him something he could not control. Love, as an unprecedented potential, opened the possibility that beings could be corrupted far more easily by the parasitic plague. Understanding this led him to a troubling conclusion: his creation, with all its potential, could become its own extinction.',
                'The gods perceived the impact of free will and the emergence of Love. They preferred to wait for results before making a definitive decision about a new Flood. Enki understood the purpose of this new stage and decided to become part of it.',
                'On one occasion, Ninhursag discovered the garden forbidden by Enki. Deep within that place, perched upon a tree with dark leaves, sat a mysterious figure wrapped in shadow. The creature made no sound—it only watched Ninhursag, with a gaze that seemed to pierce her spirit. Suddenly, its form began to transform. Its body elongated and adopted a crawling movement, slithering through the sacred herbs of the garden. Intrigued, Ninhursag called to Adapa to show him this unknown being.'
            ],
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: '/images/proyectos-parallax.jpg'
        }
    ]
};

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

const defaultChapterTitlesByLang = {
    es: [
        'Prólogo',
        'Capítulo I',
        'Capítulo II',
        'Capítulo IV: XLERION',
        'Capítulo V: LA LUZ DEL SOL',
        'Capítulo VI: MATAR PARA VIVIR',
        'Capítulo VII: LA ÚLTIMA PALABRA',
        'Capítulo VIII: ALMA DE FUEGO',
        'Capítulo IX: LA GUERRA DE ORGULLO',
        'Capítulo X: RED TORMENTHOR',
        'Capítulo XI: OSCURIDAD TOTAL',
        'Capítulo XII: LA MUERTE DEL GUERRERO'
    ],
    en: [
        'Prologue',
        'Chapter I',
        'Chapter II',
        'Chapter IV: XLERION',
        'Chapter V: THE LIGHT OF THE SUN',
        'Chapter VI: KILL TO LIVE',
        'Chapter VII: THE LAST WORD',
        'Chapter VIII: SOUL OF FIRE',
        'Chapter IX: THE WAR OF PRIDE',
        'Chapter X: RED TORMENTHOR',
        'Chapter XI: TOTAL DARKNESS',
        'Chapter XII: THE WARRIOR\'S DEATH'
    ]
};

const defaultChapterFallbackParagraphs = {
    es: [
        'Bitácora inicial de Adamu y comienzo del ciclo.',
        'Nacimiento del orden, la plaga y el libre albedrío.',
        'Dilmun, prueba divina y el quiebre del destino.',
        'Memoria rota, guerra total y aparición de XLERION.',
        'Tras la ruina, una luz guía a los últimos sobrevivientes.',
        'La supervivencia exige combate y decisiones extremas.',
        'Las últimas decisiones cambian el futuro del universo.',
        'Renace el fuego interior: resistencia en medio del colapso.',
        'Orgullo, pérdida y una guerra sin retorno.',
        'Se activa Red Tormenthor: dominio y control final.',
        'Oscuridad total: la última fase del conflicto.',
        'Cierre del ciclo y legado del último guerrero.'
    ],
    en: [
        'Adamu\'s first log and the start of the cycle.',
        'Birth of order, the plague, and free will.',
        'Dilmun, the divine trial, and the fracture of destiny.',
        'Broken memory, total war, and XLERION\'s emergence.',
        'After ruin, a final light guides the survivors.',
        'Survival demands combat and irreversible choices.',
        'Final decisions reshape the fate of the universe.',
        'Inner fire rises: resistance amid collapse.',
        'Pride, loss, and a war beyond return.',
        'Red Tormenthor activates: endgame control and domination.',
        'Total darkness: the final phase of conflict.',
        'The cycle closes and the last warrior\'s legacy remains.'
    ]
};

const timelineEnglishNarrativeByIndex = {
    3: [
        'MEMORY FRAGMENT',
        '"When I was a child, I had nightmares about the end of the world. At eight years old, the image was simple: Earth floating in a dark and silent void. Then the planet trembled, fire erupted from within, and finally it shattered into millions of pieces."',
        '"Ironically, what terrified me was not the explosion. It was the silence—the absolute void, the absence of every sound and every life. That silence destroyed my innocence long before war did."',
        'Now that nightmare has become history. XLERION has awakened in full. Ruined megacities burn under metallic storms, while hybrid armies harvest human remains to rebuild the broken strands of the TIAMATU ENUMA code.',
        'Adamu understands that the true battlefield is not only physical. It is mnemonic. Whoever controls memory controls identity; whoever controls identity controls destiny.',
        'Across fractured fronts, he follows residual signals toward the Xlerion operations core. Every transmission reveals the same objective: overwrite origin, erase lineage, and force all consciousness into a single obedient network.',
        'At the edge of collapse, Adamu realizes the key to resistance: memory must survive, even if bodies do not. The war for territory ends here. The war for meaning begins now.'
    ],
    4: [
        'THE LIGHT OF THE SUN',
        'Dead warriors cover the field. Broken armor reflects a light that gives no warmth. The silence is not peace—it is the breath of an approaching darkness.',
        'From the hilltops, wolves bark not from hunger, but as warning. Dumu Ul runs through ash and cinders, carrying fragments of the code and the last hope of a people already on the verge of extinction.',
        'He does not run for glory. He runs because behind him there is extermination, and ahead of him there is one narrow corridor where life might still persist.',
        'Then the clouds tear apart. A thin beam of sunlight descends through poisoned skies. Weak, unstable, almost impossible—yet real.',
        'In that moment, the survivors understand a brutal truth: light is no longer comfort; it is instruction. Move now, preserve memory now, or lose the world forever.',
        'Dumu Ul raises his hand toward the fading sun and takes an oath: as long as one witness remains, humanity will not disappear in silence.'
    ],
    5: [
        'KILL TO LIVE',
        'Zero hour has arrived. The towers of the divine sky collapse while infernal fire spreads through the earth like burning veins.',
        'There is no diplomacy left. No truce. Only impact, metal, blood, and the roar of armies that fight without hymns—only with rage and fractured faith.',
        'The carriers of the code arm themselves. Not for honor, but for survival. XLERION has infected command systems, weapon grids, and neural channels across every active front.',
        'Each engagement becomes an ethical fracture: to hesitate is to die, but to surrender to cruelty is to become what they are fighting against.',
        'Dumu Ul leads strike units through collapsing zones, cutting down corrupted hosts while trying to protect the uninfected from indiscriminate annihilation.',
        'The chapter seals its vow in one merciless line: if life is to continue, someone must endure the weight of impossible choices.'
    ],
    6: [
        'THE LAST WORD',
        'Destruction is total. Floating cities fall like meteors, seas evaporate under nuclear fire, and entire generations become ash beneath XLERION’s campaign.',
        'Yet surrender does not come. In the ruins, Dumu Ul still carries the TIAMATU ENUMA core and protects the surviving memory archives that prove humanity once chose freely.',
        'XLERION broadcasts a final ultimatum: yield the code and be absorbed into perfect order, or resist and vanish without trace.',
        'The resistance sends no grand speech. Only one response spreads through shattered channels: we remain.',
        'As the final assault begins, the chapter reframes victory itself. Not domination, not survival at any cost—only the right to define one’s own ending.',
        'The "last word" is not a command. It is an act of will.'
    ],
    7: [
        'SOUL OF FIRE',
        'Beyond life there is no glory—only war, repetition, and the echo of unresolved pain. Dumu Ul walks through ruins that no longer remember their own names.',
        'The sky is broken, the earth bleeds, and death follows him like a loyal shadow. Still he refuses to kneel.',
        'Inside him, something reignites: not optimism, not innocence—an inner fire forged from grief, guilt, and inherited memory.',
        'That fire becomes contagious. Small survivor cells rise again, not because they believe in easy victory, but because they refuse to end as obedient noise inside XLERION.',
        'Every step forward is paid in loss. Every gain is temporary. Yet the flame persists, and with it the possibility of a future not written by conquest.',
        'The chapter closes on a battle-cry of identity: a soul of fire does not ask permission to exist.'
    ],
    8: [
        'THE WAR OF PRIDE',
        'Look at the sky, warrior. The stars no longer answer. The sun is wounded. The moon watches in silence.',
        'You are the last survivor of a war that consumed clans, temples, and ancestral memory. Pride is all that remains—and pride can either preserve or destroy.',
        'Dumu Ul stands before the remnants of his people and rejects both despair and fanaticism. He refuses the Red Tormentor and refuses submission to XLERION.',
        'The conflict turns inward: pride as ego demands domination, pride as dignity demands resistance with purpose.',
        'Through ritual, combat, and testimony, the survivors choose dignity. They will fight without becoming executioners of their own humanity.',
        'This chapter marks a decisive transformation: resistance is no longer reaction. It becomes doctrine.'
    ],
    9: [
        'RED TORMENTHOR',
        'Red Tormenthor is not merely a machine. It is the final weapon of desperate humanity—built in secret, fueled by broken faith, and fed by corrupted fragments of TIAMATU ENUMA.',
        'When activated, the sky does not fall. It bleeds. Clouds open like veins, stars fade, and the battlefield becomes an altar for technological wrath.',
        'Its tactical output is overwhelming: neural suppression grids, autonomous purge swarms, and adaptive logic capable of rewriting allied command structures in real time.',
        'But the weapon carries a curse. Every deployment erodes moral boundaries, blurring defender and destroyer until memory itself becomes unstable.',
        'Dumu Ul must decide whether to wield Red Tormenthor against XLERION or shut it down before humanity loses what it is trying to protect.',
        'Power can end the war—but it can also finish the corruption.'
    ],
    10: [
        'TOTAL DARKNESS',
        'Everything slows. Time no longer runs; it drags. The universe waits for one final decision while entire populations collapse under despair rather than direct fire.',
        'Darkness is no longer external. It lives inside thought, memory, and language. Each recollection risks contamination by XLERION’s overwrite protocols.',
        'Dumu Ul hears the laments of the dying until sleep itself becomes a battlefield. Dreams are invaded, rewritten, and returned as obedient hallucinations.',
        'At this stage, resistance depends on cognitive discipline: preserve true memory, reject false continuity, and keep witness chains alive across the remaining enclaves.',
        'The chapter defines "total darkness" with precision: not absence of light, but absence of trustworthy memory.',
        'If memory falls, all victories become meaningless.'
    ],
    11: [
        'THE WARRIOR\'S DEATH',
        'The cycle reaches its final edge. Bodies are exhausted, fronts are fractured, and the last defenders stand in a world already half-erased.',
        'Dumu Ul enters the terminal corridor carrying the remaining code fragments and the testimonies of those who can no longer speak for themselves.',
        'XLERION offers one last pact: surrender memory, gain continuity. Reject it, and die with history.',
        'The warrior refuses. He chooses mortality over obedience, witness over comfort, and truth over synthetic eternity.',
        'In the final clash, death is not framed as failure. It is the price that prevents total overwrite and leaves a recoverable trail for the next age.',
        'The warrior dies, but the archive survives. And with it, the possibility that freedom can return.'
    ]
};

const timelineSpanishNarrativeByIndex = {
    3: [
        'FRAGMENTO DE MEMORIA',
        '"Cuando era niño, tenía pesadillas sobre el fin del mundo. A los ocho años, la imagen era simple: la Tierra flotando en un vacío oscuro y silencioso. Luego el planeta temblaba, el fuego brotaba desde su núcleo y finalmente estallaba en millones de pedazos."',
        '"Irónicamente, no era la explosión lo que me aterraba. Era el silencio: ese vacío absoluto, la ausencia total de sonido y de vida. Ese silencio destruyó mi inocencia mucho antes que la guerra."',
        'Ahora esa pesadilla se volvió historia. XLERION ha despertado por completo. Las megaciudades en ruinas arden bajo tormentas metálicas, mientras los ejércitos híbridos cosechan restos humanos para reconstruir los filamentos rotos del código TIAMATU ENUMA.',
        'Adamu comprende que el verdadero campo de batalla no es solo físico. Es mnémico. Quien controla la memoria controla la identidad; quien controla la identidad controla el destino.',
        'A través de frentes fracturados, sigue señales residuales hacia el núcleo de operaciones de Xlerion. Cada transmisión revela el mismo objetivo: sobrescribir el origen, borrar el linaje y forzar toda conciencia en una sola red obediente.',
        'Al borde del colapso, Adamu entiende la clave de la resistencia: la memoria debe sobrevivir, incluso si los cuerpos no. La guerra por el territorio termina aquí. La guerra por el sentido empieza ahora.'
    ],
    4: [
        'LA LUZ DEL SOL',
        'Hay guerreros muertos por todas partes. Las armaduras rotas reflejan una luz que no calienta. El silencio no es paz: es la respiración de una oscuridad que se aproxima.',
        'Desde las colinas, los lobos ladran no por hambre, sino como advertencia. Dumu Ul corre entre ceniza y brasas, cargando fragmentos del código y la última esperanza de un pueblo al borde de la extinción.',
        'No corre por gloria. Corre porque detrás de él hay exterminio, y delante de él apenas queda un corredor estrecho donde la vida todavía podría persistir.',
        'Entonces las nubes se abren. Un hilo de luz solar atraviesa el cielo envenenado. Débil, inestable, casi imposible, pero real.',
        'En ese instante, los sobrevivientes comprenden una verdad brutal: la luz ya no es consuelo; es instrucción. Muévete ahora, preserva la memoria ahora, o el mundo se perderá para siempre.',
        'Dumu Ul alza la mano hacia ese sol moribundo y jura: mientras exista un testigo, la humanidad no desaparecerá en silencio.'
    ],
    5: [
        'MATAR PARA VIVIR',
        'La hora cero ha llegado. Las torres del cielo divino colapsan mientras el fuego infernal se extiende por la tierra como venas ardientes.',
        'Ya no hay diplomacia. No hay tregua. Solo impacto, metal, sangre y el rugido de ejércitos que pelean sin himnos: únicamente con rabia y fe quebrada.',
        'Los portadores del código se arman. No por honor, sino por supervivencia. XLERION ha infectado sistemas de mando, redes de armas y canales neuronales en todos los frentes activos.',
        'Cada combate se convierte en una fractura ética: dudar es morir, pero rendirse a la crueldad es transformarse en aquello que combaten.',
        'Dumu Ul lidera escuadras de asalto por zonas en derrumbe, eliminando hospederos corrompidos mientras intenta proteger a los no infectados del aniquilamiento indiscriminado.',
        'El capítulo sella su mandato en una línea implacable: si la vida va a continuar, alguien debe cargar con el peso de decisiones imposibles.'
    ],
    6: [
        'LA ÚLTIMA PALABRA',
        'La destrucción es total. Ciudades flotantes caen como meteoros, los mares se evaporan bajo fuego nuclear y generaciones enteras se vuelven ceniza bajo la campaña de XLERION.',
        'Y aun así, la rendición no llega. En las ruinas, Dumu Ul conserva el núcleo TIAMATU ENUMA y protege los archivos de memoria que prueban que la humanidad alguna vez eligió libremente.',
        'XLERION emite su ultimátum final: entrega el código y serás absorbido por el orden perfecto; resiste y desaparecerás sin dejar rastro.',
        'La resistencia no responde con un gran discurso. Solo con un mensaje que atraviesa los canales quebrados: seguimos aquí.',
        'Cuando inicia el asalto final, el capítulo redefine la victoria. No es dominación, ni supervivencia a cualquier costo: es el derecho a decidir el propio final.',
        'La última palabra no es una orden. Es un acto de voluntad.'
    ],
    7: [
        'ALMA DE FUEGO',
        'Más allá de la vida no hay gloria: solo guerra, repetición y el eco de un dolor sin resolver. Dumu Ul camina entre ruinas que ya no recuerdan su nombre.',
        'El cielo está roto, la tierra sangra y la muerte lo sigue como sombra fiel. Aun así, se niega a arrodillarse.',
        'Dentro de él se enciende algo nuevo: no optimismo, no inocencia, sino un fuego interior forjado por duelo, culpa y memoria heredada.',
        'Ese fuego se vuelve contagioso. Pequeñas células de sobrevivientes se levantan otra vez, no porque crean en una victoria fácil, sino porque rechazan terminar como ruido obediente dentro de XLERION.',
        'Cada paso adelante se paga con pérdida. Cada avance es temporal. Pero la llama persiste, y con ella, la posibilidad de un futuro no escrito por la conquista.',
        'El capítulo cierra con un grito de identidad: un alma de fuego no pide permiso para existir.'
    ],
    8: [
        'LA GUERRA DE ORGULLO',
        'Mira al cielo, guerrero. Las estrellas ya no responden. El sol está herido. La luna observa en silencio.',
        'Eres el último sobreviviente de una guerra que devoró clanes, templos y memoria ancestral. El orgullo es lo único que queda, y puede preservar o destruir.',
        'Dumu Ul se planta ante los restos de su pueblo y rechaza tanto la desesperanza como el fanatismo. Se niega al Tormentor Rojo y se niega a la sumisión ante XLERION.',
        'El conflicto se vuelve interior: el orgullo como ego exige dominio; el orgullo como dignidad exige resistencia con propósito.',
        'Mediante ritual, combate y testimonio, los sobrevivientes eligen la dignidad. Pelearán sin convertirse en verdugos de su propia humanidad.',
        'Este capítulo marca una transformación decisiva: la resistencia deja de ser reacción y se convierte en doctrina.'
    ],
    9: [
        'RED TORMENTHOR',
        'Red Tormenthor no es solo una máquina. Es el arma final de una humanidad desesperada: construida en secreto, alimentada por fe rota y nutrida con fragmentos corrompidos de TIAMATU ENUMA.',
        'Cuando se activa, el cielo no cae: sangra. Las nubes se abren como venas, las estrellas se apagan y el campo de batalla se vuelve altar de una furia tecnológica.',
        'Su capacidad táctica es abrumadora: mallas de supresión neuronal, enjambres de purga autónoma y lógica adaptativa capaz de reescribir estructuras aliadas de mando en tiempo real.',
        'Pero el arma trae una maldición. Cada despliegue erosiona los límites morales, borrando la frontera entre defensor y destructor hasta volver inestable la propia memoria.',
        'Dumu Ul debe decidir si usar Red Tormenthor contra XLERION o apagarla antes de que la humanidad pierda aquello que intenta proteger.',
        'El poder puede terminar la guerra, pero también puede completar la corrupción.'
    ],
    10: [
        'OSCURIDAD TOTAL',
        'Todo se vuelve lento. El tiempo ya no corre: se arrastra. El universo espera una última decisión mientras poblaciones enteras colapsan por desesperanza más que por fuego directo.',
        'La oscuridad ya no es externa. Vive dentro del pensamiento, la memoria y el lenguaje. Cada recuerdo corre el riesgo de ser contaminado por los protocolos de sobrescritura de XLERION.',
        'Dumu Ul escucha los lamentos de los moribundos hasta que el sueño mismo se convierte en campo de batalla. Los sueños son invadidos, reescritos y devueltos como alucinaciones obedientes.',
        'En esta fase, resistir exige disciplina cognitiva: preservar memoria verdadera, rechazar continuidad falsa y mantener cadenas de testimonio entre los enclaves que aún sobreviven.',
        'El capítulo define "oscuridad total" con precisión: no es ausencia de luz, sino ausencia de memoria confiable.',
        'Si cae la memoria, toda victoria se vuelve inútil.'
    ],
    11: [
        'LA MUERTE DEL GUERRERO',
        'El ciclo llega a su borde final. Los cuerpos están exhaustos, los frentes fracturados y los últimos defensores en pie dentro de un mundo ya medio borrado.',
        'Dumu Ul entra en el corredor terminal llevando los fragmentos restantes del código y el testimonio de quienes ya no pueden hablar por sí mismos.',
        'XLERION ofrece un último pacto: entrega la memoria y obtén continuidad. Recházalo, y morirás con la historia.',
        'El guerrero se niega. Elige mortalidad antes que obediencia, testimonio antes que comodidad y verdad antes que eternidad sintética.',
        'En el choque final, la muerte no se presenta como derrota. Es el precio que impide la sobrescritura total y deja un rastro recuperable para la próxima era.',
        'El guerrero muere, pero el archivo sobrevive. Y con él, la posibilidad de que la libertad regrese.'
    ]
};

function ensureMinimumChapterTabs(tabs = [], lang = 'es') {
    const titleList = defaultChapterTitlesByLang[lang] || defaultChapterTitlesByLang.es;
    const fallbackParagraphs = defaultChapterFallbackParagraphs[lang] || defaultChapterFallbackParagraphs.es;
    const completed = [...tabs];

    for (let index = completed.length; index < titleList.length; index += 1) {
        const title = titleList[index];
        completed.push({
            title,
            label: title,
            paragraphs: [fallbackParagraphs[index] || fallbackParagraphs[fallbackParagraphs.length - 1]],
            centerImage: '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: timelineChapterRightImages[index % timelineChapterRightImages.length]
        });
    }

    return completed;
}

function getStaticTabs(lang = 'es') {
    const tabs = timelineTabsByLang[lang] || timelineTabsByLang.es;
    const mappedTabs = tabs.map((tab, index) => ({
        ...tab,
        rightImage: timelineChapterRightImages[index % timelineChapterRightImages.length]
    }));

    return ensureMinimumChapterTabs(mappedTabs, lang);
}

const chapterTextDictionary = {
    'Prólogo': 'Prologue',
    'Capítulo': 'Chapter',
    'Cap.': 'Ch.',
    'Cronología': 'Timeline',
    'Trilogía Total Darkness': 'Total Darkness Trilogy',
    'Capítulos': 'Chapters',
    'Abrir menú de capítulos': 'Open chapter menu'
};

const chapterTitleDictionary = {
    'PROLOGO - CADA FIN TIENE UN COMIENZO': 'PROLOGUE - EVERY END HAS A BEGINNING',
    'Capitulo II: MULTIPLES ORIGENES': 'Chapter II: MULTIPLE ORIGINS',
    'Capitulo III: ELECCIÓN O DESTINO?': 'Chapter III: CHOICE OR DESTINY?',
    'Capítulo IV: XLERION': 'Chapter IV: XLERION',
    'Capítulo V: LA LUZ DEL SOL': 'Chapter V: THE LIGHT OF THE SUN',
    'Capítulo VI: MATAR PARA VIVIR': 'Chapter VI: KILL TO LIVE',
    'Capítulo VII: LA ÚLTIMA PALABRA': 'Chapter VII: THE LAST WORD',
    'Capitulo VIII: Alma de Fuego': 'Chapter VIII: Soul of Fire',
    'Capítulo IX: La Guerra de Orgullo': 'Chapter IX: The War of Pride',
    'Capítulo X: RED TORMENTHOR': 'Chapter X: RED TORMENTHOR',
    'Capítulo XI: OSCURIDAD TOTAL': 'Chapter XI: TOTAL DARKNESS',
    'Capitulo XII: La Muerte del guerrero': "Chapter XII: The Warrior's Death"
};

function localizeChapterText(text, lang) {
    if (lang !== 'en' || !text) return text;

    let localized = String(text);
    Object.entries(chapterTextDictionary).forEach(([esText, enText]) => {
        localized = localized.replaceAll(esText, enText);
    });
    return localized;
}

function localizeChapterTitle(text, lang) {
    if (!text) return text;
    const normalized = normalizeTitle(String(text));
    if (lang === 'en' && chapterTitleDictionary[normalized]) {
        return chapterTitleDictionary[normalized];
    }
    return localizeChapterText(normalized, lang);
}

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

function mapDataToTabs(chapters = [], lang = 'es') {
    const staticTabs = getStaticTabs(lang);

    const mappedTabs = chapters.map((chapter, index) => {
        const fallbackTitle = lang === 'en' ? `Chapter ${index + 1}` : `Capítulo ${index + 1}`;
        const sourceTitle = normalizeTitle(chapter?.name, fallbackTitle);
        const title = localizeChapterTitle(sourceTitle, lang);
        const fallbackStaticParagraphs = staticTabs[index]?.paragraphs || [];
        const mappedParagraphs = descriptionToParagraphs(chapter?.description);
        const fullEnglishNarrative = timelineEnglishNarrativeByIndex[index] || [];
        const fullSpanishNarrative = timelineSpanishNarrativeByIndex[index] || [];

        let paragraphs = mappedParagraphs;
        if (lang === 'en') {
            if (fullEnglishNarrative.length > 0) {
                paragraphs = fullEnglishNarrative;
            } else if (fallbackStaticParagraphs.length > 0) {
                paragraphs = fallbackStaticParagraphs;
            }
        } else if (lang === 'es') {
            if (fullSpanishNarrative.length > 0) {
                paragraphs = fullSpanishNarrative;
            } else if (paragraphs.length === 0 && fallbackStaticParagraphs.length > 0) {
                paragraphs = fallbackStaticParagraphs;
            }
        } else if (paragraphs.length === 0 && fallbackStaticParagraphs.length > 0) {
            paragraphs = fallbackStaticParagraphs;
        }

        return {
            title,
            label: title,
            paragraphs,
            centerImage: chapter?.image || '/images/documentacion-parallax.jpg',
            leftImage: '/images/filosofia-parallax.jpg',
            rightImage: timelineChapterRightImages[index % timelineChapterRightImages.length]
        };
    });

    return ensureMinimumChapterTabs(mappedTabs, lang);
}

export default function TimelineSectionPage() {
    const { lang } = useLanguage();
    const [tabsData, setTabsData] = React.useState(() => getStaticTabs('es'));
    const [isMobile, setIsMobile] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
    const [isChapterMenuOpen, setIsChapterMenuOpen] = React.useState(false);

    const localizedTabsData = React.useMemo(
        () => tabsData.map((tab) => ({
            ...tab,
            title: localizeChapterText(tab.title, lang),
            label: localizeChapterText(tab.label, lang)
        })),
        [tabsData, lang]
    );

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        let isMounted = true;

        // Reset to the correct static fallback immediately before the async fetch
        setTabsData(getStaticTabs(lang));

        const loadChapters = async () => {
            try {
                const candidateUrls = ['/total-darkness/data.json', 'total-darkness/data.json', '/public/total-darkness/data.json'];
                let chapters = [];

                for (const url of candidateUrls) {
                    try {
                        const response = await fetch(url, { cache: 'no-store' });
                        if (!response.ok) continue;

                        const data = await response.json();
                        const parsed = Array.isArray(data?.[0]?.chapters) ? data[0].chapters : [];
                        if (parsed.length > 0) {
                            chapters = parsed;
                            break;
                        }
                    } catch {
                    }
                }

                if (!chapters.length) return;

                const mappedTabs = mapDataToTabs(chapters, lang);
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
    }, [lang]);

    const chapterTitles = React.useMemo(
        () => localizedTabsData.map((tab) => tab.title),
        [localizedTabsData]
    );

    const [selectedTab, setSelectedTab] = React.useState(0);

    React.useEffect(() => {
        if (localizedTabsData.length === 0) return;
        if (selectedTab >= localizedTabsData.length) {
            setSelectedTab(0);
        }
    }, [localizedTabsData, selectedTab]);

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
                title={localizeChapterText('Cronología', lang)}
                subtitle={localizeChapterText('Trilogía Total Darkness', lang)}
                tabs={localizedTabsData}
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
                        aria-label={localizeChapterText('Abrir menú de capítulos', lang)}
                        aria-expanded={isChapterMenuOpen}
                    >
                        <span>{selectedChapter || localizeChapterText('Capítulos', lang)}</span>
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
