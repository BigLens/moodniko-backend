import { InteractionType } from '@modules/contents/save_contents/enum/interaction-type.enum';

export { InteractionType };

export interface TrackInteractionDto {
  userId: number;
  contentId: string;
  interactionType: InteractionType;
  interactionValue?: number;
  moodAtInteraction?: string;
  moodIntensityAtInteraction?: number;
  interactionDurationSeconds?: number;
  context?: string;
  notes?: string;
}

export interface InteractionHistoryQueryDto {
  limit?: number;
  offset?: number;
  interactionType?: InteractionType;
  startDate?: string;
  endDate?: string;
}

export interface InteractionPattern {
  mostCommonType: InteractionType;
  averageDuration: number;
  moodCorrelation: number;
  timeOfDayPattern: string;
  contentTypePreference: string;
}

export interface InteractionAnalysis {
  totalInteractions: number;
  dateRange: {
    start: string;
    end: string;
  };
  patterns: InteractionPattern;
  trends: {
    interactionFrequency: 'increasing' | 'decreasing' | 'stable';
    moodCorrelation: 'positive' | 'negative' | 'neutral';
  };
}

export interface ExportQueryDto {
  format: 'json' | 'csv';
  startDate?: string;
  endDate?: string;
  includeMoodData?: boolean;
}
