// frontend/src/components/MobileLayout.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, User, Settings, Menu } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const MobileLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Don't show bottom nav on auth pages
  const showNav = !['/', '/register', '/login'].includes(location.pathname) && user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">4D</span>
          </div>
          <span className="ml-2 font-semibold text-gray-800">AI Predictor</span>
        </div>
        {user && (
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Main Content - Add padding for header and bottom nav */}
      <div className={`pt-16 ${showNav ? 'pb-20' : 'pb-4'} px-4`}>
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around items-center">
            <NavButton 
              icon={<Home size={24} />}
              label="Home"
              active={location.pathname === '/dashboard'}
              onClick={() => navigate('/dashboard')}
            />
            <NavButton 
              icon={<TrendingUp size={24} />}
              label="Predictions"
              active={location.pathname === '/predictions'}
              onClick={() => navigate('/predictions')}
            />
            <NavButton 
              icon={<User size={24} />}
              label="Profile"
              active={location.pathname === '/profile'}
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-colors
      ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default MobileLayout;
