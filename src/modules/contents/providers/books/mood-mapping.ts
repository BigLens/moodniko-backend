export const moodToGenreMap: Record<string, { genres: string[] }> = {
  happy: {
    genres: ['humor', 'comedy', 'uplifting', 'feel-good', 'inspiration'],
  },
  sad: {
    genres: ['self-help', 'healing', 'comfort', 'hope', 'inspiration'],
  },
  angry: {
    genres: ['self-help', 'anger management', 'mindfulness', 'calming'],
  },
  anxious: {
    genres: ['anxiety relief', 'meditation', 'mindfulness', 'self-help'],
  },
  excited: {
    genres: ['adventure', 'thriller', 'action', 'inspiration'],
  },
  relaxed: {
    genres: ['meditation', 'mindfulness', 'nature', 'poetry'],
  },
  romantic: {
    genres: ['romance', 'love stories', 'relationships'],
  },
  nostalgic: {
    genres: ['memoir', 'biography', 'historical fiction'],
  },
  motivated: {
    genres: ['self-help', 'motivation', 'success', 'inspiration'],
  },
  peaceful: {
    genres: ['meditation', 'mindfulness', 'spirituality', 'nature'],
  },
};
