import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Lock, Smartphone } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[80vh]">
      <div className="text-center mt-8">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4">
          <Sparkles size={48} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          4Dplus
        </h1>
        <p className="text-gray-600 text-lg mb-2">Private & Personal</p>
        <p className="text-gray-500 text-sm px-6">
          Your data stays on your device. No account needed.
        </p>
      </div>

      {/* Privacy Features */}
      <div className="grid grid-cols-2 gap-4 my-8">
        <FeatureCard 
          icon={<Lock className="text-blue-600" size={24} />}
          title="100% Private"
          description="Data stored locally only"
        />
        <FeatureCard 
          icon={<Smartphone className="text-blue-600" size={24} />}
          title="Works Offline"
          description="No internet needed"
        />
        <FeatureCard 
          icon={<Users className="text-blue-600" size={24} />}
          title="Multiple Profiles"
          description="Family & friends"
        />
        <FeatureCard 
          icon={<Sparkles className="text-blue-600" size={24} />}
          title="Smart Analysis"
          description="AI-powered predictions"
        />
      </div>

      {/* How It Works */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-blue-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-blue-800">Simple Setup</h2>
        <div className="space-y-4">
          <Step number="1" text="Add your personal numbers (birth dates, phone, favorites)" />
          <Step number="2" text="We analyze patterns with latest draw" />
          <Step number="3" text="Get personalized predictions" />
          <Step number="4" text="All data stays on your device" />
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 mb-8">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Add multiple birth dates for family members</li>
          <li>• Include car plate numbers as favorites</li>
          <li>• Singapore phone: use all 8 digits</li>
          <li>• Format birth dates: DD-MM-YYYY</li>
        </ul>
      </div>

      <button
        onClick={() => navigate('/profiles')}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg
          hover:from-blue-700 hover:to-blue-800 transition-all transform active:scale-95 shadow-lg"
      >
        Get Started →
      </button>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100 text-center">
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
