"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Mail, Phone, Download, Share2, Newspaper, ExternalLink, Linkedin } from "lucide-react"
import React, { useRef, useState, useEffect } from 'react';
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import html2canvas from 'html2canvas';
import axios from "axios"
import { sendEmail } from "@/lib/resend"

export function ProfileOverviewSection() {
  const [showQuestionnaireDialog, setShowQuestionnaireDialog] = useState(0);
  const [imagelink,setImagelink]=useState('')
  const { profileData } = useProfile();
  const message = profileData?.analysis || '';
  const rightProfileRef = useRef(null);
  let parsedData : any;

  try {
    parsedData = typeof message === 'string' ? JSON.parse(message) : message;
  } catch (error) {
    return (
      <section className="w-full py-6 md:py-12 lg:py-24 bg-white px-4">
        <div className="container mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Failed to parse profile data. Please try again.</span>
          </div>
        </div>
      </section>
    );
  }

  // Extract data from the parsed object
  const BasicProfileInformation = Array.isArray(parsedData.BasicProfileInformation) ? parsedData.BasicProfileInformation :
    parsedData.BasicProfileInformation ? [parsedData.BasicProfileInformation] : [];
  const name = BasicProfileInformation[0].Name || 'Anonymous';
  const currentRole = BasicProfileInformation[0].CurrentRole || 'No current role data available';
  const company = BasicProfileInformation[0].Company || 'No company data available';
  const email = BasicProfileInformation[0].Email || 'No email data available';
  const phone = BasicProfileInformation[0].PhoneNumber || 'No phone number data available';

  const aiScore = parsedData.AIScore || 80;

  const SkillsAssessment = Array.isArray(parsedData.SkillsAssessment) ? parsedData.SkillsAssessment :
    parsedData.SkillsAssessment ? [parsedData.SkillsAssessment] : [];

  const relevance = SkillsAssessment[0].Relevance || 'No relevance data available';

  const strengths = parsedData.Strengths || {};

  // Ensure skillGaps is always an array
  const topSkills = Array.isArray(parsedData.TopSkills) ? parsedData.TopSkills : [];

  const education = parsedData.Education || {};

  const remarks = parsedData.RemarksAboutProfile || 'No remarks available';

  const aiImpact = parsedData.AIAssessment || 'No AI impact assessment available';
  const bestAchievements = parsedData.Achievements.Description ? parsedData.Achievements.Description : ['No best achievements data available'];
  const tools = Array.isArray(parsedData.Tools) ? parsedData.Tools : ['No tools data available'];
  // Extract technical skills as an array

  const superpowers = parsedData.Superpowers ? parsedData.Superpowers : ['No superpowers data available'];

  // Calculate percentages for skill bars
  const softSkillsScore = 75;
  const technicalSkillsScore = 80;
  const relevanceScore = relevance?.includes('highly relevant') ? 90 : 70;
  const timelinePrediction = parsedData.TimelineBeforeSignificantAIImpact || '0';
  const currentAutomated= parsedData.CurrentAutomableTask || '0';
  const PercentageOfWorkAutomable= parsedData.PercentageOfWorkAutomable||'0';
  const Article = parsedData.Article
  const aiImpactPattern = /(\d+)%/;
  const aiImpactText = typeof aiImpact === 'string' ? aiImpact : '';
  const aiImpactMatch = aiImpactText.match(aiImpactPattern);
  const aiImpactPercentage = aiImpactMatch ? parseInt(aiImpactMatch[1]) : 80;
  const experience = Array.isArray(parsedData.Experience) ? parsedData.Experience :
    parsedData.Experience ? [parsedData.Experience] : ['No experience data available'];
  // Extract strength percentages
  const strengthPercentages: Record<string, number> = {};
  Object.entries(strengths).forEach(([key, value]) => {
    const percentMatch = String(value).match(/(\d+)%/);
    if (percentMatch) {
      strengthPercentages[key] = parseInt(percentMatch[1]);
    } else if (String(value).includes('★')) {
      // Convert star ratings to percentages
      const starCount = (String(value).match(/★/g) || ['No star count data available']).length;
      strengthPercentages[key] = starCount * 20; // 5 stars = 100%
    } else {
      strengthPercentages[key] = 70; // Default value
    }
  });


  const download = async () => {
    if (rightProfileRef.current) {
      await document.fonts.ready; // Ensure fonts are loaded
  
      const canvas = await html2canvas(rightProfileRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: null,
        useCORS: true,
        logging: true, // Debugging info
      });
  
      const image = canvas.toDataURL("image/png"); // Convert canvas to Base64
  
      // Send image to backend for storage
     const response= await axios.post("/api/save-image",  JSON.stringify({ image , name:name }) 
      );
      setImagelink(response.data)
    }
  };
  
  // Function to download the right profile as an image
  const downloadProfileImage = async () => {
    if (rightProfileRef.current) {
      try {
        // Apply temporary desktop styles
        rightProfileRef.current.style.width = "500px"; // Set desktop width
        rightProfileRef.current.style.transform = "scale(1)";
        rightProfileRef.current.style.zoom = "1";
        
        await document.fonts.ready; // Ensure fonts are loaded
  
        const canvas = await html2canvas(rightProfileRef.current, {
          scale: 3, // Higher scale for better quality
          backgroundColor: null,
          useCORS: true,
          logging: true, // Debugging info
        });
  
        // Reset styles after capturing
        rightProfileRef.current.style.width = "";
        rightProfileRef.current.style.transform = "";
        rightProfileRef.current.style.zoom = "";
  
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${name.replace(/\s+/g, "_")}_profile.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
        alert("Failed to download image. Please try again.");
      }
    }
  };
  

  // Function to share profile on LinkedIn
  const shareOnLinkedIn = async () => {
    if (rightProfileRef.current) {
      try {
        // First generate the image
        const canvas = await html2canvas(rightProfileRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true
        });

        const image = canvas.toDataURL("image/png");

        // Create a blob from the data URL
        const blobData = await fetch(image).then(res => res.blob());

        // Create a text to share with the image
        const shareText = `Check out my professional AI impact profile for ${name}! See how AI might affect my career and what skills make me stand out. #CareerProfile #AIImpact #CubeHub`;

        const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=https://cubehub.com&title=${encodeURIComponent(shareText)}`;

        // Open LinkedIn in a new tab
        window.open(linkedInShareUrl, '_blank');
      } catch (error) {
        console.error("Error sharing to LinkedIn:", error);
        alert("Failed to share on LinkedIn. Please try again.");
      }
    }
  };

  const AIQuestionnaireDialog = () => {
    const [open, setOpen] = useState(showQuestionnaireDialog > 0);
    const [email, setEmail] = useState("");
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [response, setResponse] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState("");

    // Effect to watch for dialog closing and trigger download
    useEffect(() => {
      if (!open && showQuestionnaireDialog > 0) {
        // Dialog was open and now it's closed, trigger the download
        setShowQuestionnaireDialog(0); // Reset the state
      }
    }, [open]);

    // Effect to update open state when showQuestionnaireDialog changes
    useEffect(() => {
      setOpen(showQuestionnaireDialog > 0);
    }, [showQuestionnaireDialog]);

    const validateEmail = (email:string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const handleEmailSubmit = (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email) {
        setEmailError("Email is required");
        return;
      }

      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address");
        return;
      }

      setEmailError("");
      setEmailSubmitted(true);
    };

    const handleResponse = async (answer:any) => {
      setResponse(answer);
      setSubmitted(true);

      
      await axios.post("/api/ai-questionnaire", {
        email,
        answers: answer,
      });
      setTimeout(() => {
        downloadProfileImage();
        setOpen(false);
      }, 1000);
    };

    useEffect(() => {
      sendEmail(email, name,imagelink); 
    }, [email, name]);

    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && showQuestionnaireDialog > 0) {
          // If dialog is closing and was previously shown via the button click
          setTimeout(() => {
            setShowQuestionnaireDialog(0);
          }, 500); // Small delay to ensure dialog is closed
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">AI Profile Recommendations</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              <div className="flex items-center gap-2 text-black mb-2">
                <Mail className="h-5 w-5" />
                <span>We will share your report to your email</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <>
              {!emailSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={emailError ? "border-destructive" : ""}
                      />
                      {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                    </div>

                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="py-6">
                  <h2 className="text-lg font-medium mb-4">
                    Would you like to get more AI recommendations to up-skill your profile?
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-15 text-lg text-center hover:bg-green-400 hover:text-primary-foreground transition-all"
                      onClick={() => handleResponse("yes")}
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Yes
                    </Button>

                    <Button
                      variant="outline"
                      className="h-15 text-lg hover:bg-destructive hover:text-destructive-foreground transition-all"
                      onClick={() => handleResponse("no")}
                    >
                      <X className="mr-2 h-5 w-5" />
                      No
                    </Button>
                  </div>
                </div>
              )}

              <DialogFooter className="sm:justify-start">
                <div className="text-xs text-muted-foreground">
                  Your preferences will be saved to provide you with a personalized experience.
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="py-10 text-center">
              <div className="text-xl font-medium mb-2">Thank you for your response!</div>
              <p className="text-muted-foreground">
                {response === "yes"
                  ? `We'll send AI recommendations to ${email} to help up-skill your profile.`
                  : `We've noted your preference and will send your report to ${email}.`}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <section className="w-full py-6 md:py-12 bg-white px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Profile Info */}
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-gray-500">{currentRole}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="break-all">{email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Contact</div>
                  <div>{phone}</div>
                </div>
              </div>
            </div>
            
            {/* AI Score Card - Made responsive */}
            <div className="mt-8 rounded-2xl bg-gray-100 p-6 w-full max-w-xs mx-auto sm:mx-0">
              <div className="flex flex-col items-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center mt-3">
                      <div className="text-4xl font-semi-bold mb-2">{aiScore.Total}</div>
                      <div className="text-center font-bold">AI Score - {aiScore.Assessment}</div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <path
                      d="M 10,50 A 40,40 0 0,1 90,50"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />

                    <path
                      d="M 10,50 A 40,40 0 0,1 90,50"
                      fill="none"
                      stroke="#0066ff"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 - ((aiScore.Total / 100) * 125.6)}
                      transform="rotate(0 50 50)"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Skills Bars - Made responsive */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="min-w-20">
                  <span>Soft Skills</span>
                </div>
                <div className="h-3 w-full sm:w-60 md:w-80 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-blue-800" style={{ width: `${softSkillsScore}%` }}> </div>
                </div>
                <p className="font-semibold text-sm">{softSkillsScore}%</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="min-w-20">
                  <span>Technical Skills</span>
                </div>
                <div className="h-3 w-full sm:w-60 md:w-80 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-blue-800" style={{ width: `${technicalSkillsScore}%` }}></div>
                </div>
                <p className="font-semibold text-sm">{technicalSkillsScore}%</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="min-w-20">
                  <span>Relevance</span>
                </div>
                <div className="h-3 w-full sm:w-60 md:w-80 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-blue-800" style={{ width: `${relevanceScore}%` }}></div>
                </div>
                <p className="font-semibold text-sm">{relevanceScore}%</p>
              </div>
            </div>
            
            {/* Article Box - Made responsive */}
            <div className="mt-8 rounded-lg bg-gray-0 border-2 border-gray-200 p-4 w-full max-w-lg space-y-5">
              <div className="font-semibold text-lg flex gap-2 items-center">
                <Newspaper className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>Relevant Article Links</span>
              </div>
              <div className="break-words">
                {Article.Title}
              </div>
              <span className="flex justify-between text-blue-500">
                <Link href={Article.Link} className="flex gap-2 items-center">
                  <p>Read Full Article Here</p>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </span>
            </div>
          </div>

          {/* Right Column - Profile Details with download & share buttons */}
          <div className="relative max-w-full mx-auto">
  {/* Action buttons - fixed position relative to card */}
  <div className="absolute md:top-14 md:right-4 flex space-x-2 z-10">
    <button
      onClick={() => {
        setShowQuestionnaireDialog(1);
        download();
      }}
      className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
    >
      <Download className="h-4 w-4" />
    </button>
    <button
      onClick={shareOnLinkedIn}
      className="flex items-center gap-1 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200 transition-colors"
    >
      <Linkedin className="h-4 w-4" />
    </button>
  </div>

  {/* Profile card with consistent styling */}
  <div
    ref={rightProfileRef}
    className="bg-gradient-to-br from-blue-50 from-20% to-pink-100 rounded-xl shadow-sm mt-10 overflow-hidden w-full"
  >
    {/* Top section with personal info */}
    <div className="rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-gray-200">
      {/* Left column - personal details */}
      <div>
        <h1 className="text-2xl font-semibold">{name || "Anonymous"}</h1>

        <div className="mt-4">
          <div className="font-semibold mb-2">{experience[0].Role || "No role data available"}</div>
          <div>{experience[0].Company || education[0].Institution || "No company data available"}</div>
        </div>
        
        <div className="mt-4">
          <div className="font-semibold mb-2">{education[0].Degree || "Computer Science Student"}</div>
          <div>{education[0].Institution || "University"}</div>
        </div>
        {currentAutomated && (
          <div className="mt-5 md:mt-10">
            <h2 className="mb-4 text-lg font-semibold text-gray-400">Current AI exposure</h2>
            <div className="rounded-lg">
              <ul className="list-disc space-y-2 md:space-y-4 font-semibold text-gray-900 ">
              Your role is {currentAutomated}% automatable today
              </ul>
            </div>
          </div>
        )}
        {timelinePrediction && (
          <div className="mt-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-400">Future timeline</h2>
            <div className="rounded-lg">
              <ul className="list-disc space-y-2 md:space-y-4 font-semibold text-gray-900 ">
              By {timelinePrediction}, {PercentageOfWorkAutomable}% of tasks will be replaced or enhanced by AI.
              </ul>
            </div>
          </div>
        )}
 
      </div>
      
      {/* Right column - skills and superpowers */}
      <div className="mt-2 md:mt-11">
        {superpowers && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-400">Superpowers</h2>
            <div className="rounded-lg">
              <ul className="list-disc space-y-2 md:space-y-4 font-semibold text-gray-900 ">
                {superpowers}
              </ul>
            </div>
          </div>
        )}
        
        <div className="text-lg font-medium text-gray-400 mt-4 md:mt-8">Top Skills</div>
        <div className="mt-3">
          {topSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill:any, index:number) => (
                <div
                  key={index}
                  className="text-gray-900 font-semibold px-1 rounded-full"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Achievements section */}
    <div className="px-6 pt-3 md:pt-6 pb-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-400">Best Achievements</h2>
      <div className="rounded-lg">
        <div className="space-y-2 font-semibold text-black">
          <p>{bestAchievements}</p>
        </div>
      </div>
    </div>
    
    {/* Tools section */}
    <div className="px-6 pb-6">
      <div className="mb-2 md:mb-4 text-lg font-semibold text-gray-400">Tools</div>
      <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
        {tools.slice(0, 10).map((skill:any, i:number) => (
          <div key={i} className="rounded font-semibold text-gray-900 py-1">
            {String(skill).split('(')[0].trim()}
          </div>
        ))}
      </div>
    </div>
    
    {/* Footer */}
    <div className="text-center px-6 pb-3 md:pb-6">
      Get your profile analysis at
      <Link href="https://scan.theknowai.com/">
        <span className="font-bold"> scan.knowai.com</span>
      </Link>
    </div>
  </div>
</div>
        </div>
      </div>

      {/* Render the AIQuestionnaireDialog component */}
      <AIQuestionnaireDialog />
    </section>
  );
}