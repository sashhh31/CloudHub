"use client";
import { RecommendedSkillsSection } from '@/components/recomended-skills'
import { ExperienceSkillsSection } from '@/components/experience-skills-section'
import { ProfileAnalysisSection } from '@/components/Profile-analysis-section'
import React, { useEffect, useState } from 'react'
import { ProfileOverviewSection } from '@/components/Profile-overview-section'
import { Footer } from '@/components/footer'
import { CtaSection } from '@/components/cta-section'
import { LoadingScreen } from '@/components/LoadingScreen';

export default function ResultPage() {
  const [data, setData] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Retrieve data from localStorage
      const storedData = localStorage.getItem('profileAnalysis');
      
      if (!storedData) {
        throw new Error('No data found in localStorage');
      }

      // Validate the data is a valid JSON string
      JSON.parse(storedData); // This will throw if invalid JSON
      
      setData(storedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded">
        <h2 className="font-bold mb-2">Error Processing Data</h2>
        <p>There was an error processing the data. Please check the data format.</p>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return <LoadingScreen message="Analyzing your profile..." />;
  }

  return (
    <div>
      <div >
        <ProfileOverviewSection />
        <ProfileAnalysisSection />
        <ExperienceSkillsSection />
        <RecommendedSkillsSection/>
      </div>
      <CtaSection />
      <Footer />
    </div>
  );
}