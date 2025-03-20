"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for your profile data
export interface ProfileData {
  analysis: string;
  // Add other fields if needed
}

interface ProfileContextType {
  profileData: ProfileData | null;
  setProfileData: (data: ProfileData) => void;
  clearProfileData: () => void;
}

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  profileData: null,
  setProfileData: () => {},
  clearProfileData: () => {},
});

// Custom hook for using the profile context
export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profileData, setProfileDataState] = useState<ProfileData | null>(null);

  // Get initial data from localStorage if available (for page refreshes)
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('profileAnalysis');
      if (savedData) {
        setProfileDataState({ analysis: savedData });
      }
    } catch (error) {
      console.error('Error loading profile data from localStorage:', error);
    }
  }, []);

  const setProfileData = (data: ProfileData) => {
    // Update state
    setProfileDataState(data);
    
    // Also save to localStorage as a fallback for page refreshes
    try {
      localStorage.setItem('profileAnalysis', data.analysis);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const clearProfileData = () => {
    setProfileDataState(null);
    localStorage.removeItem('profileAnalysis');
  };

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData, clearProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};