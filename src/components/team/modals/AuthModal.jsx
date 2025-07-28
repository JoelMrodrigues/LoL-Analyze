import React, { useState } from 'react';

const AuthModal = ({ showAuth, setShowAuth, handleAuth, handleGoogleAuth }) => {
    const [authType, setAuthType] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!showAuth) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                <button
                    onClick={() => setShowAuth(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    {authType === 'login' ? 'Connexion' : 'Inscription'}
                </h2>
                
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    
                    <button
                        onClick={() => handleAuth(authType, email, password)}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-colors text-white"
                    >
                        {authType === 'login' ? 'Se connecter' : 'S\'inscrire'}
                    </button>
                    
                    <button
                        onClick={handleGoogleAuth}
                        className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white"
                    >
                        <span>🔴</span> Continuer avec Google
                    </button>
                </div>
                
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setAuthType(authType === 'login' ? 'register' : 'login')}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                        {authType === 'login' ? 'Créer un compte' : 'Déjà un compte ?'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;