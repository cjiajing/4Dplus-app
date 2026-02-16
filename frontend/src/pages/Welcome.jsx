
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Phone, Home as HomeIcon, Heart, Sparkles, Radio } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <div className="text-center mt-8">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4">
          <Sparkles size={48} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          4Dplus
        </h1>
        <p className="text-gray-600 text-lg mb-2">Smart AI Predictions</p>
        <p className="text-gray-500 text-sm">Based on your personal lucky numbers</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 my-8">
        <FeatureCard 
          icon={<Calendar className="text-blue-600" size={24} />}
          title="Birth Date"
          description="Your special dates matter"
        />
        <FeatureCard 
          icon={<Phone className="text-blue-600" size={24} />}
          title="Phone Number"
          description="Lucky digits from your number"
        />
        <FeatureCard 
          icon={<HomeIcon className="text-blue-600" size={24} />}
          title="Address"
          description="Location-based patterns"
        />
        <FeatureCard 
          icon={<Heart className="text-blue-600" size={24} />}
          title="Favorite Number"
          description="Your personal lucky number"
        />
      </div>

      {/* How It Works */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-blue-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-blue-800">How It Works</h2>
        <div className="space-y-4">
          <Step number="1" text="Register with your personal details" />
          <Step number="2" text="We analyze latest draw & historical data" />
          <Step number="3" text="Get AI-powered predictions" />
          <Step number="4" text="Receive alerts for high-probability numbers" />
        </div>
      </div>

      {/* Live Draw Preview */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={20} />
          <span className="font-semibold">Live Draw Tracking</span>
        </div>
        <p className="text-sm text-blue-100 mb-3">Real-time results with historical data analysis</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="text-xs opacity-75">1st</div>
            <div className="font-mono font-bold">2807</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="text-xs opacity-75">2nd</div>
            <div className="font-mono font-bold">1985</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="text-xs opacity-75">3rd</div>
            <div className="font-mono font-bold">1234</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto">
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg
            hover:from-blue-700 hover:to-blue-800 transition-all transform active:scale-95 shadow-lg"
        >
          Get Started Free
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold text-lg
            hover:bg-gray-50 transition-all border-2 border-blue-100 active:scale-95"
        >
          I Already Have an Account
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100 text-center hover:shadow-md transition-all">
    <div className="flex justify-center mb-2">{icon}</div>
    <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

const Step = ({ number, text }) => (
  <div className="flex items-center">
    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
      <span className="text-blue-600 font-semibold text-sm">{number}</span>
    </div>
    <span className="text-gray-700 text-sm">{text}</span>
  </div>
);

export default Welcome;
