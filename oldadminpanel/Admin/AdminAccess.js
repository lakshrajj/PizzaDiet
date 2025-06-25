import React, { useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';

const AdminAccess = ({ onAdminLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password === 'pizzadiet2025') {
      onAdminLogin();
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Access</h2>
          <p className="text-gray-600 mt-2">Enter the admin password to continue</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Admin Password"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 transition-all duration-300"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-shake">
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading || !password}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 disabled:scale-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner w-5 h-5"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Settings size={20} />
                <span>Access Admin Panel</span>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>Forgot the password? Contact the administrator.</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminAccess;