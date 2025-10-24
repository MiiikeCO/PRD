
export interface ProductData {
  projectName: string;
  description: string;
  targetAudience: string;
  problemToSolve: string;
  features: string;
}

export interface FullProductData extends ProductData {
  platform: string;
}

export interface PlatformRecommendation {
  platform: string;
  justification: string;
}

export interface Ticket {
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export interface AIPrompt {
  ticketTitle: string;
  generationPrompt: string;
}

export interface GeneratedContent {
  platform: PlatformRecommendation | null;
  prd: string | null;
  tickets: Ticket[] | null;
  prompts: AIPrompt[] | null;
}
