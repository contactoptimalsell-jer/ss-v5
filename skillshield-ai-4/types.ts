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

export interface AuditResult {
  analysis: string;
  suggestions: AuditSuggestion[];
  benchmark?: BenchmarkData;
}

export enum SectionId {
  HERO = 'hero',
  PROBLEM = 'problem',
  APPROACH = 'approach',
  AUDIT_TOOL = 'audit-tool',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq'
}

export type PageView = 'home' | 'about' | 'virtual-employees' | 'upload-photos';