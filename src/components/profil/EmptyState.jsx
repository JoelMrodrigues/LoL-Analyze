import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = () => (
  <div className="text-center text-white py-12">
    <Search className="mx-auto h-16 w-16 text-blue-300 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Commencez votre analyse</h3>
    <p className="text-blue-200">Entrez votre pseudo Riot pour voir vos statistiques</p>
  </div>
);

export default EmptyState;