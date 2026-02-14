import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <div className="text-center mt-8 mb-8">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4">
          <Sparkles size={48} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-500 mt-2">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white/70"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 outline-none text-lg bg-white/70"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl 
            font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all 
            transform active:scale-95 shadow-lg"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
