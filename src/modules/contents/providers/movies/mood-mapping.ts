// TMDB Genre IDs mapping
export const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

// Mood to genre mapping based on emotional impact
export const moodToGenreMap: Record<
  string,
  { genres: number[]; effect: string }
> = {
  // Positive moods
  happy: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.MUSIC],
    effect: 'uplifting',
  },
  excited: {
    genres: [TMDB_GENRES.ACTION, TMDB_GENRES.ADVENTURE, TMDB_GENRES.COMEDY],
    effect: 'energizing',
  },
  inspired: {
    genres: [TMDB_GENRES.DRAMA, TMDB_GENRES.DOCUMENTARY, TMDB_GENRES.HISTORY],
    effect: 'motivating',
  },
  peaceful: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.FANTASY, TMDB_GENRES.MUSIC],
    effect: 'calming',
  },

  // Negative moods
  sad: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.DRAMA],
    effect: 'comforting',
  },
  moody: {
    genres: [TMDB_GENRES.DRAMA, TMDB_GENRES.MYSTERY, TMDB_GENRES.THRILLER],
    effect: 'reflective',
  },
  anxious: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.FANTASY, TMDB_GENRES.DRAMA],
    effect: 'calming',
  },
  stressed: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.ANIMATION, TMDB_GENRES.FANTASY],
    effect: 'relaxing',
  },
  bored: {
    genres: [TMDB_GENRES.ACTION, TMDB_GENRES.ADVENTURE, TMDB_GENRES.COMEDY],
    effect: 'exciting',
  },
  lonely: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.ROMANCE],
    effect: 'connecting',
  },
  angry: {
    genres: [TMDB_GENRES.ACTION, TMDB_GENRES.COMEDY, TMDB_GENRES.MUSIC],
    effect: 'releasing',
  },
  tired: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.COMEDY, TMDB_GENRES.FANTASY],
    effect: 'relaxing',
  },
  confused: {
    genres: [
      TMDB_GENRES.DRAMA,
      TMDB_GENRES.MYSTERY,
      TMDB_GENRES.SCIENCE_FICTION,
    ],
    effect: 'clarifying',
  },
  scared: {
    genres: [TMDB_GENRES.HORROR, TMDB_GENRES.THRILLER, TMDB_GENRES.MYSTERY],
    effect: 'thrilling',
  },
};

// TMDB API parameters for different emotional effects
export const emotionalImpactParams: Record<string, any> = {
  uplifting: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  energizing: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  motivating: {
    sort_by: 'vote_average.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  calming: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  comforting: {
    sort_by: 'vote_average.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  reflective: {
    sort_by: 'vote_average.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  relaxing: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  exciting: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  connecting: {
    sort_by: 'vote_average.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  releasing: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  clarifying: {
    sort_by: 'vote_average.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
  thrilling: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6,
    'vote_count.gte': 500,
    with_original_language: 'en',
  },
};

export const moodToKeywordMap: Record<string, number[]> = {
  happy: [1741, 1742],
  sad: [1743, 1744],
  excited: [1745, 1746],
  relaxed: [1747, 1748],
  scared: [1749, 1750],
  inspired: [1751, 1752],
};
