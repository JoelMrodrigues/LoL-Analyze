import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-black bg-opacity-60 backdrop-blur-sm">
      {/* Footer discret */}
<div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 px-6 py-2 text-center text-xs text-gray-500 z-10">
  <div className="flex justify-between items-center">
    <span>Développé avec ❤️ pour la communauté League of Legends</span>
    <span>Données fournies par Riot Games API</span>
  </div>
</div>
    </footer>
  );
};

export default Footer;