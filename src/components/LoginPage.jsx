import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.06-1.1-.16-1.6H12z"/>
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2 .1 3 .4C17.5 4.4 18.5 4.7 18.5 4.7c.7 1.7.3 2.9.1 3.1.8.9 1.2 2 1.2 3.2 0 4.5-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z"/>
        </svg>
    );
}

export default function LoginPage() {
    const { login } = useAuth();
    const [pending, setPending] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = async (provider) => {
        setError(null);
        setPending(provider);
        try {
            await login(provider);
        } catch (e) {
            setError(e.message || 'Failed to start sign-in');
            setPending(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8 sm:p-10 animate-fade-up">
                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl sm:text-4xl text-gradient-gold mb-2">
                        EasyFinTrack
                    </h1>
                    <p className="text-carbon-400 text-sm">
                        Sign in to access your transactions
                    </p>
                </div>

                <div className="accent-line mb-8" />

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => handleClick('google')}
                        disabled={pending !== null}
                        className="w-full flex items-center justify-center gap-3 bg-carbon-50 text-carbon-950 font-semibold px-5 py-3 rounded-xl hover:bg-white active:scale-[0.97] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <GoogleIcon />
                        <span>{pending === 'google' ? 'Redirecting…' : 'Sign in with Google'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleClick('github')}
                        disabled={pending !== null}
                        className="w-full flex items-center justify-center gap-3 bg-carbon-800 border border-carbon-700/60 text-carbon-50 font-semibold px-5 py-3 rounded-xl hover:bg-carbon-700 active:scale-[0.97] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <GithubIcon />
                        <span>{pending === 'github' ? 'Redirecting…' : 'Sign in with GitHub'}</span>
                    </button>
                </div>

                {error && (
                    <p className="mt-6 text-coral-400 text-sm text-center">{error}</p>
                )}

                <p className="mt-8 text-xs text-carbon-500 text-center leading-relaxed">
                    Secured with OAuth 2.0 PKCE.
                    <br />Tokens are stored only for this browser session.
                </p>
            </div>
        </div>
    );
}
