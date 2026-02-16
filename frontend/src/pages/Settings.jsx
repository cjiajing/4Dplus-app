import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Bell, Moon, Globe, LogOut, ChevronRight, Sparkles, Shield, HelpCircle } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-2">
          <SettingItem 
            icon={<Bell size={20} />}
            label="Notifications"
            value="Enabled"
            onClick={() => {}}
          />
          <SettingItem 
            icon={<Moon size={20} />}
            label="Dark Mode"
            value="Off"
            onClick={() => {}}
          />
          <SettingItem 
            icon={<Globe size={20} />}
            label="Language"
            value="English"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-2">
          <SettingItem 
            icon={<Shield size={20} />}
            label="Privacy"
            value=""
            onClick={() => {}}
          />
          <SettingItem 
            icon={<HelpCircle size={20} />}
            label="Help & Support"
            value=""
            onClick={() => {}}
          />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span>Log Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Version */}
      <div className="text-center">
        <p className="text-xs text-gray-500">4Dplus App v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">© 2024 4Dplus. All rights reserved.</p>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <span className="text-gray-600">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-500">{value}</span>}
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  </button>
);

export default Settings;
