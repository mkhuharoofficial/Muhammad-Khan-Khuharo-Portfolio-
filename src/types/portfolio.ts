export type CertificateCategory =
  | 'Python & Programming'
  | 'Mathematics & Computer Science'
  | 'Artificial Intelligence & Machine Learning'
  | 'IT & Cybersecurity'
  | 'English Language & Communication';

export type FilePreviewType = 'image' | 'pdf' | '';

export interface PortfolioProfile {
  fullName: string;
  location: string;
  tagline: string;
  headline: string;
  animatedTitles: string[];
  heroDescription: string;
  introduction: string[];
  aboutParagraphs: string[];
  portraitUrl: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface EducationItem {
  id: string;
  period: string;
  title: string;
  institution: string;
}

export interface OnlineCourseCertificate {
  id: string;
  category: CertificateCategory;
  categoryCode: 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
  title: string;
  institution: string;
  year: string;
  verificationUrl: string;
  certificateFileUrl?: string;
  certificateFileType?: FilePreviewType;
}

export interface ProjectItem {
  id: string;
  title: string;
  year: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  position: string;
  organization: string;
  period: string;
  description: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  isSteamCompetition?: boolean;
  certificateFileUrl?: string;
  certificateFileType?: FilePreviewType;
}

export interface OtherQualificationItem {
  id: string;
  title: string;
  institution: string;
  issuedBy?: string;
  year: string;
  certificateFileUrl?: string;
  certificateFileType?: FilePreviewType;
}

export type SkillCategory =
  | 'Programming'
  | 'AI & Machine Learning'
  | 'Web Development'
  | 'Other';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  topic: string;
  publishedAt: string;
  status: 'published' | 'draft';
  coverImageUrl?: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  education: EducationItem[];
  onlineCourses: OnlineCourseCertificate[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  awards: AwardItem[];
  otherQualifications: OtherQualificationItem[];
  skills: SkillItem[];
  blogPosts: BlogPost[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  updated_at: string;
  homepage: string | null;
  fork: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  emailDelivered: boolean;
}
