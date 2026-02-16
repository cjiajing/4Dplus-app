import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Radio, User, Menu, Sparkles } from 'lucide-react';
import { useLocalData } from '../contexts/LocalDataContext';

const MobileLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeProfile } = useLocalData();
  
  const showNav = !['/', '/profiles'].includes(location.pathname) && activeProfile;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm z-10 px-4 py-3 flex items-center justify-between border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            4Dplus
          </span>
        </div>
        {activeProfile && (
          <button 
            onClick={() => navigate('/profiles')}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Menu size={20} className="text-blue-600" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className={`pt-16 ${showNav ? 'pb-20' : 'pb-4'} px-4`}>
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-blue-100 px-4 py-2">
          <div className="flex justify-around items-center">
            <NavButton 
              icon={<Home size={24} />}
              label="Home"
              active={location.pathname === '/dashboard'}
              onClick={() => navigate('/dashboard')}
            />
            <NavButton 
              icon={<Radio size={24} />}
              label="Live"
              active={location.pathname === '/live-draw'}
              onClick={() => navigate('/live-draw')}
            />
            <NavButton 
              icon={<TrendingUp size={24} />}
              label="AI Picks"
              active={location.pathname === '/predictions'}
              onClick={() => navigate('/predictions')}
            />
            <NavButton 
              icon={<User size={24} />}
              label="Profile"
              active={location.pathname === '/profiles'}
              onClick={() => navigate('/profiles')}
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
    className={`flex flex-col items-center p-2 rounded-lg transition-all
      ${active 
        ? 'text-blue-600 scale-110' 
        : 'text-gray-500 hover:text-gray-700'}`}
  >
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

export default MobileLayout;
