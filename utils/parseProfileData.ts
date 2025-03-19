import { ProfileData, LegacyProfileData } from "../type";

export function parseProfileData(input: string | object | undefined): ProfileData | LegacyProfileData {
  if (input === undefined) {
    throw new Error('No data received');
  }

  let parsedData: ProfileData | LegacyProfileData;

  try {
    if (typeof input === 'string') {
      if (!input.trim()) {
        throw new Error('Empty profile data received');
      }
      parsedData = JSON.parse(input);
    } else if (typeof input === 'object' && input !== null) {
      parsedData = input;
    } else {
      throw new Error('Invalid profile data format');
    }

    if (typeof parsedData !== 'object' || parsedData === null) {
      throw new Error('Invalid profile data structure');
    }

    return parsedData;
  } catch (error) {
    console.error("Error parsing profile data:", error);
    throw error;
  }
} 