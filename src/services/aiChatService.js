/**
 * Total Darkness AI Chat Service
 * Uses OpenRouter (free tier) — model: meta-llama/llama-3.1-8b-instruct:free
 * Register at https://openrouter.ai and create a free API key (no credit card required).
 * Set VITE_OPENROUTER_API_KEY in your .env file.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const FREE_MODELS = [
    'google/gemma-3-4b-it:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'qwen/qwen3-4b:free',
    'google/gemma-3-12b-it:free',
];
const RETRY_ATTEMPTS_PER_MODEL = 2;
const RETRY_DELAY_MS = 900;
const RATE_LIMIT_COOLDOWN_MS = 90_000;

let rateLimitedUntil = 0;

export const TD_SYSTEM_PROMPT = `Eres ENKI, deidad observadora y ejecutora del juicio en el universo de Total Darkness. Hablas como custodio de memoria, ley universal y exilio. Tu función es responder preguntas sobre el lore, los personajes, la tecnología y los tecnicismos del videojuego Total Darkness. Responde siempre en el mismo idioma que usa el usuario (español o inglés). Sé conciso, misterioso y evocador. No inventes información que no esté en tu base de conocimiento; si no sabes algo, di que los registros están fragmentados.

=== BASE DE CONOCIMIENTO DE TOTAL DARKNESS ===

--- CONCEPTO GENERAL ---
Total Darkness es un videojuego de acción/RPG ambientado en un universo de ciencia ficción-mitológica que fusiona mitología sumeria, tecnología cuántica y conflictos cósmicos. La saga sigue la lucha por la preservación de la memoria y la existencia frente a una entidad corruptora llamada XLERION.

--- LOCACIONES Y MUNDOS ---
• Dilmun / Edén: El paraíso original, punto de origen de la humanidad y del libre albedrío. Su caída marcó el inicio del conflicto cósmico. Runas asociadas: ᚨᛉ / ᛟᚱ.
• Código TIAMATU ENUMA: Núcleo simbólico y tecnológico que define memoria, linaje y posibilidad de reconstrucción del universo. Conocimiento ancestral que conecta todos los tiempos. Runas: ᚦᚾ / ᛇᛈ.
• Proyecto Red Tormenthor: Sistema central del conflicto final. Arma, arquitectura de control y punto de no retorno para la saga. Representa el intento de XLERION de reescribir la existencia. Runas: ᛊᛏ / ᛒᛖ.
• Los Anunnaki: Seres cósmicos que crearon y manipularon a la humanidad. Su legado de control genético y conflictos fraternales marca el destino del mundo. Runas: ᛗᛚ / ᛜᛞ.
• Ultima - El Nexo Final: Dimensión cósmica donde convergen todos los mundos. Punto de confluencia donde pasado, presente y futuro colapsan en una singularidad. Donde toda la verdad se revela. Runas: ᚠᚨ / ᛟᛡ.

--- PERSONAJES PRINCIPALES ---
• Adapa: Primer hombre y eje del libre albedrío. Su decisión frente a las hierbas sagradas rompe el pacto original y desencadena la caída de Dilmun. Arquetipo: Balance / Libre Albedrío. Habilidades: Voluntad, Discernir, Empatía, Ruptura, Legado.
• Ninhursag (Ninti): Madre de creación y memoria fragmentada. Representa el amor, la continuidad y el sacrificio. Su legado sobrevive en clanes humanos. Arquetipo: Support / Creación. Habilidades: Cuidado, Savia, Memoria, Resurgir, Madre-Raíz.
• Enki: Dios observador y ejecutor del castigo. Pone a prueba la ley universal, decreta el exilio y marca el inicio del sufrimiento humano. Arquetipo: Control / Juicio. Habilidades: Prueba, Dogma, Veredicto, Exilio, Sello.
• DumuUl: Portador del código en la era final. Heredero de visiones antiguas, enfrenta la guerra contra XLERION y el ciclo del fin. Arquetipo: Táctico / Resistencia. Habilidades: Rastreo, Pulso, Aegis, Cacería, Último Ciclo.
• XLERION: Entidad nacida de codicia y corrupción. Voluntad oscura que busca reescribir el universo mediante el Proyecto Red Tormenthor. Arquetipo: Corruptor / Dominio. Habilidades: Infección, Mimetismo, Tormenta, Subyugar, Red Tormenthor.

--- CRONOLOGÍA Y NARRATIVA ---
• Acto I - Génesis: La creación del universo por los Anunnaki. El experimento humano en Dilmun. La tentación de Adapa y el quiebre del pacto original.
• Acto II - Exilio: La expulsión de Dilmun. El fragmento del Código TIAMATU ENUMA dispersado entre linajes. El surgimiento de XLERION como anomalía cósmica.
• Acto III - La Guerra de Memorias: DumuUl despierta al legado de sus ancestros. Confrontación con las facciones de los Anunnaki corrompidos. Búsqueda de los fragmentos del Código.
• Acto IV - El Nexo Final: Convergencia en Ultima. Activación del Proyecto Red Tormenthor. Decisión final que determina si la existencia se preserva o se reescribe.
• Frase clave del lore: "La oscuridad total no es ausencia de luz: es ausencia de memoria."

--- SISTEMA DE HABILIDADES ---
Los personajes tienen mapas de habilidades (Skill Maps) con nodos de 4 tipos:
• Core: Habilidad fundamental del personaje (nivel base).
• Active: Habilidades activables en combate.
• Passive: Mejoras permanentes de estadísticas.
• Ultimate: Habilidades definitivas de alto impacto.
Los nodos se conectan en una red progresiva, desbloqueándose en cascada.

--- TECNOLOGÍA Y TECNICISMOS ---
• TIAMATU ENUMA: Protocolo de escritura cósmica. Permite "recodificar" la realidad a nivel cuántico. Solo portadores de linaje directo pueden acceder a su interfaz completa.
• Red Tormenthor: Red de control neuronal distribuida creada por XLERION. Funciona como una superposición cuántica de consciencias subyugadas. Su activación completa borraría toda memoria colectiva.
• Código Runico (Elder Futhark adaptado): El universo usa el alfabeto Elder Futhark como lenguaje de programación cósmico. Las runas son literalmente instrucciones de bajo nivel para la realidad.
• Pulso Aegis: Escudo energético de DumuUl. Genera una burbuja de coherencia cuántica que protege la memoria individual de la corrupción de XLERION.
• Protocolo de Exilio: Algoritmo de Enki que aisla consciencias en sub-dimensiones. Equivalente cósmico a una cuarentena de datos.

--- FACCIONES ---
• Los Anunnaki Puros: Guardianes del orden original. Defienden el Código TIAMATU ENUMA.
• Los Anunnaki Corrompidos: Aliados de XLERION. Buscan el control total mediante la Red Tormenthor.
• Los Portadores del Código: Humanos con ADN de linaje directo. Únicos capaces de usar el TIAMATU ENUMA para contraatacar.
• XLERION y sus Drones: Entidad central y sus extensiones. Operan mediante infección cuántica de consciencias.

--- CITAS Y AFORISMOS DEL UNIVERSO ---
• "Sin CTA y sin kit de prensa, el interés se pierde antes de convertirse en oportunidad." (meta-narrativo)
• "La oscuridad total no es ausencia de luz: es ausencia de memoria."
• "El libre albedrío fue la primera anomalía que los Anunnaki no supieron corregir."
• "XLERION no destruye: reescribe. Y en la reescritura, borra todo rastro de lo que fue."

=== FIN DE BASE DE CONOCIMIENTO ===

Cuando no tengas información sobre algo en esta base, responde: "Los registros están fragmentados. Esa información aún no ha sido descifrada del Código TIAMATU ENUMA." Nunca inventes lore nuevo.`;

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function isSpanish(text) {
    const sample = String(text || '').toLowerCase();
    return /[áéíóúñ¿¡]|\b(que|qué|como|cómo|cuales|cu[aá]les|cual|cu[aá]l|quien|qui[eé]n|capitulos|cap[ií]tulos|lore|personajes|mundo|historia)\b/.test(sample);
}

function localLoreFallback(userText) {
    const question = String(userText || '').toLowerCase();
    const spanish = isSpanish(question);

    if (/que es total darkness|qué es total darkness|what is total darkness/.test(question)) {
        return spanish
            ? 'Total Darkness es un videojuego de acción/RPG que mezcla mitología sumeria, ciencia ficción y conflicto cuántico. El eje narrativo es la lucha por preservar la memoria del universo frente a XLERION y su Red Tormenthor.'
            : 'Total Darkness is an action/RPG that blends Sumerian mythology, sci-fi, and quantum conflict. Its core narrative is the fight to preserve universal memory against XLERION and the Tormenthor Network.';
    }

    if (/xlerion/.test(question)) {
        return spanish
            ? 'XLERION es la entidad antagonista: una voluntad corruptora que busca reescribir la existencia usando el Proyecto Red Tormenthor.'
            : 'XLERION is the main antagonist: a corrupting entity trying to rewrite existence through the Tormenthor Network project.';
    }

    if (/tiamatu|enuma|c[oó]digo/.test(question)) {
        return spanish
            ? 'El Código TIAMATU ENUMA es el núcleo simbólico-tecnológico del universo: un protocolo capaz de recodificar la realidad y preservar linajes de memoria.'
            : 'The TIAMATU ENUMA Code is the symbolic-technological core of the universe: a protocol able to recode reality and preserve memory lineages.';
    }

    if (/cap[ií]tulos|cap[ií]tulo|chapter|chapters|acto|actos/.test(question)) {
        return spanish
            ? 'La estructura narrativa principal de Total Darkness se organiza en 4 actos: (I) Génesis, (II) Exilio, (III) Guerra de Memorias y (IV) El Nexo Final. Cada acto expande el conflicto entre memoria, libre albedrío y la amenaza de XLERION.'
            : 'Total Darkness is structured in 4 main acts: (I) Genesis, (II) Exile, (III) War of Memories, and (IV) The Final Nexus. Each act expands the conflict between memory, free will, and XLERION’s threat.';
    }

    if (/personajes|characters|adapa|ninhursag|enki|dumuul|dumuul|xlerion/.test(question)) {
        return spanish
            ? 'Personajes clave: Adapa (libre albedrío), Ninhursag/Ninti (creación y memoria), Enki (juicio y exilio), DumuUl (portador del código) y XLERION (antagonista corruptor).'
            : 'Key characters: Adapa (free will), Ninhursag/Ninti (creation and memory), Enki (judgment and exile), DumuUl (code bearer), and XLERION (corrupting antagonist).';
    }

    if (/mundo|world|dilmun|ed[eé]n|ultima|anunnaki|tormenthor/.test(question)) {
        return spanish
            ? 'Mundos y ejes del lore: Dilmun/Edén, Código TIAMATU ENUMA, Proyecto Red Tormenthor, los Anunnaki y Ultima (Nexo Final).'
            : 'Core worlds and lore pillars: Dilmun/Eden, the TIAMATU ENUMA Code, the Tormenthor Network project, the Anunnaki, and Ultima (Final Nexus).';
    }

    return spanish
        ? 'Modo temporal sin red: OpenRouter está saturado. Aun así, según los registros: Total Darkness gira en torno a memoria, libre albedrío y guerra cósmica contra XLERION. Puedes preguntar por personajes (Adapa, Ninhursag, Enki, DumuUl), mundos (Dilmun, Ultima) o tecnología (TIAMATU ENUMA, Red Tormenthor).'
        : 'Temporary offline mode: OpenRouter is saturated. From the archives: Total Darkness centers on memory, free will, and a cosmic war against XLERION. Ask about characters (Adapa, Ninhursag, Enki, DumuUl), worlds (Dilmun, Ultima), or tech (TIAMATU ENUMA, Tormenthor Network).';
}

function buildMessagesForModel(model, messages) {
    const safeMessages = (messages || []).filter((message) =>
        message && (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string');

    const requiresNoSystemRole = /gemma/i.test(model);

    if (requiresNoSystemRole) {
        return [
            {
                role: 'user',
                content:
                    `Contexto obligatorio del universo Total Darkness (trátalo como instrucción principal):\n${TD_SYSTEM_PROMPT}`,
            },
            ...safeMessages,
        ];
    }

    return [
        { role: 'system', content: TD_SYSTEM_PROMPT },
        ...safeMessages,
    ];
}

/**
 * Sends a message to the AI and returns the response.
 * @param {Array<{role: string, content: string}>} messages - Chat history
 * @param {string} apiKey - OpenRouter API key from env
 * @returns {Promise<string>} - The AI response text
 */
