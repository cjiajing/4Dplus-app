import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Bell, TrendingUp, Calendar, ChevronRight, Sparkles, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, predictions } = useUser();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (predictions) {
      const highProb = predictions.filter(p => p.confidence_score > 70);
      setAlerts(highProb);
    }
  }, [predictions]);

  const latestDraw = {
    date: new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }),
    first: '2807',
    second: '1985',
    third: '1234'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-blue-100">Welcome back,</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{user?.email?.split('@')[0]}</h1>
          <p className="text-blue-100 text-sm">Ready for today's predictions?</p>
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
                    {alert.confidence_score}% confidence
                  </span>
                </div>
                <p className="text-sm text-red-700">{alert.reason || 'High probability based on your personal numbers'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Draw Results */}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<TrendingUp size={20} className="text-green-600" />}
          label="Win Rate"
          value="23%"
          subtext="Last 30 days"
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
                {pred.last_appearance && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last: {new Date(pred.last_appearance).toLocaleDateString()} 
                    {pred.prize_category && ` • ${pred.prize_category}`}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold px-2 py-1 rounded-full
                  ${pred.confidence_score > 70 ? 'bg-green-100 text-green-700' : 
                    pred.confidence_score > 50 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-700'}`}>
                  {pred.confidence_score}%
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
