import http from 'node:http';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT || 8080);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

const sessions = new Map();

function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
            if (data.length > 1_000_000) {
                reject(new Error('Body too large'));
                req.destroy();
            }
        });
        req.on('end', () => {
            if (!data) return resolve({});
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
        req.on('error', reject);
    });
}

async function exchangeGithubCode({ code, redirectUri, codeVerifier }) {
    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
    });
    if (codeVerifier) params.set('code_verifier', codeVerifier);

    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });
    if (!tokenResp.ok) {
        throw new Error(`GitHub token endpoint returned ${tokenResp.status}`);
    }
    const tokenData = await tokenResp.json();
    if (tokenData.error || !tokenData.access_token) {
        throw new Error(tokenData.error_description || tokenData.error || 'No access_token returned');
    }
    return tokenData.access_token;
}

async function fetchGithubUser(accessToken) {
    const resp = await fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'easyfintrack-oauth',
        },
    });
    if (!resp.ok) throw new Error(`GitHub user endpoint returned ${resp.status}`);
    const u = await resp.json();
    return {
        id: String(u.id),
        login: u.login,
        name: u.name || u.login,
        email: u.email || null,
        avatar_url: u.avatar_url || null,
    };
}

async function handleAuthCallback(req, res) {
    let body;
    try { body = await readJsonBody(req); }
    catch { return sendJson(res, 400, { error: 'invalid_json' }); }

    const { code, provider, redirect_uri: redirectUri, code_verifier: codeVerifier } = body || {};
    if (!code || !provider || !redirectUri) {
        return sendJson(res, 400, { error: 'missing_fields' });
    }

    if (provider !== 'github') {
        return sendJson(res, 501, { error: 'provider_not_implemented', provider });
    }

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        return sendJson(res, 500, { error: 'server_misconfigured', detail: 'GITHUB_CLIENT_ID/SECRET not set' });
    }

    try {
        const accessToken = await exchangeGithubCode({ code, redirectUri, codeVerifier });
        const user = await fetchGithubUser(accessToken);

        const sessionToken = crypto.randomBytes(32).toString('hex');
        sessions.set(sessionToken, {
            user,
            provider: 'github',
            accessToken,
            createdAt: Date.now(),
        });

        return sendJson(res, 200, { token: sessionToken, user });
    } catch (err) {
        return sendJson(res, 502, { error: 'oauth_exchange_failed', detail: err.message });
    }
}

const server = http.createServer(async (req, res) => {
    setCors(res);
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'POST' && url.pathname === '/v1/auth/callback') {
        return handleAuthCallback(req, res);
    }

    if (req.method === 'GET' && url.pathname === '/v1/auth/me') {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
        const sess = token && sessions.get(token);
        if (!sess) return sendJson(res, 401, { error: 'unauthorized' });
        return sendJson(res, 200, { user: sess.user, provider: sess.provider });
    }

    if (req.method === 'GET' && url.pathname === '/healthz') {
        return sendJson(res, 200, { ok: true, sessions: sessions.size });
    }

    sendJson(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => {
    console.log(`[easyfintrack-api] listening on :${PORT}`);
});
