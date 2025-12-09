export interface AuditSuggestion {
  title: string;
  description: string;
  timeSaved: string;
  difficulty: 'Facile' | 'Moyen' | 'Complexe';
}

export interface AuditResult {
  analysis: string;
  suggestions: AuditSuggestion[];
}

export enum SectionId {
  HERO = 'hero',
  PROBLEM = 'problem',
  APPROACH = 'approach',
  AUDIT_TOOL = 'audit-tool',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq'
}

export type PageView = 'home' | 'about' | 'virtual-employees';