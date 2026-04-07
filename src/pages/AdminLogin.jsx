import React, { useState } from 'react';
import { useAdminAuth } from '../api/auth.js'; // Import the custom hook

const BACKGROUND_IMAGE_URL = "https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg";
 
const AdminLogin = () => {
  const [email, setEmail] = useState(''); // Renamed setUsername to setEmail for clarity
  const [password, setPassword] = useState('');

  const { loading, error, success, login } = useAdminAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = await login(email, password);
    if (token) {
    }
    
    setPassword(''); 
  };
  const inputClasses = "w-full p-3 border border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-200 shadow-inner";

  const buttonClasses = `w-full p-3 rounded-xl font-bold text-lg text-white shadow-lg transition duration-300 transform hover:scale-[1.01] ${
    loading 
      ? 'bg-cyan-800 cursor-not-allowed shadow-none' 
      : 'bg-cyan-700 hover:bg-cyan-900  '
  }`;

  const errorClasses = "p-3 bg-red-800/80 text-white text-sm rounded-xl border border-red-600 shadow-xl animate-shake";


  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gray-900/50 z-0"></div> 

      <div className="w-full max-w-md bg-gray-800/6 p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700 relative z-10 backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wider">
          ADMIN LOGIN
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              required
              className={inputClasses}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={inputClasses}
              disabled={loading}
            />
          </div>

          {error && (
            <div className={errorClasses}>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-700/80 text-white text-sm rounded-xl border border-green-600">
              Login successful! Redirecting...
            </div>
          )}

          <button
            type="submit"
            className={buttonClasses}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white inline mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'SECURE LOGIN'
            )}
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-500 mt-8">
          © 2025 Admin System. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;