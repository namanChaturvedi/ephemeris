import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Home from './pages/Home';
import BirthChart from './pages/BirthChart';
import MyHoroscopes from './pages/MyHoroscopes';
import Matching from './pages/Matching';
import Horoscopes from './pages/Horoscopes';
import AuspiciousTimes from './pages/AuspiciousTimes';
import NetworkSelector from './components/NetworkSelector';
import { useWallet } from './context/WalletContext';
import './App.css';

// Wallet button component
const WalletButton = () => {
  const { isConnected, account, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return isConnected ? (
    <div className="flex items-center space-x-2">
      <NetworkSelector />
      <button
        onClick={disconnectWallet}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        {formatAddress(account)}
      </button>
    </div>
  ) : (
    <button
      onClick={connectWallet}
      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
    >
      Connect Wallet
    </button>
  );
};

// App component with WalletButton
const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
        <header className="bg-indigo-800 bg-opacity-50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link to="/" className="text-2xl font-bold mb-4 md:mb-0">
                <span className="text-purple-400">✨ Ephemeris</span>
              </Link>
              
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
                <nav className="flex flex-wrap justify-center gap-2 md:gap-4 md:mr-6">
                  <Link to="/" className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Home
                  </Link>
                  <Link to="/birth-chart" className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Birth Chart
                  </Link>
                  <Link to="/my-horoscopes" className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    My Horoscopes
                  </Link>
                  <Link to="/matching" className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Matching
                  </Link>
                  <Link to="/horoscopes" className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Weekly Horoscopes
                  </Link>
                  <Link to="/auspicious-times" className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Auspicious Times
                  </Link>
                </nav>
                
                <WalletButton />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/birth-chart" element={<BirthChart />} />
            <Route path="/my-horoscopes" element={<MyHoroscopes />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/horoscopes" element={<Horoscopes />} />
            <Route path="/auspicious-times" element={<AuspiciousTimes />} />
          </Routes>
        </main>
        
        <footer className="bg-indigo-800 bg-opacity-50 py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Ephemeris</h3>
                <p className="text-indigo-300">
                  Blockchain-powered astrological insights and matchmaking
                </p>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                  Twitter
                </a>
                <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                  Discord
                </a>
                <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                  GitHub
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-indigo-700 text-center text-indigo-400">
              <p>© {new Date().getFullYear()} Ephemeris. All rights reserved.</p>
              <p className="mt-2 text-sm">Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0)</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;