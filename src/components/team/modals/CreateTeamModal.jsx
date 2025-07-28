import React, { useState } from 'react';

const CreateTeamModal = ({ showCreateTeam, setShowCreateTeam, createTeam }) => {
    const [teamName, setTeamName] = useState('');

    if (!showCreateTeam) return null;

    const handleSubmit = () => {
        createTeam(teamName);
        setTeamName(''); // Reset form
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                <button
                    onClick={() => setShowCreateTeam(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-white">Créer une équipe</h2>
                
                <input
                    type="text"
                    placeholder="Nom de l'équipe"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white mb-4 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    maxLength={50}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={!teamName.trim()}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-medium transition-colors text-white"
                    >
                        Créer
                    </button>
                    <button
                        onClick={() => setShowCreateTeam(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 p-3 rounded-lg font-medium transition-colors text-white"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamModal;