import React, { useState } from 'react';

const ImportMatchModal = ({ showImportMatch, setShowImportMatch, importMatch }) => {
    const [dragActive, setDragActive] = useState(false);

    if (!showImportMatch) return null;

    const handleFiles = (files) => {
        const file = files[0];
        if (!file) return;
        
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Veuillez sélectionner un fichier JSON valide');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                importMatch(jsonData);
            } catch (error) {
                console.error('JSON parsing error:', error);
                alert('Fichier JSON invalide ou corrompu');
            }
        };
        reader.readAsText(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                <button
                    onClick={() => setShowImportMatch(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-white">Importer une partie</h2>
                
                <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                            ? 'border-blue-400 bg-blue-400 bg-opacity-10' 
                            : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-gray-300 mb-4">
                        Glissez votre fichier JSON ici
                    </p>
                    <p className="text-sm text-gray-400 mb-4">ou</p>
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors text-white font-medium"
                    >
                        Choisir un fichier
                    </label>
                </div>
                
                <div className="mt-4 text-sm text-gray-400">
                    <p>Formats acceptés: .json</p>
                    <p>Taille maximum: 10MB</p>
                </div>
            </div>
        </div>
    );
};

export default ImportMatchModal;