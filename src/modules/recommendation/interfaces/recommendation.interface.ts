export interface ContentRecommendation {
  id: string;
  title: string;
  type: string;
  mood: string;
  intensity: number;
  confidence: number;
  reason: string;
}

export interface MoodContentMapping {
  [mood: string]: {
    preferredContentTypes: string[];
    intensityThresholds: {
      [contentType: string]: {
        minIntensity: number;
        maxIntensity: number;
        priority: number;
      };
    };
  };
}