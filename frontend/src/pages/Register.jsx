import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ChevronLeft, ChevronRight, Calendar, Phone, MapPin, Heart, Check, Sparkles } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    birthDate: '',
    phoneNumber: '',
    address: '',
    favoriteNumber: '',
    agreeToTerms: false
  });

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.email && formData.birthDate;
      case 2:
        return formData.phoneNumber && formData.phoneNumber.length >= 10;
      case 3:
        return formData.address && formData.address.length > 5;
      case 4:
        return formData.favoriteNumber && formData.favoriteNumber.length === 4 && formData.agreeToTerms;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Header with Logo */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          4Dplus
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((step / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        {step === 1 && <Step1 formData={formData} handleChange={handleChange} />}
        {step === 2 && <Step2 formData={formData} handleChange={handleChange} />}
        {step === 3 && <Step3 formData={formData} handleChange={handleChange} />}
        {step === 4 && <Step4 formData={formData} handleChange={handleChange} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={handleBack}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold
            flex items-center justify-center gap-2 active:bg-gray-200 transition-all"
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
            ${isStepValid() 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white active:scale-95 shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {step === totalSteps ? 'Complete' : 'Next'}
          {step === totalSteps ? <Check size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

// Step 1: Basic Info
const Step1 = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
        <Calendar size={32} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
      <p className="text-gray-500 text-sm">Let's start with your email and birth date</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white/70"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Birth Date
      </label>
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white/70"
        required
      />
      <p className="text-xs text-gray-500 mt-2">
        Your birth date helps us find number patterns (DDMM, MMDD, YYDD)
      </p>
    </div>
  </div>
);

// Step 2: Phone Number
const Step2 = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
        <Phone size={32} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Phone Number</h2>
      <p className="text-gray-500 text-sm">Your number contains lucky digits</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="0123456789"
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white/70"
        required
      />
      <p className="text-xs text-gray-500 mt-2">
        The last 4 digits will be used for predictions
      </p>
    </div>
  </div>
);

// Step 3: Address
const Step3 = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
        <MapPin size={32} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Your Address</h2>
      <p className="text-gray-500 text-sm">Location-based number patterns</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Address
      </label>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Your full address (including postal code)"
        rows="4"
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white/70 resize-none"
        required
      />
      <p className="text-xs text-gray-500 mt-2">
        House numbers and postal codes create patterns
      </p>
    </div>
  </div>
);

// Step 4: Favorite Number & Terms
const Step4 = ({ formData, handleChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
        <Heart size={32} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Almost Done!</h2>
      <p className="text-gray-500 text-sm">Just a few more details</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Favorite 4D Number
      </label>
      <input
        type="text"
        name="favoriteNumber"
        value={formData.favoriteNumber}
        onChange={handleChange}
        placeholder="1234"
        maxLength="4"
        pattern="\d{4}"
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 outline-none text-lg text-center
          tracking-widest font-mono bg-white/70"
        required
      />
    </div>

    <div className="bg-blue-50 p-4 rounded-xl">
      <h3 className="font-semibold text-blue-800 mb-2">Your Personal Numbers:</h3>
      <ul className="space-y-2 text-sm text-blue-700">
        <li>• Birth date: {formData.birthDate || 'DD/MM/YYYY'}</li>
        <li>• Phone (last 4): {formData.phoneNumber?.slice(-4) || 'XXXX'}</li>
        <li>• Favorite: {formData.favoriteNumber || 'XXXX'}</li>
      </ul>
    </div>

    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name="agreeToTerms"
        checked={formData.agreeToTerms}
        onChange={handleChange}
        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        required
      />
      <span className="text-sm text-gray-600">
        I agree to the Terms of Service. I understand that this is for 
        <span className="font-semibold"> entertainment purposes only</span>.
      </span>
    </label>
  </div>
);

export default Register;
