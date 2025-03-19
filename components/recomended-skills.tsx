import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link";


export function RecommendedSkillsSection() {
  try {
    const message: string = localStorage.getItem('profileAnalysis') || '';
    // Parse the message string into an object
    const parsedData: any = JSON.parse(message);
    
    // Extract the recommended skills array
    const recommendedSkills = Array.isArray(parsedData.RecommendedCoursesFromCoursera) ? parsedData.RecommendedCoursesFromCoursera : [];

    return (
      <section className="w-full py-12 md:py-24 bg-gray-100 px-4 md:px-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold">Recommended Skills</h2>
          <div className="space-y-4 justify-center items-center">
            {recommendedSkills.map((skill: any, index: number) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded bg-gray-100 flex justify-center items-center">
                    <Image src='./coursera.png' alt='C' width={100} height={100} />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4 ml-3">
                    <div>
                      <h3 className="text-xl font-semibold">{skill.Title} - Course</h3>
                      <p className="mt-8 text-gray-600">
                       {skill.Description} 
                      </p>
                    </div>
                  </div>
                  <Link href={skill.Link}>
                    <div className="flex justify-end mt-10">
                      <Button className="bg-blue-500 hover:bg-blue-700 w-56 h-12 text-lg">Go to course page</Button>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (err) {
    return (
      <section className="w-full py-12 md:py-24 bg-gray-100 px-4 md:px-6">
        <div className="container px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold">Recommended Skills</h2>
          <p className="text-red-600">Error loading recommended skills: {err instanceof Error ? err.message : 'Unknown error'}</p>
        </div>
      </section>
    );
  }
}

