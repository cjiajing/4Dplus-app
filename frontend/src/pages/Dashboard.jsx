import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalData } from '../contexts/LocalDataContext';
import { Bell, TrendingUp, Calendar, ChevronRight, Sparkles, Radio, Users, AlertCircle } from 'lucide-react';
import { fetchLatestDraw, fetchAllResults } from '../services/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeProfile, profiles, setActiveProfile, generatePredictions } = useLocalData();
  const [alerts, setAlerts] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeProfile]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch latest draw and all results
      const [latest, allResults] = await Promise.all([
        fetchLatestDraw(),
        fetchAllResults()
      ]);

      if (latest) {
        setLatestDraw(latest);
      }

      // Generate predictions if we have an active profile
      if (activeProfile && allResults.length > 0) {
        const newPredictions = generatePredictions(latest, allResults);
        setPredictions(newPredictions);
        
        // Get high confidence alerts
        const highProb = newPredictions.filter(p => p.confidence > 70);
        setAlerts(highProb);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
        >
          Try Again
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
            <span className="text-sm text-gray-500">
              {new Date(latestDraw.draw_date).toLocaleDateString('en-MY', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <ResultCard place="1st" number={latestDraw.first_prize} color="yellow" />
            <ResultCard place="2nd" number={latestDraw.second_prize} color="gray" />
            <ResultCard place="3rd" number={latestDraw.third_prize} color="orange" />
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
          label="Personal Numbers"
          value={Object.values(activeProfile).reduce((acc, val) => 
            acc + (Array.isArray(val) ? val.length : 0), 0)}
          subtext="Numbers to analyze"
        />
        <StatCard 
          icon={<Calendar size={20} className="text-blue-600" />}
          label="Next Draw"
          value="2 days"
          subtext={new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}
        />
      </div>

      {/* Predictions Preview */}
      {predictions.length > 0 && (
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
            {predictions.slice(0, 3).map((pred, index) => (
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
      )}
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
