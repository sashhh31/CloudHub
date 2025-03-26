"use client"
import { CtaSection } from "@/components/cta-section"
import { FeatureSection } from "@/components/feature-section"
import { FeedbackSection } from "@/components/feedback-section"
import { ProjectSection } from "@/components/project-section"
import HeroSection from "@/components/HeroSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import { useProfile } from "@/context/ProfileContext"

export default function Home() {
  const { profileData } = useProfile();

  // Check if profileData is exactly the string "processing"
  if (profileData?.analysis === "processing") {
    return <LoadingScreen message="Analyzing your profile..." />;
  }



  return (
    <main className="flex min-h-screen flex-col w-full">
      <HeroSection />
      
      <section id="features" className="w-full">
        <FeatureSection
          title="Identify strengths and areas for improvement."
          description="Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where."
          imageSrc="/Frame.png"
          imageAlt="Team collaboration"
          isImageRight={true}
          features={["AI-powered analysis", "Personalized feedback"]}
        />
      </section>
      
      <section id="feedback" className="w-full">
        <FeedbackSection />
      </section>
      
      <section id="recommendations" className="w-full">
        <FeatureSection
          title="Tailored recommendations to bridge skill gaps and enhance your qualifications."
          description="Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where."
          imageSrc="/python.png"
          imageAlt="Python logo"
          isImageRight={false}
          bgColor="bg-gray-50"
          features={["Curated courses", "Industry-specific skills"]}
        />
      </section>
      
      <section id="project" className="w-full">
        <ProjectSection />
      </section>
      
      <section id="newsletter" className="w-full">
        <CtaSection />
      </section>
      
    </main>
  )
}