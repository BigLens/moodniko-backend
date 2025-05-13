export const moodToGenreMap: Record<
  string,
  { genres: string[]; effect: string }
> = {
  happy: {
    genres: ['happy', 'pop', 'dance', 'disco', 'summer', 'party'],
    effect: 'energetic',
  },
  sad: {
    genres: [
      'uplifting',
      'inspirational',
      'motivational',
      'positive',
      'self-help',
      'mental-health',
    ],
    effect: 'moderate',
  },
  angry: {
    genres: [
      'calm',
      'meditation',
      'ambient',
      'nature',
      'classical',
      'mindfulness',
    ],
    effect: 'calm',
  },
  anxious: {
    genres: [
      'ambient',
      'classical',
      'meditation',
      'nature',
      'sleep',
      'relaxation',
    ],
    effect: 'calm',
  },
  excited: {
    genres: ['electronic', 'dance', 'house', 'techno', 'party', 'work-out'],
    effect: 'energetic',
  },
  relaxed: {
    genres: ['jazz', 'lofi', 'chill', 'ambient', 'meditation', 'nature'],
    effect: 'calm',
  },
  romantic: {
    genres: ['romance', 'r-n-b', 'soul', 'love', 'romantic', 'ballad'],
    effect: 'moderate',
  },
  nostalgic: {
    genres: ['classic', 'retro', 'oldies', 'folk', 'nostalgia', 'vintage'],
    effect: 'moderate',
  },
  focused: {
    genres: [
      'focus',
      'classical',
      'instrumental',
      'ambient',
      'study',
      'concentration',
    ],
    effect: 'moderate',
  },
  energetic: {
    genres: [
      'work-out',
      'electronic',
      'dance',
      'rock',
      'fitness',
      'motivation',
    ],
    effect: 'energetic',
  },
};

export const emotionalImpactParams: Record<string, Record<string, number>> = {
  energetic: {
    min_energy: 0.7,
    min_valence: 0.6,
    min_popularity: 50,
  },
  calm: {
    max_energy: 0.4,
    max_tempo: 100,
    min_popularity: 30,
  },
  intense: {
    min_energy: 0.8,
    min_loudness: -10,
    min_popularity: 40,
  },
  moderate: {
    min_energy: 0.4,
    max_energy: 0.7,
    min_popularity: 30,
  },
};
