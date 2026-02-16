import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalData } from '../contexts/LocalDataContext';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

const ProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, updateProfile } = useLocalData();
  const profile = profiles.find(p => p.id === id);

  const [formData, setFormData] = useState({
    name: '',
    birthDates: [''],
    phoneNumbers: [''],
    favoriteNumbers: ['']
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        birthDates: profile.birthDates?.length ? profile.birthDates : [''],
        phoneNumbers: profile.phoneNumbers?.length ? profile.phoneNumbers : [''],
        favoriteNumbers: profile.favoriteNumbers?.length ? profile.favoriteNumbers : ['']
      });
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
        <button
          onClick={() => navigate('/profiles')}
          className="mt-4 text-blue-600"
        >
          Back to Profiles
        </button>
      </div>
    );
  }

  const handleAddField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedData = {
      name: formData.name || 'My Profile',
      birthDates: formData.birthDates.filter(bd => bd.trim()),
      phoneNumbers: formData.phoneNumbers.filter(pn => pn.trim()),
      favoriteNumbers: formData.favoriteNumbers.filter(fn => fn.trim())
    };
    
    updateProfile(id, updatedData);
    navigate('/profiles');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/profiles')} className="p-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., My Numbers, Family"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Birth Dates */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Dates (DD-MM-YYYY)
          </label>
          {formData.birthDates.map((bd, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={bd}
                onChange={(e) => handleFieldChange('birthDates', index, e.target.value)}
                placeholder="28-07-1985"
                pattern="\d{2}-\d{2}-\d{4}"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formData.birthDates.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField('birthDates', index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('birthDates')}
            className="text-sm text-blue-600 flex items-center gap-1 mt-2"
          >
            <Plus size={16} /> Add another birth date
          </button>
        </div>

        {/* Phone Numbers */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Singapore Phone Numbers (8 digits)
          </label>
          {formData.phoneNumbers.map((pn, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="tel"
                value={pn}
                onChange={(e) => handleFieldChange('phoneNumbers', index, e.target.value)}
                placeholder="91234567"
                pattern="[0-9]{8}"
                maxLength="8"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formData.phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField('phoneNumbers', index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('phoneNumbers')}
            className="text-sm text-blue-600 flex items-center gap-1 mt-2"
          >
            <Plus size={16} /> Add another phone number
          </button>
          <p className="text-xs text-gray-500 mt-2">We'll use first 4 and last 4 digits</p>
        </div>

        {/* Favorite Numbers */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favorite Numbers
          </label>
          <p className="text-xs text-gray-500 mb-3">Car plates, special dates, lucky numbers</p>
          {formData.favoriteNumbers.map((fn, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={fn}
                onChange={(e) => handleFieldChange('favoriteNumbers', index, e.target.value)}
                placeholder="1234, SGP888, etc"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formData.favoriteNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField('favoriteNumbers', index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('favoriteNumbers')}
            className="text-sm text-blue-600 flex items-center gap-1 mt-2"
          >
            <Plus size={16} /> Add another favorite number
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold
            flex items-center justify-center gap-2 shadow-lg"
        >
          <Save size={20} />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
