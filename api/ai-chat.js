module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: { message: 'Method Not Allowed' } });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: { message: 'NO_API_KEY' } });
    }

    const body = req.body || {};
    const model = body.model;
    const messages = body.messages;
    const maxTokens = body.max_tokens;
    const temperature = body.temperature;

    if (!model || !Array.isArray(messages)) {
        return res.status(400).json({ error: { message: 'Invalid payload. Expected model and messages[]' } });
    }

    try {
        const upstreamResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://totaldarkness.dev',
                'X-OpenRouter-Title': 'Total Darkness - ENKI Oracle',
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: typeof maxTokens === 'number' ? maxTokens : 400,
                temperature: typeof temperature === 'number' ? temperature : 0.75,
            }),
        });

        const data = await upstreamResponse.json().catch(() => ({}));

        if (!upstreamResponse.ok) {
            return res.status(upstreamResponse.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(502).json({
            error: {
                message: error?.message || 'Upstream AI provider error',
            },
        });
    }
};