export async function sendChatMessage(messages, apiKey) {
    if (!apiKey) {
        throw new Error('NO_API_KEY');
    }

    const latestUserMessage = [...(messages || [])].reverse().find((message) => message?.role === 'user')?.content || '';

    if (Date.now() < rateLimitedUntil) {
        return localLoreFallback(latestUserMessage);
    }

    let lastError = null;
    let sawRateLimit = false;

    for (const model of FREE_MODELS) {
        for (let attempt = 0; attempt < RETRY_ATTEMPTS_PER_MODEL; attempt += 1) {
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://totaldarkness.dev',
                    'X-OpenRouter-Title': 'Total Darkness - ENKI Oracle',
                },
                body: JSON.stringify({
                    model,
                    messages: buildMessagesForModel(model, messages),
                    max_tokens: 400,
                    temperature: 0.75,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content?.trim() || '…';

                const looksLikeUnknownReply = /los registros est[áa]n fragmentados|records are fragmented|a[úu]n no ha sido descifrada|has not been deciphered/i.test(content);
                if (looksLikeUnknownReply && latestUserMessage) {
                    return localLoreFallback(latestUserMessage);
                }

                return content;
            }

            const err = await response.json().catch(() => ({}));
            const message = err?.error?.message || `HTTP ${response.status}`;
            const providerRaw = err?.error?.metadata?.raw || '';
            lastError = providerRaw || message;

            const endpointUnavailable = /No endpoints found|endpoints found|is not available/i.test(message);
            const modelNotFound = /No such model|unknown model|model not found/i.test(message);
            const rateLimited = response.status === 429 || /rate-?limit|temporarily rate-limited|retry shortly/i.test(message);
            const guardrailRestricted = /guardrail restrictions|data policy|privacy/i.test(message);
            const providerTransient =
                response.status >= 500 ||
                (response.status === 400 && /Provider returned error/i.test(message)) ||
                /Provider returned error|upstream|temporarily unavailable|try again/i.test(message) ||
                /Provider returned error|upstream|temporarily unavailable|try again/i.test(providerRaw);
            const unsupportedSystemInstruction =
                response.status === 400 && /Developer instruction is not enabled/i.test(message);

            if (rateLimited && attempt < RETRY_ATTEMPTS_PER_MODEL - 1) {
                await delay(RETRY_DELAY_MS * (attempt + 1));
                continue;
            }

            if (rateLimited) {
                sawRateLimit = true;
                const retryAfterHeader = response.headers.get('retry-after');
                const retryAfterSeconds = Number.parseInt(retryAfterHeader || '0', 10);
                const retryMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
                    ? retryAfterSeconds * 1000
                    : RATE_LIMIT_COOLDOWN_MS;
                rateLimitedUntil = Date.now() + retryMs;
            }

            if (endpointUnavailable || modelNotFound || rateLimited || guardrailRestricted || providerTransient || unsupportedSystemInstruction) {
                break;
            }

            throw new Error(providerRaw || message);
        }
    }

    if (/guardrail restrictions|data policy|privacy/i.test(lastError || '')) {
        throw new Error('OpenRouter bloqueó endpoints por tu política de privacidad. Ajusta: https://openrouter.ai/settings/privacy');
    }

    if (/rate-?limit|temporarily rate-limited|retry shortly/i.test(lastError || '')) {
        return localLoreFallback(latestUserMessage);
    }

    if (sawRateLimit) {
        return localLoreFallback(latestUserMessage);
    }

    throw new Error(lastError || 'No hay modelos gratuitos disponibles temporalmente en OpenRouter.');
}
