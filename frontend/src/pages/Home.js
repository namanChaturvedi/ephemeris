import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';

const Home = () => {
  const { account } = useContext(WalletContext);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl overflow-hidden mb-12">
        <div className="md:flex">
          <div className="p-8 md:p-12 md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Your Cosmic Identity
            </h1>
            <p className="text-purple-100 text-lg mb-8">
              Mint your birth chart as an NFT and unlock the secrets of the stars. Find compatible matches and receive personalized horoscopes powered by blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/birth-chart"
                className="bg-white text-purple-700 hover:bg-purple-100 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 text-center"
              >
                Generate Birth Chart
              </Link>
              {account && (
                <Link
                  to="/matching"
                  className="bg-purple-800 text-white hover:bg-purple-900 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 text-center"
                >
                  Find Matches
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="h-64 md:h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80')" }}></div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-purple-800">Birth Chart NFTs</h3>
            <p className="text-gray-600 text-center">
              Mint your unique birth chart as an NFT on the blockchain. Own your astrological identity with complete privacy and security.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-purple-800">Compatibility Matching</h3>
            <p className="text-gray-600 text-center">
              Find your cosmic connections with our advanced astrological compatibility algorithm. Connect with like-minded souls.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-purple-800">Personalized Horoscopes</h3>
            <p className="text-gray-600 text-center">
              Receive weekly horoscopes and auspicious times tailored to your unique birth chart. Make the most of cosmic energies.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">How It Works</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>
          
          {/* Steps */}
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Enter Your Birth Details</h3>
                <p className="text-gray-600">
                  Provide your birth date, time, and location to generate your unique astrological profile.
                </p>
              </div>
              <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white font-bold">1</div>
              <div className="flex-1 md:pl-8">
                <img src="https://images.unsplash.com/photo-1484589065579-248aad0d8b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=459&q=80" alt="Birth Details" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center">
              <div className="flex-1 md:text-left md:pl-8 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Mint Your Birth Chart NFT</h3>
                <p className="text-gray-600">
                  Your birth chart is securely encrypted and minted as an NFT on the blockchain, giving you full ownership.
                </p>
              </div>
              <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white font-bold">2</div>
              <div className="flex-1 md:pr-8">
                <img src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80" alt="NFT Minting" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Find Compatible Matches</h3>
                <p className="text-gray-600">
                  Create a match request and discover other users with compatible birth charts based on astrological principles.
                </p>
              </div>
              <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white font-bold">3</div>
              <div className="flex-1 md:pl-8">
                <img src="https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Compatibility Matching" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center">
              <div className="flex-1 md:text-left md:pl-8 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Receive Personalized Insights</h3>
                <p className="text-gray-600">
                  Get weekly horoscopes and auspicious times tailored to your birth chart, helping you navigate life's journey.
                </p>
              </div>
              <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white font-bold">4</div>
              <div className="flex-1 md:pr-8">
                <img src="https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Personalized Insights" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-purple-100 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">Ready to Discover Your Cosmic Identity?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join thousands of users who have already unlocked the secrets of the stars. Your astrological journey begins with a single click.
        </p>
        <Link
          to="/birth-chart"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 inline-block"
        >
          Generate Your Birth Chart Now
        </Link>
      </div>
    </div>
  );
};

export default Home; 