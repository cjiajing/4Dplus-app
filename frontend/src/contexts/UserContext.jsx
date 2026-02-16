import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
          setPredictions([]);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await fetchUserData(user.id);
    }
    setLoading(false);
  };

  const fetchUserData = async (userId) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError && profile) {
        setUser(prev => ({ ...prev, ...profile }));
      }

      // Fetch predictions
      const { data: predictions, error: predictionsError } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', userId)
        .order('confidence_score', { ascending: false });

      if (!predictionsError && predictions) {
        setPredictions(predictions);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const register = async (userData) => {
    try {
      // Create auth user with random password (will be improved later)
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: Math.random().toString(36).slice(-12),
      });

      if (authError) throw authError;

      if (user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: userData.email,
              birth_date: userData.birthDate,
              phone_number: userData.phoneNumber,
              address: userData.address,
              favorite_number: userData.favoriteNumber
            }
          ]);

        if (profileError) throw profileError;

        setUser(user);
        return user;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setUser(user);
      await fetchUserData(user.id);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setPredictions([]);
  };

  const value = {
    user,
    predictions,
    loading,
    register,
    login,
    logout,
    refreshUserData: () => user && fetchUserData(user.id)
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
