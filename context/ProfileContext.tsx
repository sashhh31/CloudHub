"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types for your profile data
export interface ProfileData {
  analysis: string;
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
  // Initialize state from localStorage if available
  const [profileData, setProfileDataState] = useState<ProfileData | null>(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profileData');
      return savedProfile ? JSON.parse(savedProfile) : null;
    }
    return null;
  });

  // Update localStorage whenever profileData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (profileData) {
        localStorage.setItem('profileData', JSON.stringify(profileData));
      } else {
        localStorage.removeItem('profileData');
      }
    }
  }, [profileData]);

  const setProfileData = (data: ProfileData) => {
    setProfileDataState(data);
  };

  const clearProfileData = () => {
    setProfileDataState(null);
    // This will trigger the useEffect to remove from localStorage
  };

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData, clearProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};