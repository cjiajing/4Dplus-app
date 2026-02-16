import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Filter, Calendar, Trophy, Clock, TrendingUp, Sparkles } from 'lucide-react';

const Predictions = () => {
  const { predictions } = useUser();
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sample predictions if none exist
  const samplePredictions = [
    {
      number: '1985',
      confidence_score: 85,
      last_appearance: '2024-01-15',
      prize_category: 'Second Prize',
      reason: 'Matches your birth year + appeared in last draw'
    },
    {
      number: '2807',
      confidence_score: 72,
      last_appearance: '2024-01-15',
      prize_category: 'First Prize',
      reason: 'Contains your birth date pattern'
    },
    {
      number: '1234',
      confidence_score: 65,
      last_appearance: '2023-12-20',
      prize_category: 'Third Prize',
      reason: 'Sequential pattern + favorite number match'
    },
    {
      number: '5678',
      confidence_score: 45,
      last_appearance: '2023-11-05',
      prize_category: 'Starter',
      reason: 'Phone number last 4 digits pattern'
    },
    {
      number: '9012',
      confidence_score: 38,
      last_appearance: '2023-10-28',
      prize_category: 'Consolation',
      reason: 'Address postal code pattern'
    }
  ];

  const displayPredictions = predictions?.length ? predictions : samplePredictions;

  const getFilteredPredictions = () => {
    switch(filter) {
      case 'high':
        return displayPredictions.filter(p => p.confidence_score >= 70);
      case 'medium':
        return displayPredictions.filter(p => p.confidence_score >= 50 && p.confidence_score < 70);
      case 'low':
        return displayPredictions.filter(p => p.confidence_score < 50);
      default:
        return displayPredictions;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles size={24} className="text-blue-600" />
          AI Predictions
        </h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 bg-white rounded-lg shadow-sm border border-blue-100"
        >
          <Filter size={20} className="text-blue-600" />
        </button>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
          <h3 className="font-semibold mb-3">Filter by Confidence</h3>
          <div className="flex flex-wrap gap-2">
            <FilterChip 
              label="All" 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            />
            <FilterChip 
              label="High (70%+)" 
              active={filter === 'high'} 
              onClick={() => setFilter('high')}
            />
            <FilterChip 
              label="Medium (50-69%)" 
              active={filter === 'medium'} 
              onClick={() => setFilter('medium')}
            />
            <FilterChip 
              label="Low (<50%)" 
              active={filter === 'low'} 
              onClick={() => setFilter('low')}
            />
          </div>
        </div>
      )}

      {/* Predictions List */}
      <div className="space-y-3">
        {getFilteredPredictions().map((pred, index) => (
          <PredictionCard key={index} prediction={pred} />
        ))}
      </div>

      {getFilteredPredictions().length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-blue-100">
          <TrendingUp size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No predictions match your filter</p>
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all
      ${active 
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
  >
    {label}
  </button>
);

const PredictionCard = ({ prediction }) => {
  const getConfidenceColor = (score) => {
    if (score >= 70) return 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white';
    if (score >= 50) return 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white';
    return 'border-l-4 border-gray-300 bg-white';
  };

  return (
    <div className={`rounded-xl p-5 shadow-sm border border-blue-100 ${getConfidenceColor(prediction.confidence_score)}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-3xl font-mono font-bold">{prediction.number}</span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              Confidence: {prediction.confidence_score}%
            </span>
          </div>
        </div>
        {prediction.confidence_score >= 70 && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp size={12} />
            Hot Pick
          </span>
        )}
      </div>

      {prediction.last_appearance && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Calendar size={14} />
              Last appeared:
            </span>
            <span className="font-medium">
              {new Date(prediction.last_appearance).toLocaleDateString('en-MY')}
            </span>
          </div>
          {prediction.prize_category && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600 flex items-center gap-1">
                <Trophy size={14} />
                Prize:
              </span>
              <span className="font-medium text-yellow-600">{prediction.prize_category}</span>
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <span className="font-semibold">Why: </span>
        {prediction.reason}
      </p>
    </div>
  );
};

export default Predictions;
