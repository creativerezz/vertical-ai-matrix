export interface OpportunityData {
  opportunityTitle: string;
  painPoint: string;
  agentSolution: string;
  targetUser: string;
  impact: string;
  whyNow: string;
}

export interface MarketResearchData {
  text: string | undefined;
  sources: any[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const INDUSTRIES = [
  "Healthcare",
  "Financial Services",
  "Manufacturing",
  "Legal",
  "Media & Ent.",
  "Retail / E-comm",
  "Education",
  "Logistics"
];

export const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Customer Support",
  "HR / Recruiting",
  "Operations",
  "Engineering",
  "Finance / Accounting",
  "Legal / Compliance"
];
