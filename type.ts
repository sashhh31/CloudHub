export interface ProfileData {
    BasicProfileInformation?: {
      Name?: string;
      CurrentRole?: string;
      Company?: string;
    };
    AIScore?: number;
    SkillsAssessment?: {
      SoftSkills?: string;
      TechnicalSkills?: string;
      Relevance?: string;
    };
    CareerTrajectoryAnalysis?: string;
    Strengths?: Record<string, string>;
    SkillGaps?: string[];
    RecommendedCoursesOrSkillsToDevelop?: string[];
    RemarksAboutProfile?: string;
    AIImpactAssessment?: string;
  }
  
  export interface LegacyProfileData {
    "Basic profile information"?: {
      Name?: string;
      CurrentRole?: string;
      Company?: string;
    };
    "AI Score"?: number;
    "Skills assessment"?: {
      SoftSkills?: string[];
      TechnicalSkills?: string[];
    };
    "Career trajectory analysis"?: string;
    "Strengths"?: Record<string, string>;
    "Skill gaps"?: string[];
    "Recommended courses or skills to develop"?: string[];
    "Remarks about the profile"?: string;
    "AI impact assessment"?: string;
  }