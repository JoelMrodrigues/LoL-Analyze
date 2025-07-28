import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const navigation = [
    { href: '/', label: 'Accueil' },
    { href: '/profil', label: 'Profil' },
    { href: '/analyse', label: 'Analyse' },
    { href: '/data-champ', label: 'Data Champ' },
    { href: '/amelioration', label: 'Amélioration' },
    { href: '/team', label: 'Team' }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black bg-opacity-60 backdrop-blur-md text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">LoL Analyzer</h1>
        </Link>
        
        <nav>
          <ul className="flex space-x-6 items-center">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link 
                  to={item.href} 
                  className={`hover:text-blue-400 transition-colors ${
                    isActive(item.href) ? 'text-blue-400 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;