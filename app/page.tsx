import { CtaSection } from "@/components/cta-section"
import { FeatureSection } from "@/components/feature-section"
import { ClientsSection } from "@/components/clients-section"
import { FeedbackSection } from "@/components/feedback-section"
import { ProjectSection } from "@/components/project-section"
import { Footer } from "@/components/footer"
import HeroSection from "@/components/HeroSection"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <FeatureSection
        title="identify strengths and areas for improvement."
        description="Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where."
        imageSrc="/Frame.png"
        imageAlt="Team collaboration"
        isImageRight={true}
      />
        <FeedbackSection />
      <FeatureSection
        title="Tailored recommendations to bridge skill gaps and enhance your qualifications."
        description="Campsite has been instrumental in keeping designers aware of each others' work-in-progress in a way that was previously slowing us down. It's also one of the only channels where."
        imageSrc="/python.png"
        imageAlt="Python logo"
        isImageRight={false}
        bgColor="bg-gray-0"
      />
      <ClientsSection />
      <ProjectSection />
      <CtaSection />
      <Footer />
    </main>
  )
}

