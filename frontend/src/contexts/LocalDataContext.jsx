import React, { createContext, useState, useContext, useEffect } from 'react';

const LocalDataContext = createContext();

export const useLocalData = () => {
  const context = useContext(LocalDataContext);
  if (!context) {
    throw new Error('useLocalData must be used within LocalDataProvider');
  }
  return context;
};

export const LocalDataProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on startup
  useEffect(() => {
    const savedData = localStorage.getItem('4dplus_data');
    if (savedData) {
      try {
        const { profiles, activeProfileId } = JSON.parse(savedData);
        setProfiles(profiles || []);
        if (activeProfileId) {
          const active = profiles.find(p => p.id === activeProfileId);
          setActiveProfile(active || null);
        }
      } catch (error) {
        console.error('Error loading local data:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      const dataToSave = {
        profiles,
        activeProfileId: activeProfile?.id
      };
      localStorage.setItem('4dplus_data', JSON.stringify(dataToSave));
    }
  }, [profiles, activeProfile, loading]);

  // Add a new profile
  const addProfile = (profileData) => {
    const newProfile = {
      id: Date.now().toString(), // Simple unique ID
      birthDates: profileData.birthDates || [],
      phoneNumbers: profileData.phoneNumbers || [],
      favoriteNumbers: profileData.favoriteNumbers || [],
      name: profileData.name || `Profile ${profiles.length + 1}`
    };
    
    setProfiles(prev => {
      const updated = [...prev, newProfile];
      return updated;
    });
    
    // Auto-select this profile if it's the first one
    if (profiles.length === 0) {
      setActiveProfile(newProfile);
    }
    
    return newProfile;
  };

  // Update existing profile
  const updateProfile = (profileId, updatedData) => {
    setProfiles(prev => prev.map(p => 
      p.id === profileId ? { ...p, ...updatedData } : p
    ));
    
    if (activeProfile?.id === profileId) {
      setActiveProfile(prev => ({ ...prev, ...updatedData }));
    }
  };

  // Delete profile
  const deleteProfile = (profileId) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    if (activeProfile?.id === profileId) {
      setActiveProfile(profiles.find(p => p.id !== profileId) || null);
    }
  };

  // Generate predictions based on active profile
  const generatePredictions = (latestDraw, pastResults) => {
    if (!activeProfile) return [];
    
    // Combine all numbers from the profile
    const allUserNumbers = [];
    
    // Add birth date combinations (DDMM, MMDD, DDYY, YYDD)
    activeProfile.birthDates?.forEach(birthDate => {
      const [day, month, year] = birthDate.split('-');
      const yy = year.slice(-2);
      
      allUserNumbers.push(day + month); // DDMM
      allUserNumbers.push(month + day); // MMDD
      allUserNumbers.push(day + yy);    // DDYY
      allUserNumbers.push(yy + day);    // YYDD
    });
    
    // Add phone number combinations (first 4, last 4)
    activeProfile.phoneNumbers?.forEach(phone => {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length >= 8) {
        allUserNumbers.push(cleanPhone.slice(0, 4));  // First 4 digits
        allUserNumbers.push(cleanPhone.slice(-4));    // Last 4 digits
      }
    });
    
    // Add favorite numbers (extract 4-digit patterns)
    activeProfile.favoriteNumbers?.forEach(fav => {
      const digits = fav.replace(/\D/g, '');
      // Extract all 4-digit sequences
      for (let i = 0; i <= digits.length - 4; i++) {
        allUserNumbers.push(digits.slice(i, i + 4));
      }
    });
    
    // Remove duplicates and calculate probabilities
    const uniqueNumbers = [...new Set(allUserNumbers)];
    
    const predictions = uniqueNumbers.map(number => ({
      number,
      confidence: calculateConfidence(number, latestDraw, pastResults),
      lastAppearance: findLastAppearance(number, pastResults),
      prizeCategory: getPrizeCategory(number, pastResults)
    }));
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
  };

  const calculateConfidence = (number, latestDraw, pastResults) => {
    let score = 50; // Base score
    
    // Check if appeared recently
    if (latestDraw && Object.values(latestDraw).flat().includes(number)) {
      score += 20;
    }
    
    // Check historical frequency
    const frequency = pastResults?.filter(result => 
      Object.values(result).flat().includes(number)
    ).length || 0;
    
    score += frequency * 2;
    
    return Math.min(99, score);
  };

  const findLastAppearance = (number, pastResults) => {
    if (!pastResults) return null;
    
    for (const result of pastResults) {
      const allNumbers = [
        result.first_prize,
        result.second_prize,
        result.third_prize,
        ...(result.starter_prizes || []),
        ...(result.consolation_prizes || [])
      ];
      if (allNumbers.includes(number)) {
        return result.draw_date;
      }
    }
    return null;
  };

  const getPrizeCategory = (number, pastResults) => {
    if (!pastResults) return null;
    
    for (const result of pastResults) {
      if (result.first_prize === number) return 'First Prize';
      if (result.second_prize === number) return 'Second Prize';
      if (result.third_prize === number) return 'Third Prize';
      if (result.starter_prizes?.includes(number)) return 'Starter';
      if (result.consolation_prizes?.includes(number)) return 'Consolation';
    }
    return null;
  };

  const value = {
    profiles,
    activeProfile,
    loading,
    addProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    generatePredictions,
    predictions: activeProfile ? generatePredictions() : []
  };

  return (
    <LocalDataContext.Provider value={value}>
      {children}
    </LocalDataContext.Provider>
  );
};
