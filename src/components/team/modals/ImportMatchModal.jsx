import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

const ImportMatchModal = ({ showImportMatch, setShowImportMatch, importMatch }) => {
  const [jsonData, setJsonData] = useState('');

  if (!showImportMatch) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData);
      importMatch(parsedData);
      setJsonData('');
    } catch (error) {
      alert('JSON invalide. Veuillez vérifier le format.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonData(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-green-600" />
            Importer une partie
          </h2>
          <button
            onClick={() => setShowImportMatch(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uploader un fichier JSON
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="text-center text-gray-500">
            ou
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Coller les données JSON
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={10}
              placeholder='{"gameId": "12345", "gameMode": "CLASSIC", ...}'
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Format attendu</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Données JSON valides d'une partie LoL</li>
              <li>• Format Riot Games API recommandé</li>
              <li>• Vérifiez la syntaxe avant d'importer</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!jsonData.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Importer la partie
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportMatchModal;