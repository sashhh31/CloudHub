"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for your profile data
export interface ProfileData {
  analysis: string;
}

// Modified type to include "processing" as a possible value
interface ProfileContextType {
  profileData: ProfileData | null;
  setProfileData: (data: ProfileData ) => void; // Accept "processing" string too
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
  // Changed state type to match context type
  const [profileData, setProfileDataState] = useState<ProfileData | null>(null);

  // Updated to accept the processing string
  const setProfileData = (data: ProfileData ) => {
    setProfileDataState(data);
  };

  const clearProfileData = () => {
    setProfileDataState(null);
  };

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData, clearProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};