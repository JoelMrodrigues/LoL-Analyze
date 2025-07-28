import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className={`pt-20 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;