import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { setSession } = useAuth();
    const [error, setError] = useState(null);
    const ranRef = useRef(false);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;

        const code = params.get('code');
        const state = params.get('state');
        const oauthError = params.get('error');

        const clearOAuthStorage = () => {
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_code_verifier');
            sessionStorage.removeItem('oauth_provider_pending');
        };

        if (oauthError) {
            clearOAuthStorage();
            setError(`OAuth provider error: ${oauthError}`);
            return;
        }
        if (!code || !state) {
            clearOAuthStorage();
            setError('Missing code or state in callback URL');
            return;
        }

        const storedState = sessionStorage.getItem('oauth_state');
        const verifier = sessionStorage.getItem('oauth_code_verifier');
        const provider = sessionStorage.getItem('oauth_provider_pending');

        if (!storedState || storedState !== state) {
            clearOAuthStorage();
            setError('State mismatch — possible CSRF attempt. Please try signing in again.');
            return;
        }
        if (!verifier || !provider) {
            clearOAuthStorage();
            setError('Missing PKCE verifier or provider. Please try signing in again.');
            return;
        }

        const baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8080';
        const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;

        if (!redirectUri) {
            clearOAuthStorage();
            setError('OAuth redirect URI is not configured');
            return;
        }

        (async () => {
            try {
                const resp = await fetch(`${baseUrl}/v1/auth/callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code,
                        provider,
                        redirect_uri: redirectUri,
                        code_verifier: verifier,
                    }),
                });

                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(`Token exchange failed (${resp.status}): ${text}`);
                }

                const data = await resp.json();
                if (!data.token || !data.user) {
                    throw new Error('Invalid response from auth callback');
                }

                clearOAuthStorage();

                setSession({ token: data.token, user: data.user, provider });
                navigate('/', { replace: true });
            } catch (e) {
                setError(e.message || 'Authentication failed');
            }
        })();
    }, [params, navigate, setSession]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full p-8 text-center">
                    <h2 className="font-display text-2xl text-coral-400 mb-3">Sign-in failed</h2>
                    <p className="text-carbon-300 text-sm mb-6 break-words">{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate('/', { replace: true })}
                        className="btn-primary"
                    >
                        Back to sign in
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-carbon-700 border-t-amber-400 animate-spin" />
                <p className="text-carbon-400 text-sm">Completing sign-in…</p>
            </div>
        </div>
    );
}
