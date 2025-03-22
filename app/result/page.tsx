"use client";
import { ExperienceSkillsSection } from '@/components/experience-skills-section'
import { ProfileAnalysisSection } from '@/components/Profile-analysis-section'
import React from 'react'
import { ProfileOverviewSection } from '@/components/Profile-overview-section'
import { Footer } from '@/components/footer'
import { CtaSection } from '@/components/cta-section'
import { LoadingScreen } from '@/components/LoadingScreen';
import { useProfile } from '@/context/ProfileContext';

export default function ResultPage() {
  const { profileData } = useProfile();
  const data = profileData?.analysis;



  if (!data) {
    return <LoadingScreen message="Analyzing your profile..." />;
  }

  return (
    <div>
      <div >
        <ProfileOverviewSection />
        <ProfileAnalysisSection />
        <ExperienceSkillsSection />
      </div>
      <CtaSection />
      <Footer />
    </div>
  );
}