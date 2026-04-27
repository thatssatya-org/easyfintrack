import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

const PROVIDER_CONFIG = {
    google: {
        authorizeUrl: GOOGLE_AUTHORIZE_URL,
        clientIdEnv: 'VITE_GOOGLE_CLIENT_ID',
        scope: 'openid email profile',
    },
    github: {
        authorizeUrl: GITHUB_AUTHORIZE_URL,
        clientIdEnv: 'VITE_GITHUB_CLIENT_ID',
        scope: 'user:email',
    },
};

function base64UrlEncode(bytes) {
    let str = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBytes(length) {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    return arr;
}

async function sha256(input) {
    const enc = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', enc);
    return new Uint8Array(digest);
}

async function generatePkcePair() {
    const verifier = base64UrlEncode(randomBytes(64));
    const challenge = base64UrlEncode(await sha256(verifier));
    return { verifier, challenge };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('auth_token');
        const storedUser = sessionStorage.getItem('auth_user');
        const storedProvider = sessionStorage.getItem('auth_provider');
        if (storedToken) setToken(storedToken);
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
        }
        if (storedProvider) setProvider(storedProvider);
    }, []);

    const login = useCallback(async (providerName) => {
        const cfg = PROVIDER_CONFIG[providerName];
        if (!cfg) throw new Error(`Unknown provider: ${providerName}`);

        const clientId = import.meta.env[cfg.clientIdEnv];
        const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
        if (!clientId) throw new Error(`Missing ${cfg.clientIdEnv}`);
        if (!redirectUri) throw new Error('Missing VITE_OAUTH_REDIRECT_URI');

        const { verifier, challenge } = await generatePkcePair();
        const state = base64UrlEncode(randomBytes(16));

        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_code_verifier', verifier);
        sessionStorage.setItem('oauth_provider_pending', providerName);

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: cfg.scope,
            state,
            code_challenge: challenge,
            code_challenge_method: 'S256',
        });

        window.location.assign(`${cfg.authorizeUrl}?${params.toString()}`);
    }, []);

    const setSession = useCallback(({ token: nextToken, user: nextUser, provider: nextProvider }) => {
        sessionStorage.setItem('auth_token', nextToken);
        sessionStorage.setItem('auth_user', JSON.stringify(nextUser));
        if (nextProvider) sessionStorage.setItem('auth_provider', nextProvider);
        setToken(nextToken);
        setUser(nextUser);
        if (nextProvider) setProvider(nextProvider);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_provider');
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_code_verifier');
        sessionStorage.removeItem('oauth_provider_pending');
        setToken(null);
        setUser(null);
        setProvider(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, provider, login, logout, setSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
