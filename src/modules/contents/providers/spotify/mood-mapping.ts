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
  inspired: {
    genres: ['indie', 'folk', 'singer-songwriter'],
    effect: 'moderate',
  },
  moody: {
    genres: ['indie', 'alternative', 'soul'],
    effect: 'moderate',
  },
  stressed: {
    genres: ['ambient', 'classical', 'meditation'],
    effect: 'calm',
  },
  bored: {
    genres: ['electronic', 'dance', 'pop'],
    effect: 'energetic',
  },
  lonely: {
    genres: ['indie', 'folk', 'singer-songwriter'],
    effect: 'moderate',
  },
  tired: {
    genres: ['ambient', 'classical', 'lofi'],
    effect: 'calm',
  },
  confused: {
    genres: ['ambient', 'experimental', 'classical'],
    effect: 'moderate',
  },
  scared: {
    genres: ['ambient', 'classical', 'dark-ambient'],
    effect: 'calm',
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
