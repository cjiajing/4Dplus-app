import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Mail, Calendar, Phone, MapPin, Heart, Edit2, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-blue-600">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.email}</h1>
            <p className="text-blue-100 text-sm">Member since Jan 2024</p>
            <div className="flex items-center gap-1 mt-2">
              <Sparkles size={14} className="text-yellow-300" />
              <span className="text-xs">Free Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <button 
            onClick={() => navigate('/settings')}
            className="text-blue-600 text-sm flex items-center gap-1"
          >
            <Edit2 size={14} />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <InfoItem 
            icon={<Mail size={18} className="text-gray-400" />}
            label="Email"
            value={user.email}
          />
          <InfoItem 
            icon={<Calendar size={18} className="text-gray-400" />}
            label="Birth Date"
            value={user.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'Not provided'}
          />
          <InfoItem 
            icon={<Phone size={18} className="text-gray-400" />}
            label="Phone"
            value={user.phone_number || 'Not provided'}
          />
          <InfoItem 
            icon={<MapPin size={18} className="text-gray-400" />}
            label="Address"
            value={user.address || 'Not provided'}
          />
          <InfoItem 
            icon={<Heart size={18} className="text-gray-400" />}
            label="Favorite Number"
            value={user.favorite_number || 'Not provided'}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Your Statistics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <StatBox 
            label="Total Predictions"
            value="156"
            change="+12 this week"
          />
          <StatBox 
            label="Accuracy Rate"
            value="23%"
            change="+5% vs last month"
          />
          <StatBox 
            label="Best Hit"
            value="2nd Prize"
            subvalue="Number: 1985"
          />
          <StatBox 
            label="Active Alerts"
            value="3"
            subvalue="High probability"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award size={20} className="text-blue-600" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          <ActivityItem 
            date="15 Jan 2024"
            description="Number 1985 appeared as 2nd Prize"
            type="win"
          />
          <ActivityItem 
            date="12 Jan 2024"
            description="3 new high-probability alerts"
            type="alert"
          />
          <ActivityItem 
            date="08 Jan 2024"
            description="Prediction accuracy improved"
            type="improvement"
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const StatBox = ({ label, value, change, subvalue }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
    {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
    {subvalue && <p className="text-xs text-gray-500 mt-1">{subvalue}</p>}
  </div>
);

const ActivityItem = ({ date, description, type }) => {
  const colors = {
    win: 'bg-green-100 text-green-600',
    alert: 'bg-red-100 text-red-600',
    improvement: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-2 h-2 mt-2 rounded-full ${colors[type]}`}></div>
      <div>
        <p className="text-sm text-gray-800">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
    </div>
  );
};

export default Profile;
