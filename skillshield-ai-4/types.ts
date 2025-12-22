export interface AuditSuggestion {
  title: string;
  description: string;
  timeSaved: string;
  difficulty: 'Facile' | 'Moyen' | 'Complexe';
}

export interface BenchmarkData {
  automatedProcessesPercentage: number;
  averageTimeSavedPerTask: string;
  averageROI: string;
  paybackPeriod: string;
  sectorAverage: string;
}

export interface VisualizationData {
  timeGainBySolution: {
    name: string;
    hoursPerWeek: number;
    difficulty: 'Facile' | 'Moyen' | 'Complexe';
  }[];
  impactByCategory: {
    category: string;
    currentTime: number;
    automatedTime: number;
    gainPercentage: number;
  }[];
  roiProjection: {
    month: number;
    cumulativeROI: number;
    investment: number;
  }[];
  automationPotential: {
    task: string;
    automationLevel: number; // 0-100
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface AuditResult {
  analysis: string;
  suggestions: AuditSuggestion[];
  benchmark?: BenchmarkData;
  visualization?: VisualizationData;
}

export enum SectionId {
  HERO = 'hero',
  PROBLEM = 'problem',
  APPROACH = 'approach',
  AUDIT_TOOL = 'audit-tool',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq'
}

export type PageView = 'home' | 'about' | 'virtual-employees' | 'upload-photos' | 'prospection' | 'quiz' | 'quiz-with-token' | 'terms' | 'faq' | 'blog' | 'case-studies' | 'press';