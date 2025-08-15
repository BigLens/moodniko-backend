export interface MoodPattern {
  mood: string;
  frequency: number;
  averageIntensity: number;
  commonTriggers: string[];
  timeOfDay: string;
  dayOfWeek: string;
  averageDuration: number;
}

export interface MoodTrend {
  period: string;
  averageMood: string;
  moodStability: number;
  intensityTrend: 'increasing' | 'decreasing' | 'stable';
  topMoods: Array<{ mood: string; count: number }>;
}

export interface MoodAnalysis {
  totalEntries: number;
  dateRange: { start: Date; end: Date };
  patterns: MoodPattern[];
  trends: MoodTrend[];
  recommendations: string[];
}
