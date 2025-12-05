
export type EntityType = 'INVESTOR' | 'ADVISOR' | 'LEGAL';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  location: string;
  focusAreas: string[];
  minCheckSize?: string;
  maxCheckSize?: string;
  contactEmail: string;
  website: string;
  rating: number; // 1-5
  aum?: string; // Assets Under Management
  dealCount?: number; // Number of deals made
}

export type DealStage = string; // Changed from union type to string to allow dynamic sections

export interface DealDocument {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  type: string;
}

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  revenue: string;
  ebitda: string;
  stage: DealStage;
  documents: DealDocument[];
  description: string;
  notes: string;
}

// New Interface for Network Deal Flow
export interface NetworkDeal {
  id: string;
  title: string;
  type: 'M&A' | 'Company Round' | 'Trade Finance' | 'Project Finance';
  amount: string;
  sector: string;
  description: string;
  postedDate: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  tags: string[];
}

export interface GeminiMatchResult {
  entityId: string;
  score: number;
  rationale: string;
}

// AI Matching Profile
export interface MatchingProfile {
  companyName: string;
  industry: string;
  location: string;
  raiseAmount: number;
  stage: string;
  description: string; // Executive summary or pitch deck text
  deckFileName?: string;
}

// Portfolio / Fund Manager Types

export interface CompanyGoal {
  id: string;
  title: string;
  deadline: string;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Delayed';
  progress: number; // 0-100
}

export interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  vintage: string; // Investment Year
  investmentDate: string;
  initialInvestment: number; // in millions
  currentValue: number; // in millions
  ownershipPercentage: number;
  moic: number; // Multiple on Invested Capital
  irr: number; // Internal Rate of Return
  status: 'Active' | 'Exited' | 'Write-off';
  boardSeat: boolean;
  lastValuationDate: string;
  
  // New fields for deep management
  revenue: string; // Current Annual Revenue
  ebitda: string; // Current EBITDA
  documents: DealDocument[];
  goals: CompanyGoal[];
}

export interface FundMetrics {
  aum: number; // Total AUM
  deployedCapital: number;
  tvpi: number; // Total Value to Paid-In
  dpi: number; // Distributions to Paid-In
  netIrr: number;
  activeCompanies: number;
}
