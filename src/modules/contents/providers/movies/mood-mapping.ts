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
    genres: [TMDB_GENRES.DRAMA, TMDB_GENRES.FAMILY, TMDB_GENRES.COMEDY],
    effect: 'motivating',
  },
  peaceful: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.FANTASY, TMDB_GENRES.MUSIC],
    effect: 'calming',
  },

  // Negative moods - mapped to genres that help achieve better emotional state
  sad: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.MUSIC],
    effect: 'uplifting',
  },
  moody: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.MUSIC],
    effect: 'uplifting',
  },
  anxious: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.FAMILY, TMDB_GENRES.COMEDY],
    effect: 'calming',
  },
  stressed: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.FAMILY, TMDB_GENRES.COMEDY],
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
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.FAMILY, TMDB_GENRES.COMEDY],
    effect: 'calming',
  },
  tired: {
    genres: [TMDB_GENRES.ANIMATION, TMDB_GENRES.COMEDY, TMDB_GENRES.FANTASY],
    effect: 'relaxing',
  },
  confused: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.DRAMA],
    effect: 'clarifying',
  },
  scared: {
    genres: [TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.ANIMATION],
    effect: 'comforting',
  },
};

// TMDB API parameters for different emotional effects
export const emotionalImpactParams: Record<string, any> = {
  uplifting: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  energizing: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  motivating: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  calming: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  comforting: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  reflective: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  relaxing: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  exciting: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  connecting: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  releasing: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  clarifying: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
  thrilling: {
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0,
    'vote_count.gte': 300,
    with_original_language: 'en',
  },
};