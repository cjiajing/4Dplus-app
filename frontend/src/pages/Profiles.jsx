import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalData } from '../contexts/LocalDataContext';
import { Plus, User, Phone, Calendar, Heart, Edit2, Trash2, ChevronRight } from 'lucide-react';

const Profiles = () => {
  const navigate = useNavigate();
  const { profiles, activeProfile, setActiveProfile, deleteProfile } = useLocalData();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Profiles</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white p-3 rounded-xl flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>

      {showAddForm && (
        <AddProfileForm onClose={() => setShowAddForm(false)} />
      )}

      <div className="space-y-3">
        {profiles.map(profile => (
          <ProfileCard 
            key={profile.id}
            profile={profile}
            isActive={activeProfile?.id === profile.id}
            onSelect={() => setActiveProfile(profile)}
            onDelete={() => deleteProfile(profile.id)}
            onEdit={() => navigate(`/profile/edit/${profile.id}`)}
          />
        ))}
      </div>

      {profiles.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-white rounded-xl border border-blue-100">
          <User size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">No profiles yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 font-semibold"
          >
            Create your first profile →
          </button>
        </div>
      )}
    </div>
  );
};

const AddProfileForm = ({ onClose }) => {
  const { addProfile } = useLocalData();
  const [formData, setFormData] = useState({
    name: '',
    birthDates: [''],
    phoneNumbers: [''],
    favoriteNumbers: ['']
  });

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
    
    // Filter out empty values
    const profileData = {
      name: formData.name || `Profile ${profiles.length + 1}`,
      birthDates: formData.birthDates.filter(bd => bd.trim()),
      phoneNumbers: formData.phoneNumbers.filter(pn => pn.trim()),
      favoriteNumbers: formData.favoriteNumbers.filter(fn => fn.trim())
    };
    
    addProfile(profileData);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-blue-100">
      <h2 className="text-lg font-semibold mb-4">Add New Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Name (Optional)
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
        <div>
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
                  ✕
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
        <div>
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
                  ✕
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
          <p className="text-xs text-gray-500 mt-1">We'll use first 4 and last 4 digits</p>
        </div>

        {/* Favorite Numbers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favorite Numbers (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">Car plates, special dates, lucky numbers</p>
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
                  ✕
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

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfileCard = ({ profile, isActive, onSelect, onDelete, onEdit }) => {
  // Count total numbers
  const totalNumbers = (profile.birthDates?.length || 0) + 
                      (profile.phoneNumbers?.length || 0) + 
                      (profile.favoriteNumbers?.length || 0);

  return (
    <div 
      className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-blue-100'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <User size={20} className="text-blue-600" />
          <h3 className="font-semibold">{profile.name}</h3>
          {isActive && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Active</span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1 text-gray-500 hover:text-blue-600">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {profile.birthDates?.length > 0 && (
          <div className="flex items-start gap-2 text-gray-600">
            <Calendar size={14} className="mt-1" />
            <div className="flex-1">
              {profile.birthDates.map((bd, i) => (
                <div key={i}>{bd}</div>
              ))}
            </div>
          </div>
        )}
        
        {profile.phoneNumbers?.length > 0 && (
          <div className="flex items-start gap-2 text-gray-600">
            <Phone size={14} className="mt-1" />
            <div className="flex-1">
              {profile.phoneNumbers.map((pn, i) => (
                <div key={i}>{pn}</div>
              ))}
            </div>
          </div>
        )}
        
        {profile.favoriteNumbers?.length > 0 && (
          <div className="flex items-start gap-2 text-gray-600">
            <Heart size={14} className="mt-1" />
            <div className="flex-1">
              {profile.favoriteNumbers.map((fn, i) => (
                <div key={i}>{fn}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">{totalNumbers} personal numbers</span>
        <button
          onClick={onSelect}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${isActive 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {isActive ? 'Active' : 'Use This Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profiles;
