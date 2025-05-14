export const moodToGenreMap: Record<
  string,
  { genres: string[]; effect: string }
> = {
  happy: {
    genres: ['pop', 'dance', 'disco'],
    effect: 'energetic',
  },
  sad: {
    genres: ['indie', 'pop', 'folk'],
    effect: 'moderate',
  },
  angry: {
    genres: ['classical', 'ambient', 'jazz'],
    effect: 'calm',
  },
  anxious: {
    genres: ['ambient', 'classical', 'jazz'],
    effect: 'calm',
  },
  excited: {
    genres: ['electronic', 'dance', 'house'],
    effect: 'energetic',
  },
  relaxed: {
    genres: ['jazz', 'ambient', 'classical'],
    effect: 'calm',
  },
  romantic: {
    genres: ['r-n-b', 'soul', 'pop'],
    effect: 'moderate',
  },
  nostalgic: {
    genres: ['rock', 'pop', 'indie'],
    effect: 'moderate',
  },
  focused: {
    genres: ['classical', 'ambient', 'jazz'],
    effect: 'moderate',
  },
  energetic: {
    genres: ['electronic', 'dance', 'rock'],
    effect: 'energetic',
  },
};

export const emotionalImpactParams: Record<string, Record<string, number>> = {
  energetic: {
    min_energy: 0.6,
    min_valence: 0.5,
  },
  calm: {
    max_energy: 0.5,
  },
  moderate: {
    min_energy: 0.3,
    max_energy: 0.7,
  },
};
