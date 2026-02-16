import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalData } from '../contexts/LocalDataContext';
import { Bell, Moon, Globe, Database, ChevronRight, Sparkles, Shield, HelpCircle } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { profiles } = useLocalData();

  const clearAllData = () => {
    if (window.confirm('Clear all profiles and data? This cannot be undone.')) {
      localStorage.removeItem('4dplus_data');
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={24} className="text-blue-600" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Data Info */}
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          📱 All data stored locally on this device
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {profiles.length} profile(s) • Last backed up: Never
        </p>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-2">
          <SettingItem 
            icon={<Bell size={20} />}
            label="Notifications"
            value="Off"
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

      {/* Data Management */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4">Data</h2>
        <div className="space-y-2">
          <SettingItem 
            icon={<Database size={20} />}
            label="Export Data"
            value=""
            onClick={() => {
              const data = localStorage.getItem('4dplus_data');
              const blob = new Blob([data], {type: 'application/json'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '4dplus-backup.json';
              a.click();
            }}
          />
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <Shield size={20} />
              <span>Clear All Data</span>
            </div>
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4">Support</h2>
        <div className="space-y-2">
          <SettingItem 
            icon={<HelpCircle size={20} />}
            label="Help & FAQ"
            value=""
            onClick={() => window.alert('FAQ: Data is stored locally. No account needed. For support, contact...')}
          />
          <SettingItem 
            icon={<Shield size={20} />}
            label="Privacy Policy"
            value=""
            onClick={() => window.alert('All data stays on your device. We never collect or store your information.')}
          />
        </div>
      </div>

      {/* Version */}
      <div className="text-center">
        <p className="text-xs text-gray-500">4Dplus App v2.0 - Privacy First</p>
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
