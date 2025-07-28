import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Users, Trophy, Star, Zap } from 'lucide-react';
import Header from '../components/common/Header';

const Accueil = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <div className="h-screen bg-cover bg-center relative" style={{backgroundImage: "url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jhin_1.jpg')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center p-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-6">
            Maîtrise tes performances
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Analyse complète de tes parties League of Legends. Statistiques précises, visualisations claires, et insights stratégiques.
          </p>
          <Link 
            to="/profil" 
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Commencer l'analyse
          </Link>
        </div>
      </div>

      {/* Cards Section */}
      <main className="bg-gray-900 text-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center mb-16">
          
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:scale-105 hover:bg-gray-700 transition duration-300">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">🔍 Profil</h2>
            <p className="text-sm mb-6">
              Rentre ton pseudo et découvre ton historique de matchs, ton winrate, tes statistiques détaillées et plus.
            </p>
            <Link to="/profil" className="text-blue-500 underline hover:text-blue-300">
              Voir le profil
            </Link>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:scale-105 hover:bg-gray-700 transition duration-300">
            <h2 className="text-2xl font-bold mb-4 text-green-400">📊 Analyse</h2>
            <p className="text-sm mb-6">
              Analyse détaillée par rôle, champion, side. Visualise ton KDA, ta vision, ta participation aux kills...
            </p>
            <Link to="/analyse" className="text-green-400 underline hover:text-green-200">
              Lancer une analyse
            </Link>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:scale-105 hover:bg-gray-700 transition duration-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">📚 Data</h2>
            <p className="text-sm mb-6">
              Accède à des tableaux de données clairs et exportables pour mieux comprendre tes performances.
            </p>
            <Link to="/data-champ" className="text-purple-400 underline hover:text-purple-200">
              Explorer les données
            </Link>
          </div>
        </div>

        {/* Nouveaux tableaux */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top 5 Solo Queue LP */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center" style={{color: '#60a5fa'}}>
                <Trophy className="mr-2" />
                Top 5 Solo Queue LP
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Pseudo</th>
                      <th className="text-left p-2">Rôle</th>
                      <th className="text-left p-2">Équipe</th>
                      <th className="text-left p-2">LP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold" style={{color: '#fbbf24'}}>1</td>
                      <td className="p-2 font-semibold" style={{color: '#93c5fd'}}>BRO Hena</td>
                      <td className="p-2">Mid</td>
                      <td className="p-2">
                        <img src="https://lolstatic-a.akamaihd.net/esports-assets/production/team/bro-new-9dkgc9ky.png" 
                             alt="BRO" className="w-6 h-6 rounded" />
                      </td>
                      <td className="p-2 font-bold" style={{color: '#fbbf24'}}>1822</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold" style={{color: '#d1d5db'}}>2</td>
                      <td className="p-2 font-semibold" style={{color: '#93c5fd'}}>Gen.G Chovy</td>
                      <td className="p-2">Mid</td>
                      <td className="p-2">
                        <img src="https://lolstatic-a.akamaihd.net/esports-assets/production/team/gen-g-new-3l3hzaac.png" 
                             alt="Gen.G" className="w-6 h-6 rounded" />
                      </td>
                      <td className="p-2 font-bold" style={{color: '#d1d5db'}}>1777</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold" style={{color: '#fb923c'}}>3</td>
                      <td className="p-2 font-semibold" style={{color: '#93c5fd'}}>KDF BuLLDoG</td>
                      <td className="p-2">ADC</td>
                      <td className="p-2">
                        <img src="https://lolstatic-a.akamaihd.net/esports-assets/production/team/kwangdong-freecs-7ckvtv84.png" 
                             alt="KDF" className="w-6 h-6 rounded" />
                      </td>
                      <td className="p-2 font-bold" style={{color: '#fb923c'}}>1711</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2" style={{color: '#9ca3af'}}>4</td>
                      <td className="p-2 font-semibold" style={{color: '#93c5fd'}}>DK Canyon</td>
                      <td className="p-2">Jungle</td>
                      <td className="p-2">
                        <img src="https://lolstatic-a.akamaihd.net/esports-assets/production/team/damwon-kia-4bzrk9vn.png" 
                             alt="DK" className="w-6 h-6 rounded" />
                      </td>
                      <td className="p-2" style={{color: '#9ca3af'}}>1687</td>
                    </tr>
                    <tr className="hover:bg-gray-700">
                      <td className="p-2" style={{color: '#9ca3af'}}>5</td>
                      <td className="p-2 font-semibold" style={{color: '#93c5fd'}}>NS Calix</td>
                      <td className="p-2">Top</td>
                      <td className="p-2">
                        <img src="https://lolstatic-a.akamaihd.net/esports-assets/production/team/nongshim-redforce-c2yotvqb.png" 
                             alt="NS" className="w-6 h-6 rounded" />
                      </td>
                      <td className="p-2" style={{color: '#9ca3af'}}>1654</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 5 Champions MSI 2025 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center" style={{color: '#c084fc'}}>
                <Star className="mr-2" />
                Top 5 Champions MSI 2025
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Champion</th>
                      <th className="text-left p-2">Pick Rate</th>
                      <th className="text-left p-2">Ban Rate</th>
                      <th className="text-left p-2">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold" style={{color: '#fbbf24'}}>1</td>
                      <td className="p-2 flex items-center">
                        <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Azir.png" 
                             alt="Azir" className="w-8 h-8 rounded mr-2" />
                        <span className="font-semibold">Azir</span>
                      </td>
                      <td className="p-2" style={{color: '#4ade80'}}>68%</td>
                      <td className="p-2" style={{color: '#f87171'}}>24%</td>
                      <td className="p-2" style={{color: '#60a5fa'}}>64%</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold" style={{color: '#d1d5db'}}>2</td>
                      <td className="p-2 flex items-center">
                        <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Viego.png" 
                             alt="Viego" className="w-8 h-8 rounded mr-2" />
                        <span className="font-semibold">Viego</span>
                      </td>
                      <td className="p-2" style={{color: '#4ade80'}}>62%</td>
                      <td className="p-2" style={{color: '#f87171'}}>31%</td>
                      <td className="p-2" style={{color: '#60a5fa'}}>58%</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 font-bold" style={{color: '#fb923c'}}>3</td>
                      <td className="p-2 flex items-center">
                        <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Jinx.png" 
                             alt="Jinx" className="w-8 h-8 rounded mr-2" />
                        <span className="font-semibold">Jinx</span>
                      </td>
                      <td className="p-2" style={{color: '#4ade80'}}>59%</td>
                      <td className="p-2" style={{color: '#f87171'}}>18%</td>
                      <td className="p-2" style={{color: '#60a5fa'}}>72%</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2" style={{color: '#9ca3af'}}>4</td>
                      <td className="p-2 flex items-center">
                        <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Rakan.png" 
                             alt="Rakan" className="w-8 h-8 rounded mr-2" />
                        <span className="font-semibold">Rakan</span>
                      </td>
                      <td className="p-2" style={{color: '#4ade80'}}>55%</td>
                      <td className="p-2" style={{color: '#f87171'}}>29%</td>
                      <td className="p-2" style={{color: '#60a5fa'}}>61%</td>
                    </tr>
                    <tr className="hover:bg-gray-700">
                      <td className="p-2" style={{color: '#9ca3af'}}>5</td>
                      <td className="p-2 flex items-center">
                        <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Vi.png" 
                             alt="Vi" className="w-8 h-8 rounded mr-2" />
                        <span className="font-semibold">Vi</span>
                      </td>
                      <td className="p-2" style={{color: '#4ade80'}}>51%</td>
                      <td className="p-2" style={{color: '#f87171'}}>42%</td>
                      <td className="p-2" style={{color: '#60a5fa'}}>56%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top 10 Champions Solo Queue */}
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center" style={{color: '#4ade80'}}>
              <Zap className="mr-2" />
              Top 10 Champions Solo Queue - Patch 25.14
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">#</th>
                    <th className="text-left p-3">Champion</th>
                    <th className="text-left p-3">Rôle</th>
                    <th className="text-left p-3">Pick Rate</th>
                    <th className="text-left p-3">Ban Rate</th>
                    <th className="text-left p-3">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 font-bold text-lg" style={{color: '#fbbf24'}}>1</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Jinx.png" 
                           alt="Jinx" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Jinx</span>
                    </td>
                    <td className="p-3">ADC</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>24.8%</td>
                    <td className="p-3" style={{color: '#f87171'}}>8.2%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>52.4%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 font-bold text-lg" style={{color: '#d1d5db'}}>2</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Yasuo.png" 
                           alt="Yasuo" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Yasuo</span>
                    </td>
                    <td className="p-3">Mid</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>22.1%</td>
                    <td className="p-3" style={{color: '#f87171'}}>12.7%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>49.8%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 font-bold text-lg" style={{color: '#fb923c'}}>3</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Ezreal.png" 
                           alt="Ezreal" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Ezreal</span>
                    </td>
                    <td className="p-3">ADC</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>21.3%</td>
                    <td className="p-3" style={{color: '#f87171'}}>6.4%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>48.9%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>4</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Thresh.png" 
                           alt="Thresh" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Thresh</span>
                    </td>
                    <td className="p-3">Support</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>19.7%</td>
                    <td className="p-3" style={{color: '#f87171'}}>9.1%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>50.2%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>5</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/LeeSin.png" 
                           alt="Lee Sin" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Lee Sin</span>
                    </td>
                    <td className="p-3">Jungle</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>18.9%</td>
                    <td className="p-3" style={{color: '#f87171'}}>7.3%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>47.6%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>6</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Kai'Sa.png" 
                           alt="Kai'Sa" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Kai'Sa</span>
                    </td>
                    <td className="p-3">ADC</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>18.2%</td>
                    <td className="p-3" style={{color: '#f87171'}}>5.8%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>51.7%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>7</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Lux.png" 
                           alt="Lux" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Lux</span>
                    </td>
                    <td className="p-3">Support</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>17.4%</td>
                    <td className="p-3" style={{color: '#f87171'}}>4.9%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>52.1%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>8</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Yone.png" 
                           alt="Yone" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Yone</span>
                    </td>
                    <td className="p-3">Mid</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>16.8%</td>
                    <td className="p-3" style={{color: '#f87171'}}>11.4%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>49.3%</td>
                  </tr>
                  <tr className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>9</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Graves.png" 
                           alt="Graves" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Graves</span>
                    </td>
                    <td className="p-3">Jungle</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>16.1%</td>
                    <td className="p-3" style={{color: '#f87171'}}>8.7%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>50.9%</td>
                  </tr>
                  <tr className="hover:bg-gray-700">
                    <td className="p-3 text-lg" style={{color: '#9ca3af'}}>10</td>
                    <td className="p-3 flex items-center">
                      <img src="https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Caitlyn.png" 
                           alt="Caitlyn" className="w-10 h-10 rounded mr-3" />
                      <span className="font-semibold text-lg">Caitlyn</span>
                    </td>
                    <td className="p-3">ADC</td>
                    <td className="p-3 font-semibold" style={{color: '#4ade80'}}>15.6%</td>
                    <td className="p-3" style={{color: '#f87171'}}>7.2%</td>
                    <td className="p-3 font-semibold" style={{color: '#60a5fa'}}>50.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-center" style={{color: '#9ca3af'}}>
              * Données mises à jour automatiquement à chaque patch
            </div>
          </div>
        </div>
        
      </main>
    </div>
    
  );
};

export default Accueil;