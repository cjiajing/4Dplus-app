import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalData } from '../contexts/LocalDataContext';
import { Bell, TrendingUp, Calendar, ChevronRight, Sparkles, Radio, Users } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeProfile, profiles, setActiveProfile, predictions } = useLocalData();
  const [alerts, setAlerts] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);

  // Fetch latest draw from Supabase (public data only)
  useEffect(() => {
    fetchLatestDraw();
  }, []);

  useEffect(() => {
    if (predictions) {
      const highProb = predictions.filter(p => p.confidence > 70);
      setAlerts(highProb);
    }
  }, [predictions]);

  const fetchLatestDraw = async () => {
    // This will be replaced with your actual Supabase query
    // For now, using sample data
    setLatestDraw({
      date: new Date().toLocaleDateString('en-MY', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      first: '9651',
      second: '3688',
      third: '2645'
    });
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <Users size={64} className="text-blue-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profile Selected</h2>
        <p className="text-gray-500 mb-6">Select or create a profile to see personalized predictions</p>
        <button
          onClick={() => navigate('/profiles')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Manage Profiles
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Switcher */}
      {profiles.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => setActiveProfile(profile)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all
                ${activeProfile.id === profile.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 border border-blue-200'}`}
            >
              {profile.name}
            </button>
          ))}
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-blue-100">Welcome back,</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{activeProfile.name}</h1>
          <p className="text-blue-100 text-sm">Your personal numbers are ready</p>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell size={20} className="text-red-500" />
              <span>Hot Picks Alert!</span>
            </h2>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full animate-pulse">
              {alerts.length} new
            </span>
          </div>
          
          <div className="space-y-2">
            {alerts.slice(0, 2).map((alert, index) => (
              <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-3xl font-mono font-bold text-red-600">{alert.number}</span>
                  <span className="bg-red-200 text-red-700 text-xs px-2 py-1 rounded-full">
                    {alert.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  Last appeared: {alert.lastAppearance 
                    ? new Date(alert.lastAppearance).toLocaleDateString() 
                    : 'Never'}
                  {alert.prizeCategory && ` (${alert.prizeCategory})`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Draw Results */}
      {latestDraw && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Radio size={20} className="text-blue-600" />
              Latest Draw
            </h2>
            <span className="text-sm text-gray-500">{latestDraw.date}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <ResultCard place="1st" number={latestDraw.first} color="yellow" />
            <ResultCard place="2nd" number={latestDraw.second} color="gray" />
            <ResultCard place="3rd" number={latestDraw.third} color="orange" />
          </div>

          <button
            onClick={() => navigate('/live-draw')}
            className="w-full mt-4 text-blue-600 text-sm flex items-center justify-center gap-1 py-2"
          >
            View full results <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<TrendingUp size={20} className="text-green-600" />}
          label="Total Numbers"
          value={activeProfile.birthDates?.length + activeProfile.phoneNumbers?.length + activeProfile.favoriteNumbers?.length || 0}
          subtext="Personal numbers"
        />
        <StatCard 
          icon={<Calendar size={20} className="text-blue-600" />}
          label="Next Draw"
          value="2 days"
          subtext={new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}
        />
      </div>

      {/* Predictions Preview */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            Your AI Picks
          </h2>
          <button 
            onClick={() => navigate('/predictions')}
            className="text-blue-600 text-sm flex items-center"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {predictions?.slice(0, 3).map((pred, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-xl font-mono font-bold">{pred.number}</span>
                {pred.lastAppearance && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last: {new Date(pred.lastAppearance).toLocaleDateString()} 
                    {pred.prizeCategory && ` • ${pred.prizeCategory}`}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold px-2 py-1 rounded-full
                  ${pred.confidence > 70 ? 'bg-green-100 text-green-700' : 
                    pred.confidence > 50 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-700'}`}>
                  {pred.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ place, number, color }) => {
  const colors = {
    yellow: 'from-yellow-400 to-yellow-500',
    gray: 'from-gray-400 to-gray-500',
    orange: 'from-orange-400 to-orange-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-3 text-white text-center`}>
      <span className="text-xs opacity-90">{place}</span>
      <div className="text-xl font-mono font-bold mt-1">{number}</div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{subtext}</div>
  </div>
);

export default Dashboard;
