import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Clock, 
  Trophy, 
  Award, 
  ChevronRight,
  RefreshCw,
  History,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { fetchLatestDraw, fetchPastResults } from '../services/supabase';

const LiveDraw = () => {
  const [currentDraw, setCurrentDraw] = useState(null);
  const [previousDraws, setPreviousDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 5,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    loadDrawData();
    
    // Update countdown every second
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateCountdown = () => {
    setCountdown(prev => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      } else if (prev.hours > 0) {
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
      } else if (prev.days > 0) {
        return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
      }
      return prev;
    });
  };

  const loadDrawData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from Supabase
      const [latest, past] = await Promise.all([
        fetchLatestDraw(),
        fetchPastResults()
      ]);

      if (latest) {
        setCurrentDraw(latest);
      } else {
        setError('No draw data available');
      }

      if (past && past.length > 0) {
        setPreviousDraws(past);
      }
    } catch (err) {
      console.error('Error loading draw data:', err);
      setError('Failed to load draw data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDrawData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDrawNumber = (num) => {
    return num ? num.toString().padStart(4, '0') : '0000';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading live draws...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Radio size={24} className="text-blue-600" />
          Live Draw
        </h1>
        <button
          onClick={handleRefresh}
          className="p-2 bg-white rounded-lg shadow-sm border border-blue-100"
          disabled={refreshing}
        >
          <RefreshCw 
            size={20} 
            className={`text-blue-600 ${refreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {/* Next Draw Countdown */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-100">Next Draw In</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
            Draw #{currentDraw ? formatDrawNumber(currentDraw.draw_number + 1) : '----'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <CountdownBox value={countdown.days} label="Days" />
          <CountdownBox value={countdown.hours} label="Hours" />
          <CountdownBox value={countdown.minutes} label="Mins" />
          <CountdownBox value={countdown.seconds} label="Secs" />
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-blue-100">
          <Clock size={14} />
          <span>Every Wed, Sat, Sun at 6:30 PM</span>
        </div>
      </div>

      {/* Current Draw Results */}
      {currentDraw && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Latest Results</h2>
              <p className="text-sm text-gray-500">
                Draw #{formatDrawNumber(currentDraw.draw_number)} • {formatDate(currentDraw.draw_date)}
              </p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

          {/* Top 3 Prizes */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <PrizeCard 
              place="1st"
              number={currentDraw.first_prize}
              prize="First Prize"
              color="yellow"
            />
            <PrizeCard 
              place="2nd"
              number={currentDraw.second_prize}
              prize="Second Prize"
              color="gray"
            />
            <PrizeCard 
              place="3rd"
              number={currentDraw.third_prize}
              prize="Third Prize"
              color="orange"
            />
          </div>

          {/* Starter Prizes */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Award size={16} className="text-blue-600" />
              Starter Prizes (10 numbers)
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {currentDraw.starter_prizes?.map((number, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-2 text-center font-mono font-bold text-sm"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>

          {/* Consolation Prizes */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Trophy size={16} className="text-blue-600" />
              Consolation Prizes (10 numbers)
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {currentDraw.consolation_prizes?.map((number, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-2 text-center font-mono font-bold text-sm"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Draw History Toggle */}
      {previousDraws.length > 1 && (
        <>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <History size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Draw History</h3>
                <p className="text-xs text-gray-500">View previous {previousDraws.length - 1} draws</p>
              </div>
            </div>
            <ChevronRight 
              size={20} 
              className={`text-gray-400 transition-transform ${showHistory ? 'rotate-90' : ''}`} 
            />
          </button>

          {/* Previous Draws */}
          {showHistory && (
            <div className="space-y-3">
              {previousDraws.slice(1).map((draw, index) => (
                <DrawHistoryCard 
                  key={index}
                  draw={draw}
                  isSelected={selectedDraw === draw.draw_number}
                  onSelect={() => setSelectedDraw(
                    selectedDraw === draw.draw_number ? null : draw.draw_number
                  )}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-600" />
          Draw Statistics
        </h2>
        <div className="space-y-4">
          <StatBar 
            label="First Prize Frequency"
            value="23%"
            subtext="Numbers ending with 7 appear most"
          />
          <StatBar 
            label="Repeated Numbers"
            value="15%"
            subtext="Numbers appearing twice in 30 draws"
          />
          <StatBar 
            label="Date Pattern Hits"
            value="8"
            subtext="Numbers matching current date"
          />
        </div>
      </div>
    </div>
  );
};

const CountdownBox = ({ value, label }) => (
  <div className="bg-blue-500 rounded-xl p-2">
    <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
    <div className="text-xs text-blue-100">{label}</div>
  </div>
);

const PrizeCard = ({ place, number, prize, color }) => {
  const colors = {
    yellow: 'from-yellow-400 to-yellow-500',
    gray: 'from-gray-400 to-gray-500',
    orange: 'from-orange-400 to-orange-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-3 text-white`}>
      <span className="text-xs opacity-90">{place}</span>
      <div className="text-xl font-mono font-bold mt-1">{number}</div>
      <span className="text-xs opacity-75 mt-1 block">{prize}</span>
    </div>
  );
};

const DrawHistoryCard = ({ draw, isSelected, onSelect }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <button
        onClick={onSelect}
        className="w-full p-4 flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Draw #{draw.draw_number}</span>
            <span className="text-xs text-gray-500">{formatDate(draw.draw_date)}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-sm font-mono font-bold text-yellow-600">{draw.first_prize}</span>
            <span className="text-sm font-mono text-gray-600">{draw.second_prize}</span>
            <span className="text-sm font-mono text-gray-600">{draw.third_prize}</span>
          </div>
        </div>
        <ChevronRight 
          size={20} 
          className={`text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} 
        />
      </button>
      
      {isSelected && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Starter Prizes</h4>
            <div className="grid grid-cols-5 gap-1">
              {draw.starter_prizes?.slice(0, 5).map((num, idx) => (
                <span key={idx} className="text-xs font-mono bg-white p-1 rounded text-center">
                  {num}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Consolation Prizes</h4>
            <div className="grid grid-cols-5 gap-1">
              {draw.consolation_prizes?.slice(0, 5).map((num, idx) => (
                <span key={idx} className="text-xs font-mono bg-white p-1 rounded text-center">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBar = ({ label, value, subtext }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full" 
        style={{ width: value }}
      ></div>
    </div>
    <p className="text-xs text-gray-500 mt-1">{subtext}</p>
  </div>
);

export default LiveDraw;
