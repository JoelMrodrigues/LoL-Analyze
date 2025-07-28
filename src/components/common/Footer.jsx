import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <span>Développé avec</span>
            <span className="text-red-400">❤</span>
            <span>pour la communauté League of Legends</span>
          </div>
          <div className="mt-2 md:mt-0">
            <span>Données fournies par Riot Games API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;